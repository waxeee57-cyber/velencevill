export interface City {
  slug: string;
  /** A megcélzott földrajzi egység neve, ahogy a címsorban és a title-ben megjelenik. */
  name: string;
  /** Közúti távolság a Fecske utca 12-től. A `velence` esetén '0 km' = maga a szaküzlet. */
  tavol: string;
  /** Rövid pozicionáló mondattöredék — a meta descriptionbe és a hero alá kerül. */
  leiras: string;
  /** A lapon ténylegesen felsorolt, kiszolgált települések. Ez adja a lap egyedi
   *  kulcsszó-fedését: az összevont oldalak (lásd lent) nevei itt élnek tovább. */
  telepulesek: string[];
  /** Oldalspecifikus bevezető. Ez különbözteti meg érdemben a lapokat egymástól —
   *  csak ellenőrizhető tényt tartalmazhat (távolság, földrajz, nyitvatartás, kínálat). */
  bevezeto: string;
  /** 3 oldalspecifikus tény-blokk (cím + szöveg). Nem marketingszöveg: konkrétum. */
  tenyek: { cim: string; szoveg: string }[];
}

/**
 * ⚠️ 2026-09-13 — KONSZOLIDÁLVA 8 → 3 OLDALRA.
 *
 * Miért: a korábbi 8 városoldal páronként 93,2–97,2% szóátfedést mutatott
 * (átlag 94,7%, 28 pár mérve az éles oldalakon), oldalanként 193–205 szóval.
 * A teljes megkülönböztetés egy településnév és egy távolság volt — ez a Google
 * doorway-page irányelvének pontos leírása. Ráadásul nulla belső link mutatott
 * rájuk az egész oldalról.
 *
 * Megszüntetve (301 a `next.config.mjs`-ben, a kulcsszavaik a megmaradó lapok
 * `telepulesek` tömbjében élnek tovább):
 *   agard          → /helyi/gardony      (Agárd Gárdony városrésze)
 *   sukoro         → /helyi/fejer-megye
 *   pakozd         → /helyi/fejer-megye
 *   kapolnasnyek   → /helyi/fejer-megye
 *   szekesfehervar → /helyi/fejer-megye  (megyeszékhely, az ernyőlap fedi)
 *
 * Új oldal felvétele előtt: csak akkor, ha van hozzá VALÓDI egyedi tartalom.
 * Sablonból generált településoldal ide többé ne kerüljön vissza.
 */
export const CITIES: City[] = [
  {
    slug: 'velence',
    name: 'Velence',
    tavol: '0 km',
    leiras: 'Szaküzletünk helyszíne',
    telepulesek: ['Velence', 'Velencefürdő', 'Velence-újtelep'],
    bevezeto:
      'A szaküzlet Velencén, a Fecske utca 12. alatt van — nem raktár és nem webshop, hanem pult, ' +
      'ahol személyesen át lehet venni az anyagot. Ha velencei címre dolgozik, a kiszállás ideje ' +
      'nulla: telefonon félretetetheti, amire szüksége van, és beugrik érte munka közben.',
    tenyek: [
      {
        cim: 'Nyitvatartás és átvétel',
        szoveg:
          'Hétfőtől péntekig 8:00–16:00, szombaton 8:00–12:00. Vasárnap zárva. ' +
          'Telefonon (+36 30 618 2165) előre összekészíttetheti az anyaglistát, így csak átveszi.',
      },
      {
        cim: 'Ami raktárról vihető',
        szoveg:
          'Vezeték és kábel (MCU, NYM-J, NYY-J, CYKY, UTP), kapcsolók és dugaljak, kismegszakítók ' +
          'és FI-relék, elosztószekrények, világítástechnika, szerelési anyagok és kéziszerszám. ' +
          'A készlet aktuális állapota a termékkatalógusban jelzett.',
      },
      {
        cim: 'Ha nagyobb tétel kell',
        szoveg:
          'Teljes lakásfelújítás vagy új építés anyagigényét érdemes előre jelezni — ' +
          'a nem raktárkészletes tételek rendelhetők, és a beérkezésről szólunk.',
      },
    ],
  },
  {
    slug: 'gardony',
    name: 'Gárdony és Agárd',
    tavol: '4–5 km',
    leiras: 'Gárdony, Agárd és Dinnyés kiszolgálása',
    telepulesek: ['Gárdony', 'Agárd', 'Dinnyés', 'Gárdony-Nádasdladány'],
    bevezeto:
      'Agárd és Dinnyés közigazgatásilag Gárdony városrészei, ezért egy oldalon kezeljük őket. ' +
      'A Fecske utcától Gárdony központja kb. 4 km, Agárd kb. 5 km — a 7-es főúton pár perc. ' +
      'Ez a leggyakoribb irány, ahonnan nyaralófelújításhoz és kültéri munkához jönnek anyagért.',
    tenyek: [
      {
        cim: 'Nyaraló- és üdülőövezeti munka',
        szoveg:
          'Az agárdi és dinnyési üdülőterületen tipikusan régi, elavult hálózat van: ' +
          'biztosítéktábla-csere, FI-relé utólagos beépítése, kültéri vezetékezés. ' +
          'Ezekhez a tételekhez tartunk készletet.',
      },
      {
        cim: 'Kültéri és vízparti kivitelezés',
        szoveg:
          'Vízpart közeli telkeknél az IP-védettség nem opcionális. Kültéri lámpatestek, ' +
          'IP44 és afölötti dugaljak, földkábel (NYY-J) és gégecső raktárról elérhető.',
      },
      {
        cim: 'Út és idő',
        szoveg:
          'Gárdony ~4 km, Agárd ~5 km a Fecske utca 12-től. Nyitvatartás H–P 8:00–16:00, ' +
          'Szo 8:00–12:00. Nagyobb tételt érdemes telefonon előre összekészíttetni.',
      },
    ],
  },
  {
    slug: 'fejer-megye',
    name: 'Fejér megye',
    tavol: '15 km Székesfehérvárig',
    leiras: 'Velencei-tó környéke és a megye egésze',
    telepulesek: [
      'Székesfehérvár',
      'Kápolnásnyék',
      'Sukoró',
      'Pákozd',
      'Nadap',
      'Pázmánd',
      'Vereb',
      'Zichyújfalu',
    ],
    bevezeto:
      'A szaküzlet a Velencei-tó északi partján, Velencén működik, és a tó körüli településektől ' +
      'Székesfehérvárig szolgál ki. Székesfehérvár kb. 15 km, Kápolnásnyék kb. 10 km, ' +
      'Pákozd kb. 8 km, Sukoró kb. 7 km — mindegyik a megye belső, jól megközelíthető gyűrűjében.',
    tenyek: [
      {
        cim: 'Kiszolgált települések',
        szoveg:
          'Székesfehérvár, Kápolnásnyék, Sukoró, Pákozd, Nadap, Pázmánd, Vereb, Zichyújfalu ' +
          'és a Velencei-tó további környező települései. Gárdony és Agárd saját oldalon.',
      },
      {
        cim: 'Miért érdemes ideautazni',
        szoveg:
          '13 gyártó terméke egy pulton: Legrand, Schneider Electric, ABB, Tracon, OBO Bettermann, ' +
          'Kanlux, EGLO, Rabalux, GLOBO, EMOS, KOPP, Famatel, Mentavill. ' +
          'Egy útból megvan, amiért egyébként két-három helyre kellene menni.',
      },
      {
        cim: 'Előrendelés telefonon',
        szoveg:
          'Ha 10–15 km-ről indul, ne feleslegesen: hívja a +36 30 618 2165-öt, ' +
          'összekészítjük az anyaglistát, és csak átveszi. Anyaglistát az oldalról is küldhet.',
      },
    ],
  },
];

/**
 * A konszolidáció során megszüntetett oldalak és az utódjuk. A `next.config.mjs`
 * ebből NEM olvas (ott a redirectek külön, explicit módon vannak felsorolva) —
 * ez a lista dokumentációs célú, hogy egy helyen látszódjon, mi hova ment.
 */
export const MEGSZUNT_VAROS_OLDALAK: Record<string, string> = {
  agard: 'gardony',
  sukoro: 'fejer-megye',
  pakozd: 'fejer-megye',
  kapolnasnyek: 'fejer-megye',
  szekesfehervar: 'fejer-megye',
};
