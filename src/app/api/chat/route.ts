import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { nev, telefon, message, sessionId } = await request.json();

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const to = process.env.RESEND_TO_EMAIL ?? 'info@velencevill.hu';

      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to,
        subject: `Új chat üzenet — ${nev} (${telefon})`,
        html: `<p><strong>Üzenet:</strong> ${message}</p><p><strong>Név:</strong> ${nev}</p><p><strong>Telefon:</strong> ${telefon}</p><p><strong>Session:</strong> ${sessionId}</p>`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // graceful skip
  }
}
