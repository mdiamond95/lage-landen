// The revolt map for Unit 5: the Seventeen Provinces splitting between the king of
// Spain and the rebel States, 1555 to 1648, frame by frame, and the refugees who went
// north after Antwerp fell. As on the Burgundian map, each land is drawn with the
// modern provinces closest to it, and a province where both sides held towns for
// years is hatched. The map shows who held roughly what, not every town or siege.
// Coordinates are [lon, lat] (WGS84).

import { artois, frenchFlanders, limburgDuchy } from './burgundy'
import type { AreaKind, HistArea, HistEvent, HistLabel, HistLine, HistSite, TimeStory } from './timeline'

export const REVOLT_MIN = 1555
export const REVOLT_MAX = 1648

// Zeeland's islands and Zeelandic Flanders, cut apart along the Western Scheldt.
const scheldtCut: [number, number][] = [
  [3.2, 51.395], [3.45, 51.405], [3.54, 51.435], [3.62, 51.415], [3.72, 51.4], [3.8, 51.375], [3.9, 51.375],
  [3.97, 51.425], [4.04, 51.415], [4.1, 51.39], [4.2, 51.395], [4.232, 51.39], [4.24, 51.36],
]
const zeelandIslands: [number, number][] = [...scheldtCut, [4.24, 51.3], [4.4, 51.3], [4.4, 51.9], [3.2, 51.9]]
const zeelandicFlanders: [number, number][] = [...scheldtCut, [4.24, 51.2], [3.2, 51.2]]

// One land's sides over time: each kind holds from its year until the next change.
const sides = (
  name: string,
  regions: string[],
  changes: [number, AreaKind][],
  clip?: [number, number][],
): HistArea[] =>
  changes.map(([from, kind], i) => {
    const next = changes[i + 1]?.[0]
    return { name: `${name} from ${from}`, kind, from, to: next === undefined ? undefined : next - 1, regions, clip }
  })

const FLANDERS = ['BE-VWV', 'BE-VOV']
const BRABANT = ['BE-VAN', 'BE-VBR', 'BE-WBR', 'BE-BRU']

// Everything starts as the king's (the Burgundian tint). Later entries draw on top.
const areas: HistArea[] = [
  { name: 'Still sea', kind: 'sea', from: REVOLT_MIN, regions: ['NL-FL'] },
  ...sides('Holland', ['NL-NH', 'NL-ZH'], [[1555, 'ruled'], [1572, 'rebel']]),
  ...sides('Zeeland', ['NL-ZE'], [[1555, 'ruled'], [1572, 'rebel']], zeelandIslands),
  ...sides('Utrecht and Friesland', ['NL-UT', 'NL-FR'], [[1555, 'ruled'], [1576, 'rebel']]),
  ...sides('Guelders', ['NL-GE'], [[1555, 'ruled'], [1576, 'rebel'], [1585, 'contested'], [1591, 'rebel']]),
  ...sides('Overijssel', ['NL-OV'], [[1555, 'ruled'], [1576, 'rebel'], [1580, 'contested'], [1591, 'rebel']]),
  ...sides('Groningen and Drenthe', ['NL-GR', 'NL-DR'], [[1555, 'ruled'], [1576, 'rebel'], [1580, 'ruled'], [1594, 'rebel']]),
  ...sides('North Brabant', ['NL-NB'], [
    [1555, 'ruled'], [1576, 'rebel'], [1579, 'contested'], [1585, 'ruled'], [1590, 'contested'], [1625, 'ruled'],
    [1629, 'contested'], [1637, 'rebel'],
  ]),
  ...sides('Upper Guelders and Maastricht', ['NL-LI'], [[1555, 'ruled'], [1576, 'rebel'], [1579, 'ruled'], [1632, 'contested']]),
  ...sides('Limburg', ['BE-WLG'], [[1555, 'ruled'], [1576, 'rebel'], [1579, 'ruled']], limburgDuchy),
  ...sides('Flanders', FLANDERS, [[1555, 'ruled'], [1576, 'rebel'], [1584, 'ruled']]),
  ...sides('Zeelandic Flanders', ['NL-ZE'], [[1555, 'ruled'], [1576, 'rebel'], [1584, 'ruled'], [1645, 'rebel']], zeelandicFlanders),
  ...sides('Brabant', BRABANT, [[1555, 'ruled'], [1576, 'rebel'], [1585, 'ruled']]),
  ...sides('Walloon Flanders', ['FRA'], [[1555, 'ruled'], [1576, 'rebel'], [1579, 'ruled']], frenchFlanders),
  ...sides('Artois', ['FRA'], [[1555, 'ruled'], [1576, 'rebel'], [1579, 'ruled']], artois),
  ...sides('Hainaut', ['BE-WHT'], [[1555, 'ruled'], [1576, 'rebel'], [1579, 'ruled']]),
  ...sides('Namur', ['BE-WNA'], [[1555, 'ruled'], [1576, 'rebel'], [1577, 'ruled']]),
  { name: 'Luxembourg', kind: 'ruled', from: REVOLT_MIN, regions: ['LUX', 'BE-WLX'] },
]

// Refugees leaving the south once Antwerp fell, mostly in the years up to the truce.
const flows: HistLine[] = [
  { name: 'Antwerp to Amsterdam', kind: 'flow', from: 1585, to: 1608, coords: [[4.402, 51.219], [4.5, 51.62], [4.62, 52.0], [4.85, 52.33]] },
  { name: 'Antwerp to Middelburg', kind: 'flow', from: 1585, to: 1608, coords: [[4.402, 51.219], [4.0, 51.4], [3.66, 51.48]] },
  { name: 'Antwerp to Haarlem', kind: 'flow', from: 1585, to: 1608, coords: [[4.36, 51.25], [4.25, 51.7], [4.4, 52.05], [4.6, 52.35]] },
  { name: 'Flanders to Leiden', kind: 'flow', from: 1585, to: 1608, coords: [[3.717, 51.054], [3.95, 51.6], [4.3, 51.95], [4.46, 52.13]] },
]

const lines: HistLine[] = [
  ...flows,
  // The rebel fleet shut the Scheldt below Antwerp from 1585; the peace of 1648 kept it shut.
  { name: 'The Scheldt closed by the Dutch', kind: 'barrier', from: 1585, coords: [[4.2, 51.36], [4.33, 51.33]] },
]

const sites: HistSite[] = [
  { name: 'Brussels', kind: 'town', from: REVOLT_MIN, at: [4.357, 50.847], label: 'right' },
  { name: 'Antwerp', kind: 'town', from: REVOLT_MIN, at: [4.402, 51.219], label: 'right' },
  { name: 'Amsterdam', kind: 'town', from: REVOLT_MIN, at: [4.893, 52.373], label: 'right' },
  { name: 'Steenvoorde', kind: 'battle', from: 1566, to: 1566, at: [2.583, 50.81], label: 'right', note: 'The Iconoclastic Fury begins, 10 August 1566' },
  { name: 'Heiligerlee', kind: 'battle', from: 1568, to: 1571, at: [7.02, 53.155], label: 'left', note: 'First battle of the revolt, 23 May 1568' },
  { name: 'Brielle', kind: 'battle', from: 1572, to: 1573, at: [4.163, 51.902], label: 'left', note: 'Taken by the Sea Beggars, 1 April 1572' },
  { name: 'Leiden', kind: 'battle', from: 1574, to: 1575, at: [4.49, 52.16], label: 'left', note: 'Relieved, 3 October 1574' },
  { name: 'Maastricht', kind: 'battle', from: 1579, to: 1579, at: [5.691, 50.851], label: 'right', note: 'Taken by Parma, 1579' },
  { name: 'Delft', kind: 'battle', from: 1584, to: 1584, at: [4.357, 52.012], label: 'left', note: 'William of Orange murdered, 10 July 1584' },
  { name: 'Breda', kind: 'battle', from: 1590, to: 1590, at: [4.776, 51.589], label: 'right', note: 'Taken with the peat barge, 1590' },
  { name: 'Nieuwpoort', kind: 'battle', from: 1600, to: 1603, at: [2.751, 51.13], label: 'right', note: 'Battle of the Dunes, 2 July 1600' },
  { name: 'Ostend', kind: 'battle', from: 1604, to: 1608, at: [2.918, 51.226], label: 'right', note: 'Falls after a siege of three years, 1604' },
  { name: 'Breda', kind: 'battle', from: 1625, to: 1628, at: [4.776, 51.589], label: 'right', note: 'Surrenders to Spínola, 1625' },
  { name: "'s-Hertogenbosch", kind: 'battle', from: 1629, to: 1631, at: [5.304, 51.689], label: 'right', note: 'Taken by Frederick Henry, 1629' },
  { name: 'Maastricht', kind: 'battle', from: 1632, to: 1636, at: [5.691, 50.851], label: 'right', note: 'Taken by Frederick Henry, 1632' },
  { name: 'Breda', kind: 'battle', from: 1637, to: 1644, at: [4.776, 51.589], label: 'right', note: 'Retaken by Frederick Henry, 1637' },
  { name: 'Hulst', kind: 'battle', from: 1645, to: 1647, at: [4.053, 51.28], label: 'left', note: 'Taken by Frederick Henry, 1645' },
]

const labels: HistLabel[] = [
  { text: 'FRANCE', kind: 'people', from: REVOLT_MIN, at: [3.4, 49.7] },
  { text: 'EMPIRE', kind: 'people', from: REVOLT_MIN, at: [7.0, 51.35] },
  { text: 'Liège', kind: 'territory', from: REVOLT_MIN, at: [5.45, 50.45] },
  { text: 'ICONOCLASTIC FURY', kind: 'alert', from: 1566, to: 1566, at: [3.6, 50.95] },
  { text: 'UNION OF UTRECHT', kind: 'water', from: 1579, to: 1587, at: [3.9, 52.85] },
  { text: 'DUTCH REPUBLIC', kind: 'water', from: 1588, at: [3.9, 52.85] },
  { text: 'SPANISH NETHERLANDS', kind: 'people', from: 1585, at: [4.2, 50.3] },
  { text: "TWELVE YEARS' TRUCE", kind: 'alert', from: 1609, to: 1620, at: [3.3, 52.35] },
  { text: 'PEACE OF MÜNSTER', kind: 'alert', from: 1648, at: [3.3, 52.35] },
]

const events: HistEvent[] = [
  {
    from: 1555,
    title: '1555: Philip II takes over',
    text: 'Charles V hands the Seventeen Provinces to his son Philip, who also becomes king of Spain. Philip leaves in 1559 and never comes back.',
  },
  {
    from: 1566,
    title: '1566: The Iconoclastic Fury',
    text: 'After open-air Protestant sermons, crowds smash statues and paintings in churches, starting at Steenvoorde in Flanders on 10 August and spreading north.',
  },
  {
    from: 1567,
    title: '1567: Alba arrives',
    text: 'Philip sends the Duke of Alba with an army to punish the rebels. His Council of Troubles condemns thousands, and William of Orange flees to Germany.',
  },
  {
    from: 1568,
    title: '1568: The war begins',
    text: 'Orange\'s brothers invade and win at Heiligerlee in Groningen on 23 May. Two weeks later Alba has the counts of Egmont and Horne beheaded in Brussels.',
  },
  {
    from: 1572,
    title: '1572: The Sea Beggars take Brielle',
    text: 'Rebel privateers seize the port of Brielle on 1 April. Town after town in Holland and Zeeland goes over to William of Orange.',
  },
  {
    from: 1574,
    title: '1574: Leiden holds out',
    text: 'The rebels break the dikes and sail a fleet over the flooded land to relieve Leiden on 3 October.',
  },
  {
    from: 1576,
    title: '1576: The Spanish Fury',
    text: 'Unpaid Spanish soldiers sack Antwerp. Days later, in the Pacification of Ghent, nearly every province joins Holland and Zeeland against the king\'s troops.',
  },
  {
    from: 1577,
    title: '1577: The king strikes back',
    text: 'Philip\'s new governor, his half-brother Don John, seizes Namur. The south is split between Catholics and Calvinists.',
  },
  {
    from: 1579,
    title: '1579: Two unions',
    text: 'In January the Catholic south-west makes peace with the king in the Union of Arras, and the north joins the Union of Utrecht. Parma takes Maastricht.',
  },
  {
    from: 1580,
    title: '1580: Groningen changes sides',
    text: 'The stadtholder of the north-east, Count Rennenberg, goes over to the king, and Groningen with him.',
  },
  {
    from: 1581,
    title: '1581: Philip is deposed',
    text: 'With the Act of Abjuration, the States General declare that Philip is no longer their ruler.',
  },
  {
    from: 1584,
    title: '1584: Flanders falls',
    text: 'Parma takes Ypres, Bruges and Ghent. On 10 July William of Orange is shot dead in his house in Delft.',
  },
  {
    from: 1585,
    title: '1585: Antwerp falls',
    text: 'Brussels, Mechelen and finally Antwerp surrender. Protestants must leave, and tens of thousands go north. The rebels close the Scheldt.',
  },
  {
    from: 1588,
    title: '1588: A republic',
    text: 'After trying princes from France and England, the seven northern provinces rule themselves as the Republic. Spain\'s Armada fails.',
  },
  {
    from: 1590,
    title: '1590: The peat barge of Breda',
    text: 'Dutch soldiers hidden under peat in a barge slip into Breda and take it. Maurice of Nassau starts to win back towns.',
  },
  {
    from: 1591,
    title: '1591: Maurice on the march',
    text: 'In one year Maurice takes Zutphen, Deventer and Nijmegen.',
  },
  {
    from: 1594,
    title: '1594: Groningen',
    text: 'Groningen surrenders to Maurice. The Republic now holds the whole north.',
  },
  {
    from: 1600,
    title: '1600: Battle of Nieuwpoort',
    text: 'Maurice beats a Spanish army on the beach near Nieuwpoort, but he cannot win back Flanders.',
  },
  {
    from: 1604,
    title: '1604: Ostend falls',
    text: 'After a siege of more than three years, the last rebel town in Flanders surrenders.',
  },
  {
    from: 1609,
    title: "1609: The Twelve Years' Truce",
    text: 'Exhausted, Spain and the Republic agree to stop fighting for twelve years. The front line freezes.',
  },
  {
    from: 1621,
    title: '1621: War again',
    text: 'The truce runs out and the fighting starts again.',
  },
  {
    from: 1625,
    title: '1625: Breda surrenders',
    text: 'The Spanish general Ambrogio Spínola takes Breda after a long siege.',
  },
  {
    from: 1629,
    title: "1629: 's-Hertogenbosch",
    text: "Frederick Henry, Maurice's half-brother, takes 's-Hertogenbosch.",
  },
  {
    from: 1632,
    title: '1632: Along the Maas',
    text: 'Frederick Henry sails up the Maas and takes Venlo, Roermond and Maastricht. Spain wins back Venlo and Roermond in 1637.',
  },
  {
    from: 1637,
    title: '1637: Breda again',
    text: 'Frederick Henry retakes Breda, this time for good.',
  },
  {
    from: 1645,
    title: '1645: Hulst',
    text: 'Frederick Henry takes Hulst, after Sas van Gent the year before. The Republic now holds the south bank of the Western Scheldt.',
  },
  {
    from: 1648,
    title: '1648: The Peace of Münster',
    text: 'Spain recognises the Republic as a free country. The line between the two is roughly the border between the Netherlands and Belgium today.',
  },
]

export const revoltStory: TimeStory = {
  place: 'the Low Countries',
  min: REVOLT_MIN,
  max: REVOLT_MAX,
  format: String,
  events,
  lines,
  sites,
  labels,
  areas,
  fresh: 'outline',
  note: 'Borders are approximate and drawn with today\'s provinces. The prince-bishopric of Liège stayed out of the war.',
  key: [
    { swatch: 'key-ruled', text: 'The king of Spain' },
    { swatch: 'key-rebel', text: 'The rebels, then the Republic' },
    { swatch: 'key-contested', text: 'Split or fought over' },
    { swatch: 'key-flash', text: 'Just changed sides' },
    { swatch: 'key-flow', text: 'Refugees' },
    { swatch: 'key-battle', text: 'Battle or siege' },
  ],
}
