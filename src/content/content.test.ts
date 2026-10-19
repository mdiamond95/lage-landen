import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { feature } from 'topojson-client'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'
import topology from '../data/lowlands.topo.json'
import { credits } from '../photos/credits'
import { photoIds } from '../photos/ids'
import { ROMAN_MAX, ROMAN_MIN, romanEvents, romanLines, romanSites } from '../data/roman'
import { places } from './places'
import { Unit } from './schema'

const dir = import.meta.dirname
const files = readdirSync(dir).filter((f) => f.endsWith('.yaml'))
const layerIds = (name: string) =>
  new Set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (feature(topology as any, (topology as any).objects[name]) as any).features.map((f: any) => f.properties.id),
  )
const regionIds = { countries: layerIds('countries'), provinces: layerIds('provinces') }
const riverNames = new Set(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (feature(topology as any, (topology as any).objects.rivers) as any).features.map((f: any) => f.properties.name),
)

describe.each(files)('%s', (file) => {
  const unit = Unit.parse(parse(readFileSync(join(dir, file), 'utf8')))

  it('has unique lesson ids', () => {
    const ids = unit.lessons.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  for (const lesson of unit.lessons) {
    it(`${lesson.id} references real places, regions and rivers`, () => {
      for (const ex of lesson.exercises) {
        const visual = 'visual' in ex ? ex.visual : undefined
        if (visual?.kind === 'map') {
          for (const id of visual.highlight)
            expect(regionIds.countries.has(id) || regionIds.provinces.has(id), id).toBe(true)
          for (const r of visual.rivers) expect(riverNames.has(r), r).toBe(true)
          for (const p of visual.pins) expect(places[p], p).toBeDefined()
        }
        if (ex.type === 'pin') expect(places[ex.place], ex.place).toBeDefined()
        if (ex.type === 'region') for (const id of ex.answer) expect(regionIds[ex.layer].has(id), id).toBe(true)
        if (ex.type === 'choice') expect(ex.answer).toBeLessThan(ex.options.length)
        if (ex.type === 'order') {
          const years = ex.items.map((i) => i.year)
          expect(new Set(years).size, 'order items need distinct years').toBe(years.length)
        }
      }
    })

    it(`${lesson.id} opens with a story and asks at least 6 questions`, () => {
      expect(lesson.exercises[0].type).toBe('story')
      expect(lesson.exercises.filter((e) => e.type !== 'story').length).toBeGreaterThanOrEqual(6)
    })

    it(`${lesson.id} is mostly visual`, () => {
      const asks = lesson.exercises.filter((e) => e.type !== 'story')
      const visual = asks.filter(
        (e) =>
          e.type === 'pin' ||
          e.type === 'region' ||
          (e.type === 'truemyth' && e.visual) ||
          (e.type === 'choice' && (e.visual || e.options.some((o) => o.art || o.photo))),
      )
      // The plan's target is 70% across a unit; single lessons may dip to 50%.
      expect(visual.length / asks.length).toBeGreaterThanOrEqual(0.5)
    })
  }
})

describe('photos', () => {
  it('every photo has a file and a full credit', () => {
    for (const id of photoIds) {
      const c = credits[id]
      expect(existsSync(join(dir, '../photos', `${id}.jpg`)), id).toBe(true)
      for (const field of ['alt', 'caption', 'author', 'licence'] as const) expect(c[field], `${id} ${field}`).not.toBe('')
      expect(c.source, id).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
      expect(c.licenceUrl, id).toMatch(/^https:\/\/creativecommons\.org\//)
    }
  })
})

describe('roman time map', () => {
  // Generous box around the map, so a swapped lon/lat or a typo shows up.
  const inBox = ([lon, lat]: [number, number]) => lon > 1 && lon < 9 && lat > 49 && lat < 54

  it('has lines with real coordinates', () => {
    for (const [id, line] of Object.entries(romanLines)) {
      expect(line.coords.length, id).toBeGreaterThanOrEqual(2)
      for (const c of line.coords) expect(inBox(c), `${id} ${c}`).toBe(true)
      if (line.to !== undefined) expect(line.to, id).toBeGreaterThan(line.from)
    }
    for (const site of romanSites) expect(inBox(site.at), site.modern).toBe(true)
  })

  it('tells its story in order across the whole slider', () => {
    const starts = romanEvents.map((e) => e.from)
    expect(starts[0]).toBe(ROMAN_MIN)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    expect(starts[starts.length - 1]).toBeLessThanOrEqual(ROMAN_MAX)
  })
})
