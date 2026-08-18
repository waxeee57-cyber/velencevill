import adatok from '@/data/termekek.json';

export type Elerhetoseg = 'keszleten' | 'korlatozott' | 'rendelheto';

export interface Termek {
  id: string;
  nev: string;
  kategoria: string;
  marka?: string;
  leiras: string;
  cimkek: string[];
  elerhetoseg: Elerhetoseg;
}

export interface Kategoria {
  slug: string;
  nev: string;
  ikon: string;
}

export const KATEGORIAK: Kategoria[] = adatok.kategoriak;
export const TERMEKEK: Termek[] = adatok.termekek as Termek[];

export function kategoriaNev(slug: string): string {
  return KATEGORIAK.find(k => k.slug === slug)?.nev ?? slug;
}

export function kategoriaIkon(slug: string): string {
  return KATEGORIAK.find(k => k.slug === slug)?.ikon ?? '⚡';
}

export const ELERHETOSEG_INFO: Record<Elerhetoseg, { label: string; short: string; color: string; bg: string; border: string }> = {
  keszleten: {
    label: 'Állandó raktárkészlet – Azonnal elvihető',
    short: 'Készleten',
    color: '#34d399',
    bg: 'rgba(45,155,111,0.14)',
    border: 'rgba(45,155,111,0.35)',
  },
  korlatozott: {
    label: 'Korlátozott mennyiség – Érdeklődjön telefonon',
    short: 'Hívjon, egyeztetünk',
    color: '#facc15',
    bg: 'rgba(234,179,8,0.14)',
    border: 'rgba(234,179,8,0.35)',
  },
  rendelheto: {
    label: 'Rendelésre – 24/48 órán belül a boltban',
    short: 'Rendelésre, 24–48 ó',
    color: '#00FFEF',
    bg: 'rgba(0,255,239,0.1)',
    border: 'rgba(0,255,239,0.3)',
  },
};

// Ékezet- és kis/nagybetű-független normalizálás a kereséshez.
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Egyszerű Levenshtein-távolság — elgépelés-tűrő kereséshez (kis adathalmazon olcsó).
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const prev = new Array(n + 1);
  const curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
}

export interface TalalatiSor {
  termek: Termek;
  pontszam: number; // kisebb = jobb találat
}

// Prediktív, elgépelés-tűrő keresés: pontos/substring egyezés előrébb kerül,
// különben szótávolság alapján, szavankénti bontásban is próbálkozva.
export function keresTermekek(query: string, limit = 8): TalalatiSor[] {
  const q = normalize(query.trim());
  if (!q) return [];

  const eredmenyek: TalalatiSor[] = [];

  for (const termek of TERMEKEK) {
    const haystack = normalize(`${termek.nev} ${termek.marka ?? ''} ${termek.cimkek.join(' ')} ${kategoriaNev(termek.kategoria)}`);
    const nev = normalize(termek.nev);

    if (nev.startsWith(q)) { eredmenyek.push({ termek, pontszam: 0 }); continue; }
    if (haystack.includes(q)) { eredmenyek.push({ termek, pontszam: 1 }); continue; }

    // Szavankénti elgépelés-tűrés (max 2 karakternyi eltérés / szó, rövid query esetén 1).
    const szavak = haystack.split(/\s+/);
    const tolerancia = q.length <= 4 ? 1 : 2;
    let bestDist = Infinity;
    for (const szo of szavak) {
      if (Math.abs(szo.length - q.length) > tolerancia + 2) continue;
      const d = levenshtein(q, szo.slice(0, Math.max(q.length + tolerancia, szo.length)));
      if (d < bestDist) bestDist = d;
    }
    if (bestDist <= tolerancia) {
      eredmenyek.push({ termek, pontszam: 2 + bestDist });
    }
  }

  eredmenyek.sort((a, b) => a.pontszam - b.pontszam);
  return eredmenyek.slice(0, limit);
}
