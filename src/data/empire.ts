// The world map for Unit 7: the trading posts, forts and colonies of the VOC (to
// Asia) and the WIC (to Africa and the Americas), and the ships between them,
// 1602 to 1863. Coordinates are [lon, lat] (WGS84). Sea routes go through a few
// points to keep them at sea; they show the direction of travel and the winds
// ships used, not exact courses. Ships carrying enslaved Africans have a colour of
// their own, so the slave trade is not hidden among the other trade.

import type { HistArea, HistEvent, HistLabel, HistLine, HistSite, TimeStory } from './timeline'

const P = {
  texel: [4.75, 53.05],
  amsterdam: [4.9, 52.37],
  channel: [2.4, 51.15],
  brittany: [-6, 49.3],
  cape: [18.42, -33.92],
  batavia: [106.81, -6.13],
  bantam: [106.15, -6.02],
  ambon: [128.18, -3.7],
  banda: [129.9, -4.52],
  hirado: [129.55, 33.37],
  dejima: [129.87, 32.74],
  zeelandia: [120.16, 23.0],
  malacca: [102.25, 2.19],
  galle: [80.22, 6.03],
  elmina: [-1.35, 5.08],
  newAmsterdam: [-74.01, 40.7],
  recife: [-34.88, -8.06],
  curacao: [-68.93, 12.11],
  statia: [-62.98, 17.49],
  paramaribo: [-55.17, 5.85],
  matanzas: [-81.55, 23.05],
} satisfies Record<string, [number, number]>

// Out of the North Sea, through the Channel and down the Atlantic to the Cape,
// swinging west towards Brazil to catch the winds.
const toCape: [number, number][] = [P.texel, P.channel, P.brittany, [-17, 28], [-24, 8], [-28, -12], [-18, -28], [5, -36], P.cape]
const fromRepublic: [number, number][] = [P.texel, P.channel, P.brittany]

export const empireLines: HistLine[] = [
  {
    name: 'The first route to the Indies, by Madagascar and India',
    kind: 'flow',
    tone: 'asia',
    from: 1602,
    to: 1610,
    coords: [...toCape, [30, -35], [41, -22], [55, -6], [75, -2], [95, -5], [105.6, -6.6], P.bantam],
  },
  {
    // Hendrik Brouwer's route: east on the strong westerlies of the roaring forties,
    // then north to Java. It cut the voyage from the Cape by about half.
    name: 'The Brouwer route: east on the roaring forties, then north to Java',
    kind: 'flow',
    tone: 'asia',
    from: 1611,
    coords: [...toCape, [32, -38], [60, -40], [88, -38], [104, -24], [105.6, -6.8], P.batavia],
  },
  {
    name: 'Batavia to Japan',
    kind: 'flow',
    tone: 'asia',
    from: 1619,
    to: 1858,
    coords: [P.batavia, [107.5, -3], [109, 3], [112, 10], [117, 18], [123, 26], [129.3, 32.4]],
  },
  {
    name: 'Batavia to Formosa',
    kind: 'flow',
    tone: 'asia',
    from: 1624,
    to: 1661,
    coords: [P.batavia, [108.5, 1], [113.5, 12], [119, 20.5], [120.05, 22.8]],
  },
  {
    name: 'Batavia through the Strait of Malacca to Ceylon',
    kind: 'flow',
    tone: 'asia',
    from: 1641,
    to: 1795,
    coords: [P.batavia, [104.6, -1.2], [103.2, 1.4], [100.8, 3.2], [97.5, 6.0], [89, 6.4], [80.4, 5.9]],
  },
  {
    name: 'Ships to New Netherland',
    kind: 'flow',
    tone: 'atlantic',
    from: 1624,
    to: 1663,
    coords: [...fromRepublic, [-30, 45], [-55, 42], [-73.7, 40.4]],
  },
  {
    name: 'Ships to Dutch Brazil',
    kind: 'flow',
    tone: 'atlantic',
    from: 1630,
    to: 1653,
    coords: [...fromRepublic, [-17, 27], [-26, 5], [-34.5, -7.9]],
  },
  {
    name: 'Trade goods to West Africa: cloth, guns, metal and liquor',
    kind: 'flow',
    tone: 'atlantic',
    from: 1637,
    to: 1813,
    coords: [...fromRepublic, [-15, 30], [-18, 14], [-10, 4.2], [-1.6, 4.8]],
  },
  {
    name: 'Enslaved Africans carried from the Gold Coast to Brazil',
    kind: 'flow',
    tone: 'enslaved',
    from: 1637,
    to: 1653,
    coords: [[-1.4, 4.8], [-15, -2], [-34.5, -8.2]],
  },
  {
    name: 'Enslaved Africans carried to Curaçao, many sold on to Spanish America',
    kind: 'flow',
    tone: 'enslaved',
    from: 1662,
    to: 1813,
    coords: [[-1.4, 4.8], [-22, 7], [-46, 12.5], [-62, 13.8], [-68.6, 12.0]],
  },
  {
    name: 'Enslaved Africans carried to Suriname',
    kind: 'flow',
    tone: 'enslaved',
    from: 1667,
    to: 1813,
    coords: [[-1.4, 4.8], [-25, 3.5], [-46, 5.5], [-54.9, 6.1]],
  },
  {
    name: 'Sugar, coffee and cacao to the Republic',
    kind: 'flow',
    tone: 'atlantic',
    from: 1667,
    coords: [[-55.2, 6.2], [-50, 16], [-40, 32], [-20, 45], [-6.5, 49.7], P.channel, [4.2, 52.3]],
  },
]

export const empireSites: HistSite[] = [
  { name: 'Amsterdam', kind: 'town', from: 1602, at: P.amsterdam, label: 'right', note: 'Seat of the biggest chambers of both companies' },
  { name: 'Ambon', kind: 'voc', from: 1605, to: 1795, at: P.ambon, note: 'Taken from the Portuguese in 1605; cloves' },
  { name: 'Hirado', kind: 'voc', from: 1609, to: 1640, at: P.hirado, note: 'The first Dutch post in Japan' },
  { name: 'Batavia', kind: 'voc', from: 1619, at: P.batavia, label: 'left', note: 'Today Jakarta; the VOC capital in Asia from 1619' },
  { name: 'Banda', kind: 'voc', from: 1621, at: P.banda, label: 'right', note: 'Nutmeg and mace; conquered in 1621' },
  { name: 'Fort Zeelandia', kind: 'voc', from: 1624, to: 1661, at: P.zeelandia, label: 'left', note: 'On Formosa, today Taiwan' },
  { name: 'New Amsterdam', kind: 'wic', from: 1626, to: 1663, at: P.newAmsterdam, label: 'right', note: 'On Manhattan; New York from 1664' },
  { name: 'Matanzas', kind: 'battle', from: 1628, to: 1629, at: P.matanzas, label: 'left', note: 'Piet Hein captures the Spanish silver fleet, 1628' },
  { name: 'Recife', kind: 'wic', from: 1630, to: 1653, at: P.recife, label: 'right', note: 'Capital of Dutch Brazil' },
  { name: 'Curaçao', kind: 'wic', from: 1634, at: P.curacao, label: 'left', note: 'Taken from Spain in 1634' },
  { name: 'Sint Eustatius', kind: 'wic', from: 1636, at: P.statia, note: 'A free port, the "Golden Rock"' },
  { name: 'Elmina', kind: 'wic', from: 1637, at: P.elmina, label: 'right', note: 'Taken from the Portuguese in 1637; the main Dutch fort on the Gold Coast' },
  { name: 'Galle', kind: 'voc', from: 1640, to: 1795, at: P.galle, label: 'left', note: 'On Ceylon, today Sri Lanka; cinnamon' },
  { name: 'Malacca', kind: 'voc', from: 1641, to: 1794, at: P.malacca, note: 'Taken from the Portuguese in 1641' },
  { name: 'Dejima', kind: 'voc', from: 1641, to: 1858, at: P.dejima, label: 'right', note: 'In the bay of Nagasaki' },
  { name: 'Cape of Good Hope', kind: 'voc', from: 1652, to: 1794, at: P.cape, label: 'right', note: 'A supply station, then a colony' },
  { name: 'Paramaribo', kind: 'wic', from: 1667, at: P.paramaribo, label: 'right', note: 'Capital of Suriname' },
]

export const empireLabels: HistLabel[] = [
  { text: 'Europe', kind: 'land', from: 1602, at: [22, 55] },
  { text: 'Africa', kind: 'land', from: 1602, at: [22, 8] },
  { text: 'Asia', kind: 'land', from: 1602, at: [92, 42] },
  { text: 'North America', kind: 'land', from: 1602, at: [-82, 50] },
  { text: 'South America', kind: 'land', from: 1602, at: [-60, -14] },
  { text: 'Australia', kind: 'land', from: 1602, at: [134, -25] },
  { text: 'Atlantic Ocean', kind: 'water', from: 1602, at: [-38, 24] },
  { text: 'Indian Ocean', kind: 'water', from: 1602, at: [72, -18] },
  { text: 'JAPAN', kind: 'people', from: 1602, at: [139, 38] },
]

// Rough outlines of the land the companies held, along the coasts where their
// plantations and forts were.
export const empireAreas: HistArea[] = [
  {
    name: 'New Netherland',
    kind: 'ruled',
    from: 1624,
    to: 1663,
    shape: [[-75.6, 38.8], [-73.9, 40.4], [-71.9, 41.2], [-72.5, 42.4], [-73.3, 43.3], [-74.6, 43.0], [-75.4, 41.2]],
  },
  {
    name: 'Dutch Brazil',
    kind: 'ruled',
    from: 1630,
    to: 1653,
    shape: [[-37.2, -11.2], [-34.8, -7.0], [-35.2, -5.1], [-38.5, -3.6], [-40.2, -4.6], [-38.6, -8.6]],
  },
  {
    name: 'Suriname',
    kind: 'ruled',
    from: 1667,
    shape: [[-57.1, 5.95], [-55, 6.05], [-53.98, 5.75], [-54.2, 3.2], [-55.9, 1.9], [-57, 2.5], [-58, 4.1]],
  },
]

export const EMPIRE_MIN = 1602
export const EMPIRE_MAX = 1863

export const empireEvents: HistEvent[] = [
  {
    from: 1602,
    title: '1602: The VOC is founded',
    text: 'The new East India Company sends its fleets round the Cape of Good Hope, by Madagascar and India, to the pepper port of Bantam on Java. A voyage takes the best part of a year.',
  },
  {
    from: 1605,
    title: '1605: Ambon',
    text: 'The VOC takes the Portuguese fort on Ambon, one of the spice islands where cloves grow.',
  },
  {
    from: 1609,
    title: '1609: A post in Japan',
    text: 'Two VOC ships reach Hirado in Japan, and the shogun allows the Dutch to trade there.',
  },
  {
    from: 1611,
    title: '1611: The Brouwer route',
    text: 'Hendrik Brouwer sails east from the Cape on the strong westerly winds of the roaring forties, then turns north to Java. The trip from the Cape is halved, to about six months, and the VOC soon orders all its ships to go this way.',
  },
  {
    from: 1619,
    title: '1619: Batavia',
    text: 'Jan Pieterszoon Coen destroys the Javanese port of Jayakarta and builds Batavia on its ruins. It becomes the VOC\'s capital in Asia, and ships sail on from it to Japan.',
  },
  {
    from: 1621,
    title: '1621: The WIC, and the conquest of Banda',
    text: 'The West India Company is founded for Africa and the Americas. In Asia, Coen conquers the Banda Islands to seize the nutmeg trade. Of about 15,000 Bandanese, only about 1,000 are left on the islands.',
  },
  {
    from: 1624,
    title: '1624: Formosa and New Netherland',
    text: 'The VOC builds Fort Zeelandia on Formosa, today Taiwan, to trade with China. Across the Atlantic, the WIC brings its first settlers to New Netherland, along the river Henry Hudson explored in 1609.',
  },
  {
    from: 1626,
    title: '1626: New Amsterdam',
    text: 'Peter Minuit buys the island of Manhattan from the Lenape for goods worth 60 guilders. New Amsterdam grows around a fort at its southern tip.',
  },
  {
    from: 1628,
    title: '1628: The silver fleet',
    text: 'In the bay of Matanzas on Cuba, Piet Hein captures the Spanish treasure fleet almost without a fight. The silver, gold and goods are worth about 11.5 million guilders, and the WIC pays its shareholders a dividend of 50 per cent.',
  },
  {
    from: 1630,
    title: '1630: Dutch Brazil',
    text: 'The WIC takes Recife and Olinda from the Portuguese. Sugar from Brazil\'s plantations is the prize, and it is grown by enslaved Africans.',
  },
  {
    from: 1634,
    title: '1634: Curaçao',
    text: 'The WIC takes Curaçao from Spain. The dry island has little farmland, but a fine harbour.',
  },
  {
    from: 1636,
    title: '1636: Sint Eustatius',
    text: 'Zeelanders settle the small Caribbean island of Sint Eustatius. It later grows rich as a free port.',
  },
  {
    from: 1637,
    title: '1637: Elmina, and ships of enslaved people',
    text: 'The WIC captures Elmina Castle on the Gold Coast from the Portuguese. Dutch ships now carry enslaved Africans across the Atlantic in large numbers, to the plantations of Brazil, in exchange for the cloth, guns and metal they bring to Africa.',
  },
  {
    from: 1640,
    title: '1640: Galle on Ceylon',
    text: 'The VOC takes Galle from the Portuguese, and later the cinnamon coasts of Ceylon, today Sri Lanka.',
  },
  {
    from: 1641,
    title: '1641: Malacca and Dejima',
    text: 'The VOC takes Malacca, which guards the strait between the Indian Ocean and the China Sea. In Japan, the shogun moves the Dutch to Dejima, a small island in Nagasaki Bay. For more than 200 years they are the only Europeans allowed to trade with Japan.',
  },
  {
    from: 1652,
    title: '1652: The Cape',
    text: 'Jan van Riebeeck sets up a station at the Cape to grow food for passing VOC ships. It grows into a colony on land taken from the Khoikhoi, worked by enslaved people brought from Asia and Africa.',
  },
  {
    from: 1654,
    title: '1654: Brazil is lost',
    text: 'After years of revolt by Portuguese planters, Recife surrenders. The WIC loses Brazil and its sugar.',
  },
  {
    from: 1662,
    title: '1662: Formosa lost; Curaçao, a slave market',
    text: 'The Ming general Koxinga drives the Dutch out of Formosa. In the Caribbean, Curaçao becomes a market where the WIC sells enslaved Africans on to the Spanish colonies.',
  },
  {
    from: 1664,
    title: '1664: New Amsterdam becomes New York',
    text: 'English warships sail into the harbour, and Peter Stuyvesant surrenders without a fight. The town is renamed for the Duke of York.',
  },
  {
    from: 1667,
    title: '1667: Suriname',
    text: 'A fleet from Zeeland takes Suriname from the English, and at the Peace of Breda each side keeps what it holds. Dutch ships carry enslaved Africans to its plantations, and sugar, coffee and cacao come back.',
  },
  {
    from: 1760,
    title: '1760: Peace with the Ndyuka',
    text: 'People who escaped the plantations, the Maroons, have built free villages in the rainforest and raid the plantations. After years of war the colony makes peace with the Ndyuka, and with the Saamaka two years later.',
  },
  {
    from: 1776,
    title: '1776: The first salute',
    text: 'The fort on Sint Eustatius fires a salute to a ship flying the flag of the rebel American colonies, often called the first salute to that flag by a foreign power. Statia is then one of the busiest ports in the Caribbean.',
  },
  {
    from: 1795,
    title: '1795: Britain takes the Cape',
    text: 'French armies overrun the Republic, and Britain seizes Dutch colonies to keep them from France, starting with the Cape and Malacca. On Curaçao, Tula leads a great slave revolt.',
  },
  {
    from: 1796,
    title: '1796: Ceylon and Ambon',
    text: 'British forces take Ceylon and Ambon. Ceylon never returns.',
  },
  {
    from: 1799,
    title: '1799: The end of the VOC',
    text: 'Deep in debt, the East India Company is wound up on 31 December 1799. The state takes over its debts and its lands in Asia.',
  },
  {
    from: 1814,
    title: '1814: The slave trade is banned',
    text: 'Under pressure from Britain, William I, the new ruler of the Netherlands, bans Dutch ships from the slave trade. Slavery itself goes on in the colonies.',
  },
  {
    from: 1859,
    title: '1859: Japan opens up',
    text: 'Japan opens its ports to other countries, and Dejima loses its special place.',
  },
  {
    from: 1863,
    title: '1863: Keti Koti',
    text: 'On 1 July 1863 slavery is abolished in Suriname and the Dutch Caribbean islands. In Suriname the freed people must still work on the plantations for ten more years, under state supervision.',
  },
]

export const empireStory: TimeStory = {
  place: 'Dutch trade and empire',
  base: 'world',
  min: EMPIRE_MIN,
  max: EMPIRE_MAX,
  format: String,
  events: empireEvents,
  lines: empireLines,
  sites: empireSites,
  labels: empireLabels,
  areas: empireAreas,
  note: 'Routes are simplified: ships followed the winds, not straight lines. Coastlines are today\'s. Lost posts stay on the map, greyed out.',
  key: [
    { swatch: 'key-voc', text: 'VOC post' },
    { swatch: 'key-wic', text: 'WIC post' },
    { swatch: 'key-asia', text: 'Ships to Asia' },
    { swatch: 'key-atlantic', text: 'Atlantic ships' },
    { swatch: 'key-enslaved', text: 'Ships carrying enslaved Africans' },
    { swatch: 'key-colony', text: 'Dutch colony' },
  ],
}
