import { z } from 'zod'
import { chartIds } from '../data/charts'
import { treeIds } from '../data/families'
import { pairIds } from '../data/pairs'
import { tourIds } from '../data/paintings'
import { cellIds, rowIds } from '../data/pillars'
import { lineIds } from '../data/roman'
import { month } from '../data/timeline'
import { photoIds } from '../photos/ids'

// Everything a lesson can show or ask is described here. Lesson YAML is
// parsed against these schemas, so a typo in content fails tests and the build.

export const artIds = [
  'windmill',
  'terp',
  'dike',
  'polder',
  'barrier',
  'flag-nl',
  'flag-be',
  'flag-lu',
  'flag-de',
] as const
export type ArtId = (typeof artIds)[number]

const MapVisual = z.object({
  kind: z.literal('map'),
  // Country ids (NLD, BEL) or province ids (NL-ZE) to tint.
  highlight: z.array(z.string()).default([]),
  // River names as they appear in the map data (Rhine, Maas, Schelde...).
  rivers: z.array(z.string()).default([]),
  pins: z.array(z.string()).default([]),
  // Historical lines (frontiers, roads) from src/data/roman.ts.
  lines: z.array(z.enum(lineIds)).default([]),
})

const ArtVisual = z.object({ kind: z.literal('art'), art: z.enum(artIds) })
// A real photo or historical map from Wikimedia Commons, credited in src/photos/credits.ts.
const PhotoVisual = z.object({ kind: z.literal('photo'), photo: z.enum(photoIds) })
const PolderVisual = z.object({ kind: z.literal('polder-slider') })
// The Oosterschelde barrier in cross-section: raise the storm surge and the gates come down.
const BarrierVisual = z.object({ kind: z.literal('storm-barrier') })
// A map with a year slider, played as an animation: the Zuiderzee and Delta Works,
// the Roman frontier and roads, the wool and cloth trade, the lands joining
// Burgundy, the revolt splitting them, Amsterdam growing in the Golden Age, the
// Spanish Netherlands shrinking, the Dutch trading posts and colonies around the
// world, the borders changing from the Disaster Year to Waterloo, or one kingdom
// splitting in two from 1815 to 1839, or the railways and canals of the Netherlands from
// 1839 to 1914, or the Low Countries occupied and liberated, May 1940 to May 1945, month
// by month, or the southwest delta from the flood of 1953 to the last of the Delta Works,
// or Belgium's railways and coal country from 1835 to 1914, or the Congo from 1876 to 1961,
// or Belgium in the First World War and the front in the Westhoek, both month by month,
// or Belgium's languages and the lines the language laws drew, from 1830 to 2012, or where
// the painters of the Low Countries worked, from 1420 to 1569, or where the painters of the
// Golden Age worked, from the fall of Antwerp in 1585 to 1682.
// `year` opens it at a given year instead of the start.
export const timeMaps = ['water', 'roman', 'cloth', 'burgundy', 'revolt', 'amsterdam', 'spanish', 'empire', 'borders', 'kingdom', 'rails', 'occupation', 'delta', 'industry', 'congo', 'greatwar', 'westhoek', 'language', 'painters', 'masters'] as const
// The maps of the two world wars count in months, written "1944-09"; the others count in years.
const When = z.union([
  z.number(),
  z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'a month is written like 1944-09')
    .transform((s) => month(Number(s.slice(0, 4)), Number(s.slice(5)))),
])
const TimeMapVisual = z.object({ kind: z.literal('time-map'), map: z.enum(timeMaps), year: When.optional() })
// A family tree from src/data/families.ts; `hide` blanks out one person by id.
const TreeVisual = z.object({ kind: z.literal('family-tree'), tree: z.enum(treeIds), hide: z.string().optional() })

// A line chart from src/data/charts.ts; `until` cuts it off at a year.
const ChartVisual = z.object({ kind: z.literal('chart'), chart: z.enum(chartIds), until: z.number().optional() })

// Before and after: two years of a time map, one over the other, with a divider to
// drag between them. The cloth map draws routes rather than lands, so it can't be used.
export const compareMaps = ['water', 'roman', 'burgundy', 'revolt', 'amsterdam', 'spanish', 'empire', 'borders', 'kingdom', 'rails', 'occupation', 'delta', 'industry', 'congo', 'greatwar', 'westhoek', 'language', 'painters', 'masters'] as const
const CompareVisual = z.object({
  kind: z.literal('compare'),
  map: z.enum(compareMaps),
  years: z.tuple([When, When]).refine(([a, b]) => a < b, 'the earlier year comes first'),
})

// The pillars of Dutch society (src/data/pillars.ts); `hide` blanks one cell, written
// "pillar.row" (e.g. socialist.radio), and `only` shows a single row.
const PillarsVisual = z.object({
  kind: z.literal('pillars'),
  hide: z.enum(cellIds as [string, ...string[]]).optional(),
  only: z.enum(rowIds).optional(),
})

// Belgium's regions and communities side by side, on the map of Belgium; tap one to see
// what it runs. `show` draws only one of the two.
const FederalVisual = z.object({ kind: z.literal('federal'), show: z.enum(['regions', 'communities']).optional() })

// A painting tour from src/data/paintings.ts: a big painting to zoom deep into, with
// numbered details to step through. `focus` opens it zoomed in on one detail, by its id,
// without the numbers, as the picture for a question.
const PaintingVisual = z.object({ kind: z.literal('painting'), painting: z.enum(tourIds), focus: z.string().optional() })

// Two paintings side by side from src/data/pairs.ts, to compare two painters' ways of
// working: both glide together to the light, the faces or the brushwork. `focus` opens
// both zoomed in on one way of looking, by its id, as the picture for a question.
const PairVisual = z.object({ kind: z.literal('pair'), pair: z.enum(pairIds), focus: z.string().optional() })

export const Visual = z.discriminatedUnion('kind', [MapVisual, ArtVisual, PhotoVisual, PolderVisual, BarrierVisual, TimeMapVisual, TreeVisual, ChartVisual, CompareVisual, PillarsVisual, FederalVisual, PaintingVisual, PairVisual])
export type Visual = z.infer<typeof Visual>

const Story = z.object({
  type: z.literal('story'),
  title: z.string(),
  body: z.string(),
  visual: Visual,
})

const Pin = z.object({
  type: z.literal('pin'),
  prompt: z.string(),
  place: z.string(),
  // Within fullKm earns the bonus; within okKm counts as correct.
  fullKm: z.number().positive().default(10),
  okKm: z.number().positive().default(25),
  explain: z.string(),
})

const Region = z.object({
  type: z.literal('region'),
  prompt: z.string(),
  layer: z.enum(['countries', 'provinces']),
  answer: z.array(z.string()).min(1),
  explain: z.string(),
})

const Order = z.object({
  type: z.literal('order'),
  prompt: z.string(),
  items: z
    .array(z.object({ label: z.string(), year: z.number(), when: z.string() }))
    .min(3)
    .max(6),
  explain: z.string(),
})

const Option = z.object({
  label: z.string().optional(),
  art: z.enum(artIds).optional(),
  photo: z.enum(photoIds).optional(),
  why: z.string(),
})

const Choice = z.object({
  type: z.literal('choice'),
  prompt: z.string(),
  visual: Visual.optional(),
  options: z.array(Option).min(2).max(4),
  answer: z.number().int().nonnegative(),
})

const TrueMyth = z.object({
  type: z.literal('truemyth'),
  statement: z.string(),
  visual: Visual.optional(),
  answer: z.boolean(),
  explain: z.string(),
})

const Match = z.object({
  type: z.literal('match'),
  prompt: z.string(),
  pairs: z.array(z.tuple([z.string(), z.string()])).min(3).max(5),
})

// Who am I? Clues appear one at a time beside a portrait or statue; answering
// before the last clue earns the bonus.
const Who = z.object({
  type: z.literal('who'),
  photo: z.enum(photoIds),
  clues: z.array(z.string()).min(2).max(4),
  options: z.array(z.string()).min(2).max(4),
  answer: z.number().int().nonnegative(),
  explain: z.string(),
})

// Border scrubber: drag a time map's year slider until the map shows what the
// prompt asks. Any year from answer[0] to answer[1] counts. The captions stay
// hidden until the answer is checked, so the map itself has to be read.
const Scrub = z.object({
  type: z.literal('scrub'),
  prompt: z.string(),
  map: z.enum(timeMaps),
  start: When.optional(),
  answer: z.tuple([When, When]),
  explain: z.string(),
})

// Detail hunt: find and tap something inside a painting or photo. Each target is a
// box as fractions of the picture, [left, top, width, height]; a tap in any counts
// (the crossbows hide in more than one corner).
const Box = z.tuple([z.number(), z.number(), z.number(), z.number()])
const Hunt = z.object({
  type: z.literal('hunt'),
  prompt: z.string(),
  photo: z.enum(photoIds),
  targets: z.array(Box).min(1),
  explain: z.string(),
})

// Fill the gap: pick the missing word in a quote from a primary source. `quote`
// marks the gap with ___; `source` names the document and its date.
const Gap = z.object({
  type: z.literal('gap'),
  prompt: z.string(),
  quote: z.string().refine((q) => q.split('___').length === 2, 'quote needs exactly one ___'),
  source: z.string(),
  visual: Visual.optional(),
  options: z.array(z.string()).min(2).max(4),
  answer: z.number().int().nonnegative(),
  explain: z.string(),
})

// Cause and effect: link each cause to what it led to.
const Cause = z.object({
  type: z.literal('cause'),
  prompt: z.string(),
  pairs: z.array(z.tuple([z.string(), z.string()])).min(3).max(4),
  explain: z.string(),
})

// Odd one out: spot the item that doesn't belong among four, then say why. Both
// have to be right.
const Odd = z.object({
  type: z.literal('odd'),
  prompt: z.string(),
  items: z.array(z.object({ label: z.string(), photo: z.enum(photoIds).optional() })).length(4),
  answer: z.number().int().nonnegative(),
  reasons: z.array(z.string()).min(2).max(3),
  reason: z.number().int().nonnegative(),
  explain: z.string(),
})

// Two voices: two or three people of the time, often on opposite sides, speak about
// the same thing in their own words. The question can only be answered by reading
// them side by side. Each voice says who spoke, when and where it was written down.
const Voices = z.object({
  type: z.literal('voices'),
  prompt: z.string(),
  voices: z
    .array(z.object({ who: z.string(), when: z.string(), text: z.string(), photo: z.enum(photoIds).optional() }))
    .min(2)
    .max(3),
  options: z.array(z.string()).min(2).max(4),
  answer: z.number().int().nonnegative(),
  explain: z.string(),
})

// Sort into groups: put each card into one of two to four groups (which pillar, which
// side of a border, which painter). `group` is the index of the card's right group.
const Sort = z
  .object({
    type: z.literal('sort'),
    prompt: z.string(),
    visual: Visual.optional(),
    groups: z.array(z.string()).min(2).max(4),
    items: z.array(z.object({ label: z.string(), group: z.number().int().nonnegative(), photo: z.enum(photoIds).optional() })).min(4).max(8),
    explain: z.string(),
  })
  .refine((s) => s.items.every((i) => i.group < s.groups.length), 'every card needs a group that exists')
  .refine((s) => s.groups.every((_, g) => s.items.some((i) => i.group === g)), 'every group needs a card')

export const Exercise = z.discriminatedUnion('type', [Story, Pin, Region, Order, Choice, TrueMyth, Match, Who, Scrub, Hunt, Gap, Cause, Odd, Voices, Sort])
export type Exercise = z.infer<typeof Exercise>
export type ExerciseOf<T extends Exercise['type']> = Extract<Exercise, { type: T }>

export const Source = z.object({ title: z.string(), url: z.url() })

export const Lesson = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string(),
  // A content note, shown before a lesson on a painful subject (slavery, massacres).
  // Such a lesson is also played without celebrations.
  note: z.string().optional(),
  exercises: z.array(Exercise).min(3),
  sources: z.array(Source).min(1),
})
export type Lesson = z.infer<typeof Lesson>

export const Unit = z.object({
  id: z.string(),
  number: z.number(),
  title: z.string(),
  era: z.string(),
  summary: z.string(),
  // The content note for the unit's checkpoint, when some of its lessons have one.
  note: z.string().optional(),
  lessons: z.array(Lesson).min(1),
})
export type Unit = z.infer<typeof Unit>
