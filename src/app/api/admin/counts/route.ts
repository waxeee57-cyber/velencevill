import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { countWhere, isBlobConfigured } from '@/lib/blobStore';

// Fejléc badge: hány 'uj' státuszú tétel van kollekciónként.
export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  if (!verifyAdminToken(auth.startsWith('Bearer ') ? auth.slice(7) : '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isBlobConfigured()) {
    return NextResponse.json({ newLeads: 0, newCallbacks: 0, newMaterialLists: 0, newVipRequests: 0 });
  }

  const isNew = (i: { statusz?: string }) => i.statusz === 'uj';
  const [newLeads, newCallbacks, newMaterialLists, newVipRequests] = await Promise.all([
    countWhere('leads', isNew),
    countWhere('callback_requests', isNew),
    countWhere('material_lists', isNew),
    countWhere('vip_requests', isNew),
  ]);

  return NextResponse.json({ newLeads, newCallbacks, newMaterialLists, newVipRequests });
}
