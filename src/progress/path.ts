import type { Unit } from '../content/schema'
import type { Progress } from './store'

type Seen = Pick<Progress, 'completed' | 'placed'>

// A unit's first lesson is always open and each later one opens when the one before
// it is finished. A unit the placement test opened has every lesson open.
export const lessonOpen = (p: Seen, unit: Unit, index: number) =>
  index === 0 || p.placed.includes(unit.id) || !!p.completed[unit.lessons[index - 1].id]

// The checkpoint opens once every lesson is finished, or straight away for a placed unit.
export const checkpointOpen = (p: Seen, unit: Unit) =>
  p.placed.includes(unit.id) || unit.lessons.every((l) => p.completed[l.id])

// The units a placement run asks about: those of the track not yet opened, placed
// or with their checkpoint finished.
export const unitsToPlace = (p: Seen, track: Unit[], checkpointId: (u: Unit) => string) =>
  track.filter((u) => !p.placed.includes(u.id) && !p.completed[checkpointId(u)])
