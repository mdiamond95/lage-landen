import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { feature } from 'topojson-client'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'
import topology from '../data/lowlands.topo.json'
import { credits } from '../photos/credits'
import { photoIds } from '../photos/ids'
import { ROMAN_MAX, ROMAN_MIN, romanEvents, romanLines, romanSites } from '../data/roman'
import { CLOTH_MAX, CLOTH_MIN, clothEvents, regions, routes, towns } from '../data/cloth'
import { waterStory } from '../data/water'
import { places } from './places'
import { Unit, timeMaps, type Exercise } from './schema'

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

// A question counts as visual if it is answered on a map or picture, or shows one.
const isVisual = (e: Exercise) =>
  e.type === 'pin' ||
  e.type === 'region' ||
  e.type === 'who' ||
  (e.type === 'truemyth' && e.visual !== undefined) ||
  (e.type === 'choice' && (e.visual !== undefined || e.options.some((o) => o.art || o.photo)))

describe.each(files)('%s', (file) => {
  const unit = Unit.parse(parse(readFileSync(join(dir, file), 'utf8')))
  const asks = unit.lessons.flatMap((l) => l.exercises).filter((e) => e.type !== 'story')

  it('has unique lesson ids', () => {
    const ids = unit.lessons.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('is at least 70% visual across the unit, as the plan asks', () => {
    expect(asks.filter(isVisual).length / asks.length).toBeGreaterThanOrEqual(0.7)
  })

  it('has a Who am I? and a true or myth with a picture or map', () => {
    expect(asks.some((e) => e.type === 'who')).toBe(true)
    expect(asks.some((e) => e.type === 'truemyth' && e.visual)).toBe(true)
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
        if (ex.type === 'choice' || ex.type === 'who') expect(ex.answer).toBeLessThan(ex.options.length)
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
      // The plan's target is 70% across a unit (tested above); single lessons may dip to 50%.
      expect(asks.filter(isVisual).length / asks.length).toBeGreaterThanOrEqual(0.5)
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
    for (const site of romanSites) expect(inBox(site.at), site.name).toBe(true)
  })

  it('tells its story in order across the whole slider', () => {
    const starts = romanEvents.map((e) => e.from)
    expect(starts[0]).toBe(ROMAN_MIN)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    expect(starts[starts.length - 1]).toBeLessThanOrEqual(ROMAN_MAX)
  })
})

describe('wool and cloth trade map', () => {
  // The trade map's frame: London to beyond the Ems, the Wash to Troyes.
  const inFrame = ([lon, lat]: [number, number]) => lon >= -0.95 && lon <= 9.05 && lat >= 48.15 && lat <= 54.25

  it('has routes, towns and labels inside the frame', () => {
    for (const [id, route] of Object.entries(routes)) {
      expect(route.coords.length, id).toBeGreaterThanOrEqual(2)
      for (const c of route.coords) expect(inFrame(c), `${id} ${c}`).toBe(true)
      if (route.label) expect(inFrame(route.label.at), `${id} label`).toBe(true)
      if (route.to !== undefined) expect(route.to, id).toBeGreaterThan(route.from)
      for (const [a, b] of route.off ?? []) expect(a <= b && a > route.from, `${id} gap`).toBe(true)
    }
    for (const t of towns) expect(inFrame(t.at), t.name).toBe(true)
    for (const r of regions) expect(inFrame(r.at), r.text).toBe(true)
  })

  it('tells its story in order across the whole slider', () => {
    const starts = clothEvents.map((e) => e.from)
    expect(starts[0]).toBe(CLOTH_MIN)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    expect(starts[starts.length - 1]).toBeLessThanOrEqual(CLOTH_MAX)
  })

})

describe('water works time map', () => {
  // The Zuiderzee and the Delta: well inside the Netherlands.
  const inNl = ([lon, lat]: [number, number]) => lon > 3.3 && lon < 7.2 && lat > 51.2 && lat < 53.6
  const { min, max, events, lines, sites, labels, areas = [] } = waterStory

  it('has lines, sites, labels and areas with real coordinates', () => {
    for (const line of lines) {
      expect(line.coords.length, line.name).toBeGreaterThanOrEqual(2)
      for (const c of line.coords) expect(inNl(c), `${line.name} ${c}`).toBe(true)
    }
    for (const s of sites) expect(inNl(s.at), s.name).toBe(true)
    for (const l of labels) expect(inNl(l.at), l.text).toBe(true)
    for (const a of areas) {
      expect(a.province !== undefined || a.shape !== undefined, a.name).toBe(true)
      if (a.province) expect(regionIds.provinces.has(a.province), a.name).toBe(true)
      for (const c of a.shape ?? []) expect(inNl(c), `${a.name} ${c}`).toBe(true)
    }
  })

  it('tells its story in order across the whole slider', () => {
    const starts = events.map((e) => e.from)
    expect(starts[0]).toBe(min)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    expect(starts[starts.length - 1]).toBeLessThanOrEqual(max)
    // Everything on the map appears at one of the stages, so play shows it.
    for (const item of [...lines, ...sites, ...labels, ...areas]) {
      if (item.from > min) expect(starts, JSON.stringify(item).slice(0, 60)).toContain(item.from)
    }
  })
})

describe('time maps in lessons', () => {
  const range = { water: [waterStory.min, waterStory.max], roman: [ROMAN_MIN, ROMAN_MAX], cloth: [CLOTH_MIN, CLOTH_MAX] }

  it('open at years inside their slider', () => {
    expect(Object.keys(range)).toEqual([...timeMaps])
    for (const file of files) {
      const unit = Unit.parse(parse(readFileSync(join(dir, file), 'utf8')))
      for (const ex of unit.lessons.flatMap((l) => l.exercises)) {
        const v = 'visual' in ex ? ex.visual : undefined
        if (v?.kind === 'time-map' && v.year !== undefined) {
          const [lo, hi] = range[v.map]
          expect(v.year, `${unit.id} ${v.map}`).toBeGreaterThanOrEqual(lo)
          expect(v.year, `${unit.id} ${v.map}`).toBeLessThanOrEqual(hi)
        }
      }
    }
  })
})
