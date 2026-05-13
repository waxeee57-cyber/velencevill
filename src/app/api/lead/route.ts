import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nev, telefon, email, tema, uzenet } = body;

    if (!nev || !telefon) {
      return NextResponse.json({ error: 'Név és telefonszám kötelező.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('leads').insert({
        nev, telefon, email, tema, uzenet,
        tipus: 'szakuzlet',
        statusz: 'uj',
      });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const { Resend } = await import('resend');
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'Velence Vill Weboldal <noreply@velencevill.hu>',
        to: [process.env.RESEND_TO_EMAIL ?? 'info@velencevill.hu'],
        subject: `Új ajánlatkérés – ${nev}`,
        html: `<p><b>Név:</b> ${nev}</p><p><b>Telefon:</b> ${telefon}</p>${email ? `<p><b>Email:</b> ${email}</p>` : ''}${tema ? `<p><b>Téma:</b> ${tema}</p>` : ''}${uzenet ? `<p><b>Üzenet:</b> ${uzenet}</p>` : ''}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Lead error:', err);
    return NextResponse.json({ error: 'Szerver hiba.' }, { status: 500 });
  }
}
