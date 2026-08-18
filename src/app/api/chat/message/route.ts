import { NextResponse } from 'next/server';
import crypto from 'crypto';
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

// Publikus végpont — a látogató saját üzenete (sender mindig 'user', a
// szerver kényszeríti ki, a kliens nem tud admin-üzenetet hamisítani).
export async function POST(request: Request) {
  if (!isBlobConfigured()) return NextResponse.json({ error: 'Szerver konfigurációs hiba' }, { status: 503 });

  const { chatId, content } = await request.json().catch(() => ({}));
  const text = typeof content === 'string' ? content.trim() : '';
  if (typeof chatId !== 'string' || !chatId || !text) {
    return NextResponse.json({ error: 'Hiányzó chatId vagy üzenet' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const message: ChatMessageRecord = {
    id: crypto.randomUUID(),
    chat_id: chatId,
    sender: 'user',
    content: text,
    created_at: now,
  };
  try {
    await insertOne<ChatMessageRecord>('chat_messages', message);
    await updateOne<ChatRecord>('chats', chatId, { last_message_at: now });
    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: 'Nem sikerült elküldeni' }, { status: 500 });
  }
}
