import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getAll, insertOne, updateOne, deleteOne, isBlobConfigured } from '@/lib/blobStore';

interface NoticeRecord {
  id: string;
  created_at: string;
  updated_at: string;
  body: string;
  href: string | null;
  active: boolean;
}

function authed(request: Request): boolean {
  const auth = request.headers.get('authorization') ?? '';
  return verifyAdminToken(auth.startsWith('Bearer ') ? auth.slice(7) : '');
}

const NO_STORE = { error: 'A tároló nincs beállítva (BLOB_READ_WRITE_TOKEN).' };
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
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const notices = (await getAll<NoticeRecord>('site_notices'))
    .slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  return NextResponse.json({ notices });
}

export async function POST(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

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

  const now = new Date().toISOString();
  const record: NoticeRecord = {
    id: crypto.randomUUID(),
    created_at: now,
    updated_at: now,
    body: text,
    href: link || null,
    active: true,
  };
  await insertOne<NoticeRecord>('site_notices', record);
  return NextResponse.json({ notice: record });
}

export async function PATCH(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const { id, active, body, href } = await request.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const patch: Partial<NoticeRecord> = { updated_at: new Date().toISOString() };
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

  const ok = await updateOne<NoticeRecord>('site_notices', id, patch);
  if (!ok) return NextResponse.json({ error: 'Nem található' }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const ok = await deleteOne('site_notices', id);
  if (!ok) return NextResponse.json({ error: 'Nem található' }, { status: 404 });
  return NextResponse.json({ success: true });
}
