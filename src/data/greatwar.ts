// The second map for Unit 14: Belgium in the First World War, August 1914 to November
// 1918, month by month. The German armies cross at Liège and sweep through Brussels and
// Namur into France, burning towns and shooting civilians as they go; Antwerp falls in
// October and the Belgian army holds only the corner behind the Yser. An electric fence
// seals the Dutch border from 1915. In the autumn of 1918 the Allies free the coast and
// Flanders, and on 11 November the Canadians are in Mons. The slider counts months (see
// `month`). The front and the lines of advance are approximate. Coordinates are
// [lon, lat] (WGS84).

import { eastCantons } from './borders'
import { formatMonth, month, type HistArea, type HistEvent, type HistLabel, type HistLine, type HistSite, type TimeStory } from './timeline'

export const GREAT_WAR_MIN = month(1914, 8)
export const GREAT_WAR_MAX = month(1918, 11)

const AUG_1914 = GREAT_WAR_MIN
const OCT_1914 = month(1914, 10)
const APR_1915 = month(1915, 4)
const OCT_1918 = month(1918, 10)
const NOV_1918 = GREAT_WAR_MAX
const until = (next: number) => next - 1

type P = [number, number]

const BELGIUM = ['BE-VWV', 'BE-VOV', 'BE-VAN', 'BE-VBR', 'BE-WBR', 'BE-BRU', 'BE-WHT', 'BE-WNA', 'BE-WLG', 'BE-VLI', 'BE-WLX']

// The Western Front from the coast at Nieuwpoort, along the Yser, round Ypres and south
// past Armentières into France.
const front: P[] = [
  [2.73, 51.165], [2.85, 51.06], [2.86, 51.03], [2.81, 50.98], [2.85, 50.92], [2.92, 50.88], [2.95, 50.84], [2.89, 50.8],
  [2.87, 50.75], [2.92, 50.7], [2.85, 50.6], [2.8, 50.5],
]
const behindFront: P[] = [...front, [2.8, 49.35], [7.5, 49.35], [7.5, 53.65], [2.6, 53.65]]
// Freed in October 1918: the coast, Bruges and Kortrijk, up to the canal before Ghent.
const freedOct1918: P[] = [[2.4, 51.5], [3.6, 51.5], [3.6, 51.12], [3.55, 50.95], [3.45, 50.8], [3.35, 50.65], [3.2, 50.55], [2.4, 50.55]]
// West of the line the armies had reached when the Armistice began: Ghent, Tournai and Mons.
const freedNov1918: P[] = [[2.4, 51.5], [3.95, 51.5], [3.85, 51.2], [3.78, 51.05], [3.85, 50.85], [3.95, 50.6], [4.02, 50.45], [3.9, 50.3], [2.4, 50.3]]

// Later entries draw on top.
const areas: HistArea[] = [
  { name: 'Belgium', kind: 'belgium', from: AUG_1914, regions: BELGIUM },
  { name: 'Eupen and Malmedy, German', kind: 'outside', from: AUG_1914, regions: ['BE-WLG'], clip: eastCantons },
  { name: 'Luxembourg, occupied', kind: 'occupied', from: AUG_1914, regions: ['LUX'] },
  {
    name: 'Belgium overrun, August 1914',
    kind: 'occupied',
    from: AUG_1914,
    to: until(OCT_1914),
    regions: ['BE-VLI', 'BE-WLG', 'BE-WLX', 'BE-WNA', 'BE-WHT', 'BE-VBR', 'BE-WBR', 'BE-BRU'],
  },
  { name: 'Occupied Belgium', kind: 'occupied', from: OCT_1914, regions: BELGIUM, clip: behindFront },
  { name: 'The coast and West Flanders, freed', kind: 'free', from: OCT_1918, regions: BELGIUM, clip: freedOct1918 },
  { name: 'Ghent, Tournai and Mons, freed', kind: 'free', from: NOV_1918, regions: BELGIUM, clip: freedNov1918 },
]

const lines: HistLine[] = [
  { name: 'German armies cross the border to Liège', kind: 'flow', from: AUG_1914, to: until(OCT_1914), coords: [[6.1, 50.72], [5.8, 50.66], [5.6, 50.64]] },
  { name: 'German armies march through Brussels towards France', kind: 'flow', from: AUG_1914, to: until(OCT_1914), coords: [[5.45, 50.7], [4.95, 50.82], [4.45, 50.82], [4.0, 50.5], [3.7, 50.3]] },
  { name: 'German armies march through Namur and Dinant into France', kind: 'flow', from: AUG_1914, to: until(OCT_1914), coords: [[5.5, 50.58], [4.95, 50.45], [4.9, 50.2], [4.75, 49.95]] },
  { name: 'The Belgian army falls back to the forts of Antwerp', kind: 'flow', from: AUG_1914, to: until(OCT_1914), coords: [[4.85, 50.86], [4.62, 51.0], [4.5, 51.13]] },
  { name: 'The Belgian army retreats from Antwerp to the Yser', kind: 'flow', from: OCT_1914, to: until(APR_1915), coords: [[4.38, 51.18], [3.75, 51.05], [3.2, 51.12], [2.88, 51.08]] },
  { name: 'The Western Front', kind: 'front', from: OCT_1914, to: until(OCT_1918), coords: front },
  // The electric fence along the Dutch border, from near Aachen to the Scheldt, from 1915.
  {
    name: 'The Wire of Death, an electric fence along the Dutch border',
    kind: 'barrier',
    from: APR_1915,
    to: until(NOV_1918),
    coords: [
      [6.0, 50.75], [5.69, 50.755], [5.72, 50.9], [5.78, 51.05], [5.83, 51.15], [5.6, 51.2], [5.45, 51.28], [5.24, 51.27],
      [5.1, 51.39], [4.95, 51.42], [4.77, 51.5], [4.55, 51.43], [4.38, 51.44], [4.27, 51.37],
    ],
  },
  { name: 'Allied armies advance into Flanders, from 28 September 1918', kind: 'flow', from: OCT_1918, to: until(NOV_1918), coords: [[2.9, 50.95], [3.25, 51.1], [3.55, 51.12]] },
  { name: 'Canadian troops advance to Mons', kind: 'flow', from: NOV_1918, coords: [[3.55, 50.38], [3.75, 50.42], [3.92, 50.45]] },
]

const sites: HistSite[] = [
  { name: 'Liège', kind: 'battle', from: AUG_1914, to: until(OCT_1914), at: [5.57, 50.633], label: 'right', note: 'Its ring of twelve forts holds out from 5 to 16 August 1914' },
  { name: 'Brussels', kind: 'town', from: AUG_1914, at: [4.357, 50.85], label: 'left', note: 'Entered by the German army on 20 August 1914' },
  { name: 'Aarschot', kind: 'town', from: AUG_1914, to: until(OCT_1914), at: [4.836, 50.987], label: 'right', note: '156 civilians killed, 19 August 1914' },
  { name: 'Andenne', kind: 'town', from: AUG_1914, to: until(OCT_1914), at: [5.095, 50.49], label: 'right', note: '211 civilians killed, 20 August 1914' },
  { name: 'Dinant', kind: 'town', from: AUG_1914, to: until(OCT_1914), at: [4.912, 50.26], label: 'right', note: '674 civilians killed, 23 August 1914' },
  { name: 'Leuven', kind: 'town', from: AUG_1914, to: until(OCT_1914), at: [4.7, 50.88], label: 'right', note: 'Burned from 25 August 1914, with its university library' },
  { name: 'Mons', kind: 'battle', from: AUG_1914, to: until(OCT_1914), at: [3.95, 50.454], label: 'left', note: 'The British army’s first battle of the war, 23 August 1914' },
  { name: 'Antwerp', kind: 'battle', from: OCT_1914, to: until(APR_1915), at: [4.402, 51.219], label: 'right', note: 'Its forts smashed by heavy guns, it falls on 10 October 1914' },
  { name: 'Ypres', kind: 'battle', from: OCT_1914, to: until(OCT_1918), at: [2.885, 50.851], label: 'left', note: 'Four years in the front line, 1914 to 1918' },
  { name: 'De Panne', kind: 'town', from: OCT_1914, to: until(OCT_1918), at: [2.593, 51.099], label: 'left', note: 'Where King Albert and Queen Elisabeth lived behind the Yser' },
  { name: 'Ostend', kind: 'town', from: OCT_1918, at: [2.92, 51.228], label: 'left', note: 'Freed 17 October 1918' },
  { name: 'Bruges', kind: 'town', from: OCT_1918, at: [3.225, 51.209], label: 'right', note: 'Freed 19 October 1918' },
  { name: 'Mons', kind: 'town', from: NOV_1918, at: [3.952, 50.452], label: 'right', note: 'Freed by Canadian troops on the morning of 11 November 1918' },
  { name: 'Ghent', kind: 'town', from: NOV_1918, at: [3.717, 51.054], label: 'right', note: 'Freed 11 November 1918' },
]

const labels: HistLabel[] = [
  { text: 'GERMANY', kind: 'territory', from: AUG_1914, at: [6.45, 50.95] },
  { text: 'NETHERLANDS (NEUTRAL)', kind: 'territory', from: AUG_1914, at: [5.0, 51.75] },
  { text: 'FRANCE', kind: 'territory', from: AUG_1914, at: [3.3, 49.9] },
  { text: 'THE YSER FRONT', kind: 'alert', from: OCT_1914, to: until(OCT_1918), at: [2.75, 51.32] },
]

const events: HistEvent[] = [
  {
    from: AUG_1914,
    title: 'August 1914: The invasion',
    text: 'Germany asks to march its armies through neutral Belgium to France, and Belgium refuses. On 4 August German troops cross the border; Britain declares war the same day. Liège’s forts hold out until 16 August. The armies sweep on through Brussels and Namur, and in towns such as Aarschot, Andenne, Dinant and Leuven they shoot thousands of civilians and burn houses.',
  },
  {
    from: OCT_1914,
    title: 'October 1914: Antwerp falls, the Yser holds',
    text: 'Heavy siege guns smash the forts of Antwerp, and the city falls on 10 October. The Belgian army escapes west along the coast and makes its stand on the Yser, where it holds a corner of the country, with Ypres beside it, for four years. All the rest of Belgium is occupied.',
  },
  {
    from: APR_1915,
    title: '1915: An occupied country',
    text: 'The front runs from the sea at Nieuwpoort round Ypres into France. Behind it the occupiers rule Belgium, requisition food and later deport workers to Germany. From the spring of 1915 an electric fence seals the border with the neutral Netherlands, to stop people slipping out to join the army.',
  },
  {
    from: OCT_1918,
    title: 'October 1918: Flanders is freed',
    text: 'On 28 September the Belgian army, with British and French troops, breaks out from the Yser and Ypres. Ostend is freed on 17 October and Bruges on 19 October. King Albert rides in with his army.',
  },
  {
    from: NOV_1918,
    title: 'November 1918: The Armistice',
    text: 'At 11 a.m. on 11 November the fighting stops. That morning Canadian troops are in Mons, where the British army fought its first battle in August 1914. Within weeks the German army leaves Belgium, and on 22 November King Albert rides back into Brussels.',
  },
]

export const greatWarStory: TimeStory = {
  place: 'Belgium',
  bounds: [[2.3, 49.45], [6.6, 51.6]],
  min: GREAT_WAR_MIN,
  max: GREAT_WAR_MAX,
  format: formatMonth,
  months: true,
  events,
  lines,
  sites,
  labels,
  areas,
  fresh: 'outline',
  note: 'The front and the lines of advance are approximate, drawn with today’s provinces.',
  key: [
    { swatch: 'key-belgium', text: 'Unoccupied Belgium' },
    { swatch: 'key-occupied', text: 'Occupied by Germany' },
    { swatch: 'key-free', text: 'Freed in 1918' },
    { swatch: 'key-front', text: 'Front line' },
    { swatch: 'key-barrier', text: 'Electric fence' },
    { swatch: 'key-flow', text: 'Armies on the move' },
    { swatch: 'key-battle', text: 'Battle' },
  ],
}

// For the time map through all eras, which counts in years: the front as it stood in
// the spring of 1915, pinned to 1915.
const SNAPSHOT = APR_1915
const at = <T extends { from: number; to?: number }>(items: T[]) =>
  items.filter((i) => i.from <= SNAPSHOT && (i.to === undefined || SNAPSHOT <= i.to)).map((i) => ({ ...i, from: 1915, to: 1915, end: 1915 }))

export const greatWarByYear: TimeStory = {
  ...greatWarStory,
  bounds: undefined,
  min: 1915,
  max: 1915,
  format: String,
  months: false,
  events: [{ ...events.find((e) => e.from === SNAPSHOT)!, from: 1915 }],
  lines: at(lines),
  sites: at(sites),
  labels: at(labels),
  areas: at(areas).map((a) => ({ ...a, name: `${a.name} (1915)` })),
}
