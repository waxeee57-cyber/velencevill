import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getAll, updateOne, deleteOne, isBlobConfigured } from '@/lib/blobStore';

interface CallbackRecord {
  id: string;
  created_at: string;
  telefon: string;
  nev: string | null;
  preferred_time: string | null;
  uzenet: string | null;
  statusz: string;
  called_at: string | null;
  notes: string | null;
}

function authed(request: Request): boolean {
  const auth = request.headers.get('authorization') ?? '';
  return verifyAdminToken(auth.startsWith('Bearer ') ? auth.slice(7) : '');
}

const NO_STORE = { error: 'A tároló nincs beállítva (BLOB_READ_WRITE_TOKEN).' };

export async function GET(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const callbacks = (await getAll<CallbackRecord>('callback_requests'))
    .slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 500);
  return NextResponse.json({ callbacks });
}

export async function PATCH(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const { id, statusz, notes } = await request.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const updates: Partial<CallbackRecord> = {};
  if (typeof statusz === 'string') {
    updates.statusz = statusz;
    if (statusz === 'hivva') updates.called_at = new Date().toISOString();
  }
  if (typeof notes === 'string') updates.notes = notes;
  if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'Nincs módosítandó mező' }, { status: 400 });

  const ok = await updateOne<CallbackRecord>('callback_requests', id, updates);
  if (!ok) return NextResponse.json({ error: 'Nem található' }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const ok = await deleteOne('callback_requests', id);
  if (!ok) return NextResponse.json({ error: 'Nem található' }, { status: 404 });
  return NextResponse.json({ success: true });
}
