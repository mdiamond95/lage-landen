import { describe, expect, it } from 'vitest'
import { addTally, pickQuests, QUEST_XP, quests, startDay, type QuestId } from './quests'
import { ensureQuests, getProgress, recordSession, resetProgress } from './store'

const all = { due: 20, finished: 5, cardsLeft: 100 }
const fresh = { due: 0, finished: 0, cardsLeft: 495 }
const days = Array.from({ length: 365 }, (_, i) => new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10))

describe('picking the day’s quests', () => {
  it('picks three with different measures, the same all day', () => {
    for (const day of days) {
      const picks = pickQuests(day, all)
      expect(picks).toHaveLength(3)
      expect(new Set(picks.map((id) => quests[id].measure)).size).toBe(3)
      expect(pickQuests(day, all)).toEqual(picks)
    }
  })
  it('uses every quest over a year', () => {
    const seen = new Set(days.flatMap((day) => pickQuests(day, all)))
    expect([...seen].sort()).toEqual(Object.keys(quests).sort())
  })
  it('asks only for what a new learner can do', () => {
    const seen = new Set(days.flatMap((day) => pickQuests(day, fresh)))
    for (const id of ['review10', 'crown'] as QuestId[]) expect(seen.has(id), id).toBe(false)
    expect(new Set(days.flatMap((day) => pickQuests(day, { ...all, cardsLeft: 2 }))).has('cards3')).toBe(false)
  })
})

describe('counting', () => {
  it('meets a quest once its goal is reached, and only once', () => {
    const day = { ...startDay('2026-10-22', all), picks: ['xp30', 'perfect', 'lessons2'] as QuestId[] }
    const first = addTally(day, { xp: 20, lessons: 1 })
    expect(first.met).toEqual([])
    const second = addTally(first.day, { xp: 15, lessons: 1, perfect: 1 })
    expect(second.met).toEqual(['xp30', 'perfect', 'lessons2'])
    expect(addTally(second.day, { xp: 40 }).met).toEqual([])
  })
  it('adds the bonus to the XP when a session completes a quest', () => {
    resetProgress()
    const now = new Date('2026-10-22T10:00:00')
    ensureQuests(fresh, now)
    const picks = getProgress().quests!.picks
    const met = recordSession(
      { kind: 'lesson', hung: 4, lessonId: 'u1-l1', xp: 70, perfect: true, places: ['amsterdam', 'brussels', 'antwerp', 'ghent', 'utrecht'], answers: Array(15).fill(['c', true]) },
      now,
    )
    // Every quest a new learner can get is met by one big perfect lesson but the second lesson.
    expect(met).toEqual(picks.filter((id) => id !== 'lessons2'))
    expect(getProgress().xp).toBe(70 + met.length * QUEST_XP)
    expect(getProgress().quests!.done).toEqual(met)
  })
  it('starts again the next day', () => {
    ensureQuests(fresh, new Date('2026-10-23T08:00:00'))
    expect(getProgress().quests!.day).toBe('2026-10-23')
    expect(getProgress().quests!.done).toEqual([])
  })
})
