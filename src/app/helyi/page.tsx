import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CITIES } from './cities';
import { SITE_URL } from '@/lib/site';

/**
 * ⚠️ 2026-09-13 — EZ AZ OLDAL KORÁBBAN `redirect('/helyi/velence')` VOLT.
 *
 * Miért cseréltük valódi hub-oldalra: a `redirect()` egy statikusan előrenderelt
 * oldalban nem tud 3xx-et kiadni — a Next 14 helyette
 * `<meta http-equiv="refresh" content="1;url=…">`-t sütött a statikus HTML-be.
 * Mérve élesben: HTTP 200, a főoldallal betű szerint azonos title, canonical
 * NÉLKÜL, "Betöltés…" törzsszöveggel. A Google ezt soft-404-ként és duplikált
 * title-ként látta.
 *
 * Ráadásul a 3 városoldalra korábban NULLA belső link mutatott az egész oldalról
 * (mérve mind a 13 publikus oldalon) — ez a hub egyszerre oldja meg mindkettőt.
 */
export const metadata: Metadata = {
  // 60 alatt a root template '| Velence Vill Kft.' utótagjával EGYÜTT (31 + 19 = 50).
  title: 'Helyi kiszolgálás — Velencei-tó',
  // 160 alatt (korábbi fogalmazvány 177 volt).
  description:
    'Hol vesz villanyszerelési anyagot a Velencei-tó környékén? Szaküzlet Velencén, a Fecske utca 12-ben — Gárdony, Agárd, Székesfehérvár és Fejér megye.',
  keywords: [
    'villanyszerelési anyag Velencei-tó',
    'villamos szaküzlet Fejér megye',
    'villanyszerelési bolt Velence',
    'villanyszerelési anyag Gárdony',
    'villanyszerelési anyag Székesfehérvár',
  ],
  alternates: { canonical: '/helyi' },
  openGraph: {
    title: 'Helyi kiszolgálás — Velencei-tó és Fejér megye | Velence Vill Kft.',
    description:
      'Szaküzletünk Velencén, a Fecske utca 12-ben. Gárdony, Agárd, Kápolnásnyék, Székesfehérvár és Fejér megye kiszolgálása.',
    url: '/helyi',
    type: 'website',
  },
};

export default function HelyiHubPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Főoldal', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Helyi kiszolgálás', item: `${SITE_URL}/helyi` },
    ],
  };

  // ItemList a három helyi oldalról — segíti a Google-t összekötni a hubot a lapokkal.
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Helyi kiszolgálási területek — Velence Vill Kft.',
    itemListElement: CITIES.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Villanyszerelési anyag — ${c.name}`,
      url: `${SITE_URL}/helyi/${c.slug}`,
    })),
  };

  // Minden kiszolgált település egy helyen, duplikáció nélkül.
  const osszesTelepules = Array.from(new Set(CITIES.flatMap(c => c.telepulesek))).sort((a, b) =>
    a.localeCompare(b, 'hu')
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <Navbar />
      <main style={{ background: '#060d18', minHeight: '100vh' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem' }}>
          <nav aria-label="Morzsamenü" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8899aa', marginBottom: 24 }}>
            <Link href="/" style={{ color: '#8899aa', textDecoration: 'none' }}>Főoldal</Link>
            <span>›</span>
            <span aria-current="page" style={{ color: '#8899aa' }}>Helyi kiszolgálás</span>
          </nav>

          <p style={{ fontSize: 11, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>
            Velencei-tó és Fejér megye
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#ffffff', marginBottom: 16, lineHeight: 1.2 }}>
            Hol vesz villanyszerelési anyagot a Velencei-tó környékén?
          </h1>
          <p style={{ fontSize: 15, color: '#8899aa', marginBottom: 48, maxWidth: 620, lineHeight: 1.8 }}>
            A szaküzlet Velencén, a Fecske utca 12. alatt van. Innen a tó körüli települések pár perc,
            Székesfehérvár nagyjából negyed óra. Az alábbi oldalakon összeszedtük, melyik irányból
            mi a leggyakoribb igény, és mit érdemes előre telefonon félretetetni.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 20 }}>Kiszolgálási területek</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 20, marginBottom: 56 }}>
            {CITIES.map(c => (
              <Link
                key={c.slug}
                href={`/helyi/${c.slug}`}
                className="glass-card"
                style={{ padding: '1.4rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}
              >
                <span style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 5, background: 'rgba(0,255,239,0.07)', border: '0.5px solid rgba(0,255,239,0.25)', color: '#00FFEF', fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20 }}>
                  📍 {c.tavol === '0 km' ? 'Itt a szaküzlet' : c.tavol}
                </span>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', margin: 0 }}>{c.name}</h3>
                <span style={{ fontSize: 13.5, color: '#8899aa', lineHeight: 1.7 }}>{c.leiras}</span>
                <span style={{ fontSize: 13, color: '#00FFEF', marginTop: 2 }}>Részletek →</span>
              </Link>
            ))}
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
            Kiszolgált települések
          </h2>
          <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 14, maxWidth: 620 }}>
            Nincs kiszállítás — a szaküzletben személyesen vehető át az anyag. Ezekről a településekről
            járnak hozzánk rendszeresen szakemberek és magánvásárlók:
          </p>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 8, listStyle: 'none', padding: 0, margin: '0 0 56px' }}>
            {osszesTelepules.map(t => (
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

          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 20 }}>Mielőtt elindul</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 24 }}>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>Nyitvatartás</h3>
              <p style={{ fontSize: 13.5, color: '#8899aa', lineHeight: 1.75, margin: 0 }}>
                H–P 8:00–16:00 · Szo 8:00–12:00 · Vasárnap zárva.<br />
                Velence, Fecske utca 12.
              </p>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>Előrendelés telefonon</h3>
              <p style={{ fontSize: 13.5, color: '#8899aa', lineHeight: 1.75, margin: 0 }}>
                Hívja a{' '}
                <a href="tel:+36306182165" style={{ color: '#00FFEF', textDecoration: 'none' }}>+36 30 618 2165</a>
                {' '}számot, összekészítjük az anyagot, és csak átveszi.
              </p>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>Anyaglista az oldalról</h3>
              <p style={{ fontSize: 13.5, color: '#8899aa', lineHeight: 1.75, margin: 0 }}>
                Állítsa össze a{' '}
                <Link href="/termekek" style={{ color: '#00FFEF', textDecoration: 'none' }}>termékkatalógusból</Link>
                , és küldje el egy kattintással — mi összekészítjük.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
