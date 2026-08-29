import { NextResponse } from 'next/server';
import { insertOne, isBlobConfigured } from '@/lib/blobStore';
import { allowRequest, rateLimited } from '@/lib/security';

interface ChatRecord {
  id: string;
  created_at: string;
  nev: string | null;
  telefon: string | null;
  status: string;
  last_message_at: string;
}

// Publikus végpont — a látogató indít egy chat-fejet (id-t a kliens generálja,
// hogy ne kelljen admin-jogosultság a visszaolvasáshoz).
export async function POST(request: Request) {
  if (!allowRequest(request, 'public-form', 8, 10 * 60 * 1000)) return rateLimited();
  if (!isBlobConfigured()) return NextResponse.json({ ok: false }, { status: 503 });

  const { id, nev, telefon } = await request.json().catch(() => ({}));
  if (typeof id !== 'string' || !id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const now = new Date().toISOString();
  try {
    await insertOne<ChatRecord>('chats', {
      id,
      created_at: now,
      nev: typeof nev === 'string' ? nev.trim() || null : null,
      telefon: typeof telefon === 'string' ? telefon.trim() || null : null,
      status: 'open',
      last_message_at: now,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
