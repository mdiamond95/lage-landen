// The sport map for Unit 23: where the great races, games and clubs of the Low Countries began,
// from Pim Mulier's dream of a tour past the eleven towns of Friesland in 1890 to the Dutch women
// winning the European Championship at home in 2017. Each mark appears in the year it is first
// known, in the colour and shape of its sport: a wheel for cycling, a ball for football and
// korfball, a skate for the ice and a flame for the Olympic Games. Coordinates are [lon, lat].

import type { HistEvent, HistLabel, HistSite, TimeStory } from './timeline'

export const SPORT_MIN = 1890
export const SPORT_MAX = 2017

const by = ([lon, lat]: [number, number], dlon: number, dlat: number): [number, number] => [lon + dlon, lat + dlat]
const P = {
  witmarsum: [5.47, 53.1],
  liege: [5.575, 50.635],
  amsterdam: [4.893, 52.373],
  leeuwarden: [5.795, 53.2],
  ghent: [3.717, 51.054],
  antwerp: [4.401, 51.22],
  meerssen: [5.75, 50.887],
  heerenveen: [5.92, 52.96],
  woluwe: [4.43, 50.835],
  rotterdam: [4.479, 51.922],
  heysel: [4.34, 50.896],
  oudenaarde: [3.6, 50.845],
  enschede: [6.837, 52.237],
} satisfies Record<string, [number, number]>

export const sportSites: HistSite[] = [
  { name: 'Eleven towns', kind: 'ice', from: 1890, at: P.witmarsum, label: 'left', note: 'Witmarsum: Pim Mulier, born here, dreams up a skating tour past the eleven towns of Friesland' },
  { name: 'Liège–Bastogne–Liège', kind: 'race', from: 1892, at: P.liege, label: 'right', note: 'Liège: the first race to Bastogne and back, won by Léon Houa, 1892' },
  { name: 'Korfball', kind: 'ball', from: 1902, at: by(P.amsterdam, -0.06, 0.05), label: 'left', note: 'Amsterdam: the teacher Nico Broekhuysen invents a ball game for boys and girls together, 1902' },
  { name: 'Elfstedentocht', kind: 'ice', from: 1909, at: P.leeuwarden, label: 'right', note: 'Leeuwarden: the first Elfstedentocht, 2 January 1909, won by Minne Hoekstra in 13 hours 50 minutes' },
  { name: 'Tour of Flanders', kind: 'race', from: 1913, at: P.ghent, label: 'left', note: 'Ghent: 37 riders start the first Tour of Flanders, 25 May 1913' },
  { name: 'Antwerp 1920', kind: 'games', from: 1920, at: P.antwerp, label: 'right', note: 'Antwerp: the Olympic Games of 1920, the first with the Olympic flag and the athletes’ oath' },
  { name: 'Amsterdam 1928', kind: 'games', from: 1928, at: by(P.amsterdam, 0.06, -0.05), label: 'right', note: 'Amsterdam: the Olympic Games of 1928, the first with the Olympic flame' },
  { name: 'Flying Housewife', kind: 'games', from: 1948, at: by(P.amsterdam, -0.07, -0.08), label: 'left', note: 'Amsterdam welcomes home Fanny Blankers-Koen, four times Olympic champion in London, 1948' },
  { name: 'Grand Départ', kind: 'race', from: 1954, at: by(P.amsterdam, 0.08, 0.06), label: 'right', note: 'Amsterdam: the Tour de France starts outside France for the first time, 8 July 1954' },
  { name: 'Amstel Gold Race', kind: 'race', from: 1966, at: P.meerssen, label: 'right', note: 'Meerssen: finish of the first Amstel Gold Race, from Breda, 1966' },
  { name: 'Thialf', kind: 'ice', from: 1967, at: P.heerenveen, label: 'right', note: 'Heerenveen: the Thialf ice rink opens in the open air, 1967; it gets a roof in 1986' },
  { name: 'Merckx', kind: 'race', from: 1969, at: P.woluwe, label: 'right', note: 'Woluwe-Saint-Pierre, where Eddy Merckx grew up: he wins his first Tour de France, 1969' },
  { name: 'Feyenoord', kind: 'ball', from: 1970, at: P.rotterdam, label: 'left', note: 'Rotterdam: Feyenoord, the first Dutch club to win the European Cup, 1970' },
  { name: 'Ajax', kind: 'ball', from: 1971, at: by(P.amsterdam, 0.1, -0.02), label: 'right', note: 'Amsterdam: Ajax wins the European Cup three years running, 1971 to 1973' },
  { name: 'Heysel', kind: 'memorial', from: 1985, at: P.heysel, label: 'left', note: 'Brussels: 39 people die at the Heysel stadium before the European Cup final, 29 May 1985' },
  { name: 'Oudenaarde', kind: 'race', from: 2012, at: P.oudenaarde, label: 'left', note: 'Oudenaarde: the Tour of Flanders finishes here from 2012' },
  { name: 'European champions', kind: 'ball', from: 2017, at: P.enschede, label: 'left', note: 'Enschede: the Dutch women win the European Championship final at home, 6 August 2017' },
]

export const sportLabels: HistLabel[] = [
  { text: 'NETHERLANDS', kind: 'territory', from: SPORT_MIN, at: [6.2, 52.75] },
  { text: 'BELGIUM', kind: 'territory', from: SPORT_MIN, at: [4.9, 50.45] },
  { text: 'NORTH SEA', kind: 'water', from: SPORT_MIN, at: [3.4, 52.6] },
  { text: 'GERMAN OCCUPATION', kind: 'alert', from: 1940, to: 1947, at: [5.0, 51.55] },
  { text: '1963: −18 °C ON THE ICE', kind: 'alert', from: 1963, to: 1984, at: [5.6, 53.45] },
  { text: 'THE LAST ELFSTEDENTOCHT, SO FAR', kind: 'alert', from: 1997, at: [5.5, 53.45] },
]

export const sportEvents: HistEvent[] = [
  {
    from: 1890,
    title: '1890: Eleven towns',
    text: 'Pim Mulier, a Frisian who brought football, athletics and other English sports to the Netherlands, comes up with the idea of a tour on skates past the eleven towns of Friesland.',
  },
  {
    from: 1892,
    title: '1892: The old lady',
    text: 'The first Liège–Bastogne–Liège, a race through the Ardennes and back, is won by Léon Houa. It is the oldest of the great one-day races: La Doyenne.',
  },
  {
    from: 1902,
    title: '1902: Korfball',
    text: 'Nico Broekhuysen, a teacher in Amsterdam, brings home a Swedish game and turns it into korfball: men and women play in one team, shooting at a basket on a pole.',
  },
  {
    from: 1909,
    title: '1909: The first Elfstedentocht',
    text: 'On 2 January 1909, 23 skaters start from Leeuwarden on the first Elfstedentocht, about 200 km past the eleven towns. Minne Hoekstra wins in 13 hours and 50 minutes.',
  },
  {
    from: 1913,
    title: '1913: The Tour of Flanders',
    text: 'The sports paper Sportwereld sends 37 riders out of Ghent on the first Tour of Flanders, 330 km of Flemish roads. Paul Deman wins a sprint of six.',
  },
  {
    from: 1920,
    title: '1920: Antwerp’s Games',
    text: 'Two years after the war, Antwerp holds the Olympic Games. For the first time the flag with five rings flies, an athlete swears the oath, and doves are let go. Germany and its allies are not invited.',
  },
  {
    from: 1928,
    title: '1928: Amsterdam’s Games',
    text: 'In Jan Wils’s new stadium in Amsterdam a fire burns in a tower above the Games for the first time: the Olympic flame. Women compete in athletics for the first time, and the Dutch women gymnasts win gold.',
  },
  {
    from: 1940,
    title: '1940: Sport under occupation',
    text: 'The Low Countries are occupied (Unit 11). Races and matches go on with German permission; in the Netherlands, from 1941, Jewish athletes are thrown out of clubs, pools and sports fields. The Elfstedentocht is skated in three winters running, 1940, 1941 and 1942.',
  },
  {
    from: 1948,
    title: '1948: The Flying Housewife',
    text: 'At the London Olympics Fanny Blankers-Koen, 30 years old and the mother of two, wins the 100 m, the 200 m, the 80 m hurdles and the relay. Amsterdam welcomes her home in a carriage behind four white horses.',
  },
  {
    from: 1954,
    title: '1954: The Tour starts in Amsterdam',
    text: 'On 8 July 1954 the Tour de France sets off from the Olympic Stadium in Amsterdam: the first time the Tour starts outside France.',
  },
  {
    from: 1963,
    title: '1963: The hell of ’63',
    text: 'The twelfth Elfstedentocht is skated at −18 °C, into an east wind and drifting snow. Of 10,000 skaters, 69 finish. Reinier Paping wins in 10 hours 59 minutes. Then it does not freeze hard enough again for 22 years.',
  },
  {
    from: 1966,
    title: '1966: Amstel Gold Race',
    text: 'The Amstel brewery sponsors a new classic from Breda to Meerssen, in the hills of South Limburg. It becomes the great one-day race of the Netherlands, climbing the Cauberg again and again.',
  },
  {
    from: 1967,
    title: '1967: Thialf',
    text: 'Heerenveen opens Thialf, an artificial ice rink in the open air. Speed skaters no longer have to wait for a hard winter. In 1986 it gets a roof.',
  },
  {
    from: 1969,
    title: '1969: The Cannibal',
    text: 'Eddy Merckx, who grew up in Woluwe-Saint-Pierre near Brussels, wins his first Tour de France, and every jersey there is to win. Belgium has waited 30 years for a winner.',
  },
  {
    from: 1970,
    title: '1970: Feyenoord',
    text: 'Feyenoord of Rotterdam beats Celtic 2–1 in Milan and becomes the first Dutch club to win the European Cup.',
  },
  {
    from: 1971,
    title: '1971: Ajax',
    text: 'Ajax of Amsterdam, playing Total Football with Johan Cruijff, wins the European Cup at Wembley, and again in 1972 and 1973.',
  },
  {
    from: 1985,
    title: '1985: Heysel',
    text: 'Before the European Cup final in Brussels, Liverpool fans charge at Juventus fans, and a wall collapses. Thirty-nine people die. English clubs are banned from Europe for five years.',
  },
  {
    from: 1997,
    title: '1997: The last Elfstedentocht, so far',
    text: 'On 4 January 1997 about 16,700 skaters, 301 racers and over 16,400 touring skaters, set out on the fifteenth Elfstedentocht. Henk Angenent wins in 6 hours 49 minutes. Winters have been too mild for another ever since.',
  },
  {
    from: 2012,
    title: '2012: Oudenaarde',
    text: 'The Tour of Flanders moves its finish to Oudenaarde, in the hills of the Flemish Ardennes, after the Oude Kwaremont and the Paterberg.',
  },
  {
    from: 2017,
    title: '2017: Champions at home',
    text: 'The Dutch women win the European Championship in their own country, beating Denmark 4–2 in the final at Enschede.',
  },
]

export const sportStory: TimeStory = {
  place: 'the Low Countries',
  bounds: [
    [2.5, 49.95],
    [6.95, 53.45],
  ],
  min: SPORT_MIN,
  max: SPORT_MAX,
  format: String,
  events: sportEvents,
  lines: [],
  sites: sportSites,
  labels: sportLabels,
  note: 'Each mark appears in the year it is first known, in the colour of its sport.',
  key: [
    { swatch: 'key-race', text: 'Cycling' },
    { swatch: 'key-ball', text: 'Football and korfball' },
    { swatch: 'key-ice', text: 'Skating' },
    { swatch: 'key-games', text: 'Olympic Games' },
    { swatch: 'key-memorial', text: 'Disaster' },
  ],
}
