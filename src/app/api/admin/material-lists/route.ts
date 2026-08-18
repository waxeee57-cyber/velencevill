import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getAll, updateOne, deleteOne, isBlobConfigured } from '@/lib/blobStore';

interface TetelInput {
  id: string;
  nev: string;
  kategoria?: string;
  marka?: string;
  mennyiseg: number;
}

interface MaterialListRecord {
  id: string;
  created_at: string;
  nev: string;
  telefon: string;
  megjegyzes: string | null;
  tetelek: TetelInput[];
  statusz: string;
  forras: string;
  kesz_at: string | null;
}

function authed(request: Request): boolean {
  const auth = request.headers.get('authorization') ?? '';
  return verifyAdminToken(auth.startsWith('Bearer ') ? auth.slice(7) : '');
}

const NO_STORE = { error: 'A tároló nincs beállítva (BLOB_READ_WRITE_TOKEN).' };

// Lista
export async function GET(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const lists = (await getAll<MaterialListRecord>('material_lists'))
    .slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 500);
  return NextResponse.json({ lists });
}

// Státusz módosítás
export async function PATCH(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const { id, statusz } = await request.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const updates: Partial<MaterialListRecord> = {};
  if (typeof statusz === 'string') {
    updates.statusz = statusz;
    if (statusz === 'kesz') updates.kesz_at = new Date().toISOString();
  }
  if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'Nincs módosítandó mező' }, { status: 400 });

  const ok = await updateOne<MaterialListRecord>('material_lists', id, updates);
  if (!ok) return NextResponse.json({ error: 'Nem található' }, { status: 404 });
  return NextResponse.json({ success: true });
}

// Törlés
export async function DELETE(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const ok = await deleteOne('material_lists', id);
  if (!ok) return NextResponse.json({ error: 'Nem található' }, { status: 404 });
  return NextResponse.json({ success: true });
}
