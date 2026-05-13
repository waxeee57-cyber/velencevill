'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ARTICLES, CATEGORY_LABELS, type Category } from './articles';

const FILTERS: { key: 'all' | Category; label: string }[] = [
  { key: 'all',      label: 'Összes' },
  { key: 'szakmai',  label: 'Szakmai' },
  { key: 'diy',      label: 'DIY' },
  { key: 'termek',   label: 'Termék' },
];

export default function TudasTarGrid() {
  const [active, setActive] = useState<'all' | Category>('all');

  const filtered = active === 'all' ? ARTICLES : ARTICLES.filter(a => a.category === active);

  return (
    <>
      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            style={{
              padding: '7px 18px',
              borderRadius: 50,
              border: `1px solid ${active === f.key ? '#00FFEF' : 'rgba(0,255,239,0.2)'}`,
              background: active === f.key ? 'rgba(0,255,239,0.12)' : 'transparent',
              color: active === f.key ? '#00FFEF' : '#8899aa',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Article grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map(a => (
          <Link
            key={a.slug}
            href={`/tudastar/${a.slug}`}
            style={{ textDecoration: 'none' }}>
            <div
              className="glass-card"
              style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column', gap: 10, transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease', cursor: 'pointer' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,255,239,0.1)';
                e.currentTarget.style.borderColor = 'rgba(0,255,239,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(0,255,239,0.15)';
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 10, background: 'rgba(0,255,239,0.08)', color: '#00FFEF', border: '0.5px solid rgba(0,255,239,0.2)', whiteSpace: 'nowrap' }}>
                  {CATEGORY_LABELS[a.category]}
                </span>
                <span style={{ fontSize: 11, color: '#475569', whiteSpace: 'nowrap' }}>{a.readTime} perc</span>
              </div>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.4, margin: 0, flex: 1 }}>{a.title}</h2>
              <p style={{ fontSize: 13, color: '#8899aa', lineHeight: 1.6, margin: 0 }}>{a.description}</p>
              <div style={{ fontSize: 13, color: '#00FFEF', fontWeight: 500 }}>Elolvasom →</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
