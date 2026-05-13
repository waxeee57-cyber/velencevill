import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Products from '@/components/sections/Products';
import Brands from '@/components/sections/Brands';
import Partner from '@/components/sections/Partner';
import Social from '@/components/sections/Social';
import ContactForm from '@/components/sections/ContactForm';

const TICKER_BRANDS = [
  'Legrand', 'Schneider Electric', 'Tracon Electric', 'EGLO', 'Rábalux',
  'Csatári Plast', 'OBO', 'Kanlux', 'EMOS', 'Famatel', 'GLOBO', 'KOPP', 'Mentavill',
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* Brand ticker */}
        <div style={{ background: '#0d1f3c', borderTop: '0.5px solid rgba(0,255,239,0.08)', borderBottom: '0.5px solid rgba(0,255,239,0.08)', padding: '11px 0', overflow: 'hidden' }}>
          <div className="animate-ticker" style={{ display: 'flex', gap: 48, width: 'max-content' }}>
            {[...TICKER_BRANDS, ...TICKER_BRANDS].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                <span style={{ fontSize: 13, color: '#ffffff', fontWeight: 500 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        <Products />
        <Brands />
        <Partner />

        {/* Contact */}
        <section id="ajanlat" style={{ padding: '4rem 1.5rem', background: '#0d1f3c', borderTop: '0.5px solid rgba(0,255,239,0.08)' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Kapcsolat</p>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>Kérjen ajánlatot</h2>
              <p style={{ fontSize: 14, color: '#8899aa' }}>1 munkanapon belül visszahívjuk</p>
            </div>
            <ContactForm />
          </div>
        </section>

        <Social />
      </main>
      <Footer />
    </>
  );
}
