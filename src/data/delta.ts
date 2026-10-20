// The map for Unit 12: the southwest delta from the flood of 1953 to the last of the
// Delta Works in 1997, drawn close up on its own base (`base: 'delta'`), with the sea
// arms open until each dam closes them. The land flooded in 1953 follows the Delta
// Commission's map, roughly: each stretch is a province cut by a `clip` polygon, so
// it keeps to the coast. Coordinates are [lon, lat] (WGS84).

import type { HistArea, HistEvent, HistLabel, HistLine, HistSite, TimeStory } from './timeline'

export const DELTA_MIN = 1952
export const DELTA_MAX = 1997

const FLOOD = 1953

// What the sea flooded in the night of 31 January 1953, and the days after.
const schouwenDuiveland: [number, number][] = [[3.8, 51.62], [4.16, 51.62], [4.16, 51.78], [3.84, 51.78], [3.82, 51.73], [3.79, 51.69], [3.81, 51.66]]
const overflakkee: [number, number][] = [
  [3.97, 51.66], [3.97, 51.815], [4.05, 51.832], [4.17, 51.785], [4.3, 51.738], [4.42, 51.705], [4.42, 51.66],
]
const tholen: [number, number][] = [[4.0, 51.5], [4.27, 51.5], [4.27, 51.672], [4.0, 51.672]]
const eastBeveland: [number, number][] = [[3.98, 51.405], [4.24, 51.405], [4.24, 51.47], [4.15, 51.49], [4.08, 51.475], [4.02, 51.48], [3.98, 51.46]]
const westBrabant: [number, number][] = [
  [4.2, 51.55], [4.3, 51.56], [4.38, 51.6], [4.45, 51.6], [4.52, 51.62], [4.6, 51.64], [4.66, 51.67], [4.68, 51.7], [4.66, 51.725], [4.2, 51.725],
]
const dordrecht: [number, number][] = [[4.5, 51.69], [4.62, 51.69], [4.72, 51.71], [4.8, 51.72], [4.86, 51.75], [4.84, 51.79], [4.66, 51.83], [4.5, 51.765]]

const flooded = (name: string, regions: string[], clip: [number, number][]): HistArea => ({
  name,
  kind: 'flooded',
  from: FLOOD,
  // The stage of the flood lasts until the Delta Act of 1958.
  to: 1957,
  regions,
  clip,
})

const areas: HistArea[] = [
  flooded('Schouwen-Duiveland, flooded', ['NL-ZE'], schouwenDuiveland),
  flooded('Goeree-Overflakkee, flooded', ['NL-ZH'], overflakkee),
  flooded('Tholen and Sint Philipsland, flooded', ['NL-ZE'], tholen),
  flooded('East Zuid-Beveland, flooded', ['NL-ZE'], eastBeveland),
  flooded('West Brabant, flooded', ['NL-NB'], westBrabant),
  flooded('The Hoeksche Waard and Dordrecht, flooded', ['NL-ZH'], dordrecht),
]

const lines: HistLine[] = [
  { name: 'Zandkreekdam', kind: 'dam', from: 1960, coords: [[3.855, 51.553], [3.878, 51.541]] },
  { name: 'Veerse Gatdam', kind: 'dam', from: 1961, coords: [[3.62, 51.585], [3.655, 51.597]] },
  { name: 'Grevelingendam', kind: 'dam', from: 1965, coords: [[4.097, 51.676], [4.13, 51.686], [4.16, 51.692]] },
  { name: 'Volkerakdam', kind: 'dam', from: 1969, coords: [[4.408, 51.727], [4.397, 51.69]] },
  { name: 'Haringvlietdam, with its sluices', kind: 'dam', from: 1971, coords: [[4.035, 51.826], [4.064, 51.856]] },
  { name: 'Brouwersdam', kind: 'dam', from: 1971, coords: [[3.872, 51.787], [3.826, 51.742]] },
  { name: 'Oosterscheldekering', kind: 'barrier', from: 1986, coords: [[3.727, 51.676], [3.7, 51.632], [3.681, 51.6]] },
  { name: 'Oesterdam', kind: 'dam', from: 1987, coords: [[4.212, 51.515], [4.222, 51.48], [4.235, 51.45]] },
  { name: 'Philipsdam', kind: 'dam', from: 1987, coords: [[4.15, 51.689], [4.165, 51.664]] },
]

const sites: HistSite[] = [
  { name: 'Ouwerkerk', kind: 'breach', from: FLOOD, to: 1957, at: [3.99, 51.62], label: 'left', note: 'The last breach, closed with four caissons on 6 November 1953' },
  { name: 'Nieuwerkerk', kind: 'breach', from: FLOOD, to: 1957, at: [4.62, 51.97], label: 'left', note: 'A river ship, De Twee Gebroeders, was sailed into the breach in the dike of the Hollandse IJssel' },
  { name: 'Oude-Tonge', kind: 'breach', from: FLOOD, to: 1957, at: [4.21, 51.69], label: 'right', note: 'Under two to three metres of water within half an hour' },
  { name: 'Kruiningen', kind: 'breach', from: FLOOD, to: 1957, at: [4.03, 51.45], label: 'left', note: 'Visited by Queen Juliana after the flood' },
  { name: 'Hollandse IJssel barrier', kind: 'barrier', from: 1958, at: [4.58, 51.92], label: 'left', note: 'The first of the Delta Works, guarding the lowest land in the country' },
  { name: 'Maeslantkering', kind: 'barrier', from: 1997, at: [4.16, 51.95], label: 'left', note: 'Two swinging gates on the Nieuwe Waterweg, opened 10 May 1997' },
  { name: 'Hartelkering', kind: 'barrier', from: 1997, at: [4.31, 51.87], label: 'right', note: 'A barrier on the Hartelkanaal, finished with the Maeslantkering in 1997' },
]

const labels: HistLabel[] = [
  { text: 'NORTH SEA', kind: 'water', from: DELTA_MIN, at: [3.55, 51.8] },
  { text: 'WESTERSCHELDE', kind: 'water', from: DELTA_MIN, at: [3.72, 51.43] },
  { text: 'OOSTERSCHELDE', kind: 'water', from: DELTA_MIN, at: [3.84, 51.585] },
  { text: 'GREVELINGEN', kind: 'water', from: DELTA_MIN, at: [3.94, 51.757] },
  { text: 'HARINGVLIET', kind: 'water', from: DELTA_MIN, at: [4.17, 51.81] },
  { text: 'FLOODED', kind: 'alert', from: FLOOD, to: 1957, at: [4.42, 51.62] },
  { text: 'Schouwen-Duiveland', kind: 'land', from: DELTA_MIN, at: [3.86, 51.69] },
  { text: 'Goeree-Overflakkee', kind: 'land', from: DELTA_MIN, at: [4.17, 51.74] },
  { text: 'Tholen', kind: 'land', from: DELTA_MIN, at: [4.12, 51.555] },
  { text: 'Walcheren', kind: 'land', from: DELTA_MIN, at: [3.55, 51.53] },
  { text: 'Zuid-Beveland', kind: 'land', from: DELTA_MIN, at: [3.9, 51.49] },
]

const events: HistEvent[] = [
  {
    from: DELTA_MIN,
    title: '1952: Open to the sea',
    text: "Zeeland and South Holland are islands between wide sea arms. Their dikes are old, and many are too low. Since the 1930s the engineer Johan van Veen has warned that a great storm could break them.",
  },
  {
    from: FLOOD,
    title: '1953: The flood',
    text: 'In the night of 31 January a storm surge breaks the dikes, in Zeeland alone in 67 places. 1,836 people drown, and about 70,000 are evacuated. The last breach, at Ouwerkerk, is closed only on 6 November.',
  },
  {
    from: 1958,
    title: '1958: The Delta Act',
    text: 'Parliament passes the Delta Act: shorten the coast by damming the sea arms. A storm barrier on the Hollandse IJssel already guards the lowest land in the country.',
  },
  { from: 1960, title: '1960: The Zandkreekdam', text: 'The first dam in a sea arm, between Noord-Beveland and Zuid-Beveland.' },
  { from: 1961, title: '1961: The Veerse Gat', text: 'The first sea arm is shut off from the North Sea, between Walcheren and Noord-Beveland. Behind the dam, the Veerse Meer becomes a lake.' },
  { from: 1965, title: '1965: The Grevelingendam', text: 'A dam across the back of the Grevelingen joins Duiveland to Overflakkee.' },
  { from: 1969, title: '1969: The Volkerakdam', text: 'The Volkerak is dammed, linking Overflakkee, the Hoeksche Waard and Brabant.' },
  {
    from: 1971,
    title: '1971: Haringvliet and Brouwersdam',
    text: 'Two more sea arms are closed. The Haringvlietdam has 17 sluices that let the water of the Rhine and Maas out to sea, and the Brouwersdam turns the Grevelingen into a salt lake.',
  },
  {
    from: 1986,
    title: '1986: The Oosterschelde barrier',
    text: 'After fishermen and nature groups protested, the Oosterschelde gets a barrier with 62 gates that stay open for the tide and close in storms. On 4 October Queen Beatrix opens it.',
  },
  { from: 1987, title: '1987: Oesterdam and Philipsdam', text: 'Two dams at the back of the Oosterschelde split off the fresh water of the Volkerak and the Zoom, so the Oosterschelde stays salt and tidal.' },
  {
    from: DELTA_MAX,
    title: "1997: Rotterdam's gates",
    text: "The Maeslantkering, two swinging gates each 210 metres long, guards the Nieuwe Waterweg to Rotterdam. The Delta Works are complete, 44 years after the flood.",
  },
]

export const deltaStory: TimeStory = {
  place: 'the southwest delta',
  base: 'delta',
  bounds: [
    [3.35, 51.3],
    [4.75, 52.0],
  ],
  min: DELTA_MIN,
  max: DELTA_MAX,
  format: String,
  events,
  lines,
  sites,
  labels,
  areas,
  note: 'The flooded land is approximate, after the map of the Delta Commission. Land drawn from CBS / PDOK (CC BY 4.0) and Natural Earth.',
  key: [
    { swatch: 'key-flooded', text: 'Flooded in 1953' },
    { swatch: 'key-breach', text: 'Dike breach' },
    { swatch: 'key-dam', text: 'Dam' },
    { swatch: 'key-barrier', text: 'Storm barrier' },
  ],
}
