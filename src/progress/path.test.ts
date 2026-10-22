import { describe, expect, it } from 'vitest'
import { units } from '../content'
import { checkpointId } from '../content/checkpoint'
import { checkpointOpen, lessonOpen, unitsToPlace } from './path'

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
