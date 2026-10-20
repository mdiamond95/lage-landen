import { z } from 'zod'
import { chartIds } from '../data/charts'
import { treeIds } from '../data/families'
import { lineIds } from '../data/roman'
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
// A map with a year slider, played as an animation: the Zuiderzee and Delta Works,
// the Roman frontier and roads, the wool and cloth trade, the lands joining
// Burgundy, the revolt splitting them, Amsterdam growing in the Golden Age, the
// Spanish Netherlands shrinking, the Dutch trading posts and colonies around the
// world, or the borders changing from the Disaster Year to Waterloo. `year` opens it
// at a given year instead of the start.
export const timeMaps = ['water', 'roman', 'cloth', 'burgundy', 'revolt', 'amsterdam', 'spanish', 'empire', 'borders'] as const
const TimeMapVisual = z.object({ kind: z.literal('time-map'), map: z.enum(timeMaps), year: z.number().optional() })
// A family tree from src/data/families.ts; `hide` blanks out one person by id.
const TreeVisual = z.object({ kind: z.literal('family-tree'), tree: z.enum(treeIds), hide: z.string().optional() })

// A line chart from src/data/charts.ts; `until` cuts it off at a year.
const ChartVisual = z.object({ kind: z.literal('chart'), chart: z.enum(chartIds), until: z.number().optional() })

export const Visual = z.discriminatedUnion('kind', [MapVisual, ArtVisual, PhotoVisual, PolderVisual, TimeMapVisual, TreeVisual, ChartVisual])
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
  start: z.number().optional(),
  answer: z.tuple([z.number(), z.number()]),
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

export const Exercise = z.discriminatedUnion('type', [Story, Pin, Region, Order, Choice, TrueMyth, Match, Who, Scrub, Hunt, Gap, Cause, Odd, Voices])
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
