import { NextResponse } from 'next/server'
import { sanitizeForEmail } from '@/lib/security'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, calculatorType, calculatorResult } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Név és telefonszám kötelező' }, { status: 400 })
    }

    const safe = sanitizeForEmail({
      name,
      phone,
      calculatorType: calculatorType ?? '',
      calculatorResult: calculatorResult ?? '',
    })

    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const { Resend } = await import('resend')
      const resend = new Resend(resendKey)
      const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@velencevill.hu'
      const toEmail = process.env.RESEND_TO_EMAIL ?? 'velencevillkft@gmail.com'

      await resend.emails.send({
        from: `Velence Vill Weboldal <${fromEmail}>`,
        to: [toEmail],
        subject: `Kalkulátor lead — ${safe.calculatorType}`,
        html: `
          <h2 style="color:#060d18;">Új kalkulátor érdeklődés</h2>
          <table style="font-family:Arial,sans-serif;font-size:15px;">
            <tr><td style="padding:6px 16px 6px 0;color:#666;">Kalkulátor:</td><td><strong>${safe.calculatorType}</strong></td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#666;">Név:</td><td><strong>${safe.name}</strong></td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#666;">Telefon:</td><td><strong>${safe.phone}</strong></td></tr>
          </table>
          <hr style="margin:16px 0;"/>
          <p style="color:#666;font-size:13px;">Számítás eredménye:</p>
          <p style="background:#f5f5f5;padding:12px;border-radius:6px;font-size:14px;">${safe.calculatorResult}</p>
          <hr style="margin:16px 0;"/>
          <p style="font-size:13px;color:#999;">Velence Vill Kft. — Automatikus értesítő</p>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 })
  }
}
