import { describe, expect, it } from 'vitest'
import { cards, units } from '.'
import { buildPlacement, PLACEMENT_SIZE, placementPassed, placementTracks } from './placement'

// A small seeded generator, so each run draws the same blocks.
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

describe('placement test', () => {
  it('opens a unit at four of five right, the 80% bar', () => {
    expect(placementPassed(4)).toBe(true)
    expect(placementPassed(3)).toBe(false)
  })

  it('covers every playable unit once, in course order within each track', () => {
    const tracks = placementTracks(units)
    expect(tracks.map((t) => t.units.length)).toEqual([9, 3, 3, 11])
    expect(tracks.flatMap((t) => t.units.map((u) => u.number))).toEqual(units.map((u) => u.number))
  })

  for (const unit of units)
    describe(`unit ${unit.number}`, () => {
      const blocks = Array.from({ length: 30 }, (_, i) => buildPlacement(unit, seeded(i + 1)))

      it(`asks ${PLACEMENT_SIZE} questions from ${PLACEMENT_SIZE} different lessons, no stories`, () => {
        for (const picks of blocks) {
          expect(picks).toHaveLength(PLACEMENT_SIZE)
          expect(new Set(picks.map((p) => p.lesson.id)).size).toBe(PLACEMENT_SIZE)
          expect(picks.every((p) => p.exercise.type !== 'story')).toBe(true)
          expect(picks.every((p) => p.lesson.exercises.includes(p.exercise))).toBe(true)
        }
      })

      it('asks different questions from run to run', () => {
        expect(new Set(blocks.map((b) => b.map((p) => p.lesson.exercises.indexOf(p.exercise)).join())).size).toBeGreaterThan(1)
      })

      it('sends every answer to the daily review', () => {
        for (const picks of blocks) for (const p of picks) expect(cards.byExercise.get(p.exercise), p.lesson.id).toBeTruthy()
      })

      it('has a content note for blocks that draw on a lesson with one', () => {
        if (unit.lessons.some((l) => l.note)) expect(unit.note).toBeTruthy()
        // The same note opens the checkpoint and the placement block, so it names neither.
        expect(unit.note ?? '').not.toMatch(/checkpoint|placement/i)
      })
    })

  it('fills a short unit from its lessons twice over', () => {
    const [unit] = units
    const short = { ...unit, lessons: unit.lessons.slice(0, 3) }
    const picks = buildPlacement(short, seeded(7))
    expect(picks).toHaveLength(PLACEMENT_SIZE)
    expect(new Set(picks.map((p) => p.exercise)).size).toBe(PLACEMENT_SIZE)
  })
})
