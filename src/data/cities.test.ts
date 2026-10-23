import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { units } from '../content'
import { cityFrame } from '../map/cityFrame'
import { photoIds } from '../photos/ids'
import { cities, cityIds, landmarkIds, landmarkOf } from './cities'

describe('the city explorer', () => {
  it.each(cityIds)('%s has a street map with water and streets', (city) => {
    const file = `src/data/cities/${city}.topo.json`
    expect(existsSync(file)).toBe(true)
    const topo = JSON.parse(readFileSync(file, 'utf8'))
    for (const layer of ['water', 'minor', 'major']) expect(Object.keys(topo.objects), layer).toContain(layer)
  })

  it.each(cityIds)('%s has six to ten landmarks, each with a photo, a short text and a source', (city) => {
    const ids = landmarkIds(city)
    expect(ids.length).toBeGreaterThanOrEqual(6)
    expect(ids.length).toBeLessThanOrEqual(10)
    expect(cities[city].sources.length).toBeGreaterThan(0)
    for (const id of ids) {
      const l = landmarkOf(city, id)
      expect(photoIds as readonly string[], `${city} ${id}`).toContain(l.photo)
      expect(l.text.length, `${city} ${id}`).toBeLessThanOrEqual(220)
    }
  })

  // Pins are 11 units across on a map 600 wide; they must not overlap or sit on the edge.
  it.each(cityIds)('%s keeps its pins apart and inside the map', (city) => {
    const { projection, height } = cityFrame(city)
    const pts = landmarkIds(city).map((id) => [id, projection(landmarkOf(city, id).at)!] as const)
    for (const [id, [x, y]] of pts) {
      expect(x, id).toBeGreaterThan(14)
      expect(x, id).toBeLessThan(600 - 14)
      expect(y, id).toBeGreaterThan(14)
      expect(y, id).toBeLessThan(height - 14)
    }
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i][1][0] - pts[j][1][0], pts[i][1][1] - pts[j][1][1])
        expect(d, `${pts[i][0]} and ${pts[j][0]}`).toBeGreaterThanOrEqual(26)
      }
  })

  // A question zooms in on its pins: they still sit inside the map, and the map is no
  // taller than a phone screen can show under the question.
  const questions = units.flatMap((u) => u.lessons.flatMap((l) => l.exercises.flatMap((e) => (e.type === 'landmark' ? [[l.id, e] as const] : []))))
  it('has landmark questions to ask', () => expect(questions.length).toBeGreaterThanOrEqual(7))
  it.each(questions)('%s zooms in on its pins and keeps them inside', (_, e) => {
    const ids = e.options ?? landmarkIds(e.city)
    const { projection, height } = cityFrame(e.city, ids.map((id) => landmarkOf(e.city, id).at))
    expect(height).toBeLessThanOrEqual(700)
    for (const id of ids) {
      const [x, y] = projection(landmarkOf(e.city, id).at)!
      expect(x, id).toBeGreaterThan(20)
      expect(x, id).toBeLessThan(600 - 20)
      expect(y, id).toBeGreaterThan(20)
      expect(y, id).toBeLessThan(height - 20)
    }
  })
})
