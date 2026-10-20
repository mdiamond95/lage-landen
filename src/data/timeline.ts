// Shared by the time maps: items that exist between two years, and one caption per stage.

export type HistEvent = {
  from: number
  title: string
  text: string
  // The time map through all eras changes its key and highlight with the era.
  key?: TimeStory['key']
  fresh?: TimeStory['fresh']
}

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
// A `wall` is a town wall, on the city map.
export type LineKind = 'frontier' | 'road' | 'canal' | 'dam' | 'barrier' | 'flow' | 'wall'
// On the world map, flows are ships: to and from Asia, across the Atlantic, or
// carrying enslaved Africans. Without a tone a flow is people on the move (refugees).
export type FlowTone = 'asia' | 'atlantic' | 'enslaved'
// Lines and sites that have gone stay on the map, faded. `end` removes them
// altogether after that year, when one map runs on into a later era.
export type HistLine = Dated & { name: string; kind: LineKind; coords: [number, number][]; end?: number; tone?: FlowTone }
export type HistSite = Dated & {
  name: string
  // Shown on hover, e.g. the modern name of a Roman fort.
  note?: string
  // `voc` and `wic` are the trading posts and forts of the two companies, on the world map.
  kind: 'fort' | 'town' | 'barrier' | 'battle' | 'voc' | 'wic'
  at: [number, number]
  label?: 'left' | 'right'
  end?: number
}
export type HistLabel = Dated & { text: string; at: [number, number]; kind?: 'people' | 'water' | 'land' | 'alert' | 'territory' }
// A stretch of land tinted while it is active: countries or provinces from the map
// data (optionally cut to the `clip` polygon), or a hand-drawn `shape`. `kind` sets
// the tint: still sea (the default), lands of a ruler, lands under a ruler's bishop,
// plain land that stays outside, lands held by rebels against the ruler, or lands
// split or fought over between the two, or taken by France; lands of the emperor in
// Vienna, or a state run under France; on the city map, a town inside its walls.
export type AreaKind = 'sea' | 'ruled' | 'client' | 'outside' | 'rebel' | 'contested' | 'city' | 'france' | 'austria' | 'sister'
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
  // What the map is drawn on: the Low Countries (the default), the canals of
  // Amsterdam, or the world.
  base?: 'lowlands' | 'amsterdam' | 'world'
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
