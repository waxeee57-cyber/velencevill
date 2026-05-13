import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import MobileStickyBar from '@/components/MobileStickyBar';
import CookieBanner from '@/components/CookieBanner';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://velencevill.hu';

export const viewport: Viewport = {
  themeColor: '#00FFEF',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Velence Vill Kft. – Villanyszerelési szaküzlet Velencén',
    template: '%s | Velence Vill Kft.',
  },
  description:
    'Villanyszerelési anyagok, kábelek, kapcsolók, elosztók és világítástechnika Velencén. 13 vezető márka: Legrand, Schneider Electric, Tracon, EGLO és még több. Személyes kiszolgálás, gyors elérés.',
  keywords: [
    'villanyszerelési szaküzlet',
    'villanyszerelési anyag',
    'villamos szaküzlet Velence',
    'villanyszerelési anyag Fejér megye',
    'Legrand forgalmazó',
    'Schneider Electric',
    'Tracon Electric',
    'kábelek kapcsolók',
    'elosztó szekrény',
    'villanyszerelő Velence',
  ],
  authors: [{ name: 'Velence Vill Kft.' }],
  creator: 'Velence Vill Kft.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Velence Vill Kft. — Villanyszerelési szaküzlet',
    description: '13 vezető márka egy helyen. Profi kiszolgálás villanyszerelőknek és magánvásárlóknak.',
    url: 'https://velencevill.hu',
    siteName: 'Velence Vill Kft.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'hu_HU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Velence Vill Kft. – Villanyszerelési szaküzlet',
    description: 'Villanyszerelési anyagok Velencén. 13 vezető márka, személyes kiszolgálás.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: SITE_URL },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ElectricalSupplyStore'],
  name: 'Velence Vill Kft.',
  image: `${SITE_URL}/og-image.jpg`,
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
  hasMap: 'https://www.google.com/maps/search/?api=1&query=47.2474,18.6421',
  description: 'Villanyszerelési szaküzlet Velencén. Legrand, Schneider Electric, Tracon, EGLO és más vezető márkák forgalmazója.',
  sameAs: [
    'https://www.facebook.com/velencevill',
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
        text: 'Hétfőtől péntekig 8:00-16:00, szombaton 8:00-12:00, vasárnap zárva.',
      },
    },
    {
      '@type': 'Question',
      name: 'Milyen márkákat forgalmaz a Velence Vill Kft.?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '13 vezető márkát: Tracon, Schneider Electric, Legrand, Kanlux, Rábalux, EGLO, GLOBO, EMOS, KOPP, OBO, Csatári Plast, Famatel, Mentavill.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hol található a Velence Vill szaküzlet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Velence, Fecske utca 12., 2481. Google Maps: https://www.google.com/maps/search/?api=1&query=47.2474,18.6421',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${spaceGrotesk.variable} antialiased`}>
        {children}
        <MobileStickyBar />
        <CookieBanner />
      </body>
    </html>
  );
}
