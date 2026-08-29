'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Toast from '@/components/ui/Toast';
import { useAnyaglista } from '@/hooks/useAnyaglista';
import { setQty, removeItem, clearAll } from '@/lib/anyaglistaStore';
import { kategoriaNev } from '@/lib/termekek';
import { trackEvent } from '@/utils/analytics';

const PHONE = '+36 30 618 2165';

export default function AnyaglistaClient() {
  const items = useAnyaglista();
  const [form, setForm] = useState({ nev: '', telefon: '', megjegyzes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [sentRef, setSentRef] = useState<string | null>(null);
  const [shopReply, setShopReply] = useState<string | null>(null);

  useEffect(() => {
    if (!sentRef || sentRef === 'OK') return;
    let cancelled = false;
    const started = Date.now();
    const MAX_MS = 15 * 60 * 1000;
    async function poll() {
      if (Date.now() - started > MAX_MS) return;
      try {
        const res = await fetch(`/api/anyaglista?id=${encodeURIComponent(sentRef!)}`);
        const data = await res.json().catch(() => ({}));
        if (!cancelled && typeof data.valasz === 'string' && data.valasz.trim()) {
          setShopReply(data.valasz);
        }
      } catch {
        /* a vevő a sikeres oldalon marad — a poll hiba nem zavar */
      }
    }
    poll();
    const t = setInterval(poll, 4000);
    return () => { cancelled = true; clearInterval(t); };
  }, [sentRef]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nev.trim() || !form.telefon.trim()) {
      setToast({ message: 'Név és telefonszám megadása kötelező.', type: 'error' });
      return;
    }
    if (items.length === 0) {
      setToast({ message: 'Az anyaglista üres — adjon hozzá legalább egy tételt.', type: 'error' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/anyaglista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nev: form.nev.trim(),
          telefon: form.telefon.trim(),
          megjegyzes: form.megjegyzes.trim(),
          tetelek: items,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'A küldés nem sikerült.');
      trackEvent('anyaglista_submit', { itemCount: items.length });
      setSentRef(data.id ?? 'OK');
      clearAll();
      setForm({ nev: '', telefon: '', megjegyzes: '' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ismeretlen hiba';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  if (sentRef) {
    return (
      <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Megkaptuk az anyaglistáját!</h2>
        <p style={{ fontSize: 14, color: '#8899aa', lineHeight: 1.7, marginBottom: 20 }}>
          Munkatársunk összekészíti a tételeket, és <strong style={{ color: '#fff' }}>telefonon visszahívjuk</strong> az árral és az átvétel részleteivel —
          jellemzően még aznap, vagy legkésőbb a következő nyitvatartási napon reggel.
        </p>
        {shopReply && (
          <div style={{ textAlign: 'left', marginBottom: 20, padding: '14px 16px', border: '1px solid rgba(0,255,239,0.3)', borderRadius: 12, background: 'rgba(0,255,239,0.06)' }}>
            <p style={{ fontSize: 11, color: '#00FFEF', letterSpacing: '0.08em', margin: '0 0 6px', fontWeight: 600 }}>VÁLASZ A BOLTTÓL</p>
            <p style={{ fontSize: 14, color: '#fff', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{shopReply}</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/termekek" className="btn-secondary" style={{ textDecoration: 'none', fontSize: 14 }}>Új lista összeállítása</Link>
          <a href={`tel:${PHONE.replace(/\s+/g, '')}`} className="btn-primary" style={{ textDecoration: 'none', fontSize: 14 }}>📞 Hívom most inkább</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: items.length ? '1fr' : '1fr', gap: 32, maxWidth: 720, margin: '0 auto' }}>
      {items.length === 0 ? (
        <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <p style={{ fontSize: 15, color: '#8899aa', marginBottom: 18 }}>Az anyaglistája jelenleg üres.</p>
          <Link href="/termekek" className="btn-primary" style={{ textDecoration: 'none', fontSize: 14 }}>Termékek böngészése</Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(item => (
              <div key={item.id} className="glass-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>{item.nev}</p>
                  <p style={{ fontSize: 12, color: '#8899aa', margin: 0 }}>{kategoriaNev(item.kategoria)}{item.marka ? ` · ${item.marka}` : ''}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button type="button" onClick={() => setQty(item.id, item.mennyiseg - 1)} aria-label="Mennyiség csökkentése" style={stepperBtn}>−</button>
                  <span style={{ minWidth: 24, textAlign: 'center', fontSize: 14, color: '#fff', fontWeight: 600 }}>{item.mennyiseg}</span>
                  <button type="button" onClick={() => setQty(item.id, item.mennyiseg + 1)} aria-label="Mennyiség növelése" style={stepperBtn}>+</button>
                </div>
                <button type="button" onClick={() => removeItem(item.id)} aria-label={`${item.nev} eltávolítása`} style={{ background: 'none', border: 'none', color: '#f87171', fontSize: 12, cursor: 'pointer', padding: '4px 8px' }}>
                  Törlés
                </button>
              </div>
            ))}
            <button type="button" onClick={clearAll} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: '#8899aa', fontSize: 12, cursor: 'pointer', padding: '8px 0' }}>
              Egész lista törlése
            </button>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <p style={{ fontSize: 12, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>Elküldés a boltnak</p>
            <p style={{ fontSize: 13, color: '#8899aa', marginBottom: 18, lineHeight: 1.6 }}>
              Ár és pontos darabszám nélkül küldi el — mi visszahívjuk az összeggel és az átvétel idejével.
              Éjszaka is beküldheti: reggel nyitáskor már ez az első a listánkon.
            </p>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-row-grid">
                <div>
                  <label htmlFor="al-nev" style={{ display: 'block', fontSize: 12, color: '#8899aa', marginBottom: 4 }}>Név *</label>
                  <input id="al-nev" type="text" value={form.nev} onChange={e => setForm({ ...form, nev: e.target.value })} disabled={submitting} style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="al-tel" style={{ display: 'block', fontSize: 12, color: '#8899aa', marginBottom: 4 }}>Telefonszám *</label>
                  <input id="al-tel" type="tel" value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} disabled={submitting} style={inputStyle} />
                </div>
              </div>
              <div>
                <label htmlFor="al-megj" style={{ display: 'block', fontSize: 12, color: '#8899aa', marginBottom: 4 }}>Megjegyzés (opcionális)</label>
                <textarea id="al-megj" rows={3} value={form.megjegyzes} onChange={e => setForm({ ...form, megjegyzes: e.target.value })} disabled={submitting} placeholder="pl. mikor jönne érte, vagy bármi extra kérés" style={{ ...inputStyle, resize: 'none' }} />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary" style={{ justifyContent: 'center', padding: '13px 20px', opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'Küldés...' : `Anyaglista elküldése (${items.reduce((s, i) => s + i.mennyiseg, 0)} tétel)`}
              </button>
            </form>
          </div>
        </>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

const stepperBtn: React.CSSProperties = {
  width: 26, height: 26, borderRadius: 6, border: '1px solid rgba(0,255,239,0.2)', background: 'transparent',
  color: '#00FFEF', fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
};

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', background: '#060d18', border: '1px solid rgba(0,255,239,0.2)',
  borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none',
};
