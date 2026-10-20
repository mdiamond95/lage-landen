// The map for Unit 10: the Netherlands gets connected, 1839 to 1914. Railways spread
// from the first line between Amsterdam and Haarlem, the state builds its own lines
// after 1860, new canals give Amsterdam and Rotterdam a way to the sea, the
// Haarlemmermeer is pumped dry, in 1890 Luxembourg goes its own way, and by 1914 the
// coal mines of South Limburg are working (backported from Unit 13). Each stage
// shows the main lines open by its year (a line opened in between appears at the next
// stage). Coordinates are [lon, lat] (WGS84).

import { eastCantons } from './borders'
import { sides } from './revolt'
import type { HistArea, HistEvent, HistLabel, HistLine, HistSite, TimeStory } from './timeline'

export const RAILS_MIN = 1839
export const RAILS_MAX = 1914

const NETHERLANDS = ['NL-NH', 'NL-ZH', 'NL-ZE', 'NL-UT', 'NL-GE', 'NL-OV', 'NL-FR', 'NL-GR', 'NL-DR', 'NL-NB', 'NL-LI']
const BELGIUM = ['BE-VWV', 'BE-VOV', 'BE-VAN', 'BE-VBR', 'BE-WBR', 'BE-BRU', 'BE-WHT', 'BE-WNA', 'BE-WLG', 'BE-VLI', 'BE-WLX']

// The lake pumped dry from 1849 to 1852, roughly (Haarlem to Aalsmeer, Halfweg to Lisse).
const haarlemmermeer: [number, number][] = [
  [4.63, 52.355], [4.7, 52.375], [4.775, 52.36], [4.79, 52.31], [4.765, 52.265],
  [4.69, 52.225], [4.6, 52.225], [4.565, 52.26], [4.6, 52.315],
]

// The coalfield of South Limburg, from Geleen to Kerkrade, roughly.
const limburgCoal: [number, number][] = [
  [5.8, 50.99], [5.9, 51.0], [6.02, 50.93], [6.1, 50.88], [6.08, 50.84], [5.98, 50.845], [5.88, 50.87], [5.8, 50.93],
]

const areas: HistArea[] = [
  { name: 'Still sea', kind: 'sea', from: RAILS_MIN, regions: ['NL-FL'] },
  { name: 'The Netherlands', kind: 'rebel', from: RAILS_MIN, regions: NETHERLANDS },
  { name: 'Belgium', kind: 'belgium', from: RAILS_MIN, regions: BELGIUM },
  { name: 'Eupen and Malmedy, Prussian', kind: 'outside', from: RAILS_MIN, regions: ['BE-WLG'], clip: eastCantons },
  // The grand duchy shares the Dutch king until William III dies in 1890.
  ...sides('Luxembourg', ['LUX'], [[RAILS_MIN, 'duchy'], [1890, 'outside']]),
  { name: 'The Haarlemmermeer', kind: 'sea', from: RAILS_MIN, to: 1851, shape: haarlemmermeer },
  { name: 'The Limburg coalfield', kind: 'coal', from: 1914, shape: limburgCoal },
]

const T = {
  amsterdam: [4.9, 52.379],
  haarlem: [4.636, 52.388],
  leiden: [4.482, 52.166],
  hague: [4.324, 52.07],
  delft: [4.357, 52.007],
  rotterdam: [4.47, 51.922],
  utrecht: [5.11, 52.09],
  driebergen: [5.28, 52.052],
  ede: [5.67, 52.03],
  arnhem: [5.9, 51.985],
  zevenaar: [6.07, 51.93],
  emmerich: [6.25, 51.835],
  gouda: [4.71, 52.017],
  antwerp: [4.42, 51.217],
  roosendaal: [4.46, 51.53],
  moerdijk: [4.62, 51.7],
  breda: [4.78, 51.595],
  maastricht: [5.7, 50.85],
  aachen: [6.09, 50.77],
  hasselt: [5.338, 50.931],
  zutphen: [6.195, 52.14],
  deventer: [6.16, 52.255],
  zwolle: [6.09, 52.505],
  hengelo: [6.795, 52.262],
  enschede: [6.89, 52.222],
  tilburg: [5.08, 51.56],
  boxtel: [5.32, 51.59],
  eindhoven: [5.48, 51.443],
  helmond: [5.66, 51.48],
  venlo: [6.17, 51.37],
  roermond: [5.99, 51.195],
  sittard: [5.87, 51.0],
  harlingen: [5.42, 53.175],
  leeuwarden: [5.79, 53.2],
  groningen: [6.565, 53.212],
  denHelder: [4.76, 52.955],
  alkmaar: [4.74, 52.638],
  uitgeest: [4.71, 52.53],
  zaandam: [4.82, 52.44],
  dordrecht: [4.67, 51.81],
  culemborg: [5.23, 51.955],
  zaltbommel: [5.25, 51.81],
  denBosch: [5.29, 51.69],
  meppel: [6.19, 52.695],
  heerenveen: [5.92, 52.96],
  assen: [6.56, 52.995],
  bergenOpZoom: [4.29, 51.495],
  goes: [3.89, 51.5],
  middelburg: [3.61, 51.5],
  vlissingen: [3.6, 51.448],
  hilversum: [5.18, 52.225],
  amersfoort: [5.37, 52.155],
  nijmegen: [5.85, 51.84],
} satisfies Record<string, [number, number]>

type Town = keyof typeof T
const rail = (name: string, from: number, towns: Town[]): HistLine => ({ name, kind: 'rail', from, coords: towns.map((t) => T[t]) })

const lines: HistLine[] = [
  rail('Amsterdam–Haarlem, 1839', 1839, ['amsterdam', 'haarlem']),
  rail('Haarlem–Leiden–The Hague–Rotterdam, 1842 to 1847', 1847, ['haarlem', 'leiden', 'hague', 'delft', 'rotterdam']),
  rail('Amsterdam–Utrecht–Arnhem, 1843 to 1845', 1847, ['amsterdam', 'utrecht', 'driebergen', 'ede', 'arnhem']),
  rail('Arnhem–Emmerich, into Germany, 1856', 1856, ['arnhem', 'zevenaar', 'emmerich']),
  rail('Utrecht–Gouda–Rotterdam, 1855', 1856, ['utrecht', 'gouda', 'rotterdam']),
  rail('Antwerp–Roosendaal–Moerdijk, 1855', 1856, ['antwerp', 'roosendaal', 'moerdijk']),
  rail('Roosendaal–Breda, 1855', 1856, ['roosendaal', 'breda']),
  rail('Aachen–Maastricht, 1853', 1856, ['aachen', 'maastricht']),
  rail('Maastricht–Hasselt, 1856', 1856, ['maastricht', 'hasselt']),
  // The first state lines, built under the Railway Act of 1860.
  rail('Arnhem–Zutphen–Deventer–Zwolle, 1865 to 1866', 1866, ['arnhem', 'zutphen', 'deventer', 'zwolle']),
  rail('Zutphen–Hengelo–Enschede, 1865 to 1866', 1866, ['zutphen', 'hengelo', 'enschede']),
  rail('Breda–Tilburg–Eindhoven–Venlo, 1863 to 1866', 1866, ['breda', 'tilburg', 'boxtel', 'eindhoven', 'helmond', 'venlo']),
  rail('Venlo–Maastricht, 1865', 1866, ['venlo', 'roermond', 'sittard', 'maastricht']),
  rail('Harlingen–Leeuwarden–Groningen, 1863 to 1866', 1866, ['harlingen', 'leeuwarden', 'groningen']),
  rail('Den Helder–Alkmaar, 1865', 1866, ['denHelder', 'alkmaar']),
  rail('Rotterdam–Dordrecht–Moerdijk, with the Moerdijk bridge, 1872', 1872, ['rotterdam', 'dordrecht', 'moerdijk']),
  rail('Utrecht–Zaltbommel–’s-Hertogenbosch–Boxtel, 1868 to 1870', 1872, ['utrecht', 'culemborg', 'zaltbommel', 'denBosch', 'boxtel']),
  rail('Zwolle–Meppel–Leeuwarden, 1867 to 1868', 1872, ['zwolle', 'meppel', 'heerenveen', 'leeuwarden']),
  rail('Meppel–Assen–Groningen, 1870', 1872, ['meppel', 'assen', 'groningen']),
  rail('Haarlem–Uitgeest–Alkmaar, 1867', 1872, ['haarlem', 'uitgeest', 'alkmaar']),
  rail('Uitgeest–Zaandam, 1869', 1872, ['uitgeest', 'zaandam']),
  { name: 'The Nieuwe Waterweg, 1872', kind: 'canal', from: 1872, coords: [[4.47, 51.905], [4.3, 51.9], [4.24, 51.92], [4.12, 51.98]] },
  rail('Roosendaal–Goes–Vlissingen, 1863 to 1873', 1876, ['roosendaal', 'bergenOpZoom', 'goes', 'middelburg', 'vlissingen']),
  rail('Amsterdam–Hilversum–Amersfoort, 1874', 1876, ['amsterdam', 'hilversum', 'amersfoort']),
  { name: 'The North Sea Canal, 1876', kind: 'canal', from: 1876, coords: [[4.9, 52.385], [4.82, 52.415], [4.7, 52.43], [4.6, 52.465]] },
  rail('Zaandam–Amsterdam, over the Hembrug, 1878', 1889, ['zaandam', 'amsterdam']),
  rail('Venlo–Nijmegen, 1883', 1889, ['venlo', 'nijmegen']),
]

const sites: HistSite[] = [
  { name: 'Amsterdam', kind: 'town', from: RAILS_MIN, at: [4.893, 52.37], label: 'right' },
  { name: 'Haarlem', kind: 'town', from: RAILS_MIN, at: T.haarlem, label: 'left' },
  { name: 'The Hague', kind: 'town', from: RAILS_MIN, at: T.hague, label: 'left', note: 'Seat of government and parliament' },
  { name: 'Rotterdam', kind: 'town', from: RAILS_MIN, at: T.rotterdam, label: 'right' },
  { name: 'Utrecht', kind: 'town', from: 1847, at: T.utrecht, label: 'right' },
  { name: 'Arnhem', kind: 'town', from: 1847, at: T.arnhem, label: 'right' },
  { name: 'The Cruquius', kind: 'fort', from: 1852, at: [4.638, 52.338], label: 'left', note: 'One of three steam pumping stations that drained the Haarlemmermeer, 1848 to 1852' },
  { name: 'Groningen', kind: 'town', from: 1866, at: T.groningen, label: 'right' },
  { name: 'Eindhoven', kind: 'town', from: 1866, at: T.eindhoven, label: 'right' },
  { name: 'Maastricht', kind: 'town', from: 1856, at: T.maastricht, label: 'left' },
  { name: 'IJmuiden', kind: 'fort', from: 1876, at: [4.6, 52.465], label: 'left', note: 'Locks at the mouth of the North Sea Canal, opened 1 November 1876' },
  { name: 'Hoek van Holland', kind: 'fort', from: 1872, at: [4.12, 51.98], label: 'left', note: 'Mouth of the Nieuwe Waterweg, Rotterdam’s new way to the sea' },
  { name: 'Amsterdam Centraal', kind: 'fort', from: 1889, at: [4.9, 52.379], note: 'The central station, on an island in the IJ, opened in 1889' },
  { name: 'Peace Palace', kind: 'fort', from: 1914, at: [4.296, 52.087], note: 'Opened in The Hague in 1913, for courts settling quarrels between states' },
  { name: 'Domaniale mijn, Kerkrade', kind: 'mine', from: RAILS_MIN, at: [6.06, 50.865], note: 'Coal mined here since the Middle Ages, by the monks of Rolduc' },
  { name: 'Oranje-Nassau, Heerlen', kind: 'mine', from: 1914, at: [5.98, 50.885], note: 'The first big modern colliery of Limburg, from 1899' },
  { name: 'Staatsmijn Wilhelmina', kind: 'mine', from: 1914, at: [6.025, 50.86], note: 'The first mine of the state’s own mining company, from 1906' },
  { name: 'Staatsmijn Emma, Hoensbroek', kind: 'mine', from: 1914, at: [5.925, 50.925], note: 'A state mine, from 1911' },
]

const labels: HistLabel[] = [
  { text: 'NETHERLANDS', kind: 'water', from: RAILS_MIN, at: [3.9, 52.85] },
  { text: 'BELGIUM', kind: 'people', from: RAILS_MIN, at: [4.2, 50.3] },
  { text: 'GERMANY', kind: 'people', from: RAILS_MIN, at: [7.2, 51.5] },
  { text: 'FRANCE', kind: 'people', from: RAILS_MIN, at: [3.4, 49.7] },
  { text: 'Grand Duchy', kind: 'territory', from: RAILS_MIN, to: 1889, at: [6.12, 49.95] },
  { text: 'Luxembourg', kind: 'territory', from: 1890, at: [6.12, 49.95] },
  { text: 'Haarlemmermeer', kind: 'water', from: RAILS_MIN, to: 1851, at: [4.68, 52.29] },
  { text: 'NEUTRAL', kind: 'alert', from: 1914, at: [5.6, 52.6] },
]

const events: HistEvent[] = [
  {
    from: 1839,
    title: '1839: The first train',
    text: 'On 20 September 1839 the first Dutch railway opens, from Amsterdam to Haarlem, with the locomotives De Arend and Snelheid. It is the same year the Treaty of London settles the border with Belgium, which has had trains since 1835.',
  },
  {
    from: 1847,
    title: '1847: Two lines from Amsterdam',
    text: 'The Holland line reaches Leiden in 1842, The Hague in 1843 and Rotterdam in 1847. A second company runs a line from Amsterdam to Utrecht in 1843 and on to Arnhem in 1845. Both are laid to a broad gauge, unlike their neighbours.',
  },
  {
    from: 1852,
    title: '1852: The Haarlemmermeer is dry',
    text: 'Three steam pumping stations, the Leeghwater from 1848 and the Cruquius and the Lynden from 1849, pump the lake out into a ring canal dug around it. On 1 July 1852 the lake that threatened Amsterdam, Haarlem and Leiden is dry, and its bed becomes a polder of farms.',
  },
  {
    from: 1856,
    title: '1856: Trains to Germany',
    text: 'The Rhine line is rebuilt to the standard gauge and joined to the German network at Emmerich. Lines also run from Utrecht to Rotterdam, from Antwerp to Moerdijk, and from Maastricht to Aachen and Hasselt.',
  },
  {
    from: 1866,
    title: '1866: The state builds railways',
    text: 'The Railway Act of 1860 lets the state build the lines private companies would not. Within six years state lines link Arnhem to Zwolle, Zutphen to Enschede, Breda to Venlo and Maastricht, Harlingen to Groningen, and Den Helder to Alkmaar.',
  },
  {
    from: 1872,
    title: '1872: Bridges over the great rivers',
    text: 'On 1 January the railway bridge at Moerdijk opens, then the longest bridge in Europe, and trains run from Rotterdam towards Breda and Antwerp. New bridges carry lines over the Lek, Waal and Maas to ’s-Hertogenbosch. Rotterdam gets a new way to the sea through the dunes, the Nieuwe Waterweg.',
  },
  {
    from: 1876,
    title: '1876: The North Sea Canal',
    text: 'On 1 November King William III opens the North Sea Canal, dug through the dunes at IJmuiden. Ships reach Amsterdam directly from the sea, no longer through the Zuiderzee or the North Holland Canal. Trains now run to Vlissingen, for the boats to England.',
  },
  {
    from: 1889,
    title: '1889: Amsterdam Centraal',
    text: 'Amsterdam’s central station opens on three islands built in the IJ, between the old city and its harbour, designed by Pierre Cuypers, the architect of the Rijksmuseum of 1885. Most of the network is now finished.',
  },
  {
    from: 1890,
    title: '1890: Luxembourg goes its own way',
    text: 'King William III dies on 23 November. His daughter Wilhelmina, aged ten, becomes queen, with her mother Emma as regent. Luxembourg’s law lets only a man inherit, so the grand duchy passes to Adolphe of Nassau, a distant cousin, and leaves the Dutch crown.',
  },
  {
    from: 1914,
    title: '1914: Neutral in a world war',
    text: 'War breaks out in August. The Dutch army is mobilised, and the Netherlands stays neutral. Germany invades Belgium, and about a million Belgians flee north across the border. In The Hague, the Peace Palace has been open for a year. In South Limburg, new coal mines, some of them run by the state, draw miners from all over the country and abroad.',
  },
]

export const railsStory: TimeStory = {
  place: 'the Low Countries',
  min: RAILS_MIN,
  max: RAILS_MAX,
  format: String,
  events,
  lines,
  sites,
  labels,
  areas,
  note: 'Borders are approximate and drawn with today’s provinces. Only the main railway lines are drawn, each from the first stage after it opened.',
  key: [
    { swatch: 'key-rebel', text: 'The Netherlands' },
    { swatch: 'key-belgium', text: 'Belgium' },
    { swatch: 'key-duchy', text: "Luxembourg, the Dutch king's grand duchy" },
    { swatch: 'key-rail', text: 'Railway' },
    { swatch: 'key-canal', text: 'New canal' },
    { swatch: 'key-fort', text: 'Pumping station, locks or landmark' },
    { swatch: 'key-coal', text: 'Coalfield' },
    { swatch: 'key-mine', text: 'Coal mine' },
  ],
}
