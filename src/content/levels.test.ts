import { describe, expect, it } from 'vitest'
import { units } from '.'
import { buildLegendary, buildLevel, hasLegendary, LEGENDARY_SIZE, legendaryLessons, secondsFor, timeLimit } from './levels'
import { lessonCrown, legendaryCrown } from '../progress/crowns'

const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

describe('crown levels', () => {
  const lesson = units[0].lessons[0]
  const asks = lesson.exercises.filter((e) => e.type !== 'story')

  it('plays the lesson as written for levels 1 and 2, and after level 4', () => {
    for (const level of [1, 2, 5]) expect(buildLevel(lesson, level)).toEqual({ exercises: lesson.exercises, retry: true })
  })
  it('plays the questions alone in a new order at level 3, and without second chances at level 4', () => {
    const three = buildLevel(lesson, 3, seeded(3))
    expect(three.retry).toBe(true)
    expect(three.exercises).toHaveLength(asks.length)
    expect(new Set(three.exercises)).toEqual(new Set(asks))
    expect(three.exercises.some((e) => e.type === 'story')).toBe(false)
    expect(buildLevel(lesson, 4, seeded(3)).retry).toBe(false)
  })

  it('gives level 1 for finishing, whatever the score', () => {
    expect(lessonCrown(0, 1, 0, 9, true).level).toBe(1)
  })
  it('goes up a level at 80% right first time, and stays put below it', () => {
    expect(lessonCrown(2, 3, 8, 10, true)).toMatchObject({ level: 3, head: 'Level 3 reached' })
    expect(lessonCrown(2, 3, 7, 10, true)).toMatchObject({ level: 2, head: 'Still level 2' })
    expect(lessonCrown(2, 3, 7, 10, true).detail).toContain('70%')
  })
  it('keeps level 4 for practice', () => {
    expect(lessonCrown(4, 4, 0, 9, true).level).toBe(4)
    expect(lessonCrown(4, 4, 9, 9, false).detail).toContain('no timed challenge')
  })
  it('passes Legendary at 12 of 15 in time', () => {
    expect(legendaryCrown(2, 12, 15, false)).toMatchObject({ passed: true, level: 5 })
    expect(legendaryCrown(2, 11, 15, false)).toMatchObject({ passed: false, head: 'Not this time' })
    expect(legendaryCrown(2, 15, 15, true)).toMatchObject({ passed: false, head: "Time's up" })
  })
})

describe('Legendary challenge', () => {
  it('is left out only where most lessons carry a content note', () => {
    expect(units.filter((u) => !hasLegendary(u)).map((u) => u.number)).toEqual([7])
  })

  for (const unit of units.filter(hasLegendary))
    describe(`unit ${unit.number}`, () => {
      const runs = Array.from({ length: 20 }, (_, i) => buildLegendary(unit, seeded(i + 1)))
      const allowed = new Set(legendaryLessons(unit).flatMap((l) => l.exercises))

      it(`asks ${LEGENDARY_SIZE} different questions, no stories, none from a lesson with a content note`, () => {
        for (const run of runs) {
          expect(run).toHaveLength(LEGENDARY_SIZE)
          expect(new Set(run).size).toBe(LEGENDARY_SIZE)
          expect(run.every((e) => e.type !== 'story' && allowed.has(e))).toBe(true)
        }
      })

      it('asks about every lesson it draws on', () => {
        for (const run of runs)
          for (const lesson of legendaryLessons(unit).slice(0, LEGENDARY_SIZE))
            expect(run.some((e) => lesson.exercises.includes(e)), lesson.id).toBe(true)
      })

      it('gives between 7 and 15 minutes on the clock', () => {
        for (const run of runs) {
          expect(timeLimit(run)).toBeGreaterThanOrEqual(7 * 60)
          expect(timeLimit(run)).toBeLessThanOrEqual(15 * 60)
        }
      })
    })

  it('allows more time for questions with many steps', () => {
    const all = units.flatMap((u) => u.lessons.flatMap((l) => l.exercises))
    const sort = all.find((e) => e.type === 'sort')!
    const choice = all.find((e) => e.type === 'choice')!
    expect(secondsFor(sort)).toBeGreaterThan(secondsFor(choice))
  })
})
