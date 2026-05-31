import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sanitizeForEmail } from '@/lib/security';

const PHONE = '+36 30 618 2165';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, name, preferred_time, message } = body;

    if (!phone?.trim()) {
      return NextResponse.json({ error: 'Telefonszám megadása kötelező.' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    let saved = false;

    // ── 1. Supabase mentés (callback_requests) ──
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error } = await supabase.from('callback_requests').insert({
          id,
          telefon: phone.trim(),
          nev: name?.trim() || null,
          preferred_time: preferred_time || null,
          uzenet: message?.trim() || null,
          statusz: 'uj',
        });
        if (!error) saved = true;
      } catch {
        /* DB hiba — email fallback */
      }
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
