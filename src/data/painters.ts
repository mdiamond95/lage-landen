// The map for Unit 16: where the painters of the Low Countries worked, from Robert
// Campin's Tournai in 1420 to Bruegel's death in Brussels in 1569. Each painter is a
// workshop in the town where they worked, from the year they are first found there
// to the year they died or moved on; a stage begins with every change, so a painter
// who has gone fades from the map at the next stage. Art fairs and the print shop are
// markets. Dürer's trips around the Low Countries in 1520 and 1521 are drawn as one
// route, approximately. Coordinates are [lon, lat].

import type { HistEvent, HistLabel, HistLine, HistSite, TimeStory } from './timeline'

export const PAINTERS_MIN = 1420
export const PAINTERS_MAX = 1569

const T = {
  tournai: [3.389, 50.606],
  ghent: [3.717, 51.054],
  lille: [3.063, 50.637],
  bruges: [3.225, 51.209],
  brussels: [4.352, 50.846],
  leuven: [4.701, 50.879],
  bosch: [5.304, 51.69],
  antwerp: [4.402, 51.221],
  mechelen: [4.479, 51.028],
  aachen: [6.084, 50.776],
  cologne: [6.958, 50.938],
  nijmegen: [5.853, 51.842],
  bergen: [4.292, 51.495],
  middelburg: [3.61, 51.499],
  zierikzee: [3.917, 51.65],
  steenvoorde: [2.583, 50.81],
} satisfies Record<string, [number, number]>

// Moves a mark a little, so two in one town don't sit on top of each other.
const by = ([lon, lat]: [number, number], dlon: number, dlat: number): [number, number] => [lon + dlon, lat + dlat]

export const paintersSites: HistSite[] = [
  { name: 'Robert Campin', kind: 'workshop', from: PAINTERS_MIN, to: 1444, at: T.tournai, label: 'left', note: 'Tournai; at work there from 1406 or earlier, died 1444' },
  { name: 'Hubert van Eyck', kind: 'workshop', from: PAINTERS_MIN, to: 1426, at: T.ghent, label: 'right', note: 'Ghent; died 1426, with the Ghent Altarpiece unfinished' },
  { name: 'Jan van Eyck', kind: 'workshop', from: 1425, to: 1429, at: T.lille, label: 'left', note: "Lille; painter to Philip the Good from 1425" },
  { name: 'Jan van Eyck', kind: 'workshop', from: 1430, to: 1441, at: T.bruges, label: 'left', note: 'Bruges, from about 1430; died 1441' },
  { name: 'Rogier van der Weyden', kind: 'workshop', from: 1436, to: 1464, at: T.brussels, label: 'left', note: 'Brussels; town painter from 1436, died 1464' },
  { name: 'Dieric Bouts', kind: 'workshop', from: 1457, to: 1475, at: T.leuven, label: 'right', note: 'Leuven, from 1457 or earlier; town painter from 1468, died 1475' },
  { name: 'Hans Memling', kind: 'workshop', from: 1465, to: 1494, at: T.bruges, label: 'left', note: 'Bruges; citizen from 1465, died 1494' },
  { name: 'Hugo van der Goes', kind: 'workshop', from: 1467, to: 1482, at: T.ghent, label: 'right', note: 'Ghent, master from 1467; later a lay brother at the Red Cloister near Brussels, died 1482' },
  { name: 'Hieronymus Bosch', kind: 'workshop', from: 1474, to: 1516, at: T.bosch, label: 'right', note: "'s-Hertogenbosch; first named in the town's records in 1474, died 1516" },
  { name: 'Quinten Metsys', kind: 'workshop', from: 1491, to: 1530, at: by(T.antwerp, 0.06, 0.03), label: 'right', note: 'Antwerp; master of the guild from 1491, died 1530' },
  {
    name: 'Pieter Bruegel',
    kind: 'workshop',
    from: 1551,
    to: 1562,
    off: [[1552, 1554]],
    at: by(T.antwerp, 0.06, 0.03),
    label: 'right',
    note: 'Antwerp; master of the guild from 1551, in Italy from 1552 to about 1554',
  },
  { name: 'Pieter Bruegel', kind: 'workshop', from: 1563, to: 1568, at: T.brussels, label: 'left', note: 'Brussels, from 1563; died 1569' },
  { name: 'Art fair in the Pand', kind: 'market', from: 1460, to: 1539, at: by(T.antwerp, -0.06, -0.02), label: 'left', note: "Antwerp; stalls for paintings in the cloister of Our Lady's church during the fairs, from 1460" },
  { name: 'Painters’ market at the Bourse', kind: 'market', from: 1540, at: by(T.antwerp, -0.06, -0.02), label: 'left', note: 'Antwerp; the Schilderspand, on the upper floor of the new Bourse, from 1540' },
  { name: 'Four Winds print shop', kind: 'market', from: 1548, at: by(T.antwerp, 0.0, 0.08), label: 'right', note: "Antwerp; Hieronymus Cock's print shop, Aux Quatre Vents, from about 1548" },
  { name: 'Steenvoorde', kind: 'battle', from: 1566, to: 1566, at: T.steenvoorde, label: 'right', note: 'The Iconoclastic Fury begins, 10 August 1566' },
  { name: 'Antwerp', kind: 'battle', from: 1566, to: 1566, at: by(T.antwerp, -0.02, -0.07), note: "Our Lady's church stripped of its altarpieces, 20 August 1566" },
  { name: 'Ghent', kind: 'battle', from: 1566, to: 1566, at: by(T.ghent, 0, -0.06), note: 'Churches ransacked, August 1566; the Ghent Altarpiece was hidden in the tower in time' },
]

// Dürer's year in the Low Countries, from August 1520 to July 1521, out from and back
// to Antwerp: to Brussels and Mechelen, to Aachen and Cologne for the emperor's
// coronation and home by Nijmegen and 's-Hertogenbosch, to Zeeland to see a stranded
// whale, and to Bruges and Ghent.
export const paintersLines: HistLine[] = [
  {
    name: "Dürer's journeys, 1520 to 1521",
    kind: 'flow',
    from: 1520,
    to: 1521,
    coords: [
      T.cologne, T.aachen, T.antwerp, T.mechelen, T.brussels, T.aachen, T.cologne, T.nijmegen, T.bosch, T.antwerp,
      T.bergen, T.middelburg, T.zierikzee, T.bergen, T.antwerp, T.bruges, T.ghent, T.antwerp,
    ],
  },
]

export const paintersLabels: HistLabel[] = [
  { text: 'GHENT ALTARPIECE', kind: 'alert', from: 1432, to: 1435, at: [3.72, 51.13] },
  { text: 'ICONOCLASTIC FURY', kind: 'alert', from: 1566, to: 1566, at: [3.4, 50.95] },
]

export const paintersEvents: HistEvent[] = [
  {
    from: 1420,
    title: '1420: Painters of the towns',
    text: 'Painters belong to guilds in the rich towns, painting altarpieces, portraits, banners and coats of arms. Robert Campin runs a busy workshop in Tournai, and Hubert van Eyck works in Ghent.',
  },
  {
    from: 1425,
    title: "1425: The duke's painter",
    text: 'Philip the Good, duke of Burgundy, makes Jan van Eyck his painter and a member of his household, at his court in Lille. In 1428 he sends him to Portugal to paint the princess Isabella, his future bride.',
  },
  {
    from: 1427,
    title: '1427: An altarpiece left unfinished',
    text: "Hubert van Eyck dies in Ghent in 1426, leaving a great altarpiece for St John's church (today St Bavo's) unfinished. In Tournai, a young Rogier van der Weyden joins Campin's workshop.",
  },
  {
    from: 1430,
    title: '1430: Jan van Eyck in Bruges',
    text: "Back from Portugal, Jan van Eyck settles in Bruges, the great trading town of Flanders, where merchants from Italy, Spain and the Hanseatic towns live. He soon buys a house there.",
  },
  {
    from: 1432,
    title: '1432: The Ghent Altarpiece',
    text: 'On 6 May 1432 the altarpiece the Van Eyck brothers painted is unveiled in Ghent. Visitors come to see it for centuries.',
  },
  {
    from: 1436,
    title: '1436: The painter of Brussels',
    text: 'Rogier van der Weyden becomes the official painter of Brussels, home of the duke’s court. His workshop sends altarpieces all over Europe.',
  },
  {
    from: 1442,
    title: '1442: Van Eyck is dead',
    text: 'Jan van Eyck died in Bruges in July 1441 and was buried in St Donatian’s church. Some of his last pictures were finished by his workshop.',
  },
  {
    from: 1445,
    title: '1445: Campin is dead',
    text: 'Robert Campin died in Tournai in April 1444. By now his pupil Rogier is the most sought-after painter in the Low Countries.',
  },
  {
    from: 1457,
    title: '1457: Bouts in Leuven',
    text: 'Dieric Bouts, born in Haarlem, works in the university town of Leuven. In 1464 he signs a contract to paint the Last Supper for the brotherhood of the Holy Sacrament.',
  },
  {
    from: 1460,
    title: '1460: An art market in Antwerp',
    text: "During Antwerp's two great fairs, painters, sculptors and frame makers rent stalls in the Pand, the cloister of Our Lady's church. Paintings are now made to sell to anyone, not only to order.",
  },
  {
    from: 1465,
    title: '1465: Memling in Bruges',
    text: 'Rogier van der Weyden died in Brussels in June 1464. In January 1465 Hans Memling, born in Germany and probably trained in Rogier’s workshop, becomes a citizen of Bruges.',
  },
  {
    from: 1467,
    title: '1467: Hugo van der Goes in Ghent',
    text: 'Hugo van der Goes becomes a master of the painters’ guild of Ghent. In the 1470s he paints a huge altarpiece for Tommaso Portinari, the manager of the Medici bank in Bruges.',
  },
  {
    from: 1474,
    title: "1474: Bosch in 's-Hertogenbosch",
    text: "Jheronimus van Aken, from a family of painters, is first named in the records of 's-Hertogenbosch in 1474. He will sign his pictures with the town's name: Bosch.",
  },
  {
    from: 1476,
    title: '1476: Bouts is dead',
    text: 'Dieric Bouts died in Leuven in May 1475, leaving his sons to carry on the workshop.',
  },
  {
    from: 1483,
    title: '1483: The Portinari Altarpiece in Florence',
    text: "Hugo van der Goes died in 1482 at the Red Cloister near Brussels. His altarpiece for Portinari reaches Florence in 1483, and Italian painters study its shepherds.",
  },
  {
    from: 1491,
    title: '1491: Metsys in Antwerp',
    text: 'Quinten Metsys, from Leuven, becomes a master of the Antwerp guild. Antwerp is taking over from Bruges as the trading town of the Low Countries, and painters move there.',
  },
  {
    from: 1495,
    title: '1495: Memling is dead',
    text: 'Hans Memling died in Bruges in August 1494. Bruges is losing its trade, as its link to the sea, the Zwin, silts up.',
  },
  {
    from: 1517,
    title: '1517: Bosch is dead',
    text: "Hieronymus Bosch died in 's-Hertogenbosch in August 1516. His brotherhood held a funeral mass for him in St John's church. Copies and fakes of his pictures are soon selling well.",
  },
  {
    from: 1520,
    title: '1520: Dürer comes to see',
    text: 'The German painter Albrecht Dürer arrives in Antwerp in August 1520, with his wife. For a year he travels around the Low Countries, meets painters, sells prints and keeps a diary of everything he sees.',
  },
  {
    from: 1522,
    title: '1522: Antwerp, city of painters',
    text: 'Dürer went home to Nuremberg in July 1521. Antwerp now has more painters than any other town in the Low Countries, many of them making pictures for the open market.',
  },
  {
    from: 1531,
    title: '1531: A new Bourse',
    text: 'Quinten Metsys died in 1530. Antwerp opens a new Bourse, where merchants from all over Europe trade every day.',
  },
  {
    from: 1540,
    title: "1540: A painters' market at the Bourse",
    text: "The upper floor of the Bourse becomes the Schilderspand, a market hall for paintings that is open all year, not just during the fairs.",
  },
  {
    from: 1548,
    title: '1548: The Four Winds',
    text: "Hieronymus Cock opens a print shop in Antwerp, Aux Quatre Vents. Its engravings of paintings, landscapes and satires sell all over Europe.",
  },
  {
    from: 1551,
    title: '1551: Bruegel joins the guild',
    text: "Pieter Bruegel becomes a master of the Antwerp painters' guild. He soon draws designs for Cock's print shop.",
  },
  {
    from: 1552,
    title: '1552: Bruegel in Italy',
    text: 'Bruegel crosses the Alps to Italy, going as far south as the Strait of Messina. The mountains he draws on the way turn up in his pictures for the rest of his life.',
  },
  {
    from: 1555,
    title: '1555: Bruegel back in Antwerp',
    text: 'Bruegel is back in Antwerp by 1555, drawing for Cock. The same year, Charles V gives up the Netherlands to his son Philip II.',
  },
  {
    from: 1563,
    title: '1563: Bruegel moves to Brussels',
    text: "Bruegel marries Mayken Coecke, the daughter of the painter Pieter Coecke van Aelst, probably his teacher, in Brussels, and settles there. In 1565 he paints six pictures of the seasons for the Antwerp merchant Niclaes Jongelinck.",
  },
  {
    from: 1566,
    title: '1566: The Iconoclastic Fury',
    text: 'Starting at Steenvoorde on 10 August, crowds smash statues and paintings in hundreds of churches. On 20 August they strip Antwerp’s great church. In Ghent the Van Eycks’ altarpiece is hidden in the tower just in time.',
  },
  {
    from: 1567,
    title: '1567: Alba arrives',
    text: 'Philip II sends the duke of Alba with an army to punish the Netherlands. Many Protestants, painters among them, flee abroad.',
  },
  {
    from: 1569,
    title: '1569: Bruegel is dead',
    text: 'Pieter Bruegel died in Brussels in September 1569 and was buried in the church of Our Lady of the Chapel. His sons Pieter and Jan, still small children, will both become painters.',
  },
]

export const paintersStory: TimeStory = {
  place: 'the Low Countries',
  bounds: [
    [2.5, 50.45],
    [7.0, 51.95],
  ],
  min: PAINTERS_MIN,
  max: PAINTERS_MAX,
  format: String,
  events: paintersEvents,
  lines: paintersLines,
  sites: paintersSites,
  labels: paintersLabels,
  note: 'Each painter is drawn in the town where they worked, from the year they are first found there; Dürer’s routes are approximate.',
  key: [
    { swatch: 'key-workshop', text: "A painter's workshop" },
    { swatch: 'key-market', text: 'Art market or print shop' },
    { swatch: 'key-flow', text: "Dürer's journeys" },
    { swatch: 'key-battle', text: 'Iconoclastic Fury' },
  ],
}
