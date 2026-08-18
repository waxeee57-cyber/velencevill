import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function authed(request: Request): boolean {
  const auth = request.headers.get('authorization') ?? '';
  return verifyAdminToken(auth.startsWith('Bearer ') ? auth.slice(7) : '');
}

const NO_KEY = { error: 'Supabase szerver kulcs nincs beállítva (SUPABASE_SERVICE_ROLE_KEY).' };
const MAX_BODY = 240;

function isSafeHref(value: string): boolean {
  if (!value) return true;
  if (value.startsWith('/')) return !value.startsWith('//');
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'tel:' || url.protocol === 'mailto:';
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json(NO_KEY, { status: 503 });

  const { data, error } = await sb
    .from('site_notices')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ notices: data ?? [] });
}

export async function POST(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json(NO_KEY, { status: 503 });

  const { body, href } = await request.json().catch(() => ({}));
  const text = typeof body === 'string' ? body.trim() : '';
  if (!text) return NextResponse.json({ error: 'A hír szövege kötelező' }, { status: 400 });
  if (text.length > MAX_BODY) {
    return NextResponse.json({ error: `Maximum ${MAX_BODY} karakter` }, { status: 400 });
  }
  const link = typeof href === 'string' ? href.trim() : '';
  if (link && !isSafeHref(link)) {
    return NextResponse.json({ error: 'A link érvénytelen' }, { status: 400 });
  }

  const { data, error } = await sb.from('site_notices').insert({
    body: text,
    href: link || null,
    active: true,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ notice: data });
}

export async function PATCH(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json(NO_KEY, { status: 503 });

  const { id, active, body, href } = await request.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof active === 'boolean') patch.active = active;
  if (typeof body === 'string') {
    const text = body.trim();
    if (!text) return NextResponse.json({ error: 'A hír szövege kötelező' }, { status: 400 });
    if (text.length > MAX_BODY) return NextResponse.json({ error: `Maximum ${MAX_BODY} karakter` }, { status: 400 });
    patch.body = text;
  }
  if (typeof href === 'string') {
    const link = href.trim();
    if (link && !isSafeHref(link)) return NextResponse.json({ error: 'A link érvénytelen' }, { status: 400 });
    patch.href = link || null;
  }

  const { error } = await sb.from('site_notices').update(patch).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json(NO_KEY, { status: 503 });

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const { error } = await sb.from('site_notices').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
