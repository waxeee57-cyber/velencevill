import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyAdminToken } from '@/lib/adminAuth';
import { insertOne, updateOne, isBlobConfigured } from '@/lib/blobStore';

interface ChatMessageRecord {
  id: string;
  chat_id: string;
  sender: 'user' | 'admin';
  content: string;
  created_at: string;
}

interface ChatRecord {
  id: string;
  created_at: string;
  nev: string | null;
  telefon: string | null;
  status: string;
  last_message_at: string;
}

function bearer(request: Request): string {
  const auth = request.headers.get('authorization') ?? '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : '';
}

// Admin válasz beszúrása sender='admin'-ként — csak admin-tokennel érhető el.
export async function POST(request: Request) {
  if (!verifyAdminToken(bearer(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: 'A tároló nincs beállítva (BLOB_READ_WRITE_TOKEN).' },
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

  const now = new Date().toISOString();
  const message: ChatMessageRecord = {
    id: crypto.randomUUID(),
    chat_id: chatId,
    sender: 'admin',
    content,
    created_at: now,
  };
  await insertOne<ChatMessageRecord>('chat_messages', message);
  await updateOne<ChatRecord>('chats', chatId, { last_message_at: now });

  return NextResponse.json({ message });
}
