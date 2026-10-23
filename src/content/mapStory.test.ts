import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'
import { mapStories } from '../data/mapStories'
import { frameOf } from '../data/stories'
import { askable, bareTitle, buildMapStory } from './mapStory'
import { Exercise, Unit } from './schema'

const dir = import.meta.dirname
const units = readdirSync(dir)
  .filter((f) => f.endsWith('.yaml'))
  .map((file) => Unit.parse(parse(readFileSync(join(dir, file), 'utf8'))))

// The maps a unit's lessons show, from time-map, compare and scrub questions.
const mapsShown = (unit: Unit) =>
  new Set(
    unit.lessons.flatMap((l) =>
      l.exercises.flatMap((e) => [
        ...(e.type === 'scrub' ? [e.map] : []),
        ...('visual' in e && e.visual && (e.visual.kind === 'time-map' || e.visual.kind === 'compare') ? [e.visual.map] : []),
      ]),
    ),
  )

describe('map stories', () => {
  it('give every unit one, on a map its lessons show', () => {
    expect(Object.keys(mapStories).sort()).toEqual(units.map((u) => u.id).sort())
    for (const unit of units) expect(mapsShown(unit), unit.id).toContain(mapStories[unit.id].map)
  })

  it('run six to nine steps, in order, each at the start of a stage, in 60 to 90 seconds', () => {
    for (const [id, story] of Object.entries(mapStories)) {
      const { events } = frameOf(story.map)
      const starts = events.map((e) => e.from)
      expect(story.steps.length, id).toBeGreaterThanOrEqual(6)
      expect(story.steps.length, id).toBeLessThanOrEqual(9)
      story.steps.forEach((step, i) => {
        expect(starts, `${id} step ${i + 1} at ${step.at}`).toContain(step.at)
        if (i > 0) expect(step.at, `${id} step ${i + 1}`).toBeGreaterThan(story.steps[i - 1].at)
        expect(step.say.length, `${id} step ${i + 1}`).toBeLessThanOrEqual(200)
      })
      // About 150 words a minute read aloud.
      const words = story.steps.reduce((n, s) => n + s.say.split(/\s+/).length, 0)
      expect(words, `${id} words`).toBeGreaterThanOrEqual(120)
      expect(words, `${id} words`).toBeLessThanOrEqual(230)
    }
  })

  it('leave at least three steps to ask about, with no date in the question', () => {
    for (const [id, story] of Object.entries(mapStories)) {
      const asks = askable(story)
      expect(asks.length, id).toBeGreaterThanOrEqual(3)
      for (const a of asks) expect(a.title, id).not.toMatch(/\d|^Today/)
    }
  })

  it('build a narrated story and three find-the-year questions that parse, with answers on the map', () => {
    for (const unit of units) {
      const story = mapStories[unit.id]
      const { min, max } = frameOf(story.map)
      const played = buildMapStory(unit, () => 0.5)
      expect(played).toHaveLength(4)
      expect(played[0]).toMatchObject({ type: 'story', visual: { kind: 'map-story', unit: unit.id } })
      for (const e of played) expect(Exercise.parse(e)).toEqual(e)
      for (const e of played.slice(1)) {
        if (e.type !== 'scrub') throw new Error(`${unit.id}: ${e.type}`)
        expect(e.map).toBe(story.map)
        const [from, to] = e.answer as [number, number]
        expect(from, unit.id).toBeGreaterThan(min)
        expect(to, unit.id).toBeLessThanOrEqual(max)
        expect(from, unit.id).toBeLessThanOrEqual(to)
      }
    }
  })

  it('takes the date off a stage title, and only a date', () => {
    expect(bareTitle('1916: The Zuiderzee floods')).toBe('The Zuiderzee floods')
    expect(bareTitle('About 1100: Cloth from Flemish sheep')).toBe('Cloth from Flemish sheep')
    expect(bareTitle('1575: Leiden')).toBe('Leiden')
    expect(bareTitle('1543: the fabric of the body')).toBe('The fabric of the body')
    expect(bareTitle('The Burgundian Netherlands')).toBe('The Burgundian Netherlands')
    expect(bareTitle('Ghent: the cloth town')).toBe('Ghent: the cloth town')
  })
})
