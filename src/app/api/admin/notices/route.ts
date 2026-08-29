import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getAll, insertOne, updateOne, deleteOne, isBlobConfigured, uploadPublicFile } from '@/lib/blobStore';

interface NoticeRecord {
  id: string;
  created_at: string;
  updated_at: string;
  body: string;
  href: string | null;
  image_url: string | null;
  active: boolean;
}

function authed(request: Request): boolean {
  const auth = request.headers.get('authorization') ?? '';
  return verifyAdminToken(auth.startsWith('Bearer ') ? auth.slice(7) : '');
}

const NO_STORE = { error: 'A tároló nincs beállítva (BLOB_READ_WRITE_TOKEN).' };
const MAX_BODY = 240;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp'];

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

function validateBody(text: string): string | null {
  if (!text) return 'A hír szövege kötelező';
  if (text.length > MAX_BODY) return `Maximum ${MAX_BODY} karakter`;
  return null;
}

async function uploadNoticeImage(file: File): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('A kép túl nagy (max 4 MB).');
  }
  if (file.type && !ALLOWED_IMAGE.includes(file.type)) {
    throw new Error('Csak JPG, PNG vagy WebP tölthető fel.');
  }
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const fileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  return uploadPublicFile('notices', fileName, bytes, file.type || 'image/jpeg');
}

type NoticeFields = {
  id?: string;
  body?: string;
  href?: string;
  active?: boolean;
  removeImage?: boolean;
  file: File | null;
};

async function readNoticeFields(request: Request): Promise<NoticeFields> {
  const ct = request.headers.get('content-type') ?? '';
  if (ct.includes('multipart/form-data')) {
    const fd = await request.formData();
    const activeRaw = fd.get('active');
    const file = fd.get('image');
    return {
      id: String(fd.get('id') ?? '') || undefined,
      body: fd.has('body') ? String(fd.get('body') ?? '') : undefined,
      href: fd.has('href') ? String(fd.get('href') ?? '') : undefined,
      active: activeRaw === null ? undefined : String(activeRaw) === 'true',
      removeImage: String(fd.get('remove_image') ?? '') === 'true',
      file: file instanceof File && file.size > 0 ? file : null,
    };
  }
  const json = await request.json().catch(() => ({})) as Record<string, unknown>;
  return {
    id: typeof json.id === 'string' ? json.id : undefined,
    body: typeof json.body === 'string' ? json.body : undefined,
    href: typeof json.href === 'string' ? json.href : undefined,
    active: typeof json.active === 'boolean' ? json.active : undefined,
    removeImage: json.image_url === null,
    file: null,
  };
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

  const fields = await readNoticeFields(request);
  const text = (fields.body ?? '').trim();
  const bodyErr = validateBody(text);
  if (bodyErr) return NextResponse.json({ error: bodyErr }, { status: 400 });

  const link = (fields.href ?? '').trim();
  if (link && !isSafeHref(link)) {
    return NextResponse.json({ error: 'A link érvénytelen' }, { status: 400 });
  }

  let image_url: string | null = null;
  if (fields.file) {
    try {
      image_url = await uploadNoticeImage(fields.file);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kép feltöltési hiba';
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  }

  const now = new Date().toISOString();
  const record: NoticeRecord = {
    id: crypto.randomUUID(),
    created_at: now,
    updated_at: now,
    body: text,
    href: link || null,
    image_url,
    active: true,
  };
  await insertOne<NoticeRecord>('site_notices', record);
  return NextResponse.json({ notice: record });
}

export async function PATCH(request: Request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json(NO_STORE, { status: 503 });

  const fields = await readNoticeFields(request);
  if (!fields.id) return NextResponse.json({ error: 'Hiányzó id' }, { status: 400 });

  const patch: Partial<NoticeRecord> = { updated_at: new Date().toISOString() };
  if (typeof fields.active === 'boolean') patch.active = fields.active;
  if (typeof fields.body === 'string') {
    const text = fields.body.trim();
    const bodyErr = validateBody(text);
    if (bodyErr) return NextResponse.json({ error: bodyErr }, { status: 400 });
    patch.body = text;
  }
  if (typeof fields.href === 'string') {
    const link = fields.href.trim();
    if (link && !isSafeHref(link)) return NextResponse.json({ error: 'A link érvénytelen' }, { status: 400 });
    patch.href = link || null;
  }
  if (fields.file) {
    try {
      patch.image_url = await uploadNoticeImage(fields.file);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kép feltöltési hiba';
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  } else if (fields.removeImage) {
    patch.image_url = null;
  }

  const ok = await updateOne<NoticeRecord>('site_notices', fields.id, patch);
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
