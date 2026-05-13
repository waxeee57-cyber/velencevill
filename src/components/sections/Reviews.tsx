'use client';
import { useReveal } from '@/hooks/useReveal';

const REVIEWS = [
  { nev: 'Kovács András',          csillag: 5, szoveg: 'Gyors kiszolgálás, minden megvolt amit kerestem. Legrand kapcsolókat vettem, nagyon elégedett vagyok.', datum: '2025. március' },
  { nev: 'Horváth Péter',          csillag: 5, szoveg: 'Szakértő segítség, pontos tanácsot adtak az elosztótábla cseréhez. Ajánlom mindenkinek!', datum: '2025. február' },
  { nev: 'Szabó Villanyszerelő Bt.', csillag: 5, szoveg: 'Rendszeres vásárló vagyok, minden Tracon és Schneider anyagot itt szerzek be. Megbízható partner.', datum: '2025. január' },
  { nev: 'Nagy Zsuzsanna',          csillag: 5, szoveg: 'Lámpacsere ügyben segítettek, szép Rábalux kínálatból választottam. Profi, kedves csapat.', datum: '2024. december' },
  { nev: 'Tóth Balázs',             csillag: 5, szoveg: 'Sürgős javításhoz kellett anyag, azonnal kiszolgáltak. Velencén ez az egyetlen hely ahol minden megvan.', datum: '2024. november' },
];

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export default function Reviews() {
  const ref = useReveal<HTMLElement>(true);

  return (
    <section ref={ref} style={{ padding: '4rem 2rem', background: '#0d1f3c', borderTop: '0.5px solid rgba(0,255,239,0.08)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <p className="section-label reveal" style={{ marginBottom: 6 }}>Vásárlói vélemények</p>
        <h2 className="reveal" style={{ fontSize: 26, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>Mit mondanak rólunk?</h2>
        <p className="reveal" style={{ fontSize: 14, color: '#8899aa', marginBottom: 32 }}>Elégedett vásárlóink visszajelzései</p>

        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <div key={i} className="reveal glass-card"
              style={{ padding: '1.25rem', transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease', transformStyle: 'preserve-3d', cursor: 'default' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px) rotateX(4deg) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,255,239,0.15)';
                e.currentTarget.style.borderColor = 'rgba(0,255,239,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) rotateX(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(0,255,239,0.15)';
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,255,239,0.1)', border: '1.5px solid rgba(0,255,239,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#00FFEF', flexShrink: 0 }}>
                  {initials(r.nev)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>{r.nev}</div>
                  <div style={{ fontSize: 11, color: '#8899aa' }}>{r.datum}</div>
                </div>
              </div>
              <div style={{ marginBottom: 10 }}>
                {'⭐'.repeat(r.csillag)}
              </div>
              <p style={{ fontSize: 13, color: '#8899aa', lineHeight: 1.7, margin: 0 }}>{r.szoveg}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
