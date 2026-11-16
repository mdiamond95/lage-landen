import { describe, expect, it } from 'vitest'
import { units } from '../content'
import { checkpointId } from '../content/checkpoint'
import { checkpointOpen, crownCount, legendaryOpen, lessonLevel, lessonOpen, unitMastered, unitOpen, unitsAfter, unitsToPlace, upNext } from './path'
import { mapStoryId } from '../content/mapStory'

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

describe('up next', () => {
  const done = { bestXp: 10, perfect: false }
  const u16 = units.find((u) => u.number === 16)!
  const all = (u: typeof u1) => Object.fromEntries(u.lessons.map((l) => [l.id, done]))

  it('starts a fresh learner on the first lesson of Unit 1', () => {
    expect(upNext(fresh, units, undefined)?.id).toBe(u1.lessons[0].id)
  })
  it('stays in the unit last worked on, even in another track', () => {
    const p = { ...fresh, completed: { [u16.lessons[0].id]: done } }
    expect(upNext(p, units, u16)?.id).toBe(u16.lessons[1].id)
  })
  it('offers the map story, then the checkpoint, once the lessons are done', () => {
    const p = { ...fresh, completed: all(u1) }
    expect(upNext(p, units, u1)).toMatchObject({ kind: 'story', id: mapStoryId(u1) })
    const told = { ...fresh, completed: { ...all(u1), [mapStoryId(u1)]: done } }
    expect(upNext(told, units, u1)).toMatchObject({ kind: 'checkpoint', id: checkpointId(u1) })
  })
  it('keeps offering a checkpoint that was not passed, then moves on once it is', () => {
    const failed = { ...fresh, completed: { ...all(u1), [checkpointId(u1)]: { ...done, score: 0.5 } } }
    expect(upNext(failed, units, u1)?.id).toBe(checkpointId(u1))
    const passed = { ...fresh, completed: { ...all(u1), [checkpointId(u1)]: { ...done, score: 0.9 } } }
    expect(upNext(passed, units, u1)?.id).toBe(u2.lessons[0].id)
  })
  it('skips units the placement test opened', () => {
    expect(upNext({ ...fresh, placed: [u1.id] }, units, undefined)?.id).toBe(u2.lessons[0].id)
  })
})
