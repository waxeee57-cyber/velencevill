import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Cookie tájékoztató | Velence Vill Kft.',
  description: 'Tájékoztató a Velence Vill Kft. weboldalán használt sütikről és böngészőben tárolt adatokról.',
};

const sectionTitle: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#fff', margin: '28px 0 10px' };
const para: React.CSSProperties = { fontSize: 15, color: '#c7d2da', lineHeight: 1.8, marginBottom: 12 };
const li: React.CSSProperties = { fontSize: 15, color: '#c7d2da', lineHeight: 1.8, marginBottom: 6 };

export default function CookiePage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#060d18', minHeight: '100vh' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '4rem 2rem' }}>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Cookie (süti) tájékoztató</h1>
          <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>Hatályos: {new Date().getFullYear()}.</p>

          <div style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 12, padding: '14px 16px', marginBottom: 28 }}>
            <p style={{ fontSize: 13, color: '#facc15', margin: 0, lineHeight: 1.6 }}>
              ⚠️ Ez egy általános sablon. Éles használat előtt javasolt jogi (ügyvédi) felülvizsgálat.
            </p>
          </div>

          <h2 style={sectionTitle}>Milyen adatokat tárolunk a böngészőjében?</h2>
          <p style={para}>
            Weboldalunk a működéshez szükséges, <strong>első féltől származó</strong> böngészőben tárolt adatokat
            (localStorage) használ. Harmadik féltől származó marketing- vagy hirdetési sütiket nem helyezünk el.
          </p>
          <ul>
            <li style={li}><strong>Chat / kapcsolatfelvétel:</strong> a beszélgetés azonosítója, hogy egy korábban indított beszélgetést folytatni tudjon.</li>
            <li style={li}><strong>Anonim látogatottság-mérés:</strong> egy véletlenszerű munkamenet-azonosító a saját, belső statisztikánkhoz (nem osztjuk meg hirdetőkkel).</li>
          </ul>

          <h2 style={sectionTitle}>Hogyan törölheti?</h2>
          <p style={para}>
            A böngészőjében bármikor törölheti a tárolt adatokat (előzmények / webhelyadatok törlése), illetve
            használhat privát / inkognitó módot. A törlés után a chat-előzmények nem lesznek elérhetők.
          </p>

          <h2 style={sectionTitle}>Kapcsolat</h2>
          <p style={para}>Kérdés esetén: velencevillkft@gmail.com · +36 30 618 2165</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
