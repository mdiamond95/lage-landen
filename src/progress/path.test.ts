import { describe, expect, it } from 'vitest'
import { units } from '../content'
import { checkpointId } from '../content/checkpoint'
import { checkpointOpen, crownCount, legendaryOpen, lessonLevel, lessonOpen, unitMastered, unitOpen, unitsAfter, unitsToPlace } from './path'

const [u1, u2, u3] = units
const fresh = { completed: {}, placed: [] as string[] }

describe('the path', () => {
  it('opens only the first lesson of a fresh unit', () => {
    expect(lessonOpen(fresh, u1, 0)).toBe(true)
    expect(lessonOpen(fresh, u1, 1)).toBe(false)
    expect(checkpointOpen(fresh, u1)).toBe(false)
  })
  it('opens each lesson after the one before it', () => {
    const p = { ...fresh, completed: { [u1.lessons[0].id]: { bestXp: 10, perfect: false } } }
    expect(lessonOpen(p, u1, 1)).toBe(true)
    expect(lessonOpen(p, u1, 2)).toBe(false)
  })
  it('opens every lesson and the checkpoint of a placed unit, and only that unit', () => {
    const p = { ...fresh, placed: [u2.id] }
    expect(u2.lessons.every((_, i) => lessonOpen(p, u2, i))).toBe(true)
    expect(checkpointOpen(p, u2)).toBe(true)
    expect(lessonOpen(p, u3, 1)).toBe(false)
  })
  it('skips placed units and finished checkpoints in a new placement run', () => {
    const p = { completed: { [checkpointId(u1)]: { bestXp: 10, perfect: false } }, placed: [u2.id] }
    expect(unitsToPlace(p, [u1, u2, u3], checkpointId)).toEqual([u3])
  })
})

describe('crowns', () => {
  const done = (level?: number) => ({ bestXp: 10, perfect: false, level })
  const allAt = (level: number) => Object.fromEntries(u2.lessons.map((l) => [l.id, done(level)]))

  it('reads level 1 for lessons finished before crowns', () => {
    expect(lessonLevel({ completed: { [u2.lessons[0].id]: done() }, legendary: [] }, u2, u2.lessons[0].id)).toBe(1)
    expect(lessonLevel({ completed: {}, legendary: [] }, u2, u2.lessons[0].id)).toBe(0)
  })
  it('opens Legendary once every lesson is at level 4', () => {
    expect(legendaryOpen({ completed: allAt(3), legendary: [] }, u2)).toBe(false)
    expect(legendaryOpen({ completed: allAt(4), legendary: [] }, u2)).toBe(true)
  })
  it('puts every lesson of a Legendary unit at level 5 and counts the crowns', () => {
    const p = { completed: allAt(4), legendary: [u2.id] }
    expect(lessonLevel(p, u2, u2.lessons[0].id)).toBe(5)
    expect(crownCount(p, units)).toBe(5 * u2.lessons.length)
  })
})

describe('the mastery gate', () => {
  const byNumber = (n: number) => units.find((u) => u.number === n)!
  const fresh = { completed: {}, placed: [] as string[] }
  const passed = (n: number, score?: number) => ({ [checkpointId(byNumber(n))]: { bestXp: 10, perfect: false, score } })

  it('opens Unit 1 and the culture track on a fresh profile, and nothing else', () => {
    expect(units.filter((u) => unitOpen(fresh, u, units)).map((u) => u.number)).toEqual([1, 16])
  })
  it('opens the next unit at 80% on the checkpoint, not below', () => {
    expect(unitOpen({ ...fresh, completed: passed(1, 0.8) }, byNumber(2), units)).toBe(true)
    expect(unitOpen({ ...fresh, completed: passed(1, 0.7) }, byNumber(2), units)).toBe(false)
  })
  it('counts a checkpoint finished before the gate as passed', () => {
    expect(unitOpen({ ...fresh, completed: passed(1) }, byNumber(2), units)).toBe(true)
  })
  it('forks after Unit 9 into the Dutch and Belgian tracks', () => {
    const p = { ...fresh, completed: passed(9, 1) }
    expect(unitsAfter(byNumber(9), units).map((u) => u.number)).toEqual([10, 13])
    expect(unitOpen(p, byNumber(10), units)).toBe(true)
    expect(unitOpen(p, byNumber(13), units)).toBe(true)
    expect(unitOpen(p, byNumber(11), units)).toBe(false)
  })
  it('treats a unit the placement test opened as mastered, so the next one opens too', () => {
    const p = { ...fresh, placed: [byNumber(3).id] }
    expect(unitMastered(p, byNumber(3))).toBe(true)
    expect(unitOpen(p, byNumber(4), units)).toBe(true)
    expect(unitOpen(p, byNumber(5), units)).toBe(false)
  })
  it('keeps a unit open once started, so no progress from before the gate is shut', () => {
    const p = { ...fresh, completed: { [byNumber(12).lessons[0].id]: { bestXp: 10, perfect: false } } }
    expect(unitOpen(p, byNumber(12), units)).toBe(true)
  })
})
