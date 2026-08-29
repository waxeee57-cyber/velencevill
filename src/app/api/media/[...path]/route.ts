import { NextRequest, NextResponse } from 'next/server';
import { isBlobConfigured, isAllowedMediaPath, streamPrivateMedia } from '@/lib/blobStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  if (!isBlobConfigured()) return new NextResponse(null, { status: 503 });

  const pathname = (params.path ?? []).join('/');
  if (!isAllowedMediaPath(pathname)) return new NextResponse(null, { status: 404 });

  try {
    const file = await streamPrivateMedia(pathname);
    if (!file) return new NextResponse(null, { status: 404 });
    return new NextResponse(file.stream, {
      headers: {
        'Content-Type': file.contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
