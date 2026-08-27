import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import MobileStickyBar from '@/components/MobileStickyBar';
import CookieBanner from '@/components/CookieBanner';
import ExitSurvey from '@/components/ExitSurvey';
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
  description:
    'Villanyszerelési anyagok, kábelek, kapcsolók, elosztók és világítástechnika Velencén. 10+ vezető márka: Legrand, Schneider Electric, Tracon, EGLO és még több. Személyes kiszolgálás, gyors elérés.',
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
  publisher: { '@id': `${SITE_URL}/#business` },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#business`,
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Mikor van nyitva a Velence Vill szaküzlet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hétfőtőt péntekig 8:00-16:00, szombaton 8:00-12:00, vasárnap zárva.',
      },
    },
    {
      '@type': 'Question',
      name: 'Milyen márkákat forgalmaz a Velence Vill Kft.?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '10+ vezető márkát: Tracon, Schneider Electric, Legrand, Kanlux, Rábalux, EGLO, GLOBO, EMOS, KOPP, OBO, Csatári Plast, Famatel, Mentavill.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hol található a Velence Vill szaküzlet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Velence, Fecske utca 12., 2481. Google Maps: https://www.google.com/maps/search/?api=1&query=Fecske+utca+12,+2481+Velence — Waze: https://waze.com/ul?q=Fecske+utca+12+Velence&navigate=yes',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${spaceGrotesk.variable} antialiased`}>
        {children}
        <MobileStickyBar />
        <CookieBanner />
        <ExitSurvey />
        <Analytics />
      </body>
    </html>
  );
}