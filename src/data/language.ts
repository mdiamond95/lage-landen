// The map for Unit 15: Belgium's languages and the lines the language laws drew,
// 1830 to 2012, on its own base of municipalities (`base: 'belgium'`). Areas use its
// pieces: flanders and wallonia, brussels (the 16 municipalities bilingual from 1932)
// and brussels-1954 (Evere, Ganshoren and Sint-Agatha-Berchem), rand-1954 and rand-1963
// (the six municipalities with facilities around Brussels, by the year they got them),
// halle-vilvoorde (the rest of that arrondissement), voeren, comines and mouscron (moved
// between provinces in 1963), east-cantons (the nine German-speaking municipalities) and
// malmedy (Malmedy and Waimes). Before the laws of 1921 and 1932 the colours show the
// language most people spoke; after them, the language of the town hall and the school.
// The line itself is drawn as it was fixed in 1963; it had hardly moved for centuries.

import { type HistArea, type HistEvent, type HistLabel, type HistSite, type TimeStory } from './timeline'

export const LANGUAGE_MIN = 1830
export const LANGUAGE_MAX = 2012

const EQUALITY = 1898
const CANTONS = 1920
const LAWS = 1932
const CENSUS = 1954
const FIXED = 1963
const FIRST_REFORM = 1970
const REGIONS = 1980
const BRUSSELS_REGION = 1989
const FEDERAL = 1993
const SPLIT = LANGUAGE_MAX
const until = (next: number) => next - 1

const north = ['flanders', 'halle-vilvoorde', 'rand-1954', 'rand-1963', 'voeren']
const south = ['wallonia', 'comines', 'mouscron']

const areas: HistArea[] = [
  // Before the laws: the language most people spoke. Brussels was mostly Flemish in 1830,
  // and half bilingual by 1910.
  { name: 'Dutch spoken', kind: 'dutch', from: LANGUAGE_MIN, to: until(LAWS), regions: north },
  { name: 'French spoken', kind: 'french', from: LANGUAGE_MIN, to: until(LAWS), regions: south },
  { name: 'Brussels, mostly Flemish', kind: 'dutch', from: LANGUAGE_MIN, to: until(EQUALITY), regions: ['brussels', 'brussels-1954'] },
  { name: 'Brussels, turning to French', kind: 'bilingual', from: EQUALITY, to: until(LAWS), regions: ['brussels'] },
  { name: 'Evere, Ganshoren and Berchem, still Flemish', kind: 'dutch', from: EQUALITY, to: until(CENSUS), regions: ['brussels-1954'] },
  { name: 'Prussia, then Germany', kind: 'abroad', from: LANGUAGE_MIN, to: until(CANTONS), regions: ['east-cantons', 'malmedy'] },
  { name: 'German-speaking East Cantons', kind: 'german', from: CANTONS, regions: ['east-cantons'] },
  { name: 'Malmedy and Waimes', kind: 'french', from: CANTONS, regions: ['malmedy'] },
  // The laws of 1932: each side runs in its own language, Brussels in both.
  { name: 'Dutch-language area', kind: 'dutch', from: LAWS, regions: ['flanders', 'halle-vilvoorde'] },
  { name: 'Voeren, in the province of Liège', kind: 'dutch', from: LAWS, to: until(FIXED), regions: ['voeren'] },
  { name: 'Drogenbos, Kraainem, Linkebeek and Wemmel', kind: 'dutch', from: LAWS, to: until(CENSUS), regions: ['rand-1954'] },
  { name: 'Sint-Genesius-Rode and Wezembeek-Oppem', kind: 'dutch', from: LAWS, to: until(FIXED), regions: ['rand-1963'] },
  { name: 'French-language area', kind: 'french', from: LAWS, regions: south },
  { name: 'Bilingual Brussels', kind: 'bilingual', from: LAWS, to: until(BRUSSELS_REGION), regions: ['brussels'] },
  // 1954: the census of 1947 at last applied.
  { name: 'Brussels grows to 19', kind: 'bilingual', from: CENSUS, to: until(BRUSSELS_REGION), regions: ['brussels-1954'] },
  { name: 'Facilities near Brussels', kind: 'facility', from: CENSUS, regions: ['rand-1954'] },
  // 1963: the line fixed for good.
  { name: 'Voeren goes to Limburg', kind: 'dutch', from: FIXED, regions: ['voeren'] },
  { name: 'Comines-Warneton and Mouscron go to Hainaut', kind: 'french', from: FIXED, regions: ['comines', 'mouscron'] },
  { name: 'Two more towns with facilities', kind: 'facility', from: FIXED, regions: ['rand-1963'] },
  // 1989: Brussels becomes a region of its own.
  { name: 'Brussels-Capital Region', kind: 'bilingual', from: BRUSSELS_REGION, regions: ['brussels', 'brussels-1954'] },
  // Drawn last, as an outline over the rest.
  { name: 'Brussels-Halle-Vilvoorde, one electoral district', kind: 'bhv', from: FIXED, to: until(SPLIT), regions: ['brussels', 'brussels-1954', 'halle-vilvoorde', 'rand-1954', 'rand-1963'] },
]

const sites: HistSite[] = [
  { name: 'Brussels', kind: 'town', from: LANGUAGE_MIN, at: [4.352, 50.847], label: 'right' },
  { name: 'Leuven', kind: 'town', from: LANGUAGE_MIN, at: [4.701, 50.879], label: 'right', note: 'Its Catholic university, French-speaking until 1930, split in 1968' },
  { name: 'Ghent', kind: 'town', from: LANGUAGE_MIN, at: [3.717, 51.054], label: 'right', note: 'Its university taught in Dutch from 1930' },
  { name: 'Liège', kind: 'town', from: LANGUAGE_MIN, at: [5.571, 50.633], label: 'left' },
  { name: 'Eupen', kind: 'town', from: CANTONS, at: [6.036, 50.628], label: 'right', note: 'Seat of the German-speaking Community' },
  { name: 'Louvain-la-Neuve', kind: 'town', from: FIRST_REFORM, at: [4.615, 50.669], label: 'left', note: 'A new town for the French-speaking university, built from 1971' },
  { name: 'Namur', kind: 'town', from: REGIONS, at: [4.867, 50.467], label: 'right', note: 'Seat of the Walloon government and parliament' },
]

const labels: HistLabel[] = [
  { text: 'NETHERLANDS', kind: 'land', from: LANGUAGE_MIN, at: [5.2, 51.62] },
  { text: 'FRANCE', kind: 'land', from: LANGUAGE_MIN, at: [3.6, 49.75] },
  { text: 'LUX.', kind: 'land', from: LANGUAGE_MIN, at: [6.1, 49.75] },
  { text: 'FRENCH IN COURT AND GOVERNMENT', kind: 'alert', from: LANGUAGE_MIN, to: until(EQUALITY), at: [4.45, 50.32] },
  { text: 'DUTCH AND FRENCH EQUAL IN LAW', kind: 'alert', from: EQUALITY, to: until(CANTONS), at: [4.45, 50.32] },
  { text: 'TO BELGIUM', kind: 'alert', from: CANTONS, to: until(LAWS), at: [6.15, 50.12] },
  { text: 'FLEMISH', kind: 'people', from: LANGUAGE_MIN, to: until(LAWS), at: [4.1, 51.1] },
  { text: 'WALLOON', kind: 'people', from: LANGUAGE_MIN, to: until(LAWS), at: [4.85, 50.25] },
  { text: 'DUTCH', kind: 'people', from: LAWS, to: until(FIRST_REFORM), at: [4.1, 51.1] },
  { text: 'FRENCH', kind: 'people', from: LAWS, to: until(FIRST_REFORM), at: [4.85, 50.25] },
  { text: 'GERMAN', kind: 'people', from: FIXED, to: until(FIRST_REFORM), at: [6.25, 50.36] },
  { text: 'LINE FIXED', kind: 'alert', from: FIXED, to: until(FIRST_REFORM), at: [3.55, 50.62] },
  { text: 'DUTCH CULTURAL COMMUNITY', kind: 'territory', from: FIRST_REFORM, to: until(REGIONS), at: [4.1, 51.1] },
  { text: 'FRENCH CULTURAL COMMUNITY', kind: 'territory', from: FIRST_REFORM, to: until(REGIONS), at: [4.85, 50.25] },
  { text: 'GERMAN', kind: 'territory', from: FIRST_REFORM, to: until(REGIONS), at: [6.25, 50.36] },
  { text: 'FLEMISH REGION', kind: 'territory', from: REGIONS, at: [4.1, 51.1] },
  { text: 'WALLOON REGION', kind: 'territory', from: REGIONS, at: [4.85, 50.25] },
  { text: 'GERMAN-SPEAKING COMMUNITY', kind: 'territory', from: REGIONS, at: [6.1, 50.05] },
  { text: 'A FEDERAL STATE', kind: 'alert', from: FEDERAL, to: until(SPLIT), at: [3.7, 50.45] },
  { text: 'BHV SPLIT', kind: 'alert', from: SPLIT, at: [4.25, 50.68] },
]

const events: HistEvent[] = [
  {
    from: LANGUAGE_MIN,
    title: '1830: One state, one language of power',
    text: 'Belgium is born. Its constitution lets everyone speak the language they like, but the courts, the army, the government and the universities work in French. In the north most people speak Flemish dialects, in the south Walloon and other dialects close to French, and the line between them has hardly moved since the Middle Ages. Press play to see the line drawn into law.',
  },
  {
    from: EQUALITY,
    title: '1898: Dutch and French equal in law',
    text: 'After decades of campaigning by the Flemish Movement, the Equality Law makes Dutch an official language beside French: from now on laws are passed and published in both. Since 1893 every man over 25 has had at least one vote, and most of the new voters speak Flemish. In Brussels, meanwhile, more and more Flemish families are taking up French: by 1910 half the city speaks both.',
  },
  {
    from: CANTONS,
    title: '1920: The East Cantons join Belgium',
    text: 'After the First World War the Treaty of Versailles gives Belgium the German districts of Eupen, Malmedy and Sankt Vith. Most people there speak German; around Malmedy they speak French and Walloon.',
  },
  {
    from: LAWS,
    title: '1932: Each side its own language',
    text: 'The language laws of 1921 and 1932 settle it: in the north the town halls and schools work in Dutch, in the south in French, and in Brussels and 15 municipalities around it in both. A language census every ten years decides which side a town on the line belongs to.',
  },
  {
    from: CENSUS,
    title: '1954: Brussels grows to 19 municipalities',
    text: 'The census of 1947, held back for years, is applied at last. More than half of Evere, Ganshoren and Sint-Agatha-Berchem now speak French, so they join bilingual Brussels. In Drogenbos, Kraainem, Linkebeek and Wemmel French speakers pass 30%, and the town halls must serve them in French too: the first facilities.',
  },
  {
    from: FIXED,
    title: '1963: The language border is fixed',
    text: 'After two Flemish marches on Brussels, the laws of 1962 and 1963 abolish the census and fix the line for good. Voeren moves from Liège to Limburg, Comines-Warneton and Mouscron from West Flanders to Hainaut. There are now four language areas: Dutch, French, German, and bilingual Brussels, kept to 19 municipalities. Brussels and Halle-Vilvoorde still vote as one district.',
  },
  {
    from: FIRST_REFORM,
    title: '1970: The first state reform',
    text: 'Two years after the split of the university of Leuven, the constitution is changed: three cultural communities, Dutch, French and German, run culture and the use of their language, and the constitution foresees three regions. The French-speaking university moves to a new town, Louvain-la-Neuve.',
  },
  {
    from: REGIONS,
    title: '1980: Flanders and Wallonia become regions',
    text: 'The second state reform sets up the Flemish and the Walloon Region, with their own parliaments and governments, and gives the communities health and youth care too. Flanders merges its region and community into one. What to do with Brussels is left open.',
  },
  {
    from: BRUSSELS_REGION,
    title: '1989: The Brussels-Capital Region',
    text: 'The third state reform makes Brussels a region of its own, with its 19 municipalities, and hands the schools to the communities.',
  },
  {
    from: FEDERAL,
    title: '1993: A federal state',
    text: 'The Saint Michael\'s Agreement makes Belgium a federal state. Its constitution now opens: "Belgium is a federal State composed of communities and regions." In 1995 the province of Brabant is split in two along the language border, and Belgians elect the parliaments of their regions and communities directly.',
  },
  {
    from: SPLIT,
    title: '2012: Brussels-Halle-Vilvoorde is split',
    text: 'After 541 days without a new government, the sixth state reform splits the last electoral district that crossed the language border, Brussels-Halle-Vilvoorde, and hands billions of euros of tasks to the regions and communities.',
  },
]

export const languageStory: TimeStory = {
  place: 'Belgium',
  base: 'belgium',
  bounds: [
    [2.5, 49.45],
    [6.45, 51.55],
  ],
  min: LANGUAGE_MIN,
  max: LANGUAGE_MAX,
  format: String,
  events,
  lines: [],
  sites,
  labels,
  areas,
  fresh: 'outline',
  note: 'Before 1932 the colours show the language most people spoke; from 1932, the language of the town hall and school. The line is drawn as it was fixed in 1963.',
  key: [
    { swatch: 'key-dutch', text: 'Dutch' },
    { swatch: 'key-french', text: 'French' },
    { swatch: 'key-german', text: 'German' },
    { swatch: 'key-bilingual', text: 'Dutch and French (Brussels)' },
    { swatch: 'key-facility', text: 'Dutch, with facilities in French' },
    { swatch: 'key-bhv', text: 'Brussels-Halle-Vilvoorde' },
  ],
}

// For the time map through all eras, on the Low Countries map: the language areas of
// 1963 drawn with today's provinces, and the German-speaking area as two shapes cut
// from the municipal map.
const eastNorth: [number, number][] = [[6.02, 50.755], [5.956, 50.684], [6.136, 50.549], [6.188, 50.567], [6.262, 50.628], [6.179, 50.628], [6.117, 50.72], [6.037, 50.721], [6.02, 50.755]]
const eastSouth: [number, number][] = [
  [6.191, 50.522], [6.131, 50.5], [6.181, 50.405], [6.02, 50.351], [5.979, 50.33], [6.024, 50.183], [6.056, 50.155], [6.113, 50.166],
  [6.136, 50.13], [6.145, 50.176], [6.189, 50.182], [6.173, 50.232], [6.278, 50.268], [6.307, 50.32], [6.402, 50.324], [6.343, 50.381],
  [6.376, 50.439], [6.347, 50.489], [6.224, 50.496], [6.191, 50.522],
]

export const languageByYear: TimeStory = {
  ...languageStory,
  base: undefined,
  bounds: undefined,
  min: FIXED,
  events: events.filter((e) => e.from >= FIXED),
  sites: [],
  labels: [],
  areas: [
    { name: 'Dutch-language area', kind: 'dutch', from: FIXED, regions: ['BE-VAN', 'BE-VLI', 'BE-VOV', 'BE-VWV', 'BE-VBR'] },
    { name: 'French-language area', kind: 'french', from: FIXED, regions: ['BE-WHT', 'BE-WLG', 'BE-WLX', 'BE-WNA', 'BE-WBR'] },
    { name: 'German-language area (north)', kind: 'german', from: FIXED, shape: eastNorth },
    { name: 'German-language area (south)', kind: 'german', from: FIXED, shape: eastSouth },
    { name: 'Bilingual Brussels', kind: 'bilingual', from: FIXED, regions: ['BE-BRU'] },
  ],
  key: languageStory.key.filter((k) => k.swatch !== 'key-facility' && k.swatch !== 'key-bhv'),
}
