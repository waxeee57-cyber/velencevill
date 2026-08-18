import { NextResponse } from 'next/server';
import { getAll } from '@/lib/blobStore';

interface ChatMessageRecord {
  id: string;
  chat_id: string;
  sender: 'user' | 'admin';
  content: string;
  created_at: string;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Publikus lekérdezés — csak a chatId ismeretében (ugyanaz a bizalmi modell,
// mint korábban a Supabase RLS-nél: a UUID a "belépő", nincs extra jogosultság
// a saját beszélgetés visszaolvasásához).
export async function GET(request: Request) {
  const chatId = new URL(request.url).searchParams.get('chatId');
  if (!chatId) return NextResponse.json({ messages: [] });

  const all = await getAll<ChatMessageRecord>('chat_messages');
  const messages = all
    .filter((m) => m.chat_id === chatId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));

  return NextResponse.json({ messages });
}
