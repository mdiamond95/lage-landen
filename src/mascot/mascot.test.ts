import { describe, expect, it } from 'vitest'
import { units } from '../content'
import { checkpointId } from '../content/checkpoint'
import { hats, lastUnit, quietUnit, unitHat, unitHats } from './hats'
import { cheer, finishLine, greeting } from './lines'

describe('the stork’s hats', () => {
  it('gives every unit its own hat, but keeps off the quiet unit on slavery', () => {
    expect(units.filter(quietUnit).map((u) => u.number)).toEqual([7])
    for (const unit of units) {
      if (quietUnit(unit)) expect(unitHat(unit), `Unit ${unit.number}`).toBeUndefined()
      else expect(hats[unitHat(unit)!], `Unit ${unit.number}`).toBeTruthy()
    }
    const used = Object.values(unitHats)
    expect(new Set(used).size).toBe(used.length)
    expect([...used].sort()).toEqual(Object.keys(hats).sort())
  })
  it('wears the hat of the unit last worked on', () => {
    const [u1, u2] = [units[0], units[1]]
    expect(lastUnit({}, units)).toBeUndefined()
    expect(lastUnit({ [u2.lessons[0].id]: {}, [u1.lessons[0].id]: {} }, units)).toBe(u1)
    expect(lastUnit({ [u1.lessons[0].id]: {}, [checkpointId(u2)]: {} }, units)).toBe(u2)
  })
})

describe('what the stork says', () => {
  it('cheers runs of right answers and a comeback, and stays quiet otherwise', () => {
    expect(cheer(3, 0)).toBe('Three in a row. Goed zo!')
    expect(cheer(10, 0)).toBe('Ten in a row. Chapeau!')
    expect(cheer(1, 2)).toBe('Back on track. That’s the way.')
    for (const run of [1, 2, 4, 6, 9]) expect(cheer(run, 0)).toBeUndefined()
    expect(cheer(1, 1)).toBeUndefined()
  })
  it('ends a lesson with a line that fits how it went, never a scolding', () => {
    expect(finishLine({ asked: 10, mistakes: 0 })).toBe('Not a single slip. Chapeau!')
    expect(finishLine({ asked: 10, mistakes: 2 })).toMatch(/^Goed gedaan/)
    expect(finishLine({ asked: 10, mistakes: 5 })).toMatch(/review/)
    expect(finishLine({ asked: 10, mistakes: 8 })).toMatch(/^Every try counts/)
    expect(finishLine({ asked: 6, mistakes: 0, timedOut: true })).toMatch(/clock/)
    expect(finishLine({ asked: 15, mistakes: 1, legendary: 'passed' })).toBe('Legendary. Chapeau!')
  })
  it('greets from where the learner is today', () => {
    const day = { fresh: false, playedToday: false, streak: 4, streakAlive: true, due: 0, questsLeft: 3 }
    expect(greeting({ ...day, fresh: true, streak: 0, streakAlive: false })).toMatch(/^Hallo, bonjour!/)
    expect(greeting({ ...day, playedToday: true, questsLeft: 0 })).toBe('Today is done, quests and all. Tot morgen!')
    expect(greeting({ ...day, playedToday: true, questsLeft: 1 })).toBe('Your 4-day streak is safe for today. One quest is still open.')
    expect(greeting({ ...day, due: 7 })).toBe('7 questions are waiting in your review. A few minutes keeps them fresh.')
    expect(greeting(day)).toBe('One lesson today keeps your 4-day streak going.')
    expect(greeting({ ...day, streakAlive: false })).toMatch(/^Welkom terug/)
  })
})
