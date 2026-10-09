/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  async redirects() {
    return [
      // Ékezetes slugok → ASCII (301, hogy a korábbi linkek/indexelés ne törjön)
      { source: '/tudastar/kabelmeretez%C3%A9s-alapok', destination: '/tudastar/kabelmeretezes-alapok', permanent: true },
      { source: '/tudastar/kabelmeretezés-alapok', destination: '/tudastar/kabelmeretezes-alapok', permanent: true },
      { source: '/tudastar/kulteri-vilagitas-ip-vedetts%C3%A9g', destination: '/tudastar/kulteri-vilagitas-ip-vedettseg', permanent: true },
      { source: '/tudastar/kulteri-vilagitas-ip-vedettség', destination: '/tudastar/kulteri-vilagitas-ip-vedettseg', permanent: true },

      // ────────────────────────────────────────────────────────────────────
      // 2026-09-13 — VÁROSOLDAL-KONSZOLIDÁCIÓ (8 → 3)
      //
      // A korábbi 8 településoldal páronként 93,2–97,2% szóátfedést mutatott
      // (átlag 94,7%, 28 pár mérve élesben), oldalanként 193–205 szóval — ez a
      // Google doorway-page irányelvének leírása. Az 5 megszüntetett oldal
      // kulcsszavai a megmaradó lapok látható szövegében és `areaServed`
      // schemájában élnek tovább (lásd `src/app/helyi/cities.ts`).
      //
      // 301 (permanent), hogy az esetlegesen már megszerzett jelzés átszálljon.
      // ────────────────────────────────────────────────────────────────────
      { source: '/helyi/agard', destination: '/helyi/gardony', permanent: true },
      { source: '/helyi/sukoro', destination: '/helyi/fejer-megye', permanent: true },
      { source: '/helyi/pakozd', destination: '/helyi/fejer-megye', permanent: true },
      { source: '/helyi/kapolnasnyek', destination: '/helyi/fejer-megye', permanent: true },
      { source: '/helyi/szekesfehervar', destination: '/helyi/fejer-megye', permanent: true },
      // A korábbi ékezetes változat célja is átállítva (a slug megszűnt):
      { source: '/helyi/kapolnasny%C3%A9k', destination: '/helyi/fejer-megye', permanent: true },
      { source: '/helyi/kapolnasnyék', destination: '/helyi/fejer-megye', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // ────────────────────────────────────────────────────────────────
        // 2026-09-13 — A `*.vercel.app` hosztokon futó teljes oldalmásolat
        // kizárása az indexből.
        //
        // Mérve: a `project-5h5vh.vercel.app` alias 200-zal szolgálta ki a
        // teljes éles oldalt, `Allow: /` robots.txt-vel és X-Robots-Tag
        // NÉLKÜL — vagyis indexelhető duplikátum volt. (A team-scope-os
        // alias `noindex`-et küldött, ez az egy nem.)
        //
        // Ez a header a *tartalék* védelem. Az elsődleges megoldás a domain
        // leválasztása a Vercel projektről (Settings → Domains) — az viszont
        // dashboard-művelet, kódból nem elvégezhető.
        // ────────────────────────────────────────────────────────────────
        source: '/:path*',
        has: [{ type: 'host', value: '(?<vercelHost>.*\\.vercel\\.app)' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;
