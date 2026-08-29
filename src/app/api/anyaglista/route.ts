import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sanitizeForEmail } from '@/lib/security';
import { insertOne } from '@/lib/blobStore';

const PHONE = '+36 30 618 2165';
const MAX_ITEMS = 60;

interface TetelInput {
  id: string;
  nev: string;
  kategoria?: string;
  marka?: string;
  mennyiseg: number;
}

interface MaterialListRecord {
  id: string;
  created_at: string;
  nev: string;
  telefon: string;
  megjegyzes: string | null;
  tetelek: TetelInput[];
  statusz: string;
  forras: string;
  kesz_at: string | null;
}

function isValidTetel(t: unknown): t is TetelInput {
  if (!t || typeof t !== 'object') return false;
  const o = t as Record<string, unknown>;
  return typeof o.id === 'string' && typeof o.nev === 'string' && typeof o.mennyiseg === 'number' && o.mennyiseg > 0 && o.mennyiseg <= 999;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nev, telefon, megjegyzes, tetelek } = body;

    if (!nev?.trim() || !telefon?.trim()) {
      return NextResponse.json({ error: 'Név és telefonszám megadása kötelező.' }, { status: 400 });
    }
    if (!Array.isArray(tetelek) || tetelek.length === 0) {
      return NextResponse.json({ error: 'Az anyaglista üres.' }, { status: 400 });
    }
    const safeTetelek = tetelek.filter(isValidTetel).slice(0, MAX_ITEMS);
    if (safeTetelek.length === 0) {
      return NextResponse.json({ error: 'Érvénytelen anyaglista.' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    let saved = false;

    // ── 1. Mentés (material_lists kollekció) ──
    try {
      await insertOne<MaterialListRecord>('material_lists', {
        id,
        created_at: new Date().toISOString(),
        nev: nev.trim(),
        telefon: telefon.trim(),
        megjegyzes: megjegyzes?.trim() || null,
        tetelek: safeTetelek,
        statusz: 'uj',
        forras: 'anyaglista_oldal',
        kesz_at: null,
      });
      saved = true;
    } catch {
      /* tárolási hiba — megpróbáljuk az emailt */
    }

    // ── 2. Email értesítés (a hiba NEM végzetes, ha a mentés sikerült) ──
    const resendKey = process.env.RESEND_API_KEY;
    let emailSent = false;
    if (resendKey) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(resendKey);
        const safe = sanitizeForEmail({
          name: nev, phone: telefon, note: megjegyzes || 'Nincs megjegyzés',
        });
        const itemRows = safeTetelek
          .map(t => `<li>${sanitizeForEmail({ n: t.nev }).n} — <strong>${t.mennyiseg} db</strong>${t.marka ? ` (${sanitizeForEmail({ m: t.marka }).m})` : ''}</li>`)
          .join('');
        const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@velencevillkft.hu';
        const toEmail = process.env.RESEND_TO_EMAIL ?? 'velencevillkft@gmail.com';
        await resend.emails.send({
          from: `Velence Vill Weboldal <${fromEmail}>`,
          to: [toEmail],
          subject: `📋 Új anyaglista – ${safe.name} (${safeTetelek.length} tétel)`,
          html: `
            <h2>Új anyaglista érkezett</h2>
            <p><strong>Név:</strong> ${safe.name}</p>
            <p><strong>Telefon:</strong> ${safe.phone}</p>
            <p><strong>Megjegyzés:</strong> ${safe.note}</p>
            <p><strong>Tételek:</strong></p>
            <ul>${itemRows}</ul>
            <hr><p><small>Admin azonosító: ${id}</small></p>
          `,
        });
        emailSent = true;
      } catch {
        /* email hiba elnyelve — lent döntünk a státuszról */
      }
    }

    if (!saved && !emailSent) {
      return NextResponse.json(
        { error: `Nem sikerült rögzíteni a listát. Kérjük hívjon közvetlenül: ${PHONE}` },
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
