import { useMemo, type ReactNode } from 'react'
import type { FeatureCollection, Geometry } from 'geojson'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import raw from '../data/world.topo.json'
import { MAP_W, WORLD_H, type Frame } from './geo'

const topology = raw as unknown as Topology
const land = (feature(topology, topology.objects.land) as unknown as FeatureCollection<Geometry>).features

// `areas` (colonies) are drawn over the land; `children` on top.
type Props = { frame: Frame; label: string; areas?: ReactNode; children?: ReactNode }

// Land and sea from the Americas to Japan, for the map of Dutch trade and empire.
// Coastlines are Natural Earth's 1:50m land, simplified; islands smaller than about
// 150 km² (Banda, Sint Eustatius) are left out and shown by their markers alone.
export function WorldBase({ frame, label, areas, children }: Props) {
  const d = useMemo(() => land.map((f) => frame.path(f) ?? '').join(''), [frame])
  return (
    <svg className="lowlands-map world-map" viewBox={`0 0 ${MAP_W} ${WORLD_H}`} role="img" aria-label={label}>
      <rect className="sea" width={MAP_W} height={WORLD_H} />
      <path d={d} className="land world-land" />
      {areas}
      {children}
    </svg>
  )
}
