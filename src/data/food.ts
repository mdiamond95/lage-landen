// The food map for Unit 21: where the food and drink of the Low Countries were made and
// sold, from a book of nature that mentions juniper wine in about 1266 to Belgian beer
// culture on UNESCO's list in 2016. Each mark appears in the year it is first known, in
// the colour of its kind: cheese, fish, sweets and baking, dishes, breweries and
// distilleries. Coordinates are [lon, lat].

import { foods } from './foods'
import type { HistEvent, HistLabel, HistSite, TimeStory } from './timeline'

export const FOOD_MIN = 1266
export const FOOD_MAX = 2016

const by = ([lon, lat]: [number, number], dlon: number, dlat: number): [number, number] => [lon + dlon, lat + dlat]
const P = {
  damme: [3.28, 51.25],
  leuven: [4.701, 50.879],
  biervliet: [3.69, 51.33],
  enkhuizen: [5.293, 52.703],
  antwerp: [4.401, 51.22],
  alkmaar: [4.748, 52.632],
  haarlem: [4.636, 52.381],
  amsterdam: [4.893, 52.373],
  brussels: [4.352, 50.847],
} satisfies Record<string, [number, number]>

export const foodSites: HistSite[] = [
  { name: 'Juniper wine', kind: 'distillery', from: 1266, at: P.damme, label: 'left', note: 'Jacob van Maerlant, a clerk in Damme, mentions wine made with juniper in his book of nature, Der naturen bloeme' },
  { name: 'Den Hoorn', kind: 'brewery', from: 1366, at: P.leuven, label: 'right', note: 'a brewery in Leuven, known by 1366; in the 1700s it became the brewery of Sébastien Artois' },
  { name: 'Gibbed herring', kind: 'fish', from: 1400, at: P.biervliet, label: 'right', note: 'Biervliet: legend credits a fisherman of the town, Willem Beukelszoon, with gibbing herring at sea' },
  { name: 'Herring fleet', kind: 'fish', from: 1400, at: P.enkhuizen, label: 'right', note: 'Enkhuizen and the towns of the Zuiderzee and the Maas send out busses to fish for herring' },
  { name: 'Edam', kind: 'cheese', from: 1400, at: foods.edam.at, label: 'left', note: 'small round cheeses that keep for months, carried to sea and the colonies' },
  { name: 'Herve', kind: 'cheese', from: 1400, at: foods.herve.at, label: 'right', note: 'soft, strong-smelling cheese of the Duchy of Limburg, made since the 1400s' },
  { name: 'Waffles', kind: 'sweet', from: 1559, at: P.antwerp, label: 'left', note: 'Antwerp: Bruegel paints waffles, pretzels and herring in his Fight between Carnival and Lent, 1559' },
  { name: 'Hutspot', kind: 'dish', from: 1574, at: foods.hutspot.at, label: 'left', note: 'Leiden: the stew the Spanish left behind when the siege was lifted on 3 October 1574, so the story goes' },
  { name: 'Cheese carriers', kind: 'cheese', from: 1593, at: P.alkmaar, label: 'left', note: 'Alkmaar: the cheese carriers’ guild is founded on 17 June 1593' },
  { name: 'Weigh house', kind: 'cheese', from: 1668, at: foods.gouda.at, label: 'left', note: 'Gouda: the Waag on the Markt, by Pieter Post, 1668' },
  { name: 'Speculaas', kind: 'sweet', from: 1749, at: P.haarlem, label: 'left', note: 'Haarlem: the oldest known mention of the word, speculatie, in the bakers’ rules of 1749' },
  { name: 'Distilleries', kind: 'distillery', from: 1795, at: foods.schiedam.at, label: 'left', note: 'Schiedam: 188 distilleries in 1795, 392 in 1881' },
  { name: 'Hasselt jenever', kind: 'distillery', from: 1795, at: foods.hasselt.at, label: 'right', note: 'Hasselt: at least 21 distillers by the end of the 1700s' },
  { name: 'Stroopwafels', kind: 'sweet', from: 1810, at: by(foods.gouda.at, 0.05, -0.06), label: 'right', note: 'Gouda: one story credits the baker Gerard Kamphuisen, who opened his bakery in 1810' },
  { name: 'Cocoa powder', kind: 'sweet', from: 1828, at: by(P.amsterdam, -0.05, -0.05), label: 'left', note: 'Amsterdam: the Van Houtens patent a press that squeezes the fat out of cocoa, 1828' },
  { name: 'Westmalle', kind: 'brewery', from: 1838, at: foods.westmalle.at, label: 'right', note: 'Trappist monks brew their first beer on 1 August 1836' },
  { name: 'Westvleteren', kind: 'brewery', from: 1838, at: foods.westvleteren.at, label: 'right', note: 'the monks of Saint Sixtus brew from 1838' },
  { name: 'Witloof', kind: 'dish', from: 1850, at: by(P.brussels, -0.06, -0.06), label: 'left', note: 'near Brussels: chicory forced in the dark gives white leaves, found in the 1850s' },
  { name: 'Chimay', kind: 'brewery', from: 1862, at: foods.chimay.at, label: 'right', note: 'the abbey of Scourmont brews from 1862, and makes cheese from 1876' },
  { name: 'Heineken', kind: 'brewery', from: 1864, at: by(P.amsterdam, 0.05, 0.04), label: 'right', note: 'Amsterdam: Gerard Adriaan Heineken, aged 22, buys the brewery De Hooiberg, 1864' },
  { name: 'La Trappe', kind: 'brewery', from: 1884, at: foods['la-trappe'].at, label: 'right', note: 'Berkel-Enschot: the abbey of Koningshoeven brews from 1884' },
  { name: 'Pralines', kind: 'sweet', from: 1912, at: by(P.brussels, 0.05, 0.05), label: 'right', note: 'Brussels: Neuhaus fills chocolate shells, 1912; the ballotin box follows in 1915' },
  { name: 'Speculoos', kind: 'sweet', from: 1932, at: foods.speculoos.at, label: 'left', note: 'Lembeke: Lotus begins baking speculoos, 1932' },
  { name: 'FEBO', kind: 'dish', from: 1941, at: by(P.amsterdam, 0.02, -0.08), label: 'right', note: 'Amsterdam: Johan de Borst opens a snack bar, 1941; its croquettes later come from little doors in the wall' },
  { name: 'Belgian waffle', kind: 'sweet', from: 1958, at: by(P.brussels, -0.04, 0.07), label: 'left', note: 'Brussels: waffles shown off at Expo 58' },
  { name: 'Leiden cheese', kind: 'cheese', from: 1997, at: foods.leiden.at, label: 'right', note: 'Boeren-Leidse met sleutels, protected by the EU in 1997' },
  { name: 'Shrimp on horseback', kind: 'fish', from: 2013, at: foods.shrimp.at, label: 'right', note: 'Oostduinkerke: on UNESCO’s list of intangible heritage, 2013' },
]

export const foodLabels: HistLabel[] = [
  { text: 'NETHERLANDS', kind: 'territory', from: 1838, at: [6.2, 52.75] },
  { text: 'BELGIUM', kind: 'territory', from: 1838, at: [4.9, 50.45] },
  { text: 'NORTH SEA', kind: 'water', from: FOOD_MIN, at: [3.4, 52.6] },
  { text: 'SPICE SHIPS OF THE VOC', kind: 'people', from: 1602, to: 1794, at: [3.5, 53.05] },
  { text: 'HUNGER WINTER', kind: 'alert', from: 1944, to: 1944, at: [4.75, 52.25] },
  { text: 'BELGIAN BEER CULTURE: UNESCO', kind: 'alert', from: 2016, at: [4.6, 50.25] },
]

export const foodEvents: HistEvent[] = [
  {
    from: 1266,
    title: 'About 1266: Juniper in a book of nature',
    text: 'In Damme, the port of Bruges, the clerk Jacob van Maerlant writes a book of nature in Dutch, Der naturen bloeme. It mentions wine made with juniper berries: the first trace of the drink that becomes jenever.',
  },
  {
    from: 1366,
    title: '1366: A brewery in Leuven',
    text: 'Towns and abbeys brew beer, the everyday drink of the Low Countries. The brewery Den Hoorn in Leuven is known by 1366; the brand that grew out of it, Stella Artois, still prints the date on its glasses.',
  },
  {
    from: 1400,
    title: 'The 1400s: Herring that keeps',
    text: 'Fishermen learn to gib herring at sea: they cut out the gills and guts and pack the fish in salt in barrels, so it keeps for months. Herring busses sail out of Holland and Zeeland, and round cheeses from Edam and Herve travel far.',
  },
  {
    from: 1559,
    title: '1559: Carnival and Lent',
    text: 'In Antwerp, Pieter Bruegel paints the feast before Lent fighting the fast: waffles, pork and beer on one side, herring, pretzels and dry bread on the other.',
  },
  {
    from: 1574,
    title: '1574: Hutspot',
    text: 'On 3 October 1574 the Spanish siege of Leiden ends. The story goes that a boy found a pot of stew in the empty camp. Leiden still eats hutspot every 3 October.',
  },
  {
    from: 1593,
    title: '1593: The cheese carriers of Alkmaar',
    text: 'On 17 June 1593 the cheese carriers of Alkmaar form a guild. They still carry the cheeses from the market to the weigh house on barrows hung from their shoulders.',
  },
  {
    from: 1602,
    title: '1602: Spices from Asia',
    text: 'The East India Company is founded, and its ships bring pepper, nutmeg, cloves and cinnamon to Amsterdam, taken by trade and by force (Unit 7). Spiced biscuits and cakes become a Dutch habit.',
  },
  {
    from: 1668,
    title: '1668: A weigh house for Gouda',
    text: 'Gouda builds a weigh house on its market square to a design by Pieter Post, with a stone relief of cheese being weighed. Farmers bring their cheese here to be weighed and sold.',
  },
  {
    from: 1749,
    title: '1749: Speculaas',
    text: 'The bakers’ rules of Haarlem name a biscuit called speculatie: the oldest known mention of speculaas, baked in carved wooden moulds for the feast of Saint Nicholas.',
  },
  {
    from: 1795,
    title: '1795: Jenever towns',
    text: 'Schiedam, near Rotterdam, has 188 distilleries making jenever from malted grain, with windmills to grind the malt. Hasselt, in the south, has at least 21.',
  },
  {
    from: 1810,
    title: '1810: Syrup waffles',
    text: 'The baker Gerard Kamphuisen opens his shop in Gouda. One story credits him with the stroopwafel, two thin waffles stuck together with syrup.',
  },
  {
    from: 1828,
    title: '1828: Cocoa powder',
    text: 'In Amsterdam the Van Houtens, father and son, patent a press that squeezes most of the fat, the cocoa butter, out of ground cocoa beans. The powder left over makes a lighter drink, and the butter makes chocolate that can be eaten.',
  },
  {
    from: 1838,
    title: '1838: Monks brew',
    text: 'Trappist monks, who live by their own work, brew beer at their abbeys of Westmalle, since 1836, and Westvleteren, since 1838.',
  },
  {
    from: 1850,
    title: 'The 1850s: White leaf',
    text: 'Near Brussels, chicory roots kept in the dark sprout pale, tender leaves: witloof, white leaf, or Belgian endive.',
  },
  {
    from: 1862,
    title: '1862: Chimay',
    text: 'The monks of Scourmont, near Chimay, begin brewing. From 1876 they also make cheese.',
  },
  {
    from: 1864,
    title: '1864: Heineken',
    text: 'In Amsterdam, Gerard Adriaan Heineken, aged 22, buys the brewery De Hooiberg. In the 1870s he switches to lager, the bottom-fermented beer of Bavaria.',
  },
  {
    from: 1884,
    title: '1884: A Dutch Trappist',
    text: 'The abbey of Koningshoeven near Tilburg begins to brew: La Trappe, still the Trappist beer of the Netherlands. By 1881 Schiedam had 392 distilleries.',
  },
  {
    from: 1912,
    title: '1912: The praline',
    text: 'In the Galeries Royales of Brussels, Jean Neuhaus fills chocolate shells with soft centres: the praline. In 1915 his family designs the ballotin, a box to carry them in.',
  },
  {
    from: 1932,
    title: '1932: Speculoos',
    text: 'In Lembeke, in East Flanders, the Boone brothers found Lotus and bake speculoos, a caramel-sweet biscuit that is now sold all over the world.',
  },
  {
    from: 1941,
    title: '1941: A snack bar in Amsterdam',
    text: 'Johan de Borst opens a shop in Amsterdam, Maison FEBO, named after the Ferdinand Bolstraat. Its croquettes will later be sold from little doors in the wall.',
  },
  {
    from: 1944,
    title: '1944: The Hunger Winter',
    text: 'The German occupiers cut off food to the west of the Netherlands. Rations fall to 750 calories a day, and people eat soup of sugar beet, tulip bulbs and potato peel (Unit 11).',
  },
  {
    from: 1945,
    title: '1945: Food from the sky',
    text: 'From 29 April to 8 May, with the Germans agreeing not to shoot, Allied bombers drop about 11,000 tonnes of food over the west of the Netherlands. The Germans there surrender on 5 May, while the drops go on.',
  },
  {
    from: 1958,
    title: '1958: Waffles at Expo 58',
    text: 'At the world’s fair in Brussels, waffles are a hit. In 1964 Maurice Vermersch takes them to the New York World’s Fair, and America calls them Belgian waffles.',
  },
  {
    from: 1997,
    title: '1997: Protected names',
    text: 'The European Union protects foods by their place of origin. Boeren-Leidse met sleutels, the farm cheese of Leiden with its crossed keys, is registered in 1997; jenever follows in 2008 and Gouda Holland in 2010.',
  },
  {
    from: 2013,
    title: '2013: Shrimp on horseback',
    text: 'UNESCO lists the shrimp fishers of Oostduinkerke, who ride into the surf on Brabant horses, as intangible heritage of humanity.',
  },
  {
    from: 2016,
    title: '2016: Belgian beer culture',
    text: 'UNESCO lists Belgian beer culture as intangible heritage: almost 1,500 kinds of beer, brewed by monks, families and big firms, and served in their own glasses.',
  },
]

export const foodStory: TimeStory = {
  place: 'the Low Countries',
  bounds: [
    [2.5, 49.95],
    [6.95, 53.0],
  ],
  min: FOOD_MIN,
  max: FOOD_MAX,
  format: String,
  events: foodEvents,
  lines: [],
  sites: foodSites,
  labels: foodLabels,
  note: 'Each mark appears in the year it is first known, in the colour of its kind.',
  key: [
    { swatch: 'key-cheese', text: 'Cheese' },
    { swatch: 'key-fish', text: 'Fish' },
    { swatch: 'key-sweet', text: 'Sweets and baking' },
    { swatch: 'key-dish', text: 'Dish or vegetable' },
    { swatch: 'key-brewery', text: 'Brewery' },
    { swatch: 'key-distillery', text: 'Distillery' },
  ],
}
