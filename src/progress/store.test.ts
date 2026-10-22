import { describe, expect, it } from 'vitest'
import { nextStreak, type Progress } from './store'

const base: Progress = { xp: 0, streak: 4, lastDay: '2026-10-19', freezeWeek: null, completed: {}, discovered: [], cards: {}, placed: [], legendary: [] }
const at = (d: string) => new Date(`${d}T09:00:00`)

describe('nextStreak', () => {
  it('keeps the streak for a second lesson on the same day', () => {
    expect(nextStreak(base, at('2026-10-19')).streak).toBe(4)
  })
  it('adds a day when you come back tomorrow', () => {
    expect(nextStreak(base, at('2026-10-20')).streak).toBe(5)
  })
  it('uses the weekly freeze for one missed day', () => {
    const r = nextStreak(base, at('2026-10-21'))
    expect(r.streak).toBe(5)
    expect(r.freezeWeek).toBe('2026-10-19')
  })
  it('does not use the freeze twice in one week', () => {
    expect(nextStreak({ ...base, freezeWeek: '2026-10-19' }, at('2026-10-21')).streak).toBe(1)
  })
  it('restarts after a longer gap', () => {
    expect(nextStreak(base, at('2026-10-25')).streak).toBe(1)
  })
  it('starts at 1 for a first lesson', () => {
    expect(nextStreak({ ...base, lastDay: null, streak: 0 }, at('2026-10-19')).streak).toBe(1)
  })
})
