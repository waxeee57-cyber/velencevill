import { NextResponse } from 'next/server';
import { sanitizeForEmail } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const { nev, telefon, message, sessionId } = await request.json();

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const safe = sanitizeForEmail({ nev: nev ?? '', telefon: telefon ?? '', message: message ?? '', sessionId: sessionId ?? '' });
      const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@velencevill.hu';
      const toEmail = process.env.RESEND_TO_EMAIL ?? 'info@velencevill.hu';
      await resend.emails.send({
        from: `Velence Vill Chat <${fromEmail}>`,
        to: toEmail,
        subject: `Új chat üzenet — ${safe.nev} (${safe.telefon})`,
        html: `
          <h2>Új chat üzenet</h2>
          <p><strong>Üzenet:</strong> ${safe.message}</p>
          <p><strong>Név:</strong> ${safe.nev}</p>
          <p><strong>Telefon:</strong> ${safe.telefon}</p>
          <p><strong>Session:</strong> ${safe.sessionId}</p>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
