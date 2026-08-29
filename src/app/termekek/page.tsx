import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AvailabilityBadge from '@/components/AvailabilityBadge';
import TermekekCatalog from './TermekekCatalog';

export const metadata: Metadata = {
  title: 'Termékek',
  description: 'Villanyszerelési termékek kereshető katalógusa: kábelek, kapcsolók, elosztók, világítástechnika, szerelési anyagok és szerszámok. Elérhetőségi jelzéssel, azonnali anyaglista-küldéssel.',
  keywords: ['villanyszerelési termékek', 'kábelek', 'kapcsolók', 'elosztók', 'világítástechnika', 'villanyszerelési anyagok Velence'],
  alternates: { canonical: '/termekek' },
};

export default function TermekekPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#060d18', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '4rem 2rem' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>Termékek</p>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#ffffff', marginBottom: 12, lineHeight: 1.2 }}>Kereshető termékkatalógus</h1>
          <p style={{ fontSize: 15, color: '#8899aa', marginBottom: 20, maxWidth: 640 }}>
            Keressen rá bátran elgépeléssel is — a kereső kitalálja, mit szeretne. Válassza ki, ami kell, adja hozzá az anyaglistájához,
            és egy kattintással elküldi nekünk. Nincs online kosár, nincs kártyaadat — csak egy lista, amit mi állítunk össze Önnek.
          </p>

          {/* Szemafór jelmagyarázat */}
          <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: 32, display: 'flex', flexWrap: 'wrap', gap: '10px 24px', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Elérhetőség:</span>
            <AvailabilityBadge status="keszleten" />
            <AvailabilityBadge status="korlatozott" />
            <AvailabilityBadge status="rendelheto" />
          </div>

          <TermekekCatalog />

          <div className="glass-card" style={{ marginTop: 48, padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>Nem találja amit keres?</h2>
            <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 20 }}>A teljes választékunk ennél jóval nagyobb — hívjon bennünket, vagy kérjen árajánlatot, 1 munkanapon belül visszajelzünk.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="tel:+36306182165" className="btn-primary" style={{ textDecoration: 'none', fontSize: 14 }}>📞 +36 30 618 2165</a>
              <a href="/#ajanlat" className="btn-secondary" style={{ textDecoration: 'none', fontSize: 14 }}>Ajánlatot kérek</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
