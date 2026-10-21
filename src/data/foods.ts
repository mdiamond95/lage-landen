// The regional food map of Unit 21: the cheeses, fish, sweets, dishes, beers and spirits
// of the Low Countries, each pinned to the town or region it belongs to, with a photo,
// a word on what it is, and its protection where the EU or UNESCO has given one.
// Coordinates are [lon, lat].

import type { PhotoId } from '../photos/ids'
import type { SoundId } from '../sounds/ids'

export const foodKinds = ['cheese', 'sea', 'sweet', 'dish', 'beer', 'spirit'] as const
export type FoodKind = (typeof foodKinds)[number]

export const foodKindNames: Record<FoodKind, string> = {
  cheese: 'Cheese',
  sea: 'From the sea',
  sweet: 'Sweets and baking',
  dish: 'Dishes',
  beer: 'Beer',
  spirit: 'Jenever',
}

export type Food = {
  name: string
  // Its own name, where it differs from the English.
  own?: string
  kind: FoodKind
  // Where it comes from, as said on the card.
  place: string
  at: [number, number]
  about: string
  // EU protection, UNESCO listing or the Trappist label.
  status?: string
  photo?: PhotoId
  // The name said aloud.
  sound?: SoundId
}

export const foodIds = [
  'gouda',
  'edam',
  'leiden',
  'herve',
  'herring',
  'mussels',
  'shrimp',
  'stroopwafel',
  'speculoos',
  'liege-waffle',
  'brussels-waffle',
  'pralines',
  'cuberdon',
  'bossche-bol',
  'vlaai',
  'hutspot',
  'waterzooi',
  'frites',
  'witloof',
  'kroket',
  'rijsttafel',
  'westvleteren',
  'westmalle',
  'chimay',
  'orval',
  'rochefort',
  'la-trappe',
  'lambic',
  'schiedam',
  'hasselt',
] as const
export type FoodId = (typeof foodIds)[number]

// Moves a mark a little, so two in one town don't sit on top of each other.
const by = ([lon, lat]: [number, number], dlon: number, dlat: number): [number, number] => [lon + dlon, lat + dlat]
const T = {
  gouda: [4.708, 52.011],
  brussels: [4.352, 50.847],
  ghent: [3.725, 51.054],
  leiden: [4.497, 52.16],
} satisfies Record<string, [number, number]>

export const foods: Record<FoodId, Food> = {
  gouda: {
    name: 'Gouda',
    own: 'Goudse kaas',
    kind: 'cheese',
    place: 'Gouda, South Holland',
    at: T.gouda,
    about:
      'A round cheese of cow’s milk, pressed in moulds and soaked in brine, sold young after four weeks or old after a year and more. Farmers brought it to the weigh house on the Markt, built in 1668. Most is now made in factories, but some 300 farms still make boerenkaas from raw milk.',
    status: 'Gouda Holland: protected geographical indication of the EU, 2010',
    photo: 'gouda-wheels',
    sound: 'nl-gouda',
  },
  edam: {
    name: 'Edam',
    own: 'Edammer',
    kind: 'cheese',
    place: 'Edam, North Holland',
    at: [5.048, 52.513],
    about:
      'A small ball of cheese that hardens rather than spoils, so ships carried it all over the world from the 1300s to the 1700s. Abroad it is known by its coat of red wax.',
    status: 'Noord-Hollandse Edammer: protected designation of origin of the EU',
    photo: 'edam-market',
    sound: 'nl-edammer',
  },
  leiden: {
    name: 'Leiden cheese',
    own: 'Leidse kaas',
    kind: 'cheese',
    place: 'Leiden and the farms around it',
    at: by(T.leiden, 0.05, 0.03),
    about:
      'A firm, low-fat cheese spiced with cumin seeds. The farm-made kind is stamped with two crossed keys, from the arms of the city of Leiden.',
    status: 'Boeren-Leidse met sleutels: protected designation of origin of the EU, 1997',
    photo: 'leiden-cheese',
  },
  herve: {
    name: 'Herve',
    own: 'Fromage de Herve',
    kind: 'cheese',
    place: 'The Pays de Herve, east of Liège',
    at: [5.795, 50.64],
    about:
      'A soft cheese with an orange rind and a famous smell, made here since the 1400s, when the land belonged to the Duchy of Limburg. The same cheese made elsewhere is called Limburger.',
    status: 'Fromage de Herve: protected designation of origin of the EU',
    photo: 'herve-cheese',
  },
  herring: {
    name: 'Hollandse Nieuwe',
    own: 'Hollandse Nieuwe haring',
    kind: 'sea',
    place: 'Scheveningen and the herring ports',
    at: [4.27, 52.11],
    about:
      'The new season’s herring, caught from May when the fish are fat, cleaned on board, lightly salted, and eaten raw at a stall, often with chopped onion. Scheveningen greets the first catch with Vlaggetjesdag, the day of the little flags.',
    photo: 'herring-stall',
  },
  mussels: {
    name: 'Zeeland mussels',
    own: 'Zeeuwse mosselen',
    kind: 'sea',
    place: 'Yerseke, on the Oosterschelde',
    at: [4.05, 51.495],
    about:
      'Mussels are farmed on beds in the Oosterschelde and auctioned at Yerseke. Across the border they become moules-frites, steamed with celery and onion and served with fries.',
    photo: 'mussels-1916',
  },
  shrimp: {
    name: 'North Sea shrimp',
    own: 'Grijze garnalen',
    kind: 'sea',
    place: 'Oostduinkerke, on the Belgian coast',
    at: [2.68, 51.115],
    about:
      'Little grey shrimp, peeled by hand and eaten in tomatoes or croquettes. At Oostduinkerke fishers still ride big Brabant horses into the surf, dragging funnel-shaped nets along the beach.',
    status: 'Shrimp fishing on horseback: UNESCO intangible heritage of humanity, 2013',
    photo: 'shrimp-horse',
  },
  stroopwafel: {
    name: 'Stroopwafel',
    kind: 'sweet',
    place: 'Gouda',
    at: by(T.gouda, 0.06, -0.05),
    about:
      'Two thin waffles stuck together with syrup. Bakers in Gouda were making them by the early 1800s; one story credits Gerard Kamphuisen, who opened his bakery in 1810. By 1960 Gouda had 17 stroopwafel factories.',
    photo: 'stroopwafels',
    sound: 'nl-stroopwafel',
  },
  speculoos: {
    name: 'Speculaas',
    own: 'Speculaas, speculoos',
    kind: 'sweet',
    place: 'Lembeke, East Flanders, and bakeries everywhere',
    at: [3.63, 51.18],
    about:
      'A crisp biscuit pressed into a carved wooden mould. Dutch speculaas is spiced with cinnamon, nutmeg, cloves, ginger and cardamom, the spices the trading ships brought from Asia. Belgian speculoos tastes of caramelised sugar instead; Lotus has baked it in Lembeke since 1932.',
    photo: 'speculaas',
    sound: 'nl-speculaas',
  },
  'liege-waffle': {
    name: 'Liège waffle',
    own: 'Gaufre de Liège',
    kind: 'sweet',
    place: 'Liège',
    at: [5.57, 50.633],
    about:
      'A dense, chewy waffle with uneven edges, made from a yeast dough with lumps of pearl sugar that caramelise in the iron. Eaten warm from the hand, from a street stall.',
    photo: 'liege-waffle',
  },
  'brussels-waffle': {
    name: 'Brussels waffle',
    own: 'Gaufre de Bruxelles',
    kind: 'sweet',
    place: 'Brussels',
    at: by(T.brussels, -0.11, 0.05),
    about:
      'A light, crisp rectangle with deep pockets, made from a runny batter and eaten on a plate with icing sugar or cream. Shown off at Expo 58, it became the “Belgian waffle” of America after the New York World’s Fair of 1964.',
    photo: 'brussels-waffle',
  },
  pralines: {
    name: 'Pralines',
    own: 'Pralines',
    kind: 'sweet',
    place: 'Brussels',
    at: by(T.brussels, 0.1, 0.05),
    about:
      'Chocolates with a soft filling. Jean Neuhaus opened a pharmacy in the Galeries Royales of Brussels in 1857, which turned to sweets; his grandson filled chocolate shells in 1912, and in 1915 the family designed the ballotin, the box to carry them in.',
    photo: 'pralines',
  },
  cuberdon: {
    name: 'Cuberdon',
    own: 'Gentse neus',
    kind: 'sweet',
    place: 'Ghent',
    at: by(T.ghent, 0.07, 0.04),
    about:
      'A purple cone of gum arabic with runny raspberry syrup inside, called a neuzeke, a little nose, in Ghent. It keeps for only about three weeks before the inside sets.',
    photo: 'cuberdons',
  },
  'bossche-bol': {
    name: 'Bossche bol',
    kind: 'sweet',
    place: '’s-Hertogenbosch',
    at: [5.304, 51.69],
    about: 'A ball of choux pastry the size of a fist, filled with whipped cream and dipped in chocolate.',
    photo: 'bossche-bol',
  },
  vlaai: {
    name: 'Limburg vlaai',
    own: 'Limburgse vlaai',
    kind: 'sweet',
    place: 'Limburg',
    at: [5.93, 51.1],
    about: 'A wide, flat tart of yeast dough with a fruit filling, often under a lattice of dough, baked for birthdays and feasts all over Limburg.',
    photo: 'vlaai',
  },
  hutspot: {
    name: 'Hutspot',
    kind: 'dish',
    place: 'Leiden',
    at: T.leiden,
    about:
      'Potatoes, carrots and onions mashed together, with meat on the side. Leiden eats it every 3 October, the day the Spanish siege ended in 1574; the pot the soldiers left behind would have held parsnips, not potatoes.',
    photo: 'hutspot',
    sound: 'nl-hutspot',
  },
  waterzooi: {
    name: 'Waterzooi',
    kind: 'dish',
    place: 'Ghent',
    at: T.ghent,
    about: 'A creamy stew of chicken, or once of fish, with leeks, carrots and potatoes, thickened with egg yolk and cream.',
    photo: 'waterzooi',
    sound: 'nl-waterzooi',
  },
  frites: {
    name: 'Frites',
    own: 'Frieten, frites',
    kind: 'dish',
    place: 'Every Belgian town, from a frietkot',
    at: by(T.brussels, 0.02, -0.1),
    about:
      'Thick-cut potatoes fried twice, served in a paper cone from a frietkot, a fry shack, with mayonnaise or one of dozens of sauces. Who fried them first, the Belgians or the French, is argued about to this day.',
    photo: 'frietkot',
  },
  witloof: {
    name: 'Witloof',
    own: 'Witloof, chicon',
    kind: 'dish',
    place: 'Around Brussels',
    at: by(T.brussels, 0.08, 0.03),
    about:
      'Belgian endive: chicory roots made to sprout again in the dark, so the leaves stay white. It was found by accident near Brussels in the mid-1800s, and is eaten baked with ham and cheese.',
    photo: 'witloof',
  },
  kroket: {
    name: 'Kroket and bitterballen',
    kind: 'dish',
    place: 'Amsterdam, and every Dutch snack bar',
    at: [4.893, 52.373],
    about:
      'A thick ragout of meat, breaded and deep-fried: long as a kroket, round as a bitterbal with a drink. FEBO, founded in Amsterdam in 1941, sells them from little doors in the wall.',
    photo: 'febo',
  },
  rijsttafel: {
    name: 'Rijsttafel',
    kind: 'dish',
    place: 'The Hague',
    at: [4.314, 52.08],
    about:
      'A “rice table” of many small Indonesian dishes around a bowl of rice, a feast of the colonial Dutch in the East Indies. Families who came from Indonesia after 1945 made Indonesian food part of everyday Dutch eating, and The Hague has more of it than anywhere.',
    photo: 'rijsttafel',
    sound: 'nl-rijsttafel',
  },
  westvleteren: {
    name: 'Westvleteren',
    kind: 'beer',
    place: 'The abbey of Saint Sixtus, Westvleteren',
    at: [2.72, 50.93],
    about:
      'Brewed by the monks since 1838 and sold only at the abbey gate and its café, in plain bottles. Rated the best beer in the world in 2005, the monks still will not brew more.',
    status: 'Authentic Trappist Product',
    photo: 'westvleteren',
  },
  westmalle: {
    name: 'Westmalle',
    kind: 'beer',
    place: 'The abbey of Westmalle, near Antwerp',
    at: [4.68, 51.29],
    about: 'The monks brewed their first beer on 1 August 1836. Their Tripel of 1934 gave its name to a whole style of strong, pale beer.',
    status: 'Authentic Trappist Product',
    photo: 'westmalle',
  },
  chimay: {
    name: 'Chimay',
    kind: 'beer',
    place: 'The abbey of Scourmont, near Chimay',
    at: [4.33, 50.02],
    about: 'Brewed at the abbey since 1862, and the monks have made cheese since 1876.',
    status: 'Authentic Trappist Product',
    photo: 'chimay-abbey',
  },
  orval: {
    name: 'Orval',
    kind: 'beer',
    place: 'The abbey of Orval, in the Gaume',
    at: [5.35, 49.64],
    about: 'A dry, hoppy beer in a bottle shaped like a skittle, brewed beside the ruins of the medieval abbey.',
    status: 'Authentic Trappist Product',
    photo: 'orval',
  },
  rochefort: {
    name: 'Rochefort',
    kind: 'beer',
    place: 'The abbey of Saint-Remy, Rochefort',
    at: [5.22, 50.16],
    about: 'Dark, strong beers from an abbey in the Ardennes, best known by their numbers, 6, 8 and 10.',
    status: 'Authentic Trappist Product',
  },
  'la-trappe': {
    name: 'La Trappe',
    kind: 'beer',
    place: 'The abbey of Koningshoeven, Berkel-Enschot',
    at: [5.14, 51.585],
    about: 'The Trappist beer of the Netherlands, brewed within the abbey walls near Tilburg since 1884.',
    status: 'Authentic Trappist Product',
  },
  lambic: {
    name: 'Lambic and gueuze',
    kind: 'beer',
    place: 'The Pajottenland and the Zenne valley',
    at: [4.24, 50.79],
    about:
      'Beer left open to the night air in a shallow coolship, so wild yeasts from the valley of the Zenne ferment it. Young and old lambic blended make gueuze; with sour cherries it becomes kriek.',
    status: 'Belgian beer culture: UNESCO intangible heritage of humanity, 2016',
    photo: 'coolship',
    sound: 'nl-lambiek',
  },
  schiedam: {
    name: 'Schiedam jenever',
    kind: 'spirit',
    place: 'Schiedam',
    at: [4.4, 51.917],
    about:
      'Jenever is malt wine, distilled from grain, flavoured with juniper berries. Schiedam had 188 distilleries in 1795 and 392 in 1881, and windmills to grind their malt; De Noord, at 33 m, is the tallest in the world.',
    status: 'Jenever: protected geographical indication of the EU, 2008',
    photo: 'schiedam-mill',
    sound: 'nl-jenever',
  },
  hasselt: {
    name: 'Hasselt jenever',
    kind: 'spirit',
    place: 'Hasselt',
    at: [5.338, 50.93],
    about: 'Hasselt calls itself Belgium’s jenever capital, with a jenever museum in an old distillery whose malthouse still stands.',
    status: 'Jenever: protected geographical indication of the EU, 2008',
    photo: 'hasselt-jenever',
  },
}
