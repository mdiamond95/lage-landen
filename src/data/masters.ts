// The map for Unit 17: where the painters of the Golden Age worked, from the fall of
// Antwerp in 1585 to Ruisdael's death in 1682. Each painter is a workshop in the town
// where they worked, at the stages they are known to be there; a stage begins with
// every change, so a painter who has gone fades from the map at the next stage. The
// painters who left Antwerp for the north after 1585, Rubens's years in Italy and the
// painters who went to London are flows; Evelyn's Rotterdam fair is a market.
// Coordinates are [lon, lat].

import type { HistEvent, HistLabel, HistLine, HistSite, TimeStory } from './timeline'

export const MASTERS_MIN = 1585
export const MASTERS_MAX = 1682

const T = {
  antwerp: [4.402, 51.221],
  haarlem: [4.636, 52.381],
  amsterdam: [4.9, 52.373],
  leiden: [4.497, 52.16],
  delft: [4.357, 52.012],
  utrecht: [5.121, 52.091],
  kampen: [5.911, 52.556],
  rotterdam: [4.479, 51.922],
  middelburg: [3.61, 51.499],
} satisfies Record<string, [number, number]>

// Moves a mark a little, so two in one town don't sit on top of each other.
const by = ([lon, lat]: [number, number], dlon: number, dlat: number): [number, number] => [lon + dlon, lat + dlat]

// Where the arrows leave the map: south for Italy, west over the sea for London.
const SOUTH: [number, number] = [5.3, 50.98]
const LONDON: [number, number] = [3.22, 51.75]

export const mastersSites: HistSite[] = [
  { name: 'Karel van Mander', kind: 'workshop', from: MASTERS_MIN, to: 1603, at: T.haarlem, label: 'left', note: 'Haarlem, from 1583; a refugee from Flanders who wrote the first book of lives of the painters of the Low Countries' },
  { name: 'Jan Brueghel', kind: 'workshop', from: 1600, to: 1624, at: by(T.antwerp, -0.07, 0.04), label: 'left', note: 'Antwerp, back from Italy by 1596; Bruegel’s younger son, died 1625' },
  { name: 'Rubens', kind: 'workshop', from: 1609, to: 1640, at: T.antwerp, label: 'right', note: 'Antwerp; court painter to the archdukes from 1609, died 1640' },
  { name: 'Hendrick Avercamp', kind: 'workshop', from: 1609, to: 1634, at: T.kampen, label: 'left', note: 'Kampen, from 1608; died 1634' },
  { name: 'Frans Hals', kind: 'workshop', from: 1610, to: 1666, at: by(T.haarlem, 0, 0.03), label: 'left', note: 'Haarlem; in the painters’ guild from 1610, died 1666' },
  { name: 'Jacob Jordaens', kind: 'workshop', from: 1616, to: 1678, at: by(T.antwerp, 0.06, -0.06), label: 'right', note: 'Antwerp; master of the guild from 1615, died 1678' },
  {
    name: 'Anthony van Dyck',
    kind: 'workshop',
    from: 1616,
    to: 1631,
    off: [[1622, 1626]],
    at: by(T.antwerp, -0.07, -0.05),
    label: 'left',
    note: 'Antwerp; master of the guild in 1617, in Italy from late 1621 to 1627, to London in 1632',
  },
  { name: 'Hendrick ter Brugghen', kind: 'workshop', from: 1616, to: 1629, at: T.utrecht, label: 'right', note: 'Utrecht, back from Italy by 1616; died 1629' },
  { name: 'Gerard van Honthorst', kind: 'workshop', from: 1620, to: 1656, at: by(T.utrecht, 0, -0.05), label: 'right', note: 'Utrecht, back from Rome in 1620; also kept a studio in The Hague for the court; died 1656' },
  { name: 'Dirck van Baburen', kind: 'workshop', from: 1621, to: 1623, at: by(T.utrecht, 0, 0.05), label: 'right', note: 'Utrecht, back from Rome late in 1620; died February 1624' },
  { name: 'Rembrandt', kind: 'workshop', from: 1625, to: 1631, at: T.leiden, label: 'right', note: 'Leiden; his own studio from 1625, shared with Jan Lievens' },
  { name: 'Jan Lievens', kind: 'workshop', from: 1625, to: 1631, at: by(T.leiden, 0, -0.05), label: 'left', note: 'Leiden; to London in 1632' },
  { name: 'Rembrandt', kind: 'workshop', from: 1632, to: 1669, at: T.amsterdam, label: 'right', note: 'Amsterdam, from late 1631; died 1669' },
  { name: 'Jacob van Ruisdael', kind: 'workshop', from: 1648, to: 1656, at: by(T.haarlem, 0, -0.03), label: 'left', note: 'Haarlem; in the painters’ guild from 1648' },
  { name: 'Johannes Vermeer', kind: 'workshop', from: 1653, to: 1675, at: T.delft, label: 'left', note: 'Delft; in the painters’ guild from December 1653, died 1675' },
  { name: 'Pieter de Hooch', kind: 'workshop', from: 1653, to: 1660, at: by(T.delft, 0, -0.05), label: 'left', note: 'Delft, by 1652; in the guild from 1655' },
  { name: 'Jacob van Ruisdael', kind: 'workshop', from: 1657, to: 1681, at: by(T.amsterdam, 0, 0.04), label: 'right', note: 'Amsterdam, by 1657; died 1682' },
  { name: 'Meindert Hobbema', kind: 'workshop', from: 1657, at: by(T.amsterdam, 0, -0.04), label: 'right', note: 'Amsterdam; Ruisdael’s only known pupil, wine gauger for the city from 1668' },
  { name: 'Pieter de Hooch', kind: 'workshop', from: 1661, at: by(T.amsterdam, -0.02, -0.08), label: 'right', note: 'Amsterdam, by 1661; died 1684' },
  { name: 'Jan Steen', kind: 'workshop', from: 1661, to: 1669, at: by(T.haarlem, 0, -0.06), label: 'left', note: 'Haarlem, 1660 to 1670' },
  { name: 'Jan Steen', kind: 'workshop', from: 1670, to: 1678, at: by(T.leiden, 0, 0.05), label: 'right', note: 'Leiden, from 1670; died early in 1679' },
  { name: 'Rotterdam fair', kind: 'market', from: 1641, to: 1641, at: T.rotterdam, label: 'right', note: 'August 1641: John Evelyn finds the yearly fair full of paintings for sale' },
]

export const mastersLines: HistLine[] = [
  { name: 'From Antwerp to Middelburg', kind: 'flow', from: MASTERS_MIN, to: 1599, coords: [T.antwerp, T.middelburg] },
  { name: 'From Antwerp to Haarlem', kind: 'flow', from: MASTERS_MIN, to: 1599, coords: [T.antwerp, by(T.leiden, -0.12, 0), T.haarlem] },
  { name: 'From Antwerp to Amsterdam', kind: 'flow', from: MASTERS_MIN, to: 1599, coords: [T.antwerp, by(T.utrecht, -0.25, -0.05), T.amsterdam] },
  { name: 'Rubens to Italy', kind: 'flow', from: 1600, to: 1608, coords: [T.antwerp, SOUTH] },
  { name: 'Rembrandt to Amsterdam', kind: 'flow', from: 1632, to: 1634, coords: [T.leiden, T.amsterdam] },
  { name: 'Van Dyck to London', kind: 'flow', from: 1632, to: 1634, coords: [T.antwerp, LONDON] },
  { name: 'The Van de Veldes to London', kind: 'flow', from: 1672, to: 1675, coords: [T.amsterdam, by(T.haarlem, -0.5, -0.2), [3.22, 52.1]] },
]

export const mastersLabels: HistLabel[] = [
  { text: 'DUTCH REPUBLIC', kind: 'territory', from: MASTERS_MIN, at: [5.55, 52.3] },
  { text: 'SPANISH NETHERLANDS', kind: 'territory', from: MASTERS_MIN, at: [4.4, 51.02] },
  { text: 'FALL OF ANTWERP', kind: 'alert', from: MASTERS_MIN, to: 1599, at: [4.0, 51.32] },
  { text: 'THE DISASTER YEAR', kind: 'alert', from: 1672, to: 1675, at: [5.2, 51.75] },
]

export const mastersEvents: HistEvent[] = [
  {
    from: 1585,
    title: '1585: Antwerp falls',
    text: 'Antwerp surrenders to the Spanish army. Protestants are given four years to leave, and thousands go north, painters among them, to Middelburg, Haarlem and Amsterdam. Karel van Mander, a painter who fled Flanders, already lives in Haarlem.',
  },
  {
    from: 1600,
    title: '1600: Rubens goes to Italy',
    text: 'Peter Paul Rubens, a young master of the Antwerp guild, leaves for Italy. He will work for the duke of Mantua and study the ancient statues and the great painters of Rome for eight years. Jan Brueghel, Bruegel’s younger son, is back in Antwerp from Italy.',
  },
  {
    from: 1604,
    title: '1604: The book of painters',
    text: 'Karel van Mander publishes his Schilder-boeck, the book of painters, with the lives of the painters of the Low Countries from Van Eyck to his own friends. Much of what we know about Bruegel comes from it.',
  },
  {
    from: 1609,
    title: '1609: A truce, and a court painter',
    text: 'Spain and the Republic agree a Twelve Years’ Truce. Rubens, home since his mother’s death, becomes court painter to the archdukes Albert and Isabella and may stay in Antwerp. In Kampen, on the IJssel, Hendrick Avercamp paints the winter.',
  },
  {
    from: 1610,
    title: '1610: Frans Hals in Haarlem',
    text: 'Frans Hals, whose family fled Antwerp when he was a small boy, joins the painters’ guild of Haarlem.',
  },
  {
    from: 1616,
    title: '1616: Back from Rome',
    text: 'Hendrick ter Brugghen has come home to Utrecht from Italy, where he saw the paintings of Caravaggio. In Antwerp, the teenage Anthony van Dyck is already painting on his own, and soon works with Rubens; Jacob Jordaens has joined the guild too.',
  },
  {
    from: 1620,
    title: '1620: Gerard of the Night',
    text: 'Gerard van Honthorst comes home to Utrecht after years in Rome, where he painted scenes lit by a single candle. Utrecht, where many Catholics still live, has the painters closest to Italy.',
  },
  {
    from: 1621,
    title: '1621: The war begins again',
    text: 'The truce runs out and the war with Spain starts again. Dirck van Baburen is back in Utrecht from Rome; in 1622 he paints The Procuress.',
  },
  {
    from: 1622,
    title: '1622: Van Dyck in Italy',
    text: 'Van Dyck has left Antwerp for Italy, where he will spend six years, most of them painting the nobles of Genoa.',
  },
  {
    from: 1624,
    title: '1624: Baburen is dead',
    text: 'Dirck van Baburen died in Utrecht in February 1624, not yet thirty.',
  },
  {
    from: 1625,
    title: '1625: Two young painters in Leiden',
    text: 'Rembrandt van Rijn, 19, back from six months with Pieter Lastman in Amsterdam, sets up a studio in Leiden and shares it with his friend Jan Lievens. In Antwerp, Jan Brueghel dies in January.',
  },
  {
    from: 1627,
    title: '1627: Van Dyck comes home',
    text: 'Van Dyck returns to Antwerp from Italy. Rubens is often away, travelling as a diplomat between the courts of Spain and England.',
  },
  {
    from: 1630,
    title: '1630: Ter Brugghen is dead',
    text: 'Hendrick ter Brugghen died in Utrecht in November 1629. Constantijn Huygens, secretary to the prince of Orange, has discovered Rembrandt and Lievens in Leiden.',
  },
  {
    from: 1632,
    title: '1632: To Amsterdam and London',
    text: 'Rembrandt has moved to Amsterdam, the richest city in the Republic, and paints the Anatomy Lesson of Dr Tulp. Van Dyck goes to London to be painter to King Charles I, who knights him; Lievens goes to England too.',
  },
  {
    from: 1635,
    title: '1635: Avercamp is dead',
    text: 'Hendrick Avercamp, the painter of skaters, died in Kampen in May 1634.',
  },
  {
    from: 1641,
    title: '1641: Pictures at the fair',
    text: 'Rubens died in Antwerp in May 1640, and Van Dyck in London in December 1641. In August 1641 the English traveller John Evelyn finds the yearly fair at Rotterdam crammed with paintings, many of them cheap.',
  },
  {
    from: 1642,
    title: '1642: The Night Watch',
    text: 'Rembrandt finishes the great painting of Captain Banninck Cocq’s militia company for its hall in Amsterdam. That June his wife Saskia dies. In Haarlem, Frans Hals is painting militias and merchants; in Utrecht, Honthorst paints for the court.',
  },
  {
    from: 1648,
    title: '1648: Peace',
    text: 'At Münster, Spain recognises the Dutch Republic, after eighty years of war. In Haarlem, the young Jacob van Ruisdael joins the painters’ guild.',
  },
  {
    from: 1653,
    title: '1653: Vermeer joins the guild',
    text: 'On 29 December 1653 Johannes Vermeer becomes a master of the Guild of Saint Luke in Delft. Pieter de Hooch is in Delft too, painting courtyards and the women who keep them.',
  },
  {
    from: 1657,
    title: '1657: Ruisdael in Amsterdam',
    text: 'Honthorst died in Utrecht in April 1656. Ruisdael moves to Amsterdam, where Meindert Hobbema becomes his pupil. Rembrandt, bankrupt since 1656, is losing his house and his collection.',
  },
  {
    from: 1661,
    title: '1661: Moving on',
    text: 'Pieter de Hooch has moved to Amsterdam, where rooms are grander and buyers richer. Jan Steen, a brewer’s son from Leiden, lives in Haarlem. In 1662 Vermeer becomes headman of the Delft guild.',
  },
  {
    from: 1667,
    title: '1667: Hals is dead',
    text: 'Frans Hals died in Haarlem in August 1666, in his eighties. In his last years the town paid him a yearly allowance of 200 guilders.',
  },
  {
    from: 1670,
    title: '1670: Rembrandt is dead',
    text: 'Rembrandt died in Amsterdam on 4 October 1669 and was buried in a rented grave in the Westerkerk. Jan Steen moves back to Leiden, his home town.',
  },
  {
    from: 1672,
    title: '1672: The Disaster Year',
    text: 'France, England and two German bishops attack the Republic at once, and the market for paintings collapses. The marine painters Willem van de Velde, father and son, leave for London to work for King Charles II.',
  },
  {
    from: 1676,
    title: '1676: Vermeer is dead',
    text: 'Vermeer died in Delft in December 1675, aged 43, leaving his wife with eleven children and debts. She said that in the war with France he had been unable to sell any of his art.',
  },
  {
    from: 1679,
    title: '1679: Jordaens and Steen are dead',
    text: 'Jacob Jordaens, the last of the great Antwerp painters of Rubens’s time, died in October 1678. Jan Steen was buried in Leiden in February 1679.',
  },
  {
    from: 1682,
    title: '1682: The end of an age',
    text: 'Jacob van Ruisdael died in Amsterdam in March 1682. The great age of Dutch painting is over: there are fewer buyers, and painters like Hobbema have taken other jobs.',
  },
]

export const mastersStory: TimeStory = {
  place: 'the Low Countries',
  bounds: [
    [3.2, 50.95],
    [6.2, 52.65],
  ],
  min: MASTERS_MIN,
  max: MASTERS_MAX,
  format: String,
  events: mastersEvents,
  lines: mastersLines,
  sites: mastersSites,
  labels: mastersLabels,
  note: 'Each painter is drawn in the town where they worked, at the stages they are known to be there; the routes are approximate.',
  key: [
    { swatch: 'key-workshop', text: "A painter's workshop" },
    { swatch: 'key-flow', text: 'Painters on the move' },
    { swatch: 'key-market', text: 'Art fair' },
  ],
}
