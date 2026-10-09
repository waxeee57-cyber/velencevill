import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * 2026-09-13 — bővítve. Korábban csak `Allow: /` + `Disallow: /api/` volt.
 *
 * Amit hozzátettünk és miért:
 *  - `/admin`, `/vip`, `/anyaglista` explicit tiltása. Mindhárom hordoz
 *    `noindex` metát is, de a robots-tiltás megspórolja a crawl-budgetet.
 *    ⚠️ A kettő nem ugyanaz: ami robotsban tiltott, azt a Google NEM olvassa be,
 *    így a `noindex` metát sem látja. Ezért a `noindex` metákat NEM vettük ki —
 *    ha egy URL valahonnan már linkelve van, a meta a biztosíték.
 *  - AI-crawlerek explicit engedése. Egy helyi szaküzletnél az AI-válaszokban
 *    (ChatGPT, Perplexity, Google AI Overviews) való megjelenés tiszta nyereség:
 *    "hol veszek villanyszerelési anyagot a Velencei-tónál" típusú kérdésre ez
 *    a forgalom forrása lehet. Nincs itt védendő szellemi tulajdon.
 *  - `host`: a kanonikus hoszt megjelölése (Yandex olvassa; másnak ártalmatlan).
 */
export default function robots(): MetadataRoute.Robots {
  const privat = ['/api/', '/admin', '/vip', '/anyaglista'];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privat,
      },
      {
        // AI-asszisztensek és feleletmotorok — szándékosan engedve (GEO).
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-User',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'Applebot-Extended',
          'CCBot',
          'meta-externalagent',
          'Bytespider',
        ],
        allow: '/',
        disallow: privat,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL.replace(/^https?:\/\//, ''),
  };
}
