import { NextResponse } from 'next/server';
import { signAdminToken, passwordsMatch } from '@/lib/adminAuth';
import { allowRequest, rateLimited } from '@/lib/security';

export async function POST(request: Request) {
  try {
    if (!allowRequest(request, 'admin-auth', 5, 15 * 60 * 1000)) return rateLimited();
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: 'Szerver konfigurációs hiba' }, { status: 500 });
    }
    if (typeof password === 'string' && passwordsMatch(password, adminPassword)) {
      // HMAC-aláírt token, amit a service_role-os admin route-ok ellenőriznek.
      return NextResponse.json({ token: signAdminToken() });
    }
    return NextResponse.json({ error: 'Helytelen jelszó' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Hibás kérés' }, { status: 400 });
  }
}
