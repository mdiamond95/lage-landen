// The map for Unit 18: where the modern artists of the Low Countries worked, from Van
// Gogh's first drawings among the miners of the Borinage in 1880 to the opening of the
// Van Gogh Museum in 1973. Each artist is a workshop in the town where they worked, at the
// stages they are known to be there; a stage begins with every change, and an artist who
// has gone fades from the map at the next stage. Exhibition societies are markets; the
// artists' villages of Laren, Domburg and Sint-Martens-Latem are villages; and the museums
// that collected modern art are museums. Years abroad (Paris, Italy, London, New York) are
// arrows off the edge of the map or a line of text along it. Coordinates are [lon, lat].

import type { HistEvent, HistLabel, HistLine, HistSite, TimeStory } from './timeline'

export const MODERNS_MIN = 1880
export const MODERNS_MAX = 1973

const T = {
  borinage: [3.926, 50.436],
  etten: [4.637, 51.569],
  hague: [4.3, 52.078],
  nuenen: [5.551, 51.471],
  antwerp: [4.402, 51.221],
  ostend: [2.918, 51.226],
  brussels: [4.352, 50.847],
  jette: [4.326, 50.877],
  schaerbeek: [4.373, 50.867],
  uccle: [4.337, 50.802],
  boitsfort: [4.418, 50.794],
  amsterdam: [4.9, 52.373],
  laren: [5.223, 52.257],
  domburg: [3.497, 51.564],
  latem: [3.637, 51.02],
  leiden: [4.497, 52.16],
  utrecht: [5.121, 52.091],
  haarlem: [4.636, 52.381],
  baarn: [5.288, 52.212],
  otterlo: [5.817, 52.095],
} satisfies Record<string, [number, number]>

// Moves a mark a little, so two in one town don't sit on top of each other.
const by = ([lon, lat]: [number, number], dlon: number, dlat: number): [number, number] => [lon + dlon, lat + dlat]

// Where the arrows leave the map: south-west for Paris, south-east for Italy.
const PARIS: [number, number] = [2.62, 50.36]
const ITALY: [number, number] = [6.85, 50.36]

export const modernsSites: HistSite[] = [
  { name: 'Vincent van Gogh', kind: 'workshop', from: MODERNS_MIN, to: 1880, at: T.borinage, label: 'right', note: 'the Borinage, 1879 to 1880: a lay preacher among the coal miners, then drawing them' },
  { name: 'Vincent van Gogh', kind: 'workshop', from: 1881, to: 1881, at: T.etten, label: 'right', note: 'Etten, at his parents’ parsonage, April to December 1881' },
  { name: 'Vincent van Gogh', kind: 'workshop', from: 1882, to: 1883, at: T.hague, label: 'left', note: 'The Hague, from the end of 1881 to September 1883; lessons from Anton Mauve' },
  { name: 'Vincent van Gogh', kind: 'workshop', from: 1884, to: 1885, at: T.nuenen, label: 'right', note: 'Nuenen, December 1883 to November 1885, at his parents’ parsonage' },
  { name: 'Anton Mauve', kind: 'workshop', from: MODERNS_MIN, to: 1885, at: by(T.hague, 0, 0.05), label: 'left', note: 'The Hague; a painter of the Hague School, married to a cousin of Van Gogh’s mother' },
  { name: 'Anton Mauve', kind: 'workshop', from: 1886, to: 1887, at: by(T.laren, 0, 0.04), label: 'right', note: 'Laren, from 1885; died in February 1888' },
  { name: 'James Ensor', kind: 'workshop', from: MODERNS_MIN, to: 1948, at: T.ostend, label: 'right', note: 'Ostend, nearly all his life, above his family’s souvenir shop; died 1949' },
  { name: 'Fernand Khnopff', kind: 'workshop', from: MODERNS_MIN, to: 1921, at: by(T.brussels, 0.06, 0.05), label: 'right', note: 'Brussels; a founder of Les XX and a Symbolist; died November 1921' },
  { name: 'Théo van Rysselberghe', kind: 'workshop', from: MODERNS_MIN, to: 1897, at: by(T.brussels, -0.06, 0.05), label: 'left', note: 'Brussels; a founder of Les XX, who took up Seurat’s dots; to Paris in 1898' },
  { name: 'Les XX', kind: 'market', from: 1884, to: 1893, at: T.brussels, label: 'left', note: 'the Twenty: a yearly exhibition of new art in Brussels, 1884 to 1893' },
  { name: 'La Libre Esthétique', kind: 'market', from: 1894, to: 1913, at: T.brussels, label: 'left', note: 'the society that followed Les XX, 1894 to 1914' },
  { name: 'Stedelijk Museum', kind: 'museum', from: 1898, at: by(T.amsterdam, 0.05, -0.04), label: 'right', note: 'Amsterdam’s museum of modern art, opened in 1895' },
  { name: 'Piet Mondriaan', kind: 'workshop', from: 1894, to: 1911, at: T.amsterdam, label: 'left', note: 'Amsterdam, from 1892; summers in Domburg from 1908' },
  { name: 'Piet Mondrian', kind: 'workshop', from: 1914, to: 1918, at: T.laren, label: 'right', note: 'Laren, stuck in the Netherlands by the war, 1914 to 1919' },
  { name: 'Léon Spilliaert', kind: 'workshop', from: 1908, to: 1934, at: by(T.ostend, 0.03, -0.07), label: 'right', note: 'Ostend; dark seashores and empty promenades; to Brussels in 1935' },
  { name: 'Rik Wouters', kind: 'workshop', from: 1908, to: 1913, at: T.boitsfort, label: 'right', note: 'Watermael-Boitsfort, near Brussels, with his wife Nel, his model' },
  { name: 'Rik Wouters', kind: 'workshop', from: 1914, to: 1916, at: by(T.amsterdam, -0.08, 0.04), label: 'left', note: 'interned in the Netherlands after the fall of Antwerp in 1914; died in Amsterdam in July 1916' },
  { name: 'Laren', kind: 'village', from: MODERNS_MIN, to: 1918, at: by(T.laren, 0.02, -0.05), note: 'artists’ village on the heath of the Gooi: Mauve and the Hague School painters, later Mondrian' },
  { name: 'Domburg', kind: 'village', from: 1908, to: 1921, at: T.domburg, label: 'right', note: 'artists’ summers on Walcheren: Toorop, Mondrian; exhibitions from 1911 to 1921' },
  { name: 'Sint-Martens-Latem', kind: 'village', from: 1898, to: 1929, at: T.latem, label: 'right', note: 'village on the Lys near Ghent: first Minne and Van de Woestyne, then Permeke, De Smet and Van den Berghe' },
  { name: 'Theo van Doesburg', kind: 'workshop', from: 1917, to: 1921, at: T.leiden, label: 'left', note: 'Leiden, where he founded De Stijl in 1917; to Weimar in 1921' },
  { name: 'Gerrit Rietveld', kind: 'workshop', from: 1917, to: 1963, at: T.utrecht, label: 'right', note: 'Utrecht; furniture maker and architect; died 1964' },
  { name: 'René Magritte', kind: 'workshop', from: 1917, to: 1926, at: by(T.brussels, 0.02, -0.03), label: 'right', note: 'Brussels, at the academy from 1916, then drawing wallpaper and posters' },
  { name: 'René Magritte', kind: 'workshop', from: 1930, to: 1953, at: T.jette, label: 'left', note: 'Jette, Brussels, 135 rue Esseghem, 1930 to 1954; now a museum' },
  { name: 'René Magritte', kind: 'workshop', from: 1954, to: 1966, at: T.schaerbeek, label: 'right', note: 'Schaerbeek, Brussels, from 1954; died 1967' },
  { name: 'M. C. Escher', kind: 'workshop', from: 1919, to: 1921, at: T.haarlem, label: 'left', note: 'Haarlem, at the School for Architecture and Decorative Arts, 1919 to 1922' },
  { name: 'Samuel Jessurun de Mesquita', kind: 'workshop', from: 1919, to: 1921, at: by(T.haarlem, 0, 0.06), label: 'left', note: 'Haarlem, teaching graphic art; Escher’s teacher' },
  { name: 'Gemeentemuseum', kind: 'museum', from: 1935, at: by(T.hague, 0.02, -0.05), label: 'left', note: 'The Hague’s museum, in its new building by Berlage from 1935; the largest collection of Mondrians' },
  { name: 'M. C. Escher', kind: 'workshop', from: 1937, to: 1940, at: T.uccle, label: 'left', note: 'Uccle, Brussels, 1937 to 1941' },
  { name: 'Kröller-Müller Museum', kind: 'museum', from: 1938, at: T.otterlo, label: 'right', note: 'Otterlo, on the Veluwe, opened in 1938 in a building by Henry van de Velde' },
  { name: 'M. C. Escher', kind: 'workshop', from: 1941, to: 1969, at: T.baarn, label: 'right', note: 'Baarn, 1941 to 1970' },
  { name: 'M. C. Escher', kind: 'workshop', from: 1970, to: 1971, at: by(T.laren, 0, 0.03), label: 'right', note: 'Laren, at the Rosa Spier Huis, a home for old artists; died March 1972' },
  { name: 'Van Gogh Museum', kind: 'museum', from: 1973, at: by(T.amsterdam, -0.03, -0.05), label: 'left', note: 'Amsterdam, opened on 2 June 1973 in a building designed by Rietveld' },
]

export const modernsLines: HistLine[] = [
  { name: 'Van Gogh to Antwerp and Paris', kind: 'flow', from: 1886, to: 1887, coords: [T.nuenen, T.antwerp, by(T.brussels, -0.6, -0.2), PARIS] },
  { name: 'Mondriaan to Paris', kind: 'flow', from: 1912, to: 1913, coords: [T.amsterdam, by(T.leiden, -0.3, -0.5), by(T.ostend, 0.1, -0.5), PARIS] },
  { name: 'Mondrian back to Paris', kind: 'flow', from: 1919, to: 1921, coords: [T.laren, by(T.utrecht, -0.4, -0.6), by(T.brussels, -0.9, 0.1), PARIS] },
  { name: 'Escher to Italy', kind: 'flow', from: 1922, to: 1926, coords: [T.haarlem, by(T.utrecht, 0.3, -0.5), by(T.nuenen, 0.6, -0.6), ITALY] },
  { name: 'Magritte to Paris', kind: 'flow', from: 1927, to: 1929, coords: [T.brussels, by(T.brussels, -0.8, -0.25), PARIS] },
]

export const modernsLabels: HistLabel[] = [
  { text: 'NETHERLANDS', kind: 'territory', from: MODERNS_MIN, at: [6.2, 52.75] },
  { text: 'BELGIUM', kind: 'territory', from: MODERNS_MIN, at: [4.9, 50.55] },
  { text: 'VAN GOGH IN FRANCE', kind: 'people', from: 1888, to: 1889, at: [3.6, 50.45] },
  { text: 'FIRST WORLD WAR', kind: 'alert', from: 1914, to: 1918, at: [4.0, 50.62] },
  { text: 'MONDRIAN IN PARIS', kind: 'people', from: 1922, to: 1937, at: [3.6, 50.45] },
  { text: 'ESCHER IN ITALY', kind: 'people', from: 1927, to: 1934, at: [5.9, 50.45] },
  { text: 'ESCHER IN SWITZERLAND', kind: 'people', from: 1935, to: 1936, at: [5.7, 50.45] },
  { text: 'MONDRIAN IN LONDON', kind: 'people', from: 1938, to: 1939, at: [3.6, 50.45] },
  { text: 'MONDRIAN IN NEW YORK', kind: 'people', from: 1940, to: 1943, at: [3.6, 50.45] },
  { text: 'SECOND WORLD WAR', kind: 'alert', from: 1940, to: 1943, at: [4.0, 50.62] },
]

export const modernsEvents: HistEvent[] = [
  {
    from: 1880,
    title: '1880: Van Gogh begins to draw',
    text: 'Vincent van Gogh, 27, has failed as an art dealer and as a preacher among the coal miners of the Borinage. In 1880 he decides to become an artist and draws the miners. In Ostend, James Ensor, 20, has come home from the academy in Brussels.',
  },
  {
    from: 1881,
    title: '1881: At the parsonage in Etten',
    text: 'Van Gogh lives with his parents in Etten, in Brabant, and draws the farm workers. At Christmas he quarrels with his father and leaves for The Hague.',
  },
  {
    from: 1882,
    title: '1882: Lessons in The Hague',
    text: 'In The Hague, Van Gogh’s cousin by marriage, the painter Anton Mauve, gives him his first painting lessons. In Ostend, Ensor paints The Oyster Eater, a woman alone at a laden table; a Brussels exhibition society, L’Essor, will turn it down.',
  },
  {
    from: 1883,
    title: '1883: Les XX',
    text: 'In Brussels, twenty young artists who are tired of being turned down by the official Salons found their own society, Les XX, the Twenty. Ensor and Fernand Khnopff are among them.',
  },
  {
    from: 1884,
    title: '1884: Nuenen and the first show of Les XX',
    text: 'Les XX hold their first exhibition in February. Van Gogh, after three months on the moors of Drenthe, has come to his parents’ new home in Nuenen, where he paints weavers and peasants.',
  },
  {
    from: 1886,
    title: '1886: To Antwerp and Paris',
    text: 'Van Gogh spent the winter in Antwerp, at the academy, then left for Paris to live with his brother Theo. There he meets the young painters of the day and buys Japanese prints by the hundred.',
  },
  {
    from: 1888,
    title: '1888: The south of France',
    text: 'In February Van Gogh moves to Arles, in the south of France, hoping to found a studio there; Gauguin joins him in October. In Ostend, Ensor paints Christ’s Entry into Brussels in 1889, which no exhibition will show for decades. Anton Mauve died in February.',
  },
  {
    from: 1890,
    title: '1890: Van Gogh at Les XX',
    text: 'Six Van Goghs hang at Les XX in Brussels, and Anna Boch, a painter of the group, buys The Red Vineyard. In July Van Gogh dies at Auvers-sur-Oise, near Paris, at 37; Theo dies six months later.',
  },
  {
    from: 1894,
    title: '1894: La Libre Esthétique',
    text: 'Les XX broke up after their tenth show, and their secretary, Octave Maus, has founded a new society, La Libre Esthétique. In The Hague, Jan Toorop, a Les XX member born on Java, designs his poster for Delft salad oil.',
  },
  {
    from: 1898,
    title: '1898: Two boys born',
    text: 'René Magritte is born in Lessines, in Hainaut, and M. C. Escher in Leeuwarden, in Friesland. Painters are gathering in the village of Sint-Martens-Latem, on the Lys near Ghent. Théo van Rysselberghe has moved to Paris.',
  },
  {
    from: 1908,
    title: '1908: Summers in Domburg',
    text: 'Piet Mondriaan, an Amsterdam painter of landscapes, spends the first of several summers in Domburg, on Walcheren, and his colours turn bright. In Ostend, Léon Spilliaert paints the empty promenade at night; Rik Wouters settles near Brussels.',
  },
  {
    from: 1912,
    title: '1912: Mondrian in Paris',
    text: 'Mondriaan moves to Paris, sees the Cubists’ work and drops an a from his name: from now on he signs Mondrian.',
  },
  {
    from: 1914,
    title: '1914: War',
    text: 'Germany invades Belgium. Rik Wouters, a soldier, is interned in the neutral Netherlands after the fall of Antwerp. Mondrian, home on a visit, cannot get back to Paris and stays in Laren.',
  },
  {
    from: 1917,
    title: '1917: De Stijl',
    text: 'In Leiden, Theo van Doesburg starts a magazine called De Stijl, The Style, with Mondrian and others: art made only of straight lines and flat colours. Rik Wouters died in Amsterdam in 1916. René Magritte is at the academy in Brussels.',
  },
  {
    from: 1919,
    title: '1919: Back to Paris',
    text: 'The war is over, and Mondrian returns to Paris. M. C. Escher, from Arnhem, starts at the School for Architecture and Decorative Arts in Haarlem, where his teacher Samuel Jessurun de Mesquita talks him into graphic art.',
  },
  {
    from: 1922,
    title: '1922: Escher goes south',
    text: 'Escher leaves school and travels to Italy and Spain, where he sees the tiled walls of the Alhambra; he settles in Rome. Van Doesburg is spreading De Stijl in Germany. Fernand Khnopff died in Brussels in 1921.',
  },
  {
    from: 1927,
    title: '1927: Magritte goes to Paris',
    text: 'After a first show in Brussels that the critics hated, Magritte moves to a suburb of Paris, near the Surrealist poets. There he paints a pipe with the words "This is not a pipe".',
  },
  {
    from: 1930,
    title: '1930: Magritte comes home',
    text: 'Magritte returns to Brussels and rents a ground-floor flat in Jette, where he will paint for 24 years. Painters have mostly left Sint-Martens-Latem. In Paris, Mondrian paints his compositions in red, yellow and blue.',
  },
  {
    from: 1935,
    title: '1935: Escher leaves Italy',
    text: 'Escher leaves fascist Italy for Switzerland. The Gemeentemuseum in The Hague opens its new building, by the architect Berlage. Spilliaert has moved from Ostend to Brussels.',
  },
  {
    from: 1937,
    title: '1937: Escher in Brussels',
    text: 'Escher moves to Uccle, near Brussels. After a second visit to the Alhambra in 1936, he has begun filling the plane with interlocking animals.',
  },
  {
    from: 1938,
    title: '1938: A museum in the woods',
    text: 'The Kröller-Müller Museum opens at Otterlo, in the woods of the Veluwe, built by the Belgian architect Henry van de Velde for the collection of Helene Kröller-Müller, with more than 90 Van Gogh paintings. Mondrian leaves Paris for London.',
  },
  {
    from: 1940,
    title: '1940: War again',
    text: 'Germany occupies the Netherlands and Belgium. Mondrian sails from London to New York, where jazz and the grid of the streets get into his last paintings.',
  },
  {
    from: 1941,
    title: '1941: Escher in Baarn',
    text: 'Escher leaves occupied Belgium for Baarn, in the Netherlands, where he will live for nearly thirty years.',
  },
  {
    from: 1944,
    title: '1944: Mondrian dies',
    text: 'Mondrian dies in New York on 1 February, leaving Victory Boogie Woogie unfinished. That same month Samuel Jessurun de Mesquita and his family are arrested in Amsterdam; he and his wife are murdered in Auschwitz.',
  },
  {
    from: 1949,
    title: '1949: Ensor dies',
    text: 'James Ensor dies in Ostend at 89, a baron since 1929, famous at last. Painters are back at work in the free Low Countries.',
  },
  {
    from: 1954,
    title: '1954: Escher at the Stedelijk',
    text: 'Mathematicians from all over the world meet in Amsterdam, and the Stedelijk Museum shows Escher’s prints for them. Magritte moves to a house in Schaerbeek.',
  },
  {
    from: 1960,
    title: '1960: Stairs that never end',
    text: 'Escher makes Ascending and Descending, monks climbing a staircase that goes round for ever, after a drawing sent to him by the British scientists Lionel and Roger Penrose.',
  },
  {
    from: 1964,
    title: '1964: Rietveld dies',
    text: 'Gerrit Rietveld dies in Utrecht. His last design, a museum for the Van Gogh family’s collection, is finished by his partners.',
  },
  {
    from: 1967,
    title: '1967: Magritte dies',
    text: 'René Magritte dies in Schaerbeek in August, at 68.',
  },
  {
    from: 1970,
    title: '1970: Escher’s last move',
    text: 'Escher moves to the Rosa Spier Huis in Laren, a home for old artists.',
  },
  {
    from: 1972,
    title: '1972: Escher dies',
    text: 'M. C. Escher dies in March, at 73. His prints sell in their millions as posters.',
  },
  {
    from: 1973,
    title: '1973: The Van Gogh Museum',
    text: 'On 2 June Queen Juliana opens the Van Gogh Museum in Amsterdam, for the paintings and letters that Theo’s widow Jo van Gogh-Bonger had kept, and that their son Vincent Willem placed in a foundation for the nation to show.',
  },
]

export const modernsStory: TimeStory = {
  place: 'the Low Countries',
  bounds: [
    [2.55, 50.3],
    [6.95, 53.0],
  ],
  min: MODERNS_MIN,
  max: MODERNS_MAX,
  format: String,
  events: modernsEvents,
  lines: modernsLines,
  sites: modernsSites,
  labels: modernsLabels,
  note: 'Each artist is drawn in the town where they worked, at the stages they are known to be there; years abroad are arrows or a line of text at the edge.',
  key: [
    { swatch: 'key-workshop', text: 'An artist at work' },
    { swatch: 'key-flow', text: 'Artists on the move' },
    { swatch: 'key-market', text: 'Exhibition society' },
    { swatch: 'key-village', text: "Artists' village" },
    { swatch: 'key-museum', text: 'Museum of modern art' },
  ],
}
