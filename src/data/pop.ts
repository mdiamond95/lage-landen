// The pop culture map for Unit 24: where the comics, the music and the films of the Low Countries
// began, from Tintin's first strip in Brussels in 1929 to the Eurovision Song Contest in Rotterdam
// in 2021. Each mark appears in the year it is first known, in the colour and shape of its art: a
// speech balloon for a comic strip, a note for music, a frame of film for cinema and television,
// and a temple front for a museum. Coordinates are [lon, lat].

import type { HistEvent, HistLabel, HistSite, TimeStory } from './timeline'

export const POP_MIN = 1929
export const POP_MAX = 2021

const by = ([lon, lat]: [number, number], dlon: number, dlat: number): [number, number] => [lon + dlon, lat + dlat]
const P = {
  brussels: [4.352, 50.846],
  marcinelle: [4.44, 50.39],
  amsterdam: [4.893, 52.373],
  antwerp: [4.401, 51.22],
  liberchies: [4.42, 50.51],
  sintNiklaas: [4.143, 51.165],
  ixelles: [4.37, 50.83],
  utrecht: [5.121, 52.09],
  hilversum: [5.176, 52.223],
  hague: [4.3, 52.08],
  rotterdam: [4.479, 51.922],
  almere: [5.214, 52.37],
  seraing: [5.5, 50.6],
  boom: [4.366, 51.088],
  louvainLaNeuve: [4.615, 50.668],
  dinant: [4.912, 50.26],
  enschede: [6.893, 52.221],
  hellevoetsluis: [4.133, 51.833],
  haarlem: [4.636, 52.381],
} satisfies Record<string, [number, number]>

export const popSites: HistSite[] = [
  { name: 'Tintin', kind: 'strip', from: 1929, at: by(P.brussels, -0.1, 0.06), label: 'left', note: 'Brussels: Hergé’s Tintin sets off for the land of the Soviets in Le Petit Vingtième, 10 January 1929' },
  { name: 'Django Reinhardt', kind: 'music', from: 1934, at: P.liberchies, label: 'left', note: 'Liberchies, where Django Reinhardt was born in 1910: in Paris he founds the Quintette du Hot Club de France, 1934' },
  { name: 'Spirou', kind: 'strip', from: 1938, at: P.marcinelle, label: 'right', note: 'Marcinelle: the publisher Dupuis brings out the first Spirou magazine, 21 April 1938' },
  { name: 'Tom Poes', kind: 'strip', from: 1941, at: P.amsterdam, label: 'left', note: 'Amsterdam: Marten Toonder’s Tom Poes appears in De Telegraaf, 16 March 1941' },
  { name: 'Suske en Wiske', kind: 'strip', from: 1945, at: P.antwerp, label: 'right', note: 'Antwerp, home of Willy Vandersteen: Suske en Wiske begins in De Nieuwe Standaard, 30 March 1945' },
  { name: 'Kuifje', kind: 'strip', from: 1946, at: by(P.brussels, 0.1, 0.06), label: 'right', note: 'Brussels: Tintin gets a magazine of his own, in French and, as Kuifje, in Dutch, 26 September 1946' },
  { name: 'Lucky Luke', kind: 'strip', from: 1946, at: by(P.marcinelle, -0.14, -0.06), label: 'left', note: 'Marcinelle: Morris’s Lucky Luke first rides in Spirou, 1946' },
  { name: 'Nero', kind: 'strip', from: 1947, at: P.sintNiklaas, label: 'left', note: 'Sint-Niklaas, where Marc Sleen was born: his Nero begins in De Nieuwe Gids, 1947' },
  { name: 'Audrey Hepburn', kind: 'film', from: 1954, at: by(P.ixelles, 0.02, -0.08), label: 'right', note: 'Ixelles, where Audrey Hepburn was born in 1929: she wins an Oscar for Roman Holiday, 1954' },
  { name: 'Nijntje', kind: 'strip', from: 1955, at: P.utrecht, label: 'right', note: 'Utrecht: Dick Bruna draws the first book of Nijntje, Miffy, 1955' },
  { name: 'Eurovision', kind: 'music', from: 1957, at: P.hilversum, label: 'right', note: 'Hilversum, home of Dutch radio and television: Corry Brokken wins the Eurovision Song Contest, 1957, and Hilversum holds it in 1958' },
  { name: 'Smurfs', kind: 'strip', from: 1958, at: by(P.marcinelle, 0.14, -0.06), label: 'right', note: 'Marcinelle: Peyo’s Smurfs first appear in Spirou, 23 October 1958' },
  { name: 'Jacques Brel', kind: 'music', from: 1962, at: by(P.brussels, 0.02, 0.14), label: 'right', note: 'Brussels, where Jacques Brel was born in 1929: he records Le plat pays, 1962' },
  { name: 'Golden Earring', kind: 'music', from: 1973, at: P.hague, label: 'left', note: 'The Hague: Golden Earring’s Radar Love reaches the American top twenty, 1973' },
  { name: 'Teach-In', kind: 'music', from: 1975, at: P.enschede, label: 'left', note: 'Enschede, home of the band: Teach-In win the Eurovision Song Contest for the Netherlands with Ding-a-dong, 1975' },
  { name: 'Sandra Kim', kind: 'music', from: 1986, at: by(P.brussels, 0.17, -0.07), label: 'right', note: 'Brussels holds the Eurovision Song Contest of 1987, after Sandra Kim, 13 years old, wins Belgium’s only one in 1986' },
  { name: 'The Assault', kind: 'film', from: 1987, at: P.haarlem, label: 'left', note: 'Haarlem, where the story is set: Fons Rademakers’s De Aanslag, The Assault, wins the first Oscar for a Dutch feature film, 1987' },
  { name: 'Comic Strip Center', kind: 'museum', from: 1989, at: by(P.brussels, -0.14, -0.06), label: 'left', note: 'Brussels: the Belgian Comic Strip Center opens in Victor Horta’s Waucquez store, 6 October 1989' },
  { name: 'Big Brother', kind: 'film', from: 1999, at: P.almere, label: 'right', note: 'Almere: Big Brother, John de Mol’s house full of cameras, goes on air, 16 September 1999' },
  { name: 'Rosetta', kind: 'film', from: 1999, at: P.seraing, label: 'right', note: 'Seraing: the Dardenne brothers’ Rosetta, filmed here, wins the Palme d’Or at Cannes, 1999' },
  { name: 'Tomorrowland', kind: 'music', from: 2005, at: P.boom, label: 'left', note: 'Boom: the first Tomorrowland, a dance festival for about 10,000 people, 2005' },
  { name: 'Hergé Museum', kind: 'museum', from: 2009, at: P.louvainLaNeuve, label: 'right', note: 'Louvain-la-Neuve: the Hergé Museum opens, 2009' },
  { name: 'Adolphe Sax', kind: 'music', from: 2014, at: P.dinant, label: 'right', note: 'Dinant, where Adolphe Sax was born in 1814: the town keeps his 200th birthday, 2014' },
  { name: 'Arcade', kind: 'music', from: 2019, at: P.hellevoetsluis, label: 'left', note: 'Hellevoetsluis, where Duncan Laurence grew up: he wins the Eurovision Song Contest for the Netherlands with Arcade, 2019' },
  { name: 'Ahoy', kind: 'music', from: 2021, at: by(P.rotterdam, 0.1, 0.02), label: 'right', note: 'Rotterdam: the Eurovision Song Contest at Ahoy, a year late, May 2021' },
]

export const popLabels: HistLabel[] = [
  { text: 'NETHERLANDS', kind: 'territory', from: POP_MIN, at: [6.2, 52.75] },
  { text: 'BELGIUM', kind: 'territory', from: POP_MIN, at: [4.9, 50.05] },
  { text: 'NORTH SEA', kind: 'water', from: POP_MIN, at: [3.4, 52.6] },
  { text: 'GERMAN OCCUPATION', kind: 'alert', from: 1940, to: 1944, at: [5.0, 51.55] },
]

export const popEvents: HistEvent[] = [
  {
    from: 1929,
    title: '1929: Tintin sets off',
    text: 'On 10 January 1929 a boy reporter and his white dog leave for the Soviet Union in Le Petit Vingtième, the children’s pages of a Catholic paper in Brussels. Georges Remi signs as Hergé, his initials the wrong way round.',
  },
  {
    from: 1934,
    title: '1934: Django’s Hot Club',
    text: 'Django Reinhardt, a Manouche guitarist born in a caravan at Liberchies, near Charleroi, plays jazz with two burnt fingers. In Paris he and the violinist Stéphane Grappelli found the Quintette du Hot Club de France.',
  },
  {
    from: 1938,
    title: '1938: Spirou',
    text: 'The publisher Dupuis of Marcinelle, near Charleroi, brings out a weekly for children named after its hero, a bellboy called Spirou: in Walloon, a squirrel or a lively kid. A Dutch edition, Robbedoes, follows in October.',
  },
  {
    from: 1940,
    title: '1940: Comics under occupation',
    text: 'The Low Countries are occupied. American strips disappear from the papers. Hergé goes on drawing Tintin for Le Soir, which the Germans control; in Amsterdam, Marten Toonder’s Tom Poes starts in De Telegraaf in 1941.',
  },
  {
    from: 1941,
    title: '1941: Tom Poes',
    text: 'On 16 March 1941 a small white cat called Tom Poes appears in De Telegraaf. His friend, the vain and kind bear Olivier B. Bommel, soon takes over. Toonder adds new words to Dutch, like minkukel, a nitwit.',
  },
  {
    from: 1945,
    title: '1945: Suske en Wiske',
    text: 'On 30 March 1945, with V-bombs still falling on Antwerp, Willy Vandersteen starts a strip in De Nieuwe Standaard. Its heroes, Suske and Wiske, become Spike and Suzy in English, and the best-selling comic of Flanders.',
  },
  {
    from: 1946,
    title: '1946: Tintin gets a magazine',
    text: 'On 26 September 1946 Hergé and the publisher Raymond Leblanc bring out the weekly Tintin, and Kuifje in Dutch. In Spirou, Morris’s cowboy Lucky Luke rides for the first time. The great age of Belgian comics begins.',
  },
  {
    from: 1947,
    title: '1947: Nero',
    text: 'Marc Sleen starts a strip in De Nieuwe Gids about a detective; a lazy, big-hearted man called Nero steals the show. Sleen writes and draws it for 55 years, until 2002.',
  },
  {
    from: 1954,
    title: '1954: Audrey Hepburn’s Oscar',
    text: 'Audrey Hepburn, born in Ixelles in 1929 to a Dutch mother, who lived through the war in Arnhem, wins the Oscar for best actress for Roman Holiday.',
  },
  {
    from: 1955,
    title: '1955: Nijntje',
    text: 'In Utrecht the designer Dick Bruna draws a little white rabbit for his son: Nijntje, from konijntje, little rabbit. In English she becomes Miffy, in more than 50 languages in all.',
  },
  {
    from: 1957,
    title: '1957: Eurovision',
    text: 'The Netherlands and Belgium were two of the seven countries at the first Eurovision Song Contest in 1956. In 1957 Corry Brokken wins it for the Netherlands with Net als toen, and Hilversum holds the contest in 1958.',
  },
  {
    from: 1958,
    title: '1958: The Smurfs',
    text: 'On 23 October 1958 little blue men in white caps turn up in Peyo’s Johan et Pirlouit, in Spirou. Peyo had called them schtroumpfs at dinner, when he could not think of the word for salt. In Dutch, and then English, they are Smurfs.',
  },
  {
    from: 1962,
    title: '1962: Le plat pays',
    text: 'Jacques Brel, born in Schaerbeek in 1929, records Le plat pays, a song about the flat land of Flanders, the North Sea and the cathedrals for mountains. In 1961 he had sung Marieke, half in French, half in Dutch.',
  },
  {
    from: 1973,
    title: '1973: Radar Love',
    text: 'Golden Earring of The Hague reach number 13 in the United States with Radar Love. At home, Paul Verhoeven’s Turks Fruit, with Rutger Hauer, is seen by more than 3 million people, more than any other Dutch film.',
  },
  {
    from: 1975,
    title: '1975: Ding-a-dong',
    text: 'Teach-In win the Eurovision Song Contest in Stockholm with Ding-a-dong. In Brussels, Chantal Akerman films Jeanne Dielman, three days of a widow’s life; in 2022 critics name it the greatest film ever made.',
  },
  {
    from: 1986,
    title: '1986: J’aime la vie',
    text: 'Sandra Kim, 13 years old, though her song said 15, wins the Eurovision Song Contest for Belgium with J’aime la vie. It is Belgium’s only win, and Brussels holds the contest in 1987.',
  },
  {
    from: 1987,
    title: '1987: An Oscar for The Assault',
    text: 'Fons Rademakers’s De Aanslag, from Harry Mulisch’s novel about a family killed in reprisal in the Hunger Winter, wins the Oscar for a foreign-language film. Antonia’s Line follows in 1996 and Character in 1998.',
  },
  {
    from: 1989,
    title: '1989: The Comic Strip Center',
    text: 'On 6 October 1989 the Belgian Comic Strip Center opens in Brussels, in the Waucquez textile store that Victor Horta built in 1906. Hergé had asked that it honour all Belgian comics, not him alone.',
  },
  {
    from: 1999,
    title: '1999: Big Brother and Rosetta',
    text: 'On 16 September 1999 Big Brother goes on air from a house in Almere, John de Mol’s idea of strangers filmed day and night. Its format goes round the world. In Cannes, the Dardenne brothers win the Palme d’Or with Rosetta.',
  },
  {
    from: 2005,
    title: '2005: Tomorrowland',
    text: 'About 10,000 people come to the first Tomorrowland, a dance festival in the park of De Schorre at Boom, near Antwerp. It grows into one of the largest in the world.',
  },
  {
    from: 2009,
    title: '2009: The Hergé Museum',
    text: 'The Hergé Museum opens in Louvain-la-Neuve. The same year Stromae, a Brussels singer with a Rwandan father and a Flemish mother, has a hit across Europe with Alors on danse.',
  },
  {
    from: 2014,
    title: '2014: Sax at 200',
    text: 'Dinant keeps the 200th birthday of Adolphe Sax, who invented the saxophone in the early 1840s and patented it in 1846. A giant of Sax, carried in the town’s parades like the giants of Ath, is made for the year.',
  },
  {
    from: 2019,
    title: '2019: Arcade',
    text: 'Duncan Laurence wins the Eurovision Song Contest for the Netherlands with Arcade, the country’s fifth win.',
  },
  {
    from: 2021,
    title: '2021: Rotterdam, a year late',
    text: 'The contest of 2020, due in Rotterdam, was called off for the pandemic. In May 2021 it is held at Ahoy, with a small audience and tests at the door.',
  },
]

export const popStory: TimeStory = {
  place: 'the Low Countries',
  bounds: [
    [2.5, 49.95],
    [6.95, 53.45],
  ],
  min: POP_MIN,
  max: POP_MAX,
  format: String,
  events: popEvents,
  lines: [],
  sites: popSites,
  labels: popLabels,
  note: 'Each mark appears in the year it is first known, in the colour of its art.',
  key: [
    { swatch: 'key-strip', text: 'Comics' },
    { swatch: 'key-music', text: 'Music' },
    { swatch: 'key-film', text: 'Film and television' },
    { swatch: 'key-museum', text: 'Museum' },
  ],
}
