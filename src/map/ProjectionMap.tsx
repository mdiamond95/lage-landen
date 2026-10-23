import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { geoCircle, geoEqualEarth, geoGraticule, geoMercator, geoOrthographic, geoPath, type GeoProjection } from 'd3-geo'
import {
  courses,
  greatCircleKm,
  mercatorStretch,
  moveShape,
  rhumb,
  rhumbLine,
  shapes as allShapes,
  world,
  EARTH_R,
  type CourseId,
  type ShapeId,
} from '../data/projections'
import { t, type Key } from '../i18n'

export type View = 'mercator' | 'equal' | 'globe'

const W = 600
const H = 420
// Mercator's map can't reach the poles, which lie infinitely far up and down; this one runs from
// 62° south (Cape Horn is 56°) to 84° north, just past Greenland.
const NORTH = 84
const SOUTH = -62

const psi = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
const mercatorScale = W / (2 * Math.PI)
const mercatorHeight = Math.round(mercatorScale * (psi(NORTH) - psi(SOUTH)))

const makeProjection = (view: View, turn: [number, number]): GeoProjection => {
  if (view === 'mercator')
    return geoMercator()
      .scale(mercatorScale)
      .translate([W / 2, (H - mercatorHeight) / 2 + mercatorScale * psi(NORTH)])
      .clipExtent([
        [0, (H - mercatorHeight) / 2],
        [W, (H + mercatorHeight) / 2],
      ])
  if (view === 'equal')
    return geoEqualEarth().fitExtent(
      [
        [10, 10],
        [W - 10, H - 10],
      ],
      { type: 'Sphere' },
    )
  return geoOrthographic()
    .rotate([turn[0], turn[1]])
    .fitExtent(
      [
        [W / 2 - H / 2 + 10, 10],
        [W / 2 + H / 2 - 10, H - 10],
      ],
      { type: 'Sphere' },
    )
}

export const viewNames: Record<View, { name: Key; about: string }> = {
  mercator: {
    name: 'Mercator, 1569',
    about: 'Every steady compass course is a straight line, so sailors could steer by it. The price: land is stretched more the further it lies from the equator.',
  },
  equal: {
    name: 'Equal area',
    about: 'The Equal Earth map of 2018 draws every country at its true size, but bends their shapes towards the edges.',
  },
  globe: {
    name: 'Globe',
    about: 'Only a globe keeps true sizes and true shapes, but it shows half the world at a time. Drag the sea to turn it.',
  },
}

const graticule = geoGraticule().step([30, 30])()
const equator = { type: 'LineString' as const, coordinates: Array.from({ length: 73 }, (_, i) => [-180 + i * 5, 0]) }
// Circles all 6° across, Tissot's way of showing what a map does to size: on Mercator's map they
// swell towards the poles; on the equal-area map they stay the same size and squash instead.
const circles = [-60, -30, 0, 30, 60].flatMap((lat) =>
  Array.from({ length: 12 }, (_, i) => geoCircle().center([-165 + i * 30, lat]).radius(3)()),
)

export const km2 = (a: number) =>
  a >= 1e6 ? `${(a / 1e6).toFixed(a >= 1e7 ? 0 : 1)} million km²` : `${(Math.round(a / 1000) * 1000).toLocaleString('en-CA')} km²`

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

type Props = {
  view?: View
  // Hides the buttons that change the map (a question keeps to Mercator until it is checked).
  fixed?: boolean
  shapes?: ShapeId[]
  course?: CourseId
  circles?: boolean
  // Shows each shape's true size and how big this map draws it.
  sizes?: boolean
  // Shapes picked in a question, outlined.
  picked?: ShapeId
  label?: string
}

// The projection explorer (Unit 25): the world on Mercator's map, an equal-area map or a globe.
// Countries can be dragged (or moved with the arrow keys) to another latitude, where they keep
// their true size on the globe but swell or shrink on Mercator's map; circles of one size show the
// stretch everywhere at once, and a course from Amsterdam can be drawn as a steady compass course
// and as the shortest way.
export function ProjectionMap({ view: start = 'mercator', fixed = false, shapes = [], course, circles: showCircles = false, sizes = true, picked, label }: Props) {
  const [view, setView] = useState<View>(start)
  const [turn, setTurn] = useState<[number, number]>([30, -35])
  const [rings, setRings] = useState(showCircles)
  const [courseOn, setCourseOn] = useState(course !== undefined)
  const [at, setAt] = useState<Partial<Record<ShapeId, [number, number]>>>({})
  const svg = useRef<SVGSVGElement>(null)
  const drag = useRef<{ id?: ShapeId; from: [number, number]; centre: [number, number]; x: number; y: number; turn: [number, number] } | null>(null)

  const projection = useMemo(() => makeProjection(view, turn), [view, turn])
  const path = useMemo(() => geoPath(projection), [projection])
  const land = useMemo(() => path(world) ?? '', [path])
  // km² of the Earth per square unit of the map, where the map is true to size: at the equator on
  // Mercator's map, everywhere on the equal-area map.
  const perUnit = useMemo(() => {
    if (view === 'mercator') return (EARTH_R / mercatorScale) ** 2
    return (4 * Math.PI * EARTH_R * EARTH_R) / path.area({ type: 'Sphere' })
  }, [view, path])

  const centreOf = (id: ShapeId) => at[id] ?? allShapes[id].centre
  const placed = shapes.map((id) => ({ id, shape: allShapes[id], feature: at[id] ? moveShape(allShapes[id], at[id]!) : allShapes[id].feature }))
  const moved = shapes.some((id) => at[id])

  const pointer = (e: PointerEvent): [number, number] => {
    const m = svg.current!.getScreenCTM()!.inverse()
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m)
    return [p.x, p.y]
  }

  const moveTo = (id: ShapeId, c: [number, number]) => setAt((a) => ({ ...a, [id]: [clamp(c[0], -170, 170), clamp(c[1], -55, 75)] }))

  const down = (e: PointerEvent, id?: ShapeId) => {
    const [x, y] = pointer(e)
    const lonLat = projection.invert?.([x, y])
    if (id && !lonLat) return
    drag.current = { id, from: lonLat ? [lonLat[0], lonLat[1]] : [0, 0], centre: id ? centreOf(id) : [0, 0], x, y, turn }
    svg.current?.setPointerCapture(e.pointerId)
    e.stopPropagation()
  }
  const move = (e: PointerEvent) => {
    const d = drag.current
    if (!d) return
    const [x, y] = pointer(e)
    if (d.id) {
      const p = projection.invert?.([x, y])
      if (!p || Number.isNaN(p[0])) return
      moveTo(d.id, [d.centre[0] + p[0] - d.from[0], d.centre[1] + p[1] - d.from[1]])
    } else if (view === 'globe') {
      setTurn([d.turn[0] + (x - d.x) * 0.4, clamp(d.turn[1] - (y - d.y) * 0.4, -80, 80)])
    }
  }
  const up = () => {
    drag.current = null
  }
  const key = (e: KeyboardEvent, id: ShapeId) => {
    const step: Record<string, [number, number]> = { ArrowUp: [0, 3], ArrowDown: [0, -3], ArrowLeft: [-3, 0], ArrowRight: [3, 0] }
    const s = step[e.key]
    if (!s) return
    e.preventDefault()
    const c = centreOf(id)
    moveTo(id, [c[0] + s[0], c[1] + s[1]])
  }

  const trip = course ? courses[course] : undefined
  const tripLine = trip ? rhumbLine(trip.from.at as [number, number], trip.to.at as [number, number]) : []
  const tripStats = trip ? { ...rhumb(trip.from.at as [number, number], trip.to.at as [number, number]), shortest: greatCircleKm(trip.from.at as [number, number], trip.to.at as [number, number]) } : undefined

  return (
    <figure className={`projection-map projection-${view}`} data-view={view}>
      {!fixed && (
        <div className="projection-views" role="group" aria-label={t('Map projection')}>
          {(Object.keys(viewNames) as View[]).map((v) => (
            <button key={v} type="button" className={`btn-small${v === view ? ' is-on' : ''}`} aria-pressed={v === view} data-view={v} onClick={() => setView(v)}>
              {t(viewNames[v].name)}
            </button>
          ))}
        </div>
      )}
      <div className="map-frame">
        <svg
          ref={svg}
          className="projection-svg"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={label ?? t('The world on {view}', { view: t(viewNames[view].name) })}
          onPointerDown={(e) => view === 'globe' && down(e)}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        >
          <rect width={W} height={H} className="projection-paper" />
          <path d={path({ type: 'Sphere' }) ?? ''} className="sea projection-sea" />
          <path d={path(graticule) ?? ''} className="projection-grid" />
          <path d={path(equator) ?? ''} className="projection-equator" />
          <path d={land} className="land projection-land" />
          {rings && <path d={circles.map((c) => path(c) ?? '').join('')} className="projection-circle" />}
          {trip && courseOn && (
            <g className="projection-course">
              <path d={path({ type: 'LineString', coordinates: tripLine }) ?? ''} className="course-rhumb" />
              <path d={path({ type: 'LineString', coordinates: [trip.from.at, trip.to.at] }) ?? ''} className="course-great" />
              {[trip.from, trip.to].map((p) => {
                const xy = projection(p.at as [number, number])
                return (
                  xy && (
                    <g key={p.name} transform={`translate(${xy[0]},${xy[1]})`}>
                      <circle r={4} className="course-port" />
                      <text y={-8} textAnchor="middle" className="projection-label">
                        {p.name}
                      </text>
                    </g>
                  )
                )
              })}
            </g>
          )}
          {placed.map(({ id, shape, feature }, i) => {
            const d = path(feature) ?? ''
            const c = path.centroid(feature)
            return (
              <g key={id} className={`projection-shape shape-${i}${picked === id ? ' is-picked' : ''}`} data-shape={id}>
                <path
                  d={d}
                  role="button"
                  tabIndex={0}
                  aria-label={t('{name}: drag it, or move it with the arrow keys', { name: shape.name })}
                  onPointerDown={(e) => down(e, id)}
                  onKeyDown={(e) => key(e, id)}
                />
                {d && !Number.isNaN(c[0]) && (
                  <text x={c[0]} y={c[1]} textAnchor="middle" className="projection-label shape-name">
                    {shape.name}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
      <figcaption className="projection-caption">
        <p className="projection-about" lang="en-CA">{viewNames[view].about}</p>
        <div className="projection-toggles">
          <label>
            <input type="checkbox" checked={rings} onChange={(e) => setRings(e.target.checked)} /> {t('Circles of one size')}
          </label>
          {trip && (
            <label>
              <input type="checkbox" checked={courseOn} onChange={(e) => setCourseOn(e.target.checked)} /> {t('Course to {place}', { place: trip.to.name })}
            </label>
          )}
          {moved && (
            <button type="button" className="btn-small" onClick={() => setAt({})}>
              {t('Put back')}
            </button>
          )}
        </div>
        {shapes.length > 0 && (
          <ul className="projection-sizes" aria-live="polite" lang="en-CA">
            {placed.map(({ id, shape, feature }, i) => {
              const lat = centreOf(id)[1]
              const drawn = path.area(feature) * perUnit
              return (
                <li key={id} data-shape={id}>
                  <span className={`key-swatch shape-swatch shape-${i}`} />
                  <strong>{shape.name}</strong>
                  {shape.about && <span className="muted"> ({shape.about})</span>}
                  {sizes && (
                    <span className="projection-size">
                      {' '}
                      really {km2(shape.area)}
                      {view === 'mercator' && drawn > 0 && `; drawn here as big as ${km2(drawn)}, ${(drawn / shape.area).toFixed(1)} times too big`}
                      {view === 'mercator' && ` (its middle, at ${Math.abs(Math.round(lat))}° ${lat >= 0 ? 'north' : 'south'}, is stretched ${mercatorStretch(lat).toFixed(1)} times)`}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
        {trip && courseOn && tripStats && (
          <ul className="projection-trip" lang="en-CA">
            <li>
              <span className="key-swatch course-swatch-rhumb" /> Steady compass course, {Math.round(tripStats.bearing)}° all the way: {Math.round(tripStats.km / 10) * 10} km
            </li>
            <li>
              <span className="key-swatch course-swatch-great" /> Shortest way, turning as it goes: {Math.round(tripStats.shortest / 10) * 10} km
            </li>
          </ul>
        )}
      </figcaption>
    </figure>
  )
}
