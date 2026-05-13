import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TudasTarGrid from './TudasTarGrid';

export const metadata: Metadata = {
  title: 'Tudástár — Szakmai segédanyagok villanyszerelőknek és barkácsolóknak',
  description: 'Ingyenes szakmai cikkek és útmutatók villanyszerelőknek és otthoni barkácsolóknak: kábelméretezés, FI relé, EV töltő telepítés, okos otthon és még sok más.',
  keywords: ['villanyszerelési útmutató', 'kábelméretezés', 'FI relé', 'EV töltő telepítés', 'villanyszerelési tippek', 'okos otthon', 'LED világítás'],
};

export default function TudasTarPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#060d18', minHeight: '100vh' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#00FFEF', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>Tudástár</p>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#ffffff', marginBottom: 12, lineHeight: 1.2 }}>
            Szakmai segédanyagok
          </h1>
          <p style={{ fontSize: 15, color: '#8899aa', marginBottom: 48, maxWidth: 560 }}>
            Villanyszerelőknek és barkácsolóknak: útmutatók, tippek, termékismertetők — a szakma legjobb forrásaiból.
          </p>
          <TudasTarGrid />
        </div>
      </main>
      <Footer />
    </>
  );
}
