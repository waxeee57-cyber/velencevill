const fs = require('fs')
const path = require('path')
const https = require('https')

const brands = [
  {
    slug: 'tracon',
    name: 'TRACON Electric',
    urls: [
      'https://en.traconelectric.com/skins/Tracon/img/logo-tracon.svg',
      'https://shop.traconelectric.com/skins/Tracon/img/logo-tracon.svg',
    ],
    color: '#E30613',
  },
  {
    slug: 'schneider',
    name: 'Schneider Electric',
    urls: [
      'https://upload.wikimedia.org/wikipedia/commons/2/23/A_brand_of_Schneider_Electric_Logo.svg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Schneider_Electric_2007.svg/640px-Schneider_Electric_2007.svg.png',
    ],
    color: '#3DCD58',
  },
  {
    slug: 'legrand',
    name: 'LEGRAND',
    urls: [
      'https://upload.wikimedia.org/wikipedia/commons/8/8e/Legrand_logo.svg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Legrand_logo.svg/640px-Legrand_logo.svg.png',
    ],
    color: '#E4032E',
  },
  {
    slug: 'kanlux',
    name: 'Kanlux',
    urls: [
      'https://www.kanlux.com/themes/kanlux/assets/images/logo.svg',
      'https://www.kanlux.pl/themes/kanlux/assets/images/logo.svg',
    ],
    color: '#FFD300',
  },
  {
    slug: 'rabalux',
    name: 'Rábalux',
    urls: [
      'https://www.rabalux.com/themes/rabalux/img/rabalux-logo.svg',
      'https://www.rabalux.hu/themes/rabalux/img/rabalux-logo.svg',
    ],
    color: '#003DA5',
  },
  {
    slug: 'eglo',
    name: 'EGLO',
    urls: [
      'https://upload.wikimedia.org/wikipedia/commons/9/93/EGLO_LEUCHTEN_GmbH_Logo.svg',
      'https://www.eglo.com/static/eglo-logo.svg',
    ],
    color: '#E30613',
  },
  {
    slug: 'globo',
    name: 'GLOBO',
    urls: [
      'https://www.globo-lighting.com/_next/static/media/logo.svg',
    ],
    color: '#003DA5',
  },
  {
    slug: 'emos',
    name: 'EMOS',
    urls: [
      'https://www.emos.eu/assets/images/logo.svg',
      'https://www.emos.cz/assets/images/logo.svg',
    ],
    color: '#E30613',
  },
  {
    slug: 'kopp',
    name: 'KOPP',
    urls: [
      'https://www.kopp.eu/templates/kopp/img/logo.svg',
    ],
    color: '#003DA5',
  },
  {
    slug: 'obo',
    name: 'OBO Bettermann',
    urls: [
      'https://upload.wikimedia.org/wikipedia/commons/d/da/OBO_Bettermann_logo.svg',
      'https://www.obo.de/etc.clientlibs/obo/clientlibs/clientlib-base/resources/images/obo-logo.svg',
    ],
    color: '#003DA5',
  },
  {
    slug: 'csatari',
    name: 'Csatári Plast',
    urls: [
      'https://www.csatariplast.hu/wp-content/themes/csatari/img/logo.svg',
    ],
    color: '#00A94F',
  },
  {
    slug: 'famatel',
    name: 'Famatel',
    urls: [
      'https://www.famatel.com/wp-content/themes/famatel/img/logo.svg',
    ],
    color: '#003DA5',
  },
  {
    slug: 'mentavill',
    name: 'Mentavill',
    urls: [
      'https://www.mentavill.hu/static/images/logo.svg',
    ],
    color: '#E30613',
  },
]

const brandsDir = path.join(process.cwd(), 'public', 'brands')
if (!fs.existsSync(brandsDir)) {
  fs.mkdirSync(brandsDir, { recursive: true })
}

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath)

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (VelenceVill Brand Logo Fetcher)',
      },
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close()
        fs.unlinkSync(outputPath)
        return downloadFile(response.headers.location, outputPath).then(resolve).catch(reject)
      }

      if (response.statusCode !== 200) {
        file.close()
        fs.unlinkSync(outputPath)
        return reject(new Error(`HTTP ${response.statusCode}`))
      }

      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
      file.on('error', (err) => {
        fs.unlinkSync(outputPath)
        reject(err)
      })
    }).on('error', (err) => {
      file.close()
      try { fs.unlinkSync(outputPath) } catch {}
      reject(err)
    })
  })
}

async function tryDownload(brand) {
  for (const url of brand.urls) {
    const ext = url.endsWith('.png') ? 'png' : 'svg'
    const outputPath = path.join(brandsDir, `${brand.slug}.${ext}`)

    try {
      await downloadFile(url, outputPath)
      console.log(`✓ ${brand.name}: downloaded from ${url.split('/').slice(0, 3).join('/')}`)
      return { success: true, format: ext }
    } catch {
      continue
    }
  }

  createFallbackSVG(brand)
  return { success: false, format: 'svg' }
}

function createFallbackSVG(brand) {
  const svg = `<svg width="200" height="60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
  <text x="100" y="36"
    font-family="Arial, Helvetica, sans-serif"
    font-size="22"
    font-weight="700"
    fill="${brand.color}"
    text-anchor="middle"
    letter-spacing="1">${brand.name.toUpperCase()}</text>
</svg>`

  const outputPath = path.join(brandsDir, `${brand.slug}.svg`)
  fs.writeFileSync(outputPath, svg)
  console.log(`⚠ ${brand.name}: created fallback SVG`)
}

async function downloadAll() {
  console.log('=== Velence Vill Brand Logo Downloader ===\n')
  console.log(`Downloading ${brands.length} brand logos...\n`)

  const existingFiles = fs.readdirSync(brandsDir)
  existingFiles.forEach(file => {
    if (file.endsWith('.svg') || file.endsWith('.png')) {
      fs.unlinkSync(path.join(brandsDir, file))
    }
  })
  console.log(`Cleaned ${existingFiles.length} old files\n`)

  const results = { downloaded: 0, fallback: 0 }

  for (const brand of brands) {
    const result = await tryDownload(brand)
    if (result.success) results.downloaded++
    else results.fallback++
  }

  console.log('\n=== SUMMARY ===')
  console.log(`✓ Downloaded real logos: ${results.downloaded}/${brands.length}`)
  console.log(`⚠ Fallback SVGs: ${results.fallback}/${brands.length}`)
  console.log(`\nLogos saved to: ${brandsDir}`)
}

downloadAll().catch(console.error)
