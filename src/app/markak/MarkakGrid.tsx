'use client';

const BRANDS = [
  { name: 'TRACON Electric',    category: 'Szerelési anyagok',    desc: 'Magyar fejlesztésű villamos termékek, kismegszakítók, elosztók és szerelési anyagok.',      link: 'https://www.traconelectric.com' },
  { name: 'Schneider Electric', category: 'Automatika & vezérlés', desc: 'Világvezető energiakezelési és automatizálási megoldások, ipari és lakás alkalmazásokhoz.',  link: 'https://www.se.com/hu' },
  { name: 'LEGRAND',            category: 'Kapcsolók & dugaljak',  desc: 'Francia prémium kapcsolók, dugaljak, kábeltálcák és elosztórendszerek teljes kínálata.',   link: 'https://www.legrand.hu' },
  { name: 'Kanlux',             category: 'Világítás',             desc: 'Professzionális beltéri és kültéri LED világítási megoldások széles választékban.',          link: 'https://www.kanlux.com' },
  { name: 'Rábalux',            category: 'Design lámpák',         desc: 'Magyar tervezésű design lámpák, csillárkapcsok és egyedi megvilágítási megoldások.',        link: 'https://www.rabalux.com' },
  { name: 'EGLO',               category: 'Design lámpa',          desc: 'Osztrák prémium design lámpák beltéri és kültéri felhasználásra.',                          link: 'https://www.eglo.com' },
  { name: 'GLOBO',              category: 'Világítás',             desc: 'Osztrák lámpacsalád, dekoratív és funkcionális megvilágítási termékek széles skálán.',     link: 'https://www.globo-lighting.com' },
  { name: 'EMOS',               category: 'Szerelvények',          desc: 'Cseh villamos szerelvények, izzók, töltők és okos otthon megoldások megfizethető áron.',    link: 'https://www.emos.eu' },
  { name: 'KOPP',               category: 'Kapcsolók',             desc: 'Német minőségű kapcsolók és dugaljak, megbízható és tartós villamos szerelvények.',        link: 'https://www.kopp.de' },
  { name: 'OBO Bettermann',     category: 'Kábelcsatornák',        desc: 'Vezető kábelcsatorna, rögzítőrendszer és töltővédelmi megoldások.',                         link: 'https://www.obo.de' },
  { name: 'Csatári Plast',      category: 'Szekrények',            desc: 'Magyar gyártású műanyag és fém elosztószekrények, mérőszekrények és fogyasztásmérő házak.', link: 'https://www.csatariplast.hu' },
  { name: 'Famatel',            category: 'Elosztók',              desc: 'Portugál villamos elosztók, kismegszakítók és lakáselosztó szekrények.',                   link: 'https://www.famatel.com' },
  { name: 'Mentavill',          category: 'Nagykereskedelem',      desc: 'Hazai villanyszerelési nagykereskedő, széles termékpalettával.',                            link: 'https://www.mentavill.hu' },
];

export default function MarkakGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      {BRANDS.map(b => (
        <a key={b.name} href={b.link} target="_blank" rel="noopener noreferrer"
          style={{ background: 'rgba(13,31,60,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,255,239,0.15)', borderRadius: 12, padding: '1.25rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8, transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,239,0.4)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,255,239,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,255,239,0.15)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: 0 }}>{b.name}</h2>
            <span style={{ fontSize: 12, color: '#00FFEF' }}>↗</span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 10, background: 'rgba(0,255,239,0.08)', color: '#00FFEF', border: '0.5px solid rgba(0,255,239,0.2)', width: 'fit-content' }}>{b.category}</span>
          <p style={{ fontSize: 13, color: '#8899aa', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
        </a>
      ))}
    </div>
  );
}
