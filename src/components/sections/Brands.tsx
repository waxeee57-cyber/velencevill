'use client';

const BRANDS = [
  { name: 'TRACON',    sub: 'Electric',  tag: 'Szerelés' },
  { name: 'Schneider', sub: 'Electric',  tag: 'Automatika' },
  { name: 'LEGRAND',   sub: '',          tag: 'Kapcsolók' },
  { name: 'Kanlux',    sub: '',          tag: 'Világítás' },
  { name: 'Rábalux',   sub: '',          tag: 'Lámpák' },
  { name: 'EGLO',      sub: '',          tag: 'Design lámpa' },
  { name: 'GLOBO',     sub: '',          tag: 'Világítás' },
  { name: 'EMOS',      sub: '',          tag: 'Szerelvény' },
  { name: 'KOPP',      sub: '',          tag: 'Kapcsolók' },
  { name: 'OBO',       sub: '',          tag: 'Csatornák' },
  { name: 'Csatári',   sub: 'Plast',     tag: 'Szekrények' },
  { name: 'Famatel',   sub: '',          tag: 'Elosztók' },
  { name: 'Mentavill', sub: '',          tag: 'Nagyker' },
];

export default function Brands() {
  return (
    <section id="markak" style={{ padding: '4rem 2rem', background: '#0d1f3c', borderTop: '0.5px solid rgba(0,255,239,0.08)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Forgalmazott márkák</p>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>13 vezető gyártó — egy helyen</h2>
        <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 32 }}>Az iparág legelismertebb márkáit forgalmazzuk szaküzletünkben</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          {BRANDS.map(b => (
            <div key={b.name}
              style={{ background: 'rgba(6,13,24,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,255,239,0.12)', borderRadius: 12, padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minHeight: 90, justifyContent: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease', transformStyle: 'preserve-3d', cursor: 'default' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px) rotateX(4deg) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,255,239,0.15)';
                e.currentTarget.style.borderColor = 'rgba(0,255,239,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) rotateX(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(0,255,239,0.12)';
              }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', textAlign: 'center', lineHeight: 1.3 }}>
                {b.name}{b.sub && <><br /><span style={{ fontSize: 11, fontWeight: 500, color: '#8899aa' }}>{b.sub}</span></>}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 10, background: 'rgba(0,255,239,0.08)', color: '#00FFEF', border: '0.5px solid rgba(0,255,239,0.2)' }}>{b.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
