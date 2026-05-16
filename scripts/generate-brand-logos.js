const fs = require('fs');
const path = require('path');

const brands = [
  { name: 'TRACON',    sub: 'Electric',  slug: 'tracon',    color: '#E30613', bg: '#fff' },
  { name: 'Schneider', sub: 'Electric',  slug: 'schneider', color: '#3DCD58', bg: '#fff' },
  { name: 'LEGRAND',   sub: '',          slug: 'legrand',   color: '#E4032E', bg: '#fff' },
  { name: 'Kanlux',    sub: '',          slug: 'kanlux',    color: '#F7A800', bg: '#fff' },
  { name: 'Rábalux',   sub: '',          slug: 'rabalux',   color: '#C8102E', bg: '#fff' },
  { name: 'EGLO',      sub: '',          slug: 'eglo',      color: '#D4001F', bg: '#fff' },
  { name: 'GLOBO',     sub: '',          slug: 'globo',     color: '#004B87', bg: '#fff' },
  { name: 'EMOS',      sub: '',          slug: 'emos',      color: '#E30613', bg: '#fff' },
  { name: 'KOPP',      sub: '',          slug: 'kopp',      color: '#003087', bg: '#fff' },
  { name: 'OBO',       sub: '',          slug: 'obo',       color: '#0066B2', bg: '#fff' },
  { name: 'Csatári',   sub: 'Plast',     slug: 'csatari',   color: '#005DAA', bg: '#fff' },
  { name: 'Famatel',   sub: '',          slug: 'famatel',   color: '#E4032E', bg: '#fff' },
  { name: 'Mentavill', sub: '',          slug: 'mentavill', color: '#00843D', bg: '#fff' },
];

const brandsDir = path.join(process.cwd(), 'public', 'brands');
if (!fs.existsSync(brandsDir)) fs.mkdirSync(brandsDir, { recursive: true });

brands.forEach(({ name, sub, slug, color }) => {
  const hasSubLine = sub && sub.length > 0;
  const displayName = name;
  const fontSize = displayName.length > 7 ? 22 : 28;

  // Transparent background — sits cleanly on dark glass cards
  const svg = hasSubLine
    ? `<svg width="160" height="60" xmlns="http://www.w3.org/2000/svg">
  <text x="80" y="26" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="800" fill="${color}" text-anchor="middle" letter-spacing="1">${displayName}</text>
  <text x="80" y="46" font-family="Arial, sans-serif" font-size="16" font-weight="600" fill="${color}" text-anchor="middle" opacity="0.75">${sub}</text>
</svg>`
    : `<svg width="160" height="60" xmlns="http://www.w3.org/2000/svg">
  <text x="80" y="38" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="800" fill="${color}" text-anchor="middle" letter-spacing="1">${displayName}</text>
</svg>`;

  fs.writeFileSync(path.join(brandsDir, `${slug}.svg`), svg, 'utf8');
  console.log(`✓ /public/brands/${slug}.svg`);
});

console.log(`\n✓ Generated ${brands.length} brand logos`);
