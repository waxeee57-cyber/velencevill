import { SITE_URL } from './site';

/**
 * Közös JSON-LD építők. 2026-09-13 — azért egy helyen, mert korábban csak a
 * `/` és (az új) `/helyi` hordozott strukturált adatot; a `/termekek`,
 * `/markak`, `/szerelo` és `/kalkulator` semmit. A LocalBusiness/Organization/
 * WebSite blokkok a root `layout.tsx`-ben maradnak (oldalszerte érvényesek).
 */

/** Minden aloldalra: Főoldal › … › aktuális. A látható morzsamenüvel egyeznie kell. */
export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Főoldal', item: SITE_URL },
      ...items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: it.name,
        item: `${SITE_URL}${it.path}`,
      })),
    ],
  };
}

/** Termék- vagy márkalista. Szándékosan ItemList és NEM Product:
 *  a katalógusban nincs ár és nincs élő készletadat, Product/Offer schema
 *  nélkülük hiányos (és a Google Merchant felé félrevezető) lenne. */
export function itemList(name: string, items: string[], path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListOrder: 'https://schema.org/ItemListUnordered',
    url: `${SITE_URL}${path}`,
    itemListElement: items.map((n, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: n,
    })),
  };
}

/** A villanyszerelő partner szolgáltatásai. */
export function service(nev: string, szolgaltatasok: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Villanyszerelés',
    provider: { '@type': 'Person', name: nev },
    areaServed: ['Velence', 'Gárdony', 'Agárd', 'Kápolnásnyék', 'Sukoró', 'Pákozd', 'Székesfehérvár', 'Fejér megye'].map(
      n => ({ '@type': 'Place', name: n })
    ),
    url: `${SITE_URL}/szerelo`,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Vállalt villanyszerelési munkák',
      itemListElement: szolgaltatasok.map(s => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s },
      })),
    },
  };
}

/** Ingyenes online eszköz (kalkulátorok). */
export function webApp(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: `${SITE_URL}${path}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    inLanguage: 'hu-HU',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'HUF' },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}
