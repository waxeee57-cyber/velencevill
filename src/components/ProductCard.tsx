'use client';
import { useState } from 'react';
import AvailabilityBadge from '@/components/AvailabilityBadge';
import { addItem } from '@/lib/anyaglistaStore';
import { trackEvent } from '@/utils/analytics';
import type { Termek } from '@/lib/termekek';

const PHONE = '+36 30 618 2165';

export default function ProductCard({ termek, kategoriaIkon }: { termek: Termek; kategoriaIkon: string }) {
  const [added, setAdded] = useState(false);

  function hozzaad() {
    addItem({ id: termek.id, nev: termek.nev, kategoria: termek.kategoria, marka: termek.marka }, 1);
    trackEvent('anyaglista_add', { termekId: termek.id, nev: termek.nev });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div
      id={`termek-${termek.id}`}
      className="glass-card"
      style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 10, scrollMarginTop: 90 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontSize: 24 }}>{kategoriaIkon}</div>
        <AvailabilityBadge status={termek.elerhetoseg} compact />
      </div>

      <div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4, lineHeight: 1.35 }}>{termek.nev}</h3>
        {termek.marka && <p style={{ fontSize: 12, color: '#00FFEF', marginBottom: 6 }}>{termek.marka}</p>}
        <p style={{ fontSize: 13, color: '#8899aa', lineHeight: 1.6, marginBottom: 0 }}>{termek.leiras}</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {termek.cimkek.map(t => (
          <span
            key={t}
            style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 8px', borderRadius: 10, background: 'rgba(0,255,239,0.08)', color: '#00FFEF', border: '0.5px solid rgba(0,255,239,0.2)' }}
          >
            {t}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={hozzaad}
          className="btn-primary"
          style={{ flex: 1, minWidth: 160, justifyContent: 'center', padding: '9px 14px', fontSize: 13, opacity: added ? 0.75 : 1 }}
        >
          {added ? '✓ Hozzáadva' : '+ Anyaglistához'}
        </button>
        <a
          href={`tel:${PHONE.replace(/\s+/g, '')}`}
          onClick={() => trackEvent('product_call_click', { termekId: termek.id })}
          className="btn-secondary"
          style={{ padding: '9px 14px', fontSize: 13, textDecoration: 'none' }}
          aria-label={`Hívja a pultost a(z) ${termek.nev} miatt`}
        >
          📞 Pultos hívása
        </a>
      </div>
    </div>
  );
}
