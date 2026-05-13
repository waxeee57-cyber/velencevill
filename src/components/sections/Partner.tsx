'use client';

export default function Partner() {
  return (
    <section id="szerelo" style={{ padding: '4rem 2rem', background: '#060d18', borderTop: '0.5px solid rgba(0,255,239,0.08)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Partnerünk</p>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>Megbízható villanyszerelőt keres?</h2>
        <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 32 }}>Ajánlott partnerünk vállalja a kivitelezést — mi biztosítjuk az anyagot.</p>
        <div
          style={{ background: 'rgba(13,31,60,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,255,239,0.15)', borderRadius: 16, padding: '1.5rem 1.75rem', display: 'flex', gap: 20, alignItems: 'flex-start', maxWidth: 560, transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease', transformStyle: 'preserve-3d' }}
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
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(0,255,239,0.07)', border: '1.5px solid rgba(0,255,239,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16, fontWeight: 700, color: '#00FFEF' }}>MJ</div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '0.5px solid rgba(74,222,128,0.2)', padding: '2px 8px', borderRadius: 12, marginBottom: 8 }}>
              ✓ Regisztrált villanyszerelő
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>Mike József</h3>
            <p style={{ fontSize: 13, color: '#00FFEF', marginBottom: 10 }}>Velence és környéke · Fejér megye</p>
            <p style={{ fontSize: 13, color: '#8899aa', lineHeight: 1.7, marginBottom: 14 }}>
              Teljes körű villanyszerelési munkák — új építéstől a felújításig. Hibaelhárítás, elosztótábla csere, mérőhely kialakítás.
            </p>
            <a href="tel:+36306182166"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)', fontSize: 14, fontWeight: 600, padding: '9px 18px', borderRadius: 10, textDecoration: 'none', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; }}>
              📞 +36 30 618 2166
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
