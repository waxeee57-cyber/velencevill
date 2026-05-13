'use client';
import { useReveal } from '@/hooks/useReveal';

const PRODUCTS = [
  { icon: '⚡', title: 'Kábelek & vezetékek', desc: 'Erős- és gyengeáramú kábelek, tömítőrendszerek', badge: true },
  { icon: '🔌', title: 'Kapcsolók & dugaljak', desc: 'Legrand, Schneider, Kanlux — teljes kínálat', badge: false },
  { icon: '🗄️', title: 'Elosztók & szekrények', desc: 'Lakás- és ipari elosztók, Csatári Plast szekrények', badge: false },
  { icon: '💡', title: 'Világítástechnika', desc: 'EGLO, Rábalux, GLOBO — beltéri és kültéri', badge: false },
  { icon: '🔧', title: 'Szerelési anyagok', desc: 'OBO csatornák, csövek, rögzítők, dobozok', badge: true },
  { icon: '🛠️', title: 'Szerszámok & mérők', desc: '1000V szigetelt szerszámok, fázisérzékelők', badge: true },
];

export default function Products() {
  const ref = useReveal<HTMLElement>(true);

  return (
    <section id="termekek" ref={ref} style={{ padding: '4rem 2rem', background: '#060d18' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <p className="section-label reveal" style={{ marginBottom: 6 }}>Termékkörök</p>
        <h2 className="reveal" style={{ fontSize: 26, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>Mindent egy helyen</h2>
        <p className="reveal" style={{ fontSize: 14, color: '#8899aa', marginBottom: 32 }}>Profi villanyszerelőktől a barkácsolóig — mindenki megtalálja, amire szüksége van.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {PRODUCTS.map(p => (
            <div key={p.title} className="reveal"
              style={{ position: 'relative', background: 'rgba(13,31,60,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,255,239,0.15)', borderRadius: 12, padding: '1.25rem', transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease', transformStyle: 'preserve-3d', cursor: 'default' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px) rotateX(4deg) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,255,239,0.15), 0 0 0 1px rgba(0,255,239,0.3)';
                e.currentTarget.style.borderColor = 'rgba(0,255,239,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) rotateX(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(0,255,239,0.15)';
              }}>
              {p.badge && (
                <div style={{ position: 'absolute', top: 8, right: 8, background: '#00FFEF', color: '#000', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 8, letterSpacing: '0.04em' }}>
                  ⚡ Szakembereknek
                </div>
              )}
              <div style={{ width: 44, height: 44, background: 'rgba(0,255,239,0.07)', border: '0.5px solid rgba(0,255,239,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>{p.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: '#8899aa', lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
