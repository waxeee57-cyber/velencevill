'use client';
import { useEffect, useRef, useState } from 'react';
import { keresTermekek, kategoriaIkon, kategoriaNev, ELERHETOSEG_INFO } from '@/lib/termekek';
import { trackEvent } from '@/utils/analytics';

export default function ProductSearch({ onJump }: { onJump?: (termekId: string) => void }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  const talalatok = keresTermekek(query, 8);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function jump(termekId: string) {
    setOpen(false);
    setQuery('');
    trackEvent('product_search_select', { termekId });
    if (onJump) {
      onJump(termekId);
    } else {
      document.getElementById(`termek-${termekId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || talalatok.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, talalatok.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); jump(talalatok[activeIndex].termek.id); }
    else if (e.key === 'Escape') { setOpen(false); }
  }

  return (
    <div ref={boxRef} style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
      <div style={{ position: 'relative' }}>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8899aa" strokeWidth="2" strokeLinecap="round"
          style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setActiveIndex(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Keresés — pl. wago, mcu 1.5, 65-ös doboz…"
          aria-label="Termékkereső"
          aria-expanded={open && talalatok.length > 0}
          role="combobox"
          aria-controls="termek-kereso-lista"
          autoComplete="off"
          style={{
            width: '100%', boxSizing: 'border-box', background: '#0d1f3c',
            border: '1px solid rgba(0,255,239,0.25)', borderRadius: 10,
            padding: '12px 14px 12px 40px', color: '#fff', fontSize: 14, outline: 'none',
          }}
        />
      </div>

      {open && query.trim() && (
        <div
          id="termek-kereso-lista"
          role="listbox"
          className="glass-card"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 30,
            maxHeight: 360, overflowY: 'auto', padding: 6,
          }}
        >
          {talalatok.length === 0 ? (
            <div style={{ padding: '14px 12px' }}>
              <p style={{ fontSize: 13, color: '#8899aa', marginBottom: 8 }}>
                Nincs pontos találat erre: <strong style={{ color: '#fff' }}>„{query}”</strong>
              </p>
              <a href="tel:+36306182165" className="btn-secondary" style={{ fontSize: 12, padding: '6px 12px', textDecoration: 'none', display: 'inline-flex' }}>
                📞 Kérdezze meg telefonon
              </a>
            </div>
          ) : (
            talalatok.map((r, i) => {
              const info = ELERHETOSEG_INFO[r.termek.elerhetoseg];
              return (
                <button
                  key={r.termek.id}
                  type="button"
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => jump(r.termek.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                    padding: '10px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: i === activeIndex ? 'rgba(0,255,239,0.1)' : 'transparent',
                  }}
                >
                  <span style={{ fontSize: 20, width: 32, textAlign: 'center', flexShrink: 0 }}>{kategoriaIkon(r.termek.kategoria)}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.termek.nev}</span>
                    <span style={{ display: 'block', fontSize: 11, color: '#8899aa' }}>{kategoriaNev(r.termek.kategoria)}{r.termek.marka ? ` · ${r.termek.marka}` : ''}</span>
                  </span>
                  <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: info.color, flexShrink: 0 }} title={info.short} />
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
