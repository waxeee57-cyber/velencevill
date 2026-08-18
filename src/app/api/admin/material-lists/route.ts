import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function authed(request: Request): boolean {
  const auth = request.headers.get('authorization') ?? '';
  return verifyAdminToken(auth.startsWith('Bearer ') ? auth.slice(7) : '');
}

const NO_KEY = { error: 'Supabase szerver kulcs nincs beállítva (SUPABASE_SERVICE_ROLE_KEY).' };

// Lista
export async function GET(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json(NO_KEY, { status: 503 });

  const { data, error } = await sb
    .from('material_lists')
    .select('id, created_at, nev, telefon, megjegyzes, tetelek, statusz, forras, kesz_at')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ lists: data ?? [] });
}

// Státusz módosítás
export async function PATCH(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json(NO_KEY, { status: 503 });

  const { id, statusz } = await request.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (typeof statusz === 'string') {
    updates.statusz = statusz;
    if (statusz === 'kesz') updates.kesz_at = new Date().toISOString();
  }
  if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'Nincs módosítandó mező' }, { status: 400 });

  const { error } = await sb.from('material_lists').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// Törlés
export async function DELETE(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json(NO_KEY, { status: 503 });

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const { error } = await sb.from('material_lists').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
