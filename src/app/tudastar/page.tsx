import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TudasTarGrid from './TudasTarGrid';
import { breadcrumb } from '@/lib/schema';

export const metadata: Metadata = {
  // 60 karakter alatt a '| Velence Vill Kft.' utótaggal EGYÜTT (a root template
  // hozzáfűzi). Korábban 97 karakter volt, a leíró rész elveszett a SERP-ben.
  title: 'Tudástár villanyszerelőknek',
  // 160 alatt: korábban 173 volt.
  description: 'Szakmai útmutatók villanyszerelőknek és barkácsolóknak: kábelméretezés, FI relé, EV töltő, érintésvédelem, okos otthon. Ingyenes, gyakorlati anyagok.',
  keywords: ['villanyszerelési útmutató', 'kábelméretezés', 'FI relé', 'EV töltő telepítés', 'villanyszerelési tippek', 'okos otthon', 'LED világítás'],
  alternates: { canonical: '/tudastar' },
};

const crumbs = breadcrumb([{ name: 'Tudástár', path: '/tudastar' }]);

export default function TudasTarPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
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
