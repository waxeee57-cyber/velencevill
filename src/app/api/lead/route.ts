import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nev, telefon, email, tema, uzenet, tipus } = body;

    if (!nev || !telefon) {
      return NextResponse.json({ error: 'Név és telefonszám kötelező.' }, { status: 400 });
    }

    // 1. Mentés Supabase-be
    const { error: dbError } = await supabase.from('leads').insert({
      nev, telefon, email, tema, uzenet,
      tipus: tipus ?? 'szakuzlet',
      statusz: 'uj',
    });
    if (dbError) throw dbError;

    // 2. Email értesítő Resend-del
    await resend.emails.send({
      from: 'Velence Vill Weboldal <noreply@velencevill.hu>',
      to: [process.env.RESEND_TO_EMAIL ?? 'info@velencevill.hu'],
      subject: `Új ajánlatkérés – ${nev}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;padding:24px;background:#f8fafc;border-radius:8px;">
          <h2 style="color:#0f172a;margin-bottom:16px;">Új ajánlatkérés érkezett</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#64748b;width:120px;">Név:</td><td style="font-weight:500;">${nev}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Telefon:</td><td style="font-weight:500;"><a href="tel:${telefon}">${telefon}</a></td></tr>
            ${email ? `<tr><td style="padding:8px 0;color:#64748b;">E-mail:</td><td>${email}</td></tr>` : ''}
            ${tema ? `<tr><td style="padding:8px 0;color:#64748b;">Téma:</td><td>${tema}</td></tr>` : ''}
            ${uzenet ? `<tr><td style="padding:8px 0;color:#64748b;">Üzenet:</td><td>${uzenet}</td></tr>` : ''}
          </table>
          <p style="margin-top:20px;font-size:12px;color:#94a3b8;">Beküldve: ${new Date().toLocaleString('hu-HU')}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Lead submission error:', err);
    return NextResponse.json({ error: 'Szerver hiba. Kérjük, próbálja újra.' }, { status: 500 });
  }
}
