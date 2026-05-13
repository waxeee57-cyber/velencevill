import type { Metadata } from 'next';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://velencevill.hu';

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
  openGraph: {
    type: 'website',
    locale: 'hu_HU',
    url: SITE_URL,
    siteName: 'Velence Vill Kft.',
    title: 'Velence Vill Kft. – Villanyszerelési szaküzlet',
    description: 'Villanyszerelési anyagok, 13 vezető márka, személyes kiszolgálás. Velence, Fecske utca 12.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Velence Vill Kft.' }],
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
  '@type': 'ElectricalSupplyStore',
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
    latitude: 47.236,
    longitude: 18.649,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '16:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '08:00', closes: '12:00' },
  ],
  priceRange: '$$',
  description: 'Villanyszerelési szaküzlet Velencén. Legrand, Schneider Electric, Tracon, EGLO és más vezető márkák forgalmazója.',
  sameAs: [
    'https://www.facebook.com/velencevill',
    'https://www.instagram.com/velencevill',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
