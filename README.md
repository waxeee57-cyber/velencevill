# Velence Vill Kft. — Weboldal

## Tech Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS**
- **Supabase** — lead tárolás
- **Resend** — email értesítők
- **Vercel** — hosting + CI/CD
- **Three.js** — 3D villám hero

---

## Helyi fejlesztés (localhost)

### 1. Függőségek telepítése
```bash
npm install
```

### 2. Környezeti változók
```bash
cp .env.local.example .env.local
```
Töltsd ki a `.env.local` fájlt:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `RESEND_API_KEY` — Resend API key
- `RESEND_TO_EMAIL` — hova menjen az email értesítő

### 3. Supabase séma
Supabase Dashboard > SQL Editor > másold be a `supabase-schema.sql` tartalmát > Run

### 4. Fejlesztői szerver indítása
```bash
npm run dev
```
→ http://localhost:3000

---

## Vercel deploy

```bash
# 1. GitHub repo létrehozása és push
git init && git add . && git commit -m "init"
git remote add origin https://github.com/FELHASZNALONEV/velencevill.git
git push -u origin main

# 2. Vercel import
# vercel.com > New Project > Import from GitHub
# Environment variables beállítása a Vercel dashboardon
```

---

## SEO checklist (bemutató előtt)

- [ ] `og-image.jpg` létrehozása (1200×630px) → `/public/og-image.jpg`
- [ ] `favicon.ico` → `/public/favicon.ico`
- [ ] Google Search Console: site verification token beállítása `layout.tsx`-ben
- [ ] Google Business Profile: websiteURL beállítása
- [ ] Facebook oldal: website mező kitöltése
- [ ] Instagram: bio link beállítása
- [ ] Valós Facebook / Instagram URL-ek beállítása `Social.tsx`-ben és `layout.tsx`-ben

---

## Google 1. hely — teendők (sorban)

1. **Google Business Profile** optimalizálás — fotók, kategória: "Villanyszerelési szaküzlet"
2. **Search Console** regisztráció + sitemap beküldés: `https://velencevill.hu/sitemap.xml`
3. **Helyi kulcsszavak** — "villamos szaküzlet Velence", "villanyszerelési anyag Fejér megye"
4. **Backlink** — bekerülés helyi katalógusokba (Arany Oldalak, Firka.hu, stb.)
5. **Google Ads** — azonnali láthatósághoz (opcionális, de gyorsabb)

---

## Struktúra

```
src/
├── app/
│   ├── layout.tsx          ← SEO metadata, LocalBusiness schema
│   ├── page.tsx            ← Főoldal összerakva
│   ├── globals.css
│   ├── sitemap.ts          ← /sitemap.xml
│   ├── robots.ts           ← /robots.txt
│   └── api/lead/route.ts   ← Form beküldés API
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── sections/
│       ├── Hero.tsx         ← 3D villám, élő nyitvatartás
│       ├── Products.tsx
│       ├── Brands.tsx
│       ├── Partner.tsx      ← Mike József
│       ├── Social.tsx       ← Facebook + Instagram
│       └── ContactForm.tsx  ← Supabase + Resend
└── lib/
    └── supabase.ts
```
