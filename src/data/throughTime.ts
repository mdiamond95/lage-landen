// The time map through all the eras so far: one map of the Low Countries that steps
// through 12 snapshots, from Caesar's conquest to the Delta Works. Each era's lines,
// sites, labels and areas come from the unit maps (Roman, Burgundy, revolt, water),
// and leave the map when their era ends, so one era never bleeds into the next.
// The plan's full time map runs to today with about 40 snapshots; this is the
// first 12, for Units 1 to 5.

import { burgundyStory } from './burgundy'
import { revoltStory } from './revolt'
import { romanStory } from './roman'
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

// The stage each snapshot shows, taken from its era's own captions unless given here.
type Snapshot = { story: TimeStory; from: number; event?: Omit<HistEvent, 'from'> }

const snapshots: Snapshot[] = [
  { story: romanStory, from: -57 },
  { story: romanStory, from: 47 },
  { story: romanStory, from: 406 },
  { story: medievalStory, from: 1302 },
  { story: burgundyStory, from: 1384 },
  { story: burgundyStory, from: 1477 },
  { story: burgundyStory, from: 1549 },
  { story: revoltStory, from: 1579 },
  { story: revoltStory, from: 1585 },
  { story: revoltStory, from: 1609 },
  { story: revoltStory, from: 1648 },
  {
    story: waterStory,
    from: 1997,
    event: {
      title: '1997: The Delta Works are complete',
      text: "Dams and storm barriers shorten the coast of Zeeland and South Holland, and the Maeslantkering guards Rotterdam. The Zuiderzee has become the IJsselmeer, with Flevoland drained from it.",
    },
  },
]

const eras = [...new Set(snapshots.map((s) => s.story))]

// Every item stays inside its era: areas and labels are cut off at its end, and
// lines and sites, which otherwise linger faded, are removed.
const within = <T extends { to?: number }>(item: T, end: number) => ({ ...item, to: Math.min(item.to ?? end, end) })

export const formatAnyYear = (y: number) => (y < 0 ? `${-y} BCE` : y < 1000 ? `${y} CE` : String(y))

export const throughTimeStory: TimeStory = {
  place: 'the Low Countries',
  min: snapshots[0].from,
  max: snapshots[snapshots.length - 1].from,
  format: formatAnyYear,
  events: snapshots.map(({ story, from, event }) => {
    const own = story.events.find((e) => e.from === from)
    if (!own && !event) throw new Error(`No caption for ${from}`)
    return { ...own!, ...event, from, key: story.key, fresh: story.fresh ?? 'fill' }
  }),
  lines: eras.flatMap((era) => era.lines.map((l) => ({ ...l, end: era.max }))),
  sites: eras.flatMap((era) => era.sites.map((s) => ({ ...s, end: era.max }))),
  labels: eras.flatMap((era) => era.labels.map((l) => within(l, era.max))),
  areas: eras.flatMap((era) => (era.areas ?? []).map((a) => within(a, era.max))),
  note: 'Borders are approximate and drawn with today\'s provinces and coastline. Each snapshot comes from the map of its unit.',
  key: romanStory.key,
}
