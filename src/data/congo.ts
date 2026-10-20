// The map for Unit 13: the Congo from 1876 to 1961, on its own base of Central Africa
// (`base: 'africa'`). It starts with the peoples and kingdoms of the Congo basin, whose
// names stay on the map throughout, then shows Leopold II's Congo Free State, the
// Belgian Congo and independence. Borders are today's; the peoples' names mark only a
// few of the hundreds of peoples who lived there. Coordinates are [lon, lat].

import type { HistArea, HistEvent, HistLabel, HistLine, HistSite, TimeStory } from './timeline'

export const CONGO_MIN = 1876
export const CONGO_MAX = 1961

const FREE_STATE = 1885
const BELGIAN = 1908
const INDEPENDENT = 1960

// Katanga, the copper country of the southeast, roughly as the province that broke
// away in July 1960.
const katanga: [number, number][] = [
  [21.8, -8.6], [22.4, -6.9], [24.6, -6.2], [26.4, -5.0], [29.4, -5.0], [30.8, -8.2], [31.2, -14.5], [21.4, -14.5],
]

const areas: HistArea[] = [
  { name: 'The Congo Free State', kind: 'ruled', from: FREE_STATE, to: BELGIAN - 1, regions: ['COD'] },
  { name: 'The Belgian Congo', kind: 'belgium', from: BELGIAN, to: INDEPENDENT - 1, regions: ['COD'] },
  { name: 'Ruanda-Urundi, under Belgian mandate', kind: 'client', from: 1923, regions: ['RWA', 'BDI'] },
  { name: 'The Republic of the Congo', kind: 'free', from: INDEPENDENT, regions: ['COD'] },
  { name: 'Katanga, breaking away', kind: 'contested', from: INDEPENDENT, regions: ['COD'], clip: katanga },
]

const lines: HistLine[] = [
  {
    name: 'Stanley’s journey down the Lualaba and the Congo, 1876 to 1877',
    kind: 'flow',
    from: 1877,
    to: 1884,
    coords: [[29.6, -4.9], [27.5, -4.6], [26.2, -4.2], [25.6, -1.5], [25.2, 0.5], [23.6, 1.1], [21.5, 2.15], [19.3, 1.4], [18.27, 0.05], [16.5, -2.4], [15.3, -4.3], [14.0, -5.0], [13.05, -5.85], [12.35, -6.05]],
  },
  { name: 'Matadi–Léopoldville railway, around the rapids, 1898', kind: 'rail', from: 1898, coords: [[13.45, -5.82], [14.05, -5.45], [14.55, -5.05], [14.95, -4.65], [15.31, -4.33]] },
]

const sites: HistSite[] = [
  { name: 'Nyangwe', kind: 'town', from: CONGO_MIN, to: 1891, at: [26.19, -4.21], label: 'right', note: 'A market town of Swahili and Arab traders in ivory and slaves' },
  { name: 'Boma', kind: 'town', from: FREE_STATE, at: [13.05, -5.85], label: 'right', note: 'Capital of the Congo Free State and then the Belgian Congo, until 1923' },
  { name: 'Léopoldville', kind: 'town', from: FREE_STATE, at: [15.31, -4.33], label: 'right', note: 'Founded by Stanley in 1881; today Kinshasa. The capital from 1923' },
  { name: 'Stanleyville', kind: 'town', from: FREE_STATE, at: [25.19, 0.52], label: 'right', note: 'Below the Stanley Falls; today Kisangani' },
  { name: 'Basankusu', kind: 'fort', from: 1892, to: BELGIAN - 1, at: [19.8, 1.22], label: 'left', note: 'Headquarters of ABIR, a company given a vast rubber concession' },
  { name: 'Élisabethville', kind: 'town', from: 1923, at: [27.48, -11.66], label: 'left', note: 'Founded in 1910 as a copper-mining town; today Lubumbashi' },
  { name: 'Shinkolobwe', kind: 'mine', from: 1945, at: [26.57, -11.05], label: 'left', note: 'Uranium mine. Most of the uranium for the first American atomic bombs came from here' },
]

const labels: HistLabel[] = [
  { text: 'ATLANTIC', kind: 'water', from: CONGO_MIN, at: [12.3, -8.6] },
  // A few of the peoples and kingdoms of the Congo basin.
  { text: 'Kongo', kind: 'people', from: CONGO_MIN, at: [14.6, -6.4] },
  { text: 'Mongo', kind: 'people', from: CONGO_MIN, at: [21.2, -1.4] },
  { text: 'Kuba', kind: 'people', from: CONGO_MIN, at: [21.8, -4.6] },
  { text: 'Luba', kind: 'people', from: CONGO_MIN, at: [25.6, -7.6] },
  { text: 'Lunda', kind: 'people', from: CONGO_MIN, at: [22.6, -9.4] },
  { text: 'Zande', kind: 'people', from: CONGO_MIN, at: [26.8, 4.1] },
  { text: 'CONGO FREE STATE', kind: 'territory', from: FREE_STATE, to: BELGIAN - 1, at: [23.2, -2.6] },
  { text: 'RUBBER QUOTAS', kind: 'alert', from: 1892, to: BELGIAN - 1, at: [21.2, 0.45] },
  { text: 'BELGIAN CONGO', kind: 'territory', from: BELGIAN, to: INDEPENDENT - 1, at: [23.2, -2.6] },
  { text: 'CONGO', kind: 'territory', from: INDEPENDENT, at: [23.2, -2.6] },
  { text: 'KATANGA', kind: 'alert', from: INDEPENDENT, at: [26.6, -9.8] },
]

const events: HistEvent[] = [
  {
    from: CONGO_MIN,
    title: '1876: Kingdoms and peoples',
    text: 'Hundreds of peoples live in the Congo basin, among them the old kingdoms of the Kongo, the Kuba, the Luba and the Lunda. Traders from Zanzibar raid the east for ivory and slaves. In Brussels, King Leopold II hosts a geographical conference and founds an “International African Association”, a charity in name.',
  },
  {
    from: 1877,
    title: '1877: Stanley reaches the sea',
    text: 'In August 1877 the explorer Henry Morton Stanley reaches the Atlantic at Boma, having followed the Lualaba and the Congo down from the east. Leopold hires him: from 1879 to 1884 Stanley builds stations and a road around the rapids, and collects treaties from local chiefs.',
  },
  {
    from: FREE_STATE,
    title: '1885: The Congo Free State',
    text: 'The European powers meeting in Berlin accept Leopold’s claim. On 1 July 1885 the Congo Free State begins: some 2.3 million km², about 76 times the size of Belgium, owned by the king himself, not by Belgium. Its capital is Boma. Leopold never goes there.',
  },
  {
    from: 1892,
    title: '1892: Rubber and terror',
    text: 'The state claims the land and its rubber and ivory, and hands huge areas to companies such as ABIR. Villages must deliver rubber. The Force Publique, African soldiers under European officers, takes women as hostages, burns villages and kills those who fall short; soldiers cut off hands to account for their bullets.',
  },
  {
    from: 1898,
    title: '1898: The railway around the rapids',
    text: 'A railway from the port of Matadi to Léopoldville opens after eight years of work, past the rapids that block the river. Rubber and ivory flow out to Antwerp, and the bicycle and motor tyres of Europe and America keep the demand high.',
  },
  {
    from: 1904,
    title: '1904: The world finds out',
    text: 'The report of Roger Casement, the British consul, confirms the killings and mutilations. E. D. Morel founds the Congo Reform Association, and the photographs of the missionary Alice Seeley Harris are shown at meetings across Britain and America. A commission sent by Leopold himself confirms the report.',
  },
  {
    from: BELGIAN,
    title: '1908: The Belgian Congo',
    text: 'Under pressure, Belgium takes the colony over from its king on 15 November 1908. Leopold has the Free State’s archive burned. The colony is run by the state, the Catholic missions and the big companies together, and Congolese still have no say.',
  },
  {
    from: 1923,
    title: '1923: Léopoldville the capital',
    text: 'The capital moves from Boma to Léopoldville. Copper from the mines of Katanga makes the Union Minière one of the richest companies in the world. Next door, Belgium runs Ruanda-Urundi, taken from Germany in the First World War, under a League of Nations mandate.',
  },
  {
    from: 1945,
    title: '1945: Copper, rubber and uranium for the war',
    text: 'While Belgium is occupied, the colony fights on with the Allies. Congolese are forced to tap rubber and grow crops for the war effort. Most of the uranium for the American atomic bombs comes from the Shinkolobwe mine in Katanga.',
  },
  {
    from: 1959,
    title: '1959: The riots in Léopoldville',
    text: 'On 4 January 1959 a banned meeting of the party ABAKO turns into riots in Léopoldville. Officially 49 Africans are killed; other estimates are far higher. Nine days later King Baudouin promises independence.',
  },
  {
    from: INDEPENDENT,
    title: '1960: Independence',
    text: 'On 30 June 1960 the Congo becomes independent, with Patrice Lumumba as prime minister and Joseph Kasa-Vubu as president. Within two weeks the army mutinies, Belgium sends in troops, and on 11 July Katanga breaks away under Moïse Tshombe, backed by Belgium and the Union Minière.',
  },
  {
    from: CONGO_MAX,
    title: '1961: The murder of Lumumba',
    text: 'Deposed and arrested, Lumumba is flown to Katanga and shot there on 17 January 1961 with two of his ministers, Maurice Mpolo and Joseph Okito, by Katangan troops under Belgian officers. Katanga is brought back into the Congo in 1963.',
  },
]

export const congoStory: TimeStory = {
  place: 'the Congo',
  base: 'africa',
  bounds: [
    [11.9, -13.6],
    [31.4, 5.4],
  ],
  min: CONGO_MIN,
  max: CONGO_MAX,
  format: String,
  events,
  lines,
  sites,
  labels,
  areas,
  note: 'Borders are today’s. The peoples named are only a few of the hundreds who lived in the Congo basin. Land drawn from Natural Earth.',
  key: [
    { swatch: 'key-ruled', text: 'The Congo Free State, Leopold II’s own' },
    { swatch: 'key-belgium', text: 'The Belgian Congo' },
    { swatch: 'key-client', text: 'Ruanda-Urundi, ruled by Belgium' },
    { swatch: 'key-free', text: 'Independent Congo' },
    { swatch: 'key-flow', text: 'Stanley’s journey' },
  ],
}
