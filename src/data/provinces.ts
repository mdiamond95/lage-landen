// The provinces and regions of the Netherlands and Belgium today (Unit 26), for the province map and
// the map drill. Each is a shape of the Low Countries map (lowlands.topo.json): the twelve Dutch
// provinces, the ten Belgian ones and the Brussels-Capital Region, which belongs to no province.
// Populations are on 1 January 2024: CBS StatLine table 03759ned for the Netherlands, Statbel for
// Belgium (as Wikipedia's list of the provinces of Belgium gives them). Areas are total areas in km²,
// water included, from the same lists; the Dutch figures count the lakes and the Wadden and Zeeland
// waters inside a province's border, so Friesland is the largest.

import type { PhotoId } from '../photos/ids'

export const provinceIds = [
  'NL-GR', 'NL-FR', 'NL-DR', 'NL-OV', 'NL-FL', 'NL-GE', 'NL-UT', 'NL-NH', 'NL-ZH', 'NL-ZE', 'NL-NB', 'NL-LI',
  'BE-VAN', 'BE-VLI', 'BE-VOV', 'BE-VWV', 'BE-VBR', 'BE-WBR', 'BE-WHT', 'BE-WNA', 'BE-WLG', 'BE-WLX', 'BE-BRU',
] as const
export type ProvinceId = (typeof provinceIds)[number]

// Where a province lies: in the Netherlands, or in one of Belgium's three regions.
export type Part = 'netherlands' | 'flanders' | 'wallonia' | 'brussels'
export const partNames: Record<Part, string> = {
  netherlands: 'The Netherlands',
  flanders: 'Flanders',
  wallonia: 'Wallonia',
  brussels: 'Brussels-Capital Region',
}

export type Province = {
  name: string
  // Its own official name, where it differs: Fryslân, Oost-Vlaanderen, Hainaut's Henegouwen.
  own?: string
  part: Part
  // The capital, where the provincial council sits, with its place on the map.
  capital: string
  at: [number, number]
  // The biggest town, where it is not the capital.
  biggest?: string
  pop: number
  area: number
  flag: PhotoId
  // Who heads it: a King's Commissioner in the Netherlands, a governor in Belgium.
  head: string
  note: string
}

const KC = "King's Commissioner, appointed by the Crown for six years"
const GOV = 'Governor, appointed by the regional government'

export const provinces: Record<ProvinceId, Province> = {
  'NL-GR': {
    name: 'Groningen',
    part: 'netherlands',
    capital: 'Groningen',
    at: [6.567, 53.219],
    pop: 601347,
    area: 2955,
    flag: 'flag-groningen',
    head: KC,
    note: 'Europe\'s biggest gas field was found under Slochteren in 1959. After years of earthquakes it set off, it was closed for good in 2024.',
  },
  'NL-FR': {
    name: 'Friesland',
    own: 'Fryslân',
    part: 'netherlands',
    capital: 'Leeuwarden',
    at: [5.799, 53.201],
    pop: 661904,
    area: 5753,
    flag: 'flag-friesland',
    head: KC,
    note: 'The largest province, counting its lakes and the Wadden Sea. Its official name has been the Frisian Fryslân since 1997, and Frisian is its second language.',
  },
  'NL-DR': {
    name: 'Drenthe',
    part: 'netherlands',
    capital: 'Assen',
    at: [6.564, 52.993],
    biggest: 'Emmen',
    pop: 504129,
    area: 2680,
    flag: 'flag-drenthe',
    head: KC,
    note: 'The emptiest province, with the fewest people to the square kilometre. Its 52 hunebeds, graves of big stones, are about 5,000 years old.',
  },
  'NL-OV': {
    name: 'Overijssel',
    part: 'netherlands',
    capital: 'Zwolle',
    at: [6.083, 52.513],
    biggest: 'Enschede',
    pop: 1189033,
    area: 3421,
    flag: 'flag-overijssel',
    head: KC,
    note: 'The land "over the IJssel", as the bishops of Utrecht saw it. Twente, around Enschede, was the heart of the Dutch cotton mills.',
  },
  'NL-FL': {
    name: 'Flevoland',
    part: 'netherlands',
    capital: 'Lelystad',
    at: [5.471, 52.518],
    biggest: 'Almere',
    pop: 450826,
    area: 2412,
    flag: 'flag-flevoland',
    head: KC,
    note: 'The twelfth province, from 1 January 1986, made almost wholly of polders won from the Zuiderzee. Lelystad is named after Cornelis Lely.',
  },
  'NL-GE': {
    name: 'Gelderland',
    part: 'netherlands',
    capital: 'Arnhem',
    at: [5.911, 51.985],
    biggest: 'Nijmegen',
    pop: 2149071,
    area: 5136,
    flag: 'flag-gelderland',
    head: KC,
    note: 'The largest province on dry land. It is named after Geldern, the town of its old dukes, which is now in Germany.',
  },
  'NL-UT': {
    name: 'Utrecht',
    part: 'netherlands',
    capital: 'Utrecht',
    at: [5.122, 52.091],
    pop: 1400057,
    area: 1560,
    flag: 'flag-utrecht',
    head: KC,
    note: 'The smallest province, in the middle of the country, where the main railway lines meet.',
  },
  'NL-NH': {
    name: 'North Holland',
    own: 'Noord-Holland',
    part: 'netherlands',
    capital: 'Haarlem',
    at: [4.636, 52.381],
    biggest: 'Amsterdam',
    pop: 2976487,
    area: 4092,
    flag: 'flag-noord-holland',
    head: KC,
    note: 'One of the two halves of Holland, split in 1840. Its capital is Haarlem, not Amsterdam, the capital of the country.',
  },
  'NL-ZH': {
    name: 'South Holland',
    own: 'Zuid-Holland',
    part: 'netherlands',
    capital: 'The Hague',
    at: [4.288, 52.078],
    biggest: 'Rotterdam',
    pop: 3840460,
    area: 3308,
    flag: 'flag-zuid-holland',
    head: KC,
    note: 'The province with the most people, and the most to the square kilometre. Its capital, The Hague, is also the seat of the king, the cabinet and parliament.',
  },
  'NL-ZE': {
    name: 'Zeeland',
    part: 'netherlands',
    capital: 'Middelburg',
    at: [3.61, 51.499],
    biggest: 'Terneuzen',
    pop: 391634,
    area: 2933,
    flag: 'flag-zeeland',
    head: KC,
    note: 'The province with the fewest people: islands and peninsulas between the sea arms of the delta, and Zeelandic Flanders across the Westerschelde.',
  },
  'NL-NB': {
    name: 'North Brabant',
    own: 'Noord-Brabant',
    part: 'netherlands',
    capital: "'s-Hertogenbosch",
    at: [5.304, 51.69],
    biggest: 'Eindhoven',
    pop: 2644739,
    area: 5082,
    flag: 'flag-noord-brabant',
    head: KC,
    note: 'The northern half of the old duchy of Brabant, held by the Republic as conquered land until 1796. Eindhoven grew round the Philips works.',
  },
  'NL-LI': {
    name: 'Limburg',
    part: 'netherlands',
    capital: 'Maastricht',
    at: [5.691, 50.851],
    pop: 1133255,
    area: 2210,
    flag: 'flag-limburg-nl',
    head: KC,
    note: 'The eastern half of the Limburg that was cut in two in 1839, so the Netherlands and Belgium each have a Limburg. Its south has the country\'s only hills.',
  },
  'BE-VAN': {
    name: 'Antwerp',
    own: 'Antwerpen',
    part: 'flanders',
    capital: 'Antwerp',
    at: [4.402, 51.219],
    pop: 1926522,
    area: 2876,
    flag: 'flag-antwerp',
    head: GOV,
    note: 'The Belgian province with the most people, round the port of Antwerp, the second biggest in Europe.',
  },
  'BE-VLI': {
    name: 'Limburg',
    part: 'flanders',
    capital: 'Hasselt',
    at: [5.338, 50.931],
    pop: 900098,
    area: 2427,
    flag: 'flag-limburg-be',
    head: GOV,
    note: 'The western half of the Limburg cut in two in 1839. Coal was mined under the Kempen here from 1917 until the last mine, at Zolder, closed in 1992.',
  },
  'BE-VOV': {
    name: 'East Flanders',
    own: 'Oost-Vlaanderen',
    part: 'flanders',
    capital: 'Ghent',
    at: [3.717, 51.054],
    pop: 1572002,
    area: 3007,
    flag: 'flag-east-flanders',
    head: GOV,
    note: 'The land along the Scheldt and the Leie round Ghent, once the heart of the county of Flanders and of its cloth.',
  },
  'BE-VWV': {
    name: 'West Flanders',
    own: 'West-Vlaanderen',
    part: 'flanders',
    capital: 'Bruges',
    at: [3.225, 51.209],
    pop: 1226375,
    area: 3197,
    flag: 'flag-west-flanders',
    head: GOV,
    note: 'Belgium\'s only coast, about 67 km of it from De Panne to Knokke, and the Westhoek, where the front ran from 1914 to 1918.',
  },
  'BE-VBR': {
    name: 'Flemish Brabant',
    own: 'Vlaams-Brabant',
    part: 'flanders',
    capital: 'Leuven',
    at: [4.701, 50.879],
    pop: 1196773,
    area: 2118,
    flag: 'flag-flemish-brabant',
    head: GOV,
    note: 'Made in 1995, when the province of Brabant was split in three. It wraps all the way round Brussels.',
  },
  'BE-WBR': {
    name: 'Walloon Brabant',
    own: 'Brabant wallon',
    part: 'wallonia',
    capital: 'Wavre',
    at: [4.601, 50.717],
    pop: 414130,
    area: 1097,
    flag: 'flag-walloon-brabant',
    head: GOV,
    note: 'The smallest Belgian province, made in 1995 from the French-speaking south of Brabant. Waterloo is in it.',
  },
  'BE-WHT': {
    name: 'Hainaut',
    own: 'Henegouwen in Dutch',
    part: 'wallonia',
    capital: 'Mons',
    at: [3.952, 50.454],
    biggest: 'Charleroi',
    pop: 1360074,
    area: 3813,
    flag: 'flag-hainaut',
    head: GOV,
    note: 'The Walloon province with the most people, the old coal country of the Borinage and Charleroi. Its capital is Mons, not Charleroi.',
  },
  'BE-WNA': {
    name: 'Namur',
    own: 'Namen in Dutch',
    part: 'wallonia',
    capital: 'Namur',
    at: [4.867, 50.467],
    pop: 503895,
    area: 3675,
    flag: 'flag-namur',
    head: GOV,
    note: 'Where the Sambre meets the Meuse. Its capital is also the capital of Wallonia, where the Walloon parliament and government sit.',
  },
  'BE-WLG': {
    name: 'Liège',
    own: 'Luik in Dutch, Lüttich in German',
    part: 'wallonia',
    capital: 'Liège',
    at: [5.567, 50.633],
    pop: 1119038,
    area: 3857,
    flag: 'flag-liege',
    head: GOV,
    note: 'Once the land of the prince-bishops of Liège. Its east, round Eupen and Sankt Vith, has been Belgian since 1920 and speaks German.',
  },
  'BE-WLX': {
    name: 'Luxembourg',
    own: 'Luxemburg in Dutch',
    part: 'wallonia',
    capital: 'Arlon',
    at: [5.817, 49.683],
    pop: 295146,
    area: 4459,
    flag: 'flag-luxembourg-be',
    head: GOV,
    note: 'The largest Belgian province and the emptiest, deep in the Ardennes: the western half of the grand duchy, kept by Belgium in 1839.',
  },
  'BE-BRU': {
    name: 'Brussels',
    own: 'Région de Bruxelles-Capitale, Brussels Hoofdstedelijk Gewest',
    part: 'brussels',
    capital: 'Brussels',
    at: [4.357, 50.847],
    pop: 1249597,
    area: 162,
    flag: 'flag-brussels',
    head: 'A region, not a province: its own parliament and government, and a governor for the few tasks a province would have',
    note: 'Nineteen municipalities, in French and Dutch both. It became a region of its own in 1989, and has belonged to no province since Brabant was split in 1995.',
  },
}

export const provincesOf = (country: 'NLD' | 'BEL' | 'both'): ProvinceId[] =>
  provinceIds.filter((id) => country === 'both' || (country === 'NLD') === id.startsWith('NL-'))
