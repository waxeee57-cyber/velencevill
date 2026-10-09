import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import PublicOverlays from '@/components/PublicOverlays';
import PageViewTracker from '@/components/PageViewTracker';
import { SITE_URL } from '@/lib/site';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#00FFEF',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Velence Vill Kft. – Villanyszerelési szaküzlet Velencén',
    template: '%s | Velence Vill Kft.',
  },
  // 160 karakter alatt tartandó — korábban 214 volt, és a záró érték-ígéret
  // ("Személyes kiszolgálás") a SERP-vágás után esett.
  description:
    'Villanyszerelési szaküzlet Velencén: kábel, kapcsoló, kismegszakító, elosztó, világítás. 13 gyártó egy pulton — Legrand, Schneider, Tracon. Személyes átvétel.',
  keywords: [
    'villanyszerelési szaküzlet',
    'villanyszerelési anyag',
    'villamos szaküzlet Velence',
    'villanyszerelési anyag Fejér megye',
    'villanyszerelési bolt Velence',
    'villanyszerelési anyag Gárdony',
    'villanyszerelési anyag Agárd',
    'villanyszerelési anyag Kápolnásnyék',
    'villanyszerelési anyag Székesfehérvár',
    'Legrand forgalmazó',
    'Schneider Electric',
    'Tracon Electric',
    'kábel kapcsoló konnektor',
    'elosztó szekrény',
    'világítástechnika',
    'villanyszerelő Velence',
    'Velence Vill',
  ],
  authors: [{ name: 'Velence Vill Kft.' }],
  creator: 'Velence Vill Kft.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Velence Vill Kft. — Villanyszerelési szaküzlet',
    description: '10+ vezető márka egy helyen. Profi kiszolgálás villanyszerelőknek és magánvásárlóknak.',
    url: SITE_URL,
    siteName: 'Velence Vill Kft.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Velence Vill Kft. – Villanyszerelési szaküzlet Velencén' }],
    locale: 'hu_HU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Velence Vill Kft. – Villanyszerelési szaküzlet',
    description: 'Villanyszerelési anyagok Velencén. 10+ vezető márka, személyes kiszolgálás.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  // A canonical URL-t szándékosan NEM itt adjuk meg: minden route a saját
  // page.tsx-ében állítja be (`alternates.canonical`), különben a root
  // canonicalja minden aloldalra ráöröklődne, és a Google duplikátumnak
  // venné őket.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ElectricalSupplyStore', 'Electrician'],
  '@id': `${SITE_URL}/#business`,
  name: 'Velence Vill Kft.',
  image: `${SITE_URL}/og-image.jpg`,
  logo: `${SITE_URL}/icon-512.png`,
  url: SITE_URL,
  telephone: '+36306182165',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Fecske utca 12.',
    addressLocality: 'Velence',
    postalCode: '2481',
    addressCountry: 'HU',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 47.2474,
    longitude: 18.6421,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '16:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '08:00', closes: '12:00' },
  ],
  priceRange: '$$',
  paymentAccepted: 'Cash, Credit Card, Invoice',
  currenciesAccepted: 'HUF',
  areaServed: ['Velence', 'Gárdony', 'Agárd', 'Sukoró', 'Pákozd', 'Kápolnásnyék', 'Székesfehérvár', 'Fejér megye'],
  hasMap: 'https://www.google.com/maps/search/?api=1&query=Fecske+utca+12,+2481+Velence',
  description: 'Villanyszerelési szaküzlet Velencén. Legrand, Schneider Electric, Tracon, EGLO és más vezető márkák forgalmazója.',
  sameAs: [
    'https://www.facebook.com/profile.php?id=100094014010543',
    'https://www.instagram.com/velence.vill/',
    'https://g.page/velencevill',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Velence Vill Kft.',
  inLanguage: 'hu-HU',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Velence Vill Kft.',
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: '+36306182165',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Fecske utca 12.',
    addressLocality: 'Velence',
    postalCode: '2481',
    addressCountry: 'HU',
  },
  areaServed: ['Velence', 'Gárdony', 'Agárd', 'Sukoró', 'Pákozd', 'Kápolnásnyék', 'Székesfehérvár', 'Fejér megye'],
  sameAs: [
    'https://www.facebook.com/profile.php?id=100094014010543',
    'https://www.instagram.com/velence.vill/',
    'https://g.page/velencevill',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        {/* Ikonlánc. A /favicon.ico 2026-09-13-ig 404-et adott — a modern
            böngésző az SVG-t veszi, de több crawler, RSS- és linkelőnéző még
            mindig a gyökér .ico-t kéri. Az apple-touch-icon most a specifikus
            180×180 (korábban a 192-es PNG állt a helyén). */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* Az első leképzéshez szükséges origók előre feloldva: a beágyazott
            Google-térkép a helyi oldalakon, a Google Fonts a self-hosted font
            CSS-éhez. Olcsó, és levesz egy RTT-t az LCP útjából. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://maps.google.com" />
      </head>
      <body className={`${spaceGrotesk.variable} antialiased`}>
        {children}
        <PublicOverlays />
        <PageViewTracker />
      </body>
    </html>
  );
}