import { NextRequest, NextResponse } from 'next/server';
import { sanitizeForEmail } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Kötelező mezők hiányoznak.' }, { status: 400 });
    }

    const safe = sanitizeForEmail({ name, email: email ?? '', phone, subject: subject ?? '', message: message ?? '' });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('leads').insert({
        nev: name, telefon: phone, email, tema: subject, uzenet: message,
        tipus: 'szakuzlet', statusz: 'uj',
      });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const { Resend } = await import('resend');
      const resend = new Resend(resendKey);
      const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@velencevill.hu';
      const toEmail = process.env.RESEND_TO_EMAIL ?? 'info@velencevill.hu';
      await resend.emails.send({
        from: `Velence Vill Weboldal <${fromEmail}>`,
        to: [toEmail],
        subject: `Új ajánlatkérés – ${safe.name}`,
        html: `
          <h2>Új ajánlatkérés érkezett</h2>
          <p><strong>Név:</strong> ${safe.name}</p>
          <p><strong>Telefon:</strong> ${safe.phone}</p>
          ${safe.email ? `<p><strong>Email:</strong> ${safe.email}</p>` : ''}
          ${safe.subject ? `<p><strong>Téma:</strong> ${safe.subject}</p>` : ''}
          ${safe.message ? `<p><strong>Üzenet:</strong></p><p>${safe.message.replace(/\n/g, '<br>')}</p>` : ''}
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Szerver hiba.' }, { status: 500 });
  }
}
