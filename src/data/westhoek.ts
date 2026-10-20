// The map for Unit 14: the Westhoek, the corner of Flanders where the front stood
// still for four years, October 1914 to November 1918, month by month. The Belgian
// army holds the Yser behind the flooded plain; around Ypres the front bulges east in
// the salient, shrinks after the gas attack of April 1915, creeps forward at Messines
// and Passchendaele in 1917 and falls back in April 1918, until the Allies break out in
// September 1918. A front that has moved on stays behind as a faint dashed line. War
// cemeteries (`grave`) appear in the month they were begun; those laid out after the
// war, and the memorials, appear with the Armistice. The slider counts months (see
// `month`). Front lines are approximate. Coordinates are [lon, lat] (WGS84); the Yser
// and the canal come from the Flemish hydrographic atlas, as on the base map.

import { formatMonth, month, type HistArea, type HistEvent, type HistLabel, type HistLine, type HistSite, type TimeStory } from './timeline'

export const WESTHOEK_MIN = month(1914, 10)
export const WESTHOEK_MAX = month(1918, 11)

const OCT_1914 = WESTHOEK_MIN
const DEC_1914 = month(1914, 12)
const APR_1915 = month(1915, 4)
const MAY_1915 = month(1915, 5)
const JUN_1917 = month(1917, 6)
const NOV_1917 = month(1917, 11)
const APR_1918 = month(1918, 4)
const OCT_1918 = month(1918, 10)
const NOV_1918 = WESTHOEK_MAX
// Lines, sites and labels of one stage last until the next one starts.
const until = (next: number) => next - 1

type P = [number, number]

// The Belgian front: from the beach east of Nieuwpoort, along the Yser to Diksmuide
// and on to where the canal from Ypres joins it, then down the canal to Drie Grachten.
const yser: P[] = [
  [2.735, 51.162], [2.741, 51.143], [2.746, 51.135], [2.758, 51.135], [2.77, 51.133], [2.783, 51.132], [2.794, 51.131],
  [2.803, 51.126], [2.809, 51.119], [2.818, 51.116], [2.825, 51.11], [2.821, 51.102], [2.827, 51.096], [2.84, 51.096],
  [2.85, 51.093], [2.853, 51.084], [2.843, 51.081], [2.837, 51.075], [2.844, 51.069], [2.851, 51.063], [2.849, 51.052],
  [2.845, 51.045], [2.852, 51.04], [2.854, 51.03], [2.849, 51.022], [2.845, 51.013], [2.836, 51.007], [2.827, 50.999],
  [2.819, 50.993], [2.812, 50.987], [2.806, 50.981], [2.81, 50.975], [2.815, 50.97], [2.82, 50.962], [2.826, 50.957],
  [2.827, 50.948],
]
// The canal from Drie Grachten down to Steenstrate, and on to Boezinge.
const toSteenstrate: P[] = [[2.827, 50.948], [2.83, 50.941], [2.834, 50.934], [2.838, 50.928], [2.842, 50.922], [2.848, 50.917]]
const toBoezinge: P[] = [[2.848, 50.917], [2.85, 50.909], [2.855, 50.901], [2.862, 50.897]]
// From Ypres's southern front down past Messines and Ploegsteert Wood to the French border.
const south: P[] = [[2.885, 50.8], [2.87, 50.787], [2.865, 50.77], [2.87, 50.75], [2.895, 50.735], [2.915, 50.72], [2.925, 50.705]]

// The salient after the First Battle of Ypres, November 1914 to April 1915: wide, out
// past Zonnebeke and Polygon Wood.
const salient1914: P[] = [
  ...toSteenstrate.slice(-1), [2.875, 50.915], [2.905, 50.91], [2.935, 50.905], [2.965, 50.9], [2.99, 50.885], [3.0, 50.87],
  [3.0, 50.855], [2.985, 50.845], [2.965, 50.84], [2.95, 50.83], [2.93, 50.82], [2.905, 50.81], ...south,
]
// After the gas attack, May 1915: pulled in to within 5 km of Ypres, from the canal at
// Boezinge round by Wieltje, Hooge and Hill 60 to St Eloi.
const salient1915: P[] = [
  ...toBoezinge, [2.89, 50.885], [2.925, 50.873], [2.945, 50.855], [2.948, 50.846], [2.95, 50.835], [2.93, 50.822], [2.893, 50.81],
  ...south,
]
// After Messines, June 1917: the ridge from Wijtschate to Messines is taken.
const salient1917: P[] = [
  ...salient1915.slice(0, toBoezinge.length + 7), [2.92, 50.805], [2.935, 50.785], [2.93, 50.765], [2.925, 50.745], [2.935, 50.725],
  [2.935, 50.705],
]
// After Passchendaele, November 1917: out to the village on the ridge, with the French
// and Belgians across the canal at Drie Grachten and Merkem.
const passchendaele: P[] = [
  [2.827, 50.948], [2.86, 50.95], [2.89, 50.945], [2.93, 50.935], [2.965, 50.925], [3.0, 50.915], [3.02, 50.905], [3.03, 50.895],
  [3.015, 50.88], [3.0, 50.865], [2.985, 50.85], [2.97, 50.835], [2.945, 50.82], [2.93, 50.805], [2.935, 50.785], [2.93, 50.765],
  [2.925, 50.745], [2.935, 50.725], [2.935, 50.705],
]
// After the German offensive of April 1918: back to the edge of Ypres, with Kemmel lost
// and the line bending west into France.
const salient1918: P[] = [
  [2.827, 50.948], [2.86, 50.95], [2.88, 50.93], [2.9, 50.895], [2.925, 50.87], [2.94, 50.85], [2.935, 50.83], [2.905, 50.81],
  [2.87, 50.795], [2.83, 50.79], [2.8, 50.795], [2.76, 50.78], [2.73, 50.765], [2.7, 50.75],
]

// The land behind a front line, out to the east edge of the map.
const behind = (front: P[]): P[] => {
  const last = front[front.length - 1]
  return [...front, [last[0], 50.5], [3.5, 50.5], [3.5, 51.3], [front[0][0], 51.3]]
}

// The flooded plain between the Yser and the railway embankment from Nieuwpoort to
// Diksmuide, from the end of October 1914.
const flood: P[] = [
  ...yser.slice(4, 24),
  [2.845, 51.035], [2.832, 51.046], [2.815, 51.06], [2.798, 51.074], [2.786, 51.09], [2.768, 51.104], [2.757, 51.122],
]

// Later entries draw on top.
const areas: HistArea[] = [
  { name: 'Unoccupied Belgium', kind: 'belgium', from: OCT_1914, regions: ['BEL'] },
  { name: 'Held by Germany, 1914', kind: 'occupied', from: OCT_1914, to: until(MAY_1915), regions: ['BEL', 'FRA'], clip: behind([...yser, ...toSteenstrate, ...salient1914]) },
  { name: 'Held by Germany, 1915', kind: 'occupied', from: MAY_1915, to: until(JUN_1917), regions: ['BEL', 'FRA'], clip: behind([...yser, ...toSteenstrate, ...salient1915]) },
  { name: 'Held by Germany, summer 1917', kind: 'occupied', from: JUN_1917, to: until(NOV_1917), regions: ['BEL', 'FRA'], clip: behind([...yser, ...toSteenstrate, ...salient1917]) },
  { name: 'Held by Germany, winter 1917', kind: 'occupied', from: NOV_1917, to: until(APR_1918), regions: ['BEL', 'FRA'], clip: behind([...yser, ...passchendaele]) },
  { name: 'Held by Germany, 1918', kind: 'occupied', from: APR_1918, to: until(OCT_1918), regions: ['BEL', 'FRA'], clip: behind([...yser, ...salient1918]) },
  { name: 'The Yser plain, flooded', kind: 'flooded', from: OCT_1914, shape: flood },
]

const lines: HistLine[] = [
  { name: 'The Belgian front on the Yser', kind: 'front', from: OCT_1914, to: until(OCT_1918), coords: yser },
  { name: 'The front on the canal, Drie Grachten to Steenstrate', kind: 'front', from: OCT_1914, to: until(NOV_1917), coords: toSteenstrate },
  { name: 'The Ypres salient, winter 1914', kind: 'front', from: OCT_1914, to: until(MAY_1915), coords: salient1914 },
  { name: 'The Ypres salient after the gas attack', kind: 'front', from: MAY_1915, to: until(JUN_1917), coords: salient1915 },
  { name: 'The front after Messines', kind: 'front', from: JUN_1917, to: until(NOV_1917), coords: salient1917 },
  { name: 'The front after Passchendaele', kind: 'front', from: NOV_1917, to: until(APR_1918), coords: passchendaele },
  { name: 'The front after the German offensive of April 1918', kind: 'front', from: APR_1918, to: until(OCT_1918), coords: salient1918 },
  // Attacks, each shown in its own stage.
  { name: 'German chlorine gas drifts onto the French and Algerian lines, 22 April 1915', kind: 'flow', from: APR_1915, to: until(MAY_1915), coords: [[2.92, 50.93], [2.9, 50.91], [2.88, 50.895]] },
  { name: 'British, Australian and New Zealand troops take Messines Ridge, 7 June 1917', kind: 'flow', from: JUN_1917, to: until(NOV_1917), coords: [[2.86, 50.785], [2.89, 50.778], [2.92, 50.772]] },
  { name: 'The Canadians attack up the ridge to Passchendaele, 26 October to 10 November 1917', kind: 'flow', from: NOV_1917, to: until(APR_1918), coords: [[2.96, 50.865], [2.99, 50.885], [3.015, 50.9]] },
  { name: 'The German offensive takes Kemmel Hill, 25 April 1918', kind: 'flow', from: APR_1918, to: until(OCT_1918), coords: [[2.9, 50.74], [2.86, 50.765], [2.83, 50.785]] },
  { name: 'The Belgian army breaks out from the Yser, 28 September 1918', kind: 'flow', from: OCT_1918, to: until(NOV_1918), coords: [[2.87, 50.96], [2.96, 50.98], [3.06, 51.0]] },
  { name: 'British troops break out from Ypres, 28 September 1918', kind: 'flow', from: OCT_1918, to: until(NOV_1918), coords: [[2.93, 50.85], [3.0, 50.85], [3.07, 50.86]] },
]

const sites: HistSite[] = [
  { name: 'Ypres', kind: 'town', from: OCT_1914, at: [2.885, 50.851], label: 'left', note: 'Shelled into ruins from November 1914' },
  { name: 'Poperinge', kind: 'town', from: OCT_1914, at: [2.726, 50.855], label: 'left', note: 'The town behind the lines where British soldiers rested' },
  { name: 'Veurne', kind: 'town', from: OCT_1914, at: [2.662, 51.073], label: 'left', note: 'The Belgian army’s headquarters town' },
  { name: 'De Panne', kind: 'town', from: OCT_1914, at: [2.593, 51.099], label: 'right', note: 'King Albert and Queen Elisabeth lived here from 1914 to 1918' },
  { name: 'Nieuwpoort sluices', kind: 'barrier', from: OCT_1914, to: until(DEC_1914), at: [2.76, 51.128], label: 'right', note: 'Opened at high tide in the last days of October 1914 to flood the Yser plain' },
  { name: 'Diksmuide', kind: 'battle', from: OCT_1914, to: until(DEC_1914), at: [2.865, 51.033], label: 'right', note: 'Held by Belgian and French marines until 10 November 1914' },
  { name: 'Ploegsteert', kind: 'town', from: DEC_1914, to: until(APR_1915), at: [2.877, 50.725], label: 'left', note: 'Here and along the front, British and German soldiers met in no man’s land at Christmas 1914' },
  { name: 'St Julien', kind: 'battle', from: APR_1915, to: until(MAY_1915), at: [2.94, 50.888], label: 'right', note: 'The Canadians hold the line after the first gas attacks, 22 to 24 April 1915' },
  { name: 'Trench of Death', kind: 'fort', from: MAY_1915, to: until(OCT_1918), at: [2.848, 51.042], label: 'left', note: 'The Dodengang: a Belgian trench on the Yser bank, metres from a German post, held from 1915 to 1918' },
  { name: 'Messines', kind: 'battle', from: JUN_1917, to: until(NOV_1917), at: [2.898, 50.765], label: 'left', note: '19 mines blow up under the German lines at 3:10 a.m., 7 June 1917' },
  { name: 'Passchendaele', kind: 'battle', from: NOV_1917, to: until(APR_1918), at: [3.02, 50.9], label: 'right', note: 'Taken by Canadian troops, 6 November 1917' },
  { name: 'Kemmel', kind: 'battle', from: APR_1918, to: until(OCT_1918), at: [2.828, 50.785], label: 'left', note: 'Kemmel Hill, taken by the German army, 25 April 1918' },
  { name: 'Merkem', kind: 'battle', from: APR_1918, to: until(OCT_1918), at: [2.86, 50.955], label: 'right', note: 'The Belgian army beats off a German attack, 17 April 1918' },
  // The war-graves layer. Cemeteries begun during the war appear in the stage they were begun.
  { name: 'Lijssenthoek', kind: 'grave', from: MAY_1915, at: [2.703, 50.829], label: 'left', note: 'Military cemetery beside the field hospitals, Commonwealth burials from June 1915: 10,785 graves, 1,058 of them Canadian' },
  { name: 'Essex Farm', kind: 'grave', from: MAY_1915, at: [2.873, 50.873], label: 'left', note: 'Cemetery beside a dressing station on the canal bank, begun in 1915, where John McCrae wrote In Flanders Fields' },
  { name: 'Langemark', kind: 'grave', from: MAY_1915, at: [2.918, 50.922], label: 'right', note: 'German war cemetery, begun in 1915: more than 44,000 soldiers lie here' },
  { name: 'Tyne Cot', kind: 'grave', from: NOV_1917, at: [3.0, 50.887], label: 'right', note: 'Begun in October 1917; with nearly 12,000 graves, the largest Commonwealth war cemetery in the world' },
  // Laid out or built after the war.
  { name: 'Vladslo', kind: 'grave', from: NOV_1918, at: [2.93, 51.058], label: 'right', note: 'German war cemetery: 25,644 dead, and Käthe Kollwitz’s statues of the grieving parents' },
  { name: 'Menin Gate', kind: 'memorial', from: NOV_1918, at: [2.894, 50.852], label: 'right', note: 'Unveiled in 1927, with the names of 54,000 Commonwealth soldiers missing in the salient; the Last Post is played here every evening' },
  { name: 'Brooding Soldier', kind: 'memorial', from: NOV_1918, at: [2.935, 50.895], label: 'left', note: 'The St. Julien Canadian Memorial, unveiled in 1923, where 18,000 Canadians withstood the first gas attacks' },
  { name: 'Hill 62', kind: 'memorial', from: NOV_1918, at: [2.947, 50.837], note: 'Canadian memorial to the battle of Mount Sorrel, June 1916' },
  { name: 'Crest Farm', kind: 'memorial', from: NOV_1918, at: [3.014, 50.894], note: 'The Passchendaele Canadian Memorial' },
  { name: 'Yser Tower', kind: 'memorial', from: NOV_1918, at: [2.855, 51.028], label: 'left', note: 'Memorial to the Flemish soldiers of the Yser, first built in 1930' },
]

const labels: HistLabel[] = [
  { text: 'NORTH SEA', kind: 'water', from: OCT_1914, at: [2.62, 51.17] },
  { text: 'FLOODED', kind: 'alert', from: OCT_1914, to: until(OCT_1918), at: [2.79, 51.095] },
  { text: 'BELGIAN ARMY', kind: 'people', from: OCT_1914, to: until(OCT_1918), at: [2.7, 51.0] },
  { text: 'BRITISH ARMY', kind: 'people', from: OCT_1914, to: until(OCT_1918), at: [2.78, 50.86] },
  { text: 'GERMAN ARMY', kind: 'people', from: OCT_1914, to: until(OCT_1918), at: [3.0, 51.08] },
  { text: 'GAS', kind: 'alert', from: APR_1915, to: until(MAY_1915), at: [2.96, 50.94] },
  { text: 'FRANCE', kind: 'territory', from: OCT_1914, at: [2.6, 50.74] },
]

const events: HistEvent[] = [
  {
    from: OCT_1914,
    title: 'October 1914: The Yser and Ypres',
    text: 'The Belgian army, driven out of Antwerp, makes its stand on the Yser. In the last days of October the sluices at Nieuwpoort are opened at high tide, and the sea floods the plain between the river and the railway: the German attack stops in the water. Around Ypres, British and French troops hold a bulge in the line, the salient.',
  },
  {
    from: DEC_1914,
    title: 'December 1914: A Christmas truce',
    text: 'By winter the two sides have dug trenches from the coast to Switzerland. At Christmas, near Ploegsteert and in many other places, British and German soldiers stop firing, climb out and meet in no man’s land to talk, swap food and bury their dead. The truce does not last.',
  },
  {
    from: APR_1915,
    title: 'April 1915: Gas',
    text: 'On 22 April 1915, near Langemark, the German army opens thousands of cylinders of chlorine and the wind carries a green-yellow cloud onto the French and Algerian lines, which break. Canadian troops beside them close the gap, and on 24 April hold against a second gas attack near St Julien.',
  },
  {
    from: MAY_1915,
    title: 'May 1915: In Flanders Fields',
    text: 'By late May the salient has shrunk to a few kilometres around Ypres, which German guns pound to ruins. At a dressing station on the canal bank, on 3 May, the Canadian doctor John McCrae writes In Flanders Fields after burying a friend. Cemeteries grow behind the lines.',
  },
  {
    from: JUN_1917,
    title: 'June 1917: Messines',
    text: 'At 3:10 a.m. on 7 June 1917, 19 mines dug under the German lines blow up along Messines Ridge, south of Ypres. British, Australian and New Zealand troops take the ridge the same day.',
  },
  {
    from: NOV_1917,
    title: 'November 1917: Passchendaele',
    text: 'From 31 July British troops attack east of Ypres, into rain and mud churned by shells. In late October the Canadians take over the attack, and on 6 November they take the ruined village of Passchendaele. The British and Commonwealth armies have advanced about 8 km in more than three months.',
  },
  {
    from: APR_1918,
    title: 'April 1918: The German offensive',
    text: 'In April 1918 the German army attacks along the river Lys. It takes Kemmel Hill on 25 April, and the British give up the ground won at Passchendaele to shorten their line. On 17 April at Merkem the Belgian army beats off an attack on its sector.',
  },
  {
    from: OCT_1918,
    title: 'October 1918: The breakout',
    text: 'On 28 September 1918 the Belgian army, with British and French troops, attacks out of the Yser and Ypres. In a few days it crosses the ground fought over for four years. Ostend and Bruges are freed in the middle of October.',
  },
  {
    from: NOV_1918,
    title: '11 November 1918, and after',
    text: 'The Armistice ends the fighting at 11 a.m. on 11 November. In the years after, the dead are gathered into cemeteries all over the Westhoek, and memorials are built: the Menin Gate at Ypres for the missing, and Canadian memorials at St Julien, Hill 62 and Passchendaele.',
  },
]

export const westhoekStory: TimeStory = {
  place: 'the Westhoek',
  base: 'westhoek',
  bounds: [[2.56, 50.69], [3.08, 51.17]],
  min: WESTHOEK_MIN,
  max: WESTHOEK_MAX,
  format: formatMonth,
  months: true,
  events,
  lines,
  sites,
  labels,
  areas,
  fresh: 'outline',
  note: 'Front lines are approximate. Cemeteries and memorials laid out after the war appear with the Armistice.',
  key: [
    { swatch: 'key-front', text: 'Front line' },
    { swatch: 'key-belgium', text: 'Unoccupied Belgium' },
    { swatch: 'key-occupied', text: 'Held by Germany' },
    { swatch: 'key-flooded', text: 'Flooded' },
    { swatch: 'key-battle', text: 'Battle' },
    { swatch: 'key-grave', text: 'War cemetery' },
    { swatch: 'key-memorial', text: 'Memorial' },
  ],
}
