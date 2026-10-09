import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/sections/ContactForm';
import CityCards from './CityCards';
import { CITIES } from '../cities';
import { SITE_URL } from '@/lib/site';

interface Props {
  params: { varos: string };
}

export function generateStaticParams() {
  return CITIES.map(c => ({ varos: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const city = CITIES.find(c => c.slug === params.varos);
  if (!city) return {};
  const title = `Villanyszerelési anyag ${city.name}`;
  // A description oldalanként eltér (a `leiras` és a távolság más), és 160 karakter
  // alatt marad — korábban a sablon a saját településén "Velence közelében, Velencén"-t
  // állított elő, és a 8 lap descriptionje gyakorlatilag azonos volt.
  const description =
    city.tavol === '0 km'
      ? `Villanyszerelési szaküzlet Velencén, a Fecske utca 12-ben. ${city.leiras}. Legrand, Schneider, Tracon, EGLO — személyes átvétel, előrendelés telefonon.`
      : `Villanyszerelési anyag ${city.name} környékére a velencei szaküzletből (${city.tavol}). 13 gyártó egy pulton, személyes átvétel, előrendelés telefonon.`;
  return {
    title,
    description,
    keywords: [
      ...city.telepulesek.map(t => `villanyszerelési anyag ${t}`),
      `villamos szaküzlet ${city.name}`,
      'Velence Vill',
      'villanyszerelő Fejér megye',
    ],
    alternates: { canonical: `/helyi/${city.slug}` },
    openGraph: { title: `${title} | Velence Vill Kft.`, description, url: `/helyi/${city.slug}`, type: 'website' },
  };
}

export default function VarosPage({ params }: Props) {
  const city = CITIES.find(c => c.slug === params.varos);
  if (!city) notFound();

  const masikVarosok = CITIES.filter(c => c.slug !== city.slug);

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ElectricalSupplyStore'],
    name: 'Velence Vill Kft.',
    description: `Villanyszerelési szaküzlet ${city.name} közelében, Velencén. ${city.leiras}.`,
    url: `${SITE_URL}/helyi/${city.slug}`,
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
    // A ténylegesen felsorolt települések — így az összevont oldalak (Agárd,
    // Sukoró, Pákozd, Kápolnásnyék, Székesfehérvár) kulcsszavai a strukturált
    // adatban is megmaradnak, nem csak a látható szövegben.
    areaServed: city.telepulesek.map(t => ({ '@type': 'Place', name: t })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Főoldal', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Helyi kiszolgálás', item: `${SITE_URL}/helyi` },
      { '@type': 'ListItem', position: 3, name: city.name, item: `${SITE_URL}/helyi/${city.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />
      <main style={{ background: '#060d18', minHeight: '100vh' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem' }}>
          {/* Breadcrumb */}
          {/* A látható breadcrumb most már egyezik a BreadcrumbList schemával —
              korábban a schema tartalmazta a /helyi szintet, a látható nem. */}
          <nav aria-label="Morzsamenü" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8899aa', marginBottom: 24, flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#8899aa', textDecoration: 'none' }}>Főoldal</Link>
            <span>›</span>
            <Link href="/helyi" style={{ color: '#8899aa', textDecoration: 'none' }}>Helyi kiszolgálás</Link>
            <span>›</span>
            <span aria-current="page" style={{ color: '#8899aa' }}>{city.name}</span>
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
            {city.tavol === '0 km'
              ? 'Villanyszerelési anyagok Velencén'
              : `Villanyszerelési anyagok — ${city.name}`}
          </h1>
          <p style={{ fontSize: 15, color: '#8899aa', marginBottom: 40, maxWidth: 620, lineHeight: 1.8 }}>
            {city.bevezeto}
          </p>

          {/* Oldalspecifikus tények — ez adja a lap egyedi tartalmát.
              h2 szinten, hogy a h1 → h2 → h3 hierarchia ne ugorjon (korábban h1 → h3 volt). */}
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 20 }}>
            {city.tavol === '0 km' ? 'A szaküzletről' : `Kiszolgálás — ${city.name}`}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 48 }}>
            {city.tenyek.map(t => (
              <div key={t.cim} className="glass-card" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>{t.cim}</h3>
                <p style={{ fontSize: 13.5, color: '#8899aa', lineHeight: 1.75, margin: 0 }}>{t.szoveg}</p>
              </div>
            ))}
          </div>

          {/* Kiszolgált települések — az összevont oldalak kulcsszavai itt élnek tovább */}
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
            Ide is szállítunk anyagot
          </h2>
          <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 14 }}>
            Erről az oldalról a következő településekre dolgozó szakemberek és magánvásárlók szoktak hozzánk jönni:
          </p>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 8, listStyle: 'none', padding: 0, margin: '0 0 48px' }}>
            {city.telepulesek.map(t => (
              <li
                key={t}
                style={{
                  fontSize: 13,
                  color: '#8899aa',
                  background: 'rgba(0,255,239,0.05)',
                  border: '0.5px solid rgba(0,255,239,0.15)',
                  borderRadius: 6,
                  padding: '5px 12px',
                }}
              >
                {t}
              </li>
            ))}
          </ul>

          {/* Product categories */}
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 16 }}>Termékkategóriák</h2>
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
                  <span style={{ color: t === 'Zárva' ? '#8899aa' : '#fff', fontWeight: 500 }}>{t}</span>
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
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 16 }}>Partner villanyszerelő</h2>
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: 56 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Mike József villanyszerelő mester</h3>
            <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 0 }}>
              {city.tavol === '0 km' ? 'Helyi' : `${city.name} és környéke`} — OV engedéllyel rendelkező mester.
              Elérhető: <a href="tel:+36306182166" style={{ color: '#00FFEF', textDecoration: 'none' }}>+36 30 618 2166</a>
              {' · '}
              <Link href="/szerelo" style={{ color: '#00FFEF', textDecoration: 'none' }}>Vállalt munkák →</Link>
            </p>
          </div>

          {/* Testvéroldalak — a korábbi orphan-státusz megszüntetése:
              minden helyi oldal linkel a másik kettőre és a hubra. */}
          {masikVarosok.length > 0 && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 16 }}>Más környékbeli oldalaink</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 56 }}>
                {masikVarosok.map(m => (
                  <Link
                    key={m.slug}
                    href={`/helyi/${m.slug}`}
                    className="glass-card"
                    style={{ padding: '1.1rem', textDecoration: 'none', display: 'block' }}
                  >
                    <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>
                      Villanyszerelési anyag — {m.name}
                    </span>
                    <span style={{ fontSize: 13, color: '#8899aa' }}>{m.leiras} · {m.tavol}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

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
