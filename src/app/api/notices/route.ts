import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ notices: [] });

  const { data, error } = await sb
    .from('site_notices')
    .select('id, body, href')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    return NextResponse.json({ notices: [] });
  }
  return NextResponse.json({ notices: data ?? [] });
}
