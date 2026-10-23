import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { feature } from 'topojson-client'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'
import topology from '../data/lowlands.topo.json'
import { credits } from '../photos/credits'
import { photoIds } from '../photos/ids'
import { paths as icons } from '../screens/Icon'
import { ROMAN_MAX, ROMAN_MIN, romanEvents, romanLines, romanSites, romanStory } from '../data/roman'
import { CLOTH_MAX, CLOTH_MIN, clothEvents, regions, routes, towns } from '../data/cloth'
import { waterStory } from '../data/water'
import { burgundyStory } from '../data/burgundy'
import { revoltStory } from '../data/revolt'
import { spanishStory } from '../data/spanish'
import { amsterdamStory } from '../data/amsterdam'
import { empireStory } from '../data/empire'
import { bordersStory } from '../data/borders'
import { kingdomStory } from '../data/kingdom'
import { railsStory } from '../data/rails'
import { occupationStory } from '../data/occupation'
import { deltaStory } from '../data/delta'
import { industryStory } from '../data/industry'
import { congoStory } from '../data/congo'
import congoTopology from '../data/congo.topo.json'
import { greatWarStory } from '../data/greatwar'
import { westhoekStory } from '../data/westhoek'
import westhoekTopology from '../data/westhoek.topo.json'
import { languageStory } from '../data/language'
import belgiumTopology from '../data/belgium.topo.json'
import { paintersStory } from '../data/painters'
import { mastersStory } from '../data/masters'
import { modernsStory } from '../data/moderns'
import { buildingsStory } from '../data/buildings'
import { tonguesStory } from '../data/tongues'
import { foodStory } from '../data/food'
import { foodIds, foods } from '../data/foods'
import { feastStory } from '../data/feastMap'
import { sportStory } from '../data/sport'
import { popStory } from '../data/pop'
import { scienceStory } from '../data/science'
import { stateStory } from '../data/state'
import { provinceIds, provinces, provincesOf } from '../data/provinces'
import { chamberIds, chambers, MAJORITY, SEATS, cabinetSeats } from '../data/seats'
import { areaOf, courses, greatCircleKm, rhumb, shapeIds, shapes } from '../data/projections'
import { routes as raceRoutes } from '../data/routes'
import { DAYS, daysOff, feastIds, feasts, spanOf } from '../data/feasts'
import { dialectIds, dialectPieces, dialects } from '../data/dialects'
import { allPhrases, phraseSetIds, phraseSets } from '../data/phrases'
import { soundIds } from '../sounds/ids'
import { soundCredits } from '../sounds/credits'
import { facades } from '../data/facades'
import { pairs } from '../data/pairs'
import { thenNows } from '../data/thenNow'
import { walks } from '../data/walks'
import { collection } from '../data/collection'
import { charts } from '../data/charts'
import { tours } from '../data/paintings'
import { series } from '../data/series'
import { activeAt, eventAt } from '../data/timeline'
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
  (e.type === 'voices' && e.voices.some((v) => v.photo)) ||
  (e.type === 'sort' && (e.visual !== undefined || e.items.every((i) => i.photo))) ||
  e.type === 'style' ||
  e.type === 'label' ||
  e.type === 'listen' ||
  e.type === 'taste' ||
  e.type === 'when' ||
  e.type === 'panels' ||
  e.type === 'truesize' ||
  e.type === 'drill' ||
  e.type === 'landmark' ||
  (e.type === 'pick' && (e.visual !== undefined || e.items.every((i) => i.photo)))

describe.each(files)('%s', (file) => {
  const unit = Unit.parse(parse(readFileSync(join(dir, file), 'utf8')))
  const asks = unit.lessons.flatMap((l) => l.exercises).filter((e) => e.type !== 'story')

  it('draws every lesson icon, rather than falling back to the map', () => {
    for (const l of unit.lessons) expect(Object.keys(icons), `${l.id} ${l.icon}`).toContain(l.icon)
  })

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

  it('sorts things into groups', () => {
    expect(asks.some((e) => e.type === 'sort')).toBe(true)
  })

  it('has an odd one out told apart by pictures', () => {
    expect(asks.some((e) => e.type === 'odd' && e.items.every((i) => i.photo))).toBe(true)
  })

  it('comes back to its time map with find-the-year questions in at least two lessons', () => {
    const lessons = unit.lessons.filter((l) => l.exercises.some((e) => e.type === 'scrub'))
    expect(lessons.length).toBeGreaterThanOrEqual(2)
  })

  // Unit 3's cloth map draws trade routes, not borders, so its compare uses the buildings map.
  it('sets two years of its map side by side, before and after', () => {
    const shown = unit.lessons.flatMap((l) => l.exercises).map((e) => ('visual' in e ? e.visual : undefined))
    expect(shown.some((v) => v?.kind === 'compare')).toBe(true)
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
        if (visual?.kind === 'painting' && visual.focus)
          expect(tours[visual.painting].stops.map((s) => s.id), visual.focus).toContain(visual.focus)
        if (visual?.kind === 'facade' && visual.focus)
          expect(facades[visual.facade].spots.map((s) => s.id), visual.focus).toContain(visual.focus)
        if (visual?.kind === 'pair' && visual.focus)
          expect(pairs[visual.pair].looks.map((l) => l.id), visual.focus).toContain(visual.focus)
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

describe('painting tours', () => {
  it('stop at details inside the painting, each with its own id', () => {
    for (const [id, tour] of Object.entries(tours)) {
      expect(photoIds, id).toContain(tour.photo)
      const ids = tour.stops.map((s) => s.id)
      expect(new Set(ids).size, `${id} stop ids`).toBe(ids.length)
      for (const { id: stop, box: [x, y, w, h] } of tour.stops)
        expect(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 1.0001 && y + h <= 1.0001, `${id} ${stop} inside the painting`).toBe(true)
    }
  })
})

describe('paintings side by side', () => {
  it('are two different paintings, compared at details inside each', () => {
    for (const [id, pair] of Object.entries(pairs)) {
      expect(photoIds, id).toContain(pair.left.photo)
      expect(photoIds, id).toContain(pair.right.photo)
      expect(pair.left.photo, id).not.toBe(pair.right.photo)
      const ids = pair.looks.map((l) => l.id)
      expect(new Set(ids).size, `${id} look ids`).toBe(ids.length)
      expect(ids.length, `${id} looks`).toBeGreaterThanOrEqual(2)
      for (const { id: look, boxes } of pair.looks)
        for (const [x, y, w, h] of boxes)
          expect(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 1.0001 && y + h <= 1.0001, `${id} ${look} inside the painting`).toBe(true)
    }
  })
})

describe('then and now', () => {
  const shown = files
    .map((file) => Unit.parse(parse(readFileSync(join(dir, file), 'utf8'))))
    .flatMap((u) => u.lessons.flatMap((l) => l.exercises)).flatMap((e) => ('visual' in e && e.visual?.kind === 'then-now' ? [e.visual.pair] : []))
  it('lays an old picture over a photo of the same place today, and each one is shown in a lesson', () => {
    for (const [id, pair] of Object.entries(thenNows)) {
      expect(photoIds, id).toContain(pair.then.photo)
      expect(photoIds, id).toContain(pair.now.photo)
      expect(pair.then.photo, id).not.toBe(pair.now.photo)
      expect(pair.now.when, id).toBe('Today')
      expect(shown, id).toContain(id)
    }
  })
})

describe('museum walks', () => {
  const lessons = files.map((file) => Unit.parse(parse(readFileSync(join(dir, file), 'utf8')))).flatMap((u) => u.lessons)
  const cards = new Set(collection.map((c) => c.photo))
  it('hangs six to eight artworks with their museum cards, each walk in one lesson that lists its sources', () => {
    for (const [id, walk] of Object.entries(walks)) {
      expect(walk.stops.length, id).toBeGreaterThanOrEqual(6)
      expect(walk.stops.length, id).toBeLessThanOrEqual(8)
      expect(new Set(walk.stops.map((s) => s.photo)).size, `${id} hangs a painting twice`).toBe(walk.stops.length)
      for (const stop of walk.stops) {
        expect(photoIds, `${id} ${stop.photo}`).toContain(stop.photo)
        expect(cards.has(stop.photo), `${id} ${stop.photo} has a card in collection.ts`).toBe(true)
        expect(stop.text.length, `${id} ${stop.photo} text`).toBeLessThanOrEqual(220)
      }
      expect(walk.intro.length, `${id} intro`).toBeLessThanOrEqual(260)
      const shownIn = lessons.filter((l) => l.exercises.some((e) => 'visual' in e && e.visual?.kind === 'walk' && e.visual.walk === id))
      expect(shownIn.map((l) => l.id), `${id} is walked in exactly one lesson`).toHaveLength(1)
      const urls = new Set(shownIn[0].sources.map((s) => s.url))
      for (const src of walk.sources) expect(urls, `${shownIn[0].id} lists ${src.url}`).toContain(src.url)
      // A question on the walk follows it in the lesson.
      const ex = shownIn[0].exercises
      const at = ex.findIndex((e) => 'visual' in e && e.visual?.kind === 'walk')
      expect(ex[at].type, id).toBe('story')
      expect(at, `${id} has a question after it`).toBeLessThan(ex.length - 1)
    }
  })
})

describe('photos', () => {
  it('every photo has a file and a full credit', () => {
    for (const id of photoIds) {
      const c = credits[id]
      expect(existsSync(join(dir, '../photos', `${id}.jpg`)), id).toBe(true)
      for (const field of ['alt', 'caption', 'author', 'licence'] as const) expect(c[field], `${id} ${field}`).not.toBe('')
      expect(c.source, id).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
      // A Creative Commons licence, or Commons' own free licence that asks only for the author's name.
      expect(c.licenceUrl, id).toMatch(/^https:\/\/(creativecommons\.org\/|commons\.wikimedia\.org\/wiki\/Template:Attribution$)/)
    }
  })

  it('no picture is saved twice under two ids: reuse the first id instead', () => {
    const seen = new Map<string, string>()
    for (const id of photoIds) {
      const bytes = readFileSync(join(dir, '../photos', `${id}.jpg`)).toString('base64')
      expect(seen.get(bytes), id).toBeUndefined()
      seen.set(bytes, id)
    }
  })
})

describe('recordings', () => {
  it('every recording has a file and a full credit', () => {
    for (const id of soundIds) {
      const c = soundCredits[id]
      expect(existsSync(join(dir, '../sounds', `${id}.mp3`)), id).toBe(true)
      for (const field of ['words', 'language', 'author', 'licence'] as const) expect(c[field], `${id} ${field}`).not.toBe('')
      expect(c.source, id).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
      expect(c.licenceUrl, id).toMatch(/^https:\/\/(creativecommons\.org\/|commons\.wikimedia\.org\/wiki\/Template:Attribution$)/)
    }
  })

  it('are all used somewhere', () => {
    const lessons = files.map((f) => readFileSync(join(dir, f), 'utf8')).join('\n')
    const elsewhere = [
      ...Object.values(dialects).flatMap((d) => d.sounds),
      ...allPhrases.flatMap((p) => (p.sound ? [p.sound] : [])),
      ...foodIds.flatMap((f) => (foods[f].sound ? [foods[f].sound] : [])),
    ]
    for (const id of soundIds) expect(elsewhere.includes(id) || lessons.includes(id), id).toBe(true)
  })
})

describe('dialect map', () => {
  it('draws every dialect, and every piece belongs to one', () => {
    const drawn = new Set(dialectPieces.map((p) => p.properties.id))
    for (const id of dialectIds) for (const piece of dialects[id].pieces) expect(drawn.has(piece), `${id} ${piece}`).toBe(true)
    const claimed = dialectIds.flatMap((id) => dialects[id].pieces)
    expect(new Set(claimed).size, 'no piece in two dialects').toBe(claimed.length)
    for (const piece of drawn) expect(claimed, piece).toContain(piece)
  })

  it('labels every dialect inside the frame, and plays only its own recordings', () => {
    for (const id of dialectIds) {
      const [lon, lat] = dialects[id].at
      expect(lon > 2.4 && lon < 7.3 && lat > 49.4 && lat < 53.6, id).toBe(true)
      for (const s of dialects[id].sounds) expect(soundIds, `${id} ${s}`).toContain(s)
    }
  })

  it('asks listening questions about recordings of the dialect they name', () => {
    for (const file of files) {
      const unit = Unit.parse(parse(readFileSync(join(dir, file), 'utf8')))
      for (const ex of unit.lessons.flatMap((l) => l.exercises))
        if (ex.type === 'listen') expect(dialects[ex.answer].sounds, `${unit.id} ${ex.sound}`).toContain(ex.sound)
    }
  })
})

describe('phrasebook', () => {
  it('has 100 phrases in ten sets of ten, none twice', () => {
    expect(phraseSetIds).toHaveLength(10)
    for (const id of phraseSetIds) expect(phraseSets[id].phrases, id).toHaveLength(10)
    const says = allPhrases.map((p) => `${p.set} ${p.say}`)
    expect(new Set(says).size).toBe(100)
    for (const p of allPhrases) expect(p.say && p.means, p.say).toBeTruthy()
  })
})

describe('language time map', () => {
  const { min, max, events, sites, labels, lines, areas = [] } = tonguesStory
  const pieces = new Set(dialectPieces.map((p) => p.properties.id))
  const inFrame = ([lon, lat]: [number, number]) => lon > 1.5 && lon < 8 && lat > 49.3 && lat < 53.7

  it('puts every area on a piece of the dialect map, and every site, line and label in the frame', () => {
    for (const a of areas) {
      expect(a.regions?.length ?? 0, a.name).toBeGreaterThan(0)
      for (const id of a.regions ?? []) expect(pieces.has(id), `${a.name} ${id}`).toBe(true)
    }
    for (const s of sites) expect(inFrame(s.at), s.name).toBe(true)
    for (const l of labels) expect(inFrame(l.at), l.text).toBe(true)
    for (const l of lines) for (const c of l.coords) expect(inFrame(c), l.name).toBe(true)
    expect(new Set(areas.map((a) => a.name)).size, 'area names are unique').toBe(areas.length)
  })

  it('tells its story in order, and every change on the map has a caption', () => {
    const starts = events.map((e) => e.from)
    expect(starts[0]).toBe(min)
    expect(starts[starts.length - 1]).toBe(max)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    for (const item of [...sites, ...labels, ...lines, ...areas]) {
      const name = 'name' in item ? item.name : item.text
      if (item.from > min) expect(starts, `${name} appears`).toContain(item.from)
      if (item.to !== undefined) expect(starts, `${name} goes`).toContain(item.to + 1)
    }
  })

  it('colours every piece but the new land once in every stage', () => {
    for (const { from } of events)
      for (const piece of pieces) {
        const on = areas.filter((a) => a.regions?.includes(piece) && a.from <= from && (a.to === undefined || from <= a.to))
        expect(on.length, `${piece} in ${from}`).toBe(piece === 'flevoland' ? 0 : 1)
      }
  })
})

describe('regional food map', () => {
  it('puts every food in the frame, with a photo of its own', () => {
    const photos = foodIds.flatMap((id) => (foods[id].photo ? [foods[id].photo] : []))
    expect(new Set(photos).size, 'no photo on two foods').toBe(photos.length)
    for (const id of foodIds) {
      const [lon, lat] = foods[id].at
      expect(lon > 2.4 && lon < 7.3 && lat > 49.4 && lat < 53.6, id).toBe(true)
      expect(foods[id].about.length, id).toBeGreaterThan(40)
    }
    // Marks of one kind closer than this are hard to tell apart on a phone.
    for (const a of foodIds)
      for (const b of foodIds)
        if (a < b && foods[a].kind === foods[b].kind) {
          const [x1, y1] = foods[a].at
          const [x2, y2] = foods[b].at
          expect(Math.hypot(x1 - x2, y1 - y2), `${a} and ${b} overlap`).toBeGreaterThan(0.08)
        }
  })

  it("asks taste-and-find questions with a photo that is the answer's, or no food's", () => {
    for (const file of files) {
      const unit = Unit.parse(parse(readFileSync(join(dir, file), 'utf8')))
      for (const ex of unit.lessons.flatMap((l) => l.exercises)) {
        if (ex.type !== 'taste') continue
        const owner = foodIds.find((id) => foods[id].photo === ex.photo)
        if (owner) expect(owner, `${unit.id} ${ex.photo}`).toBe(ex.answer)
        // The caption waits until the answer is checked, but the alt text is read out at once.
        const names = foods[ex.answer].place.split(/[ ,]+/).filter((w) => /^[A-Z’']/.test(w) && w.length > 3 && !['The', 'Every', 'Around'].includes(w))
        for (const n of names) expect(credits[ex.photo].alt, `${unit.id} ${ex.photo} alt names ${n}`).not.toContain(n)
      }
    }
  })
})

describe('calendar wheel', () => {
  it('puts every feast on real days, each with something to read', () => {
    for (const id of feastIds) {
      const [a, b] = spanOf(feasts[id])
      expect(a >= 1 && a <= b && b <= DAYS, id).toBe(true)
      // A moving feast spans no more than about six weeks, or it would not be on a calendar.
      expect(b - a, id).toBeLessThanOrEqual(45)
      expect(feasts[id].about.length, id).toBeGreaterThan(40)
    }
    const photos = feastIds.flatMap((id) => (feasts[id].photo ? [feasts[id].photo] : []))
    expect(new Set(photos).size, 'no photo on two feasts').toBe(photos.length)
  })

  it('counts days round the turn of the year', () => {
    expect(daysOff(feasts['new-year-dive'], DAYS)).toBe(1)
    expect(daysOff(feasts['new-years-eve'], 1)).toBe(1)
    expect(daysOff(feasts['carnival-binche'], 40)).toBe(0)
  })

  it("asks when-is-it questions with a photo whose alt text doesn't give the date", () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    for (const file of files) {
      const unit = Unit.parse(parse(readFileSync(join(dir, file), 'utf8')))
      for (const ex of unit.lessons.flatMap((l) => l.exercises)) {
        if (ex.type !== 'when') continue
        for (const m of months) expect(`${credits[ex.photo].alt} ${ex.prompt}`, `${unit.id} ${ex.photo} names ${m}`).not.toContain(m)
      }
    }
  })
})

describe('feast time map', () => {
  const { min, max, events, sites, labels, lines } = feastStory
  const inFrame = ([lon, lat]: [number, number]) => lon > 2.4 && lon < 7.3 && lat > 49.4 && lat < 53.6

  it('puts every mark and label in the frame, each named once', () => {
    for (const s of sites) expect(inFrame(s.at), s.name).toBe(true)
    for (const l of labels) expect(inFrame(l.at), l.text).toBe(true)
    expect(lines).toHaveLength(0)
    expect(new Set(sites.map((s) => s.name)).size, 'site names are unique').toBe(sites.length)
  })

  it('tells its story in order, and every change on the map has a caption', () => {
    const starts = events.map((e) => e.from)
    expect(starts[0]).toBe(min)
    expect(starts[starts.length - 1]).toBe(max)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    for (const item of [...sites, ...labels]) {
      const name = 'name' in item ? item.name : item.text
      if (item.from > min) expect(starts, `${name} appears`).toContain(item.from)
      if (item.to !== undefined) expect(starts, `${name} goes`).toContain(item.to + 1)
    }
  })
})

describe('sport time map', () => {
  const { min, max, events, sites, labels, lines } = sportStory
  const inFrame = ([lon, lat]: [number, number]) => lon > 2.4 && lon < 7.3 && lat > 49.4 && lat < 53.6

  it('puts every mark and label in the frame, each named once', () => {
    for (const s of sites) expect(inFrame(s.at), s.name).toBe(true)
    for (const l of labels) expect(inFrame(l.at), l.text).toBe(true)
    expect(lines).toHaveLength(0)
    expect(new Set(sites.map((s) => s.name)).size, 'site names are unique').toBe(sites.length)
  })

  it('tells its story in order, and every change on the map has a caption', () => {
    const starts = events.map((e) => e.from)
    expect(starts[0]).toBe(min)
    expect(starts[starts.length - 1]).toBe(max)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    for (const item of [...sites, ...labels]) {
      const name = 'name' in item ? item.name : item.text
      if (item.from > min) expect(starts, `${name} appears`).toContain(item.from)
      if (item.to !== undefined) expect(starts, `${name} goes`).toContain(item.to + 1)
    }
  })
})

describe('pop culture time map', () => {
  const { min, max, events, sites, labels, lines } = popStory
  const inFrame = ([lon, lat]: [number, number]) => lon > 2.4 && lon < 7.3 && lat > 49.4 && lat < 53.6

  it('puts every mark and label in the frame, each named once', () => {
    for (const s of sites) expect(inFrame(s.at), s.name).toBe(true)
    for (const l of labels) expect(inFrame(l.at), l.text).toBe(true)
    expect(lines).toHaveLength(0)
    expect(new Set(sites.map((s) => s.name)).size, 'site names are unique').toBe(sites.length)
  })

  it('tells its story in order, and every change on the map has a caption', () => {
    const starts = events.map((e) => e.from)
    expect(starts[0]).toBe(min)
    expect(starts[starts.length - 1]).toBe(max)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    for (const item of [...sites, ...labels]) {
      const name = 'name' in item ? item.name : item.text
      if (item.from > min) expect(starts, `${name} appears`).toContain(item.from)
      if (item.to !== undefined) expect(starts, `${name} goes`).toContain(item.to + 1)
    }
  })
})

describe('thinkers and scientists time map', () => {
  const { min, max, events, sites, labels, lines } = scienceStory
  const inFrame = ([lon, lat]: [number, number]) => lon > 2.4 && lon < 7.3 && lat > 49.4 && lat < 53.6

  it('puts every mark and label in the frame, each named once', () => {
    for (const s of sites) expect(inFrame(s.at), s.name).toBe(true)
    for (const l of lines) for (const p of l.coords) expect(inFrame(p), l.name).toBe(true)
    expect(new Set(sites.map((s) => s.name)).size, 'site names are unique').toBe(sites.length)
  })

  it('tells its story in order, and every change on the map has a caption', () => {
    const starts = events.map((e) => e.from)
    expect(starts[0]).toBe(min)
    expect(starts[starts.length - 1]).toBe(max)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    for (const item of [...sites, ...labels, ...lines]) {
      const name = 'name' in item ? item.name : item.text
      if (item.from > min) expect(starts, `${name} appears`).toContain(item.from)
      if (item.to !== undefined) expect(starts, `${name} goes`).toContain(item.to + 1)
      for (const [a, b] of item.off ?? []) expect(starts, `${name} closes and opens`).toEqual(expect.arrayContaining([a, b + 1]))
    }
  })
})

describe('state time map', () => {
  const { min, max, events, sites, labels, areas = [] } = stateStory
  const inFrame = ([lon, lat]: [number, number]) => lon > 2.4 && lon < 7.3 && lat > 49.4 && lat < 53.6

  it('puts every mark and label in the frame, each named once', () => {
    for (const s of sites) expect(inFrame(s.at), s.name).toBe(true)
    for (const l of labels) expect(inFrame(l.at), l.text).toBe(true)
    expect(new Set(sites.map((s) => s.name)).size, 'site names are unique').toBe(sites.length)
  })

  it('tells its story in order, and every change on the map has a caption', () => {
    const starts = events.map((e) => e.from)
    expect(starts[0]).toBe(min)
    expect(starts[starts.length - 1]).toBe(max)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    for (const item of [...sites, ...labels, ...areas]) {
      const name = 'text' in item ? item.text : item.name
      if (item.from > min) expect(starts, `${name} appears`).toContain(item.from)
      if (item.to !== undefined) expect(starts, `${name} goes`).toContain(item.to + 1)
    }
  })

  it('draws every province once in each year, from real province shapes', () => {
    for (const year of starts()) {
      const drawn = areas.filter((a) => activeAt(year, a) && a.kind !== 'sea' && a.kind !== 'outside').flatMap((a) => a.regions ?? [])
      for (const id of drawn) expect(regionIds.provinces.has(id), id).toBe(true)
      expect([...drawn].sort(), `${year}`).toEqual([...provinceIds].sort())
    }
  })
  function starts() {
    return events.map((e) => e.from)
  }
})

// The provinces of Unit 26: every one on the map, with a flag of its own, and the right count
// for each country.
describe('provinces', () => {
  it('match the provinces of the map, twelve Dutch and ten Belgian, and Brussels', () => {
    expect([...provinceIds].sort()).toEqual([...regionIds.provinces].sort())
    expect(provincesOf('NLD')).toHaveLength(12)
    expect(provincesOf('BEL')).toHaveLength(11)
    expect(provinceIds.filter((id) => provinces[id].part === 'brussels')).toEqual(['BE-BRU'])
  })

  it('each fly a credited flag of their own, with no name in its description', () => {
    const flags = provinceIds.map((id) => provinces[id].flag)
    expect(new Set(flags).size).toBe(flags.length)
    for (const id of provinceIds) {
      const p = provinces[id]
      expect(credits[p.flag], p.flag).toBeDefined()
      // The flag drill shows only the flag: its alt text must not name the province.
      expect(credits[p.flag].alt, p.flag).not.toContain(p.name.split(' ').pop()!)
    }
  })

  it('have their capitals inside the frame and real numbers', () => {
    for (const id of provinceIds) {
      const [lon, lat] = provinces[id].at
      expect(lon > 2.4 && lon < 7.3 && lat > 49.4 && lat < 53.6, id).toBe(true)
      expect(provinces[id].pop, id).toBeGreaterThan(200_000)
      expect(provinces[id].area, id).toBeGreaterThan(150)
    }
  })
})

describe('seat charts', () => {
  it('fill exactly 150 seats, and name the government that was formed', () => {
    for (const id of chamberIds) {
      const c = chambers[id]
      expect(c.parties.reduce((n, p) => n + p.seats, 0), id).toBe(SEATS)
      expect(new Set(c.parties.map((p) => p.name)).size, id).toBe(c.parties.length)
      expect(cabinetSeats(c), id).toBeGreaterThan(0)
    }
    // The Jetten cabinet is a minority; the De Wever government has a majority.
    expect(cabinetSeats(chambers['tk-2025'])).toBe(66)
    expect(cabinetSeats(chambers['be-2024'])).toBe(82)
    expect(cabinetSeats(chambers['be-2024'])).toBeGreaterThanOrEqual(MAJORITY)
  })
})

// The projection explorer (Unit 25): a shape's drawn outline must match its real size, or the
// true-size questions would teach a wrong answer. World-atlas outlines are coarse, so allow 6%.
describe('projection explorer', () => {
  it('draws every country at its real size', () => {
    for (const id of shapeIds) {
      const ratio = areaOf(shapes[id].feature) / shapes[id].area
      expect(Math.abs(ratio - 1), `${id} drawn at ${ratio.toFixed(3)} of its real size`).toBeLessThan(0.06)
    }
  })

  it('makes a rhumb line longer than the great circle between the same ports', () => {
    for (const c of Object.values(courses)) {
      const r = rhumb(c.from.at, c.to.at)
      expect(r.km).toBeGreaterThan(greatCircleKm(c.from.at, c.to.at))
    }
  })
})

// Comic panels (Unit 24): every box cut from a picture lies inside it, and a strip never shows the
// same cut twice. A balloon question's panels are told apart by their pictures, so no two share one.
describe('comic panels', () => {
  const all = files.flatMap((f) => Unit.parse(parse(readFileSync(join(dir, f), 'utf8'))).lessons.flatMap((l) => l.exercises.map((e) => ({ id: l.id, e }))))
  const strips = all.flatMap(({ id, e }) => {
    const out: { id: string; panels: Extract<Exercise, { type: 'panels' }>['panels']; order?: boolean }[] = []
    if (e.type === 'panels') out.push({ id, panels: e.panels, order: e.order })
    const v = 'visual' in e ? e.visual : undefined
    if (v?.kind === 'strip') out.push({ id, panels: v.panels })
    return out
  })

  it('cut every panel from inside its picture, each cut once', () => {
    expect(strips.length).toBeGreaterThan(0)
    for (const { id, panels } of strips) {
      for (const { box } of panels)
        if (box) {
          const [x, y, w, h] = box
          expect(x >= 0 && y >= 0 && w > 0.05 && h > 0.05 && x + w <= 1.0001 && y + h <= 1.0001, `${id} panel box inside the picture`).toBe(true)
        }
      const cuts = panels.map((p) => `${p.photo} ${p.box ?? 'whole'}`)
      expect(new Set(cuts).size, `${id} panels differ`).toBe(cuts.length)
    }
  })

  it('keep the answer out of the pictures’ captions and descriptions on a balloon question', () => {
    for (const { e } of all) {
      if (e.type !== 'panels' || e.order) continue
      const alts = e.panels.map((p) => credits[p.photo].alt)
      // A balloon's own words should not be printed under the picture it belongs to.
      e.panels.forEach((p, i) => expect(alts[i].toLowerCase(), p.say).not.toContain(p.say.toLowerCase()))
    }
  })
})

describe('route maps', () => {
  it('draw every place and bend inside the frame, and every place is on the route', () => {
    for (const [id, r] of Object.entries(raceRoutes)) {
      const [[w, s], [e, n]] = r.bounds!
      const inside = ([lon, lat]: [number, number]) => lon > w && lon < e && lat > s && lat < n
      for (const p of Object.values(r.places)) expect(inside(p.at), `${id} ${p.name}`).toBe(true)
      for (const l of r.labels) expect(inside(l.at), `${id} ${l.text}`).toBe(true)
      for (const step of r.path) {
        expect(r.places, `${id} ${step.place}`).toHaveProperty(step.place)
        for (const v of step.via ?? []) expect(inside(v), `${id} via ${v}`).toBe(true)
      }
      expect(new Set(r.path.map((s) => s.place)), `${id} visits every place`).toEqual(new Set(Object.keys(r.places)))
    }
  })

  it('count the km one way, in order, and climbs have real gradients', () => {
    for (const [id, r] of Object.entries(raceRoutes)) {
      const km = r.path.flatMap((s) => (s.km === undefined ? [] : [s.km]))
      const sorted = [...km].sort((a, b) => (r.km === 'to-finish' ? b - a : a - b))
      expect(km, id).toEqual(sorted)
      for (const p of Object.values(r.places)) {
        if (!p.climb) continue
        expect(p.climb.avg, `${id} ${p.name}`).toBeLessThan(p.climb.max)
        expect(p.climb.max, `${id} ${p.name}`).toBeLessThanOrEqual(25)
        expect(p.climb.cobbles ?? 0, `${id} ${p.name}`).toBeLessThanOrEqual(p.climb.m)
      }
    }
  })
})

describe('food time map', () => {
  const { min, max, events, sites, labels, lines } = foodStory
  const inFrame = ([lon, lat]: [number, number]) => lon > 2.4 && lon < 7.3 && lat > 49.4 && lat < 53.6

  it('puts every mark and label in the frame, each named once', () => {
    for (const s of sites) expect(inFrame(s.at), s.name).toBe(true)
    for (const l of labels) expect(inFrame(l.at), l.text).toBe(true)
    expect(lines).toHaveLength(0)
    expect(new Set(sites.map((s) => s.name)).size, 'site names are unique').toBe(sites.length)
  })

  it('tells its story in order, and every change on the map has a caption', () => {
    const starts = events.map((e) => e.from)
    expect(starts[0]).toBe(min)
    expect(starts[starts.length - 1]).toBe(max)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    for (const item of [...sites, ...labels]) {
      const name = 'name' in item ? item.name : item.text
      if (item.from > min) expect(starts, `${name} appears`).toContain(item.from)
      if (item.to !== undefined) expect(starts, `${name} goes`).toContain(item.to + 1)
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
  const stories = {
    water: waterStory,
    roman: romanStory,
    burgundy: burgundyStory,
    revolt: revoltStory,
    amsterdam: amsterdamStory,
    spanish: spanishStory,
    empire: empireStory,
    borders: bordersStory,
    kingdom: kingdomStory,
    rails: railsStory,
    occupation: occupationStory,
    delta: deltaStory,
    industry: industryStory,
    congo: congoStory,
    greatwar: greatWarStory,
    westhoek: westhoekStory,
    language: languageStory,
    painters: paintersStory,
    masters: mastersStory,
    moderns: modernsStory,
    buildings: buildingsStory,
    tongues: tonguesStory,
    food: foodStory,
    feasts: feastStory,
    sport: sportStory,
    pop: popStory,
    science: scienceStory,
    state: stateStory,
  }
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
    kingdom: [kingdomStory.min, kingdomStory.max],
    rails: [railsStory.min, railsStory.max],
    occupation: [occupationStory.min, occupationStory.max],
    delta: [deltaStory.min, deltaStory.max],
    industry: [industryStory.min, industryStory.max],
    congo: [congoStory.min, congoStory.max],
    greatwar: [greatWarStory.min, greatWarStory.max],
    westhoek: [westhoekStory.min, westhoekStory.max],
    language: [languageStory.min, languageStory.max],
    painters: [paintersStory.min, paintersStory.max],
    masters: [mastersStory.min, mastersStory.max],
    moderns: [modernsStory.min, modernsStory.max],
    buildings: [buildingsStory.min, buildingsStory.max],
    tongues: [tonguesStory.min, tonguesStory.max],
    food: [foodStory.min, foodStory.max],
    feasts: [feastStory.min, feastStory.max],
    sport: [sportStory.min, sportStory.max],
    pop: [popStory.min, popStory.max],
    science: [scienceStory.min, scienceStory.max],
    state: [stateStory.min, stateStory.max],
  }

  it('open at years inside their slider', () => {
    expect(Object.keys(range)).toEqual([...timeMaps])
    for (const file of files) {
      const unit = Unit.parse(parse(readFileSync(join(dir, file), 'utf8')))
      for (const ex of unit.lessons.flatMap((l) => l.exercises)) {
        const v = 'visual' in ex ? ex.visual : undefined
        // A before-and-after map compares two different stages of its story.
        if (v?.kind === 'compare') {
          const [lo, hi] = range[v.map]
          const [a, b] = v.years
          expect(lo <= a && b <= hi, `${unit.id} ${v.map} ${a} to ${b}`).toBe(true)
          const story = stories[v.map]
          expect(eventAt(story.events, a).from, `${unit.id} ${v.map} compares one stage with itself`).not.toBe(eventAt(story.events, b).from)
        }
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
  ['one kingdom, then two', kingdomStory],
  ['railways and canals', railsStory],
  ['occupation and liberation', occupationStory],
  ['flood and Delta Works', deltaStory],
  ['railways and coal', industryStory],
  ['Belgium in the First World War', greatWarStory],
])('%s time map', (_, story) => {
  const { min, max, events, sites, labels, lines, areas = [] } = story
  const inFrame = ([lon, lat]: [number, number]) => lon > 1.5 && lon < 8 && lat > 49.3 && lat < 53.7

  it('has areas, sites and labels on real regions and coordinates', () => {
    for (const a of areas) {
      // Land is drawn with provinces; a lake pumped dry (the Haarlemmermeer) has a shape.
      expect((a.regions?.length ?? 0) + (a.shape?.length ?? 0), a.name).toBeGreaterThan(0)
      for (const c of a.shape ?? []) expect(inFrame(c), `${a.name} ${c}`).toBe(true)
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

describe('Congo map', () => {
  const { min, max, events, sites, labels, lines, areas = [] } = congoStory
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countries = new Set((feature(congoTopology as any, (congoTopology as any).objects.countries) as any).features.map((f: any) => f.properties.id))
  // The Congo basin, from the Atlantic to the great lakes.
  const inAfrica = ([lon, lat]: [number, number]) => lon > 11 && lon < 32 && lat > -15 && lat < 6

  it('puts every area, line, site and label on the Central Africa map', () => {
    for (const a of areas) {
      expect(a.regions?.length ?? 0, a.name).toBeGreaterThan(0)
      for (const id of a.regions ?? []) expect(countries.has(id), `${a.name} ${id}`).toBe(true)
      for (const c of a.clip ?? []) expect(inAfrica(c), `${a.name} ${c}`).toBe(true)
    }
    for (const l of lines) for (const c of l.coords) expect(inAfrica(c), `${l.name} ${c}`).toBe(true)
    for (const s of sites) expect(inAfrica(s.at), s.name).toBe(true)
    for (const l of labels) expect(inAfrica(l.at), l.text).toBe(true)
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
      if (item.to !== undefined) expect(starts, `${name} goes`).toContain(item.to + 1)
    }
  })
})

describe('Westhoek front map', () => {
  const { min, max, events, sites, labels, lines, areas = [] } = westhoekStory
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countries = new Set((feature(westhoekTopology as any, (westhoekTopology as any).objects.countries) as any).features.map((f: any) => f.properties.id))
  // The Westhoek, from the coast at Nieuwpoort to Armentières; the land behind the
  // front reaches out past the edge of the map.
  const inWesthoek = ([lon, lat]: [number, number]) => lon > 2.5 && lon < 3.15 && lat > 50.65 && lat < 51.2
  const inReach = ([lon, lat]: [number, number]) => lon > 2.3 && lon < 3.6 && lat > 50.4 && lat < 51.4

  it('puts every front, site and label in the Westhoek', () => {
    for (const a of areas) {
      for (const id of a.regions ?? []) expect(countries.has(id), `${a.name} ${id}`).toBe(true)
      for (const c of [...(a.clip ?? []), ...(a.shape ?? [])]) expect(inReach(c), `${a.name} ${c}`).toBe(true)
    }
    for (const l of lines) for (const c of l.coords) expect(inWesthoek(c), `${l.name} ${c}`).toBe(true)
    for (const s of sites) expect(inWesthoek(s.at), s.name).toBe(true)
    for (const l of labels) expect(inWesthoek(l.at), l.text).toBe(true)
    expect(new Set(areas.map((a) => a.name)).size, 'area names are unique').toBe(areas.length)
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
      if (item.to !== undefined) expect(starts, `${name} goes`).toContain(item.to + 1)
    }
  })

  it('has one front line at a time around Ypres, and the graves stay once dug', () => {
    for (const e of events) {
      const fronts = lines.filter((l) => l.kind === 'front' && l.from <= e.from && (l.to === undefined || e.from <= l.to))
      if (e.from < max - 1) expect(fronts.length, e.title).toBeGreaterThan(0)
    }
    for (const s of sites.filter((s) => s.kind === 'grave' || s.kind === 'memorial')) expect(s.to, s.name).toBeUndefined()
  })
})

describe('language map', () => {
  const { min, max, events, sites, labels, lines, areas = [] } = languageStory
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parts = new Set((feature(belgiumTopology as any, (belgiumTopology as any).objects.parts) as any).features.map((f: any) => f.properties.id))
  const inBelgium = ([lon, lat]: [number, number]) => lon > 2.4 && lon < 6.5 && lat > 49.4 && lat < 51.7
  const kindAt = (year: number, part: string) =>
    areas.filter((a) => a.kind !== 'bhv' && a.regions?.includes(part) && a.from <= year && (a.to === undefined || year <= a.to)).map((a) => a.kind)

  it('puts every area on a piece of the municipal map, and every site and label in Belgium', () => {
    for (const a of areas) {
      expect(a.regions?.length ?? 0, a.name).toBeGreaterThan(0)
      for (const id of a.regions ?? []) expect(parts.has(id), `${a.name} ${id}`).toBe(true)
    }
    expect(lines).toHaveLength(0)
    for (const s of sites) expect(inBelgium(s.at), s.name).toBe(true)
    for (const l of labels) expect(inBelgium(l.at), l.text).toBe(true)
    expect(new Set(areas.map((a) => a.name)).size, 'area names are unique').toBe(areas.length)
  })

  it('tells its story in order, and every change on the map has a caption', () => {
    const starts = events.map((e) => e.from)
    expect(starts[0]).toBe(min)
    expect(starts[starts.length - 1]).toBe(max)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    for (const item of [...sites, ...labels, ...areas]) {
      const name = 'name' in item ? item.name : item.text
      if (item.from > min) expect(starts, `${name} appears`).toContain(item.from)
      if (item.to !== undefined) expect(starts, `${name} goes`).toContain(item.to + 1)
    }
  })

  it('colours every piece of Belgium in every stage, and moves the right ones', () => {
    for (const { from } of events)
      for (const part of parts) expect(kindAt(from, part as string).length, `${part} in ${from}`).toBeGreaterThan(0)
    expect(kindAt(1919, 'east-cantons')).toEqual(['abroad'])
    expect(kindAt(1920, 'east-cantons')).toEqual(['german'])
    expect(kindAt(1932, 'brussels')).toContain('bilingual')
    expect(kindAt(1932, 'brussels-1954')).toEqual(['dutch'])
    expect(kindAt(1954, 'brussels-1954')).toContain('bilingual')
    expect(kindAt(1954, 'rand-1954')).toContain('facility')
    expect(kindAt(1954, 'rand-1963')).toEqual(['dutch'])
    expect(kindAt(1963, 'rand-1963')).toContain('facility')
    expect(kindAt(2012, 'voeren')).toEqual(['dutch'])
    // Brussels-Halle-Vilvoorde votes as one district from 1963 until the split of 2012.
    const bhv = areas.find((a) => a.kind === 'bhv')!
    expect([bhv.from, bhv.to]).toEqual([1963, 2011])
  })
})

describe("painters' map", () => {
  const { min, max, events, sites, labels, lines } = paintersStory
  const [[w, s], [e, n]] = paintersStory.bounds!
  const inFrame = ([lon, lat]: [number, number]) => lon >= w && lon <= e && lat >= s && lat <= n

  it('puts every workshop, market, route and label inside its frame', () => {
    for (const site of sites) expect(inFrame(site.at), site.name).toBe(true)
    for (const l of labels) expect(inFrame(l.at), l.text).toBe(true)
    for (const l of lines) for (const c of l.coords) expect(inFrame(c), `${l.name} ${c}`).toBe(true)
  })

  it('tells its story in order, and every change on the map has a caption', () => {
    const starts = events.map((ev) => ev.from)
    expect(starts[0]).toBe(min)
    expect(starts[starts.length - 1]).toBe(max)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    for (const item of [...sites, ...labels, ...lines]) {
      const name = 'name' in item ? item.name : item.text
      if (item.from > min) expect(starts, `${name} appears`).toContain(item.from)
      if (item.to !== undefined && item.to < max) expect(starts, `${name} goes`).toContain(item.to + 1)
      for (const [a, b] of item.off ?? []) {
        expect(starts, `${name} leaves`).toContain(a)
        expect(starts, `${name} returns`).toContain(b + 1)
      }
    }
  })

  it('never has one painter in two towns at once', () => {
    for (const { from } of events) {
      const at = sites.filter((st) => st.kind === 'workshop' && activeAt(from, st)).map((st) => st.name)
      expect(new Set(at).size, `${from}: ${at.join(', ')}`).toBe(at.length)
    }
  })
})

describe("Golden Age painters' map", () => {
  const { min, max, events, sites, labels, lines } = mastersStory
  const [[w, s], [e, n]] = mastersStory.bounds!
  const inFrame = ([lon, lat]: [number, number]) => lon >= w && lon <= e && lat >= s && lat <= n

  it('puts every workshop, market, route and label inside its frame', () => {
    for (const site of sites) expect(inFrame(site.at), site.name).toBe(true)
    for (const l of labels) expect(inFrame(l.at), l.text).toBe(true)
    for (const l of lines) for (const c of l.coords) expect(inFrame(c), `${l.name} ${c}`).toBe(true)
  })

  it('tells its story in order, and every change on the map has a caption', () => {
    const starts = events.map((ev) => ev.from)
    expect(starts[0]).toBe(min)
    expect(starts[starts.length - 1]).toBe(max)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    for (const item of [...sites, ...labels, ...lines]) {
      const name = 'name' in item ? item.name : item.text
      if (item.from > min) expect(starts, `${name} appears`).toContain(item.from)
      if (item.to !== undefined && item.to < max) expect(starts, `${name} goes`).toContain(item.to + 1)
      for (const [a, b] of item.off ?? []) {
        expect(starts, `${name} leaves`).toContain(a)
        expect(starts, `${name} returns`).toContain(b + 1)
      }
    }
  })

  it('never has one painter in two towns at once', () => {
    for (const { from } of events) {
      const at = sites.filter((st) => st.kind === 'workshop' && activeAt(from, st)).map((st) => st.name)
      expect(new Set(at).size, `${from}: ${at.join(', ')}`).toBe(at.length)
    }
  })
})

describe("modern artists' map", () => {
  const { min, max, events, sites, labels, lines } = modernsStory
  const [[w, s], [e, n]] = modernsStory.bounds!
  const inFrame = ([lon, lat]: [number, number]) => lon >= w && lon <= e && lat >= s && lat <= n

  it('puts every workshop, society, village, museum, route and label inside its frame', () => {
    for (const site of sites) expect(inFrame(site.at), site.name).toBe(true)
    for (const l of labels) expect(inFrame(l.at), l.text).toBe(true)
    for (const l of lines) for (const c of l.coords) expect(inFrame(c), `${l.name} ${c}`).toBe(true)
  })

  it('tells its story in order, and every change on the map has a caption', () => {
    const starts = events.map((ev) => ev.from)
    expect(starts[0]).toBe(min)
    expect(starts[starts.length - 1]).toBe(max)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    for (const item of [...sites, ...labels, ...lines]) {
      const name = 'name' in item ? item.name : item.text
      if (item.from > min) expect(starts, `${name} appears`).toContain(item.from)
      if (item.to !== undefined && item.to < max) expect(starts, `${name} goes`).toContain(item.to + 1)
      for (const [a, b] of item.off ?? []) {
        expect(starts, `${name} leaves`).toContain(a)
        expect(starts, `${name} returns`).toContain(b + 1)
      }
    }
  })

  it('never has one artist in two towns at once', () => {
    for (const { from } of events) {
      const at = sites.filter((st) => st.kind === 'workshop' && activeAt(from, st)).map((st) => st.name)
      expect(new Set(at).size, `${from}: ${at.join(', ')}`).toBe(at.length)
    }
  })
})

describe('buildings map', () => {
  const { min, max, events, sites, labels } = buildingsStory
  const [[w, s], [e, n]] = buildingsStory.bounds!
  const inFrame = ([lon, lat]: [number, number]) => lon >= w && lon <= e && lat >= s && lat <= n

  it('puts every building and label inside its frame', () => {
    for (const site of sites) expect(inFrame(site.at), site.name).toBe(true)
    for (const l of labels) expect(inFrame(l.at), l.text).toBe(true)
  })

  it('tells its story in order, and every change on the map has a caption', () => {
    const starts = events.map((ev) => ev.from)
    expect(starts[0]).toBe(min)
    expect(starts[starts.length - 1]).toBe(max)
    expect([...starts].sort((a, b) => a - b)).toEqual(starts)
    expect(new Set(starts).size).toBe(starts.length)
    for (const item of [...sites, ...labels]) {
      const name = 'name' in item ? item.name : item.text
      if (item.from > min) expect(starts, `${name} appears`).toContain(item.from)
      if (item.to !== undefined && item.to < max) expect(starts, `${name} goes`).toContain(item.to + 1)
      for (const [a, b] of item.off ?? []) {
        expect(starts, `${name} leaves`).toContain(a)
        expect(starts, `${name} returns`).toContain(b + 1)
      }
    }
  })

  it('names each building once', () => {
    const names = sites.map((st) => st.name)
    expect(new Set(names).size).toBe(names.length)
  })
})

describe('building fronts', () => {
  it('name their parts on hotspots inside the photo, each zooming to a box around it', () => {
    for (const [id, f] of Object.entries(facades)) {
      expect(photoIds, id).toContain(f.photo)
      const ids = f.spots.map((s) => s.id)
      expect(new Set(ids).size, `${id} spot ids`).toBe(ids.length)
      expect(ids.length, `${id} spots`).toBeGreaterThanOrEqual(4)
      for (const { id: spot, at: [px, py], box: [x, y, bw, bh] } of f.spots) {
        expect(x >= 0 && y >= 0 && bw > 0 && bh > 0 && x + bw <= 1.0001 && y + bh <= 1.0001, `${id} ${spot} box inside the photo`).toBe(true)
        expect(px >= x && px <= x + bw && py >= y && py <= y + bh, `${id} ${spot} hotspot inside its box`).toBe(true)
      }
    }
  })
})

describe('label the parts', () => {
  it('puts every spot inside the picture, apart from the others', () => {
    for (const file of files) {
      const unit = Unit.parse(parse(readFileSync(join(dir, file), 'utf8')))
      for (const ex of unit.lessons.flatMap((l) => l.exercises)) {
        if (ex.type !== 'label') continue
        for (const { at: [x, y], label } of ex.spots) expect(x > 0 && x < 1 && y > 0 && y < 1, label).toBe(true)
        // Spots closer than this are hard to tap apart.
        for (const a of ex.spots)
          for (const b of ex.spots)
            if (a !== b) expect(Math.hypot(a.at[0] - b.at[0], a.at[1] - b.at[1]), `${a.label} and ${b.label}`).toBeGreaterThan(0.08)
      }
    }
  })
})

describe("painters' roads", () => {
  it("step through a painter's pictures with a year and a word on each", () => {
    for (const [id, s] of Object.entries(series)) {
      expect(s.steps.length, id).toBeGreaterThanOrEqual(4)
      expect(new Set(s.steps.map((st) => st.photo)).size, id).toBe(s.steps.length)
      for (const st of s.steps) expect(st.year && st.title && st.text, `${id} ${st.photo}`).toBeTruthy()
    }
  })
})

describe('style sorters', () => {
  it('zoom to a tell inside each painting, and use each painting once', () => {
    for (const file of files) {
      const unit = Unit.parse(parse(readFileSync(join(dir, file), 'utf8')))
      for (const ex of unit.lessons.flatMap((l) => l.exercises)) {
        if (ex.type !== 'style') continue
        expect(new Set(ex.items.map((i) => i.photo)).size, ex.prompt).toBe(ex.items.length)
        for (const { box: [x, y, w, h], title } of ex.items) {
          expect(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 1.0001 && y + h <= 1.0001, title).toBe(true)
        }
      }
    }
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
