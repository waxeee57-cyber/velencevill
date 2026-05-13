'use client';
import { useReveal } from '@/hooks/useReveal';

const BENEFITS = [
  {
    icon: '⚡',
    title: 'Törzsvásárlói kedvezmény',
    desc: 'Regisztrált partnereknek automatikus árengedmény minden vásárlásnál, kérdés nélkül.',
  },
  {
    icon: '📋',
    title: 'Havi elszámolás',
    desc: 'Szállítóleveles vásárlás, hónap végén egy számla. Nem kell minden alkalommal fizetni.',
  },
  {
    icon: '📞',
    title: 'Prioritásos kiszolgálás',
    desc: 'Partnereknek külön telefonvonal. Anyag előre lefoglalása, mire odaér már várja.',
  },
  {
    icon: '🔔',
    title: 'Elsők között értesülsz',
    desc: 'Új termékek, akciók — partnerek egy nappal korábban kapnak értesítést.',
  },
];

export default function ProSection() {
  const gridRef = useReveal<HTMLDivElement>(true);

  return (
    <section
      id="szakembereknek"
      style={{
        padding: '4rem 1.5rem',
        background: '#0d1f3c',
        borderTop: '0.5px solid rgba(0,255,239,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}>
      {/* Decorative bolt */}
      <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.05 }}>
        <svg width="200" height="320" viewBox="0 0 24 38" fill="none" stroke="#00FFEF" strokeWidth="0.5">
          <path d="M13 2L3 20h9l-1 16 10-19h-9l1-17z"/>
        </svg>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative' }}>
        <p className="section-label" style={{ marginBottom: 8 }}>VILLANYSZERELŐKNEK</p>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 12, lineHeight: 1.2 }}>
          Szakmai partner program
        </h2>
        <p style={{ fontSize: 15, color: '#8899aa', marginBottom: 36, maxWidth: 480 }}>
          Regisztrált villanyszerelőknek különleges feltételek
        </p>

        <div
          ref={gridRef}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 36 }}>
          {BENEFITS.map(b => (
            <div
              key={b.title}
              className="glass-card reveal"
              style={{ padding: '1.25rem', cursor: 'default', transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,255,239,0.1)';
                e.currentTarget.style.borderColor = 'rgba(0,255,239,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(0,255,239,0.15)';
              }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{b.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{b.title}</h3>
              <p style={{ fontSize: 13, color: '#8899aa', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => document.getElementById('ajanlat')?.scrollIntoView({ behavior: 'smooth' })}
          className="btn-primary"
          style={{ fontSize: 14 }}>
          Regisztrálj szakmai partnerként →
        </button>
      </div>
    </section>
  );
}
