import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MarkakGrid from './MarkakGrid';
import { breadcrumb, itemList } from '@/lib/schema';

export const metadata: Metadata = {
  // Korábban csak 'Márkák' volt → 28 karakteres title nulla kulcsszóval,
  // 13 gyártóhoz. A gyártónevek a tényleges keresési kifejezések.
  // `absolute`, mert a root template '| Velence Vill Kft.' utótagjával 72 karakter
  // lenne (mérve) — így 51, és a gyártónevek benne maradnak.
  title: { absolute: 'Villanyszerelési márkák — Legrand, Schneider, Tracon' },
  description: '13 vezető gyártó egy pulton Velencén: Legrand, Schneider Electric, ABB, Tracon, OBO, EGLO, Rabalux, Kanlux. Hivatalos forgalmazó, személyes átvétel.',
  keywords: ['Legrand', 'Schneider Electric', 'ABB', 'Tracon', 'EGLO', 'Rabalux', 'villanyszerelési márkák', 'forgalmazó Velence'],
  alternates: { canonical: '/markak' },
};

const crumbs = breadcrumb([{ name: 'Márkák', path: '/markak' }]);
const markaLista = itemList('Forgalmazott villanyszerelési márkák', ['TRACON Electric','Schneider Electric','LEGRAND','Kanlux','Rabalux','EGLO','GLOBO','EMOS','KOPP','OBO Bettermann','ABB','Famatel','Mentavill'], '/markak');

export default function MarkakPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(markaLista) }} />
      <Navbar />
      <main style={{ background: '#060d18', minHeight: '100vh' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>Forgalmazott márkák</p>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#ffffff', marginBottom: 12, lineHeight: 1.2 }}>13 vezető gyártó — egy helyen</h1>
          <p style={{ fontSize: 15, color: '#8899aa', marginBottom: 48, maxWidth: 560 }}>Az iparág legelismertebb márkáit forgalmazzuk szaküzletünkben. Minden termék eredeti, garanciával.</p>
          <MarkakGrid />
        </div>
      </main>
      <Footer />
    </>
  );
}
