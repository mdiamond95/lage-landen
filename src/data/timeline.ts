// Shared by the time maps: items that exist between two years, and one caption per stage.

export type HistEvent = { from: number; title: string; text: string }

// An item can drop out for a while (a trade ban, say): `off` lists those gaps.
export type Dated = { from: number; to?: number; off?: [number, number][] }

export const activeAt = (year: number, item: Dated) =>
  item.from <= year && (item.to === undefined || year <= item.to) && !item.off?.some(([a, b]) => a <= year && year <= b)

// The caption whose stage the year falls in. Each runs until the next one starts.
export const eventAt = (events: HistEvent[], year: number) => [...events].reverse().find((e) => e.from <= year) ?? events[0]

// What a year-slider map on the main Low Countries map draws: lines (frontiers,
// roads, dams), sites (forts, towns, barriers), text labels, and areas that were
// still water for a while. Coordinates are [lon, lat] (WGS84).
// A `flow` is people or goods on the move, drawn as an arrow with moving dashes.
export type LineKind = 'frontier' | 'road' | 'canal' | 'dam' | 'barrier' | 'flow'
export type HistLine = Dated & { name: string; kind: LineKind; coords: [number, number][] }
export type HistSite = Dated & {
  name: string
  // Shown on hover, e.g. the modern name of a Roman fort.
  note?: string
  kind: 'fort' | 'town' | 'barrier' | 'battle'
  at: [number, number]
  label?: 'left' | 'right'
}
export type HistLabel = Dated & { text: string; at: [number, number]; kind?: 'people' | 'water' | 'land' | 'alert' | 'territory' }
// A stretch of land tinted while it is active: countries or provinces from the map
// data (optionally cut to the `clip` polygon), or a hand-drawn `shape`. `kind` sets
// the tint: still sea (the default), lands of a ruler, lands under a ruler's bishop,
// plain land that stays outside, lands held by rebels against the ruler, or lands
// split or fought over between the two.
export type AreaKind = 'sea' | 'ruled' | 'client' | 'outside' | 'rebel' | 'contested'
export type HistArea = Dated & {
  name: string
  kind?: AreaKind
  regions?: string[]
  clip?: [number, number][]
  shape?: [number, number][]
}

export type TimeStory = {
  // Named in the map's accessible label: "Map of <place> in <year>".
  place: string
  // Two corners, [lon, lat], to zoom the map to; the whole Low Countries if left out.
  bounds?: [[number, number], [number, number]]
  min: number
  max: number
  format: (year: number) => string
  events: HistEvent[]
  lines: HistLine[]
  sites: HistSite[]
  labels: HistLabel[]
  areas?: HistArea[]
  // A note under the key, e.g. that borders are approximate.
  note?: string
  // The map key under the slider: a swatch class from styles.css and its text.
  key: { swatch: string; text: string }[]
  // How land that changed hands in the stage on screen stands out: filled with a
  // highlight (the default, for lands joining a ruler), or outlined, keeping its
  // colour (for lands changing sides in a war).
  fresh?: 'fill' | 'outline'
}
