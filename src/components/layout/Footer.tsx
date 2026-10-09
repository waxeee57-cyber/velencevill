'use client';

export default function Footer() {
  return (
    <footer style={{ background: '#060d18', color: '#8899aa', padding: '2.5rem 2rem 1.5rem', borderTop: '0.5px solid rgba(0,255,239,0.08)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(0,255,239,0.08)', border: '0.5px solid rgba(0,255,239,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>Velence <span style={{ color: '#00FFEF' }}>Vill</span> Kft.</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>Villanyszerelési szaküzlet Velencén — profiknak és magánvásárlóknak.</p>
          </div>
          <div>
            <h2 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', marginBottom: 10 }}>Elérhetőség</h2>
            <p style={{ fontSize: 13, lineHeight: 1.9 }}>Fecske utca 12.<br />2481 Velence<br />H–P: 8:00–16:00<br />Szo: 8:00–12:00<br />V: Zárva</p>
          </div>
          <div>
            <h2 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', marginBottom: 10 }}>Oldalak</h2>
            {[
              { label: 'Főoldal', href: '/' },
              { label: 'Termékkörök', href: '/termekek' },
              { label: 'Márkák', href: '/markak' },
              { label: 'Villanyszerelő', href: '/szerelo' },
              { label: 'Tudástár', href: '/tudastar' },
              { label: 'Kalkulátorok', href: '/kalkulator' },
              { label: 'Ajánlatot kérek', href: '/#ajanlat' },
            ].map(l => (
              <a key={l.label} href={l.href} style={{ display: 'block', fontSize: 13, lineHeight: 2, color: '#8899aa', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F1F5F9')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8899aa')}>{l.label}</a>
            ))}
          </div>
          {/* 2026-09-13 — Kiszolgált települések blokk.
              Ezt megelőzően a /helyi/* oldalakra NULLA belső link mutatott az egész
              oldalról (mérve mind a 13 publikus oldalon), vagyis teljes orphanok voltak:
              az egyetlen felfedezési útvonaluk a sitemap volt. */}
          <div>
            <h2 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', marginBottom: 10 }}>Kiszolgált települések</h2>
            {[
              { label: 'Velence', href: '/helyi/velence' },
              { label: 'Gárdony és Agárd', href: '/helyi/gardony' },
              { label: 'Fejér megye', href: '/helyi/fejer-megye' },
              { label: 'Összes terület', href: '/helyi' },
            ].map(l => (
              <a key={l.label} href={l.href} style={{ display: 'block', fontSize: 13, lineHeight: 2, color: '#8899aa', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F1F5F9')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8899aa')}>{l.label}</a>
            ))}
          </div>
          <div>
            <h2 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', marginBottom: 10 }}>Jogi</h2>
            {[
              { label: 'Adatvédelmi tájékoztató', href: '/adatvedelem' },
              { label: 'ÁSZF', href: '/aszf' },
              { label: 'Cookie tájékoztató', href: '/cookie-tajekoztato' },
            ].map(l => (
              <a key={l.label} href={l.href} style={{ display: 'block', fontSize: 13, lineHeight: 2, color: '#8899aa', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F1F5F9')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8899aa')}>{l.label}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', paddingTop: 16, fontSize: 12, textAlign: 'center', color: '#8899aa' }}>
          © {new Date().getFullYear()} Velence Vill Kft. — Minden jog fenntartva · Velence, Fecske u. 12.
        </div>
      </div>
    </footer>
  );
}
