import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sanitizeForEmail } from '@/lib/security';
import { insertOne } from '@/lib/blobStore';

const PHONE = '+36 30 618 2165';

interface CallbackRecord {
  id: string;
  created_at: string;
  telefon: string;
  nev: string | null;
  preferred_time: string | null;
  uzenet: string | null;
  statusz: string;
  called_at: string | null;
  notes: string | null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, name, preferred_time, message } = body;

    if (!phone?.trim()) {
      return NextResponse.json({ error: 'Telefonszám megadása kötelező.' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    let saved = false;

    // ── 1. Mentés (callback_requests kollekció) ──
    try {
      await insertOne<CallbackRecord>('callback_requests', {
        id,
        created_at: new Date().toISOString(),
        telefon: phone.trim(),
        nev: name?.trim() || null,
        preferred_time: preferred_time || null,
        uzenet: message?.trim() || null,
        statusz: 'uj',
        called_at: null,
        notes: null,
      });
      saved = true;
    } catch {
      /* tárolási hiba — email fallback */
    }

    // ── 2. Email értesítés (nem végzetes hiba) ──
    const resendKey = process.env.RESEND_API_KEY;
    let emailSent = false;
    if (resendKey) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(resendKey);
        const safe = sanitizeForEmail({
          phone, name: name || 'Nincs megadva',
          preferred_time: preferred_time || 'Bármikor', message: message || '',
        });
        const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@velencevill.hu';
        const toEmail = process.env.RESEND_TO_EMAIL ?? 'info@velencevill.hu';
        await resend.emails.send({
          from: `Velence Vill Visszahívás <${fromEmail}>`,
          to: [toEmail],
          subject: `📞 Visszahívás kérve – ${safe.phone}`,
          html: `
            <h2>Visszahívás kérve</h2>
            <p><strong>Telefon:</strong> <a href="tel:${safe.phone}">${safe.phone}</a></p>
            <p><strong>Név:</strong> ${safe.name}</p>
            <p><strong>Mikor hívjuk:</strong> ${safe.preferred_time}</p>
            ${safe.message ? `<p><strong>Üzenet:</strong> ${safe.message}</p>` : ''}
            <hr><p><small>Admin azonosító: ${id}</small></p>
          `,
        });
        emailSent = true;
      } catch {
        /* elnyelve */
      }
    }

    if (!saved && !emailSent) {
      return NextResponse.json(
        { error: `Nem sikerült rögzíteni. Kérjük hívjon közvetlenül: ${PHONE}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: saved ? id : null });
  } catch {
    return NextResponse.json({ error: `Szerver hiba. Hívjon: ${PHONE}` }, { status: 500 });
  }
}
