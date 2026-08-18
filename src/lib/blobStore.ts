import { put, head } from '@vercel/blob';

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

// ── Fájlfeltöltés (VIP ajánlat PDF/kép, VIP gyorskérés fotó/hang) ──────────
// A korábbi Supabase Storage 'public' bucket-tel megegyező biztonsági
// szinten: publikus, de véletlenszerű (nem kitalálható) elérési útvonalú URL
// — pontosan úgy, ahogy korábban a getPublicUrl() is működött.
export async function uploadPublicFile(
  pathnamePrefix: string,
  fileName: string,
  bytes: Uint8Array,
  contentType: string,
): Promise<string> {
  const blob = await put(`${pathnamePrefix}/${fileName}`, Buffer.from(bytes), {
    access: 'public',
    addRandomSuffix: true,
    contentType,
  });
  return blob.url;
}
