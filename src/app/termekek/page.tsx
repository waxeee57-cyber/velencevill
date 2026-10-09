import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AvailabilityBadge from '@/components/AvailabilityBadge';
import TermekekCatalog from './TermekekCatalog';
import { breadcrumb, itemList } from '@/lib/schema';
import { TERMEKEK } from '@/lib/termekek';

export const metadata: Metadata = {
  // Korábban csak 'Termékek' volt → 29 karakteres title nulla kulcsszóval,
  // 36 termékhez. Most 'Villanyszerelési anyagok és termékek | Velence Vill Kft.'
  // = 56 karakter, a fő kulcsszóval elöl.
  title: 'Villanyszerelési anyagok és termékek',
  // 160 alatt: korábban 203 volt.
  description: 'Kereshető katalógus: kábel, kapcsoló, dugalj, kismegszakító, elosztószekrény, világítás és szerszám. Elérhetőségi jelzéssel, egykattintásos anyaglistával.',
  keywords: ['villanyszerelési termékek', 'kábelek', 'kapcsolók', 'elosztók', 'világítástechnika', 'villanyszerelési anyagok Velence'],
  alternates: { canonical: '/termekek' },
};

const crumbs = breadcrumb([{ name: 'Termékek', path: '/termekek' }]);
const katalogus = itemList('Villanyszerelési termékkatalógus', TERMEKEK.map(t => t.nev), '/termekek');

export default function TermekekPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(katalogus) }} />
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
