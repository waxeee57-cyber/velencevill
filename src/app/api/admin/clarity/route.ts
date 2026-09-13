import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';

// Microsoft Clarity Data Export API proxy az adminfelületnek.
//
// FONTOS KORLÁT (dokumentált): a Clarity Data Export API napi 10 kérést enged
// projektenként, és csak az utolsó 1/2/3 nap adatát adja vissza
// (429 TooManyRequests a limit felett).
// Ezért szerver oldali, in-memory cache 3 órás TTL-lel (max ~8 hívás/nap), és
// 429/hiba esetén a legutóbbi sikeres választ adjuk vissza `stale: true`
// jelzéssel — így az admin sosem lát üres képernyőt.
//
// Env: CLARITY_API_TOKEN (Clarity → Settings → Data Export → Generate new API token)

export const dynamic = 'force-dynamic';

const CLARITY_ENDPOINT = 'https://www.clarity.ms/export-data/api/v1/project-live-insights';
const TTL_MS = 3 * 60 * 60 * 1000; // 3 óra

type ClarityMetric = { metricName: string; information: Record<string, string | number>[] };

const cache = new Map<string, { at: number; data: ClarityMetric[] }>();

export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  if (!verifyAdminToken(auth.startsWith('Bearer ') ? auth.slice(7) : '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = process.env.CLARITY_API_TOKEN;
  if (!token) {
    return NextResponse.json({ configured: false, error: 'CLARITY_API_TOKEN nincs beállítva.' });
  }

  const url = new URL(request.url);
  const raw = Number(url.searchParams.get('days') ?? '3');
  const days = raw === 1 || raw === 2 || raw === 3 ? raw : 3;
  const dimension = url.searchParams.get('dimension') ?? '';
  const force = url.searchParams.get('force') === '1';

  const key = `${days}|${dimension}`;
  const hit = cache.get(key);
  if (hit && !force && Date.now() - hit.at < TTL_MS) {
    return NextResponse.json({ configured: true, cached: true, fetchedAt: hit.at, days, dimension, metrics: hit.data });
  }

  const api = new URL(CLARITY_ENDPOINT);
  api.searchParams.set('numOfDays', String(days));
  if (dimension) api.searchParams.set('dimension1', dimension);

  try {
    const res = await fetch(api.toString(), {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      if (hit) {
        return NextResponse.json({
          configured: true, cached: true, stale: true, fetchedAt: hit.at, days, dimension,
          metrics: hit.data,
          error: `Clarity API ${res.status} — a legutóbbi mentett adatot mutatjuk.`,
        });
      }
      const msg = res.status === 429
        ? 'Clarity API napi limit (10 kérés/projekt/nap) elérve. Próbáld később.'
        : `Clarity API hiba: ${res.status}${body ? ` — ${body.slice(0, 200)}` : ''}`;
      return NextResponse.json({ configured: true, error: msg });
    }

    const data = (await res.json()) as ClarityMetric[];
    const at = Date.now();
    cache.set(key, { at, data });
    return NextResponse.json({ configured: true, cached: false, fetchedAt: at, days, dimension, metrics: data });
  } catch (e) {
    if (hit) {
      return NextResponse.json({
        configured: true, cached: true, stale: true, fetchedAt: hit.at, days, dimension,
        metrics: hit.data, error: 'Clarity API nem elérhető — mentett adat.',
      });
    }
    return NextResponse.json({
      configured: true,
      error: `Clarity API nem elérhető: ${e instanceof Error ? e.message : 'ismeretlen hiba'}`,
    });
  }
}
