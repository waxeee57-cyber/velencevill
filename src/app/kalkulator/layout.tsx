import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Villanyszerelési kalkulátorok — Kábelméretező, biztosíték, világítás',
  description: 'Ingyenes online kalkulátorok villanyszerelőknek: kábelméretező (mm²), biztosíték méretező (A), világítás teljesítmény számító. Gyors, pontos eredmény.',
  keywords: ['kábelméretező kalkulátor', 'biztosíték méretező', 'villanyszerelési kalkulátor', 'keresztmetszet számítás', 'feszültségesés'],
};

export default function KalkulatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
