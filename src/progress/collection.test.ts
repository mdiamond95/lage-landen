import { describe, expect, it } from 'vitest'
import { findLesson, units } from '../content'
import { wall } from '../content/wall'
import { cardKinds, collection } from '../data/collection'
import { foodIds, foods } from '../data/foods'
import { collected, lessonPhotos, newCards } from './collection'

const done = { bestXp: 10, perfect: false }
const lesson = (id: string) => findLesson(id)!.lesson

describe('the collection', () => {
  it('hangs each photo once, with a title and a line', () => {
    const photos = collection.map((c) => c.photo)
    expect(new Set(photos).size).toBe(photos.length)
    for (const c of collection) {
      expect(c.title.trim(), c.photo).not.toBe('')
      expect(c.line.trim(), c.photo).not.toBe('')
      expect(c.title.endsWith('.') || c.line.endsWith('.'), c.photo).toBe(false)
    }
  })
  it('collects every card in some lesson', () => {
    const missing = collection.filter((c) => !wall.some((h) => h.photo === c.photo)).map((c) => c.photo)
    expect(missing).toEqual([])
  })
  it('has all four kinds and a card in every unit', () => {
    for (const kind of cardKinds) expect(wall.filter((c) => c.kind === kind).length, kind).toBeGreaterThan(20)
    for (const u of units) expect(wall.some((c) => u.lessons.some((l) => c.lessons.includes(l.id))), `Unit ${u.number}`).toBe(true)
  })
  it('has a card for every food on the food map with a photo', () => {
    for (const id of foodIds) if (foods[id].photo) expect(collection.some((c) => c.photo === foods[id].photo), id).toBe(true)
  })
  it('waits for the Who am I? before naming a face', () => {
    for (const c of wall) {
      const asked = units.flatMap((u) => u.lessons).filter((l) => l.exercises.some((e) => e.type === 'who' && e.photo === c.photo))
      if (!asked.length) continue
      expect(asked.map((l) => l.id), c.photo).toContain(c.lessons[0])
    }
  })
  it('leaves out the perpetrators the course covers', () => {
    for (const photo of ['coen', 'seyss-inquart', 'degrelle', 'van-heutsz', 'leopold-ii-bassano']) expect(collection.some((c) => c.photo === photo), photo).toBe(false)
  })
})

describe('what a lesson hangs', () => {
  it('counts the food map for the kind it opens on', () => {
    const cheese = lessonPhotos(lesson('u21-l1'))
    expect(cheese.has('gouda-wheels')).toBe(true)
    expect(cheese.has('orval')).toBe(false)
    const leiden = lessonPhotos(lesson('u5-l3'))
    expect(leiden.has('hutspot')).toBe(true)
    expect(leiden.has('gouda-wheels')).toBe(false)
  })
  it('counts a taste question for the foods of its answer’s kind', () => {
    const beer = lessonPhotos(lesson('u21-l5'))
    expect(beer.has('schiedam-mill')).toBe(true)
    expect(beer.has('hasselt-jenever')).toBe(true)
  })
})

describe('collecting', () => {
  const nightWatch = wall.find((c) => c.photo === 'night-watch')!
  const first = nightWatch.lessons[0]

  it('collects a card when a lesson showing it is finished', () => {
    expect(collected({ completed: {} }, nightWatch)).toBe(false)
    expect(collected({ completed: { [first]: done } }, nightWatch)).toBe(true)
  })
  it('lists the new cards only the first time a lesson is finished', () => {
    const fresh = newCards({ completed: {} }, wall, first)
    expect(fresh.map((c) => c.photo)).toContain('night-watch')
    expect(newCards({ completed: { [first]: done } }, wall, first)).toEqual([])
  })
  it('does not list a card another lesson already hung', () => {
    const shared = wall.find((c) => c.lessons.length > 1)!
    const [a, b] = shared.lessons
    expect(newCards({ completed: { [a]: done } }, wall, b).map((c) => c.photo)).not.toContain(shared.photo)
  })
})
