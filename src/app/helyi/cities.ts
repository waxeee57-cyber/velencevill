export interface City {
  slug: string;
  name: string;
  tavol: string;
  leiras: string;
}

export const CITIES: City[] = [
  { slug: 'velence',        name: 'Velence',         tavol: '0 km',         leiras: 'Szaküzletünk helyszíne' },
  { slug: 'gardony',        name: 'Gárdony',         tavol: '4 km',         leiras: 'Agárd és Gárdony területén' },
  { slug: 'agard',          name: 'Agárd',           tavol: '5 km',         leiras: 'Velencei-tó partján' },
  { slug: 'sukoro',         name: 'Sukoró',          tavol: '7 km',         leiras: 'Sukoró és Pákozd területén' },
  { slug: 'pakozd',         name: 'Pákozd',          tavol: '8 km',         leiras: 'Pákozd és Nadap területén' },
  { slug: 'kapolnasnyék',   name: 'Kápolnásnyék',    tavol: '10 km',        leiras: 'Kápolnásnyék és Pázmánd' },
  { slug: 'szekesfehervar', name: 'Székesfehérvár',  tavol: '15 km',        leiras: 'Fejér megye székhelye' },
  { slug: 'fejer-megye',    name: 'Fejér megye',     tavol: 'Fejér megye',  leiras: 'Egész Fejér megye területén' },
];
