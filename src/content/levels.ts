import { shuffle } from '../lesson/shuffle'
import type { Exercise, Lesson, Unit } from './schema'

// Crowns: every lesson on the path has five levels, as the plan asks. Finishing it
// is level 1; each replay that gets 80% right first time goes up a level; level 5 is
// the unit's timed Legendary challenge.
export const MAX_LEVEL = 5
export const LEGENDARY_LEVEL = 5
export const LEVEL_PASS = 0.8

export const levelPassed = (right: number, asked: number) => asked > 0 && right / asked >= LEVEL_PASS

// How a lesson plays at each level: level 2 is the lesson as written again (stories
// and all, a second reading); level 3 its questions alone, in a new order; level 4 the
// same with no second chance at a miss. Once a lesson is at level 4, playing it again
// is the lesson as written, for practice.
export type LevelPlay = { exercises: Exercise[]; retry: boolean }

export const buildLevel = (lesson: Lesson, level: number, random = Math.random): LevelPlay => {
  if (level <= 2 || level > 4) return { exercises: lesson.exercises, retry: true }
  const asks = shuffle(lesson.exercises.filter((e) => e.type !== 'story'), random)
  return { exercises: asks, retry: level < 4 }
}

export const LEGENDARY_SIZE = 15
export const legendaryId = (unit: Unit | string) => `${typeof unit === 'string' ? unit : unit.id}-legendary`
// A unit needs this many lessons without a content note for a timed challenge.
export const LEGENDARY_MIN_LESSONS = 3

// The Legendary challenge leaves out lessons with a content note: slavery, war crimes
// and the like aren't put on a clock. A unit with too few other lessons (Unit 7) has none.
export const legendaryLessons = (unit: Unit) => unit.lessons.filter((l) => !l.note)
export const hasLegendary = (unit: Unit) => legendaryLessons(unit).length >= LEGENDARY_MIN_LESSONS

// Fifteen questions, taken in turn from each lesson so every one is asked about.
export const buildLegendary = (unit: Unit, random = Math.random): Exercise[] => {
  const pools = shuffle(legendaryLessons(unit), random).map((l) => shuffle(l.exercises.filter((e) => e.type !== 'story'), random))
  const out: Exercise[] = []
  for (let round = 0; out.length < LEGENDARY_SIZE && pools.some((p) => p.length > round); round++)
    for (const pool of pools) if (out.length < LEGENDARY_SIZE && pool[round]) out.push(pool[round])
  return shuffle(out, random)
}

// Seconds allowed for a question: more for the ones with many steps to them.
const SLOW = new Set<Exercise['type']>(['match', 'cause', 'order', 'sort', 'style', 'label', 'panels', 'drill', 'ride', 'odd', 'voices'])
const MEDIUM = new Set<Exercise['type']>(['pin', 'region', 'scrub', 'hunt', 'who', 'gap', 'pick', 'taste', 'when', 'listen', 'truesize'])
export const secondsFor = (e: Exercise) => (SLOW.has(e.type) ? 60 : MEDIUM.has(e.type) ? 40 : 25)

// The clock for a challenge: the sum of its questions' allowances. It runs only while
// a question is open, not while the answer is being read.
export const timeLimit = (exercises: Exercise[]) => exercises.reduce((s, e) => s + secondsFor(e), 0)
