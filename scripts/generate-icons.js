const fs = require('fs');
const path = require('path');

const icon192 = `<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#060d18" rx="24"/>
  <circle cx="96" cy="96" r="50" fill="#0d1f3c" stroke="#00FFEF" stroke-width="2"/>
  <path d="M104 66 L84 96 L96 96 L80 126 L112 90 L100 90 Z"
    fill="none" stroke="#00FFEF" stroke-width="3" stroke-linejoin="round"/>
</svg>`;

const icon512 = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#060d18" rx="64"/>
  <circle cx="256" cy="256" r="130" fill="#0d1f3c" stroke="#00FFEF" stroke-width="5"/>
  <path d="M276 176 L224 256 L256 256 L212 336 L300 240 L268 240 Z"
    fill="none" stroke="#00FFEF" stroke-width="8" stroke-linejoin="round"/>
</svg>`;

const faviconSvg = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#060d18"/>
  <path d="M18 6 L12 16 L16 16 L10 26 L22 14 L18 14 Z"
    fill="none" stroke="#00FFEF" stroke-width="1.5" stroke-linejoin="round"/>
</svg>`;

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), icon192);
fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), icon512);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);

console.log('✓ Created SVG icons in /public/');
console.log('');
console.log('⚠  Convert to PNG/ICO for full browser & PWA support:');
console.log('   npm install --save-dev sharp-cli');
console.log('   npx sharp-cli -i public/icon-192.svg -o public/icon-192.png');
console.log('   npx sharp-cli -i public/icon-512.svg -o public/icon-512.png');
console.log('   npx sharp-cli -i public/favicon.svg -o public/favicon.ico --format ico');
