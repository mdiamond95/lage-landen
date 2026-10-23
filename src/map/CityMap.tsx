import { useEffect, useMemo, useState } from 'react'
import type { Feature, Geometry } from 'geojson'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import { landmarkOf, type CityId } from '../data/cities'
import { cityFrame } from './cityFrame'
import { MAP_W } from './geo'
import { t } from '../i18n'

// Each city's streets load when first shown, so the maps stay out of the main bundle.
const loaders = import.meta.glob<{ default: unknown }>('../data/cities/*.topo.json')
const loaded = new Map<CityId, Topology>()
const load = (city: CityId) =>
  loaded.has(city)
    ? Promise.resolve(loaded.get(city)!)
    : loaders[`../data/cities/${city}.topo.json`]().then((m) => {
        loaded.set(city, m.default as Topology)
        return m.default as Topology
      })

const LAYERS = ['green', 'square', 'water', 'canal', 'rail', 'minor', 'major'] as const

export type PinState = 'idle' | 'on' | 'right' | 'wrong' | 'missed' | 'dim'
export type CityPin = { id: string; state?: PinState; label?: string; n?: number }

type Props = {
  city: CityId
  pins: CityPin[]
  label: string
  onPick?: (id: string) => void
  // Zoom in on the pins (a question), rather than show the whole centre (the explorer).
  zoom?: boolean
}

// A city centre street by street, from OpenStreetMap: water, parks, squares, streets and
// railways, with landmarks as round pins to tap. A pin shows its number in the explorer, its
// name once named, and its state in a question (picked, right, wrong). Names are drawn over
// all the pins, so a neighbour's pin never hides one.
export function CityMap({ city, pins, label, onPick, zoom = false }: Props) {
  const [topo, setTopo] = useState<Topology | undefined>(loaded.get(city))
  useEffect(() => {
    let live = true
    load(city).then((t) => live && setTopo(t))
    return () => {
      live = false
    }
  }, [city])
  const focus = zoom ? pins.map((p) => p.id).join() : ''
  const frame = useMemo(() => cityFrame(city, focus ? focus.split(',').map((id) => landmarkOf(city, id).at) : undefined), [city, focus])
  const paths = useMemo(() => {
    if (!topo || topo !== loaded.get(city)) return null
    return LAYERS.flatMap((l) => {
      const obj = topo.objects[l]
      if (!obj) return []
      const f = feature(topo, obj) as unknown as { features: Feature<Geometry>[] } | Feature<Geometry>
      const fs = 'features' in f ? f.features : [f]
      return fs.map((g, i) => ({ key: `${l}${i}`, layer: l, d: frame.path(g) ?? '' }))
    })
  }, [topo, city, frame])

  const { height } = frame
  // A name goes right of its pin, or left of it near the right edge or when a pin sits just
  // to the right.
  const xy = pins.map((pin) => frame.projection(landmarkOf(city, pin.id).at)!)
  const crowded = (x: number, y: number, width: number) => xy.some(([qx, qy]) => qx > x && qx - x < width + 30 && Math.abs(qy - y) < 24)
  const placed = pins.map((pin, i) => {
    const [x, y] = xy[i]
    const width = (pin.label?.length ?? 0) * 8.5
    return { ...pin, x, y, left: x > MAP_W - width - 30 || (x > width + 30 && crowded(x, y, width)) }
  })
  return (
    <figure className="city-explorer-map" data-city={city}>
      <svg className="city-streets" viewBox={`0 0 ${MAP_W} ${height}`} role="group" aria-label={label}>
        <rect className="street-land" width={MAP_W} height={height} />
        {paths?.map((p) => <path key={p.key} d={p.d} className={`street-${p.layer}`} />)}
        {placed.map((pin) => {
          const state = pin.state ?? 'idle'
          return (
            <g
              key={pin.id}
              className={`city-pin is-${state}`}
              data-landmark={pin.id}
              transform={`translate(${pin.x.toFixed(1)},${pin.y.toFixed(1)})`}
              role={onPick ? 'button' : undefined}
              tabIndex={onPick ? 0 : undefined}
              aria-label={pin.label ?? (pin.n ? t('Landmark {n}', { n: pin.n }) : t('Landmark'))}
              aria-pressed={onPick ? state === 'on' : undefined}
              onClick={onPick ? () => onPick(pin.id) : undefined}
              onKeyDown={onPick ? (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onPick(pin.id)) : undefined}
            >
              <circle r={20} className="city-pin-hit" />
              <circle r={11} className="city-pin-dot" />
              {pin.n !== undefined && (
                <text y={4.5} textAnchor="middle" className="city-pin-n">
                  {pin.n}
                </text>
              )}
            </g>
          )
        })}
        {placed.map(
          (pin) =>
            pin.label && (
              <text key={pin.id} x={pin.x + (pin.left ? -16 : 16)} y={pin.y + 5} textAnchor={pin.left ? 'end' : 'start'} className="city-pin-label" aria-hidden="true">
                {pin.label}
              </text>
            ),
        )}
      </svg>
      <figcaption className="city-osm">
        Map data ©{' '}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
          OpenStreetMap contributors
        </a>
      </figcaption>
    </figure>
  )
}
