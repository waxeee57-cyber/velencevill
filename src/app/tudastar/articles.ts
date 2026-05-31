export type Category = 'szakmai' | 'diy' | 'termek' | 'helyi';

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: Category;
  readTime: number;
  publishDate: string;
  content: string;
  /** Ha true: az oldal renderelődik (URL-en ellenőrizhető), de noindex,
   *  nem jelenik meg a listában és a sitemap-ban. Szakmai lektorálás után
   *  állítsd false-ra a publikáláshoz. */
  draft?: boolean;
}

const LEGAL =
  'Ez a cikk tájékoztató jellegű, és nem helyettesíti a szakember egyedi, helyszíni véleményét. Villamos munkát Magyarországon kizárólag megfelelő jogosultsággal rendelkező szakember végezhet, az élő hálózaton végzett beavatkozás életveszélyes. Konkrét kivitelezéshez keresse fel üzletünket Velencén, vagy kérjen ajánlatot.';

const CTA =
  'Üzletünkben a fenti munkákhoz szükséges minden anyag megtalálható — 10+ vezető márka egy helyen, szakértői kiszolgálással. Kérjen ajánlatot a főoldalon, vagy keressen fel minket a Fecske utca 12. alatt, Velencén.';

export const ARTICLES: Article[] = [
  {
    slug: 'uj-haz-villanyszerelese',
    title: 'Új ház villanyszerelése lépésről lépésre 2026-ban',
    description: 'Teljes körű útmutató az új építésű házak villanyszerelési munkálataihoz: tervezéstől a végleges felülvizsgálatig.',
    category: 'szakmai',
    readTime: 8,
    publishDate: '2026-01-15',
    draft: true,
    content: `Egy új ház villamos hálózata évtizedekre szól, ezért a legrosszabb döntés a kapkodás. A jól megtervezett rendszer nemcsak biztonságos, hanem bővíthető is — a napelem, az elektromos autó töltő vagy a későbbi okosotthon mind a most lefektetett alapokra épül. Ez a cikk a folyamatot tekinti át, hogy tisztában legyen vele, mire számítson és mikor melyik döntést kell meghoznia.

## 1. Tervezés és igényfelmérés
A villanyszerelés a tervezőasztalon kezdődik, nem a falban. Még a falazás előtt érdemes végiggondolni, hol lesznek a bútorok, hová kerül a TV, a konyhai gépek, a mosógép, és hol szeretne később bővíteni. A modern háztartás lényegesen több áramkört és csatlakozási pontot igényel, mint egy 20 évvel ezelőtti. Gondoljon előre: üres védőcső a tetőtérbe vagy a garázsba később aranyat érhet.

## 2. Kiállások és falvésés
A nyomvonalak kijelölése és a dobozok elhelyezése után jön a vésés és a védőcsövezés. Itt dől el a kapcsolók, dugaljak és lámpahelyek pontos pozíciója — érdemes a helyszínen, szalaggal kijelölve egyeztetni, mert a kész falban már drága a módosítás. A gyenge­áramú hálózatot (internet, riasztó, kaputelefon) ilyenkor célszerű külön nyomvonalon kiépíteni.

## 3. Elosztótábla és áramkörök
A központ az elosztószekrény. Itt kapnak helyet a kismegszakítók, az áram-védőkapcsolók (FI relé) és a túlfeszültség-védelem. A korszerű kialakítás külön áramkörökre bontja a nagy fogyasztókat és a helyiségeket, és tartalékhelyet hagy a későbbi bővítéshez. A pontos felosztás a fogyasztói igények és a vonatkozó szabvány (MSZ HD 60364 sorozat) alapján a tervező és a kivitelező feladata.

## 4. Szerelés, kötések, szerelvényezés
A vezetékek behúzása után következnek a kötések, majd a vakolás után a szerelvényezés: kapcsolók, dugaljak, lámpatestek felszerelése. Itt válik láthatóvá a munka minősége — a márkás, jól illeszkedő szerelvények (például Legrand, Schneider) évtizedekig tartanak, miközben a lakás megjelenését is meghatározzák.

## 5. Felülvizsgálat és dokumentáció
A használatbavétel előtt érintésvédelmi (szabványossági) felülvizsgálat szükséges, amelyről jegyzőkönyv készül. Ez nem formaság: ez igazolja, hogy a rendszer biztonságos, és ez a dokumentum kell a műszaki átadáshoz is.

## Mire figyeljen
Ne a legolcsóbb anyagból gazdálkodjon a falban rejtett részeknél — azt cserélni a legdrágább. Hagyjon tartalékot az elosztóban és a védőcsövekben. A jövőbeli igényeket (klíma, töltő, napelem) már most jelezze a tervezőnek.

## Mikor hívjon szakembert
Új ház villanyszerelése a teljes folyamatában szakember feladata — a tervezéstől a felülvizsgálatig. Az anyagválasztásban viszont sokat számít a jó partner: szívesen segítünk összeállítani a teljes anyaglistát a tervek alapján.

${CTA}

${LEGAL}`,
  },
  {
    slug: 'fi-rele-vagy-kombinalt',
    title: 'FI relé vagy kombinált FI-kismegszakító? Mikor melyiket?',
    description: 'Összehasonlítjuk a hagyományos FI relék és a kombinált FI-kismegszakítók előnyeit, hátrányait és alkalmazási területeit.',
    category: 'szakmai',
    readTime: 6,
    publishDate: '2026-01-22',
    draft: true,
    content: `Az áram-védőkapcsoló (közismert nevén FI relé) életet ment: leoldja az áramkört, ha az emberi testen vagy hibás készüléken keresztül áram folyik a föld felé. A kérdés gyakran nem az, hogy kell-e, hanem az, hogy a hagyományos FI relét vagy a kombinált eszközt válassza-e az adott helyen.

## Mi a különbség?
A klasszikus FI relé (RCCB) kizárólag a hibaáramot figyeli, és önmagában nem véd túlterhelés vagy rövidzárlat ellen — ezért mögé kismegszakítók kerülnek. A kombinált FI-kismegszakító (RCBO) egyetlen eszközben egyesíti a hibaáram- és a túláramvédelmet, így egy adott áramkört önállóan, teljes körűen véd.

## Mikor előnyös a hagyományos FI relé?
Ha több áramkört fog össze egy közös védőkapcsoló alá, a FI relé költséghatékony megoldás. Hátránya viszont, hogy egyetlen hiba az összes mögötte lévő áramkört lekapcsolja — egy fürdőszobai hiba miatt a fél lakás sötétbe borulhat.

## Mikor jobb a kombinált (RCBO)?
A kombinált eszköz áramkörönként véd, így a hiba lokalizálódik: csak az érintett kör áll le, a többi működik tovább. Ez különösen értékes a fontos körök (hűtő, fűtésvezérlés, szerver, otthoni iroda) esetében, illetve ott, ahol a szelektivitás és az üzembiztonság fontos. Cserébe drágább és több helyet foglal az elosztóban.

## Döntési szempontok
A választás függ a fogyasztói igénytől, az áramkörök számától, a rendelkezésre álló helytől az elosztóban és a kívánt üzembiztonságtól. Számít a hibaáram-érzékenység (a lakossági személyvédelemnél jellemzően a finomabb fokozat) és a típus (a váltakozó és lüktető egyenáramú összetevőkre is reagáló kategóriák) — ezek pontos megválasztása a szabvány (MSZ HD 60364-4-41) és a terhelés ismeretében szakember feladata.

## Mikor hívjon szakembert
Az áram-védőkapcsoló kiválasztása és bekötése, valamint a meglévő rendszer felülvizsgálata szakértelmet igényel. A teszt­gomb havi kipróbálása viszont a felhasználó feladata — ha nem old le, azonnal hívjon szakembert.

${CTA}

${LEGAL}`,
  },
  {
    slug: 'hany-aramkor-kell-100m2',
    title: 'Hány áramkör kell egy 100 m² családi házba?',
    description: 'Szabványos áramkörelosztás 100 m²-es háznál: hány kör kell a konyhába, fürdőbe, nappaliba és a külső területekre.',
    category: 'szakmai',
    readTime: 5,
    publishDate: '2026-02-01',
    draft: true,
    content: `A kérdésre nincs egyetlen helyes szám — az áramkörök mennyiségét a fogyasztók, a helyiségek funkciói és a jövőbeli igények határozzák meg. Az viszont biztos, hogy a korszerű ház lényegesen több körre van bontva, mint a régi „egy biztosíték az egész lakásnak" logika.

## Miért fontos a sok, jól bontott áramkör?
A körök szétválasztása két dolgot ad: biztonságot és kényelmet. Ha egy kör hibásodik vagy túlterhelődik, csak az áll le, nem az egész ház. A nagy fogyasztók (konyhai gépek, fűtés, töltő) külön körön nem zavarják egymást.

## Tipikus logika helyiségenként
Tájékoztató jelleggel a tervezés általában külön kezeli a következőket: a konyha nagy fogyasztói (sütő, főzőlap jellemzően saját, megfelelő terhelhetőségű körön), a konyhai munkapult dugaljai, a mosogatógép és mosógép, a fürdőszoba, a nappali és hálók világítása és dugaljai külön-külön, valamint a kültéri és garázs körök. A pontos darabszám a konkrét tervtől függ.

## Amit ne felejtsen el
Gondoljon a jövőre: klíma, elektromos autó töltő, napelem — ezek mind dedikált kört és tartalékhelyet igényelnek az elosztóban. Sokkal olcsóbb most egy üres helyet és védőcsövet hagyni, mint később átalakítani.

## Miért nem érdemes „kapásból" méretezni?
Az áramkörök számát, terhelhetőségét és védelmét a szabvány (MSZ HD 60364 sorozat) és a tényleges terhelés alapján kell meghatározni. Egy alulméretezett rendszer folyamatos lekapcsolásokkal és melegedéssel bosszul, a túlméretezett pedig feleslegesen drága.

## Mikor hívjon szakembert
A körfelosztás tervezése és kivitelezése szakember dolga — de ha tudja, hány körre van szüksége, mi segítünk a teljes anyag (kismegszakítók, FI relék, elosztószekrény, vezeték) összeállításában.

${CTA}

${LEGAL}`,
  },
  {
    slug: 'ev-tolto-telepites-otthon',
    title: 'EV töltő telepítés otthon: 11 kW vagy 22 kW?',
    description: 'Mit kell tudni az otthoni elektromos autó töltő telepítéséről? Melyik teljesítmény az ideális és milyen hálózati feltételek szükségesek?',
    category: 'diy',
    readTime: 7,
    publishDate: '2026-02-10',
    draft: true,
    content: `Az otthoni töltő a kényelmes elektromos autózás alapja: reggelre tele „tankkal" indul. A leggyakoribb kérdés a teljesítmény — 11 vagy 22 kW —, de a valódi döntést a ház adottságai és az autó képességei együtt határozzák meg.

## 11 kW vagy 22 kW: mi a különbség?
Mindkettő háromfázisú töltést jelent, a 22 kW a gyorsabb. A bökkenő: sok autó fedélzeti töltője csak 11 kW-ot (vagy kevesebbet) fogad, így a 22 kW-os fali töltő előnye nem érvényesül. Otthoni környezetben, egész éjszakás töltésnél a 11 kW jellemzően bőven elég.

## Hálózati feltételek
A 22 kW komolyabb hálózati hátteret és jellemzően a szolgáltató felé történő bejelentést, egyeztetést igényelhet, mert megnöveli a ház csúcsterhelését. A 11 kW-os telepítés általában egyszerűbb. A pontos lehetőséget a rendelkezésre álló teljesítmény és a meglévő hálózat határozza meg — ezt szakember méri fel.

## Amit a töltő igényel
A töltő dedikált áramkört kap, megfelelő keresztmetszetű kábellel és a típusának megfelelő védelemmel, beleértve a megfelelő áram-védőkapcsolót. Sok modern töltő tartalmaz beépített egyenáramú hibaáram-érzékelést — hogy pontosan milyen külső védelem kell, az a töltő adatlapjától és a szabványtól (MSZ HD 60364) függ.

## Okos funkciók, amelyeket érdemes mérlegelni
Terheléskezelés (hogy a töltő visszavegyen, ha a ház sokat fogyaszt), napelemes többlet töltése, ütemezés az olcsóbb tarifához, felhasználó-azonosítás. Ezek kényelmi és megtérülési szempontból is hasznosak lehetnek.

## Mit csináljon Ön, és mit a szakember
Ön eldöntheti a töltő típusát, helyét és a kívánt okos funkciókat. A dedikált áramkör kiépítését, a védelem megválasztását, a bekötést és a kötelező felülvizsgálatot azonban szakember végzi — a töltő élő hálózati csatlakoztatása nem barkácsfeladat.

## Mikor hívjon szakembert
A telepítés teljes villamos részéhez. Mi a töltő és a szükséges anyagok kiválasztásában segítünk, és ajánlott partnerünk a kivitelezést is vállalja.

${CTA}

${LEGAL}`,
  },
  {
    slug: 'napelem-inverter-vedelem',
    title: 'Napelem inverter és AC-oldali védelem — szabványos kialakítás',
    description: 'Hogyan kell szabványosan kialakítani a napelem rendszer AC-oldali védelmét? Leválasztó, visszatáplálás elleni védelem, biztosítékok.',
    category: 'szakmai',
    readTime: 9,
    publishDate: '2026-02-18',
    draft: true,
    content: `A napelemes rendszer két világot köt össze: az inverter egyenáramú (DC) oldalát és a ház váltakozó áramú (AC) hálózatát. A biztonságos és szabványos működés kulcsa a megfelelő védelem mindkét oldalon — ez a cikk az AC-oldal elvi áttekintését adja.

## Miért különleges egy napelemes rendszer?
A hagyományos hálózatban az áram egy irányba folyik, a napelemes rendszerben viszont az inverter is termel és táplál vissza. Ez új védelmi szempontokat hoz: kezelni kell a kétirányú energiaáramlást, a leválaszthatóságot és a hibaáramokat is.

## AC-oldali leválasztás és túláramvédelem
Az inverter és a ház hálózata közé szabványos leválasztási és túláramvédelmi pont kerül, amely lehetővé teszi a rendszer biztonságos lekapcsolását karbantartáshoz vagy hiba esetén, és véd a túláram ellen. A méretezés az inverter névleges paramétereihez és a kábelhez igazodik.

## Hibaáram-védelem
A napelemes betáplálás sajátossága miatt a hibaáram-védelem típusának megválasztása kiemelten fontos: bizonyos inverterek és telepítések az egyenáramú összetevőkre is érzékeny védelmet igényelnek. A pontos típust az inverter adatlapja és a szabvány (MSZ HD 60364, ezen belül a napelemes betáplálásra vonatkozó rész, a -7-712) együtt határozza meg.

## Túlfeszültség-védelem és villámvédelem
A tetőre szerelt rendszer fokozottan ki van téve a túlfeszültségeknek. A megfelelő túlfeszültség-védelem (SPD) megválasztása és elhelyezése védi az invertert és a ház elektronikáját — ennek kialakítása a telepítés adottságaitól függ.

## Visszatáplálás és a szolgáltató
A hálózatra tápláló rendszer engedély- és bejelentésköteles, és az inverternek meg kell felelnie a hálózati csatlakozási előírásoknak (például a hálózat kiesésekor történő automatikus leválás). Ez nem műszaki apróság, hanem a biztonságos együttműködés feltétele.

## Mikor hívjon szakembert
A napelemes rendszer tervezése, a védelmek méretezése, a bekötés és a felülvizsgálat kizárólag szakember feladata — a DC-oldal akár napsütésben is feszültség alatt áll. Mi az AC-oldali védelmi eszközök (leválasztók, túláram- és túlfeszültség-védelem, megfelelő FI) beszerzésében segítünk.

${CTA}

${LEGAL}`,
  },
  {
    slug: 'okos-otthon-shelly-alapok',
    title: 'Okos otthon Shelly-vel: mit tud és hol a határ',
    description: 'Áttekintés a Shelly okos relékről: milyen feladatokra jók, hogyan illeszkednek a meglévő hálózatba, és miért kell a bekötéshez szakember.',
    category: 'diy',
    readTime: 10,
    publishDate: '2026-02-25',
    draft: true,
    content: `A Shelly eszközök népszerűségének oka egyszerű: kis méretű, Wi-Fi-s relék, amelyek a meglévő szerelvénydobozba illeszthetők, és okossá teszik a hagyományos kapcsolókat, lámpákat, redőnyöket. Ez a cikk azt mutatja meg, mire jók — és hol húzódik a határ a felhasználó és a szakember feladata között.

## Mit tud a Shelly?
A tipikus modulok kapcsolást, fényerő-szabályozást, redőnyvezérlést, fogyasztásmérést és ütemezést kínálnak, mobilalkalmazásból vagy hangasszisztenssel vezérelve. Mivel a meglévő kapcsoló mögé kerülnek, a fali kapcsoló is működőképes marad — ez nagy előny a családtagoknak.

## Hová érdemes tenni?
Gyakori felhasználás: kültéri és hangulatvilágítás ütemezése, redőny automatizálás, „mindent le" jelenetek távozáskor, illetve egyes körök fogyasztásának mérése. Kezdetnek érdemes egy-két jól körülhatárolt feladattal indulni, nem az egész házat egyszerre okosítani.

## A kritikus pont: a bekötés
És itt jön a leglényegesebb üzenet. A Shelly modul a 230 V-os hálózatra, a fali dobozba kerül, gyakran nulla­vezető bekötését is igényli. Ez élő hálózaton végzett villamos munka — nem barkácsfeladat. A modul kiválasztása, a meglévő bekötés ellenőrzése (van-e nulla a dobozban), a helyes csatlakoztatás és a biztonságos lezárás szakember dolga.

## Hálózati és biztonsági szempontok
Az okoseszközök nem helyettesítik a megfelelő áramköri védelmet: a kismegszakítók és az áram-védőkapcsoló továbbra is a hagyományos elven védenek. Érdemes a Wi-Fi hálózat megbízhatóságára és a gyártói frissítésekre is figyelni.

## Amit Ön nyugodtan megtehet
A rendszer megtervezése, az alkalmazás beállítása, a jelenetek és ütemezések létrehozása, a felhasználói fiókok kezelése — ez mind az Ön kezében van, és itt tényleg lehet kísérletezni.

## Mikor hívjon szakembert
A fizikai bekötéshez minden esetben. Mi segítünk kiválasztani a feladathoz illő Shelly modulokat és a szükséges szerelvényeket, a bekötést pedig bízza szakemberre.

${CTA}

${LEGAL}`,
  },
  {
    slug: 'erintesvedelem-felulvizsgalat',
    title: 'Érintésvédelmi felülvizsgálat — mit ellenőriz a villanyszerelő?',
    description: 'Mire terjed ki az érintésvédelmi felülvizsgálat, milyen dokumentumokat kap az ügyfél és mikor kötelező elvégezni?',
    category: 'szakmai',
    readTime: 6,
    publishDate: '2026-03-05',
    draft: true,
    content: `Az érintésvédelmi (szabványossági) felülvizsgálat azt igazolja, hogy a villamos berendezés biztonságos: hiba esetén megfelelően véd az áramütés ellen. Sokan formaságnak hiszik, pedig ez az a dokumentum, amely baj esetén bizonyítja a rendszer megfelelőségét.

## Mire terjed ki?
A felülvizsgálat szemrevételezésből és műszeres mérésekből áll. A szakember ellenőrzi az elosztó és a szerelvények állapotát, a védővezetők meglétét és kötéseit, a védelmi eszközök (kismegszakítók, FI relé) helyességét, és műszerrel ellenőrzi a védelem hatásosságát. A részleteket a vonatkozó szabvány (MSZ HD 60364-6 a felülvizsgálatról) tartalmazza.

## Milyen dokumentumot kap?
A munka eredménye egy minősítő irat / jegyzőkönyv, amely rögzíti a mérési eredményeket és a berendezés megfelelőségét, valamint a feltárt hiányosságokat. Ezt érdemes megőrizni — kérheti hatóság, biztosító vagy egy későbbi átadás.

## Mikor kötelező vagy ajánlott?
Új berendezés használatbavétele előtt, jelentős átalakítás után, illetve időszakosan szükséges. A felülvizsgálatok gyakoriságát a rendeltetés és a jogszabályi előírások határozzák meg — lakóingatlannál is indokolt időről időre ellenőriztetni, különösen régi hálózatnál.

## Árulkodó jelek, hogy ne halogassa
Melegedő dugalj vagy kapcsoló, égett szag, gyakran leoldó védelem, vibráló világítás, vagy ha a FI relé tesztgombja nem old le — ezek mind azonnali ellenőrzést indokolnak.

## Mikor hívjon szakembert
A felülvizsgálatot kizárólag erre jogosult szakember végezheti, megfelelő műszerekkel. A havi FI-teszt (a tesztgomb megnyomása) viszont a felhasználó egyszerű, ajánlott rutinja.

${CTA}

${LEGAL}`,
  },
  {
    slug: 'villanyszereles-koltsegek-2026',
    title: 'Mennyibe kerül egy lakás teljes villanyszerelése 2026-ban?',
    description: 'Reális árszerkezet, befolyásoló tényezők és tippek arra, hogyan spóroljon a villanyszerelési munkálatokon a biztonság veszélyeztetése nélkül.',
    category: 'diy',
    readTime: 7,
    publishDate: '2026-03-12',
    draft: true,
    content: `A „mennyibe kerül" kérdésre a legőszintébb válasz: attól függ. A teljes villanyszerelés ára néhány jól azonosítható tényezőből áll össze, és ezek megértése segít reálisan tervezni — és felismerni, ha egy ajánlat gyanúsan olcsó.

## Miből áll a költség?
Három fő összetevő: az anyag (vezeték, szerelvények, elosztó, védelmi eszközök), a munkadíj (vésés, szerelés, kötések, szerelvényezés), és a kiegészítő munkák (helyreállítás, felülvizsgálat, dokumentáció). Az arányuk a projekt jellegétől függ.

## Mitől függ leginkább?
A lakás mérete és az áramkörök száma, az anyagminőség (alap vagy prémium szerelvények), a falazat (mennyi vésés kell), a meglévő állapot (új építés vagy felújítás, ahol bontani is kell), és az extra igények: klíma, töltő, napelem-előkészítés, okosotthon.

## Reális várakozás 2026-ban
Konkrét árat felelősen csak felmérés után lehet mondani, mert a fenti tényezők nagyon eltérők. Tájékoztató jelleggel: a falban rejtett részeknél (vezeték, védőcső, kötések) sosem érdemes a legolcsóbbat választani, mert ezek cseréje a legdrágább később. A látható szerelvényeknél viszont szabadabban gazdálkodhat a büdzsével.

## Hogyan spóroljon okosan?
Tervezzen előre, hogy ne kelljen menet közben átalakítani. Az anyagot vásárolja megbízható szaküzletből, ahol egy helyen, jó minőségben kapja meg a teljes listát. Csoportosítsa a munkákat. Amin viszont soha ne spóroljon: a védelmi eszközök minősége és a szakszerű kivitelezés.

## Mikor hívjon szakembert
Az árajánlat alapja mindig a helyszíni felmérés. Mi az anyagköltség pontos összeállításában segítünk a tervek vagy a szerelő listája alapján, így átláthatóvá válik a büdzsé.

${CTA}

${LEGAL}`,
  },
  {
    slug: 'kulteri-vilagitas-ip-vedettseg',
    title: 'Kültéri világítás: melyik IP védettségi fokozat kell?',
    description: 'IP20-tól IP68-ig: mikor melyik IP védettségi fokozatú lámpa szükséges? Terasz, bejárat, kert, medence mellé mit válasszunk?',
    category: 'diy',
    readTime: 5,
    publishDate: '2026-03-20',
    draft: true,
    content: `A kültéri lámpa élettartamát és biztonságát leginkább az dönti el, mennyire állja a port és a vizet. Erre szolgál az IP-kód (a szabvány az MSZ EN 60529) — ha ezt elnézi, a szép lámpa egy esős ősz után tönkremehet.

## Mit jelent az IP-kód?
Az IP után két szám áll. Az első (0–6) a szilárd testek és por elleni védelmet jelöli, a második (0–8) a víz elleni védelmet. Minél nagyobb a szám, annál jobb a védelem. Egy beltéri lámpa lehet alacsony fokozatú, egy kültéri viszont magasabbat kíván.

## Hová mit — tájékoztató logika
A választás a víznek és pornak való kitettségtől függ. Fedett, eső ellen védett helyre (fedett terasz, tornác) alacsonyabb fokozat is elég lehet. Szabadon álló, esőnek kitett helyre (kerti lámpa, homlokzat, bejárat) már fröccsenő-, illetve csapó­eső-álló fokozat kell. Vízközeli vagy medence környéki, illetve talajba/vízbe kerülő lámpáknál kiemelten magas védettség és külön biztonsági szempontok szükségesek.

## A medence külön eset
A medence és környéke fokozottan veszélyes terület: itt nem elég a magas IP — a víz közelében a villamos kialakításra külön, szigorú szabványi előírások vonatkoznak (MSZ HD 60364-7-702). Ezt mindig szakemberrel tervezze.

## További szempontok
Az IP mellett figyeljen az anyagminőségre (UV- és korrózióállóság), a rögzítésre és a fényforrás cserélhetőségére. A jó kültéri lámpa nemcsak véd, hanem évekig szépen is marad.

## Mikor hívjon szakembert
A lámpa kiválasztásában szívesen segítünk az adott helyhez. A kültéri áramkör kiépítését, a vízközeli telepítéseket és a medence környéki munkát viszont bízza szakemberre.

${CTA}

${LEGAL}`,
  },
  {
    slug: 'kabelmeretezes-alapok',
    title: 'Kábelméretezés alapok: mitől függ a megfelelő keresztmetszet?',
    description: 'A kábel keresztmetszetének kiválasztása nem csak a terhelhetőségről szól — feszültségesés, szerelési mód és védelem is számít.',
    category: 'szakmai',
    readTime: 8,
    publishDate: '2026-03-28',
    draft: true,
    content: `A kábel keresztmetszete az egyik leggyakrabban félreértett téma. Sokan azt hiszik, elég egy táblázatból kikeresni az amper-értéket — a valóságban több tényező együttese dönt, és a hibás méretezés melegedéshez, tűzhöz vagy folyamatos lekapcsoláshoz vezethet. Ezért ez a cikk az elvet mutatja be, nem kész recepteket ad.

## Miért nem elég egy táblázat?
A megfelelő keresztmetszet több feltétel egyidejű teljesítését jelenti: a kábel terhelhetősége legyen összhangban a védelemmel és a terheléssel, a feszültségesés maradjon a megengedett határon belül, és a kábel bírja a rövidzárlati igénybevételt is. Ezek közül a leginkább korlátozó dönt — és ez projektenként más lehet.

## A terhelhetőséget befolyásoló tényezők
Ugyanaz a kábel eltérő körülmények között eltérő terhelhetőségű. Számít a szerelési mód (szabadon, csőben, falban, kötegelve), a környezeti hőmérséklet, a közeli kábelek miatti halmozás, és a szigetelés típusa. Ezeket a szabvány (MSZ HD 60364-5-52) korrekciós tényezőkkel kezeli.

## Feszültségesés — a hosszú vezetékek csapdája
Hosszú nyomvonalnál (például kerti világítás, melléképület, töltő) a vezeték ellenállása miatt eső feszültség jelentős lehet. Ezért előfordul, hogy nem a terhelhetőség, hanem a feszültségesés-korlát miatt kell vastagabb kábelt választani.

## Összhang a védelemmel
A kábelt és a túláramvédelmet együtt kell méretezni: a védelemnek meg kell védenie a kábelt a túlterheléstől és a rövidzárlattól, mielőtt az károsodna. Ezért nem lehet egy kábelt tetszőleges kismegszakítóval párosítani.

## Miért szakember feladata?
Mivel a fenti tényezők együtt, a helyszíni adottságok ismeretében adnak helyes eredményt, a méretezés mérnöki/szakmai feladat. Ezért nem közlünk itt készpénznek vehető keresztmetszet-táblázatot — a cél a megértés, nem az, hogy laikus saját maga méretezzen élő hálózatra.

## Mikor hívjon szakembert
A méretezéshez és a kivitelezéshez. Ha viszont megvan a szakember által meghatározott keresztmetszet és típus, nálunk egy helyen beszerezheti a megfelelő minőségű vezetéket.

${CTA}

${LEGAL}`,
  },
  {
    slug: 'legrand-valena-kapcsolok',
    title: 'Legrand Valena kapcsolósorozat — teljes útmutató',
    description: 'A Legrand Valena Life sorozat változatai: kapcsolók, dimmer, USB töltő, adataljzat. Melyiket válassza és miért?',
    category: 'termek',
    readTime: 6,
    publishDate: '2026-04-05',
    draft: true,
    content: `A kapcsolók és dugaljak a lakás „arcához" tartoznak: nap mint nap látja és érinti őket. A Legrand Valena az egyik legnépszerűbb sorozat a magyar piacon, mert a megbízható minőséget letisztult formavilággal és széles választékkal párosítja.

## Miért népszerű a Valena?
A sorozat ár-érték aránya és bővíthetősége teszi kedveltté: a hagyományos kapcsolóktól a modern funkciós elemekig egységes formanyelven épül fel, így az egész lakás konzisztens megjelenést kap. A keretek és betétek kombinálhatók, a bővítés is egyszerű.

## Mit tartalmaz a kínálat?
A megszokott egy- és kétpólusú kapcsolók, váltó- és keresztkapcsolók mellett elérhetők fényerő-szabályozók (dimmer), mozgásérzékelős és időzítős megoldások, beépített USB-töltős aljzatok, valamint adat- és multimédia-csatlakozók. Így egyetlen sorozaton belül lefedhető a teljes lakás igénye, a nappalitól a dolgozószobáig.

## Hogyan válasszon?
Induljon a funkcióból: hol kell sima kapcsolás, hol váltókapcsoló (két helyről kapcsolt lámpa), hol dimmer, és hová jönne jól egy USB-aljzat (hálószoba, konyha, gyerekszoba). Ezután válassza ki az egységes keret- és színcsaládot, hogy a végeredmény harmonikus legyen.

## Esztétika és variálhatóság
A különböző keret­színek és felületek lehetővé teszik, hogy a szerelvény illeszkedjen a falszínhez és a belső­építészeti stílushoz. Egy átgondoltan választott sorozat látványban is sokat dob a lakáson.

## Mikor hívjon szakembert
A kapcsolók, dimmerek és funkciós aljzatok cseréje és bekötése villamos munka, amelyet szakember végez. A kiválasztásban viszont szívesen segítünk: üzletünkben megnézheti a Valena darabokat, és összeállítjuk a teljes listát a lakásához.

${CTA}

${LEGAL}`,
  },
  {
    slug: 'schneider-acti9-biztositek',
    title: 'Schneider Acti9 kismegszakítók — melyiket válassza?',
    description: 'B, C, D karakterisztika — mikor melyiket kell alkalmazni? Áttekintés a Schneider Acti9 sorozaton belül.',
    category: 'termek',
    readTime: 7,
    publishDate: '2026-04-12',
    draft: true,
    content: `A kismegszakító az elosztó „őre": túláram és rövidzárlat esetén lekapcsol, megvédve a vezetéket és a berendezést. A Schneider Acti9 a professzionális elosztók egyik referencia­sorozata — megbízható, jól bővíthető, és a kiegészítőivel teljes rendszerré áll össze.

## Mit jelent a B, C, D karakterisztika?
A betű a kismegszakító pillanatszerű (gyors) leoldási viselkedését jelöli, vagyis azt, mekkora hirtelen áramnál kapcsol le azonnal. Röviden: a B a legérzékenyebb, a C a leggyakoribb általános célú, a D pedig a nagy bekapcsolási áramlökést adó terhelésekhez készült. A pontos választás a terhelés jellegétől és a hálózat paramétereitől függ.

## Mikor melyik — elvi áttekintés
A B karakterisztika jellemzően kis induló­áramú, ellenállásos terhelésekhez (például világítás, dugaljkörök) illik. A C az általános, vegyes terheléshez a leggyakoribb választás. A D az erős induló­áramú, induktív vagy nagy lökést adó fogyasztókhoz (egyes motorok, transzformátoros terhelések) való. A helyes hozzárendelés méretezési kérdés.

## Az Acti9 előnyei
A sorozat a kismegszakítók mellett áram-védőkapcsolókat, kombinált eszközöket (RCBO), túlfeszültség-védelmet és segédkiegészítőket is kínál, egységes rendszerben. Ez megkönnyíti a tervezést, a szerelést és a későbbi bővítést, az elosztó pedig átlátható és igényes marad.

## Minőség és megbízhatóság
A professzionális elosztóban a védelmi eszköz minősége nem az a pont, ahol spórolni érdemes: ez véd tűz és áramütés ellen. A márkás, jól dokumentált eszközök hosszú távon megbízhatóan teszik a dolgukat.

## Mikor hívjon szakembert
A karakterisztika és az áramerősség megválasztása, valamint az elosztó kialakítása szakember feladata, a szabvány és a terhelés alapján. Ha megvan a specifikáció, nálunk beszerezheti a teljes Acti9 rendszert egy helyen.

${CTA}

${LEGAL}`,
  },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  szakmai: 'Szakmai',
  diy: 'DIY',
  termek: 'Termék',
  helyi: 'Helyi',
};
