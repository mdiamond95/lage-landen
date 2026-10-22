import { shuffle } from '../lesson/shuffle'
import { courseOutline } from './course'
import type { Exercise, Lesson, Unit } from './schema'

// Unit 0, the placement test: a few questions per unit, in course order, so a
// returning learner can open a unit's lessons and checkpoint without playing them.
export const PLACEMENT_SIZE = 5
// Four of five, the plan's 80% mastery bar.
export const PLACEMENT_PASS = 4

export const placementPassed = (correct: number) => correct >= PLACEMENT_PASS

export type PlacementPick = { lesson: Lesson; exercise: Exercise }

// One question from each of five different lessons, so a block samples the whole
// unit rather than one lesson of it. A unit with fewer lessons draws a second
// question from some of them.
export const buildPlacement = (unit: Unit, random = Math.random): PlacementPick[] => {
  const asks = unit.lessons
    .map((lesson) => ({ lesson, pool: shuffle(lesson.exercises.filter((e) => e.type !== 'story'), random) }))
    .filter((l) => l.pool.length > 0)
  const order = shuffle(asks, random)
  const picks: PlacementPick[] = []
  for (let round = 0; picks.length < PLACEMENT_SIZE && order.some((l) => l.pool.length > round); round++) {
    for (const { lesson, pool } of order) {
      if (picks.length === PLACEMENT_SIZE) break
      if (pool[round]) picks.push({ lesson, exercise: pool[round] })
    }
  }
  return picks
}

// The tracks of the course, each with the units that are playable.
export const placementTracks = (units: Unit[]) =>
  courseOutline
    .map((track) => ({
      title: track.track,
      units: track.units.flatMap(([n]) => units.filter((u) => u.number === n)),
    }))
    .filter((t) => t.units.length > 0)
