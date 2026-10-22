// The map of thinkers and scientists for Unit 25: where the learning of the Low Countries happened,
// from the university of Leuven in 1425 to Lemaître's expanding universe in 1927. Each mark appears in
// the year it is first known: a mortarboard for a university, a book for a printer, a quill for a
// thinker's work, a flask for a laboratory or observatory, a leaf for a botanical garden and a medal
// for a Nobel Prize. Scholars who left are labels at the edge while they are away. Coordinates are [lon, lat].

import type { HistEvent, HistLabel, HistLine, HistSite, TimeStory } from './timeline'

export const SCIENCE_MIN = 1425
export const SCIENCE_MAX = 1931

const by = ([lon, lat]: [number, number], dlon: number, dlat: number): [number, number] => [lon + dlon, lat + dlat]
const P = {
  leuven: [4.701, 50.879],
  aalst: [4.04, 50.937],
  antwerp: [4.401, 51.22],
  brussels: [4.352, 50.846],
  mechelen: [4.478, 51.026],
  duisburg: [6.762, 51.434],
  leiden: [4.49, 52.16],
  franeker: [5.54, 53.187],
  groningen: [6.567, 53.219],
  utrecht: [5.121, 52.09],
  harderwijk: [5.62, 52.35],
  amsterdam: [4.893, 52.373],
  delft: [4.357, 52.012],
  hague: [4.3, 52.08],
  rijnsburg: [4.44, 52.19],
  loevestein: [5.02, 51.817],
  haarlem: [4.636, 52.381],
  ghent: [3.717, 51.054],
  liege: [5.57, 50.633],
  alkmaar: [4.749, 52.632],
  bergenOpZoom: [4.292, 51.495],
  scheveningen: [4.27, 52.11],
  petten: [4.66, 52.77],
} satisfies Record<string, [number, number]>

export const scienceSites: HistSite[] = [
  { name: 'Leuven', kind: 'university', from: 1425, at: P.leuven, label: 'right', off: [[1797, 1816]], note: 'The first university of the Low Countries, founded by the duke of Brabant with the pope’s leave, 1425; closed under French rule from 1797' },
  { name: 'Dirk Martens', kind: 'press', from: 1473, at: P.aalst, label: 'left', note: 'Aalst: Dirk Martens prints the first dated book of the Southern Netherlands, 1473; in Leuven he later prints More’s Utopia for Erasmus, 1516' },
  { name: 'Collegium Trilingue', kind: 'scholar', from: 1517, at: by(P.leuven, 0.05, 0.1), label: 'right', note: 'Leuven: the college of Latin, Greek and Hebrew, paid for by Jerome de Busleyden and planned with Erasmus’s advice, 1517' },
  { name: 'Gemma Frisius', kind: 'scholar', from: 1533, at: by(P.leuven, 0.06, -0.1), label: 'right', note: 'Leuven: Gemma Frisius sets out how to map a land by triangles, 1533' },
  { name: 'Mercator’s globe', kind: 'scholar', from: 1541, at: by(P.leuven, -0.1, -0.08), label: 'left', note: 'Leuven: Gerard Mercator, a pupil of Gemma Frisius, makes his globe of the Earth, 1541' },
  { name: 'Vesalius', kind: 'scholar', from: 1543, at: P.brussels, label: 'left', note: 'Brussels, where Andreas Vesalius was born in 1514: his Fabrica, the first great book of human anatomy, comes out in Basel, 1543' },
  { name: 'Dodoens', kind: 'garden', from: 1554, at: P.mechelen, label: 'right', note: 'Mechelen: Rembert Dodoens, the town physician, publishes his Cruydeboeck, a book of herbs in Dutch, 1554' },
  { name: 'Plantin', kind: 'press', from: 1555, at: P.antwerp, label: 'left', note: 'Antwerp: Christophe Plantin has his own print shop by 1555, and by 1575 runs more than 20 presses' },
  { name: 'Mercator’s map', kind: 'scholar', from: 1569, at: P.duisburg, label: 'left', note: 'Duisburg, where Mercator moved in 1552: his map of the world for navigators, 1569' },
  { name: 'Ortelius', kind: 'press', from: 1570, at: by(P.antwerp, 0.12, 0.07), label: 'right', note: 'Antwerp: Abraham Ortelius’s Theatrum Orbis Terrarum, the first modern atlas, 20 May 1570' },
  { name: 'Leiden', kind: 'university', from: 1575, at: P.leiden, label: 'left', note: 'The first university of the northern provinces, 8 February 1575, it is said as a reward for the town’s stand in the siege of 1574' },
  { name: 'Franeker', kind: 'university', from: 1585, to: 1810, at: P.franeker, label: 'left', note: 'The university of Friesland, 1585 to 1811' },
  { name: 'Stevin', kind: 'lab', from: 1586, at: P.delft, label: 'left', note: 'Delft: Simon Stevin and Jan Cornets de Groot drop two lead balls, one ten times heavier, from the tower of the New Church; they land together, 1586' },
  { name: 'Hortus', kind: 'garden', from: 1590, at: by(P.leiden, 0.06, -0.08), label: 'right', note: 'Leiden: the university’s botanical garden, 1590; Carolus Clusius arrives in 1593' },
  { name: 'Groningen', kind: 'university', from: 1614, at: P.groningen, label: 'left', note: 'The university of Groningen, 1614' },
  { name: 'Grotius', kind: 'scholar', from: 1621, at: P.loevestein, label: 'right', note: 'Loevestein Castle: Hugo Grotius escapes his prison in a chest of books, 1621' },
  { name: 'Utrecht', kind: 'university', from: 1636, at: P.utrecht, label: 'right', note: 'The university of Utrecht, 1636' },
  { name: 'Harderwijk', kind: 'university', from: 1648, to: 1810, at: P.harderwijk, label: 'right', note: 'The university of Gelderland, 1648 to 1811' },
  { name: 'Blaeu', kind: 'press', from: 1648, at: by(P.amsterdam, 0.1, 0.08), label: 'right', note: 'Amsterdam: Joan Blaeu’s world map, the first to show the Sun at the middle of the planets, as Copernicus taught, 1648' },
  { name: 'Huygens', kind: 'lab', from: 1656, at: P.hague, label: 'left', note: 'The Hague: Christiaan Huygens makes the first pendulum clock, 1656, patented in 1657' },
  { name: 'Leeuwenhoek', kind: 'lab', from: 1676, at: by(P.delft, 0.08, -0.05), label: 'right', note: 'Delft: Antonie van Leeuwenhoek sees tiny living creatures in water through his lenses, 9 October 1676' },
  { name: 'Teylers', kind: 'museum', from: 1784, at: P.haarlem, label: 'right', note: 'Haarlem: the Oval Room of Teylers Museum opens, with the largest electrostatic machine in the world, 1784' },
  { name: 'Ghent', kind: 'university', from: 1817, at: P.ghent, label: 'left', note: 'The university of Ghent, founded by King William I, 1817' },
  { name: 'Liège', kind: 'university', from: 1817, at: P.liege, label: 'right', note: 'The university of Liège, founded by King William I, 1817' },
  { name: 'Observatory', kind: 'lab', from: 1828, at: by(P.brussels, 0.1, 0.08), label: 'right', note: 'Brussels: Adolphe Quetelet wins his observatory, 1828, and later describes the “average man”, 1835' },
  { name: 'Free University', kind: 'university', from: 1834, at: by(P.brussels, -0.1, -0.08), label: 'left', note: 'The Free University of Brussels, 1834' },
  { name: 'KNMI', kind: 'lab', from: 1854, at: by(P.utrecht, 0.04, -0.1), label: 'right', note: 'Utrecht: Buys Ballot founds the Dutch weather institute, KNMI, 1854' },
  { name: 'Van ’t Hoff', kind: 'prize', from: 1901, at: by(P.amsterdam, -0.12, -0.06), label: 'left', note: 'Amsterdam, where Jacobus van ’t Hoff did his work on chemical reactions: the first Nobel Prize in Chemistry, 1901' },
  { name: 'Lorentz', kind: 'prize', from: 1902, at: by(P.leiden, -0.08, 0.06), label: 'left', note: 'Leiden: Hendrik Lorentz shares the Nobel Prize in Physics with his former student Pieter Zeeman, 1902' },
  { name: 'Zeeman', kind: 'prize', from: 1902, at: by(P.amsterdam, 0.12, -0.08), label: 'right', note: 'Amsterdam: Pieter Zeeman shares the Nobel Prize in Physics with Lorentz, 1902' },
  { name: 'Kamerlingh Onnes', kind: 'prize', from: 1913, at: by(P.leiden, 0.12, 0.06), label: 'right', note: 'Leiden: Heike Kamerlingh Onnes, who made helium liquid in 1908 and found superconductivity in 1911, wins the Nobel Prize in Physics, 1913' },
  { name: 'Solvay', kind: 'lab', from: 1911, at: by(P.brussels, 0.02, 0.17), label: 'right', note: 'Brussels: the first Solvay conference of physicists, at the Hotel Metropole, 1911' },
  { name: 'Einthoven', kind: 'prize', from: 1924, at: by(P.leiden, -0.1, -0.08), label: 'left', note: 'Leiden: Willem Einthoven wins the Nobel Prize in Medicine for the electrocardiogram, 1924' },
  { name: 'Lemaître', kind: 'scholar', from: 1927, at: by(P.leuven, 0.1, 0.02), label: 'right', note: 'Leuven: Georges Lemaître, priest and physicist, shows that the universe is expanding, 1927' },
]

export const scienceLines: HistLine[] = [
  {
    name: 'Snellius’s chain of triangles, from Alkmaar to Bergen op Zoom',
    kind: 'survey',
    from: 1615,
    coords: [P.alkmaar, P.haarlem, P.leiden, P.hague, P.delft, [4.479, 51.922], [4.66, 51.81], [4.776, 51.589], P.bergenOpZoom],
  },
]

export const scienceLabels: HistLabel[] = [
  { text: 'LOW COUNTRIES', kind: 'territory', from: SCIENCE_MIN, to: 1647, at: [6.2, 52.75] },
  { text: 'NETHERLANDS', kind: 'territory', from: 1648, at: [6.2, 52.75] },
  { text: 'SOUTHERN NETHERLANDS', kind: 'territory', from: 1648, to: 1829, at: [4.9, 50.05] },
  { text: 'BELGIUM', kind: 'territory', from: 1830, at: [4.9, 50.05] },
  { text: 'NORTH SEA', kind: 'water', from: SCIENCE_MIN, at: [3.4, 52.6] },
  { text: 'VESALIUS IN PADUA', kind: 'people', from: 1537, to: 1542, at: [5.6, 50.15] },
  { text: 'ERASMUS IN BASEL AND FREIBURG', kind: 'people', from: 1521, to: 1536, at: [5.6, 50.15] },
]

export const scienceEvents: HistEvent[] = [
  {
    from: 1425,
    title: '1425: a university for Brabant',
    text: 'Duke John IV of Brabant founds a university at Leuven, with the pope’s leave. For more than a century it is the only one in the Low Countries.',
  },
  {
    from: 1473,
    title: '1473: the first printed book',
    text: 'At Aalst, Dirk Martens prints the first dated book of the Southern Netherlands. Printing spreads to Leuven and Antwerp, and books become cheap enough for students.',
  },
  {
    from: 1517,
    title: '1517: three languages',
    text: 'A college opens in Leuven to teach Latin, Greek and Hebrew, so scholars can read the Bible and the ancients in their own words. Erasmus advises on it, though he never teaches there.',
  },
  {
    from: 1521,
    title: '1521: Erasmus leaves',
    text: 'After a summer in Anderlecht, Erasmus leaves the Low Countries for good. In Basel his books are printed by Froben, and he never comes back.',
  },
  {
    from: 1533,
    title: '1533: maps by triangles',
    text: 'Gemma Frisius of Leuven sets out how to map a whole land from one measured line and the angles between church towers. Surveyors still work this way.',
  },
  {
    from: 1537,
    title: '1537: Vesalius in Padua',
    text: 'Andreas Vesalius of Brussels takes his degree, and the next day the university of Padua makes him its teacher of surgery and anatomy. He cuts up the bodies himself.',
  },
  {
    from: 1541,
    title: '1541: Mercator’s globe',
    text: 'Gerard Mercator, a pupil of Gemma Frisius, makes a globe of the Earth in Leuven. Two years later he spends months in prison, suspected of being a Lutheran.',
  },
  {
    from: 1543,
    title: '1543: the fabric of the body',
    text: 'Vesalius, 28 years old, publishes seven books of anatomy, drawn from the bodies he opened. He shows that the great Galen had described apes, not people.',
  },
  {
    from: 1554,
    title: '1554: plants in Dutch',
    text: 'Rembert Dodoens, physician of Mechelen, writes his Cruydeboeck, a book of herbs in Dutch with hundreds of woodcuts.',
  },
  {
    from: 1555,
    title: '1555: Plantin',
    text: 'Christophe Plantin, a bookbinder from France, has his own print shop in Antwerp. By 1575 he runs more than 20 presses with 73 workmen.',
  },
  {
    from: 1569,
    title: '1569: a map for sailors',
    text: 'In Duisburg, where he moved in 1552, Mercator prints his world map in 18 sheets. Any steady compass course is a straight line on it.',
  },
  {
    from: 1570,
    title: '1570: the first atlas',
    text: 'Abraham Ortelius of Antwerp brings out the Theatrum Orbis Terrarum: 53 maps of one size, in one book. It has 25 editions before he dies.',
  },
  {
    from: 1575,
    title: '1575: Leiden',
    text: 'In the middle of the revolt, a university is founded at Leiden, the first in the northern provinces.',
  },
  {
    from: 1585,
    title: '1585: Franeker',
    text: 'Friesland founds a university of its own at Franeker. The same year Antwerp falls to the king’s army, and many of its scholars and printers move north.',
  },
  {
    from: 1586,
    title: '1586: two balls from a tower',
    text: 'Simon Stevin and Jan de Groot drop two lead balls, one ten times heavier, from the tower of the New Church in Delft. They hit the boards below at almost the same time.',
  },
  {
    from: 1590,
    title: '1590: the garden',
    text: 'Leiden lays out a botanical garden for its doctors. In 1593 Carolus Clusius comes to run it, and plants tulips.',
  },
  {
    from: 1614,
    title: '1614: Groningen',
    text: 'Groningen founds a university. The Republic’s universities draw students from all over Protestant Europe.',
  },
  {
    from: 1615,
    title: '1615: measuring the Earth',
    text: 'Willebrord Snellius of Leiden measures from church tower to church tower, Alkmaar to Bergen op Zoom, and works out the size of the Earth. He is only about 3.5% short.',
  },
  {
    from: 1621,
    title: '1621: a chest of books',
    text: 'Hugo Grotius, jailed for life at Loevestein in a quarrel between Calvinists, escapes in a chest of books his wife sends out. In Paris he writes On the Law of War and Peace.',
  },
  {
    from: 1636,
    title: '1636: Utrecht',
    text: 'Utrecht founds a university. Descartes, who has lived in the Republic since 1628, has his Discourse on Method printed in Leiden the next year.',
  },
  {
    from: 1648,
    title: '1648: free to think',
    text: 'Gelderland founds a university at Harderwijk, the Republic’s fifth. Its printers publish what others ban: Galileo’s last book came out in Leiden in 1638. Blaeu’s new world map puts the Sun at the middle.',
  },
  {
    from: 1656,
    title: '1656: the pendulum clock',
    text: 'In The Hague, Christiaan Huygens hangs a pendulum in a clock. Clocks that drifted about 15 minutes a day now drift about 15 seconds. A year earlier he found Titan, Saturn’s largest moon.',
  },
  {
    from: 1676,
    title: '1676: little animals',
    text: 'In Delft, Antonie van Leeuwenhoek, a cloth merchant with tiny homemade lenses, sees living creatures swimming in a drop of water. The Royal Society in London doubts him, then checks and agrees.',
  },
  {
    from: 1784,
    title: '1784: Teylers',
    text: 'In Haarlem, Teylers Museum opens its Oval Room for science and art. Martinus van Marum has the largest electrostatic machine in the world built for it.',
  },
  {
    from: 1797,
    title: '1797: Leuven closed',
    text: 'The French republic, which has taken over the southern Netherlands, closes the university of Leuven, after 372 years.',
  },
  {
    from: 1811,
    title: '1811: Napoleon’s cuts',
    text: 'Holland is now part of Napoleon’s empire. He closes the small universities of Franeker and Harderwijk, and neither ever opens again.',
  },
  {
    from: 1817,
    title: '1817: the king’s universities',
    text: 'King William I founds universities at Ghent and Liège for his southern provinces, and a state university at Leuven.',
  },
  {
    from: 1828,
    title: '1828: the observatory',
    text: 'Adolphe Quetelet of Ghent wins the king over to an observatory in Brussels. Later he measures thousands of people to find the “average man”.',
  },
  {
    from: 1830,
    title: '1830: Belgium',
    text: 'The southern provinces break away. The new state keeps the universities of Ghent and Liège.',
  },
  {
    from: 1834,
    title: '1834: two new universities',
    text: 'Liberals found the Free University of Brussels, and the bishops a Catholic university, which moves to Leuven in 1835.',
  },
  {
    from: 1854,
    title: '1854: the weather',
    text: 'Buys Ballot founds the Dutch weather institute in Utrecht. His rule: stand with your back to the wind, and low pressure lies to your left.',
  },
  {
    from: 1901,
    title: '1901: the first Nobel Prizes',
    text: 'Jacobus van ’t Hoff, who worked out in Amsterdam how fast chemical reactions run, wins the first Nobel Prize in Chemistry.',
  },
  {
    from: 1902,
    title: '1902: light in a magnet',
    text: 'Hendrik Lorentz of Leiden and his former student Pieter Zeeman share the Nobel Prize in Physics, for how a magnet splits the light of a flame.',
  },
  {
    from: 1911,
    title: '1911: the Solvay conference',
    text: 'Ernest Solvay, a Belgian industrialist, brings the great physicists to the Hotel Metropole in Brussels to talk about radiation and the quanta. Lorentz chairs it.',
  },
  {
    from: 1913,
    title: '1913: the coldest place on Earth',
    text: 'Heike Kamerlingh Onnes, who made helium liquid in Leiden in 1908 and found that frozen mercury lets a current flow with no resistance, wins the Nobel Prize in Physics.',
  },
  {
    from: 1924,
    title: '1924: the heart’s current',
    text: 'Willem Einthoven of Leiden, born on Java, wins the Nobel Prize in Medicine for the electrocardiogram.',
  },
  {
    from: 1927,
    title: '1927: an expanding universe',
    text: 'Georges Lemaître, a priest who teaches in Leuven, shows that the galaxies are flying apart.',
  },
  {
    from: 1931,
    title: '1931: the primeval atom',
    text: 'Lemaître proposes that the universe began as a single “primeval atom”: the first form of what came to be called the Big Bang.',
  },
]

export const scienceStory: TimeStory = {
  place: 'the Low Countries',
  bounds: [
    [2.5, 49.95],
    [6.95, 53.45],
  ],
  min: SCIENCE_MIN,
  max: SCIENCE_MAX,
  format: String,
  events: scienceEvents,
  lines: scienceLines,
  sites: scienceSites,
  labels: scienceLabels,
  note: 'Each mark appears in the year the work is first known. A university that closed fades out.',
  key: [
    { swatch: 'key-university', text: 'University' },
    { swatch: 'key-press', text: 'Printer or atlas' },
    { swatch: 'key-scholar', text: 'A thinker’s work' },
    { swatch: 'key-lab', text: 'Laboratory or observatory' },
    { swatch: 'key-garden', text: 'Plants' },
    { swatch: 'key-prize', text: 'Nobel Prize' },
    { swatch: 'key-survey', text: 'Survey by triangles' },
  ],
}
