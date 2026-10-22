// The time map through all the eras so far: one map of the Low Countries that steps
// through 46 snapshots, from Caesar's conquest to the feast map of 2023. Each era's lines,
// sites, labels and areas come from the unit maps (Roman, the languages of about 1100, Burgundy, the painters' workshops, revolt,
// the Golden Age painters, the learning of 1656, the Spanish Netherlands, the border changes to 1815, the kingdom of 1815 to 1839,
// Belgium's first railways and coal country, the railways and canals of 1839 to 1914,
// Belgium's front of 1914 to 1918, the modern artists, the sport of 1928, the war of 1940 to 1945, the comics of 1946, water and the flood of 1953,
// the buildings of Expo 58, Belgium's language areas from 1963, the food map of 2016, the feast map of 2023), and stay on the map only from the era's first
// snapshot to its end, so one era never bleeds into another. The Delta Works and the
// language areas share the years 1963 to 1997, so those snapshots show both keys, and
// so do Burgundy and the painters in 1520 and 1549, and the revolt and the Golden Age painters
// in 1642, and the buildings and the water works in 1958.
// The plan's full time map runs to today with about 40 snapshots; these are the 46 of
// Units 1 to 25.

import { bordersStory } from './borders'
import { buildingsStory } from './buildings'
import { foodStory } from './food'
import { feastStory } from './feastMap'
import { sportStory } from './sport'
import { popStory } from './pop'
import { scienceStory } from './science'
import { stateStory } from './state'
import { burgundyStory } from './burgundy'
import { greatWarByYear } from './greatwar'
import { industryStory } from './industry'
import { kingdomStory } from './kingdom'
import { languageByYear } from './language'
import { mastersStory } from './masters'
import { modernsStory } from './moderns'
import { occupationByYear } from './occupation'
import { paintersStory } from './painters'
import { railsStory } from './rails'
import { revoltStory } from './revolt'
import { romanStory } from './roman'
import { spanishStory } from './spanish'
import { tonguesStory } from './tongues'
import type { HistEvent, HistLabel, HistSite, TimeStory } from './timeline'
import { waterStory } from './water'

// Between the Romans and Burgundy: the patchwork of counties, duchies and bishoprics
// in the time of the cloth towns (Unit 3).
const MEDIEVAL_MIN = 1302
const MEDIEVAL_MAX = 1383

const medievalLabels: HistLabel[] = burgundyStory.labels
  .filter((l) => l.kind === 'territory' || l.kind === 'people')
  .map((l) => ({ ...l, from: MEDIEVAL_MIN, to: MEDIEVAL_MAX }))

const medievalSites: HistSite[] = [
  { name: 'Bruges', kind: 'town', from: MEDIEVAL_MIN, at: [3.225, 51.209], label: 'left' },
  { name: 'Ghent', kind: 'town', from: MEDIEVAL_MIN, at: [3.717, 51.054], label: 'right' },
  { name: 'Ypres', kind: 'town', from: MEDIEVAL_MIN, at: [2.885, 50.851], label: 'left' },
  { name: 'Kortrijk', kind: 'battle', from: MEDIEVAL_MIN, at: [3.265, 50.828], label: 'right', note: 'Battle of the Golden Spurs, 11 July 1302' },
]

const medievalStory: TimeStory = {
  place: 'the Low Countries',
  min: MEDIEVAL_MIN,
  max: MEDIEVAL_MAX,
  format: String,
  events: [
    {
      from: 1302,
      title: '1302: A patchwork of lands',
      text: 'Counts, dukes and bishops rule the Low Countries piece by piece. Flanders is the richest, thanks to its cloth towns. On 11 July 1302, outside Kortrijk, Flemish townsmen on foot beat the knights of the French king.',
    },
  ],
  lines: [],
  sites: medievalSites,
  labels: medievalLabels,
  key: [
    { swatch: 'key-town', text: 'Town' },
    { swatch: 'key-battle', text: 'Battle' },
  ],
}

// The two trading companies at home in 1621 (Unit 7): the chambers that ran them.
// The Republic's borders come from the revolt map, which is still running.
const COMPANIES = 1621
// Towns with chambers of both companies get two marks side by side.
const both = (name: string, [lon, lat]: [number, number], label: 'left' | 'right', voc: string, wic: string): HistSite[] => [
  { name, kind: 'voc', from: COMPANIES, at: [lon - 0.045, lat], label, note: voc },
  { name: `${name} (WIC)`, kind: 'wic', from: COMPANIES, at: [lon + 0.045, lat], note: wic },
]

const companiesStory: TimeStory = {
  place: 'the Low Countries',
  min: COMPANIES,
  max: COMPANIES,
  format: String,
  events: [
    {
      from: COMPANIES,
      title: '1621: Two trading companies',
      text: "The truce with Spain ends, and the West India Company is founded to trade, and fight, in Africa and the Americas. Like the East India Company of 1602, it is run by chambers in the merchant towns, most of them in Holland and Zeeland. From here the ships sail out to Asia, Africa and the Americas.",
    },
  ],
  lines: [],
  sites: [
    ...both('Amsterdam', [4.9, 52.373], 'left', 'The largest chambers of the VOC and the WIC', 'WIC chamber'),
    ...both('Middelburg', [3.61, 51.499], 'left', 'The Zeeland chambers of the VOC and the WIC', 'WIC chamber'),
    ...both('Rotterdam', [4.48, 51.922], 'right', 'VOC chamber, and the WIC chamber of the Maas', 'WIC chamber'),
    ...both('Hoorn', [5.06, 52.643], 'left', 'VOC chamber; the WIC chamber of the Noorderkwartier sat here and in Enkhuizen', 'WIC chamber'),
    ...both('Enkhuizen', [5.293, 52.703], 'right', 'VOC chamber; shared the WIC chamber of the Noorderkwartier with Hoorn', 'WIC chamber'),
    { name: 'Delft', kind: 'voc', from: COMPANIES, at: [4.357, 52.012], label: 'left', note: 'VOC chamber' },
    { name: 'Groningen', kind: 'wic', from: COMPANIES, at: [6.567, 53.219], label: 'right', note: 'WIC chamber of Stad en Lande' },
  ],
  labels: [],
  key: [
    ...(revoltStory.key ?? []).filter((k) => k.swatch === 'key-ruled' || k.swatch === 'key-rebel'),
    { swatch: 'key-voc', text: 'Chamber of the VOC' },
    { swatch: 'key-wic', text: 'Chamber of the WIC' },
  ],
}

// Belgium's first railways and the coal belt (Unit 13), up to the start of the next era
// in 1856. The Netherlands, its first railway and Luxembourg under the Dutch king come
// from the railways map of the Netherlands.
const EARLY_RAILS_MAX = 1855
const before = <T extends { from: number }>(items: T[]) => items.filter((i) => i.from <= EARLY_RAILS_MAX)
const earlyRailsStory: TimeStory = {
  ...industryStory,
  max: EARLY_RAILS_MAX,
  events: before(industryStory.events),
  lines: before([...railsStory.lines, ...industryStory.lines]),
  sites: before([...railsStory.sites, ...industryStory.sites]),
  labels: before(industryStory.labels),
  areas: before([...(railsStory.areas ?? []), ...(industryStory.areas ?? []).filter((a) => a.kind === 'coal')]),
}

// The Golden Age painters (Unit 17) in 1642, at the height of the age. Their map runs on to
// 1682, but here it ends with the war in 1648, so its painters don't crowd the snapshots of
// the Spanish Netherlands that follow. The revolt map already names the two countries.
const goldenAgeStory: TimeStory = { ...mastersStory, max: 1647, labels: mastersStory.labels.filter((l) => l.kind !== 'territory') }

// The modern artists (Unit 18) in 1917, the year of De Stijl. Their map runs on to 1973,
// but here it ends before the Games of 1928, and keeps only the country names of its labels.
const modernArtStory: TimeStory = { ...modernsStory, max: 1927, labels: modernsStory.labels.filter((l) => l.kind === 'territory') }

// Sport (Unit 23) in 1928, the year of the Amsterdam Olympics: the first races, the Elfstedentocht,
// korfball and the Games of Antwerp and Amsterdam, gone again before the war of 1940. The unit's
// own map runs on to 2017.
const sportThenStory: TimeStory = { ...sportStory, max: 1939, labels: sportStory.labels.filter((l) => l.kind === 'territory' || l.kind === 'water') }

// Comics (Unit 24) in 1946, the year Tintin got a magazine of his own: Tintin, Spirou, Tom Poes,
// Suske en Wiske and Lucky Luke, the first great Belgian and Dutch strips, gone again before the
// flood of 1953. The unit's own map runs on to the song contest of 2021.
const comicsThenStory: TimeStory = { ...popStory, max: 1952, labels: popStory.labels.filter((l) => l.kind === 'territory' || l.kind === 'water') }

// Learning (Unit 25) in 1656, the year of Huygens's pendulum clock: the universities, printers and
// thinkers of the Low Countries from Leuven in 1425 on, gone again when the French war of 1667 begins.
// The unit's own map runs on to Lemaître's primeval atom of 1931.
const scienceThenStory: TimeStory = { ...scienceStory, max: 1667, labels: scienceStory.labels.filter((l) => l.kind === 'territory' || l.kind === 'water') }

// The buildings of the century (Unit 19) in 1958, the year of Expo 58: Art Nouveau and modern
// buildings from 1893 on, gone again before the language border of 1963. The older buildings
// stay on the unit's own map, and only the Atomium is named, so the snapshot isn't crowded.
const ARCHITECTURE_MAX = 1962
const architectureStory: TimeStory = {
  ...buildingsStory,
  max: ARCHITECTURE_MAX,
  sites: buildingsStory.sites.filter((s) => s.from >= 1893).map((s) => (s.name === 'Atomium' ? s : { ...s, label: undefined })),
  labels: [],
}

// The languages (Unit 20) in about 1100, the time of Hebban olla vogala: Frisian, Saxon,
// Old Dutch and Romance, gone again before the patchwork of lands of 1302.
const oldTonguesStory: TimeStory = { ...tonguesStory, max: 1301 }

// The food and drink of the Low Countries (Unit 21) in 2016, the year Belgian beer culture joined
// UNESCO's list: every cheese, fish, sweet, dish, brewery and distillery on the unit's map at once,
// a regional food map at the end of the time map. Only the marks are kept; their names stay on
// the unit's own map, so the snapshot isn't crowded.
const foodTodayStory: TimeStory = {
  ...foodStory,
  sites: foodStory.sites.map((s) => ({ ...s, label: undefined })),
  labels: foodStory.labels.filter((l) => l.from === foodStory.max),
}

// The feasts and traditions of the Low Countries (Unit 22) in 2023, the year of the king's apology on
// Keti Koti: every feast on the unit's map at once, a feast map at the end of the time map. As with
// the food map, the marks stay and their names are left to the unit's own map.
const feastsTodayStory: TimeStory = {
  ...feastStory,
  sites: feastStory.sites.map((s) => ({ ...s, label: undefined })),
  labels: feastStory.labels.filter((l) => l.from <= feastStory.max && (l.to === undefined || l.to >= feastStory.max) && l.kind !== 'water'),
}

// The stage each snapshot shows, taken from its era's own captions unless given here.
// `also` is another era still on the map at that snapshot, whose key is shown too.
type Snapshot = { story: TimeStory; from: number; event?: Omit<HistEvent, 'from'>; also?: TimeStory }

const snapshots: Snapshot[] = [
  { story: romanStory, from: -57 },
  { story: romanStory, from: 47 },
  { story: romanStory, from: 406 },
  { story: oldTonguesStory, from: 1100 },
  { story: medievalStory, from: 1302 },
  { story: burgundyStory, from: 1384 },
  { story: burgundyStory, from: 1477 },
  { story: paintersStory, from: 1520, also: burgundyStory },
  { story: burgundyStory, from: 1549, also: paintersStory },
  { story: revoltStory, from: 1579 },
  { story: revoltStory, from: 1585 },
  { story: revoltStory, from: 1609 },
  { story: companiesStory, from: COMPANIES },
  { story: goldenAgeStory, from: 1642, also: revoltStory },
  { story: revoltStory, from: 1648 },
  { story: scienceThenStory, from: 1656 },
  { story: spanishStory, from: 1668 },
  { story: spanishStory, from: 1672 },
  { story: spanishStory, from: 1678 },
  { story: bordersStory, from: 1714 },
  { story: bordersStory, from: 1795 },
  { story: bordersStory, from: 1810 },
  { story: bordersStory, from: 1815 },
  { story: kingdomStory, from: 1830 },
  { story: kingdomStory, from: 1839 },
  { story: earlyRailsStory, from: 1843 },
  { story: railsStory, from: 1856 },
  { story: railsStory, from: 1876 },
  { story: railsStory, from: 1890 },
  { story: railsStory, from: 1914 },
  { story: greatWarByYear, from: 1915 },
  { story: modernArtStory, from: 1917 },
  { story: sportThenStory, from: 1928 },
  { story: occupationByYear, from: 1940 },
  { story: occupationByYear, from: 1944 },
  { story: occupationByYear, from: 1945 },
  { story: comicsThenStory, from: 1946 },
  { story: waterStory, from: 1953 },
  { story: architectureStory, from: 1958, also: waterStory },
  { story: languageByYear, from: 1963, also: waterStory },
  { story: waterStory, from: 1986, also: languageByYear },
  { story: languageByYear, from: 1993, also: waterStory },
  {
    story: waterStory,
    from: 1997,
    also: languageByYear,
    event: {
      title: '1997: The Delta Works are complete',
      text: "Dams and storm barriers shorten the coast of Zeeland and South Holland, and the Maeslantkering guards Rotterdam. The Zuiderzee has become the IJsselmeer, with Flevoland drained from it.",
    },
  },
  { story: languageByYear, from: 2012 },
  { story: foodTodayStory, from: 2016 },
  { story: feastsTodayStory, from: 2023 },
  { story: stateStory, from: 2026 },
]

const eras = [...new Set(snapshots.map((s) => s.story))]
// An era starts at its first snapshot: the map of 1672 to 1815 overlaps the Spanish
// Netherlands map, and must not draw over its snapshots of 1672 and 1678.
const eraStart = (era: TimeStory) => Math.min(...snapshots.filter((s) => s.story === era).map((s) => s.from))

// Every item stays inside its era: items that ended before it starts are dropped,
// areas and labels are cut off at its end, and lines and sites, which otherwise
// linger faded, are removed.
const within = <T extends { from: number; to?: number }>(item: T, start: number, end: number) => ({
  ...item,
  from: Math.max(item.from, start),
  to: Math.min(item.to ?? end, end),
})
const inEra = <T extends { from: number; to?: number }>(era: TimeStory, items: T[]) => {
  const start = eraStart(era)
  return items.filter((i) => (i.to ?? Infinity) >= start)
}

export const formatAnyYear = (y: number) => (y < 0 ? `${-y} BCE` : y < 1000 ? `${y} CE` : String(y))

export const throughTimeStory: TimeStory = {
  place: 'the Low Countries',
  min: snapshots[0].from,
  max: snapshots[snapshots.length - 1].from,
  format: formatAnyYear,
  events: snapshots.map(({ story, from, event, also }) => {
    const own = story.events.find((e) => e.from === from)
    if (!own && !event) throw new Error(`No caption for ${from}`)
    const key = [...(story.key ?? []), ...(also?.key ?? []).filter((k) => !story.key?.some((s) => s.swatch === k.swatch))]
    return { ...own!, ...event, from, key, fresh: story.fresh ?? 'fill' }
  }),
  lines: eras.flatMap((era) => inEra(era, era.lines).map((l) => ({ ...l, from: Math.max(l.from, eraStart(era)), end: era.max }))),
  sites: eras.flatMap((era) => inEra(era, era.sites).map((s) => ({ ...s, from: Math.max(s.from, eraStart(era)), end: era.max }))),
  labels: eras.flatMap((era) => inEra(era, era.labels).map((l) => within(l, eraStart(era), era.max))),
  areas: eras.flatMap((era) => inEra(era, era.areas ?? []).map((a) => within(a, eraStart(era), era.max))),
  note: 'Borders are approximate and drawn with today\'s provinces and coastline. Each snapshot comes from the map of its unit.',
  key: romanStory.key,
}
