import { useMemo, type ReactNode } from 'react'
import type { MultiPolygon, Polygon } from 'geojson'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import raw from '../data/amsterdam.topo.json'
import { CITY_H, MAP_W, type Frame } from './geo'

const topology = raw as unknown as Topology
const water = (feature(topology, topology.objects.water) as unknown as { features: { geometry: Polygon | MultiPolygon }[] }).features[0].geometry
const polygons = water.type === 'Polygon' ? [water.coordinates] : water.coordinates

// Projected straight onto the page ring by ring, with even-odd filling, so islands
// show whichever way their rings wind.
const waterPath = (frame: Frame) =>
  polygons
    .flatMap((rings) => rings.map((ring) => `M${ring.map((c) => frame.toXY(c as [number, number]).map((v) => v.toFixed(1)).join(',')).join('L')}Z`))
    .join('')

// `areas` are drawn under the water, so the canals show through them; `children` on top.
type Props = { frame: Frame; label: string; areas?: ReactNode; children?: ReactNode }

// The canals, the Amstel and the IJ of central Amsterdam, for the city's growth map.
// As wide as the Low Countries map but less tall, so a time map can draw on either.
export function AmsterdamBase({ frame, label, areas, children }: Props) {
  const d = useMemo(() => waterPath(frame), [frame])
  return (
    <svg className="lowlands-map city-map" viewBox={`0 0 ${MAP_W} ${CITY_H}`} role="img" aria-label={label}>
      <rect className="city-land" width={MAP_W} height={CITY_H} />
      {areas}
      <path d={d} className="city-water" fillRule="evenodd" />
      {children}
    </svg>
  )
}
