// The time map through all the eras so far: one map of the Low Countries that steps
// through 37 snapshots, from Caesar's conquest to the federal Belgium of 2012. Each era's lines,
// sites, labels and areas come from the unit maps (Roman, Burgundy, the painters' workshops, revolt, the
// Spanish Netherlands, the border changes to 1815, the kingdom of 1815 to 1839,
// Belgium's first railways and coal country, the railways and canals of 1839 to 1914,
// Belgium's front of 1914 to 1918, the war of 1940 to 1945, water and the flood of 1953,
// Belgium's language areas from 1963), and stay on the map only from the era's first
// snapshot to its end, so one era never bleeds into another. The Delta Works and the
// language areas share the years 1963 to 1997, so those snapshots show both keys, and
// so do Burgundy and the painters in 1520 and 1549.
// The plan's full time map runs to today with about 40 snapshots; this is the first
// 37, for Units 1 to 16.

import { bordersStory } from './borders'
import { burgundyStory } from './burgundy'
import { greatWarByYear } from './greatwar'
import { industryStory } from './industry'
import { kingdomStory } from './kingdom'
import { languageByYear } from './language'
import { occupationByYear } from './occupation'
import { paintersStory } from './painters'
import { railsStory } from './rails'
import { revoltStory } from './revolt'
import { romanStory } from './roman'
import { spanishStory } from './spanish'
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

// The stage each snapshot shows, taken from its era's own captions unless given here.
// `also` is another era still on the map at that snapshot, whose key is shown too.
type Snapshot = { story: TimeStory; from: number; event?: Omit<HistEvent, 'from'>; also?: TimeStory }

const snapshots: Snapshot[] = [
  { story: romanStory, from: -57 },
  { story: romanStory, from: 47 },
  { story: romanStory, from: 406 },
  { story: medievalStory, from: 1302 },
  { story: burgundyStory, from: 1384 },
  { story: burgundyStory, from: 1477 },
  { story: paintersStory, from: 1520, also: burgundyStory },
  { story: burgundyStory, from: 1549, also: paintersStory },
  { story: revoltStory, from: 1579 },
  { story: revoltStory, from: 1585 },
  { story: revoltStory, from: 1609 },
  { story: companiesStory, from: COMPANIES },
  { story: revoltStory, from: 1648 },
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
  { story: occupationByYear, from: 1940 },
  { story: occupationByYear, from: 1944 },
  { story: occupationByYear, from: 1945 },
  { story: waterStory, from: 1953 },
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
