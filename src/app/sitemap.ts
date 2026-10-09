import { MetadataRoute } from 'next';
import { ARTICLES } from './tudastar/articles';
import { CITIES } from './helyi/cities';
import { SITE_URL } from '@/lib/site';

/**
 * ⚠️ 2026-09-13 — `new Date()` helyett FIX dátum.
 * A `new Date()` minden egyes sitemap-kéréskor "most"-ot írt ki, vagyis minden
 * oldal örökké "épp most módosult"-nak látszott. Ez értéktelen (a Google
 * leszokik róla, hogy higgyen a lastModifiednek) és zajos. Itt a tényleges
 * tartalmi módosítás dátuma áll — kézzel frissítendő, amikor a lap érdemben
 * változik. Ez kevesebb munkával jár, mint amennyit egy hiteles lastModified ér.
 */
const UTOLSO_MODOSITAS = new Date('2026-09-13');

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                          lastModified: UTOLSO_MODOSITAS, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/termekek`,            lastModified: UTOLSO_MODOSITAS, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/szerelo`,             lastModified: UTOLSO_MODOSITAS, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/markak`,              lastModified: UTOLSO_MODOSITAS, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tudastar`,            lastModified: UTOLSO_MODOSITAS, changeFrequency: 'weekly',  priority: 0.8 },
    // A /helyi hub korábban kimaradt a sitemapből, mert csak egy redirect volt.
    // 2026-09-13 óta valódi hub-oldal (lásd src/app/helyi/page.tsx fejlécét).
    { url: `${SITE_URL}/helyi`,               lastModified: UTOLSO_MODOSITAS, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/kalkulator`,          lastModified: UTOLSO_MODOSITAS, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/aszf`,                lastModified: UTOLSO_MODOSITAS, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/adatvedelem`,         lastModified: UTOLSO_MODOSITAS, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/cookie-tajekoztato`,  lastModified: UTOLSO_MODOSITAS, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const articlePages: MetadataRoute.Sitemap = ARTICLES.filter(a => !a.draft).map(a => ({
    url: `${SITE_URL}/tudastar/${a.slug}`,
    lastModified: new Date(a.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const cityPages: MetadataRoute.Sitemap = CITIES.map(c => ({
    url: `${SITE_URL}/helyi/${c.slug}`,
    lastModified: UTOLSO_MODOSITAS,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages, ...cityPages];
}
