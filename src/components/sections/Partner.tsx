export default function Partner() {
  return (
    <section id="szerelo" style={{ padding: '4rem 2rem', background: '#fff', borderTop: '0.5px solid #E2E8F0' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Partnerünk</p>
        <h2 style={{ fontSize: 26, fontWeight: 500, color: '#0F172A', marginBottom: 4 }}>Megbízható villanyszerelőt keres?</h2>
        <p style={{ fontSize: 14, color: '#64748B', marginBottom: 32 }}>Ajánlott partnerünk vállalja a kivitelezést — mi biztosítjuk az anyagot.</p>
        <div style={{ border: '0.5px solid #E2E8F0', borderRadius: 16, padding: '1.5rem 1.75rem', display: 'flex', gap: 20, alignItems: 'flex-start', maxWidth: 560 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#EFF6FF', border: '2px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16, fontWeight: 600, color: '#1D4ED8' }}>MJ</div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 500, color: '#15803D', background: '#F0FDF4', border: '0.5px solid #BBF7D0', padding: '2px 8px', borderRadius: 12, marginBottom: 8 }}>
              ✓ Regisztrált villanyszerelő
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>Mike József</h3>
            <p style={{ fontSize: 13, color: '#1D4ED8', marginBottom: 10 }}>Velence és környéke · Fejér megye</p>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginBottom: 14 }}>
              Teljes körű villanyszerelési munkák — új építéstől a felújításig. Hibaelhárítás, elosztótábla csere, mérőhely kialakítás.
            </p>
            <a href="tel:+36306182166" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#22C55E', color: '#fff', fontSize: 14, fontWeight: 600, padding: '9px 18px', borderRadius: 8, textDecoration: 'none' }}>
              📞 +36 30 618 2166
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
