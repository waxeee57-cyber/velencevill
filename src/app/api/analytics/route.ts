import { NextResponse } from 'next/server';

// In-memory fallback — resets on server restart
// TODO: replace with Supabase for persistence
const visits: { timestamp: number; page: string }[] = [];

export async function GET() {
  const now = Date.now();
  const days = Array.from({ length: 7 }, (_, i) => {
    const start = now - (6 - i) * 864e5;
    const end = start + 864e5;
    const label = new Date(start).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
    const count = visits.filter(v => v.timestamp >= start && v.timestamp < end).length;
    return { label, count };
  });

  return NextResponse.json({ total: visits.length, days });
}

export async function POST(request: Request) {
  try {
    const { page } = await request.json();
    visits.push({ timestamp: Date.now(), page: page ?? '/' });
    if (visits.length > 10000) visits.splice(0, 1000);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
