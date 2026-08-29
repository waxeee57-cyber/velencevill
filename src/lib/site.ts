/**
 * A publikus, abszolút oldal-URL. Minden canonical, OG-URL, sitemap-bejegyzés,
 * robots.txt és JSON-LD `url`/`@id` mező ebből épül.
 *
 * Élesben KÖTELEZŐ beállítani a Vercel → Settings → Environment Variables alatt:
 *   NEXT_PUBLIC_SITE_URL=https://velencevillkft.hu
 * Az itteni fallback csak akkor él, ha az env változó hiányzik.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://velencevillkft.hu'
).replace(/\/$/, '');
