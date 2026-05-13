import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Termékkörök — Velence Vill Kft.',
  description: 'Villanyszerelési termékek széles választéka: kábelek, kapcsolók, elosztók, világítástechnika, szerelési anyagok és szerszámok. Legrand, Schneider Electric, Tracon és más vezető márkák.',
  keywords: ['villanyszerelési termékek', 'kábelek', 'kapcsolók', 'elosztók', 'világítástechnika', 'villanyszerelési anyagok Velence'],
};

const PRODUCTS = [
  { icon: '⚡', title: 'Kábelek & vezetékek', desc: 'Erős- és gyengeáramú kábelek széles választékban. NYM, NYY, CYKY és speciális tömítőrendszerek villanyszerelőknek és magánvásárlóknak egyaránt.', tags: ['NYM', 'NYY', 'CYKY', 'Koax', 'UTP'] },
  { icon: '🔌', title: 'Kapcsolók & dugaljak', desc: 'Legrand, Schneider Electric és Kanlux sorozatú kapcsolók és dugaljak teljes kínálata. Beltéri, kültéri, IP44, IP65 kivitelben.', tags: ['Legrand', 'Schneider', 'Kanlux', 'IP44', 'IP65'] },
  { icon: '🗄️', title: 'Elosztók & szekrények', desc: 'Lakás- és ipari elosztók, Csatári Plast szekrények, kismegszakítók, FI-relék és sínrendszerek.', tags: ['Csatári Plast', 'Kismegszakító', 'FI-relé', 'Ipari'] },
  { icon: '💡', title: 'Világítástechnika', desc: 'EGLO, Rábalux és GLOBO beltéri és kültéri lámpák, LED megoldások, fénycsövek és izzók.', tags: ['EGLO', 'Rábalux', 'GLOBO', 'LED', 'Kültéri'] },
  { icon: '🔧', title: 'Szerelési anyagok', desc: 'OBO kábelcsatornák, műanyag és fém csövek, rögzítők, dobozok, kapcsok és kötőelemek.', tags: ['OBO', 'Kábelcsatorna', 'Dobozok', 'Rögzítők'] },
  { icon: '🛠️', title: 'Szerszámok & mérők', desc: '1000V szigetelt szerszámok, fázisérzékelők, multiméterek és villanyszerelő eszközök professzionális kivitelben.', tags: ['1000V', 'Multiméter', 'Fázisérzékelő', 'Szigetelt'] },
];

export default function TermekekPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#060d18', minHeight: '100vh' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>Termékkörök</p>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#ffffff', marginBottom: 12, lineHeight: 1.2 }}>Villanyszerelési termékek</h1>
          <p style={{ fontSize: 15, color: '#8899aa', marginBottom: 48, maxWidth: 560 }}>Profi villanyszerelőktől a barkácsolóig — mindent megtalál, amire szüksége van. 13 vezető márkától, szakértő kiszolgálással.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {PRODUCTS.map(p => (
              <div key={p.title} style={{ background: 'rgba(13,31,60,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,255,239,0.15)', borderRadius: 12, padding: '1.5rem' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{p.icon}</div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>{p.title}</h2>
                <p style={{ fontSize: 14, color: '#8899aa', lineHeight: 1.7, marginBottom: 14 }}>{p.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {p.tags.map(t => (
                    <span key={t} style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 10, background: 'rgba(0,255,239,0.08)', color: '#00FFEF', border: '0.5px solid rgba(0,255,239,0.2)' }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ marginTop: 48, padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>Nem találja amit keres?</h2>
            <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 20 }}>Hívjon bennünket, vagy kérjen árajánlatot — 1 munkanapon belül visszajelzünk.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="tel:+36306182165" className="btn-primary" style={{ textDecoration: 'none', fontSize: 14 }}>📞 +36 30 618 2165</a>
              <a href="/#ajanlat" className="btn-secondary" style={{ textDecoration: 'none', fontSize: 14 }}>Ajánlatot kérek</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
