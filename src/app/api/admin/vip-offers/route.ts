import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getAll, insertOne, updateOne, deleteOne, isBlobConfigured, uploadPublicFile } from '@/lib/blobStore';

interface VipOfferRecord {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  valid_until: string | null;
  file_url: string | null;
  active: boolean;
}

function authed(request: Request): boolean {
  const auth = request.headers.get('authorization') ?? '';
  return verifyAdminToken(auth.startsWith('Bearer ') ? auth.slice(7) : '');
}

const NO_STORE = { error: 'A tároló nincs beállítva (BLOB_READ_WRITE_TOKEN).' };

// Összes ajánlat (aktív + inaktív) — admin nézet.
export async function GET(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const offers = (await getAll<VipOfferRecord>('vip_offers'))
    .slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  return NextResponse.json({ offers });
}

// Új ajánlat (multipart: title, description, valid_until, file?).
export async function POST(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Hibás kérés (FormData várt)' }, { status: 400 });
  }

  const title = String(fd.get('title') ?? '').trim();
  const description = String(fd.get('description') ?? '').trim();
  const valid_until = String(fd.get('valid_until') ?? '').trim();
  if (!title) return NextResponse.json({ error: 'Cím kötelező' }, { status: 400 });

  let file_url: string | null = null;
  const file = fd.get('file');
  if (file && file instanceof File && file.size > 0) {
    try {
      const ext = file.name.split('.').pop() || 'bin';
      const fileName = `${Date.now()}.${ext}`;
      const bytes = new Uint8Array(await file.arrayBuffer());
      file_url = await uploadPublicFile('vip-offers', fileName, bytes, file.type || 'application/octet-stream');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fájl feltöltési hiba';
      return NextResponse.json({ error: `Fájl feltöltési hiba: ${msg}` }, { status: 500 });
    }
  }

  const record: VipOfferRecord = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    title,
    description: description || null,
    valid_until: valid_until || null,
    file_url,
    active: true,
  };
  await insertOne<VipOfferRecord>('vip_offers', record);
  return NextResponse.json({ offer: record });
}

// Aktív/inaktív váltás.
export async function PATCH(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const { id, active } = await request.json().catch(() => ({}));
  if (!id || typeof active !== 'boolean') {
    return NextResponse.json({ error: 'Hiányzó id vagy active' }, { status: 400 });
  }
  const ok = await updateOne<VipOfferRecord>('vip_offers', id, { active });
  if (!ok) return NextResponse.json({ error: 'Nem található' }, { status: 404 });
  return NextResponse.json({ success: true });
}

// Törlés.
export async function DELETE(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const ok = await deleteOne('vip_offers', id);
  if (!ok) return NextResponse.json({ error: 'Nem található' }, { status: 404 });
  return NextResponse.json({ success: true });
}
