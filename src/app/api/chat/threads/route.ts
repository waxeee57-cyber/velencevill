import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function bearer(request: Request): string {
  const auth = request.headers.get('authorization') ?? '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : '';
}

// Admin: chat beszélgetések + üzenetek listája (service_role, RLS bypass).
export async function GET(request: Request) {
  if (!verifyAdminToken(bearer(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json(
      { error: 'Supabase szerver kulcs nincs beállítva (SUPABASE_SERVICE_ROLE_KEY).' },
      { status: 503 },
    );
  }

  const { data, error } = await sb
    .from('chats')
    .select('id, nev, telefon, status, created_at, last_message_at, chat_messages(id, sender, content, created_at)')
    .order('last_message_at', { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const threads = (data ?? []).map((c) => ({
    ...c,
    chat_messages: ((c.chat_messages as { created_at: string }[] | null) ?? [])
      .slice()
      .sort((a, b) => a.created_at.localeCompare(b.created_at)),
  }));

  return NextResponse.json({ threads });
}
