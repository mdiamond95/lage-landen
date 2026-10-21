// The calendar wheel of Unit 22: the feasts of the Netherlands and Belgium around the year.
// Each feast has a fixed date, or a span for the feasts that move with Easter or fall on a
// set weekday, and a kind, which gives its mark on the wheel and on the feast time map.
// Dates are days of a year that is not a leap year, 1 January being day 1.

import type { PhotoId } from '../photos/ids'

export const feastKinds = ['church', 'saint', 'carnival', 'procession', 'nation', 'memory', 'folk'] as const
export type FeastKind = (typeof feastKinds)[number]
export const feastKindNames: Record<FeastKind, string> = {
  church: 'Church year',
  saint: "Saints' days",
  carnival: 'Carnival',
  procession: 'Processions and giants',
  nation: 'Kings and nations',
  memory: 'Remembrance and freedom',
  folk: 'Folk customs',
}

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
export const DAYS = 365
// The day of the year of a date, 1 to 365.
export const doy = (month: number, day: number) => LENGTHS.slice(0, month - 1).reduce((a, b) => a + b, 0) + day
// The date of a day of the year, as "27 April".
export const dateOf = (day: number) => {
  let d = ((((day - 1) % DAYS) + DAYS) % DAYS) + 1
  for (let m = 0; m < 12; m++) {
    if (d <= LENGTHS[m]) return `${d} ${MONTHS[m]}`
    d -= LENGTHS[m]
  }
  return ''
}
// The first day of each month, for drawing the wheel.
export const monthStarts = MONTHS.map((_, i) => doy(i + 1, 1))

// Easter falls between 22 March and 25 April; carnival's Sunday to Tuesday between 1 February
// and 9 March; Ascension Day 39 days after Easter, between 30 April and 3 June; Trinity Sunday a
// week after Whitsun, between 17 May and 20 June.
const EASTER: [number, number] = [doy(3, 22), doy(4, 25)]
const CARNIVAL: [number, number] = [doy(2, 1), doy(3, 9)]
const ASCENSION: [number, number] = [doy(4, 30), doy(6, 3)]
const TRINITY: [number, number] = [doy(5, 17), doy(6, 20)]

export type Feast = {
  name: string
  // Its name in Dutch or French, where it differs.
  own?: string
  kind: FeastKind
  // nl, be or both.
  country: 'nl' | 'be' | 'both'
  // One day, or the span of days it can fall on.
  day: number | [number, number]
  // When it falls, in words.
  when: string
  place: string
  photo?: PhotoId
  about: string
}

const feastList = {
  'new-year-dive': {
    name: 'New Year’s dive',
    own: 'Nieuwjaarsduik',
    kind: 'folk',
    country: 'nl',
    day: doy(1, 1),
    when: '1 January',
    place: 'Scheveningen and beaches along the North Sea',
    photo: 'nieuwjaarsduik',
    about: 'On New Year’s Day thousands of people run into the cold North Sea, and out again, to start the year awake.',
  },
  epiphany: {
    name: 'Twelfth Night',
    own: 'Driekoningen',
    kind: 'church',
    country: 'both',
    day: doy(1, 6),
    when: '6 January',
    place: 'Everywhere',
    photo: 'twelfth-night',
    about: 'The feast of the Three Kings ends the Christmas season. In the old custom, whoever found the bean baked into the cake was king for the night, as Jan Steen painted it.',
  },
  'carnival-binche': {
    name: 'Carnival of Binche',
    kind: 'carnival',
    country: 'be',
    day: CARNIVAL,
    when: 'The Sunday to Tuesday before Lent, seven weeks before Easter',
    place: 'Binche, in Hainaut',
    photo: 'binche-gilles',
    about: 'On Shrove Tuesday up to a thousand Gilles dance through Binche from dawn, in wax masks, clogs and bells, and in the afternoon in tall hats of ostrich feathers, throwing blood oranges. UNESCO listed the carnival in 2003.',
  },
  'carnival-south': {
    name: 'Carnival in the south',
    own: 'Carnaval, vastelaovend',
    kind: 'carnival',
    country: 'nl',
    day: CARNIVAL,
    when: 'The Sunday to Tuesday before Lent',
    place: 'Limburg and North Brabant, below the great rivers',
    photo: 'maastricht-2023',
    about: 'In the Catholic south of the Netherlands towns crown a Prince Carnival, hand him the keys of the town hall, and dress up for three days. Maastricht calls it vastelaovend.',
  },
  'easter-fires': {
    name: 'Easter fires',
    own: 'Paasvuren',
    kind: 'folk',
    country: 'nl',
    day: EASTER,
    when: 'Easter Sunday, between 22 March and 25 April',
    place: 'The east of the Netherlands, where Low Saxon is spoken',
    photo: 'paasvuur',
    about: 'Villages in Twente, the Achterhoek and the north-east pile up wood for weeks and light huge bonfires on Easter Sunday evening.',
  },
  'kings-day': {
    name: 'King’s Day',
    own: 'Koningsdag',
    kind: 'nation',
    country: 'nl',
    day: doy(4, 27),
    when: '27 April (26 April when the 27th is a Sunday)',
    place: 'Everywhere in the Netherlands, Amsterdam’s canals above all',
    photo: 'koningsdag-boats',
    about: 'The king’s birthday: the country dresses in orange, and anyone may sell on the street without a permit at the vrijmarkt. It began as Princess’s Day in 1885.',
  },
  remembrance: {
    name: 'Remembrance of the Dead',
    own: 'Dodenherdenking',
    kind: 'memory',
    country: 'nl',
    day: doy(5, 4),
    when: '4 May, at 8 in the evening',
    place: 'The National Monument on the Dam, Amsterdam, and every town',
    photo: 'dam-4-mei',
    about: 'At 8 pm the country falls silent for two minutes, and trains and traffic stop, for all who died in war and peacekeeping since the Second World War began.',
  },
  liberation: {
    name: 'Liberation Day',
    own: 'Bevrijdingsdag',
    kind: 'memory',
    country: 'nl',
    day: doy(5, 5),
    when: '5 May',
    place: 'Wageningen, where the Germans surrendered in 1945, and festivals across the country',
    photo: 'liberation-1955',
    about: 'The day after the silence, the end of the German occupation of 1940 to 1945 is celebrated with festivals.',
  },
  'holy-blood': {
    name: 'Procession of the Holy Blood',
    own: 'Heilig-Bloedprocessie',
    kind: 'procession',
    country: 'be',
    day: ASCENSION,
    when: 'Ascension Day, 39 days after Easter',
    place: 'Bruges',
    photo: 'holy-blood-relic',
    about: 'More than 3,000 people of Bruges carry the relic of the Holy Blood through the town and act out scenes from the Bible. It went round the town walls by 1303, and UNESCO listed it in 2009.',
  },
  doudou: {
    name: 'The Doudou',
    own: 'Ducasse de Mons',
    kind: 'procession',
    country: 'be',
    day: TRINITY,
    when: 'Trinity Sunday, eight weeks after Easter',
    place: 'Mons',
    photo: 'car-dor',
    about: 'The golden car of Saint Waltrude is pulled up the steep street to her church in one go, and at noon Saint George fights the dragon on the Grand-Place, in the combat called the Lumeçon.',
  },
  ommegang: {
    name: 'Ommegang',
    kind: 'procession',
    country: 'be',
    day: [doy(6, 29), doy(7, 7)],
    when: 'Two evenings around the turn of June and July',
    place: 'Brussels, from the Sablon to the Grand-Place',
    photo: 'alsloot-isabella',
    about: 'A great procession in costume, replaying the Ommegang held for Emperor Charles V in 1549, with giants, horsemen and the guilds. UNESCO listed it in 2019.',
  },
  'keti-koti': {
    name: 'Keti Koti',
    own: 'Dag der Vrijheden',
    kind: 'memory',
    country: 'nl',
    day: doy(7, 1),
    when: '1 July',
    place: 'The Oosterpark, Amsterdam, and Suriname',
    photo: 'keti-koti-2018',
    about: 'Keti Koti, “the chain is cut” in Sranan Tongo, remembers slavery and its abolition on 1 July 1863 in Suriname and the Dutch Caribbean. In Suriname it has been a public holiday since 1955.',
  },
  'flemish-day': {
    name: 'Day of the Flemish Community',
    own: 'Vlaamse feestdag',
    kind: 'nation',
    country: 'be',
    day: doy(7, 11),
    when: '11 July',
    place: 'Flanders, remembering Kortrijk',
    about: 'The anniversary of the Battle of the Golden Spurs at Kortrijk in 1302 (Unit 3), the feast of the Flemish Community.',
  },
  'national-day': {
    name: 'National Day',
    own: 'Nationale feestdag, fête nationale',
    kind: 'nation',
    country: 'be',
    day: doy(7, 21),
    when: '21 July',
    place: 'Brussels, with a parade past the royal palace',
    photo: 'verhas-21-july',
    about: 'On 21 July 1831 Leopold I swore the oath as the first King of the Belgians (Unit 9). The army and the emergency services parade in Brussels, and the day ends with fireworks.',
  },
  meyboom: {
    name: 'Meyboom',
    kind: 'procession',
    country: 'be',
    day: doy(8, 9),
    when: '9 August, before 5 pm',
    place: 'Brussels, at the corner of the Zandstraat and the Broekstraat',
    photo: 'meyboom',
    about: 'Brussels must plant its may tree before 5 pm on the eve of Saint Lawrence, or the right passes to Leuven, so the story goes. Giants dance around it.',
  },
  ath: {
    name: 'Ducasse of Ath',
    kind: 'procession',
    country: 'be',
    day: [doy(8, 22), doy(8, 28)],
    when: 'The fourth Sunday of August',
    place: 'Ath, in Hainaut',
    photo: 'goliath-ath',
    about: 'The giants of Ath parade, with Goliath and his wife, and David fights Goliath. UNESCO took the feast off its list in 2022, after complaints about a character played in blackface.',
  },
  'princes-day': {
    name: 'Prince’s Day',
    own: 'Prinsjesdag',
    kind: 'nation',
    country: 'nl',
    day: [doy(9, 15), doy(9, 21)],
    when: 'The third Tuesday of September',
    place: 'The Hague',
    about: 'The king rides to the Ridderzaal and opens the parliamentary year with the speech from the throne, and the government presents its budget.',
  },
  'leiden-relief': {
    name: 'Relief of Leiden',
    own: 'Leidens Ontzet',
    kind: 'memory',
    country: 'nl',
    day: doy(10, 3),
    when: '3 October',
    place: 'Leiden',
    photo: 'leiden-relief',
    about: 'Leiden remembers the end of the Spanish siege in 1574 (Unit 5) with herring, white bread and hutspot, and a fair.',
  },
  'all-saints': {
    name: 'All Saints',
    own: 'Allerheiligen, Toussaint',
    kind: 'church',
    country: 'be',
    day: doy(11, 1),
    when: '1 November',
    place: 'Belgium, where it is a public holiday',
    about: 'Families visit the graves of their dead and bring chrysanthemums, the day before All Souls.',
  },
  'st-martin': {
    name: 'Saint Martin',
    own: 'Sint-Maarten',
    kind: 'saint',
    country: 'both',
    day: doy(11, 11),
    when: '11 November, or the evening before in West Flanders',
    place: 'Utrecht, whose patron saint he is, and towns in both countries',
    photo: 'sint-maarten',
    about: 'Children carry lanterns from door to door and sing for sweets. Around Ypres, children once hung up stockings with hay for his horse, and found presents in the morning.',
  },
  armistice: {
    name: 'Armistice Day',
    own: 'Wapenstilstand, Armistice',
    kind: 'memory',
    country: 'be',
    day: doy(11, 11),
    when: '11 November',
    place: 'Ypres, at the Menin Gate',
    photo: 'last-post',
    about: 'The end of the First World War in 1918, a public holiday in Belgium. At the Menin Gate the Last Post is played, as it is every evening (Unit 14).',
  },
  arrival: {
    name: 'Arrival of Sinterklaas',
    own: 'Intocht van Sinterklaas',
    kind: 'saint',
    country: 'both',
    day: [doy(11, 10), doy(11, 20)],
    when: 'A Saturday in mid-November',
    place: 'A different harbour town each year, and towns everywhere',
    photo: 'steamboat-1960s',
    about: 'Sinterklaas arrives by steamboat “from Spain” and rides through the streets on his horse, three weeks before his feast.',
  },
  'kings-feast': {
    name: 'King’s Feast',
    own: 'Koningsdag, fête du Roi',
    kind: 'nation',
    country: 'be',
    day: doy(11, 15),
    when: '15 November',
    place: 'Brussels, in parliament and the cathedral',
    about: 'Kept since 1866: a Te Deum is sung and parliament honours the king. Federal offices close, but it is not a public holiday. The German-speaking Community holds its own feast on the same day.',
  },
  'gift-evening': {
    name: 'Sinterklaas evening',
    own: 'Pakjesavond',
    kind: 'saint',
    country: 'nl',
    day: doy(12, 5),
    when: 'The evening of 5 December',
    place: 'The Netherlands',
    photo: 'choc-letter',
    about: 'Dutch families open their presents, read the poems that come with them and eat chocolate letters, pepernoten and speculaas.',
  },
  'st-nicholas': {
    name: 'Saint Nicholas',
    own: 'Sinterklaas, Saint-Nicolas',
    kind: 'saint',
    country: 'be',
    day: doy(12, 6),
    when: 'The morning of 6 December',
    place: 'Belgium and the south of the Netherlands',
    photo: 'steen-nicholas',
    about: 'The saint’s own feast day. Belgian children find their presents in the morning, in or by the shoe they put out, with a carrot or hay for the horse.',
  },
  christmas: {
    name: 'Christmas',
    own: 'Kerstmis, Noël',
    kind: 'church',
    country: 'both',
    day: doy(12, 25),
    when: '25 December, and 26 December in the Netherlands',
    place: 'Everywhere',
    about: 'The birth of Christ, with church services, a tree and a long family meal. The Netherlands has a second Christmas Day off; Belgium does not.',
  },
  'new-years-eve': {
    name: 'New Year’s Eve',
    own: 'Oudejaarsavond',
    kind: 'folk',
    country: 'both',
    day: doy(12, 31),
    when: '31 December',
    place: 'Everywhere',
    photo: 'cuyp-oliebollen',
    about: 'Dutch families fry oliebollen, and at midnight the sky fills with fireworks.',
  },
} satisfies Record<string, Feast>

export type FeastId = keyof typeof feastList
export const feasts: Record<FeastId, Feast> = feastList
export const feastIds = Object.keys(feastList) as [FeastId, ...FeastId[]]

export const spanOf = (f: Feast): [number, number] => (typeof f.day === 'number' ? [f.day, f.day] : f.day)
// How many days a day lies outside a feast's span, going the short way round the year.
export const daysOff = (f: Feast, day: number) => {
  const [a, b] = spanOf(f)
  if (day >= a && day <= b) return 0
  const gap = (x: number, y: number) => {
    const d = Math.abs(x - y) % DAYS
    return Math.min(d, DAYS - d)
  }
  return Math.min(gap(day, a), gap(day, b))
}
