import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/sections/ContactForm';
import CityCards from './CityCards';
import { CITIES } from '../cities';

interface Props {
  params: { varos: string };
}

export function generateStaticParams() {
  return CITIES.map(c => ({ varos: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const city = CITIES.find(c => c.slug === params.varos);
  if (!city) return {};
  return {
    title: `Villanyszerelési anyag ${city.name} — Velence Vill Kft.`,
    description: `Villanyszerelési szaküzlet ${city.name} közelében, Velencén. 10+ vezető márka: Legrand, Schneider Electric, Tracon, EGLO. ${city.leiras}.`,
    keywords: [`villanyszerelési anyag ${city.name}`, `villamos szaküzlet ${city.name}`, 'Velence Vill', 'villanyszerelő Fejér megye'],
  };
}

export default function VarosPage({ params }: Props) {
  const city = CITIES.find(c => c.slug === params.varos);
  if (!city) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ElectricalSupplyStore'],
    name: 'Velence Vill Kft.',
    description: `Villanyszerelési szaküzlet ${city.name} közelében, Velencén. ${city.leiras}.`,
    url: `https://velencevill.hu/helyi/${city.slug}`,
    telephone: '+36306182165',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Fecske utca 12.',
      addressLocality: 'Velence',
      postalCode: '2481',
      addressCountry: 'HU',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 47.2474, longitude: 18.6421 },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '16:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '08:00', closes: '12:00' },
    ],
    areaServed: city.name,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Navbar />
      <main style={{ background: '#060d18', minHeight: '100vh' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569', marginBottom: 24 }}>
            <Link href="/" style={{ color: '#475569', textDecoration: 'none' }}>Főoldal</Link>
            <span>›</span>
            <span style={{ color: '#8899aa' }}>{city.name}</span>
          </nav>

          {/* Distance badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,255,239,0.07)', border: '0.5px solid rgba(0,255,239,0.25)', color: '#00FFEF', fontSize: 12, fontWeight: 500, padding: '5px 14px', borderRadius: 20, marginBottom: 16 }}>
            <span>📍</span>
            {city.tavol === '0 km' ? 'Szaküzletünk helyszíne' : `${city.tavol} — Velence Vill Kft.`}
          </div>

          <p style={{ fontSize: 11, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>
            Villanyszerelési anyagok
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#ffffff', marginBottom: 16, lineHeight: 1.2 }}>
            Villanyszerelési anyagok {city.name} közelében
          </h1>
          <p style={{ fontSize: 15, color: '#8899aa', marginBottom: 48, maxWidth: 560 }}>
            {city.leiras}. Velence Vill Kft. szaküzletünkben 10+ vezető márka termékei közül választhat. Személyes kiszolgálás, szakértői tanácsadás.
          </p>

          {/* Product categories */}
          <p style={{ fontSize: 11, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>Termékkategóriák</p>
          <div style={{ marginBottom: 56 }}>
            <CityCards />
          </div>

          {/* Map + hours */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 56 }}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Nyitvatartás</p>
              {[['H–P', '8:00–16:00'], ['Szo', '8:00–12:00'], ['Vas', 'Zárva']].map(([d, t]) => (
                <div key={d} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '0.5px solid rgba(0,255,239,0.06)', fontSize: 14 }}>
                  <span style={{ color: '#8899aa' }}>{d}</span>
                  <span style={{ color: t === 'Zárva' ? '#475569' : '#fff', fontWeight: 500 }}>{t}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '0.5px solid rgba(0,255,239,0.1)' }}>
                <div style={{ fontSize: 13, color: '#8899aa', marginBottom: 4 }}>📍 Velence, Fecske utca 12.</div>
                <a href="tel:+36306182165" style={{ fontSize: 14, color: '#00FFEF', textDecoration: 'none', fontWeight: 500 }}>📞 +36 30 618 2165</a>
              </div>
            </div>

            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0,255,239,0.15)', minHeight: 240 }}>
              <iframe
                src="https://maps.google.com/maps?q=Fecske+utca+12,+2481+Velence&hl=hu&z=14&output=embed"
                width="100%" height="240" style={{ border: 0, display: 'block', filter: 'invert(90%) hue-rotate(180deg)' }}
                loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>

          {/* Partner villanyszerelő */}
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Partner villanyszerelő</p>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Mike József villanyszerelő mester</h3>
            <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 0 }}>
              {city.tavol === '0 km' ? 'Helyi' : `${city.name} és környéke`} — OV engedéllyel rendelkező mester.
              Elérhető: <a href="tel:+36306182166" style={{ color: '#00FFEF', textDecoration: 'none' }}>+36 30 618 2166</a>
            </p>
          </div>

          {/* Contact form */}
          <div id="ajanlat">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <p className="section-label" style={{ marginBottom: 6 }}>Kapcsolat</p>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>Kérjen ajánlatot</h2>
              <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 32 }}>1 munkanapon belül visszahívjuk</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
