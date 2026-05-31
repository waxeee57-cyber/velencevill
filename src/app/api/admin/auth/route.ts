import { NextResponse } from 'next/server';
import { signAdminToken } from '@/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: 'Szerver konfigurációs hiba' }, { status: 500 });
    }
    if (password === adminPassword) {
      // HMAC-aláírt token, amit a service_role-os admin route-ok ellenőriznek.
      return NextResponse.json({ token: signAdminToken() });
    }
    return NextResponse.json({ error: 'Helytelen jelszó' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Hibás kérés' }, { status: 400 });
  }
}
