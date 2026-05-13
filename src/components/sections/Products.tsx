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
    <section id="termekek" style={{ padding: '4rem 2rem', background: '#fff' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Termékkörök</p>
        <h2 style={{ fontSize: 26, fontWeight: 500, color: '#0F172A', marginBottom: 4 }}>Mindent egy helyen</h2>
        <p style={{ fontSize: 14, color: '#64748B', marginBottom: 32 }}>Profi villanyszerelőktől a barkácsolóig — mindenki megtalálja, amire szüksége van.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {PRODUCTS.map(p => (
            <div key={p.title}
              style={{ border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '1.25rem', background: '#fff', transition: 'border-color 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#BFDBFE'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ width: 40, height: 40, background: '#EFF6FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>{p.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', marginBottom: 4 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
