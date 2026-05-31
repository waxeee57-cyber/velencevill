import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sanitizeForEmail } from '@/lib/security';

const PHONE = '+36 30 618 2165';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Név és telefonszám megadása kötelező.' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    let saved = false;

    // ── 1. Mentés Supabase-be (leads tábla, magyar oszlopnevek) ──
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        // Kliens-oldali id-t adunk át, így nincs szükség RETURNING-re (anon nem olvashat).
        const { error } = await supabase.from('leads').insert({
          id,
          nev: name.trim(),
          telefon: phone.trim(),
          email: email?.trim() || null,
          tema: subject || null,
          uzenet: message?.trim() || null,
          tipus: 'szakuzlet',
          statusz: 'uj',
          source: 'contact_form',
        });
        if (!error) saved = true;
      } catch {
        /* DB hiba — megpróbáljuk az emailt */
      }
    }

    // ── 2. Email értesítés (a hiba NEM végzetes, ha a DB mentés sikerült) ──
    const resendKey = process.env.RESEND_API_KEY;
    let emailSent = false;
    if (resendKey) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(resendKey);
        const safe = sanitizeForEmail({
          name, email: email || 'Nincs megadva', phone,
          subject: subject || 'Általános', message: message || 'Nincs üzenet',
        });
        const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@velencevill.hu';
        const toEmail = process.env.RESEND_TO_EMAIL ?? 'info@velencevill.hu';
        await resend.emails.send({
          from: `Velence Vill Weboldal <${fromEmail}>`,
          to: [toEmail],
          subject: `🔔 Új ajánlatkérés – ${safe.name}`,
          html: `
            <h2>Új ajánlatkérés érkezett</h2>
            <p><strong>Név:</strong> ${safe.name}</p>
            <p><strong>Telefon:</strong> ${safe.phone}</p>
            <p><strong>Email:</strong> ${safe.email}</p>
            <p><strong>Téma:</strong> ${safe.subject}</p>
            <p><strong>Üzenet:</strong></p><p>${safe.message.replace(/\n/g, '<br>')}</p>
            <hr><p><small>Admin azonosító: ${id}</small></p>
          `,
        });
        emailSent = true;
      } catch {
        /* email hiba elnyelve — lent döntünk a státuszról */
      }
    }

    // ── 3. Ha sem DB, sem email nem ment át → értelmes hiba a telefonszámmal ──
    if (!saved && !emailSent) {
      return NextResponse.json(
        { error: `Nem sikerült rögzíteni a kérést. Kérjük hívjon közvetlenül: ${PHONE}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: saved ? id : null });
  } catch {
    return NextResponse.json(
      { error: `Szerver hiba. Próbálja újra, vagy hívjon: ${PHONE}` },
      { status: 500 },
    );
  }
}
