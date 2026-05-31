import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function bearer(request: Request): string {
  const auth = request.headers.get('authorization') ?? '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : '';
}

// Admin válasz beszúrása sender='admin'-ként (service_role).
// Ezt a látogató NEM tudja meghamisítani: az anon kulcs RLS-e csak sender='user'-t enged.
export async function POST(request: Request) {
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

  let body: { chatId?: string; content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Hibás kérés' }, { status: 400 });
  }

  const chatId = body.chatId;
  const content = body.content?.trim();
  if (!chatId || !content) {
    return NextResponse.json({ error: 'Hiányzó chatId vagy üzenet' }, { status: 400 });
  }

  const { data, error } = await sb
    .from('chat_messages')
    .insert({ chat_id: chatId, sender: 'admin', content })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await sb.from('chats').update({ last_message_at: new Date().toISOString() }).eq('id', chatId);

  return NextResponse.json({ message: data });
}
