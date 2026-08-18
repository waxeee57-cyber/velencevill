import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getAll, isBlobConfigured } from '@/lib/blobStore';

interface ChatRecord {
  id: string;
  created_at: string;
  nev: string | null;
  telefon: string | null;
  status: string;
  last_message_at: string;
}

interface ChatMessageRecord {
  id: string;
  chat_id: string;
  sender: 'user' | 'admin';
  content: string;
  created_at: string;
}

function bearer(request: Request): string {
  const auth = request.headers.get('authorization') ?? '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : '';
}

// Admin: chat beszélgetések + üzenetek listája.
export async function GET(request: Request) {
  if (!verifyAdminToken(bearer(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: 'A tároló nincs beállítva (BLOB_READ_WRITE_TOKEN).' },
      { status: 503 },
    );
  }

  const [chats, messages] = await Promise.all([
    getAll<ChatRecord>('chats'),
    getAll<ChatMessageRecord>('chat_messages'),
  ]);

  const threads = chats
    .map((c) => ({
      ...c,
      chat_messages: messages
        .filter((m) => m.chat_id === c.id)
        .slice()
        .sort((a, b) => a.created_at.localeCompare(b.created_at)),
    }))
    .sort((a, b) => b.last_message_at.localeCompare(a.last_message_at))
    .slice(0, 100);

  return NextResponse.json({ threads });
}
