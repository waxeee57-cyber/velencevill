import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'ÁSZF | Velence Vill Kft.',
  description: 'Velence Vill Kft. általános tájékoztatója az üzlet működéséről és az ajánlatkérés feltételeiről.',
};

const sectionTitle: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#fff', margin: '28px 0 10px' };
const para: React.CSSProperties = { fontSize: 15, color: '#c7d2da', lineHeight: 1.8, marginBottom: 12 };

export default function AszfPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#060d18', minHeight: '100vh' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '4rem 2rem' }}>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Általános tájékoztató (ÁSZF)</h1>
          <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>Hatályos: {new Date().getFullYear()}.</p>

          <div style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 12, padding: '14px 16px', marginBottom: 28 }}>
            <p style={{ fontSize: 13, color: '#facc15', margin: 0, lineHeight: 1.6 }}>
              ⚠️ Ez egy általános sablon. Éles használat előtt javasolt jogi (ügyvédi) felülvizsgálat.
            </p>
          </div>

          <h2 style={sectionTitle}>1. Üzemeltető / eladó</h2>
          <p style={para}>
            <strong>Velence Vill Kft.</strong> — 2481 Velence, Fecske utca 12.<br />
            Telefon: +36 30 618 2165 · E-mail: velencevillkft@gmail.com
          </p>

          <h2 style={sectionTitle}>2. A szolgáltatás jellege</h2>
          <p style={para}>
            A Velence Vill Kft. villanyszerelési anyagokat forgalmazó <strong>szaküzlet</strong>. A weboldal elsősorban
            tájékoztató jellegű: bemutatja a termékköröket, a forgalmazott márkákat és az üzlet elérhetőségét.
            A weboldalon keresztül <strong>nem történik online vásárlás</strong> — a vásárlás személyesen, az üzletben történik.
          </p>

          <h2 style={sectionTitle}>3. Ajánlatkérés</h2>
          <p style={para}>
            A weboldalon leadott ajánlatkérés és visszahívási kérés nem minősül megrendelésnek vagy szerződéskötésnek.
            A megadott árak és tájékoztatások tájékoztató jellegűek, nem minősülnek kötelező érvényű ajánlatnak;
            a végleges ár és elérhetőség egyeztetés tárgyát képezi.
          </p>

          <h2 style={sectionTitle}>4. Termékinformációk</h2>
          <p style={para}>
            A weboldalon szereplő márka- és terméknevek a jogtulajdonosok védjegyei. A készlet és a kínálat
            előzetes értesítés nélkül változhat; az aktuális elérhetőségről az üzletben vagy telefonon tájékozódhat.
          </p>

          <h2 style={sectionTitle}>5. Kapcsolat és panaszkezelés</h2>
          <p style={para}>
            Kérdés vagy panasz esetén forduljon hozzánk: +36 30 618 2165 · velencevillkft@gmail.com.
            Nyitvatartás: H–P 8:00–16:00, Szo 8:00–12:00.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
