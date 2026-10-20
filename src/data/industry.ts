// The map for Unit 13: Belgium's railways and coal country, 1835 to 1914. The state
// builds a cross of lines out of Mechelen from 1835, links it to France and Prussia by
// 1843, private companies fill in the rest, and the coal belt from Mons to Liège feeds
// the furnaces, the trains and the ports. Each stage shows the lines open by its year
// (a line opened in between appears at the next stage). Coordinates are [lon, lat].

import { eastCantons } from './borders'
import type { HistArea, HistEvent, HistLabel, HistLine, HistSite, TimeStory } from './timeline'

export const INDUSTRY_MIN = 1835
export const INDUSTRY_MAX = 1914

const BELGIUM = ['BE-VWV', 'BE-VOV', 'BE-VAN', 'BE-VBR', 'BE-WBR', 'BE-BRU', 'BE-WHT', 'BE-WNA', 'BE-WLG', 'BE-VLI', 'BE-WLX']

// The coal belt of Wallonia, the sillon industriel, along the Haine, the Sambre and
// the Meuse: the Borinage around Mons, the Centre, Charleroi, and Liège. Drawn by hand.
const coalBelt: [number, number][] = [
  [3.72, 50.39], [3.8, 50.45], [3.97, 50.47], [4.15, 50.5], [4.33, 50.47], [4.5, 50.45], [4.7, 50.48], [4.88, 50.49],
  [5.1, 50.52], [5.3, 50.58], [5.45, 50.64], [5.62, 50.69], [5.78, 50.68], [5.72, 50.6], [5.55, 50.56], [5.35, 50.51],
  [5.12, 50.46], [4.9, 50.43], [4.66, 50.41], [4.45, 50.37], [4.28, 50.42], [4.1, 50.44], [3.92, 50.41], [3.78, 50.36],
]

export const industryAreas: HistArea[] = [
  { name: 'Belgium', kind: 'belgium', from: INDUSTRY_MIN, regions: BELGIUM },
  { name: 'Eupen and Malmedy, Prussian', kind: 'outside', from: INDUSTRY_MIN, regions: ['BE-WLG'], clip: eastCantons },
  { name: 'Luxembourg', kind: 'outside', from: INDUSTRY_MIN, regions: ['LUX'] },
  { name: 'The coal belt', kind: 'coal', from: INDUSTRY_MIN, shape: coalBelt },
]

const T = {
  brussels: [4.357, 50.86],
  mechelen: [4.483, 51.018],
  antwerp: [4.421, 51.217],
  leuven: [4.716, 50.881],
  tienen: [4.938, 50.808],
  landen: [5.08, 50.753],
  ans: [5.51, 50.66],
  liege: [5.567, 50.625],
  verviers: [5.86, 50.59],
  herbesthal: [6.0, 50.66],
  aachen: [6.09, 50.77],
  dendermonde: [4.1, 51.03],
  ghent: [3.71, 51.036],
  bruges: [3.217, 51.197],
  ostend: [2.925, 51.228],
  kortrijk: [3.264, 50.825],
  mouscron: [3.215, 50.74],
  tourcoing: [3.16, 50.72],
  braine: [4.14, 50.607],
  mons: [3.94, 50.454],
  quievrain: [3.68, 50.405],
  valenciennes: [3.52, 50.36],
  manage: [4.235, 50.505],
  charleroi: [4.444, 50.405],
  namur: [4.862, 50.468],
  huy: [5.24, 50.52],
  ciney: [5.1, 50.295],
  libramont: [5.38, 49.92],
  arlon: [5.815, 49.683],
  luxembourg: [6.13, 49.6],
  aalst: [4.04, 50.94],
  sintNiklaas: [4.14, 51.165],
  roosendaal: [4.46, 51.53],
  hasselt: [5.338, 50.931],
  maastricht: [5.7, 50.85],
} satisfies Record<string, [number, number]>

type Town = keyof typeof T
const rail = (name: string, from: number, towns: Town[]): HistLine => ({ name, kind: 'rail', from, coords: towns.map((t) => T[t]) })

export const industryLines: HistLine[] = [
  rail('Brussels–Mechelen, 5 May 1835', 1835, ['brussels', 'mechelen']),
  // The rest of the state's cross out of Mechelen.
  rail('Mechelen–Antwerp, 1836', 1840, ['mechelen', 'antwerp']),
  rail('Mechelen–Leuven, 1837', 1840, ['mechelen', 'leuven']),
  rail('Mechelen–Dendermonde–Ghent–Bruges–Ostend, 1837 to 1838', 1840, ['mechelen', 'dendermonde', 'ghent', 'bruges', 'ostend']),
  rail('Ghent–Kortrijk, 1839', 1840, ['ghent', 'kortrijk']),
  rail('Leuven–Tienen–Liège, finished 1842', 1843, ['leuven', 'tienen', 'landen', 'ans', 'liege']),
  rail('Liège–Verviers–Prussia, 24 October 1843', 1843, ['liege', 'verviers', 'herbesthal', 'aachen']),
  rail('Brussels–Braine-le-Comte–Mons, 1840 to 1841', 1843, ['brussels', 'braine', 'mons']),
  rail('Mons–Quiévrain–France, 1842', 1843, ['mons', 'quievrain', 'valenciennes']),
  rail('Kortrijk–Mouscron–France, 1842', 1843, ['kortrijk', 'mouscron', 'tourcoing']),
  rail('Braine-le-Comte–Manage–Charleroi–Namur, 1843', 1843, ['braine', 'manage', 'charleroi', 'namur']),
  // Lines of the private companies, built from the 1840s to the 1860s.
  rail('Namur–Liège, along the Meuse', 1870, ['namur', 'huy', 'liege']),
  rail('Brussels–Namur–Arlon–Luxembourg', 1870, ['brussels', 'namur', 'ciney', 'libramont', 'arlon', 'luxembourg']),
  rail('Antwerp–Sint-Niklaas–Ghent', 1870, ['antwerp', 'sintNiklaas', 'ghent']),
  rail('Brussels–Aalst–Ghent', 1870, ['brussels', 'aalst', 'ghent']),
  rail('Antwerp–Roosendaal, to the Netherlands', 1870, ['antwerp', 'roosendaal']),
  rail('Landen–Hasselt–Maastricht', 1870, ['landen', 'hasselt', 'maastricht']),
]

export const industrySites: HistSite[] = [
  { name: 'Brussels', kind: 'town', from: INDUSTRY_MIN, at: [4.352, 50.846], label: 'left' },
  { name: 'Mechelen', kind: 'town', from: INDUSTRY_MIN, at: T.mechelen, label: 'right', note: 'The hub of the state network: four lines to the four points of the compass' },
  { name: 'Antwerp', kind: 'town', from: 1840, at: T.antwerp, label: 'right', note: 'The port, joined to the rail network in 1836' },
  { name: 'Ghent', kind: 'town', from: 1840, at: T.ghent, label: 'left', note: 'Belgium’s cotton town, with mills since the early 1800s' },
  { name: 'Ostend', kind: 'town', from: 1840, at: T.ostend, label: 'right', note: 'Port for the boats to England' },
  { name: 'Liège', kind: 'town', from: 1843, at: T.liege, label: 'left' },
  { name: 'Charleroi', kind: 'town', from: 1843, at: T.charleroi, label: 'left' },
  { name: 'Mons', kind: 'town', from: 1843, at: T.mons, label: 'left' },
  { name: 'Cockerill, Seraing', kind: 'mine', from: INDUSTRY_MIN, at: [5.5, 50.6], label: 'right', note: 'Ironworks, blast furnaces and engine works, founded by John Cockerill in 1817' },
  { name: 'Grand-Hornu', kind: 'mine', from: INDUSTRY_MIN, at: [3.84, 50.435], note: 'Colliery and workers’ town, built by Henri De Gorge from 1810 to 1830' },
  { name: 'Bois-du-Luc', kind: 'mine', from: INDUSTRY_MIN, at: [4.15, 50.47], note: 'One of Belgium’s oldest collieries, with a workers’ village built from 1838' },
  { name: 'Bois du Cazier', kind: 'mine', from: INDUSTRY_MIN, at: [4.44, 50.385], note: 'Colliery at Marcinelle, near Charleroi, worked from 1822 to 1967' },
  { name: 'Blegny', kind: 'mine', from: INDUSTRY_MIN, at: [5.72, 50.69], note: 'Colliery near Liège, the last in its province to close, in 1980' },
]

export const industryLabels: HistLabel[] = [
  { text: 'BELGIUM', kind: 'people', from: INDUSTRY_MIN, at: [4.6, 50.12] },
  { text: 'NETHERLANDS', kind: 'people', from: INDUSTRY_MIN, at: [5.1, 51.75] },
  { text: 'FRANCE', kind: 'people', from: INDUSTRY_MIN, at: [3.3, 49.75] },
  { text: 'PRUSSIA', kind: 'people', from: INDUSTRY_MIN, to: 1869, at: [6.6, 50.95] },
  // The German Empire is proclaimed in January 1871; the map changes at its 1870 stage.
  { text: 'GERMANY', kind: 'people', from: 1870, at: [6.6, 50.95] },
  { text: 'NORTH SEA', kind: 'water', from: INDUSTRY_MIN, at: [2.75, 51.55] },
  { text: 'COAL', kind: 'land', from: INDUSTRY_MIN, at: [4.75, 50.36] },
  { text: 'STRIKES', kind: 'alert', from: 1886, to: 1913, at: [4.95, 50.62] },
]

export const industryEvents: HistEvent[] = [
  {
    from: 1835,
    title: '1835: The first train on the continent',
    text: 'On 5 May 1835 the first passenger train in continental Europe runs from Brussels to Mechelen, behind British engines named the Arrow, the Elephant and the Stephenson. A law of 1834 plans a state network: four lines out of Mechelen, to the four points of the compass.',
  },
  {
    from: 1840,
    title: '1840: A cross out of Mechelen',
    text: 'Brussels, Mechelen, Antwerp, Leuven, Ghent, Bruges and Ostend are now joined by rail, and a branch runs south from Ghent to Kortrijk. The port of Antwerp and the boats to England at Ostend are a few hours from the capital.',
  },
  {
    from: 1843,
    title: '1843: To France and Prussia',
    text: 'Lines reach the French border beyond Mons and Kortrijk in 1842. On 24 October 1843 a line over the hills from Liège reaches Prussia, one of the first railways in the world to cross a border. Charleroi and Namur are linked too. At the end of 1843 the state runs 559 km of railway.',
  },
  {
    from: 1870,
    title: '1870: Coal on the move',
    text: 'Private companies have built most of the new lines: 2,231 km against the state’s 863 km. Trains carry coal from the Borinage, Charleroi and Liège to the ports, to the ironworks and to France. Over the next twelve years the state buys most of the companies out.',
  },
  {
    from: 1886,
    title: '1886: The coal country rises',
    text: 'In March 1886 a meeting in Liège turns into strikes and riots that spread to the coal country around Charleroi. The army is sent in, and several dozen people are killed. Parliament holds an inquiry into working conditions, and the first labour laws follow.',
  },
  {
    from: 1914,
    title: '1914: One of the densest networks on earth',
    text: 'The state now runs some 5,000 km of main line, and light railways, the vicinal, run almost as far again into the villages. Belgium is one of the most industrial countries in the world, built on coal, iron, glass and cloth.',
  },
]

export const industryStory: TimeStory = {
  place: 'Belgium',
  bounds: [
    [2.6, 49.5],
    [6.3, 51.55],
  ],
  min: INDUSTRY_MIN,
  max: INDUSTRY_MAX,
  format: String,
  events: industryEvents,
  lines: industryLines,
  sites: industrySites,
  labels: industryLabels,
  areas: industryAreas,
  note: 'Lines are drawn straight between the towns they joined, and the coal belt is approximate.',
  key: [
    { swatch: 'key-rail', text: 'Railway' },
    { swatch: 'key-coal', text: 'Coal belt' },
    { swatch: 'key-mine', text: 'Colliery or ironworks' },
  ],
}
