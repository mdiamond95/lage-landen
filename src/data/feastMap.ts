// The feast map for Unit 22: where the feasts and traditions of the Low Countries began or were
// first written down, from the Holy Blood procession going round the walls of Bruges in 1303 to the
// king's apology for slavery on Keti Koti in 2023. Each mark appears in the year it is first known,
// in the colour and shape of its kind on the calendar wheel. Coordinates are [lon, lat].

import type { HistEvent, HistLabel, HistSite, TimeStory } from './timeline'

export const FEAST_MIN = 1303
export const FEAST_MAX = 2023

const by = ([lon, lat]: [number, number], dlon: number, dlat: number): [number, number] => [lon + dlon, lat + dlat]
const P = {
  bruges: [3.225, 51.209],
  brussels: [4.352, 50.847],
  binche: [4.165, 50.411],
  nivelles: [4.324, 50.598],
  antwerp: [4.401, 51.22],
  leiden: [4.49, 52.16],
  haarlem: [4.636, 52.381],
  amsterdam: [4.893, 52.373],
  utrecht: [5.122, 52.091],
  soestdijk: [5.297, 52.19],
  ypres: [2.885, 50.851],
  wageningen: [5.665, 51.969],
  ath: [3.778, 50.63],
  mons: [3.952, 50.454],
  aalst: [4.039, 50.938],
} satisfies Record<string, [number, number]>

export const feastSites: HistSite[] = [
  { name: 'Holy Blood procession', kind: 'procession', from: 1303, at: P.bruges, label: 'left', note: 'Bruges: by 1303 the relic of the Holy Blood is carried round the new town walls' },
  { name: 'Our Lady of the Sablon', kind: 'procession', from: 1348, at: P.brussels, label: 'right', note: 'Brussels: a woman of Antwerp brings a statue of Mary by boat, so the story goes, and the Ommegang begins' },
  { name: 'Carnival of Binche', kind: 'carnival', from: 1394, at: P.binche, label: 'right', note: 'Binche: the first written record of the carnival, 1394' },
  { name: 'Goliath of Nivelles', kind: 'procession', from: 1457, at: P.nivelles, label: 'right', note: 'Nivelles: the oldest giant on record, 1457' },
  { name: 'Doudou of Mons', kind: 'procession', from: FEAST_MIN, at: P.mons, label: 'left', note: 'Mons: the procession of Saint Waltrude, first mentioned in 1248; later Saint George fights the dragon on Trinity Sunday' },
  { name: 'Giants of Ath', kind: 'procession', from: 1481, at: P.ath, label: 'left', note: 'Ath: the procession is recorded from 1399, its giant Goliath from 1481' },
  { name: 'Procession of Our Lady', kind: 'procession', from: 1520, at: P.antwerp, label: 'right', note: 'Antwerp: Albrecht Dürer watches the great procession on 19 August 1520' },
  { name: 'Carnival and Lent', kind: 'carnival', from: 1559, at: by(P.antwerp, -0.12, -0.06), label: 'left', note: 'Antwerp: Pieter Bruegel paints the feast before Lent fighting the fast, 1559' },
  { name: '3 October', kind: 'memory', from: 1574, at: P.leiden, label: 'left', note: 'Leiden: the siege ends on 3 October 1574, and the town still keeps the day' },
  { name: 'Isabella’s Ommegang', kind: 'nation', from: 1615, at: by(P.brussels, 0.1, 0.06), label: 'right', note: 'Brussels: Archduchess Isabella shoots down the bird at the Sablon, and the Ommegang of 31 May 1615 honours her' },
  { name: 'Feast of Saint Nicholas', kind: 'saint', from: 1665, at: P.haarlem, label: 'left', note: 'Haarlem: Jan Steen paints a family on the morning of Saint Nicholas, about 1665' },
  { name: 'Gilles', kind: 'carnival', from: 1795, at: by(P.binche, 0.06, -0.08), label: 'right', note: 'Binche: the Gilles first appear in writing, when the French revolutionary government tries to ban masks, 1795' },
  { name: '21 July', kind: 'nation', from: 1831, at: by(P.brussels, -0.1, -0.05), label: 'left', note: 'Brussels: Leopold I swears the oath as King of the Belgians, 21 July 1831' },
  { name: 'Steamboat from Spain', kind: 'saint', from: 1850, at: P.amsterdam, label: 'right', note: 'Amsterdam: the teacher Jan Schenkman’s picture book brings the saint by steamboat, 1850' },
  { name: 'King’s Feast', kind: 'nation', from: 1866, at: by(P.brussels, 0.12, -0.08), label: 'right', note: 'Brussels: the King’s Feast on 15 November, kept since 1866' },
  { name: 'Princess’s Day', kind: 'nation', from: 1885, to: 1948, at: P.utrecht, label: 'right', note: 'Utrecht: the first Princess’s Day, Wilhelmina’s fifth birthday, 31 August 1885; Queen’s Day from 1891' },
  { name: 'Last Post', kind: 'memory', from: 1928, at: P.ypres, label: 'left', note: 'Ypres: buglers play the Last Post under the Menin Gate every evening, from 1928' },
  { name: 'Liberation Day', kind: 'memory', from: 1945, at: P.wageningen, label: 'right', note: 'Wageningen: the German surrender is signed on 5 May 1945' },
  { name: 'Queen’s Day, 30 April', kind: 'nation', from: 1949, to: 2013, at: P.soestdijk, label: 'right', note: 'Soestdijk: Queen Juliana’s birthday, 30 April, is Queen’s Day from 1949; Beatrix keeps the date' },
  { name: 'Slavery monument', kind: 'memory', from: 2002, at: by(P.amsterdam, 0.06, -0.08), label: 'right', note: 'Amsterdam: the National Slavery Monument in the Oosterpark, unveiled on 1 July 2002' },
  { name: 'Aalst on UNESCO’s list', kind: 'carnival', from: 2010, to: 2018, at: P.aalst, label: 'left', note: 'Aalst: on UNESCO’s list in 2010, off it in 2019' },
  { name: 'King’s Day, 27 April', kind: 'nation', from: 2014, at: by(P.amsterdam, -0.08, 0.06), label: 'left', note: 'The Netherlands: King Willem-Alexander’s birthday, 27 April, from 2014' },
  { name: 'An apology', kind: 'memory', from: 2023, at: by(P.amsterdam, 0.14, 0.04), label: 'right', note: 'Amsterdam: on Keti Koti, 1 July 2023, King Willem-Alexander apologises for slavery' },
]

export const feastLabels: HistLabel[] = [
  { text: 'NORTH SEA', kind: 'water', from: FEAST_MIN, at: [3.4, 52.6] },
  { text: 'NETHERLANDS', kind: 'territory', from: 1831, at: [6.2, 52.75] },
  { text: 'BELGIUM', kind: 'territory', from: 1831, at: [5.4, 50.25] },
  { text: 'SLAVERY ABOLISHED IN SURINAME AND THE CARIBBEAN', kind: 'alert', from: 1863, to: 1872, at: [3.6, 53.0] },
  { text: 'TEN YEARS OF FORCED WORK END', kind: 'alert', from: 1873, to: 1884, at: [3.6, 53.0] },
  { text: 'ZWARTE PIET DEBATE', kind: 'alert', from: 2015, at: [5.9, 52.85] },
  { text: 'UNESCO: AALST OFF THE LIST', kind: 'alert', from: 2019, to: 2022, at: [3.3, 50.15] },
]

export const feastEvents: HistEvent[] = [
  {
    from: 1303,
    title: '1303: The Holy Blood goes round Bruges',
    text: 'Bruges keeps a relic of the Holy Blood, recorded from 1256. By 1303 it is carried in procession right round the new town walls: a feast of the church and of the whole town.',
  },
  {
    from: 1348,
    title: '1348: A statue comes to Brussels',
    text: 'The story goes that Beatrijs Soetkens of Antwerp, told in a vision, took a statue of Mary by boat to Brussels. It was set up in the church of the crossbowmen on the Sablon, and their procession, the Ommegang, grew from it.',
  },
  {
    from: 1394,
    title: '1394: Carnival in Binche',
    text: 'The first written record of the carnival of Binche, in Hainaut, falls in 1394. Carnival is the feast before Lent, the forty days of fasting before Easter.',
  },
  {
    from: 1457,
    title: '1457: The first giant',
    text: 'Nivelles records a giant called Goliath in 1457, the oldest on record. Towns of the south build giants of wood and wicker, carried by men hidden inside, to walk in their processions.',
  },
  {
    from: 1481,
    title: '1481: Goliath of Ath',
    text: 'The procession of Ath, recorded from 1399, gains a giant Goliath in 1481. From 1487 he fights David in the square, and in Ath he still does, on the fourth weekend of August.',
  },
  {
    from: 1520,
    title: '1520: Dürer at the procession',
    text: 'On 19 August 1520 the German painter Albrecht Dürer watches the great procession of Antwerp go by for more than two hours: every guild with its sign, the clergy, wagons with scenes from the Bible, and a dragon.',
  },
  {
    from: 1549,
    title: '1549: An Ommegang for the emperor',
    text: 'Emperor Charles V and his son Philip tour the Netherlands, and Brussels holds its Ommegang in their honour. The Ommegang of today replays this one.',
  },
  {
    from: 1559,
    title: '1559: Carnival against Lent',
    text: 'In Antwerp Pieter Bruegel paints the feast before Lent fighting the fast: a fat man on a barrel against a thin woman with herring.',
  },
  {
    from: 1574,
    title: '1574: 3 October',
    text: 'The Spanish siege of Leiden ends on 3 October 1574 (Unit 5). Leiden has kept the day as its feast ever since, with herring, white bread and hutspot.',
  },
  {
    from: 1615,
    title: '1615: Isabella shoots the bird',
    text: 'On 15 May 1615 the Archduchess Isabella shoots down the wooden bird from the spire of the Sablon church at the crossbowmen’s contest, and becomes their queen. The Ommegang of 31 May honours her, and she has it painted.',
  },
  {
    from: 1665,
    title: 'About 1665: The feast of Saint Nicholas',
    text: 'In Haarlem Jan Steen paints a family on the morning of Saint Nicholas: shoes, sweets, a doll, and a boy in tears. The Republic is Protestant, but families keep the saint’s feast at home.',
  },
  {
    from: 1795,
    title: '1795: The Gilles',
    text: 'When the French revolutionary government tries to ban masks, a text names the masked Gilles of Binche for the first time.',
  },
  {
    from: 1831,
    title: '1831: 21 July',
    text: 'On 21 July 1831 Leopold of Saxe-Coburg swears the oath in Brussels as the first King of the Belgians (Unit 9). The day becomes Belgium’s national day.',
  },
  {
    from: 1850,
    title: '1850: A steamboat from Spain',
    text: 'In Amsterdam the teacher Jan Schenkman publishes a picture book in verse, Sint Nikolaas en zijn knecht. In it the saint arrives by steamboat, with a black servant, the figure that became Zwarte Piet.',
  },
  {
    from: 1863,
    title: '1 July 1863: Slavery is abolished',
    text: 'The Netherlands abolishes slavery in Suriname and the Dutch Caribbean. The owners are paid for each person freed; the people freed are paid nothing, and in Suriname most must work on for ten more years under state supervision.',
  },
  {
    from: 1866,
    title: '1866: The King’s Feast',
    text: 'Belgium keeps 15 November as the King’s Feast, with a Te Deum in the cathedral of Brussels.',
  },
  {
    from: 1873,
    title: '1873: Free at last',
    text: 'The ten years of state supervision end. Many of the freed people of Suriname leave the plantations for Paramaribo.',
  },
  {
    from: 1885,
    title: '1885: Princess’s Day',
    text: 'Utrecht holds a Princess’s Day on 31 August 1885, the fifth birthday of Princess Wilhelmina. When she becomes queen in 1890 it is renamed Queen’s Day.',
  },
  {
    from: 1928,
    title: '1928: The Last Post',
    text: 'At the Menin Gate in Ypres, the buglers of the fire brigade play the Last Post every evening for the soldiers who died in the Ypres Salient (Unit 14).',
  },
  {
    from: 1945,
    title: '1945: Liberation',
    text: 'In Wageningen, on 5 May 1945, the German commander in the Netherlands agrees the surrender before a Canadian general. 5 May becomes Liberation Day, the day after the remembrance of 4 May.',
  },
  {
    from: 1949,
    title: '1949: Queen’s Day on 30 April',
    text: 'Juliana became queen in 1948, and from 1949 Queen’s Day moves to her birthday, 30 April. Her daughter Beatrix, born on 31 January, keeps the date from 1980.',
  },
  {
    from: 2002,
    title: '2002: A monument in the Oosterpark',
    text: 'On 1 July 2002 the National Slavery Monument is unveiled in Amsterdam’s Oosterpark. It becomes the heart of Keti Koti in the Netherlands.',
  },
  {
    from: 2003,
    title: '2003: Binche on UNESCO’s list',
    text: 'UNESCO names the carnival of Binche a Masterpiece of the Oral and Intangible Heritage of Humanity.',
  },
  {
    from: 2005,
    title: '2005: Giants and dragons',
    text: 'UNESCO lists the processional giants and dragons of Belgium and France, among them Ath, the Lumeçon of Mons, the Ros Beiaard of Dendermonde, the giants of Mechelen and the Meyboom of Brussels. Belgium has nearly 1,500 giants.',
  },
  {
    from: 2010,
    title: '2010: The carnival of Aalst',
    text: 'UNESCO adds the carnival of Aalst to its list.',
  },
  {
    from: 2014,
    title: '2014: King’s Day',
    text: 'Willem-Alexander became king in 2013, and from 2014 the feast is King’s Day, on his birthday, 27 April.',
  },
  {
    from: 2015,
    title: '2015: Zwarte Piet in question',
    text: 'A United Nations committee writes that Zwarte Piet is experienced by many people of African descent as a vestige of slavery. Over the next years many towns, broadcasters and shops switch to Pieten with soot smudges.',
  },
  {
    from: 2019,
    title: '2019: Off the list',
    text: 'After floats with antisemitic caricatures, Aalst asks UNESCO to take its carnival off the list, and in December UNESCO does: the first time anything is removed. The Ommegang of Brussels joins the list the same year.',
  },
  {
    from: 2023,
    title: '2023: An apology on Keti Koti',
    text: 'On 1 July 2023, 160 years after abolition and 150 after the end of forced work, King Willem-Alexander apologises for slavery at the monument in the Oosterpark.',
  },
]

export const feastStory: TimeStory = {
  place: 'the Low Countries',
  bounds: [
    [2.5, 49.95],
    [6.95, 53.0],
  ],
  min: FEAST_MIN,
  max: FEAST_MAX,
  format: String,
  events: feastEvents,
  lines: [],
  sites: feastSites,
  labels: feastLabels,
  note: 'Each mark appears in the year the feast is first known, in the shape and colour of its kind on the calendar wheel.',
  key: [
    { swatch: 'key-procession', text: 'Procession and giants' },
    { swatch: 'key-carnival', text: 'Carnival' },
    { swatch: 'key-saint', text: 'Saint’s day' },
    { swatch: 'key-nation', text: 'King or nation' },
    { swatch: 'key-memory', text: 'Remembrance and freedom' },
  ],
}
