import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getAll, updateOne, deleteOne, isBlobConfigured } from '@/lib/blobStore';

interface VipRequestRecord {
  id: string;
  created_at: string;
  nev: string;
  telefon: string;
  uzenet: string | null;
  kep_url: string | null;
  hang_url: string | null;
  statusz: string;
}

function authed(request: Request): boolean {
  const auth = request.headers.get('authorization') ?? '';
  return verifyAdminToken(auth.startsWith('Bearer ') ? auth.slice(7) : '');
}

const NO_STORE = { error: 'A tároló nincs beállítva (BLOB_READ_WRITE_TOKEN).' };

export async function GET(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const requests = (await getAll<VipRequestRecord>('vip_requests'))
    .slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 500);
  return NextResponse.json({ requests });
}

export async function PATCH(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const { id, statusz } = await request.json().catch(() => ({}));
  if (!id || typeof statusz !== 'string') return NextResponse.json({ error: 'Hiányzó id vagy statusz' }, { status: 400 });

  const ok = await updateOne<VipRequestRecord>('vip_requests', id, { statusz });
  if (!ok) return NextResponse.json({ error: 'Nem található' }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const ok = await deleteOne('vip_requests', id);
  if (!ok) return NextResponse.json({ error: 'Nem található' }, { status: 404 });
  return NextResponse.json({ success: true });
}
