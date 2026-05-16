'use client';
import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';

const BRANDS = [
  { name: 'TRACON',    sub: 'Electric',  tag: 'Szerelés',    link: 'https://www.traconelectric.com', slug: 'tracon' },
  { name: 'Schneider', sub: 'Electric',  tag: 'Automatika',  link: 'https://www.se.com/hu',          slug: 'schneider' },
  { name: 'LEGRAND',   sub: '',          tag: 'Kapcsolók',   link: 'https://www.legrand.hu',          slug: 'legrand' },
  { name: 'Kanlux',    sub: '',          tag: 'Világítás',   link: 'https://www.kanlux.com',          slug: 'kanlux' },
  { name: 'Rábalux',   sub: '',          tag: 'Lámpák',      link: 'https://www.rabalux.com',         slug: 'rabalux' },
  { name: 'EGLO',      sub: '',          tag: 'Design lámpa',link: 'https://www.eglo.com',            slug: 'eglo' },
  { name: 'GLOBO',     sub: '',          tag: 'Világítás',   link: 'https://www.globo-lighting.com',  slug: 'globo' },
  { name: 'EMOS',      sub: '',          tag: 'Szerelvény',  link: 'https://www.emos.eu',             slug: 'emos' },
  { name: 'KOPP',      sub: '',          tag: 'Kapcsolók',   link: 'https://www.kopp.de',             slug: 'kopp' },
  { name: 'OBO',       sub: '',          tag: 'Csatornák',   link: 'https://www.obo.de',              slug: 'obo' },
  { name: 'Csatári',   sub: 'Plast',     tag: 'Szekrények',  link: 'https://www.csatariplast.hu',     slug: 'csatari' },
  { name: 'Famatel',   sub: '',          tag: 'Elosztók',    link: 'https://www.famatel.com',         slug: 'famatel' },
  { name: 'Mentavill', sub: '',          tag: 'Nagyker',     link: 'https://www.mentavill.hu',        slug: 'mentavill' },
];

export default function Brands() {
  const ref = useReveal<HTMLElement>(true);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="markak" ref={ref} style={{ padding: '4rem 2rem', background: '#0d1f3c', borderTop: '0.5px solid rgba(0,255,239,0.08)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <p className="section-label reveal" style={{ marginBottom: 6 }}>Forgalmazott márkák</p>
        <h2 className="reveal" style={{ fontSize: 26, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>10+ vezető gyártó — egy helyen</h2>
        <p className="reveal" style={{ fontSize: 14, color: '#8899aa', marginBottom: 32 }}>Az iparág legelismertebb márkáit forgalmazzuk szaküzletünkben</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          {BRANDS.map(b => (
            <a key={b.name} href={b.link} target="_blank" rel="noopener noreferrer"
              className="reveal"
              style={{ position: 'relative', background: 'rgba(6,13,24,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,255,239,0.12)', borderRadius: 12, padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minHeight: 90, justifyContent: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease', transformStyle: 'preserve-3d', cursor: 'pointer', textDecoration: 'none' }}
              onMouseEnter={e => {
                setHovered(b.name);
                e.currentTarget.style.transform = 'translateY(-8px) rotateX(4deg) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,255,239,0.15), 0 0 0 1px rgba(0,255,239,0.3)';
                e.currentTarget.style.borderColor = 'rgba(0,255,239,0.4)';
              }}
              onMouseLeave={e => {
                setHovered(null);
                e.currentTarget.style.transform = 'translateY(0) rotateX(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(0,255,239,0.12)';
              }}>
              <div style={{ position: 'absolute', top: 7, right: 9, fontSize: 11, color: '#00FFEF', opacity: hovered === b.name ? 1 : 0, transition: 'opacity 0.2s' }}>↗</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/brands/${b.slug}.svg`}
                alt={b.name}
                style={{ height: 36, width: 'auto', marginBottom: 2, opacity: 0.85, borderRadius: 3, filter: 'brightness(0) invert(1)' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', textAlign: 'center', lineHeight: 1.3 }}>
                {b.name}{b.sub && <><br /><span style={{ fontSize: 11, fontWeight: 500, color: '#8899aa' }}>{b.sub}</span></>}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 10, background: 'rgba(0,255,239,0.08)', color: '#00FFEF', border: '0.5px solid rgba(0,255,239,0.2)' }}>{b.tag}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
