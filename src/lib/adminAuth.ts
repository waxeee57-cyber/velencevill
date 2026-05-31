import crypto from 'crypto';

// Egyszerű HMAC-aláírt admin token. Titok = ADMIN_PASSWORD (szerver oldali).
// Így a service_role-os admin route-ok ténylegesen ellenőrizhetik a jogosultságot,
// nem csak egy localStorage-jelenlét alapján.
const TTL_MS = 1000 * 60 * 60 * 12; // 12 óra

function secret(): string {
  return process.env.ADMIN_PASSWORD ?? '';
}

export function signAdminToken(): string {
  const exp = Date.now() + TTL_MS;
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string | null | undefined): boolean {
  const s = secret();
  if (!token || !s) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = crypto.createHmac('sha256', s).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof exp === 'number' && Date.now() < exp;
  } catch {
    return false;
  }
}
