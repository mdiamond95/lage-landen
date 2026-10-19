// The water works map for Unit 1: the Zuiderzee closed off and drained, then the
// Delta Works after the 1953 flood. Coordinates are [lon, lat] (WGS84). Dams are
// drawn straight between their ends, and the land still under water is shaded
// with simplified shapes: the map shows what happened where, not exact coastlines.

import type { HistArea, HistEvent, HistLabel, HistLine, HistSite, TimeStory } from './timeline'

export const WATER_MIN = 1916
export const WATER_MAX = 1997

const lines: HistLine[] = [
  { name: 'Afsluitdijk', kind: 'dam', from: 1932, coords: [[5.04, 52.94], [5.2, 53.02], [5.37, 53.09]] },
  { name: 'Veerse Gatdam', kind: 'dam', from: 1961, coords: [[3.62, 51.58], [3.66, 51.59]] },
  { name: 'Haringvlietdam', kind: 'dam', from: 1971, coords: [[4.06, 51.85], [4.04, 51.82]] },
  { name: 'Brouwersdam', kind: 'dam', from: 1971, coords: [[3.87, 51.79], [3.83, 51.74]] },
  { name: 'Houtribdijk', kind: 'dam', from: 1975, coords: [[5.3, 52.7], [5.44, 52.53]] },
  { name: 'Oosterscheldekering', kind: 'barrier', from: 1986, coords: [[3.72, 51.66], [3.7, 51.63], [3.68, 51.6]] },
]

const sites: HistSite[] = [
  { name: 'Hollandse IJssel barrier', kind: 'barrier', from: 1958, at: [4.58, 51.92] },
  { name: 'Maeslantkering', kind: 'barrier', from: 1997, at: [4.16, 51.95], label: 'left' },
]

const labels: HistLabel[] = [
  { text: 'ZUIDERZEE', kind: 'water', from: WATER_MIN, to: 1931, at: [5.38, 52.78] },
  { text: 'IJSSELMEER', kind: 'water', from: 1932, at: [5.35, 52.83] },
  { text: 'MARKERMEER', kind: 'water', from: 1975, at: [5.13, 52.47] },
  { text: 'FLOODED', kind: 'alert', from: 1953, to: 1956, at: [3.95, 51.64] },
  // Each polder carries the year it fell dry.
  { text: '1930', kind: 'land', from: 1930, at: [5.02, 52.84] },
  { text: '1942', kind: 'land', from: 1942, at: [5.76, 52.72] },
  { text: '1957', kind: 'land', from: 1957, at: [5.6, 52.5] },
  { text: '1968', kind: 'land', from: 1968, at: [5.3, 52.36] },
]

// Land that was still sea. Flevoland's province shape is cut into its three
// polders; the Wieringermeer is drawn by hand.
const areas: HistArea[] = [
  {
    name: 'Wieringermeer',
    from: WATER_MIN,
    to: 1929,
    shape: [[4.88, 52.79], [4.97, 52.88], [5.05, 52.91], [5.15, 52.82], [5.09, 52.77], [4.95, 52.76]],
  },
  {
    name: 'Noordoostpolder',
    from: WATER_MIN,
    to: 1941,
    regions: ['NL-FL'],
    clip: [[5.2, 52.665], [5.6, 52.65], [5.7, 52.605], [6.2, 52.6], [6.2, 53.1], [5.2, 53.1]],
  },
  {
    name: 'East Flevoland',
    from: WATER_MIN,
    to: 1956,
    regions: ['NL-FL'],
    clip: [[5.2, 52.665], [5.6, 52.65], [5.7, 52.605], [6.2, 52.6], [6.2, 52.2], [5.69, 52.29], [5.59, 52.36], [5.4, 52.49], [5.3, 52.555], [5.2, 52.58]],
  },
  {
    name: 'South Flevoland',
    from: WATER_MIN,
    to: 1967,
    regions: ['NL-FL'],
    clip: [[5.2, 52.58], [5.3, 52.555], [5.4, 52.49], [5.59, 52.36], [5.69, 52.29], [6.2, 52.2], [6.2, 52.0], [5.0, 52.0], [5.0, 52.58]],
  },
]

const events: HistEvent[] = [
  { from: 1916, title: '1916: The Zuiderzee floods', text: 'A winter storm breaks dikes all around the Zuiderzee, a shallow arm of the North Sea in the middle of the country.' },
  { from: 1918, title: "1918: Lely's plan becomes law", text: 'Parliament passes the Zuiderzee Act: close the sea off with a dam, and drain new farmland behind it.' },
  { from: 1930, title: '1930: The first polder', text: 'The Wieringermeer falls dry, joining the old island of Wieringen to the mainland.' },
  { from: 1932, title: '1932: The Afsluitdijk', text: 'A 32 km dam closes off the Zuiderzee. The water behind it, now the IJsselmeer, slowly turns fresh.' },
  { from: 1942, title: '1942: The Noordoostpolder', text: 'The second polder falls dry during the German occupation. The fishing island of Urk ends up on dry land.' },
  { from: 1953, title: '1953: The great flood', text: 'On the night of 31 January a storm surge breaks the dikes of Zeeland and South Holland. 1,836 people die.' },
  { from: 1957, title: '1957: East Flevoland', text: 'The first half of the Flevopolder falls dry. Lelystad will be built on it.' },
  { from: 1958, title: '1958: The Delta Act', text: 'The Delta Works begin: shorten the coast by damming the sea arms of the southwest. A barrier on the Hollandse IJssel guards the lowest land first.' },
  { from: 1961, title: '1961: The Veerse Gat', text: 'The first sea arm is dammed, between Walcheren and Noord-Beveland.' },
  { from: 1968, title: '1968: South Flevoland', text: 'The second half of the Flevopolder falls dry. Almere will be built on it.' },
  { from: 1971, title: '1971: Haringvliet and Brouwersdam', text: 'Two more sea arms are closed off. Sluices in the Haringvlietdam still let the Rhine and Maas out to sea.' },
  { from: 1975, title: '1975: The Houtribdijk', text: 'A dam from Enkhuizen to Lelystad splits off the Markermeer, meant to become one more polder.' },
  { from: 1986, title: '1986: Gates for the Oosterschelde', text: 'Instead of a closed dam, the Oosterschelde gets a barrier with 62 gates that shut only in storms. Flevoland becomes a province, and the Markerwaard polder is put off, for good as it turns out.' },
  { from: 1997, title: '1997: The Maeslantkering', text: "Two huge swinging gates guard Rotterdam's waterway to the sea. The Delta Works are complete." },
]

export const waterStory: TimeStory = {
  place: 'the Netherlands',
  bounds: [
    [3.4, 51.3],
    [7.1, 53.5],
  ],
  min: WATER_MIN,
  max: WATER_MAX,
  format: String,
  events,
  lines,
  sites,
  labels,
  areas,
  key: [
    { swatch: 'key-dam', text: 'Dam' },
    { swatch: 'key-barrier', text: 'Storm barrier' },
    { swatch: 'key-sea', text: 'Still sea' },
  ],
}
