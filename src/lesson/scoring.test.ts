import { describe, expect, it } from 'vitest'
import { formatKm, isChronological, lessonXp, sameSet, scorePin } from './scoring'

const amsterdam: [number, number] = [4.893, 52.373]
const rotterdam: [number, number] = [4.479, 51.922]

describe('scorePin', () => {
  it('measures Amsterdam to Rotterdam as about 58 km', () => {
    const r = scorePin(amsterdam, rotterdam, 40, 15)
    expect(r.km).toBeGreaterThan(55)
    expect(r.km).toBeLessThan(60)
    expect(r.correct).toBe(false)
  })
  it('counts a near miss as correct without the bonus', () => {
    const r = scorePin([4.6, 52.3], amsterdam, 40, 15)
    expect(r.correct).toBe(true)
    expect(r.bonus).toBe(false)
  })
  it('gives the bonus for a close pin', () => {
    expect(scorePin([4.9, 52.37], amsterdam, 40, 15).bonus).toBe(true)
  })
})

describe('helpers', () => {
  it('compares sets regardless of order', () => {
    expect(sameSet(['NL-NH', 'NL-ZH'], ['NL-ZH', 'NL-NH'])).toBe(true)
    expect(sameSet(['NL-NH'], ['NL-ZH', 'NL-NH'])).toBe(false)
  })
  it('checks chronological order', () => {
    expect(isChronological([-500, 1000, 1612])).toBe(true)
    expect(isChronological([1000, -500])).toBe(false)
  })
  it('adds the perfect and pin bonuses', () => {
    expect(lessonXp(0, 2)).toBe(19)
    expect(lessonXp(3, 0)).toBe(10)
  })
  it('formats distances', () => {
    expect(formatKm(3.21)).toBe('3.2 km')
    expect(formatKm(57.6)).toBe('58 km')
  })
})
