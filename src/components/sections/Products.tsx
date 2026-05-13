'use client';

const PRODUCTS = [
  { icon: '⚡', title: 'Kábelek & vezetékek', desc: 'Erős- és gyengeáramú kábelek, tömítőrendszerek' },
  { icon: '🔌', title: 'Kapcsolók & dugaljak', desc: 'Legrand, Schneider, Kanlux — teljes kínálat' },
  { icon: '🗄️', title: 'Elosztók & szekrények', desc: 'Lakás- és ipari elosztók, Csatári Plast szekrények' },
  { icon: '💡', title: 'Világítástechnika', desc: 'EGLO, Rábalux, GLOBO — beltéri és kültéri' },
  { icon: '🔧', title: 'Szerelési anyagok', desc: 'OBO csatornák, csövek, rögzítők, dobozok' },
  { icon: '🛠️', title: 'Szerszámok & mérők', desc: '1000V szigetelt szerszámok, fázisérzékelők' },
];

export default function Products() {
  return (
    <section id="termekek" style={{ padding: '4rem 2rem', background: '#060d18' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Termékkörök</p>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>Mindent egy helyen</h2>
        <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 32 }}>Profi villanyszerelőktől a barkácsolóig — mindenki megtalálja, amire szüksége van.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {PRODUCTS.map(p => (
            <div key={p.title}
              style={{ background: 'rgba(13,31,60,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,255,239,0.15)', borderRadius: 12, padding: '1.25rem', transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease', transformStyle: 'preserve-3d', cursor: 'default' }}
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
