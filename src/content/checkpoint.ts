import { shuffle } from '../lesson/shuffle'
import type { Exercise, Unit } from './schema'

export const checkpointId = (unit: Unit) => `${unit.id}-checkpoint`

// A checkpoint mixes 10 questions from every lesson in the unit, no stories.
export const buildCheckpoint = (unit: Unit, random = Math.random): Exercise[] => {
  const asks = unit.lessons.flatMap((l) => l.exercises.filter((e) => e.type !== 'story'))
  return shuffle(asks, random).slice(0, 10)
}
