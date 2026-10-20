// The map for Unit 11: the Low Countries at war, May 1940 to May 1945, month by month.
// Germany overruns the Netherlands in five days; the persecution of the Jews runs
// through camp Westerbork; from September 1944 the Allies free the south, are stopped
// at Arnhem, clear the Scheldt and then wait out the winter on the rivers while the
// west starves; in April 1945 the Canadians free the east and north, and on 5 May the
// German army in the Netherlands surrenders. The slider counts months (see `month`).
// Front lines are approximate: each liberated stretch is a province cut by a rough
// `clip` polygon. Coordinates are [lon, lat] (WGS84).

import { eastCantons } from './borders'
import { formatMonth, month, type HistArea, type HistEvent, type HistLabel, type HistLine, type HistSite, type TimeStory } from './timeline'

export const OCCUPATION_MIN = month(1940, 5)
export const OCCUPATION_MAX = month(1945, 5)

const MAY_1940 = OCCUPATION_MIN
const FEB_1941 = month(1941, 2)
const JUL_1942 = month(1942, 7)
const JAN_1943 = month(1943, 1)
const SEP_1944 = month(1944, 9)
const NOV_1944 = month(1944, 11)
const DEC_1944 = month(1944, 12)
const MAR_1945 = month(1945, 3)
const APR_1945 = month(1945, 4)
const MAY_1945 = OCCUPATION_MAX
// Lines, sites and labels of one stage last until the next one starts.
const until = (next: number) => next - 1

const NETHERLANDS = ['NL-NH', 'NL-ZH', 'NL-ZE', 'NL-UT', 'NL-GE', 'NL-OV', 'NL-FR', 'NL-GR', 'NL-DR', 'NL-NB', 'NL-LI', 'NL-FL']
const BELGIUM = ['BE-VWV', 'BE-VOV', 'BE-VAN', 'BE-VBR', 'BE-WBR', 'BE-BRU', 'BE-WHT', 'BE-WNA', 'BE-WLG', 'BE-VLI', 'BE-WLX']

// Rough outlines of what was free when. The Market Garden corridor and east Brabant
// up to the Peel, September 1944.
const corridor: [number, number][] = [
  [5.25, 51.27], [5.75, 51.2], [5.85, 51.32], [5.85, 51.5], [5.78, 51.62], [5.9, 51.72],
  [6.03, 51.8], [5.97, 51.93], [5.66, 51.93], [5.72, 51.86], [5.55, 51.74], [5.4, 51.6], [5.3, 51.45],
]
const southLimburg: [number, number][] = [[5.55, 50.74], [6.15, 50.74], [6.15, 51.06], [5.55, 51.06]]
// Brabant south of the Maas, all but the Land van Heusden en Altena (November 1944).
const brabant: [number, number][] = [[4.1, 51.2], [6.2, 51.2], [6.2, 51.9], [5.25, 51.9], [5.25, 51.72], [4.1, 51.72]]
// Limburg west of the Maas.
const westLimburg: [number, number][] = [
  [5.5, 50.9], [5.75, 51.0], [5.95, 51.15], [6.1, 51.35], [6.12, 51.45], [6.0, 51.6], [5.95, 51.78], [5.5, 51.78],
]
// Everything east of the Grebbe line and north of the IJsselmeer (April 1945).
const eastAndNorth: [number, number][] = [
  [5.55, 51.8], [5.6, 51.96], [5.55, 52.1], [5.45, 52.25], [5.6, 52.42], [5.2, 52.66], [5.02, 52.95],
  [4.8, 53.2], [4.8, 53.65], [7.4, 53.65], [7.4, 51.8],
]
// The German attack through the Ardennes, December 1944 and January 1945.
const bulge: [number, number][] = [
  [6.35, 50.45], [5.9, 50.45], [5.4, 50.3], [4.98, 50.25], [5.2, 50.05], [5.75, 49.85], [6.15, 49.75], [6.4, 49.85],
]
// Walcheren, flooded when Allied bombers breached its dikes in October 1944, and the
// Wieringermeer, flooded by the Germans on 17 April 1945.
const walcheren: [number, number][] = [[3.46, 51.58], [3.7, 51.6], [3.72, 51.5], [3.6, 51.44], [3.46, 51.5]]
const wieringermeer: [number, number][] = [[4.88, 52.79], [4.97, 52.88], [5.05, 52.91], [5.15, 52.82], [5.09, 52.77], [4.95, 52.76]]
// The two Flevoland polders still under water; the Noordoostpolder fell dry in 1942.
const flevoland: [number, number][] = [
  [5.2, 52.665], [5.6, 52.65], [5.7, 52.605], [6.2, 52.6], [6.2, 52.2], [5.0, 52.2], [5.0, 52.58], [5.2, 52.58],
]
const noordoostpolder: [number, number][] = [[5.2, 52.665], [5.6, 52.65], [5.7, 52.605], [6.2, 52.6], [6.2, 53.1], [5.2, 53.1]]

// Later entries draw on top.
const areas: HistArea[] = [
  { name: 'The occupied Low Countries', kind: 'occupied', from: MAY_1940, to: APR_1945, regions: [...NETHERLANDS, ...BELGIUM, 'LUX'] },
  { name: 'Eupen and Malmedy, annexed by Germany', kind: 'outside', from: MAY_1940, to: until(SEP_1944), regions: ['BE-WLG'], clip: eastCantons },
  { name: 'Belgium and Luxembourg, freed', kind: 'free', from: SEP_1944, regions: [...BELGIUM, 'LUX'] },
  { name: 'South Limburg, freed', kind: 'free', from: SEP_1944, regions: ['NL-LI'], clip: southLimburg },
  { name: 'The corridor to Nijmegen, freed', kind: 'free', from: SEP_1944, regions: ['NL-NB', 'NL-GE', 'NL-LI'], clip: corridor },
  { name: 'Zeeland, freed', kind: 'free', from: NOV_1944, regions: ['NL-ZE'] },
  { name: 'Brabant south of the Maas, freed', kind: 'free', from: NOV_1944, regions: ['NL-NB'], clip: brabant },
  { name: 'Limburg west of the Maas, freed', kind: 'free', from: NOV_1944, regions: ['NL-LI'], clip: westLimburg },
  { name: 'The Ardennes, fought over', kind: 'contested', from: DEC_1944, to: until(MAR_1945), regions: ['BE-WLX', 'BE-WLG', 'BE-WNA', 'LUX'], clip: bulge },
  { name: 'All of Limburg, freed', kind: 'free', from: MAR_1945, regions: ['NL-LI'] },
  { name: 'The east and north, freed', kind: 'free', from: APR_1945, regions: ['NL-GE', 'NL-OV', 'NL-DR', 'NL-GR', 'NL-FR', 'NL-FL', 'NL-UT'], clip: eastAndNorth },
  { name: 'The Netherlands, freed', kind: 'free', from: MAY_1945, regions: NETHERLANDS },
  // Water goes over the land.
  { name: 'Still sea', kind: 'sea', from: MAY_1940, regions: ['NL-FL'], clip: flevoland },
  { name: 'Noordoostpolder, still sea', kind: 'sea', from: MAY_1940, to: until(JAN_1943), regions: ['NL-FL'], clip: noordoostpolder },
  { name: 'Walcheren, flooded', kind: 'sea', from: NOV_1944, shape: walcheren },
  { name: 'The Wieringermeer, flooded', kind: 'sea', from: APR_1945, shape: wieringermeer },
]

const lines: HistLine[] = [
  // The Dutch defence lines of May 1940.
  { name: 'The Grebbe line', kind: 'barrier', from: MAY_1940, to: until(FEB_1941), coords: [[5.43, 52.25], [5.39, 52.16], [5.5, 52.04], [5.58, 51.96]] },
  { name: 'The Peel-Raam line', kind: 'barrier', from: MAY_1940, to: until(FEB_1941), coords: [[5.74, 51.76], [5.7, 51.6], [5.78, 51.45], [5.76, 51.3]] },
  { name: 'Fortress Holland: the New Dutch Water Line', kind: 'barrier', from: MAY_1940, to: until(FEB_1941), coords: [[5.07, 52.33], [5.12, 52.18], [5.15, 52.09], [5.08, 51.98], [4.97, 51.83]] },
  { name: 'The Afsluitdijk, held at Kornwerderzand', kind: 'dam', from: MAY_1940, coords: [[5.04, 52.94], [5.2, 53.02], [5.37, 53.09]] },
  // The invasion, 10 May 1940.
  { name: 'German troops cross the IJssel and reach the Grebbeberg', kind: 'flow', from: MAY_1940, to: until(FEB_1941), coords: [[6.3, 52.1], [6.0, 52.0], [5.6, 51.96]] },
  { name: 'German tanks drive through Brabant to the Moerdijk bridges', kind: 'flow', from: MAY_1940, to: until(FEB_1941), coords: [[6.1, 51.7], [5.75, 51.7], [5.3, 51.65], [4.9, 51.66], [4.63, 51.7]] },
  { name: 'German troops cross Friesland to the Afsluitdijk', kind: 'flow', from: MAY_1940, to: until(FEB_1941), coords: [[7.0, 53.25], [6.5, 53.2], [5.8, 53.15], [5.4, 53.08]] },
  { name: 'German armies invade Belgium', kind: 'flow', from: MAY_1940, to: until(FEB_1941), coords: [[6.1, 50.75], [5.7, 50.7], [5.0, 50.6], [4.4, 50.5]] },
  // Market Garden: the British XXX Corps drives up the corridor towards Arnhem.
  { name: 'Market Garden: British tanks drive for the bridge at Arnhem', kind: 'flow', from: SEP_1944, to: until(NOV_1944), coords: [[5.42, 51.25], [5.48, 51.44], [5.55, 51.62], [5.74, 51.76], [5.86, 51.84], [5.9, 51.97]] },
  // The Battle of the Scheldt, October and November 1944.
  { name: 'Canadian, British and Polish troops clear the Scheldt', kind: 'flow', from: NOV_1944, to: until(DEC_1944), coords: [[4.42, 51.25], [4.3, 51.42], [4.0, 51.48], [3.7, 51.5]] },
  // April 1945: the First Canadian Army.
  { name: 'Canadian troops drive north to Groningen', kind: 'flow', from: APR_1945, to: until(MAY_1945), coords: [[6.25, 51.88], [6.45, 52.15], [6.55, 52.6], [6.57, 53.15]] },
  { name: 'Canadian troops take Arnhem and Apeldoorn', kind: 'flow', from: APR_1945, to: until(MAY_1945), coords: [[6.05, 51.9], [5.9, 51.98], [5.96, 52.2]] },
]

const sites: HistSite[] = [
  { name: 'The Hague', kind: 'battle', from: MAY_1940, to: until(FEB_1941), at: [4.36, 52.04], label: 'left', note: 'German paratroopers try to seize the airfields and the government, 10 May 1940' },
  { name: 'Moerdijk bridges', kind: 'battle', from: MAY_1940, to: until(FEB_1941), at: [4.62, 51.69], label: 'left', note: 'Taken by German paratroopers, 10 May 1940' },
  { name: 'Grebbeberg', kind: 'battle', from: MAY_1940, to: until(FEB_1941), at: [5.6, 51.955], label: 'right', note: 'Held by the Dutch army for three days, 11 to 13 May 1940' },
  { name: 'Kornwerderzand', kind: 'fort', from: MAY_1940, to: until(FEB_1941), at: [5.33, 53.07], label: 'left', note: 'The forts on the Afsluitdijk, never taken, 12 to 14 May 1940' },
  { name: 'Rotterdam', kind: 'battle', from: MAY_1940, to: until(FEB_1941), at: [4.48, 51.92], label: 'right', note: 'Its centre bombed on 14 May 1940' },
  { name: 'Middelburg', kind: 'battle', from: MAY_1940, to: until(FEB_1941), at: [3.61, 51.5], label: 'right', note: 'Its centre burnt by German shelling, 17 May 1940' },
  { name: 'Amsterdam', kind: 'town', from: FEB_1941, to: until(JUL_1942), at: [4.9, 52.37], label: 'left', note: 'The February strike, 25 and 26 February 1941' },
  { name: 'Westerbork', kind: 'camp', from: JUL_1942, to: APR_1945, at: [6.61, 52.92], label: 'right', note: 'Transit camp: from July 1942, most of the Jews deported from the Netherlands were sent east from here. Freed by Canadian troops, 12 April 1945' },
  { name: 'Vught', kind: 'camp', from: JAN_1943, to: until(SEP_1944), at: [5.29, 51.66], label: 'right', note: 'Concentration camp Herzogenbusch, run by the SS from January 1943 until it was emptied in September 1944' },
  { name: 'Maastricht', kind: 'town', from: SEP_1944, at: [5.69, 50.85], label: 'left', note: 'The first Dutch city freed, 14 September 1944' },
  { name: 'Arnhem', kind: 'battle', from: SEP_1944, to: until(NOV_1944), at: [5.91, 51.98], label: 'left', note: 'British paratroopers hold the north end of the bridge, 17 to 21 September 1944' },
  { name: 'Overloon', kind: 'battle', from: NOV_1944, to: until(DEC_1944), at: [5.95, 51.57], label: 'right', note: 'Tank battle, 30 September to 18 October 1944' },
  { name: 'Walcheren', kind: 'battle', from: NOV_1944, to: until(DEC_1944), at: [3.5, 51.57], label: 'left', note: 'British commandos land at Westkapelle and Vlissingen, 1 November 1944' },
  { name: 'Breda', kind: 'town', from: NOV_1944, at: [4.78, 51.59], label: 'right', note: 'Freed by the Polish 1st Armoured Division, 29 October 1944' },
  { name: 'Bastogne', kind: 'battle', from: DEC_1944, to: until(MAR_1945), at: [5.72, 50.0], label: 'right', note: 'Held by American troops under siege, 20 to 26 December 1944' },
  { name: 'Groningen', kind: 'battle', from: APR_1945, to: until(MAY_1945), at: [6.57, 53.22], label: 'left', note: 'Freed by Canadian troops after four days of street fighting, 16 April 1945' },
  { name: 'Apeldoorn', kind: 'town', from: APR_1945, at: [5.97, 52.21], label: 'right', note: 'Freed by Canadian troops, 17 April 1945' },
  // Operation Manna, from 29 April 1945: British bombers drop food on the starving west.
  { name: 'Valkenburg', kind: 'drop', from: APR_1945, to: until(MAY_1945), at: [4.43, 52.18], note: 'Food dropped by Allied bombers, from 29 April 1945' },
  { name: 'Ypenburg', kind: 'drop', from: APR_1945, to: until(MAY_1945), at: [4.36, 52.04], note: 'Food dropped by Allied bombers, from 29 April 1945' },
  { name: 'Rotterdam, Waalhaven', kind: 'drop', from: APR_1945, to: until(MAY_1945), at: [4.44, 51.89], note: 'Food dropped by Allied bombers, from 29 April 1945' },
  { name: 'Schiphol', kind: 'drop', from: APR_1945, to: until(MAY_1945), at: [4.76, 52.31], note: 'Food dropped by Allied bombers, from 29 April 1945' },
  { name: 'Wageningen', kind: 'town', from: MAY_1945, at: [5.66, 51.97], label: 'right', note: 'Where the German army in the Netherlands surrendered, 5 and 6 May 1945' },
]

const labels: HistLabel[] = [
  { text: 'GERMANY', kind: 'territory', from: MAY_1940, at: [7.1, 52.4] },
  { text: 'FEBRUARY STRIKE', kind: 'alert', from: FEB_1941, to: until(JUL_1942), at: [4.85, 52.47] },
  { text: 'HUNGER WINTER', kind: 'alert', from: NOV_1944, to: APR_1945, at: [4.65, 52.2] },
  { text: 'FLOODED', kind: 'alert', from: NOV_1944, at: [3.6, 51.62] },
  { text: 'IJSSELMEER', kind: 'water', from: MAY_1940, at: [5.35, 52.83] },
]

const events: HistEvent[] = [
  {
    from: MAY_1940,
    title: 'May 1940: Five days of war',
    text: 'On 10 May German troops cross the border, and paratroopers land around The Hague and at the Moerdijk bridges. The Dutch army holds the Grebbeberg for three days, and the forts on the Afsluitdijk never fall. On 14 May German bombers destroy the centre of Rotterdam, and the next day the army surrenders. Belgium holds out until 28 May.',
  },
  {
    from: FEB_1941,
    title: 'February 1941: Amsterdam strikes',
    text: "After German police round up some 400 young Jewish men in Amsterdam, the city's workers strike on 25 and 26 February. Trams, shipyards and offices stop. It is the first mass protest against the persecution of the Jews in occupied Europe, and the Germans crush it in two days.",
  },
  {
    from: JUL_1942,
    title: 'July 1942: The deportations begin',
    text: 'From 15 July, trains leave camp Westerbork in Drenthe for Auschwitz, and later for Sobibor. Of about 140,000 Jews in the Netherlands, some 102,000 are murdered: about three in four, a larger share than anywhere else in western Europe.',
  },
  {
    from: JAN_1943,
    title: '1943: Camps and hiding',
    text: 'In January the SS opens a concentration camp at Vught, in Brabant. That spring the Germans order Dutch ex-soldiers back into captivity, and hundreds of thousands strike. Young men called up for work in Germany go into hiding instead: by 1944 some 300,000 people are hidden in attics, barns and cellars.',
  },
  {
    from: SEP_1944,
    title: 'September 1944: Belgium is free, and Market Garden',
    text: 'Allied armies sweep through Belgium: Brussels is freed on 3 September and Antwerp on 4. Maastricht is the first Dutch city freed, on 14 September. On 17 September Operation Market Garden drops paratroopers to seize the bridges up to Arnhem. The corridor holds as far as Nijmegen, but the bridge at Arnhem is lost.',
  },
  {
    from: NOV_1944,
    title: 'November 1944: The Scheldt, and the Hunger Winter',
    text: 'Canadian, British and Polish troops fight for weeks to clear the banks of the Scheldt, so that ships can reach Antwerp. Walcheren is flooded when Allied bombers breach its dikes. Breda is freed by Polish tanks. North of the great rivers a railway strike and a German ban on food transport bring on the Hunger Winter.',
  },
  {
    from: DEC_1944,
    title: 'December 1944: The Battle of the Bulge',
    text: 'On 16 December Germany attacks through the Ardennes of Belgium and Luxembourg. American troops hold out at Bastogne, and by the end of January the bulge is pushed back. In the occupied Netherlands people walk for days to farms to trade linen and silver for food.',
  },
  {
    from: MAR_1945,
    title: 'March 1945: Limburg is free',
    text: 'At the start of March, Venlo and Roermond are freed, and with them the last of Limburg. Later that month the Allies cross the Rhine in Germany.',
  },
  {
    from: APR_1945,
    title: 'April 1945: The Canadians free the east and north',
    text: 'The First Canadian Army pushes north from the Rhine. It frees camp Westerbork on 12 April, Arnhem on 14 April and Groningen after four days of street fighting, on 16 April. The west is still occupied and starving. On 29 April Allied bombers begin dropping food there, in Operation Manna.',
  },
  {
    from: MAY_1945,
    title: 'May 1945: Liberation',
    text: 'On 5 May, at the Hotel De Wereld in Wageningen, the German commander in the Netherlands accepts the surrender of his troops before the Canadian general Charles Foulkes. Canadian and British troops enter Amsterdam, Rotterdam and The Hague in the days after. 5 May is now Liberation Day.',
  },
]

export const occupationStory: TimeStory = {
  place: 'the Low Countries',
  min: OCCUPATION_MIN,
  max: OCCUPATION_MAX,
  format: formatMonth,
  months: true,
  events,
  lines,
  sites,
  labels,
  areas,
  fresh: 'outline',
  note: 'Front lines are approximate, drawn with today’s provinces. A month shows the land freed by its end.',
  key: [
    { swatch: 'key-occupied', text: 'Occupied by Germany' },
    { swatch: 'key-free', text: 'Liberated' },
    { swatch: 'key-contested', text: 'Fought over' },
    { swatch: 'key-flash', text: 'Freed this stage' },
    { swatch: 'key-battle', text: 'Battle' },
    { swatch: 'key-camp', text: 'Camp' },
    { swatch: 'key-drop', text: 'Food drop' },
  ],
}

// For the time map through all eras, which counts in years: the war as it stood in
// three months, pinned to their years. Each snapshot shows only what was on the map
// that month.
const snapshotMonths: [number, number][] = [
  [1940, MAY_1940],
  [1944, NOV_1944],
  [1945, MAY_1945],
]
const at = <T extends { from: number; to?: number; off?: [number, number][] }>(items: T[], m: number, year: number) =>
  items.filter((i) => i.from <= m && (i.to === undefined || m <= i.to)).map((i) => ({ ...i, from: year, to: year, end: year }))

export const occupationByYear: TimeStory = {
  ...occupationStory,
  min: 1940,
  max: 1945,
  format: String,
  months: false,
  events: snapshotMonths.map(([year, m]) => {
    const e = [...events].reverse().find((ev) => ev.from <= m)!
    return { ...e, from: year }
  }),
  lines: snapshotMonths.flatMap(([year, m]) => at(lines, m, year)),
  sites: snapshotMonths.flatMap(([year, m]) => at(sites, m, year)),
  labels: snapshotMonths.flatMap(([year, m]) => at(labels, m, year)),
  areas: snapshotMonths.flatMap(([year, m]) => at(areas, m, year).map((a) => ({ ...a, name: `${a.name} (${year})` }))),
}
