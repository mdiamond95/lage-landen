import type { Unit } from '../content/schema'
import { checkpointId } from '../content/checkpoint'
import { previousUnit } from '../content/course'
import { hasLegendary, LEGENDARY_LEVEL } from '../content/levels'
import type { Progress } from './store'

type Seen = Pick<Progress, 'completed' | 'placed'>

// A unit's first lesson is always open and each later one opens when the one before
// it is finished. A unit the placement test opened has every lesson open.
export const lessonOpen = (p: Seen, unit: Unit, index: number) =>
  index === 0 || p.placed.includes(unit.id) || !!p.completed[unit.lessons[index - 1].id]

// The checkpoint opens once every lesson is finished, or straight away for a placed unit.
// The unit's map story, just before it, opens at the same time but never holds it shut.
export const checkpointOpen = (p: Seen, unit: Unit) =>
  p.placed.includes(unit.id) || unit.lessons.every((l) => p.completed[l.id])

// The units a placement run asks about: those of the track not yet opened, placed
// or with their checkpoint finished.
export const unitsToPlace = (p: Seen, track: Unit[], checkpointId: (u: Unit) => string) =>
  track.filter((u) => !p.placed.includes(u.id) && !p.completed[checkpointId(u)])

type Crowned = Pick<Progress, 'completed' | 'legendary'>

// A lesson's crown level: 0 before it is finished, 1 to 4 from playing it, and 5 once
// its unit's Legendary challenge is passed.
export const lessonLevel = (p: Crowned, unit: Unit, lessonId: string) => {
  const done = p.completed[lessonId]
  if (!done) return 0
  return p.legendary.includes(unit.id) ? LEGENDARY_LEVEL : Math.min(done.level ?? 1, LEGENDARY_LEVEL - 1)
}

// The Legendary challenge opens once every lesson of the unit is at level 4.
export const legendaryOpen = (p: Crowned, unit: Unit) =>
  hasLegendary(unit) && unit.lessons.every((l) => lessonLevel(p, unit, l.id) >= LEGENDARY_LEVEL - 1)

// Crowns in all: one for every level of every lesson.
export const crownCount = (p: Crowned, units: Unit[]) =>
  units.reduce((sum, u) => sum + u.lessons.reduce((s, l) => s + lessonLevel(p, u, l.id), 0), 0)

// The mastery gate: a checkpoint passed with 80% opens the next unit.
export const GATE = 0.8

type Gated = Pick<Progress, 'completed' | 'placed'>

// A unit counts as mastered when its checkpoint was passed (one finished before the
// gate counts) or the placement test opened it.
export const unitMastered = (p: Gated, unit: Unit) => {
  const cp = p.completed[checkpointId(unit)]
  return p.placed.includes(unit.id) || (!!cp && (cp.score ?? 1) >= GATE)
}

// A unit is open when it starts a track, when the unit before it is mastered, or when
// the learner has already started it (so no progress from before the gate is shut).
export const unitOpen = (p: Gated, unit: Unit, units: Unit[]) => {
  const before = previousUnit[unit.number]
  const prev = units.find((u) => u.number === before)
  return (
    !prev ||
    unitMastered(p, prev) ||
    p.placed.includes(unit.id) ||
    !!p.completed[checkpointId(unit)] ||
    unit.lessons.some((l) => p.completed[l.id])
  )
}

// The units a passed checkpoint opens: the next in its track, or both after Unit 9.
export const unitsAfter = (unit: Unit, units: Unit[]) => units.filter((u) => previousUnit[u.number] === unit.number)
