import { describe, expect, it } from 'vitest'
import { buildCards } from '../content/cards'
import { units } from '../content'
import { addDays, dueToday, nextDue, pickReview, schedule, type Card } from './review'

const today = '2026-10-19'

describe('schedule', () => {
  it('brings a new card back tomorrow, then in 3 days, then further out', () => {
    const first = schedule(undefined, true, today)
    expect(first.due).toBe('2026-10-20')
    const second = schedule(first, true, first.due)
    expect(second.interval).toBe(3)
    const third = schedule(second, true, second.due)
    expect(third.interval).toBeGreaterThan(6)
  })
  it('brings a missed card back tomorrow and counts the miss', () => {
    const learned = schedule(schedule(undefined, true, today), true, '2026-10-20')
    const missed = schedule(learned, false, '2026-10-23')
    expect(missed.due).toBe('2026-10-24')
    expect(missed.reps).toBe(0)
    expect(missed.lapses).toBe(1)
    expect(missed.ease).toBeLessThan(learned.ease)
  })
  it('crosses month ends', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
  })
})

describe('daily review', () => {
  const card = (due: string, lapses = 0): Card => ({ due, interval: 1, ease: 2.5, reps: 1, lapses })
  const items = [
    { id: 'a:1', lessonId: 'a' },
    { id: 'a:2', lessonId: 'a' },
    { id: 'b:1', lessonId: 'b' },
    { id: 'c:1', lessonId: 'c' },
  ]

  it('offers cards that are due, and questions from finished lessons without a card', () => {
    const due = dueToday(items, { 'a:1': card('2026-10-19'), 'a:2': card('2026-10-25') }, { b: {} }, today)
    expect(due.map((d) => d.item.id)).toEqual(['a:1', 'b:1'])
  })
  it('puts the most missed first when there are more than ten', () => {
    const many = Array.from({ length: 15 }, (_, i) => ({ item: { id: `x:${i}`, lessonId: `l${i % 3}` }, card: card(today, i === 14 ? 3 : 0) }))
    const picked = pickReview(many, () => 0.5)
    expect(picked).toHaveLength(10)
    expect(picked.map((p) => p.id)).toContain('x:14')
  })
  it('keeps two questions from one lesson apart where it can', () => {
    const due = items.map((item) => ({ item, card: card(today) }))
    const picked = pickReview(due, () => 0.1)
    for (let i = 1; i < picked.length; i++) expect(picked[i].lessonId).not.toBe(picked[i - 1].lessonId)
  })
  it('names the next day something is due', () => {
    expect(nextDue({ a: card('2026-10-22'), b: card('2026-10-21') })).toBe('2026-10-21')
  })
})

describe('review cards', () => {
  it('gives every question in the course its own card id', () => {
    const { items } = buildCards(units)
    expect(new Set(items.map((c) => c.id)).size).toBe(items.length)
    expect(items.some((c) => c.exercise.type === 'story')).toBe(false)
  })
})
