export type Category = 'szakmai' | 'diy' | 'termek' | 'helyi';

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: Category;
  readTime: number;
  publishDate: string;
  content: string;
}

export const ARTICLES: Article[] = [
  {
    slug: 'uj-haz-villanyszerelese',
    title: 'Új ház villanyszerelése lépésről lépésre 2026-ban',
    description: 'Teljes körű útmutató az új építésű házak villanyszerelési munkálataihoz: tervezéstől a végleges felülvizsgálatig.',
    category: 'szakmai',
    readTime: 8,
    publishDate: '2026-01-15',
    content: '',
  },
  {
    slug: 'fi-rele-vagy-kombinalt',
    title: 'FI relé vagy kombinált FI-kismegszakító? Mikor melyiket?',
    description: 'Összehasonlítjuk a hagyományos FI relék és a kombinált FI-kismegszakítók előnyeit, hátrányait és alkalmazási területeit.',
    category: 'szakmai',
    readTime: 6,
    publishDate: '2026-01-22',
    content: '',
  },
  {
    slug: 'hany-aramkor-kell-100m2',
    title: 'Hány áramkör kell egy 100 m² családi házba?',
    description: 'Szabványos áramkörelosztás 100 m²-es háznál: hány kör kell a konyhába, fürdőbe, nappaliba és a külső területekre.',
    category: 'szakmai',
    readTime: 5,
    publishDate: '2026-02-01',
    content: '',
  },
  {
    slug: 'ev-tolto-telepites-otthon',
    title: 'EV töltő telepítés otthon: 11 kW vagy 22 kW?',
    description: 'Mit kell tudni az otthoni elektromos autó töltő telepítéséről? Melyik teljesítmény az ideális és milyen hálózati feltételek szükségesek?',
    category: 'diy',
    readTime: 7,
    publishDate: '2026-02-10',
    content: '',
  },
  {
    slug: 'napelem-inverter-vedelem',
    title: 'Napelem inverter és AC-oldali védelem — szabványos kialakítás',
    description: 'Hogyan kell szabványosan kialakítani a napelem rendszer AC-oldali védelmét? Leválasztó, visszatáplálás elleni védelem, biztosítékok.',
    category: 'szakmai',
    readTime: 9,
    publishDate: '2026-02-18',
    content: '',
  },
  {
    slug: 'okos-otthon-shelly-alapok',
    title: 'Okos otthon Shelly-vel: alap szerelési séma kezdőknek',
    description: 'Lépésről lépésre: hogyan szerelje be a Shelly okos relét meglévő kapcsolódobozba, és hogyan programozza be az alkalmazásban.',
    category: 'diy',
    readTime: 10,
    publishDate: '2026-02-25',
    content: '',
  },
  {
    slug: 'erintesvedelem-felulvizsgalat',
    title: 'Érintésvédelmi felülvizsgálat — mit ellenőriz a villanyszerelő?',
    description: 'Mire terjed ki az érintésvédelmi felülvizsgálat, milyen dokumentumokat kap az ügyfél és mikor kötelező elvégezni?',
    category: 'szakmai',
    readTime: 6,
    publishDate: '2026-03-05',
    content: '',
  },
  {
    slug: 'villanyszereles-koltsegek-2026',
    title: 'Mennyibe kerül egy lakás teljes villanyszerelése 2026-ban?',
    description: 'Reális árak, influencing tényezők és tippek arra, hogyan spórolj a villanyszerelési munkálatokon anélkül, hogy veszélyeztetnéd a biztonságot.',
    category: 'diy',
    readTime: 7,
    publishDate: '2026-03-12',
    content: '',
  },
  {
    slug: 'kulteri-vilagitas-ip-vedettség',
    title: 'Kültéri világítás: melyik IP védettségi fokozat kell?',
    description: 'IP20-tól IP68-ig: mikor melyik IP védettségi fokozatú lámpa szükséges? Terasz, bejárat, kert, medence mellé mit válasszunk?',
    category: 'diy',
    readTime: 5,
    publishDate: '2026-03-20',
    content: '',
  },
  {
    slug: 'kabelmeretezés-alapok',
    title: 'Kábelméretezés alapok: hogyan válaszd ki a megfelelő keresztmetszetet?',
    description: 'A kábel keresztmetszetének kiválasztása nem csak a terhelhetőségről szól — feszültségesés, rövid zárlati áram és szerelési mód is számít.',
    category: 'szakmai',
    readTime: 8,
    publishDate: '2026-03-28',
    content: '',
  },
  {
    slug: 'legrand-valena-kapcsolok',
    title: 'Legrand Valena kapcsolósorozat — teljes útmutató',
    description: 'A Legrand Valena Life sorozat minden változata: kapcsolók, csengő, dimmer, USB töltő, data aljzat. Melyiket válaszd és miért?',
    category: 'termek',
    readTime: 6,
    publishDate: '2026-04-05',
    content: '',
  },
  {
    slug: 'schneider-acti9-biztositek',
    title: 'Schneider Acti9 kismegszakítók — melyiket válasszük?',
    description: 'B, C, D karakterisztika — mikor melyiket kell alkalmazni? Teljes összehasonlítás a Schneider Acti9 sorozaton belül.',
    category: 'termek',
    readTime: 7,
    publishDate: '2026-04-12',
    content: '',
  },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  szakmai: 'Szakmai',
  diy: 'DIY',
  termek: 'Termék',
  helyi: 'Helyi',
};
