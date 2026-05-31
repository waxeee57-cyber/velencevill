import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function authed(request: Request): boolean {
  const auth = request.headers.get('authorization') ?? '';
  return verifyAdminToken(auth.startsWith('Bearer ') ? auth.slice(7) : '');
}

const NO_KEY = { error: 'Supabase szerver kulcs nincs beállítva (SUPABASE_SERVICE_ROLE_KEY).' };
const BUCKET = 'vip-files';

// Összes ajánlat (aktív + inaktív) — admin nézet.
export async function GET(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json(NO_KEY, { status: 503 });

  const { data, error } = await sb
    .from('vip_offers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ offers: data ?? [] });
}

// Új ajánlat (multipart: title, description, valid_until, file?). A fájlt is
// service_role tölti fel — anon nem írhat sem a táblába, sem a bucketbe.
export async function POST(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json(NO_KEY, { status: 503 });

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
    const ext = file.name.split('.').pop() || 'bin';
    const fileName = `vip-offers/${Date.now()}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error: upErr } = await sb.storage.from(BUCKET).upload(fileName, bytes, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'application/octet-stream',
    });
    if (upErr) return NextResponse.json({ error: `Fájl feltöltési hiba: ${upErr.message}` }, { status: 500 });
    file_url = sb.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;
  }

  const { data, error } = await sb.from('vip_offers').insert({
    title,
    description: description || null,
    valid_until: valid_until || null,
    file_url,
    active: true,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ offer: data });
}

// Aktív/inaktív váltás.
export async function PATCH(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json(NO_KEY, { status: 503 });

  const { id, active } = await request.json().catch(() => ({}));
  if (!id || typeof active !== 'boolean') {
    return NextResponse.json({ error: 'Hiányzó id vagy active' }, { status: 400 });
  }
  const { error } = await sb.from('vip_offers').update({ active }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// Törlés.
export async function DELETE(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json(NO_KEY, { status: 503 });

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const { error } = await sb.from('vip_offers').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
