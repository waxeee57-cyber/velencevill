const fs = require('fs');
const path = require('path');
const https = require('https');

// Mapped to the actual brands in Brands.tsx
const brands = [
  { name: 'TRACON Electric',  slug: 'tracon',    domain: 'traconelectric.com' },
  { name: 'Schneider Electric',slug: 'schneider', domain: 'se.com' },
  { name: 'LEGRAND',           slug: 'legrand',   domain: 'legrand.com' },
  { name: 'Kanlux',            slug: 'kanlux',    domain: 'kanlux.com' },
  { name: 'Rábalux',           slug: 'rabalux',   domain: 'rabalux.com' },
  { name: 'EGLO',              slug: 'eglo',      domain: 'eglo.com' },
  { name: 'GLOBO',             slug: 'globo',     domain: 'globo-lighting.com' },
  { name: 'EMOS',              slug: 'emos',      domain: 'emos.eu' },
  { name: 'KOPP',              slug: 'kopp',      domain: 'kopp.de' },
  { name: 'OBO',               slug: 'obo',       domain: 'obo.de' },
  { name: 'Csatári Plast',     slug: 'csatari',   domain: 'csatariplast.hu' },
  { name: 'Famatel',           slug: 'famatel',   domain: 'famatel.com' },
  { name: 'Mentavill',         slug: 'mentavill', domain: 'mentavill.hu' },
];

const brandsDir = path.join(process.cwd(), 'public', 'brands');
if (!fs.existsSync(brandsDir)) fs.mkdirSync(brandsDir, { recursive: true });

function downloadPng(brand) {
  return new Promise((resolve) => {
    const url = `https://logo.clearbit.com/${brand.domain}`;
    const outPath = path.join(brandsDir, `${brand.slug}.png`);
    const file = fs.createWriteStream(outPath);

    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ ${brand.name} (PNG from Clearbit)`);
          resolve(true);
        });
      } else {
        file.close();
        fs.existsSync(outPath) && fs.unlinkSync(outPath);
        console.log(`⚠ ${brand.name} — Clearbit ${res.statusCode}, keeping SVG fallback`);
        resolve(false);
      }
    });

    req.on('error', () => {
      file.close();
      fs.existsSync(outPath) && fs.unlinkSync(outPath);
      console.log(`⚠ ${brand.name} — network error, keeping SVG fallback`);
      resolve(false);
    });

    req.setTimeout(8000, () => {
      req.destroy();
      file.close();
      fs.existsSync(outPath) && fs.unlinkSync(outPath);
      console.log(`⚠ ${brand.name} — timeout, keeping SVG fallback`);
      resolve(false);
    });
  });
}

async function run() {
  console.log('Downloading brand logos from Clearbit...\n');
  let ok = 0;
  for (const brand of brands) {
    const downloaded = await downloadPng(brand);
    if (downloaded) ok++;
  }
  console.log(`\n✓ Done: ${ok}/${brands.length} downloaded as PNG`);
  console.log(`  ${brands.length - ok} using existing SVG fallbacks`);
  console.log('  All logos in /public/brands/');
}

run().catch(console.error);
