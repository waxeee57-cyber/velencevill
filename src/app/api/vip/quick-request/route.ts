import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { sanitizeForEmail } from '@/lib/security';

const PHONE = '+36 30 618 2165';
const BUCKET = 'vip-files';
const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const ALLOWED_AUDIO = ['audio/mpeg', 'audio/mp4', 'audio/webm', 'audio/ogg', 'audio/wav', 'audio/x-m4a', 'audio/aac'];

// Publikus végpont (nincs admin token) — a VIP oldalról bárki elérheti,
// aki ismeri az URL-t. A tábla RLS-e service_role-only (nincs anon policy),
// ezért a fájlfeltöltés és a beszúrás is emelt jogosultsággal, itt a
// szerveren történik — anon kulcs sosem érinti a vip-files bucketet.
export async function POST(request: Request) {
  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json({ error: 'Szerver konfigurációs hiba — hívjon minket közvetlenül.' }, { status: 503 });
  }

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Hibás kérés (FormData várt)' }, { status: 400 });
  }

  const nev = String(fd.get('nev') ?? '').trim();
  const telefon = String(fd.get('telefon') ?? '').trim();
  const uzenet = String(fd.get('uzenet') ?? '').trim();
  if (!nev || !telefon) {
    return NextResponse.json({ error: 'Név és telefonszám megadása kötelező.' }, { status: 400 });
  }

  async function uploadFile(field: string, allowed: string[], prefix: string): Promise<string | null> {
    const file = fd.get(field);
    if (!file || !(file instanceof File) || file.size === 0) return null;
    if (file.size > MAX_FILE_BYTES) throw new Error(`A(z) ${field === 'kep' ? 'fotó' : 'hangüzenet'} túl nagy (max 15 MB).`);
    if (file.type && !allowed.includes(file.type)) throw new Error(`Nem támogatott fájltípus: ${file.type}`);
    const ext = file.name.split('.').pop() || 'bin';
    const fileName = `vip-requests/${prefix}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error } = await sb!.storage.from(BUCKET).upload(fileName, bytes, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'application/octet-stream',
    });
    if (error) throw new Error(`Fájlfeltöltési hiba: ${error.message}`);
    return sb!.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;
  }

  let kep_url: string | null = null;
  let hang_url: string | null = null;
  try {
    kep_url = await uploadFile('kep', ALLOWED_IMAGE, 'kep');
    hang_url = await uploadFile('hang', ALLOWED_AUDIO, 'hang');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Fájlfeltöltési hiba';
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { data, error } = await sb.from('vip_requests').insert({
    nev, telefon, uzenet: uzenet || null, kep_url, hang_url, statusz: 'uj',
  }).select().single();
  if (error) {
    return NextResponse.json({ error: `Nem sikerült rögzíteni a kérést. Kérjük hívjon közvetlenül: ${PHONE}` }, { status: 500 });
  }

  // Email értesítés — nem végzetes, ha nincs beállítva vagy hibázik.
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendKey);
      const safe = sanitizeForEmail({ name: nev, phone: telefon, note: uzenet || 'Nincs üzenet' });
      const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@velencevill.hu';
      const toEmail = process.env.RESEND_TO_EMAIL ?? 'info@velencevill.hu';
      await resend.emails.send({
        from: `Velence Vill VIP <${fromEmail}>`,
        to: [toEmail],
        subject: `⚡ VIP gyorskérés – ${safe.name}`,
        html: `
          <h2>Új VIP gyorskérés (fotó/hangüzenet)</h2>
          <p><strong>Név:</strong> ${safe.name}</p>
          <p><strong>Telefon:</strong> ${safe.phone}</p>
          <p><strong>Üzenet:</strong> ${safe.note}</p>
          ${kep_url ? `<p><strong>Fotó:</strong> <a href="${kep_url}">${kep_url}</a></p>` : ''}
          ${hang_url ? `<p><strong>Hangüzenet:</strong> <a href="${hang_url}">${hang_url}</a></p>` : ''}
          <hr><p><small>Admin azonosító: ${data.id}</small></p>
        `,
      });
    } catch {
      /* email hiba elnyelve — a DB mentés már megtörtént */
    }
  }

  return NextResponse.json({ success: true, id: data.id });
}
