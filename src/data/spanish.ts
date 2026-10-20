// The map of the two Netherlands after the Peace of Münster, for Unit 6: the Dutch
// Republic in the north, and in the south a Spanish Netherlands that Louis XIV of
// France cuts down treaty by treaty, 1648 to 1700. As on the revolt map, each land is
// drawn with the modern provinces closest to it, and the towns France took are
// grouped into rough hand-drawn cuts. Coordinates are [lon, lat] (WGS84).

import { artois, frenchFlanders, limburgDuchy } from './burgundy'
import type { HistArea, HistEvent, HistLabel, HistSite, TimeStory } from './timeline'

export const SPANISH_MIN = 1648
export const SPANISH_MAX = 1700

const REPUBLIC = ['NL-NH', 'NL-ZH', 'NL-ZE', 'NL-UT', 'NL-GE', 'NL-OV', 'NL-FR', 'NL-GR', 'NL-DR', 'NL-NB']
const SOUTH = ['BE-VWV', 'BE-VOV', 'BE-VAN', 'BE-VBR', 'BE-WBR', 'BE-BRU', 'BE-WHT', 'BE-WNA', 'BE-WLX', 'LUX']

// Tournai and its district; Kortrijk and Oudenaarde on the Lys and Scheldt; Ypres and
// its towns in West Flanders; Cambrai, Valenciennes and Maubeuge, now in France.
const tournai: [number, number][] = [[3.25, 50.68], [3.5, 50.7], [3.6, 50.58], [3.45, 50.5], [3.25, 50.55]]
const kortrijk: [number, number][] = [[3.12, 50.86], [3.45, 50.9], [3.72, 50.9], [3.75, 50.8], [3.45, 50.75], [3.15, 50.74]]
const ypres: [number, number][] = [[2.55, 50.93], [2.95, 50.93], [3.1, 50.8], [2.95, 50.73], [2.75, 50.75], [2.55, 50.8]]
const cambresis: [number, number][] = [[3.1, 50.47], [3.55, 50.5], [3.95, 50.4], [4.2, 50.33], [4.2, 50.1], [3.8, 50.02], [3.1, 50.05]]
// The Generality Lands in the south of Limburg: Maastricht and its surroundings.
const maastricht: [number, number][] = [[5.6, 50.95], [5.85, 50.95], [5.9, 50.75], [5.62, 50.75]]

const areas: HistArea[] = [
  { name: 'Still sea', kind: 'sea', from: SPANISH_MIN, regions: ['NL-FL'] },
  { name: 'The Republic', kind: 'rebel', from: SPANISH_MIN, regions: REPUBLIC },
  // Upper Guelders and Limburg stay Spanish, apart from Maastricht.
  { name: 'Spanish Limburg', kind: 'ruled', from: SPANISH_MIN, regions: ['NL-LI'] },
  { name: 'Maastricht', kind: 'rebel', from: SPANISH_MIN, to: 1673, regions: ['NL-LI'], clip: maastricht },
  { name: 'Maastricht (French)', kind: 'france', from: 1674, to: 1677, regions: ['NL-LI'], clip: maastricht },
  { name: 'Maastricht again', kind: 'rebel', from: 1678, regions: ['NL-LI'], clip: maastricht },
  { name: 'The Spanish Netherlands', kind: 'ruled', from: SPANISH_MIN, regions: SOUTH },
  { name: 'Duchy of Limburg', kind: 'ruled', from: SPANISH_MIN, regions: ['BE-WLG'], clip: limburgDuchy },
  { name: 'Walloon Flanders', kind: 'ruled', from: SPANISH_MIN, to: 1667, regions: ['FRA'], clip: frenchFlanders },
  { name: 'Artois', kind: 'ruled', from: SPANISH_MIN, to: 1658, regions: ['FRA'], clip: artois },
  { name: 'Cambrai and Valenciennes', kind: 'ruled', from: SPANISH_MIN, to: 1677, regions: ['FRA'], clip: cambresis },
  // What France takes, treaty by treaty.
  { name: 'Artois to France', kind: 'france', from: 1659, regions: ['FRA'], clip: artois },
  { name: 'Lille and Walloon Flanders to France', kind: 'france', from: 1668, regions: ['FRA'], clip: frenchFlanders },
  { name: 'Tournai to France', kind: 'france', from: 1668, regions: ['BE-WHT'], clip: tournai },
  { name: 'Kortrijk and Oudenaarde to France', kind: 'france', from: 1668, to: 1677, regions: ['BE-VWV', 'BE-VOV'], clip: kortrijk },
  { name: 'Ypres to France', kind: 'france', from: 1678, regions: ['BE-VWV'], clip: ypres },
  { name: 'Cambrai and Valenciennes to France', kind: 'france', from: 1678, regions: ['FRA'], clip: cambresis },
  { name: 'Luxembourg taken by France', kind: 'france', from: 1684, to: 1696, regions: ['LUX'] },
  // The Disaster Year: French, Münster and Cologne armies overrun the east of the Republic.
  { name: 'The east overrun', kind: 'contested', from: 1672, to: 1673, regions: ['NL-UT', 'NL-GE', 'NL-OV', 'NL-DR'] },
]

const sites: HistSite[] = [
  { name: 'Amsterdam', kind: 'town', from: SPANISH_MIN, at: [4.893, 52.373], label: 'right' },
  { name: 'Brussels', kind: 'town', from: SPANISH_MIN, at: [4.357, 50.847], label: 'right' },
  { name: 'Antwerp', kind: 'town', from: SPANISH_MIN, at: [4.402, 51.219], label: 'right' },
  { name: 'Lille', kind: 'town', from: SPANISH_MIN, at: [3.063, 50.629], label: 'left' },
  { name: 'Water Line', kind: 'barrier', from: 1672, to: 1673, end: 1673, at: [4.98, 52.0], label: 'right', note: 'Holland floods its fields to stop the French, 1672' },
  { name: 'Maastricht', kind: 'battle', from: 1674, to: 1677, at: [5.691, 50.851], label: 'right', note: 'Taken by Louis XIV, 1673' },
  { name: 'Luxembourg', kind: 'battle', from: 1684, to: 1696, at: [6.13, 49.61], label: 'left', note: 'Taken by France, 1684' },
  { name: 'Brussels bombarded', kind: 'battle', from: 1695, to: 1696, at: [4.357, 50.847], label: 'left', note: 'French guns shell the city centre, 13 to 15 August 1695' },
  { name: 'Namur', kind: 'battle', from: 1695, to: 1696, at: [4.867, 50.466], label: 'right', note: 'Retaken by William III, 1695' },
]

const labels: HistLabel[] = [
  { text: 'FRANCE', kind: 'people', from: SPANISH_MIN, at: [3.4, 49.7] },
  { text: 'EMPIRE', kind: 'people', from: SPANISH_MIN, at: [7.0, 51.35] },
  { text: 'Liège', kind: 'territory', from: SPANISH_MIN, at: [5.45, 50.45] },
  { text: 'DUTCH REPUBLIC', kind: 'water', from: SPANISH_MIN, at: [3.9, 52.85] },
  { text: 'SPANISH NETHERLANDS', kind: 'people', from: SPANISH_MIN, at: [4.2, 50.3] },
  { text: 'DISASTER YEAR', kind: 'alert', from: 1672, to: 1673, at: [3.3, 52.35] },
]

const events: HistEvent[] = [
  {
    from: 1648,
    title: '1648: Two Netherlands',
    text: 'After the Peace of Münster, the north is a free republic. The south, the Spanish Netherlands, is ruled from Madrid through a governor in Brussels. France, now the strongest power in Europe, wants the south\'s towns.',
  },
  {
    from: 1659,
    title: '1659: Artois goes to France',
    text: 'In the Treaty of the Pyrenees, ending a long war between France and Spain, Spain gives up most of Artois.',
  },
  {
    from: 1668,
    title: '1668: Lille, Tournai, Kortrijk',
    text: 'Louis XIV claims the Spanish Netherlands for his Spanish wife and invades. In the Treaty of Aachen he keeps a string of towns, among them Lille, Douai, Tournai, Kortrijk, Oudenaarde and Charleroi.',
  },
  {
    from: 1672,
    title: '1672: The Disaster Year',
    text: 'France, England, the bishop of Münster and the archbishop of Cologne attack the Republic. The east is overrun, and Holland saves itself by flooding its fields along the Water Line. The full story is in Unit 8.',
  },
  {
    from: 1674,
    title: '1674: The invaders pull back',
    text: 'The French leave the Republic, but they keep Maastricht, which Louis XIV took in 1673, and fight on in the Spanish Netherlands.',
  },
  {
    from: 1678,
    title: '1678: The Peace of Nijmegen',
    text: 'France gives back Maastricht, and Kortrijk and Oudenaarde, but takes Cambrai, Valenciennes, Saint-Omer and Ypres. Most of what France won in these wars is still French today.',
  },
  {
    from: 1684,
    title: '1684: Luxembourg',
    text: 'French troops take the great fortress of Luxembourg.',
  },
  {
    from: 1695,
    title: '1695: Brussels in flames',
    text: 'In a new war, French guns bombard Brussels for two days. Thousands of houses and the guild houses of the Grand Place burn. William III, stadtholder and now king of England, retakes Namur.',
  },
  {
    from: 1697,
    title: '1697: The Peace of Rijswijk',
    text: 'France gives back Luxembourg and other towns it has taken in the war. Brussels is already rebuilding its Grand Place.',
  },
  {
    from: 1700,
    title: '1700: The last Spanish Habsburg',
    text: 'King Charles II of Spain dies without children and leaves his empire to Louis XIV\'s grandson. A new European war over the Spanish Netherlands is about to begin.',
  },
]

export const spanishStory: TimeStory = {
  place: 'the Low Countries',
  min: SPANISH_MIN,
  max: SPANISH_MAX,
  format: String,
  events,
  lines: [],
  sites,
  labels,
  areas,
  fresh: 'outline',
  note: 'Borders are approximate and drawn with today\'s provinces; the towns France took are grouped into rough areas. The prince-bishopric of Liège was a separate state.',
  key: [
    { swatch: 'key-rebel', text: 'The Dutch Republic' },
    { swatch: 'key-ruled', text: 'The king of Spain' },
    { swatch: 'key-france', text: 'France' },
    { swatch: 'key-contested', text: 'Overrun in 1672' },
    { swatch: 'key-flash', text: 'Just changed hands' },
    { swatch: 'key-battle', text: 'Siege or attack' },
  ],
}
