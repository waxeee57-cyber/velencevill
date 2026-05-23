import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'VIP Partner | Velence Vill Kft.',
  description: 'Exkluzív VIP partner felület — Velence Vill Kft.',
  robots: 'noindex, nofollow',
}

async function getVipOffers() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return []
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const { data } = await supabase
    .from('vip_offers')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
  return data || []
}

// Inline SVG icon helpers
function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

function PackageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.93 3.46a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}

const VIP_BENEFITS = [
  {
    Icon: StarIcon,
    title: 'Törzsvásárlói kedvezmény',
    desc: 'Minden vásárlásnál exkluzív partnerkedvezmény',
  },
  {
    Icon: PackageIcon,
    title: 'Anyag előfoglalás',
    desc: 'Nagy projektek esetén előre lefoglaljuk az anyagot',
  },
  {
    Icon: ClockIcon,
    title: 'Elsőbbségi értesítés',
    desc: 'Akciókról, új termékekről elsőként értesítjük',
  },
]

export default async function VipPage() {
  const offers = await getVipOffers()

  return (
    <main className="min-h-screen bg-[#060d18] text-white">

      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Háttér villámok */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 30 }).map((_, i) => {
              const x = (i % 6) * 180 + 40
              const y = Math.floor(i / 6) * 120 + 20
              return (
                <path
                  key={i}
                  d={`M${x + 14},${y} L${x},${y + 20} L${x + 7},${y + 20} L${x + 4},${y + 40} L${x + 20},${y + 20} L${x + 13},${y + 20} Z`}
                  fill="#00FFEF"
                />
              )
            })}
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-6 pt-20 pb-12 text-center">
          {/* Villám ikon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#0d1f3c] border border-[#00FFEF]/30 mb-6">
            <svg width="32" height="42" viewBox="0 0 32 42" fill="none">
              <path
                d="M22 2 L6 20 L14 20 L4 40 L26 18 L18 18 Z"
                stroke="#00FFEF"
                strokeWidth="2"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* VIP badge */}
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-[#00FFEF]/40" />
            <span className="text-[#00FFEF] text-sm font-semibold tracking-[6px]">VIP</span>
            <div className="w-8 h-px bg-[#00FFEF]/40" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Üdvözöljük,<br />
            <span className="text-[#00FFEF]">kiemelt partnerünk!</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Velence Vill Kft. — Exkluzív partner felület
          </p>
        </div>
      </div>

      {/* VIP Előnyök */}
      <div className="max-w-2xl mx-auto px-6 pb-12">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-300">
          Az Ön VIP előnyei
        </h2>

        <div className="grid grid-cols-1 gap-4 mb-12">
          {VIP_BENEFITS.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-4 p-5 rounded-xl bg-[#0d1f3c]/50 border border-[#00FFEF]/10"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#00FFEF]/10 flex items-center justify-center">
                <Icon />
              </div>
              <div>
                <p className="font-semibold mb-1">{title}</p>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Aktuális ajánlatok */}
        {offers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-300">
              Aktuális ajánlatok
            </h2>
            <div className="space-y-4">
              {offers.map((offer: {
                id: string
                title: string
                description?: string
                valid_until?: string
                file_url?: string
              }) => (
                <div
                  key={offer.id}
                  className="p-5 rounded-xl bg-[#0d1f3c] border border-[#00FFEF]/20 relative overflow-hidden"
                >
                  {/* Accent vonal */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00FFEF]" />
                  <div className="pl-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-lg mb-1">{offer.title}</p>
                        <p className="text-gray-400 text-sm whitespace-pre-wrap">{offer.description}</p>
                      </div>
                      {offer.valid_until && (
                        <span className="flex-shrink-0 text-xs text-[#00FFEF]/60 mt-1">
                          {new Date(offer.valid_until).toLocaleDateString('hu-HU')}
                        </span>
                      )}
                    </div>
                    {offer.file_url && (
                      <a
                        href={offer.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 text-sm text-[#00FFEF] hover:underline"
                      >
                        Részletek megtekintése <ChevronRightIcon />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {offers.length === 0 && (
          <div className="mb-12 p-6 rounded-xl bg-[#0d1f3c]/30 border border-[#00FFEF]/10 text-center">
            <p className="text-gray-500 text-sm">Jelenleg nincs aktív ajánlat.</p>
            <p className="text-gray-600 text-xs mt-1">Hamarosan érkeznek exkluzív ajánlatok!</p>
          </div>
        )}

        {/* Kapcsolat */}
        <div className="p-6 rounded-xl bg-[#0d1f3c] border border-[#00FFEF]/30 text-center">
          <p className="text-gray-300 mb-2 font-semibold">Közvetlen elérés</p>
          <p className="text-sm text-gray-400 mb-5">
            VIP partnerként Mike Patrik személyesen foglalkozik Önnel
          </p>
          <a
            href="tel:+36306182165"
            className="inline-flex items-center gap-3 bg-[#00FFEF] text-[#060d18] px-8 py-3 rounded-xl font-semibold hover:bg-[#00FFEF]/90 transition text-lg"
          >
            <PhoneIcon />
            +36 30 618 2165
          </a>
          <p className="text-xs text-gray-600 mt-3">Mike Patrik — Velence Vill Kft.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-xs text-gray-700 tracking-widest">VELENCE VILL KFT. — VIP</p>
      </div>
    </main>
  )
}
