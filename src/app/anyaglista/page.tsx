import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnyaglistaClient from './AnyaglistaClient';

export const metadata: Metadata = {
  title: 'Anyaglista',
  description: 'Állítsa össze a projektjéhez szükséges anyagokat, és küldje el egy kattintással a Velence Vill szaküzletnek — mi összekészítjük, Ön csak beugrik érte.',
  robots: { index: false, follow: true },
};

export default function AnyaglistaPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#060d18', minHeight: '100vh' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8, textAlign: 'center' }}>Anyaglista</p>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#ffffff', marginBottom: 12, lineHeight: 1.2, textAlign: 'center' }}>Az Ön összeállított listája</h1>
          <p style={{ fontSize: 15, color: '#8899aa', marginBottom: 40, maxWidth: 560, margin: '0 auto 40px', textAlign: 'center' }}>
            Nincs online fizetés, nincs élő készletszám — csak egy lista, amit elküldve mi 15 percen belül elkezdünk összekészíteni.
          </p>
          <AnyaglistaClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
