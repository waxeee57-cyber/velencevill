import type { Metadata } from 'next';
import { breadcrumb, webApp } from '@/lib/schema';

export const metadata: Metadata = {
  // Korábban 100 karakter volt a root template utótagjával együtt — csonkolt.
  // Most 'Kábelméretező kalkulátor | Velence Vill Kft.' = 44 karakter, és a
  // legkeresettebb kulcsszó (kábelméretező) került előre.
  title: 'Kábelméretező kalkulátor',
  // 160 alatt: korábban 169 volt.
  description: 'Ingyenes kábelméretező, biztosíték- és világításkalkulátor villanyszerelőknek. Keresztmetszet mm²-ben, kismegszakító A-ban — másodpercek alatt.',
  keywords: ['kábelméretező kalkulátor', 'biztosíték méretező', 'villanyszerelési kalkulátor', 'keresztmetszet számítás', 'feszültségesés'],
  alternates: { canonical: '/kalkulator' },
};

const crumbs = breadcrumb([{ name: 'Kalkulátorok', path: '/kalkulator' }]);
const app = webApp(
  'Villanyszerelési kalkulátorok',
  'Ingyenes kábelméretező, biztosíték- és világításkalkulátor villanyszerelőknek.',
  '/kalkulator'
);

export default function KalkulatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
      {children}
    </>
  );
}
