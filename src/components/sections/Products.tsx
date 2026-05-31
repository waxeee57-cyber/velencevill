'use client';
import { useReveal } from '@/hooks/useReveal';

const svg = (children: React.ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

const ICONS: Record<string, React.ReactNode> = {
  cable: svg(<><path d="M4 4v5a4 4 0 0 0 4 4h8a4 4 0 0 1 4 4v3"/><path d="M2 4h4"/><path d="M18 17h4"/></>),
  plug: svg(<><path d="M12 22v-5"/><path d="M9 7V2"/><path d="M15 7V2"/><path d="M6 7h12v3a6 6 0 0 1-12 0V7z"/></>),
  cabinet: svg(<><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M4 12h16"/><path d="M9 7h.01"/><path d="M9 17h.01"/></>),
  bulb: svg(<><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></>),
  wrench: svg(<path d="M14.7 6.3a4 4 0 0 0-5.3 5.3L3 18l3 3 6.4-6.4a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z"/>),
  tools: svg(<><path d="m15 12-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9"/><path d="M17.6 6.8 21 3.4 20.6 3a3 3 0 0 0-4.2 0l-2.8 2.8"/><path d="m9 12 6 6"/></>),
};

const PRODUCTS = [
  { icon: 'cable',   title: 'Kábelek & vezetékek', desc: 'Erős- és gyengeáramú kábelek, tömítőrendszerek', badge: true },
  { icon: 'plug',    title: 'Kapcsolók & dugaljak', desc: 'Legrand, Schneider, Kanlux — teljes kínálat', badge: false },
  { icon: 'cabinet', title: 'Elosztók & szekrények', desc: 'Lakás- és ipari elosztók, Csatári Plast szekrények', badge: false },
  { icon: 'bulb',    title: 'Világítástechnika', desc: 'EGLO, Rábalux, GLOBO — beltéri és kültéri', badge: false },
  { icon: 'wrench',  title: 'Szerelési anyagok', desc: 'OBO csatornák, csövek, rögzítők, dobozok', badge: true },
  { icon: 'tools',   title: 'Szerszámok & mérők', desc: '1000V szigetelt szerszámok, fázisérzékelők', badge: true },
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
                <div style={{ position: 'absolute', top: 8, right: 8, background: '#00FFEF', color: '#000', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 8, letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#000" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  Szakembereknek
                </div>
              )}
              <div style={{ width: 44, height: 44, background: 'rgba(0,255,239,0.07)', border: '0.5px solid rgba(0,255,239,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>{ICONS[p.icon]}</div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: '#8899aa', lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
