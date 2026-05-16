const fs = require('fs');
const path = require('path');

const svgContent = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#060d18"/>
  <path d="M600 80 L480 340 L560 340 L440 600 L720 300 L640 300 Z"
    fill="none" stroke="#00FFEF" stroke-width="40" opacity="0.05" stroke-linejoin="round"/>
  <path d="M600 80 L480 340 L560 340 L440 600 L720 300 L640 300 Z"
    fill="none" stroke="#00FFEF" stroke-width="15" opacity="0.1" stroke-linejoin="round"/>
  <circle cx="300" cy="315" r="100" fill="#0d1f3c" stroke="#00FFEF" stroke-width="3"/>
  <path d="M320 265 L280 315 L305 315 L275 375 L340 305 L315 305 Z"
    fill="none" stroke="#00FFEF" stroke-width="5" stroke-linejoin="round"/>
  <text x="450" y="290" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="#ffffff" letter-spacing="5">VELENCE</text>
  <text x="450" y="370" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="#00FFEF" letter-spacing="5">VILL</text>
  <text x="780" y="370" font-family="Arial, sans-serif" font-size="48" fill="#ffffff" opacity="0.5">Kft.</text>
  <text x="450" y="420" font-family="Arial, sans-serif" font-size="28" fill="#8899aa" letter-spacing="3">VILLANYSZERELÉSI SZAKÜZLET</text>
  <text x="600" y="560" font-family="Arial, sans-serif" font-size="32" fill="#00FFEF" text-anchor="middle">velencevill.hu</text>
</svg>`;

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(path.join(publicDir, 'og-image.svg'), svgContent);
console.log('✓ Created /public/og-image.svg');
console.log('');
console.log('⚠  Convert to JPG for full social media compatibility:');
console.log('   npm install --save-dev sharp-cli');
console.log('   npx sharp-cli -i public/og-image.svg -o public/og-image.jpg --quality 90');
