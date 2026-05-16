import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: 'Szerver konfigurációs hiba' }, { status: 500 });
    }
    if (password === adminPassword) {
      return NextResponse.json({ token: `admin-${Date.now()}` });
    }
    return NextResponse.json({ error: 'Helytelen jelszó' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Hibás kérés' }, { status: 400 });
  }
}
