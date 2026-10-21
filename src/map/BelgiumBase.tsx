import { useMemo, type ReactNode } from 'react'
import type { FeatureCollection, Geometry } from 'geojson'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import raw from '../data/belgium.topo.json'
import { BELGIUM_H, MAP_W, type Frame, type GeoFeature } from './geo'

// Belgium on its own, for the language map and the diagram of regions and
// communities. Its land is the 589 municipalities Belgium had from 1983 to 2018, from
// Statistics Belgium (via geoBoundaries, CC BY 4.0), dissolved into the pieces the language
// laws moved about: Flanders and Wallonia, Brussels (16 municipalities, and the three
// added in 1954), the six municipalities with facilities around it and the rest of
// Halle-Vilvoorde, Voeren, Comines-Warneton and Mouscron, the nine German-speaking
// municipalities and Malmedy with Waimes. Its neighbours are Natural Earth 1:10m.
// Clipped and simplified with mapshaper.
const topology = raw as unknown as Topology
const layer = (name: string) => (feature(topology, topology.objects[name]) as unknown as FeatureCollection<Geometry, GeoFeature['properties']>).features

// The pieces by id (flanders, wallonia, brussels, voeren...), so a time map's areas can use them.
export const belgiumParts = layer('parts')
export const belgiumOutline = layer('belgium')
const neighbours = layer('countries')

type Props = { frame: Frame; label: string; areas?: ReactNode; children?: ReactNode }

export function BelgiumBase({ frame, label, areas, children }: Props) {
  const d = useMemo(
    () => ({
      neighbours: neighbours.map((f) => ({ id: f.properties.id!, d: frame.path(f) ?? '' })),
      belgium: belgiumOutline.map((f) => frame.path(f) ?? ''),
    }),
    [frame],
  )
  return (
    <svg className="lowlands-map belgium-map" viewBox={`0 0 ${MAP_W} ${BELGIUM_H}`} role="img" aria-label={label}>
      <rect className="sea" width={MAP_W} height={BELGIUM_H} />
      {d.neighbours.map((c) => (
        <path key={c.id} d={c.d} className="land" />
      ))}
      {d.belgium.map((b, i) => (
        <path key={`be-${i}`} d={b} className="land focus" />
      ))}
      {areas}
      {d.belgium.map((b, i) => (
        <path key={`bb-${i}`} d={b} className="country-border" />
      ))}
      {children}
    </svg>
  )
}
