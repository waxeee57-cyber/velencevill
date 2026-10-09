/**
 * A publikus, abszolút oldal-URL. Minden canonical, OG-URL, sitemap-bejegyzés,
 * robots.txt és JSON-LD `url`/`@id` mező ebből épül.
 *
 * ⚠️ A HOSZTNAK EGYEZNIE KELL A VERCEL PRIMARY DOMAINJÉVEL.
 * Mérve 2026-09-13: a Vercel primary domain a `www.velencevillkft.hu`, az apex
 * `velencevillkft.hu` 308-cal átirányít rá. Amíg itt (vagy az env változóban) az
 * apex állt, minden canonical, sitemap-URL és JSON-LD @id egy átirányító URL-re
 * mutatott — a Google ezt "Page with redirect / not indexed"-ként kezeli.
 *
 * Élesben ellenőrizendő a Vercel → Settings → Environment Variables alatt:
 *   NEXT_PUBLIC_SITE_URL=https://www.velencevillkft.hu
 * Ha az env változó apexre van állítva, az FELÜLÍRJA az itteni fallbacket.
 *
 * Utóellenőrzés deploy után:
 *   curl -s https://www.velencevillkft.hu/sitemap.xml | grep -c 'https://www\.'
 *   → az összes <loc> darabszámával kell egyeznie
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.velencevillkft.hu'
).replace(/\/$/, '');
