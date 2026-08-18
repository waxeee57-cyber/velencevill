# velencevill — Velence Vill Kft.

## MI EZ
A **Velence Vill Kft.** (villamos szaküzlet / villanyszerelési anyag — Velence, Fejér megye)
weboldala. Lead-generáló marketing oldal: 3D villám hero, kalkulátorok, tudástár,
márka- és termékoldalak, visszahívás-kérés, chat widget, VIP-oldal, admin felület.
A leadek Supabase-be mennek, az értesítő Resenden.
Partner a `Partner.tsx` szerint: **Mike József**.
Forrás: `README.md` + `src/app/layout.tsx` + a route-struktúra.

## STACK (mérve: package.json, 2026-07-18)
- next@14.2.5 (App Router) — **⚠️ 2 major lemaradás, lásd FIGYELEM**
- react@^18 / react-dom@^18 — **⚠️ 1 major lemaradás**
- @supabase/supabase-js@^2.43.4 — lead tárolás
- resend@^3.2.0 — email értesítők
- three@^0.165.0 (+ @types/three) — 3D villám hero
- clsx@^2.1.1
- tailwindcss@^3.4.1 + postcss@^8 + autoprefixer@^10.0.1 (**Tailwind 3**, `tailwind.config.js`)
- typescript@^5, eslint@^8 + eslint-config-next@14.2.5
- sharp-cli@^2.1.1 (dev — asset generálás)
- Deploy: Vercel — bizonyíték: `vercel.json` (`{"framework": "nextjs"}`) + `.vercel/`

## FUTTATÁS
```bash
npm run dev              # next dev — http://localhost:3000
npm run build            # next build
npm run start            # next start
npm run lint             # next lint
npm run generate:og      # node scripts/generate-og-image.js
npm run generate:icons   # node scripts/generate-icons.js
npm run generate:assets  # og + icons egyben
```
> TODO: ismeretlen — nincs `typecheck` script. Kézzel: `npx tsc --noEmit`.

**Supabase séma:** Supabase Dashboard → SQL Editor → a `supabase-schema.sql` tartalma → Run.

## STRUKTÚRA
- `src/app/` — App Router. Route-ok: `admin`, `api`, `kalkulator`, `vip`, `tudastar`, `markak`, `szerelo`, `helyi`, `termekek`, `anyaglista`, `aszf`, `adatvedelem`, `cookie-tajekoztato` + `layout.tsx`, `page.tsx`, `robots.ts`, `sitemap.ts`, `loading.tsx`, `not-found.tsx`
- `src/app/api/` — `lead`, `chat`, `callback`, `calculator-lead`, `anyaglista`, `notices`, `vip/quick-request`, `admin/auth`, `admin/material-lists`, `admin/vip-requests`, `admin/notices`
- `src/components/` — `layout/` (Navbar, Footer), `sections/` (Hero, Products, Brands, Partner, Social, ContactForm, Reviews, ProSection), `ui/` (Toast) + gyökérszintű widgetek: `ChatWidget`, `CookieBanner`, `CalculatorHub`, `ExitSurvey`, `WhatsAppButton`, `MobileStickyBar`, `CallbackButton`, `FloatingBolt`, `ProductCard`, `ProductSearch`, `AvailabilityBadge`, `VipQuickRequestForm`
- `src/lib/` — `supabase.ts`, `supabaseBrowser.ts`, `supabaseAdmin.ts` (service role), `adminAuth.ts`, `security.ts`, `termekek.ts` (katalógus + prediktív kereső), `anyaglistaStore.ts` (localStorage pub/sub)
- `src/hooks/` — `useReveal.ts`, `useAnyaglista.ts`
- `src/data/termekek.json` — a termékkatalógus forrása (kézzel szerkeszthető, NEM élő raktárkészlet)
- `scripts/` — `generate-og-image.js`, `generate-icons.js`
- `cards/` — névjegykártya-designok (`.png`) + `generate_cards.py`. Nem a build része
- `supabase-schema.sql` — az adatbázis séma forrása
- `public/` — statikus assetek

## KONVENCIÓK
- TypeScript (`tsconfig.json`), Tailwind 3 (`tailwind.config.js`)
- **Supabase kétrétegű hozzáférés:** `supabaseBrowser.ts` (anon key, kliens) vs `supabaseAdmin.ts` (`SUPABASE_SERVICE_ROLE_KEY`, kizárólag szerveroldal). A service role kulcs SOHA nem mehet kliensre
- **RLS:** a globális DomRol szabály szerint minden Supabase táblán kötelező, soha nem disabled. Ellenőrizd a `supabase-schema.sql`-ben, mielőtt táblát adsz hozzá
- Az admin jelszóval véd (`ADMIN_PASSWORD`, `src/lib/adminAuth.ts`) — a `.env.example` szerint "required — no fallback"
- Az abszolút URL a `NEXT_PUBLIC_SITE_URL`-ből jön (`layout.tsx`, `sitemap.ts`, `robots.ts`)
- Magyar nyelvű tartalom, magyar route-nevek (`kalkulator`, `tudastar`, `markak`, `szerelo`)
- Globális DomRol szabályok, amik ide vonatkoznak: `.env` soha nem commitolható; RLS minden Supabase táblán; `console.log` tilos production kódban; commit formátum `feat/fix/chore/style/seo: leírás`
- Megjegyzés: ez **ügyfélprojekt**, nem DomRol-termék — a globális DomRol design system itt NEM érvényes

## HOL TART
- 2026-08-18: nagyobb funkciócsomag (Cowork-ből, a helyi `C:\projects\velencevill` munkakönyvtárral szinkronban):
  - **Termékkatalógus + elérhetőségi szemafór**: `src/data/termekek.json` (kézzel szerkeszthető, NEM élő
    raktárkészlet-adat — 3 státusz: keszleten/korlatozott/rendelheto), `AvailabilityBadge`, `ProductCard`,
    `/termekek` teljesen újraépítve kereshető, kategóriaszűrős kártyarácsként.
  - **Prediktív kereső** (`ProductSearch.tsx` + `src/lib/termekek.ts` `keresTermekek()`): saját kis
    Levenshtein-alapú elgépelés-tűrés, külső libet szándékosan nem hoztam be (kicsi az adathalmaz).
  - **Anyaglista** (kosár helyett, ár nélkül): `anyaglistaStore.ts` (localStorage pub/sub) +
    `useAnyaglista` hook, `/anyaglista` oldal, `POST /api/anyaglista` → `material_lists` tábla (Supabase,
    anon insert-only RLS) + Resend értesítés, admin „Anyaglisták” tab (`/api/admin/material-lists`).
  - **VIP gyorskapu**: `VipQuickRequestForm` a `/vip` oldalon — fotó (kézzel írt lista) + opcionális
    hangüzenet feltöltés, `POST /api/vip/quick-request` (service_role, `vip-files` bucket), `vip_requests`
    tábla (RLS bekapcsolva, szándékosan NINCS anon policy — csak a service_role-os route ír bele), admin
    „VIP Gyorskapu” tab (`/api/admin/vip-requests`).
  - **NEM készült el** (tudatosan kihagyva, ne tekintsd hiánynak): fizikai VIP-pult vonalkód/QR-igazolvány
    és élő POS-integráció — erről nincs valós rendszerhozzáférés, a spekulatív fél-kész megoldás rosszabb
    lett volna, mint a hiánya. Ha kell, külön kör.
  - A `/anyaglista` route `noindex,follow` (funkcionális oldal, nem tartalom) — szándékosan nincs a
    sitemapben.
  - Ezt megelőzően, még commit nélkül, MÁR a helyi munkakönyvtárban volt egy kész „Hírek” (site_notices)
    fejléc-ticker funkció (admin CRUD + `NewsBar` a Navbarban) — ez a csomag erre épül rá, nem törli.
- Branch: `master`. A fenti munka a helyi gépről szinkronizált munkakönyvtárban készült; a pontos
  commit/push állapotról lásd a session végi git-jelentést, ha ez a szakasz nem frissült utána.
- Ismert hiányosságok (forrás: README):
  - SEO checklist bemutató előtt — mind nyitott: `og-image.jpg`, `favicon.ico`, Search Console verification token, Google Business Profile websiteURL, valós Facebook/Instagram URL-ek a `Social.tsx`-ben és `layout.tsx`-ben
  - A README "Google 1. hely" teendőlistája (Business Profile, Search Console + sitemap, helyi kulcsszavak, backlink, Ads) érintetlen

## FIGYELEM
- 🔴 **ERŐSEN ELAVULT STACK — 2 major lemaradás.** Ez a legrégebbi projekt a mezőnyben:
  - `next@14.2.35` (2026-08-18-ig `14.2.5` volt) — a testvérprojektek Next 15/16-on futnak.
    **Két major verzió lemaradás.**
  - `react@^18` — a testvérprojektek React 19-en. **Egy major lemaradás.**
  - `resend@^3.2.0` — a testvérprojektekben `^6.x`. **Három major lemaradás.**
  - `eslint@^8` — a testvérprojektekben `^9`.
  - `@supabase/supabase-js@^2.43.4` — 2.x-en belül elavult patch-szint.
  - **Következmény:** a Next 14 App Router API-ja érdemben eltér a Next 15/16-tól
    (pl. async `params`/`searchParams`, caching alapértelmezések). Ne másolj át kódot
    a testvérprojektekből ellenőrzés nélkül, és fordítva se.
  - **Frissítés előtt:** a Next 14 → 16 ugrás breaking. Külön kör, nem mellékesen.
    A `svetlana` README dokumentálja, hogy ott ugyanez az ugrás biztonsági okból megtörtént —
    az ott leírt tapasztalat itt is releváns.
- ✅ **JAVÍTVA (2026-08-18): `next` patch-frissítés `14.2.5` → `14.2.35` (+ `eslint-config-next`
  ugyanarra).** Mérve: `npm audit` a régi verzión 5 sebezhetőséget jelzett (4 high, 1 critical) —
  köztük több valódi Next.js CVE (DoS, cache poisoning, SSRF Server Actionben, XSS CSP nonce-nál).
  A `14.2.35` egy **major-on belüli** patch (nem a kockázatos 14→16 ugrás), utána `npm audit`
  ezeket nullára viszi. Build/lint/typecheck zöld a frissítés után.
  **Maradék, tudatosan nyitva hagyott tétel:** a Next.js belső (nested) `postcss` függősége
  high severity — ezt `npm audit fix --force` csak a `next@16.3.1`-re ugorva javítaná, ami a
  fent dokumentált, külön kört igénylő major-váltás. Build-időben, CSS-feldolgozásnál releváns
  (nem futásidejű, user-inputból elérhető támadási felület), ezért alacsonyabb prioritású —
  de nyitott tétel marad a Next 16 frissítésig.
- ✅ **JAVÍTVA (2026-07-18): a `.env.local.example` megtisztítva.**
  Korábban a **verziókövetett** fájl valós kinézetű jelszót tartalmazott
  (`ADMIN_PASSWORD=<projektnév+évszám mintájú jelszó>` és
  `NEXT_PUBLIC_ADMIN_PASSWORD=<ugyanaz az érték>`). A konkrét értéket
  szándékosan nem írjuk le — a `git log -S` megtalálja, ha kell.
  Elvégzett javítás:
  1. Az `ADMIN_PASSWORD` értéke placeholder (üres) + komment, hogy erős,
     generált jelszót kell megadni.
  2. A `NEXT_PUBLIC_ADMIN_PASSWORD` sor **teljesen törölve**. A `NEXT_PUBLIC_`
     prefix a böngésző bundle-be sütné bele a jelszót — admin jelszóhoz ez soha
     nem helyes. **Mérve (2026-07-18): a kód sehol nem hivatkozik rá** — halott
     kulcs volt, a törlés nem tör el semmit. A valós auth szerver oldali:
     `src/lib/adminAuth.ts` + `src/app/api/admin/auth/route.ts`, `ADMIN_PASSWORD`.
- 🔴 **TEENDŐ ÉLESBEN: jelszócsere kötelező.** A fájljavítás önmagában NEM elég.
  A régi érték **4 commit óta benne van a git history-ban** — ismertnek kell
  tekinteni, és a history-ból a fájl javítása nem törli. Ha ez volt (vagy ez az)
  az élő admin jelszó, a Vercel → Settings → Environment Variables alatt az
  `ADMIN_PASSWORD`-öt **cserélni kell** erős, generált jelszóra, majd redeploy.
  Ha ugyanez a jelszó máshol is használatban van, ott is cserélni kell.
- ⚠️ **Szemét könyvtár a gyökérben: `{src`.** Egy elrontott brace-expansion hozta létre
  (`{src/{app,components/{ui,sections,layout},lib},public}` — PowerShellben/cmd-ben futtatott
  bash-szintaxis). Üres, nem része a buildnek. Nem töröltem (dokumentációs kör), de takarítható.
- ✅ **JAVÍTVA (2026-08-18): a `.gitignore` sérült utolsó sora törölve.** A korábbi UTF-16
  kódolású `node_modules/` append-maradvány (PowerShell `>>`) el lett távolítva, a fájl most
  tiszta UTF-8/LF, funkcionálisan ekvivalens (a 2. sor `node_modules/`-a mindig is fogta).
  Ha `.gitignore`-t bővítesz PowerShellből, `-Encoding utf8` kell — ez a tanulság megmarad.
- ⚠️ **A README "Struktúra" szekciója elavult.** 6 komponenst és 1 API route-ot listáz,
  a valóságban 19 komponens és 5 API route van (`chat`, `callback`, `calculator-lead`,
  `admin/auth` hiányzik belőle). Ne a README-ből tájékozódj a struktúráról — nézd a fájlokat.
- ⚠️ **Három egymást átfedő env-példafájl:** `.env.example`, `.env.local.example` és a valós
  `.env.local`. A mérvadó a `.env.example`.
- Nincs teszt-script és nincs teszt-keretrendszer a package.json-ban.
- A `cards/` mappában Python script van (`generate_cards.py`), de a projekt Node-projekt.
