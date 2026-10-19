import { useId } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import type { FeatureCollection, Geometry } from 'geojson'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import raw from '../data/northsea.topo.json'
import {
  CLOTH_MAX,
  CLOTH_MIN,
  activeAt,
  clothEventAt,
  clothEvents,
  regions,
  routeIds,
  routes,
  towns,
  type Flow,
} from '../data/cloth'
import { TimeControls } from './TimeControls'
import { usePlayback } from './usePlayback'

// A wider frame than the main map, so England and the Champagne fairs fit:
// from London to beyond the Ems, and from the Wash down to Troyes.
const TRADE_W = 600
const TRADE_H = 600

type Props = { id?: string; name?: string }
const topology = raw as unknown as Topology
const layer = (name: string) => feature(topology, topology.objects[name]) as unknown as FeatureCollection<Geometry, Props>
const land = layer('land').features
const rivers = layer('rivers').features

const projection = geoMercator().fitExtent(
  [
    [8, 8],
    [TRADE_W - 8, TRADE_H - 8],
  ],
  { type: 'MultiPoint', coordinates: [[-0.95, 48.15], [9.05, 54.25]] },
)
const path = geoPath(projection)
const linePath = (coords: [number, number][]) => path({ type: 'LineString', coordinates: coords }) ?? undefined
const xy = (lonLat: [number, number]) => projection(lonLat)!

const FOCUS = new Set(['NLD', 'BEL'])
const flows: Flow[] = ['wool', 'cloth', 'goods']
const starts = clothEvents.map((e) => e.from)

const LABEL = {
  left: { x: -8, y: 4, anchor: 'end' },
  right: { x: 8, y: 4, anchor: 'start' },
  above: { x: 0, y: -9, anchor: 'middle' },
  below: { x: 0, y: 16, anchor: 'middle' },
} as const

// The wool and cloth trade, 1100 to 1384: drag the years or press play. Moving
// dashes show which way goods flowed; a route that has stopped turns grey.
type MapProps = { start?: number; onYear?: (year: number) => void; hideCaption?: boolean }

export function TradeMap({ start = CLOTH_MIN, onYear, hideCaption = false }: MapProps) {
  const { year, playing, togglePlay, scrub } = usePlayback(starts, CLOTH_MIN, start, onYear)
  const event = clothEventAt(year)
  const uid = useId().replace(/:/g, '')

  return (
    <figure className="time-map trade-map">
      <div className="map-frame">
        <svg className="lowlands-map" viewBox={`0 0 ${TRADE_W} ${TRADE_H}`} role="img" aria-label={`Trade map of the North Sea in ${year}: ${event.title}`}>
          <defs>
            {flows.map((f) => (
              <marker key={f} id={`${uid}-${f}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M0 0 10 5 0 10z" className={`trade-head trade-${f}`} />
              </marker>
            ))}
          </defs>
          <rect className="sea" width={TRADE_W} height={TRADE_H} />
          {land.map((f) => (
            <path key={f.properties.id} d={path(f) ?? undefined} className={FOCUS.has(f.properties.id!) ? 'land focus' : 'land'} />
          ))}
          {rivers.map((f, i) => (
            <path key={`r-${i}`} d={path(f) ?? undefined} className="river river-thin" />
          ))}
          {regions
            .filter((r) => activeAt(year, r))
            .map((r) => {
              const [x, y] = xy(r.at)
              return (
                <text key={r.text} x={x} y={y} textAnchor="middle" className={r.small ? 'hist-people trade-region-small' : 'hist-people'}>
                  {r.text}
                </text>
              )
            })}
          {routeIds.map((id) => {
            const r = routes[id]
            if (r.from > year) return null
            const on = activeAt(year, r)
            const d = linePath(r.coords)
            if (!on) return <path key={`${id}-gone`} d={d} className="trade-line trade-gone" />
            return (
              <g key={`${id}-on`} className="fade-in">
                <path d={d} className={`trade-line trade-${r.flow}`} markerEnd={`url(#${uid}-${r.flow})`} />
                <path d={d} className={`trade-flow trade-flow-${r.flow}`}>
                  <title>{r.name}</title>
                </path>
              </g>
            )
          })}
          {routeIds.map((id) => {
            const r = routes[id]
            if (!r.label || !activeAt(year, r)) return null
            const [x, y] = xy(r.label.at)
            return (
              <text key={`l-${id}`} x={x} y={y} textAnchor="middle" className={`trade-label trade-label-${r.flow}`}>
                {r.label.text}
              </text>
            )
          })}
          {towns
            .filter((t) => activeAt(year, t))
            .map((t) => {
              const [x, y] = xy(t.at)
              const l = LABEL[t.label ?? 'right']
              return (
                <g key={t.name} className={`hist-site trade-town trade-town-${t.kind}`} transform={`translate(${x},${y})`}>
                  <circle r={t.kind === 'market' ? 5.5 : 4.5} />
                  {t.label && (
                    <text x={l.x} y={l.y} textAnchor={l.anchor} className="hist-site-label trade-town-label">
                      {t.name}
                    </text>
                  )}
                  <title>{t.name}</title>
                </g>
              )
            })}
        </svg>
      </div>
      <TimeControls
        event={event}
        year={year}
        min={CLOTH_MIN}
        max={CLOTH_MAX}
        format={String}
        playing={playing}
        onScrub={scrub}
        onTogglePlay={togglePlay}
        hideCaption={hideCaption}
      >
        <li><span className="key-swatch key-wool" />Wool</li>
        <li><span className="key-swatch key-cloth" />Cloth</li>
        <li><span className="key-swatch key-goods" />Other goods</li>
        <li><span className="key-swatch key-cloth-town" />Cloth town</li>
        <li><span className="key-swatch key-market" />Market or port</li>
      </TimeControls>
    </figure>
  )
}
