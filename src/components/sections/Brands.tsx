'use client';

const BRANDS = [
  { name: 'TRACON',    sub: 'Electric',  color: '#CC0000', tag: 'Szerelés' },
  { name: 'Schneider', sub: 'Electric',  color: '#3DCD58', tag: 'Automatika' },
  { name: 'LEGRAND',   sub: '',          color: '#00265E', tag: 'Kapcsolók' },
  { name: 'Kanlux',    sub: '',          color: '#E30613', tag: 'Világítás' },
  { name: 'Rábalux',   sub: '',          color: '#B8860B', tag: 'Lámpák' },
  { name: 'EGLO',      sub: '',          color: '#E30613', tag: 'Design lámpa' },
  { name: 'GLOBO',     sub: '',          color: '#003DA5', tag: 'Világítás' },
  { name: 'EMOS',      sub: '',          color: '#00529B', tag: 'Szerelvény' },
  { name: 'KOPP',      sub: '',          color: '#004A97', tag: 'Kapcsolók' },
  { name: 'OBO',       sub: '',          color: '#E30613', tag: 'Csatornák' },
  { name: 'Csatári',   sub: 'Plast',     color: '#1A5276', tag: 'Szekrények' },
  { name: 'Famatel',   sub: '',          color: '#F57C00', tag: 'Elosztók' },
  { name: 'Mentavill', sub: '',          color: '#2E7D32', tag: 'Nagyker' },
];

export default function Brands() {
  return (
    <section id="markak" style={{ padding: '4rem 2rem', background: '#F8FAFC', borderTop: '0.5px solid #E2E8F0' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Forgalmazott márkák</p>
        <h2 style={{ fontSize: 26, fontWeight: 500, color: '#0F172A', marginBottom: 4 }}>13 vezető gyártó — egy helyen</h2>
        <p style={{ fontSize: 14, color: '#64748B', marginBottom: 32 }}>Az iparág legelismertebb márkáit forgalmazzuk szaküzletünkben</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          {BRANDS.map(b => (
            <div key={b.name}
              style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minHeight: 90, justifyContent: 'center', transition: 'border-color 0.15s', cursor: 'default' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#93C5FD')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#E2E8F0')}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: b.color }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: b.color, textAlign: 'center', lineHeight: 1.2 }}>
                {b.name}{b.sub && <><br /><span style={{ fontSize: 11 }}>{b.sub}</span></>}
              </div>
              <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 7px', borderRadius: 10, background: '#F1F5F9', color: '#64748B' }}>{b.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
