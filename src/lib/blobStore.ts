import { put, head, get } from '@vercel/blob';

// Kis, függőségmentes JSON-kollekció-tár Vercel Blob felett — a Supabase
// helyett (2026-08-18: a projekt teljes egészében Supabase-mentesre állt át,
// lásd CLAUDE.md). Minden kollekció egy PRIVÁT JSON blob (data/<name>.json):
// olvasás előtt letöltjük, írás előtt teljes egészében felülírjuk.
//
// Tudatos korlát: kis forgalmú, egy admin által kezelt panelhez való — nincs
// tranzakció, konkurens írásnál az utolsó ír nyer. Egy villamossági szaküzlet
// napi lead/anyaglista forgalmánál ez elhanyagolható kockázat; ha ez valaha
// szűk keresztmetszet lenne, akkor kellene csak valódi DB-re váltani.

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export function isBlobConfigured(): boolean {
  return !!TOKEN;
}

async function readCollection<T>(name: string): Promise<T[]> {
  if (!TOKEN) return [];
  try {
    const meta = await head(`data/${name}.json`);
    const res = await fetch(meta.url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const text = await res.text();
    return text ? (JSON.parse(text) as T[]) : [];
  } catch {
    // Első futáskor a blob még nem létezik (BlobNotFoundError) — üres lista.
    return [];
  }
}

async function writeCollection<T>(name: string, items: T[]): Promise<void> {
  await put(`data/${name}.json`, JSON.stringify(items), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

export async function getAll<T>(collection: string): Promise<T[]> {
  return readCollection<T>(collection);
}

export async function insertOne<T extends { id: string }>(collection: string, item: T): Promise<T> {
  const items = await readCollection<T>(collection);
  items.unshift(item);
  await writeCollection(collection, items);
  return item;
}

export async function updateOne<T extends { id: string }>(
  collection: string,
  id: string,
  patch: Partial<T>,
): Promise<boolean> {
  const items = await readCollection<T>(collection);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  items[idx] = { ...items[idx], ...patch };
  await writeCollection(collection, items);
  return true;
}

export async function deleteOne(collection: string, id: string): Promise<boolean> {
  const items = await readCollection<{ id: string }>(collection);
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) return false;
  await writeCollection(collection, next);
  return true;
}

export async function countWhere<T>(collection: string, pred: (item: T) => boolean): Promise<number> {
  const items = await readCollection<T>(collection);
  return items.filter(pred).length;
}

// ── Analytics perzisztens tárolás Vercel Blob-ban ────────────────────────
export interface AnalyticsEvent {
  event: string;
  data?: Record<string, unknown>;
  sessionId: string;
  timestamp: number;
  pathname?: string;
  referrer?: string;
}

async function readAnalytics(): Promise<AnalyticsEvent[]> {
  if (!TOKEN) return [];
  try {
    const meta = await head('data/analytics.json');
    const res = await fetch(meta.url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const text = await res.text();
    return text ? (JSON.parse(text) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

async function writeAnalytics(events: AnalyticsEvent[]): Promise<void> {
  await put('data/analytics.json', JSON.stringify(events), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

export async function getAnalyticsEvents(sinceMs?: number): Promise<AnalyticsEvent[]> {
  const events = await readAnalytics();
  if (!sinceMs) return events;
  return events.filter(e => e.timestamp >= sinceMs);
}

export async function appendAnalyticsEvents(newEvents: AnalyticsEvent[]): Promise<void> {
  if (!newEvents.length) return;
  const existing = await readAnalytics();
  const merged = [...existing, ...newEvents];
  // Keep last 50k events to prevent unbounded growth
  const trimmed = merged.slice(-50000);
  await writeAnalytics(trimmed);
}

// ── Fájlfeltöltés (hírkép, VIP ajánlat, VIP gyorskérés fotó/hang) ─────────
// A store PRIVÁT (`access: 'public'` 400-at ad). A fájl a blobban marad,
// a böngésző a `/api/media/...` proxyn át kapja — véletlen suffix, nem
// kitalálható útvonal (ugyanaz a szint, mint a régi public URL).
const MEDIA_PREFIXES = ['notices/', 'vip-offers/', 'vip-requests/'] as const;

export function isAllowedMediaPath(pathname: string): boolean {
  if (!pathname || pathname.includes('..') || pathname.includes('\\')) return false;
  if (!MEDIA_PREFIXES.some((p) => pathname.startsWith(p))) return false;
  const rest = pathname.slice(pathname.indexOf('/') + 1);
  return rest.length > 0 && !rest.includes('/');
}

function toMediaUrl(pathname: string): string {
  return `/api/media/${pathname.split('/').filter(Boolean).map(encodeURIComponent).join('/')}`;
}

export async function uploadPublicFile(
  pathnamePrefix: string,
  fileName: string,
  bytes: Uint8Array,
  contentType: string,
): Promise<string> {
  const blob = await put(`${pathnamePrefix}/${fileName}`, Buffer.from(bytes), {
    access: 'private',
    addRandomSuffix: true,
    contentType,
  });
  return toMediaUrl(blob.pathname);
}

export async function streamPrivateMedia(pathname: string): Promise<{
  stream: ReadableStream<Uint8Array>;
  contentType: string;
} | null> {
  if (!TOKEN || !isAllowedMediaPath(pathname)) return null;
  const result = await get(pathname, { access: 'private' });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  return { stream: result.stream, contentType: result.blob.contentType || 'application/octet-stream' };
}
