import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MarkakGrid from './MarkakGrid';

export const metadata: Metadata = {
  title: 'Márkák — Velence Vill Kft.',
  description: '13 vezető villanyszerelési gyártó egy helyen: Legrand, Schneider Electric, Tracon, EGLO, Rábalux, Kanlux és más márkák forgalmazója Velencén.',
  keywords: ['Legrand', 'Schneider Electric', 'Tracon', 'EGLO', 'Rábalux', 'villanyszerelési márkák', 'forgalmazó Velence'],
};

export default function MarkakPage() {
  return (
    <>
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
