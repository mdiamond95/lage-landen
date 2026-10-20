import { useMemo, type ReactNode } from 'react'
import type { FeatureCollection, Geometry } from 'geojson'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import raw from '../data/delta.topo.json'
import { DELTA_H, MAP_W, type Frame, type GeoFeature } from './geo'

// The islands and sea arms of Zeeland and South Holland, close up. The Dutch land is
// CBS's generalised provinces (via PDOK, CC BY 4.0), with today's Delta dams cut out
// so the sea arms are open until the map draws each dam; Belgium is Natural Earth
// 10m. Both are clipped to the delta and simplified with mapshaper.
const topology = raw as unknown as Topology
const layer = (name: string) => (feature(topology, topology.objects[name]) as unknown as FeatureCollection<Geometry, GeoFeature['properties']>).features

// Provinces by id (NL-ZE, NL-ZH, NL-NB, NL-UT, NL-GE), so a time map's areas can be
// drawn on the detailed coastline.
export const deltaProvinces = layer('provinces')
const belgium = layer('belgium')

type Props = { frame: Frame; label: string; areas?: ReactNode; children?: ReactNode }

export function DeltaBase({ frame, label, areas, children }: Props) {
  const land = useMemo(
    () => ({
      belgium: belgium.map((f) => frame.path(f) ?? ''),
      provinces: deltaProvinces.map((f) => ({ id: f.properties.id!, d: frame.path(f) ?? '' })),
    }),
    [frame],
  )
  return (
    <svg className="lowlands-map delta-map" viewBox={`0 0 ${MAP_W} ${DELTA_H}`} role="img" aria-label={label}>
      <rect className="sea" width={MAP_W} height={DELTA_H} />
      {land.belgium.map((d, i) => (
        <path key={`be-${i}`} d={d} className="land delta-belgium" />
      ))}
      {land.provinces.map((p) => (
        <path key={p.id} d={p.d} className="land focus" />
      ))}
      {areas}
      {land.provinces.map((p) => (
        <path key={`b-${p.id}`} d={p.d} className="province delta-province" />
      ))}
      {children}
    </svg>
  )
}
