'use client';
import { useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductSearch from '@/components/ProductSearch';
import { KATEGORIAK, TERMEKEK } from '@/lib/termekek';

export default function TermekekCatalog() {
  const [aktivKategoria, setAktivKategoria] = useState<string | 'osszes'>('osszes');

  const szurt = useMemo(
    () => (aktivKategoria === 'osszes' ? TERMEKEK : TERMEKEK.filter(t => t.kategoria === aktivKategoria)),
    [aktivKategoria],
  );

  function jumpToProduct(termekId: string) {
    const termek = TERMEKEK.find(t => t.id === termekId);
    if (termek) setAktivKategoria(termek.kategoria);
    requestAnimationFrame(() => {
      document.getElementById(`termek-${termekId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <ProductSearch onJump={jumpToProduct} />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        <button
          type="button"
          onClick={() => setAktivKategoria('osszes')}
          style={chipStyle(aktivKategoria === 'osszes')}
        >
          Összes
        </button>
        {KATEGORIAK.map(k => (
          <button key={k.slug} type="button" onClick={() => setAktivKategoria(k.slug)} style={chipStyle(aktivKategoria === k.slug)}>
            {k.ikon} {k.nev}
          </button>
        ))}
      </div>

      {/* Az aktív kategória h2-ként. Két okból kell:
          1. Heading-hierarchia: a ProductCard címei h3-ak, közéjük és a lap h1-je
             közé kellett egy h2 — korábban h1 → h3 ugrás volt (mérve élesben).
          2. A látogató a szűrés után lássa, mit néz éppen, és hány tétel van. */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 16 }}>
        {aktivKategoria === 'osszes'
          ? 'Összes termék'
          : KATEGORIAK.find(k => k.slug === aktivKategoria)?.nev ?? 'Termékek'}{' '}
        <span style={{ fontSize: 14, fontWeight: 500, color: '#8899aa' }}>
          ({szurt.length} tétel)
        </span>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
        {szurt.map(termek => (
          <ProductCard key={termek.id} termek={termek} kategoriaIkon={KATEGORIAK.find(k => k.slug === termek.kategoria)?.ikon ?? '⚡'} />
        ))}
      </div>

      {szurt.length === 0 && (
        <p style={{ color: '#8899aa', fontSize: 14, textAlign: 'center', padding: '3rem 0' }}>Ebben a kategóriában egyelőre nincs feltöltött tétel — hívjon minket, biztosan van raktáron.</p>
      )}
    </div>
  );
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    padding: '8px 16px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    border: active ? '1px solid rgba(0,255,239,0.5)' : '1px solid rgba(0,255,239,0.15)',
    background: active ? 'rgba(0,255,239,0.12)' : 'rgba(13,31,60,0.6)',
    color: active ? '#00FFEF' : '#8899aa',
    transition: 'all 0.2s',
  };
}
