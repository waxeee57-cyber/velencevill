import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Villanyszerelő Partner — Velence Vill Kft.',
  description: 'Megbízható villanyszerelő partnert keres Velencén és Fejér megyében? Mike József regisztrált villanyszerelő vállalja a teljes körű munkákat.',
  keywords: ['villanyszerelő Velence', 'villanyszerelő Fejér megye', 'Mike József villanyszerelő', 'elosztótábla csere', 'mérőhely kialakítás'],
};

const SERVICES = [
  { icon: '🏠', title: 'Új épület villamosítása', desc: 'Teljes villamos hálózat tervezése és kiépítése új építésű lakásokhoz és házakhoz.' },
  { icon: '🔄', title: 'Felújítás & korszerűsítés', desc: 'Meglévő villamos hálózat felújítása, biztosítékdoboz és kábelek cseréje.' },
  { icon: '⚠️', title: 'Hibaelhárítás', desc: 'Gyors és szakszerű hibafelderítés, rövidzárlat elhárítás, szakaszolt fogyasztók kezelése.' },
  { icon: '🗄️', title: 'Elosztótábla csere', desc: 'Régi biztosítéktáblák cseréje modern kismegszakítós elosztókra, FI-reléket is beleértve.' },
  { icon: '📊', title: 'Mérőhely kialakítás', desc: 'E.ON és egyéb szolgáltatók előírásai szerint, mérőszekrény beszerelés és dokumentáció.' },
  { icon: '💡', title: 'Lámpaszerelés', desc: 'Csillár, LED szalag, kültéri lámpák és mozgásérzékelők telepítése, bekötése.' },
];

export default function SzereloPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#060d18', minHeight: '100vh' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>Partnerünk</p>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#ffffff', marginBottom: 12, lineHeight: 1.2 }}>Megbízható villanyszerelőt keres?</h1>
          <p style={{ fontSize: 15, color: '#8899aa', marginBottom: 48, maxWidth: 560 }}>Ajánlott partnerünk vállalja a kivitelezést — mi biztosítjuk az anyagot. Velence és Fejér megye egész területén.</p>

          {/* Partner card */}
          <div style={{ background: 'rgba(13,31,60,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,255,239,0.15)', borderRadius: 16, padding: '1.75rem', display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 48, flexWrap: 'wrap' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,255,239,0.07)', border: '2px solid rgba(0,255,239,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#00FFEF', flexShrink: 0 }}>MJ</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '0.5px solid rgba(74,222,128,0.2)', padding: '3px 10px', borderRadius: 12, marginBottom: 10 }}>
                ✓ Regisztrált villanyszerelő
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Mike József</h2>
              <p style={{ fontSize: 14, color: '#00FFEF', marginBottom: 12 }}>Velence és környéke · Fejér megye</p>
              <p style={{ fontSize: 14, color: '#8899aa', lineHeight: 1.7, marginBottom: 20 }}>
                Teljes körű villanyszerelési munkák — új építéstől a felújításig. Hibaelhárítás, elosztótábla csere, mérőhely kialakítás. Gyors, precíz munka, garanciával.
              </p>
              <a href="tel:+36306182166" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)', fontSize: 15, fontWeight: 600, padding: '11px 22px', borderRadius: 10, textDecoration: 'none' }}>
                📞 +36 30 618 2166
              </a>
            </div>
          </div>

          {/* Services */}
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 20 }}>Vállalt munkák</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 48 }}>
            {SERVICES.map(s => (
              <div key={s.title} style={{ background: 'rgba(13,31,60,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,255,239,0.12)', borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#8899aa', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#8899aa', marginBottom: 16 }}>Anyagot mi biztosítunk, munkát a partnerünk végzi — teljes körű megoldás egyetlen kapcsolattal.</p>
            <a href="tel:+36306182165" className="btn-primary" style={{ textDecoration: 'none', fontSize: 14 }}>📞 Kapcsolatfelvétel: +36 30 618 2165</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
