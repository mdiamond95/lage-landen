// The map of how the two countries are run, for Unit 26: their provinces from the split of 1839 to
// today, and the seats of government, courts and treaties that made the Low Countries a centre of
// Europe. Holland is one province until 1840 and Brabant until 1995 (drawn `joined`, without the
// lines between their modern pieces); Flevoland's polders are water until they fall dry and a
// province from 1986; Belgium's provinces take the colour of their region from 1980, and Brussels
// its own from 1989. Coordinates are [lon, lat].

import { eastCantons } from './borders'
import type { HistArea, HistEvent, HistLabel, HistLine, HistSite, TimeStory } from './timeline'

export const STATE_MIN = 1839
export const STATE_MAX = 2026

// The three Zuiderzee polders inside Flevoland's outline, as on the water map (Unit 1).
const NOORDOOSTPOLDER: [number, number][] = [[5.2, 52.665], [5.6, 52.65], [5.7, 52.605], [6.2, 52.6], [6.2, 53.1], [5.2, 53.1]]
const EAST_FLEVOLAND: [number, number][] = [[5.2, 52.665], [5.6, 52.65], [5.7, 52.605], [6.2, 52.6], [6.2, 52.2], [5.69, 52.29], [5.59, 52.36], [5.4, 52.49], [5.3, 52.555], [5.2, 52.58]]
const SOUTH_FLEVOLAND: [number, number][] = [[5.2, 52.58], [5.3, 52.555], [5.4, 52.49], [5.59, 52.36], [5.69, 52.29], [6.2, 52.2], [6.2, 52.0], [5.0, 52.0], [5.0, 52.58]]

const DUTCH = ['NL-GR', 'NL-FR', 'NL-DR', 'NL-OV', 'NL-GE', 'NL-UT', 'NL-ZE', 'NL-NB', 'NL-LI']
const FLEMISH = ['BE-VAN', 'BE-VLI', 'BE-VOV', 'BE-VWV']
const WALLOON = ['BE-WHT', 'BE-WNA', 'BE-WLG', 'BE-WLX']

const each = (ids: string[], kind: HistArea['kind'], from: number, to?: number): HistArea[] =>
  ids.map((id) => ({ name: `${id} ${from}`, kind, from, to, regions: [id] }))

// Later entries draw on top: the polders' water over Flevoland, the East Cantons over Liège.
const areas: HistArea[] = [
  ...each(DUTCH, 'nlprov', STATE_MIN),
  { name: 'Holland', kind: 'nlprov', from: STATE_MIN, to: 1839, regions: ['NL-NH', 'NL-ZH'], joined: true },
  ...each(['NL-NH', 'NL-ZH'], 'nlprov', 1840),
  { name: 'The Zuiderzee polders', kind: 'polder', from: STATE_MIN, to: 1985, regions: ['NL-FL'] },
  { name: 'Flevoland', kind: 'nlprov', from: 1986, regions: ['NL-FL'] },
  { name: 'Noordoostpolder, still water', kind: 'sea', from: STATE_MIN, to: 1941, regions: ['NL-FL'], clip: NOORDOOSTPOLDER },
  { name: 'East Flevoland, still water', kind: 'sea', from: STATE_MIN, to: 1956, regions: ['NL-FL'], clip: EAST_FLEVOLAND },
  { name: 'South Flevoland, still water', kind: 'sea', from: STATE_MIN, to: 1967, regions: ['NL-FL'], clip: SOUTH_FLEVOLAND },
  ...each([...FLEMISH, ...WALLOON], 'beprov', STATE_MIN, 1979),
  { name: 'Brabant', kind: 'beprov', from: STATE_MIN, to: 1979, regions: ['BE-VBR', 'BE-WBR', 'BE-BRU'], joined: true },
  ...each(FLEMISH, 'flanders', 1980),
  ...each(WALLOON, 'wallonia', 1980),
  { name: 'Brabant, in Flanders', kind: 'flanders', from: 1980, to: 1994, regions: ['BE-VBR'], joined: true },
  { name: 'Brabant, in Wallonia', kind: 'wallonia', from: 1980, to: 1994, regions: ['BE-WBR'], joined: true },
  { name: 'Brabant, round Brussels', kind: 'beprov', from: 1980, to: 1988, regions: ['BE-BRU'], joined: true },
  { name: 'The Brussels-Capital Region', kind: 'capital', from: 1989, regions: ['BE-BRU'] },
  { name: 'Flemish Brabant', kind: 'flanders', from: 1995, regions: ['BE-VBR'] },
  { name: 'Walloon Brabant', kind: 'wallonia', from: 1995, regions: ['BE-WBR'] },
  { name: 'Eupen and Malmedy, German', kind: 'outside', from: STATE_MIN, to: 1919, regions: ['BE-WLG'], clip: eastCantons },
]

const sites: HistSite[] = [
  { name: 'Amsterdam', kind: 'town', from: STATE_MIN, at: [4.893, 52.373], label: 'right', note: 'Capital of the Netherlands' },
  { name: 'The Hague', kind: 'seat', from: STATE_MIN, at: [4.3, 52.08], label: 'left', note: 'Seat of the king, the cabinet and parliament' },
  { name: 'Brussels', kind: 'seat', from: STATE_MIN, at: [4.357, 50.847], label: 'left', note: 'Capital of Belgium: seat of the king, the government and parliament' },
  { name: 'Peace Palace', kind: 'court', from: 1913, at: [4.296, 52.087], note: 'The Permanent Court of Arbitration, and from 1946 the International Court of Justice' },
  { name: 'European Commission', kind: 'hq', from: 1958, at: [4.383, 50.843], note: 'The executive of the European communities, in Brussels from 1958' },
  { name: 'NATO', kind: 'hq', from: 1967, at: [4.426, 50.879], label: 'right', note: 'NATO headquarters at Evere, from 1967' },
  { name: 'Namur', kind: 'seat', from: 1986, at: [4.867, 50.467], label: 'right', note: 'Capital of Wallonia, seat of its parliament and government' },
  { name: 'Schengen', kind: 'treaty', from: 1985, at: [6.364, 49.47], label: 'left', note: 'Agreement to end checks at the borders, 14 June 1985' },
  { name: 'Maastricht', kind: 'treaty', from: 1992, at: [5.691, 50.851], label: 'right', note: 'Treaty on European Union, 7 February 1992' },
  { name: 'International Criminal Court', kind: 'court', from: 2002, at: [4.33, 52.11], note: 'In The Hague from 2002' },
  { name: 'NATO summit', kind: 'hq', from: 2025, at: [4.29, 52.06], note: 'The Hague, 24 and 25 June 2025' },
]

const labels: HistLabel[] = [
  { text: 'THE NETHERLANDS', kind: 'territory', from: STATE_MIN, at: [6.3, 52.85] },
  { text: 'BELGIUM', kind: 'territory', from: STATE_MIN, at: [3.9, 50.3] },
  { text: 'NORTH SEA', kind: 'water', from: STATE_MIN, at: [3.4, 52.4] },
  { text: 'HOLLAND', kind: 'land', from: STATE_MIN, to: 1839, at: [4.75, 52.3] },
  { text: 'BRABANT', kind: 'land', from: STATE_MIN, to: 1994, at: [4.75, 50.66] },
  { text: 'EVERY MAN MUST VOTE', kind: 'alert', from: 1893, to: 1947, at: [4.55, 50.55] },
  { text: 'EVERYONE MUST VOTE', kind: 'alert', from: 1948, at: [4.55, 50.55] },
  { text: 'EVERYONE MUST GO TO THE POLLS', kind: 'alert', from: 1917, to: 1969, at: [5.6, 52.2] },
  { text: 'BENELUX', kind: 'people', from: 1948, at: [5.25, 51.45] },
  { text: 'FLANDERS', kind: 'land', from: 1980, at: [3.9, 51.2] },
  { text: 'WALLONIA', kind: 'land', from: 1980, at: [5.45, 50.25] },
  { text: '+ BONAIRE, SINT EUSTATIUS, SABA', kind: 'land', from: 2010, at: [3.3, 53.25] },
]

const lines: HistLine[] = []

const events: HistEvent[] = [
  {
    from: 1839,
    title: '1839: Two kingdoms, nineteen provinces',
    text: 'The Treaty of London settles the split. Belgium keeps nine provinces; the Netherlands has ten, Holland still one of them. Limburg and Luxembourg are each cut in two.',
  },
  {
    from: 1840,
    title: '1840: Holland in two',
    text: 'The biggest Dutch province is split into North Holland, with Haarlem as its capital, and South Holland, with The Hague. The Netherlands has eleven provinces.',
  },
  {
    from: 1893,
    title: '1893: Every man votes, and must',
    text: 'Belgium gives every man of 25 a vote, and some men two or three more, for property or schooling. Voting is made compulsory at the same time, and still is.',
  },
  {
    from: 1913,
    title: '1913: A palace for peace',
    text: "The Peace Palace opens in The Hague, paid for by the Scottish-American steelmaker Andrew Carnegie, for the court of arbitration set up at the Hague peace conference of 1899.",
  },
  {
    from: 1917,
    title: '1917: Seats by share of the vote',
    text: 'The Dutch constitution gives every man the vote, and seats to each party by its share of the votes. Going to the polls becomes compulsory. Women get the vote in 1919.',
  },
  {
    from: 1919,
    title: '1919: One vote each',
    text: "Belgium drops the extra votes: one man, one vote. Women's turn for national elections in Belgium comes only in 1948, when voting becomes compulsory for everyone.",
  },
  {
    from: 1920,
    title: '1920: The East Cantons',
    text: 'After the First World War, Eupen, Malmedy and Sankt Vith pass from Germany to Belgium and join the province of Liège.',
  },
  {
    from: 1942,
    title: '1942: New land',
    text: 'The Noordoostpolder falls dry, in the middle of the war: the first of the three polders that will one day be Flevoland.',
  },
  {
    from: 1948,
    title: '1948: The Benelux',
    text: 'A customs union of Belgium, the Netherlands and Luxembourg, signed by their governments in exile in London in 1944, comes into force. Belgian women win the vote for parliament, and with it the duty to use it.',
  },
  {
    from: 1957,
    title: '1957: East Flevoland',
    text: 'The second polder falls dry. That year Belgium and the Netherlands sign the Treaty of Rome with France, Germany, Italy and Luxembourg.',
  },
  {
    from: 1958,
    title: '1958: Europe in Brussels',
    text: 'The European Economic Community begins, and its Commission sets up in Brussels, at first for want of a better place.',
  },
  {
    from: 1967,
    title: '1967: NATO in Brussels',
    text: "France leaves NATO's joint command, and NATO's headquarters move from Paris to Evere, on the edge of Brussels.",
  },
  {
    from: 1968,
    title: '1968: South Flevoland',
    text: 'The last polder falls dry. Almere will be built on it from 1976.',
  },
  {
    from: 1970,
    title: '1970: Two changes',
    text: "Belgium's first state reform makes three cultural communities, for its Dutch, French and German speakers. The Netherlands ends the duty to go to the polls.",
  },
  {
    from: 1980,
    title: '1980: Flanders and Wallonia',
    text: 'The second state reform makes the Flemish and Walloon Regions, each with its own parliament and government. Brabant stays one province across the line.',
  },
  {
    from: 1985,
    title: '1985: Schengen',
    text: 'On a boat on the Moselle, by the village of Schengen, the three Benelux countries, France and West Germany agree to do away with checks at their borders.',
  },
  {
    from: 1986,
    title: '1986: Flevoland and Namur',
    text: 'Flevoland becomes the twelfth Dutch province on 1 January. The Walloon Region chooses Namur as its capital.',
  },
  {
    from: 1989,
    title: '1989: The Brussels-Capital Region',
    text: 'Brussels and its nineteen municipalities get a parliament and government of their own: Belgium now has three regions.',
  },
  {
    from: 1992,
    title: '1992: Maastricht',
    text: 'Twelve countries sign the Treaty on European Union in the provincial house of Limburg in Maastricht, on 7 February. It leads to the euro.',
  },
  {
    from: 1995,
    title: '1995: Brabant in three',
    text: 'Belgium has been a federal state since 1993. Brabant is split into Flemish Brabant, Walloon Brabant and Brussels, which belongs to no province: ten provinces in all.',
  },
  {
    from: 2002,
    title: '2002: The euro, and a court',
    text: 'Euro notes and coins replace the guilder and the Belgian franc on 1 January. The International Criminal Court opens in The Hague.',
  },
  {
    from: 2010,
    title: '2010: Three islands',
    text: 'On 10 October the Netherlands Antilles are dissolved. Bonaire, Sint Eustatius and Saba become special municipalities of the Netherlands.',
  },
  {
    from: 2025,
    title: '2025: A summit in The Hague',
    text: "NATO's leaders meet in the World Forum in The Hague, with a Dutchman, Mark Rutte, as NATO's secretary general. In Flanders, mergers bring Belgium down to 565 municipalities.",
  },
  {
    from: 2026,
    title: '2026: Today',
    text: 'Twelve Dutch provinces and 342 municipalities; ten Belgian provinces, three regions, three communities. Two kings, two parliaments of 150 seats.',
  },
]

export const stateStory: TimeStory = {
  place: 'the Low Countries',
  min: STATE_MIN,
  max: STATE_MAX,
  format: String,
  events,
  lines,
  sites,
  labels,
  areas,
  note: 'Belgium’s provinces take the colour of their region from 1980.',
  key: [
    { swatch: 'key-nlprov', text: 'Dutch province' },
    { swatch: 'key-beprov', text: 'Belgian province' },
    { swatch: 'key-flanders', text: 'Flanders' },
    { swatch: 'key-wallonia', text: 'Wallonia' },
    { swatch: 'key-capital', text: 'Brussels-Capital Region' },
    { swatch: 'key-polder', text: 'New land, not yet a province' },
    { swatch: 'key-seat', text: 'Seat of government' },
    { swatch: 'key-court', text: 'International court' },
    { swatch: 'key-treaty', text: 'Treaty signed' },
    { swatch: 'key-hq', text: 'Europe and NATO' },
  ],
}
