'use client'
import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'

const brands = [
  { slug: 'tracon',    name: 'TRACON Electric',   category: 'Szerelés',    url: 'https://www.tracon.hu' },
  { slug: 'schneider', name: 'Schneider Electric', category: 'Automatika',  url: 'https://www.se.com' },
  { slug: 'legrand',   name: 'LEGRAND',            category: 'Kapcsolók',   url: 'https://www.legrand.hu' },
  { slug: 'kanlux',    name: 'Kanlux',             category: 'Világítás',   url: 'https://www.kanlux.com' },
  { slug: 'rabalux',   name: 'Rábalux',            category: 'Lámpák',      url: 'https://www.rabalux.hu' },
  { slug: 'eglo',      name: 'EGLO',               category: 'Design lámpa',url: 'https://www.eglo.com' },
  { slug: 'globo',     name: 'GLOBO',              category: 'Világítás',   url: 'https://www.globo-lighting.com' },
  { slug: 'emos',      name: 'EMOS',               category: 'Szerelvény',  url: 'https://www.emos.eu' },
  { slug: 'kopp',      name: 'KOPP',               category: 'Kapcsolók',   url: 'https://www.kopp.eu' },
  { slug: 'obo',       name: 'OBO Bettermann',     category: 'Csatornák',   url: 'https://www.obo.de' },
  { slug: 'csatari',   name: 'Csatári Plast',      category: 'Szekrények',  url: 'https://www.csatariplast.hu' },
  { slug: 'famatel',   name: 'Famatel',            category: 'Elosztók',    url: 'https://www.famatel.com' },
  { slug: 'mentavill', name: 'Mentavill',          category: 'Nagyker',     url: 'https://www.mentavill.hu' },
]

function BrandCard({ brand }: { brand: typeof brands[0] }) {
  const [logoSrc, setLogoSrc] = useState(`/brands/${brand.slug}.svg`)
  const [logoError, setLogoError] = useState(false)

  const handleError = () => {
    if (logoSrc.endsWith('.svg')) {
      setLogoSrc(`/brands/${brand.slug}.png`)
    } else {
      setLogoError(true)
    }
  }

  return (
    <a
      href={brand.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${brand.name} – ${brand.category}`}
      className="reveal group glass-card p-6 flex flex-col items-center justify-center min-h-[160px] gap-3 transition-transform hover:scale-105"
    >
      <div className="h-12 flex items-center justify-center w-full">
        {!logoError ? (
          <img
            src={logoSrc}
            alt={`${brand.name} logo`}
            onError={handleError}
            className="h-full w-auto max-w-full object-contain brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity"
            loading="lazy"
          />
        ) : (
          <span className="text-base font-bold text-white text-center">{brand.name}</span>
        )}
      </div>
      <span className="inline-block px-3 py-1 text-xs font-semibold bg-[#00FFEF]/10 text-[#00FFEF] rounded-full border border-[#00FFEF]/30">
        {brand.category.toUpperCase()}
      </span>
    </a>
  )
}

export default function Brands() {
  const ref = useReveal<HTMLElement>(true)

  return (
    <section id="markak" ref={ref} className="py-20 px-4 bg-gradient-to-b from-[#060d18] to-[#0d1f3c] border-t border-[#00FFEF]/[0.08]">
      <div className="max-w-6xl mx-auto">
        <p className="reveal section-label mb-2">Forgalmazott márkák</p>
        <h2 className="reveal text-4xl md:text-5xl font-bold mb-4 text-white">10+ vezető gyártó — egy helyen</h2>
        <p className="reveal text-sm text-gray-400 mb-12">Az iparág legelismertebb márkáit forgalmazzuk szaküzletünkben</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <BrandCard key={brand.slug} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  )
}
