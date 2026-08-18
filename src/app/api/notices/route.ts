import { NextResponse } from 'next/server';
import { getAll } from '@/lib/blobStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface NoticeRecord {
  id: string;
  created_at: string;
  body: string;
  href: string | null;
  active: boolean;
}

export async function GET() {
  try {
    const notices = await getAll<NoticeRecord>('site_notices');
    const active = notices
      .filter((n) => n.active)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 12)
      .map(({ id, body, href }) => ({ id, body, href }));
    return NextResponse.json({ notices: active });
  } catch {
    return NextResponse.json({ notices: [] });
  }
}
