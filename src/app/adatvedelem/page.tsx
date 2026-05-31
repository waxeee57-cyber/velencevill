import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Adatvédelmi tájékoztató | Velence Vill Kft.',
  description: 'Velence Vill Kft. adatvédelmi tájékoztatója — milyen személyes adatokat kezelünk, milyen célból és milyen jogalapon.',
};

const sectionTitle: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#fff', margin: '28px 0 10px' };
const para: React.CSSProperties = { fontSize: 15, color: '#c7d2da', lineHeight: 1.8, marginBottom: 12 };
const li: React.CSSProperties = { fontSize: 15, color: '#c7d2da', lineHeight: 1.8, marginBottom: 6 };

export default function AdatvedelemPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#060d18', minHeight: '100vh' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '4rem 2rem' }}>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Adatvédelmi tájékoztató</h1>
          <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>Hatályos: {new Date().getFullYear()}. — utolsó frissítés a közzététel napján</p>

          <div style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 12, padding: '14px 16px', marginBottom: 28 }}>
            <p style={{ fontSize: 13, color: '#facc15', margin: 0, lineHeight: 1.6 }}>
              ⚠️ Ez egy általános sablon. Éles használat előtt javasolt jogi (ügyvédi) felülvizsgálat,
              hogy megfeleljen a tényleges adatkezelési folyamatoknak és a hatályos jogszabályoknak.
            </p>
          </div>

          <h2 style={sectionTitle}>1. Az adatkezelő</h2>
          <p style={para}>
            <strong>Velence Vill Kft.</strong><br />
            Székhely / üzlet: 2481 Velence, Fecske utca 12.<br />
            Telefon: +36 30 618 2165<br />
            E-mail: velencevillkft@gmail.com
          </p>

          <h2 style={sectionTitle}>2. Milyen adatokat kezelünk?</h2>
          <p style={para}>A weboldalon keresztüli kapcsolatfelvétel (ajánlatkérő űrlap, visszahívás kérése, chat) során a következő adatokat kezeljük:</p>
          <ul>
            <li style={li}>név</li>
            <li style={li}>telefonszám</li>
            <li style={li}>e-mail cím (ha megadja)</li>
            <li style={li}>az üzenetben önként megadott további adatok</li>
          </ul>

          <h2 style={sectionTitle}>3. Az adatkezelés célja és jogalapja</h2>
          <p style={para}>
            <strong>Cél:</strong> kapcsolatfelvétel, ajánlatadás, a megkeresés megválaszolása.<br />
            <strong>Jogalap:</strong> az Ön hozzájárulása (GDPR 6. cikk (1) a)), illetve szerződés megkötését megelőző
            lépések megtétele az Ön kérésére (GDPR 6. cikk (1) b)).
          </p>

          <h2 style={sectionTitle}>4. Megőrzési idő</h2>
          <p style={para}>
            A megkereséshez kapcsolódó adatokat a kapcsolatfelvétel céljának teljesüléséig, illetve a hozzájárulás
            visszavonásáig kezeljük. Ezt követően az adatokat töröljük, kivéve, ha jogszabály hosszabb megőrzést ír elő.
          </p>

          <h2 style={sectionTitle}>5. Adatfeldolgozók</h2>
          <p style={para}>A működéshez az alábbi adatfeldolgozók szolgáltatásait vehetjük igénybe:</p>
          <ul>
            <li style={li}><strong>Vercel Inc.</strong> — weboldal tárhely / hosting</li>
            <li style={li}><strong>Supabase</strong> — a beérkező megkeresések biztonságos tárolása (adatbázis)</li>
            <li style={li}><strong>Resend</strong> — e-mail értesítések kézbesítése</li>
          </ul>

          <h2 style={sectionTitle}>6. Az Ön jogai</h2>
          <ul>
            <li style={li}>hozzáférés a kezelt adataihoz</li>
            <li style={li}>helyesbítés kérése</li>
            <li style={li}>törlés („elfeledtetés") kérése</li>
            <li style={li}>az adatkezelés korlátozása</li>
            <li style={li}>hozzájárulás visszavonása bármikor</li>
            <li style={li}>panasz benyújtása a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH)</li>
          </ul>
          <p style={para}>Jogai gyakorlásához írjon a velencevillkft@gmail.com címre.</p>

          <h2 style={sectionTitle}>7. Kapcsolat</h2>
          <p style={para}>Adatvédelemmel kapcsolatos kérdés esetén: velencevillkft@gmail.com · +36 30 618 2165</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
