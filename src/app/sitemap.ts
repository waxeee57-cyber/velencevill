import { MetadataRoute } from 'next';
import { ARTICLES } from './tudastar/articles';
import { CITIES } from './helyi/cities';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://velencevill.hu';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                      lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/termekek`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/szerelo`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/markak`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tudastar`,        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/kalkulator`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/helyi`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const articlePages: MetadataRoute.Sitemap = ARTICLES.map(a => ({
    url: `${SITE_URL}/tudastar/${a.slug}`,
    lastModified: new Date(a.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const cityPages: MetadataRoute.Sitemap = CITIES.map(c => ({
    url: `${SITE_URL}/helyi/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages, ...cityPages];
}
