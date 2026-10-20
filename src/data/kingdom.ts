// The map for Unit 9: one kingdom, then two, 1815 to 1839. The Congress of Vienna
// joins north and south under William I; in 1830 the south breaks away, and it takes
// nine years and a treaty in London to agree where the line between them runs, with
// Limburg and Luxembourg cut in two. As on the earlier maps, each land is drawn with
// the modern provinces closest to it. Coordinates are [lon, lat] (WGS84).

import { eastCantons } from './borders'
import { sides } from './revolt'
import { maastricht } from './spanish'
import type { HistArea, HistEvent, HistLabel, HistLine, HistSite, TimeStory } from './timeline'

export const KINGDOM_MIN = 1815
export const KINGDOM_MAX = 1839

const NORTH = ['NL-NH', 'NL-ZH', 'NL-ZE', 'NL-UT', 'NL-GE', 'NL-OV', 'NL-FR', 'NL-GR', 'NL-DR', 'NL-NB']
const SOUTH = ['BE-VWV', 'BE-VOV', 'BE-VAN', 'BE-VBR', 'BE-WBR', 'BE-BRU', 'BE-WHT', 'BE-WNA', 'BE-WLG']

// Later entries draw on top: Maastricht over Limburg, Prussia's new lands over Liège.
const areas: HistArea[] = [
  { name: 'Still sea', kind: 'sea', from: KINGDOM_MIN, regions: ['NL-FL'] },
  // Zeelandic Flanders stays Dutch throughout, so Zeeland is drawn whole.
  { name: 'The north', kind: 'rebel', from: KINGDOM_MIN, regions: NORTH },
  ...sides('The south', SOUTH, [[1815, 'rebel'], [1830, 'belgium']]),
  // Belgian Limburg, and Dutch Limburg: Belgian from 1830 to 1839, apart from Maastricht.
  ...sides('West Limburg', ['BE-VLI'], [[1815, 'rebel'], [1830, 'belgium']]),
  ...sides('East Limburg', ['NL-LI'], [[1815, 'rebel'], [1830, 'belgium'], [1839, 'rebel']]),
  { name: 'Maastricht', kind: 'rebel', from: KINGDOM_MIN, regions: ['NL-LI'], clip: maastricht },
  // The grand duchy: the king's own, in the German Confederation. In 1830 all but its
  // fortress joins the revolution; in 1839 the French-speaking west stays Belgian.
  ...sides('West Luxembourg', ['BE-WLX'], [[1815, 'duchy'], [1830, 'belgium']]),
  ...sides('East Luxembourg', ['LUX'], [[1815, 'duchy'], [1830, 'belgium'], [1839, 'duchy']]),
  { name: 'Eupen and Malmedy, Prussian', kind: 'outside', from: KINGDOM_MIN, regions: ['BE-WLG'], clip: eastCantons },
]

const lines: HistLine[] = [
  { name: 'The North Holland Canal', kind: 'canal', from: 1824, coords: [[4.9, 52.385], [4.95, 52.5], [4.75, 52.63], [4.77, 52.8], [4.76, 52.95]] },
  { name: 'The Zuid-Willemsvaart', kind: 'canal', from: 1826, coords: [[5.3, 51.69], [5.55, 51.62], [5.66, 51.48], [5.71, 51.25], [5.69, 50.86]] },
  { name: 'The Ghent–Terneuzen Canal', kind: 'canal', from: 1827, coords: [[3.73, 51.07], [3.8, 51.23], [3.83, 51.33]] },
  // The Ten Days' Campaign: the Dutch army's march, and the French army sent to stop it.
  {
    name: 'The Dutch army invades',
    kind: 'flow',
    from: 1831,
    to: 1831,
    coords: [[5.1, 51.45], [4.95, 51.32], [5.2, 51.05], [5.34, 50.93], [5.05, 50.98], [4.94, 50.8], [4.72, 50.87]],
  },
  { name: 'A French army comes to help Belgium', kind: 'flow', from: 1831, to: 1831, coords: [[3.52, 50.36], [3.95, 50.45], [4.36, 50.82], [4.68, 50.86]] },
  { name: 'A French army marches on Antwerp', kind: 'flow', from: 1832, to: 1832, coords: [[3.52, 50.36], [3.95, 50.45], [4.36, 50.85], [4.39, 51.17]] },
]

// The Wellington Barrier: fortresses rebuilt along the French border after Waterloo.
const barrier = (name: string, at: [number, number], label?: 'left' | 'right'): HistSite => ({
  name,
  kind: 'fort',
  from: 1816,
  to: 1829,
  at,
  label,
  note: 'Fortress of the Wellington Barrier, rebuilt from 1816 against France',
})

const sites: HistSite[] = [
  { name: 'Amsterdam', kind: 'town', from: KINGDOM_MIN, at: [4.893, 52.373], label: 'left' },
  { name: 'The Hague', kind: 'town', from: KINGDOM_MIN, at: [4.3, 52.08], label: 'left', note: 'Seat of the king and the States General, in turn with Brussels until 1830' },
  { name: 'Brussels', kind: 'town', from: KINGDOM_MIN, to: 1829, at: [4.357, 50.847], label: 'left', note: 'Seat of the States General, in turn with The Hague' },
  { name: 'Neutral Moresnet', kind: 'town', from: 1816, at: [6.02, 50.72], label: 'right', note: 'A zinc mine and its village, run by Prussia and the Netherlands together, 1816 to 1920' },
  barrier('Ostend', [2.918, 51.226], 'left'),
  barrier('Ypres', [2.885, 50.851], 'left'),
  barrier('Menen', [3.122, 50.796]),
  barrier('Tournai', [3.389, 50.606], 'left'),
  barrier('Mons', [3.952, 50.454], 'left'),
  barrier('Charleroi', [4.444, 50.411]),
  barrier('Namur', [4.867, 50.466], 'right'),
  barrier('Dinant', [4.912, 50.261], 'right'),
  barrier('Huy', [5.239, 50.519], 'right'),
  { name: 'Ghent', kind: 'town', from: 1817, at: [3.717, 51.054], label: 'right', note: 'State university founded by William I, 1817' },
  { name: 'Leuven', kind: 'town', from: 1817, at: [4.701, 50.879], label: 'right', note: 'State university founded by William I, 1817' },
  { name: 'Liège', kind: 'town', from: 1817, at: [5.567, 50.633], label: 'right', note: 'State university founded by William I, 1817' },
  { name: 'Seraing', kind: 'town', from: 1817, at: [5.5, 50.59], label: 'left', note: "John Cockerill's ironworks, from 1817" },
  // The revolution and the war.
  { name: 'Brussels', kind: 'battle', from: 1830, to: 1830, at: [4.357, 50.847], label: 'left', note: 'Four days of street fighting, 23 to 26 September 1830' },
  { name: 'Antwerp', kind: 'battle', from: 1830, to: 1830, at: [4.402, 51.219], label: 'right', note: 'Shelled from the citadel, 27 October 1830' },
  { name: 'Antwerp citadel', kind: 'fort', from: 1830, to: 1832, at: [4.392, 51.205], label: 'left', note: 'Held by a Dutch garrison under General Chassé until 23 December 1832' },
  { name: 'Lillo and Liefkenshoek', kind: 'fort', from: 1830, to: 1838, at: [4.29, 51.305], label: 'left', note: 'Two Scheldt forts held by the Dutch until 1839' },
  { name: 'Maastricht', kind: 'fort', from: 1830, to: 1838, at: [5.691, 50.851], label: 'right', note: 'The Dutch garrison holds the fortress, 1830 to 1839' },
  { name: 'Luxembourg', kind: 'fort', from: 1830, to: 1838, at: [6.13, 49.61], label: 'right', note: 'Fortress of the German Confederation, with a Prussian garrison' },
  { name: 'Brussels', kind: 'town', from: 1831, at: [4.357, 50.847], label: 'left', note: 'Capital of Belgium' },
  { name: 'Hasselt', kind: 'battle', from: 1831, to: 1831, at: [5.338, 50.931], label: 'right', note: 'The Dutch beat the Belgian army of the Meuse, 8 August 1831' },
  { name: 'Leuven', kind: 'battle', from: 1831, to: 1831, at: [4.72, 50.865], note: 'The Dutch beat the Belgians under Leopold I, 12 August 1831' },
  { name: 'Antwerp citadel besieged', kind: 'battle', from: 1832, to: 1832, at: [4.402, 51.219], label: 'right', note: 'The French take the citadel, 15 November to 23 December 1832' },
]

const labels: HistLabel[] = [
  { text: 'FRANCE', kind: 'people', from: KINGDOM_MIN, at: [3.4, 49.7] },
  { text: 'PRUSSIA', kind: 'people', from: KINGDOM_MIN, at: [7.0, 51.35] },
  { text: 'UNITED KINGDOM OF THE NETHERLANDS', kind: 'water', from: KINGDOM_MIN, to: 1829, at: [3.9, 52.85] },
  { text: 'KINGDOM OF THE NETHERLANDS', kind: 'water', from: 1830, at: [3.9, 52.85] },
  { text: 'BELGIUM', kind: 'people', from: 1830, at: [4.2, 50.3] },
  { text: 'Luxembourg', kind: 'territory', from: KINGDOM_MIN, to: 1829, at: [5.95, 49.95] },
  { text: 'Grand Duchy', kind: 'territory', from: 1839, at: [6.12, 49.95] },
]

const events: HistEvent[] = [
  {
    from: 1815,
    title: '1815: One kingdom',
    text: 'The Congress of Vienna joins the old Dutch Republic, the Austrian Netherlands and Liège into the United Kingdom of the Netherlands, under King William I. He is also grand duke of Luxembourg, which belongs to the German Confederation. The States General meet in The Hague and Brussels in turn.',
  },
  {
    from: 1816,
    title: '1816: Fortresses, and a strip nobody owns',
    text: 'Fortresses along the French border, the Wellington Barrier, are rebuilt with British money and money France has to pay after Waterloo. Prussia and the Netherlands cannot agree who gets the zinc mine at Moresnet, so they leave it neutral and run it together.',
  },
  {
    from: 1817,
    title: '1817: Universities and ironworks',
    text: 'William I founds state universities at Ghent, Leuven and Liège. Near Liège, at Seraing, the Englishman John Cockerill sets up ironworks in the old summer palace of the prince-bishops, with the king\'s backing.',
  },
  {
    from: 1822,
    title: '1822: A bank, and a language',
    text: 'The king founds a bank in Brussels to lend to new industry, later called the Société Générale. From 1823 Dutch is the only language of the courts and government in the Flemish provinces, Brussels and Leuven included.',
  },
  {
    from: 1824,
    title: '1824: The North Holland Canal',
    text: 'A ship canal opens from Amsterdam to Den Helder, so big ships can avoid the shallows of the Zuiderzee. The king also founds the Netherlands Trading Society, for trade with the East Indies.',
  },
  {
    from: 1826,
    title: '1826: The Zuid-Willemsvaart',
    text: "A canal named after the king opens from 's-Hertogenbosch to Maastricht.",
  },
  {
    from: 1827,
    title: '1827: Ghent gets a way to the sea',
    text: 'The Ghent–Terneuzen Canal opens. Ships can now reach Ghent from the Western Scheldt without passing Antwerp.',
  },
  {
    from: 1828,
    title: '1828: Catholics and liberals join forces',
    text: 'Catholics, angry that the state now trains their priests, and liberals, angry at trials of journalists, form a union against the king\'s government. Petitions from the south ask for freedom of the press, of teaching and of language.',
  },
  {
    from: 1830,
    title: '1830: Revolution in Brussels',
    text: 'Riots break out in Brussels on 25 August. Dutch troops fight their way into the city on 23 September and leave after four days. On 4 October a provisional government declares Belgium independent. Only Maastricht, the citadel of Antwerp, two Scheldt forts and the fortress of Luxembourg hold out.',
  },
  {
    from: 1831,
    title: "1831: A king, and the Ten Days' Campaign",
    text: 'Leopold of Saxe-Coburg swears his oath as king of the Belgians on 21 July. On 2 August the Dutch army invades and beats the Belgians at Hasselt and Leuven, then turns back as a French army arrives to help Belgium.',
  },
  {
    from: 1832,
    title: "1832: The siege of Antwerp's citadel",
    text: 'A French army besieges the Dutch garrison in the citadel of Antwerp. Its commander, General Chassé, surrenders on 23 December after more than three weeks of shelling.',
  },
  {
    from: 1833,
    title: '1833: Waiting',
    text: 'An agreement signed in London in May ends the fighting. William I still refuses to accept the split, and both countries keep their armies ready for six more years.',
  },
  {
    from: 1838,
    title: '1838: William gives way',
    text: 'The cost of keeping the army ready is ruining the Dutch treasury. In March William I says he will accept the terms the great powers drew up in 1831. In Limburg and Luxembourg, people who have been Belgian for eight years protest.',
  },
  {
    from: 1839,
    title: '1839: The Treaty of London',
    text: 'On 19 April the Netherlands, Belgium and the great powers sign. Belgium is independent and neutral for ever. The Netherlands keeps Maastricht and the eastern half of Limburg. The French-speaking west of Luxembourg, with Arlon, stays Belgian, and the rest stays a grand duchy under the Dutch king.',
  },
]

export const kingdomStory: TimeStory = {
  place: 'the Low Countries',
  min: KINGDOM_MIN,
  max: KINGDOM_MAX,
  format: String,
  events,
  lines,
  sites,
  labels,
  areas,
  fresh: 'outline',
  note: 'Borders are approximate and drawn with today\'s provinces. Zeelandic Flanders, south of the Scheldt, stayed Dutch throughout.',
  key: [
    { swatch: 'key-rebel', text: 'The Kingdom of the Netherlands' },
    { swatch: 'key-duchy', text: "Luxembourg, the king's grand duchy" },
    { swatch: 'key-belgium', text: 'Belgium, from 1830' },
    { swatch: 'key-flash', text: 'Just changed hands' },
    { swatch: 'key-canal', text: 'New canal' },
    { swatch: 'key-fort', text: 'Fortress' },
    { swatch: 'key-battle', text: 'Battle or siege' },
  ],
}
