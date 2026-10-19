// The Roman time map for Unit 2: the Rhine frontier, the main roads, forts and
// towns, each with the years it existed. Coordinates are [lon, lat] (WGS84).
// Routes are simplified and run through known Roman sites; where the exact line
// of a road is unknown, it is drawn straight between them.

export type LineKind = 'frontier' | 'road' | 'canal'
export type HistLine = { name: string; kind: LineKind; from: number; to?: number; coords: [number, number][] }
export type HistSite = { latin: string; modern: string; kind: 'fort' | 'town'; from: number; to?: number; at: [number, number]; label?: 'left' | 'right' }
export type HistLabel = { text: string; from: number; to?: number; at: [number, number] }
export type HistEvent = { from: number; title: string; text: string }

export const lineIds = ['limes', 'via-belgica', 'maas-road', 'bavay-cassel', 'reims-trier', 'trier-cologne', 'corbulo-canal'] as const
export type LineId = (typeof lineIds)[number]

export const romanLines: Record<LineId, HistLine> = {
  limes: {
    name: 'The Rhine frontier (limes)',
    kind: 'frontier',
    from: 47,
    to: 405,
    coords: [
      [4.4, 52.205], // Katwijk, where the Rhine then reached the sea
      [4.43, 52.18], // Valkenburg, Praetorium Agrippinae
      [4.51, 52.15], // Leiden-Roomburg, Matilo
      [4.66, 52.13], // Alphen aan den Rijn, Albaniana
      [4.72, 52.1], // Zwammerdam, Nigrum Pullum
      [4.88, 52.085], // Woerden, Laurium
      [5.12, 52.09], // Utrecht, Traiectum
      [5.17, 52.06], // Vechten, Fectio
      [5.34, 51.97], // Wijk bij Duurstede
      [5.57, 51.96], // Rhenen
      [5.89, 51.97], // Arnhem-Meinerswijk
      [6.1, 51.88], // Herwen, Carvium
      [6.25, 51.83],
      [6.29, 51.74], // Kalkar
      [6.45, 51.66], // Xanten, Vetera
      [6.66, 51.43], // Moers-Asberg
      [6.68, 51.33], // Krefeld-Gellep
      [6.69, 51.2], // Neuss, Novaesium
      [6.84, 51.1], // Dormagen
      [6.96, 50.94], // Cologne
      [7.1, 50.73], // Bonn
      [7.23, 50.58], // Remagen
    ],
  },
  'via-belgica': {
    name: 'The Via Belgica',
    kind: 'road',
    from: -20,
    coords: [
      [3.79, 50.3], // Bavay, Bagacum
      [4.17, 50.41],
      [4.43, 50.51], // Liberchies, Geminiacum
      [5.14, 50.63], // Braives
      [5.46, 50.78], // Tongeren
      [5.69, 50.85], // Maastricht
      [5.98, 50.89], // Heerlen, Coriovallum
      [6.36, 50.92], // Jülich, Iuliacum
      [6.96, 50.94], // Cologne
    ],
  },
  'maas-road': {
    name: 'The road along the Maas',
    kind: 'road',
    from: 1,
    coords: [
      [5.86, 51.84], // Nijmegen
      [5.88, 51.73], // Cuijk, Ceuclum
      [6.15, 51.37], // Blerick, Blariacum
      [5.9, 51.18], // Heel, Catualium
      [5.46, 50.78], // Tongeren
    ],
  },
  'bavay-cassel': {
    name: 'The road from Bavay to Cassel',
    kind: 'road',
    from: 1,
    coords: [
      [3.79, 50.3],
      [3.39, 50.61], // Tournai, Turnacum
      [2.49, 50.8], // Cassel, Castellum Menapiorum
    ],
  },
  'reims-trier': {
    name: 'The road from Reims to Trier',
    kind: 'road',
    from: 1,
    coords: [
      [4.03, 49.26], // Reims, just off the map
      [5.0, 49.5],
      [5.81, 49.68], // Arlon, Orolaunum
      [6.64, 49.75], // Trier
    ],
  },
  'trier-cologne': {
    name: 'The road from Trier to Cologne',
    kind: 'road',
    from: 1,
    coords: [
      [6.64, 49.75],
      [6.53, 49.97], // Bitburg
      [6.58, 50.34], // Jünkerath
      [6.65, 50.69], // Zülpich
      [6.96, 50.94],
    ],
  },
  'corbulo-canal': {
    name: "Corbulo's canal",
    kind: 'canal',
    from: 47,
    coords: [
      [4.51, 52.15], // Leiden
      [4.36, 52.07], // Voorburg
      [4.2, 51.95], // towards the mouth of the Maas
    ],
  },
}

export const romanSites: HistSite[] = [
  { latin: 'Noviomagus', modern: 'Nijmegen', kind: 'fort', from: -19, at: [5.86, 51.84], label: 'right' },
  { latin: 'Atuatuca', modern: 'Tongeren', kind: 'town', from: -10, at: [5.46, 50.78], label: 'right' },
  { latin: 'Traiectum ad Mosam', modern: 'Maastricht', kind: 'town', from: 1, at: [5.69, 50.85] },
  { latin: 'Coriovallum', modern: 'Heerlen', kind: 'town', from: 1, at: [5.98, 50.89] },
  { latin: 'Traiectum', modern: 'Utrecht', kind: 'fort', from: 47, to: 405, at: [5.12, 52.09], label: 'right' },
  { latin: 'Praetorium Agrippinae', modern: 'Valkenburg', kind: 'fort', from: 40, to: 405, at: [4.43, 52.18] },
  { latin: 'Laurium', modern: 'Woerden', kind: 'fort', from: 47, to: 405, at: [4.88, 52.085] },
  { latin: 'Fectio', modern: 'Vechten', kind: 'fort', from: 47, to: 405, at: [5.17, 52.06] },
  { latin: 'Forum Hadriani', modern: 'Voorburg', kind: 'town', from: 70, to: 300, at: [4.36, 52.07], label: 'left' },
  { latin: 'Vetera', modern: 'Xanten', kind: 'fort', from: -13, at: [6.45, 51.66] },
  { latin: 'Colonia', modern: 'Cologne', kind: 'town', from: -38, at: [6.96, 50.94], label: 'right' },
  { latin: 'Bagacum', modern: 'Bavay', kind: 'town', from: -20, at: [3.79, 50.3], label: 'right' },
  { latin: 'Turnacum', modern: 'Tournai', kind: 'town', from: 1, at: [3.39, 50.61] },
  { latin: 'Orolaunum', modern: 'Arlon', kind: 'town', from: 1, at: [5.81, 49.68] },
  { latin: 'Augusta Treverorum', modern: 'Trier', kind: 'town', from: -16, at: [6.64, 49.75], label: 'left' },
]

export const romanLabels: HistLabel[] = [
  { text: 'Belgae', from: -57, to: 46, at: [4.2, 50.55] },
  { text: 'Frisians', from: -57, at: [5.9, 53.1] },
  { text: 'Batavians', from: -57, to: 405, at: [5.6, 51.92] },
  { text: 'Franks', from: 260, to: 357, at: [6.7, 52.3] },
  { text: 'Salian Franks', from: 358, at: [5.15, 51.45] },
]

// One caption per stage. Each runs until the next one starts.
export const romanEvents: HistEvent[] = [
  { from: -57, title: '57 BCE: Caesar conquers the Belgae', text: 'Julius Caesar marches north and defeats the Belgic tribes, one by one, as far as the Rhine.' },
  { from: -54, title: '54 BCE: Ambiorix strikes back', text: 'The Eburones under Ambiorix wipe out a Roman legion. Caesar takes revenge by laying waste to their land.' },
  { from: -50, title: 'Gaul becomes Roman', text: 'The fighting ends. In the 20s BCE the general Agrippa starts a network of roads, among them the Via Belgica.' },
  { from: -19, title: '19 BCE: Armies on the Rhine', text: 'A legion camps at Nijmegen and Roman armies push into Germany. After losing three legions in 9 CE, Rome gives up the conquest.' },
  { from: 47, title: '47 CE: The Rhine becomes the frontier', text: 'Emperor Claudius pulls the army back behind the Rhine. Forts and watchtowers go up along the river, and Corbulo digs a canal to the Maas.' },
  { from: 69, title: '69 to 70: The Batavian revolt', text: 'Julius Civilis leads the Batavians against Rome and burns forts along the Rhine. After a year, peace is made.' },
  { from: 71, title: 'The quiet centuries', text: 'Towns grow along the roads. Nijmegen and Voorburg gain town rights, and Tongeren builds a stone wall.' },
  { from: 260, title: 'From about 260: Frankish raids', text: 'Franks and other raiders cross the Rhine. Villas burn and towns shrink behind new walls.' },
  { from: 358, title: '358: Franks inside the empire', text: 'The future emperor Julian beats the Salian Franks but lets them keep Toxandria, today Brabant and the Kempen, in return for soldiers.' },
  { from: 406, title: 'After 400: Rome pulls out', text: 'Troops leave the Rhine to defend Italy. The forts fall empty and the frontier is gone.' },
  { from: 481, title: '481: Clovis, king of the Franks', text: "Childeric's son Clovis takes over at Tournai and builds a Frankish kingdom that will cover most of Gaul." },
]

export const ROMAN_MIN = -57
export const ROMAN_MAX = 500

// There is no year 0: 1 BCE is followed by 1 CE.
export const formatYear = (y: number) => (y < 0 ? `${-y} BCE` : `${Math.max(1, y)} CE`)

export const eventAt = (year: number) => [...romanEvents].reverse().find((e) => e.from <= year) ?? romanEvents[0]

export const activeAt = (year: number, item: { from: number; to?: number }) =>
  item.from <= year && (item.to === undefined || year <= item.to)
