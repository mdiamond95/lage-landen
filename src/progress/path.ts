import type { Unit } from '../content/schema'
import { hasLegendary, LEGENDARY_LEVEL } from '../content/levels'
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
