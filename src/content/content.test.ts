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
import { burgundyStory } from '../data/burgundy'
import { revoltStory } from '../data/revolt'
import { spanishStory } from '../data/spanish'
import { amsterdamStory } from '../data/amsterdam'
import { empireStory } from '../data/empire'
import { bordersStory } from '../data/borders'
import { charts } from '../data/charts'
import { peopleIn, trees } from '../data/families'
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
  e.type === 'scrub' ||
  e.type === 'hunt' ||
  ((e.type === 'truemyth' || e.type === 'gap') && e.visual !== undefined) ||
  (e.type === 'choice' && (e.visual !== undefined || e.options.some((o) => o.art || o.photo))) ||
  (e.type === 'odd' && e.items.every((i) => i.photo)) ||
  (e.type === 'voices' && e.voices.some((v) => v.photo))

describe.each(files)('%s', (file) => {
  const unit = Unit.parse(parse(readFileSync(join(dir, file), 'utf8')))
  const asks = unit.lessons.flatMap((l) => l.exercises).filter((e) => e.type !== 'story')

  // The credit (the painter) stays hidden until the answer is checked, so a
  // self-portrait can be credited honestly.
  it("doesn't give away a Who am I? in its picture's caption or description", () => {
    for (const e of asks) {
      if (e.type !== 'who') continue
      const { caption, alt } = credits[e.photo]
      // Every proper name in the answer, e.g. Jacqueline and Bavaria.
      const names = e.options[e.answer].split(/\s+/).filter((w) => /^[A-Z]/.test(w) && w.length > 2)
      for (const n of names) expect(`${caption} ${alt}`, `${e.photo} names ${n}`).not.toContain(n)
    }
  })

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

  it('reads a primary source and links causes to effects', () => {
    expect(asks.some((e) => e.type === 'gap')).toBe(true)
    expect(asks.some((e) => e.type === 'cause')).toBe(true)
  })

  it('has an odd one out told apart by pictures', () => {
    expect(asks.some((e) => e.type === 'odd' && e.items.every((i) => i.photo))).toBe(true)
  })

  it('comes back to its time map with find-the-year questions in at least two lessons', () => {
    const lessons = unit.lessons.filter((l) => l.exercises.some((e) => e.type === 'scrub'))
    expect(lessons.length).toBeGreaterThanOrEqual(2)
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
        if (ex.type === 'choice' || ex.type === 'who' || ex.type === 'gap' || ex.type === 'voices')
          expect(ex.answer).toBeLessThan(ex.options.length)
        if (ex.type === 'gap') expect(new Set(ex.options).size, 'gap options differ').toBe(ex.options.length)
        if (ex.type === 'odd') {
          expect(ex.answer).toBeLessThan(ex.items.length)
          expect(ex.reason).toBeLessThan(ex.reasons.length)
        }
        if (visual?.kind === 'family-tree' && visual.hide)
          expect(peopleIn(trees[visual.tree]).map((p) => p.id), visual.hide).toContain(visual.hide)
        if (ex.type === 'hunt') {
          for (const [x, y, w, h] of ex.targets)
            expect(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 1 && y + h <= 1, 'hunt target inside the picture').toBe(true)
          // Targets covering more than a fifth of the picture are too easy to hit by chance.
          const area = ex.targets.reduce((sum, [, , w, h]) => sum + w * h, 0)
          expect(area, 'hunt target size').toBeLessThanOrEqual(0.2)
        }
        if (ex.type === 'order') {
          const years = ex.items.map((i) => i.year)
          expect(new Set(years).size, 'order items need distinct years').toBe(years.length)
        }
      }
    })

    if (lesson.note)
      it(`${lesson.id} has a content note, so its checkpoint has one too`, () => {
        // Checkpoint questions are drawn from every lesson, so the warning must carry over.
        expect(unit.note, unit.id).toBeTruthy()
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
      expect(a.regions !== undefined || a.shape !== undefined, a.name).toBe(true)
      for (const id of a.regions ?? []) expect(regionIds.provinces.has(id), a.name).toBe(true)
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
  const range = {
    water: [waterStory.min, waterStory.max],
    roman: [ROMAN_MIN, ROMAN_MAX],
    cloth: [CLOTH_MIN, CLOTH_MAX],
    burgundy: [burgundyStory.min, burgundyStory.max],
    revolt: [revoltStory.min, revoltStory.max],
    amsterdam: [amsterdamStory.min, amsterdamStory.max],
    spanish: [spanishStory.min, spanishStory.max],
    empire: [empireStory.min, empireStory.max],
    borders: [bordersStory.min, bordersStory.max],
  }

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
        if (ex.type === 'scrub') {
          const [lo, hi] = range[ex.map]
          const [from, to] = ex.answer
          const start = ex.start ?? lo
          expect(lo <= from && from <= to && to <= hi, `${unit.id} ${ex.prompt}`).toBe(true)
          // The map must not open on a right answer.
          expect(start < from || start > to, `${unit.id} scrub starts inside its answer`).toBe(true)
        }
      }
    }
  })
})

describe.each([
  ['Burgundian lands', burgundyStory],
  ['revolt', revoltStory],
  ['Spanish Netherlands', spanishStory],
  ['border-change', bordersStory],
])('%s time map', (_, story) => {
  const { min, max, events, sites, labels, lines, areas = [] } = story
  const inFrame = ([lon, lat]: [number, number]) => lon > 1.5 && lon < 8 && lat > 49.3 && lat < 53.7

  it('has areas, sites and labels on real regions and coordinates', () => {
    for (const a of areas) {
      expect(a.regions?.length, a.name).toBeGreaterThan(0)
      for (const id of a.regions ?? []) expect(regionIds.provinces.has(id) || regionIds.countries.has(id), `${a.name} ${id}`).toBe(true)
      for (const c of a.clip ?? []) expect(inFrame(c), `${a.name} ${c}`).toBe(true)
      if (a.to !== undefined) expect(a.to, a.name).toBeGreaterThanOrEqual(a.from)
    }
    for (const s of sites) expect(inFrame(s.at), s.name).toBe(true)
    for (const l of labels) expect(inFrame(l.at), l.text).toBe(true)
    for (const l of lines) for (const c of l.coords) expect(inFrame(c), `${l.name} ${c}`).toBe(true)
    // Areas are keyed by name on the map.
    const names = new Set(areas.map((a) => a.name))
    expect(names.size, 'area names are unique').toBe(areas.length)
  })

  it('tells its story in order, and every change on the map has a caption', () => {
    const starts = events.map((e) => e.from)
    expect(starts[0]).toBe(min)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    expect(starts[starts.length - 1]).toBe(max)
    for (const item of [...sites, ...labels, ...lines, ...areas]) {
      const name = 'name' in item ? item.name : item.text
      if (item.from > min) expect(starts, `${name} appears`).toContain(item.from)
      if (item.to !== undefined) expect(starts, `${name} goes`).toContain(item.to + 1)
      for (const [, end] of item.off ?? []) expect(starts, `${name} returns`).toContain(end + 1)
    }
  })
})

describe('Amsterdam growth map', () => {
  const { min, max, events, sites, labels, lines, areas = [] } = amsterdamStory
  // Central Amsterdam, from the Jordaan to the eastern islands.
  const inCity = ([lon, lat]: [number, number]) => lon > 4.86 && lon < 4.94 && lat > 52.35 && lat < 52.395

  it('draws every stage, wall, site and label inside the city', () => {
    for (const a of areas) for (const c of a.shape ?? []) expect(inCity(c), `${a.name} ${c}`).toBe(true)
    for (const l of lines) for (const c of l.coords) expect(inCity(c), `${l.name} ${c}`).toBe(true)
    for (const s of sites) expect(inCity(s.at), s.name).toBe(true)
    for (const l of labels) expect(inCity(l.at), l.text).toBe(true)
  })

  it('grows stage by stage, with a caption for everything that appears', () => {
    const starts = events.map((e) => e.from)
    expect(starts[0]).toBe(min)
    expect(starts[starts.length - 1]).toBe(max)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    for (const item of [...sites, ...labels, ...lines, ...areas]) {
      const name = 'name' in item ? item.name : item.text
      if (item.from > min) expect(starts, `${name} appears`).toContain(item.from)
      if (item.to !== undefined && item.to < max) expect(starts, `${name} goes`).toContain(item.to + 1)
    }
    // The city only grows: no stage of land inside the walls is ever taken away.
    for (const a of areas) expect(a.to, a.name).toBeUndefined()
  })
})

describe('world trade map', () => {
  const { min, max, events, sites, labels, lines, areas = [] } = empireStory
  // Roughly the map's frame: the Caribbean to Japan, the North Sea to the Cape.
  const inWorld = ([lon, lat]: [number, number]) => lon > -100 && lon < 155 && lat > -50 && lat < 66

  it('puts every route, post, label and colony on the world map', () => {
    for (const l of lines) {
      expect(l.coords.length, l.name).toBeGreaterThanOrEqual(2)
      for (const c of l.coords) expect(inWorld(c), `${l.name} ${c}`).toBe(true)
    }
    for (const s of sites) expect(inWorld(s.at), s.name).toBe(true)
    for (const l of labels) expect(inWorld(l.at), l.text).toBe(true)
    for (const a of areas) for (const c of a.shape ?? []) expect(inWorld(c), `${a.name} ${c}`).toBe(true)
  })

  it('tells its story in order, and every change on the map has a caption', () => {
    const starts = events.map((e) => e.from)
    expect(starts[0]).toBe(min)
    expect(starts[starts.length - 1]).toBe(max)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    for (const item of [...sites, ...labels, ...lines, ...areas]) {
      const name = 'name' in item ? item.name : item.text
      if (item.from > min) expect(starts, `${name} appears`).toContain(item.from)
      if (item.to !== undefined && item.to < max) expect(starts, `${name} goes`).toContain(item.to + 1)
    }
  })

  it('marks every slave-trade route in its own colour', () => {
    // The routes that carried people must never be drawn like the goods routes.
    const enslaved = lines.filter((l) => /enslaved|slave/i.test(l.name))
    expect(enslaved.length).toBeGreaterThan(0)
    for (const l of enslaved) expect(l.tone, l.name).toBe('enslaved')
  })
})

describe('family trees', () => {
  it('give every person a unique id', () => {
    for (const tree of Object.values(trees)) {
      const ids = peopleIn(tree).map((p) => p.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
})

describe('charts', () => {
  it('have points in year order with positive values', () => {
    for (const [id, chart] of Object.entries(charts)) {
      for (const series of chart.series) {
        const years = series.points.map(([y]) => y)
        expect([...years].sort((a, b) => a - b), `${id} ${series.name}`).toEqual(years)
        expect(new Set(years).size, `${id} ${series.name}`).toBe(years.length)
        for (const [, v] of series.points) expect(v, `${id} ${series.name}`).toBeGreaterThan(0)
      }
      expect(chart.source, id).not.toBe('')
    }
  })
})
