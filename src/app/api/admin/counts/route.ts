import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

// Fejléc badge: hány 'uj' státuszú lead + visszahívás van.
export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  if (!verifyAdminToken(auth.startsWith('Bearer ') ? auth.slice(7) : '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ newLeads: 0, newCallbacks: 0 });

  const [leads, callbacks] = await Promise.all([
    sb.from('leads').select('id', { count: 'exact', head: true }).eq('statusz', 'uj'),
    sb.from('callback_requests').select('id', { count: 'exact', head: true }).eq('statusz', 'uj'),
  ]);

  return NextResponse.json({
    newLeads: leads.count ?? 0,
    newCallbacks: callbacks.count ?? 0,
  });
}
