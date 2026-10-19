import { z } from 'zod'
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
})

const ArtVisual = z.object({ kind: z.literal('art'), art: z.enum(artIds) })
// A real photo or historical map from Wikimedia Commons, credited in src/photos/credits.ts.
const PhotoVisual = z.object({ kind: z.literal('photo'), photo: z.enum(photoIds) })
const PolderVisual = z.object({ kind: z.literal('polder-slider') })

export const Visual = z.discriminatedUnion('kind', [MapVisual, ArtVisual, PhotoVisual, PolderVisual])
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
  answer: z.boolean(),
  explain: z.string(),
})

const Match = z.object({
  type: z.literal('match'),
  prompt: z.string(),
  pairs: z.array(z.tuple([z.string(), z.string()])).min(3).max(5),
})

export const Exercise = z.discriminatedUnion('type', [Story, Pin, Region, Order, Choice, TrueMyth, Match])
export type Exercise = z.infer<typeof Exercise>
export type ExerciseOf<T extends Exercise['type']> = Extract<Exercise, { type: T }>

export const Source = z.object({ title: z.string(), url: z.url() })

export const Lesson = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string(),
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
  lessons: z.array(Lesson).min(1),
})
export type Unit = z.infer<typeof Unit>
