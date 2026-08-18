import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function authed(request: Request): boolean {
  const auth = request.headers.get('authorization') ?? '';
  return verifyAdminToken(auth.startsWith('Bearer ') ? auth.slice(7) : '');
}

const NO_KEY = { error: 'Supabase szerver kulcs nincs beállítva (SUPABASE_SERVICE_ROLE_KEY).' };

export async function GET(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json(NO_KEY, { status: 503 });

  const { data, error } = await sb
    .from('vip_requests')
    .select('id, created_at, nev, telefon, uzenet, kep_url, hang_url, statusz')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ requests: data ?? [] });
}

export async function PATCH(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json(NO_KEY, { status: 503 });

  const { id, statusz } = await request.json().catch(() => ({}));
  if (!id || typeof statusz !== 'string') return NextResponse.json({ error: 'Hiányzó id vagy statusz' }, { status: 400 });

  const { error } = await sb.from('vip_requests').update({ statusz }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json(NO_KEY, { status: 503 });

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const { error } = await sb.from('vip_requests').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
