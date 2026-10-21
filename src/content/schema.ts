import { z } from 'zod'
import { chartIds } from '../data/charts'
import { facadeIds } from '../data/facades'
import { treeIds } from '../data/families'
import { pairIds } from '../data/pairs'
import { seriesIds } from '../data/series'
import { tourIds } from '../data/paintings'
import { cellIds, rowIds } from '../data/pillars'
import { lineIds } from '../data/roman'
import { month } from '../data/timeline'
import { photoIds } from '../photos/ids'
import { dialectIds } from '../data/dialects'
import { phraseSetIds } from '../data/phrases'
import { soundIds } from '../sounds/ids'
import { foodIds, foodKinds } from '../data/foods'
import { feastIds, feastKinds } from '../data/feasts'
import { routeIds, routes } from '../data/routes'

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
  'tessellation',
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
// Golden Age worked, from the fall of Antwerp in 1585 to 1682, or where the modern artists
// worked, from Van Gogh's first drawings in 1880 to the Van Gogh Museum in 1973, or the
// buildings of the Low Countries, from the first belfries to the World Heritage list of 2000,
// or the languages of the Low Countries, from the Frisians, Saxons and Franks of 800 to 1997,
// or the food and drink of the Low Countries, from juniper wine in about 1266 to 2016, or the
// feasts and traditions, from the Holy Blood procession of Bruges in 1303 to Keti Koti in 2023, or
// sport, from Pim Mulier's tour past the eleven towns in 1890 to the women's European title of 2017.
// `year` opens it at a given year instead of the start.
export const timeMaps = ['water', 'roman', 'cloth', 'burgundy', 'revolt', 'amsterdam', 'spanish', 'empire', 'borders', 'kingdom', 'rails', 'occupation', 'delta', 'industry', 'congo', 'greatwar', 'westhoek', 'language', 'painters', 'masters', 'moderns', 'buildings', 'tongues', 'food', 'feasts', 'sport'] as const
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
export const compareMaps = ['water', 'roman', 'burgundy', 'revolt', 'amsterdam', 'spanish', 'empire', 'borders', 'kingdom', 'rails', 'occupation', 'delta', 'industry', 'congo', 'greatwar', 'westhoek', 'language', 'painters', 'masters', 'moderns', 'buildings', 'tongues', 'food', 'feasts', 'sport'] as const
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

// A painter's road from src/data/series.ts: one painter's pictures in order on a slider,
// to watch the way of painting change. `at` opens it at one picture, by its index.
const SeriesVisual = z.object({ kind: z.literal('series'), series: z.enum(seriesIds), at: z.number().int().nonnegative().optional() })

// A building's front from src/data/facades.ts, with its parts named on labelled hotspots: tap
// one and the photo glides to it and says what it is and what style it belongs to. `focus`
// opens it zoomed in on one hotspot, by its id, without the labels, as the picture for a question.
const FacadeVisual = z.object({ kind: z.literal('facade'), facade: z.enum(facadeIds), focus: z.string().optional() })

// A recording from Wikimedia Commons (src/sounds), with a play button, and a photo above it
// if given. In a question its words, language and credit stay hidden until it is checked,
// as they are often the answer; a story shows them.
const SoundVisual = z.object({ kind: z.literal('sound'), sound: z.enum(soundIds), photo: z.enum(photoIds).optional() })

// The clickable dialect map (Unit 20): every language and dialect group of the Low Countries;
// tap one to read about it and hear it. `focus` opens it on one.
const DialectsVisual = z.object({ kind: z.literal('dialects'), focus: z.enum(dialectIds).optional() })

// A page of the phrasebook (src/data/phrases.ts): everyday phrases with what they mean and
// when to say them, each with a recording or, failing that, the device's own voice.
const PhrasesVisual = z.object({ kind: z.literal('phrases'), set: z.enum(phraseSetIds) })

// The regional food map (Unit 21): the cheeses, fish, sweets, dishes, beers and jenevers of the
// Low Countries where they come from; tap one for its photo and story. `focus` opens it on one,
// `only` on one kind.
const FoodsVisual = z.object({ kind: z.literal('foods'), focus: z.enum(foodIds).optional(), only: z.enum(foodKinds).optional() })

// The calendar wheel (Unit 22): the feasts of the Netherlands and Belgium round the year, each kind on
// its own ring; tap one for its photo and story. `focus` opens it on one, `only` shows one kind.
const WheelVisual = z.object({ kind: z.literal('wheel'), focus: z.enum(feastIds).optional(), only: z.enum(feastKinds).optional() })

// A route map of a classic race (Unit 23): the Tour of Flanders of 2025 over its climbs,
// Liège–Bastogne–Liège or the Elfstedentocht, stepped along with a slider. `at` opens it at a step.
const RouteVisual = z.object({ kind: z.literal('route'), route: z.enum(routeIds), at: z.number().int().nonnegative().optional() })

export const Visual = z.discriminatedUnion('kind', [MapVisual, ArtVisual, PhotoVisual, PolderVisual, BarrierVisual, TimeMapVisual, TreeVisual, ChartVisual, CompareVisual, PillarsVisual, FederalVisual, PaintingVisual, PairVisual, SeriesVisual, FacadeVisual, SoundVisual, DialectsVisual, PhrasesVisual, FoodsVisual, WheelVisual, RouteVisual])
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

// An option can be a recording to play and pick (which of these has the soft g?).
const Option = z.object({
  label: z.string().optional(),
  art: z.enum(artIds).optional(),
  photo: z.enum(photoIds).optional(),
  sound: z.enum(soundIds).optional(),
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

// Style sorter: one painting at a time, name its style. After each pick the painting glides
// to its `box`, the detail that gives the style away, and `tell` says what to look for.
// `of: building` sorts building fronts instead of paintings (Unit 19).
const StyleSort = z
  .object({
    type: z.literal('style'),
    prompt: z.string(),
    // Optional rather than defaulted, so the review cards of earlier sorters keep their ids.
    of: z.enum(['painting', 'building']).optional(),
    groups: z.array(z.string()).min(2).max(4),
    items: z.array(z.object({ photo: z.enum(photoIds), title: z.string(), group: z.number().int().nonnegative(), tell: z.string(), box: Box })).min(3).max(6),
    explain: z.string(),
  })
  .refine((s) => s.items.every((i) => i.group < s.groups.length), 'every painting needs a style that exists')
  .refine((s) => s.groups.every((_, g) => s.items.some((i) => i.group === g)), 'every style needs a painting')

// Label the parts: put each label on its spot on a picture (the parts of a windmill, a
// canal house, a belfry). Each spot is a point, [x, y] as fractions of the picture; `extra`
// adds labels that belong nowhere. Every label has to land on its own spot.
const Point = z.tuple([z.number(), z.number()])
const Label = z
  .object({
    type: z.literal('label'),
    prompt: z.string(),
    photo: z.enum(photoIds),
    spots: z.array(z.object({ label: z.string(), at: Point })).min(3).max(6),
    extra: z.array(z.string()).max(2).default([]),
    explain: z.string(),
  })
  .refine((l) => new Set([...l.spots.map((s) => s.label), ...l.extra]).size === l.spots.length + l.extra.length, 'every label differs')

// Listen and find: play a recording, then tap where it is spoken on the dialect map.
const Listen = z.object({
  type: z.literal('listen'),
  prompt: z.string(),
  sound: z.enum(soundIds),
  answer: z.enum(dialectIds),
  explain: z.string(),
})

// Taste and find: a photo of something to eat or drink, then a tap on where it comes from on
// the food map, which shows only the marks of the answer's kind, unnamed.
const Taste = z.object({
  type: z.literal('taste'),
  prompt: z.string(),
  photo: z.enum(photoIds),
  answer: z.enum(foodIds),
  explain: z.string(),
})

// Pick all that belong: tap every card that fits and none that doesn't (the spices in
// speculaas, the Trappist beers). `answers` are the indexes of the cards that belong.
const Pick = z
  .object({
    type: z.literal('pick'),
    prompt: z.string(),
    visual: Visual.optional(),
    items: z.array(z.object({ label: z.string(), photo: z.enum(photoIds).optional() })).min(4).max(8),
    answers: z.array(z.number().int().nonnegative()).min(2),
    explain: z.string(),
  })
  .refine((p) => p.answers.every((a) => a < p.items.length), 'every answer is a card')
  .refine((p) => new Set(p.answers).size === p.answers.length && p.answers.length < p.items.length, 'some cards, not all, belong')

// When is it? A photo of a feast, then the hand of the calendar wheel is turned to its date. A
// date within `days` of the feast, or of the span it moves in, counts.
const WhenIsIt = z.object({
  type: z.literal('when'),
  prompt: z.string(),
  photo: z.enum(photoIds),
  answer: z.enum(feastIds),
  days: z.number().int().nonnegative().default(3),
  explain: z.string(),
})

// Ride the route (Unit 23): tap places on a race's route map in the order the race passes them,
// the last two climbs of the Tour of Flanders or the towns after Stavoren. The places are unnamed
// but for the start, the finish and those in `show`.
const Ride = z
  .object({
    type: z.literal('ride'),
    prompt: z.string(),
    route: z.enum(routeIds),
    ask: z.array(z.string()).min(1).max(5),
    show: z.array(z.string()).default([]),
    explain: z.string(),
  })
  .refine((r) => [...r.ask, ...r.show].every((p) => p in routes[r.route].places), 'every place is on the route')
  .refine((r) => new Set(r.ask).size === r.ask.length && r.ask.every((p) => !r.show.includes(p) && !routes[r.route].places[p].end), 'ask unnamed places, each once')

export const Exercise = z.discriminatedUnion('type', [Story, Pin, Region, Order, Choice, TrueMyth, Match, Who, Scrub, Hunt, Gap, Cause, Odd, Voices, Sort, StyleSort, Label, Listen, Taste, Pick, WhenIsIt, Ride])
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
