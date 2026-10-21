import { useMemo, type ReactNode } from 'react'
import type { FeatureCollection, Geometry } from 'geojson'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import raw from '../data/westhoek.topo.json'
import { MAP_W, WESTHOEK_H, type Frame, type GeoFeature } from './geo'

// The Westhoek close up, from the coast at Nieuwpoort to Armentières: Belgium and
// France from Natural Earth 1:10m, and the Yser, the canal from Ypres to the Yser and
// the canal from Nieuwpoort to Dunkirk from the Flemish hydrographic atlas (VHA, via
// Digitaal Vlaanderen, free reuse with attribution), clipped and simplified with
// mapshaper.
const topology = raw as unknown as Topology
const layer = (name: string) => (feature(topology, topology.objects[name]) as unknown as FeatureCollection<Geometry, GeoFeature['properties']>).features

// Countries by ISO code (BEL, FRA), so a time map's areas can use them.
export const westhoekCountries = layer('countries')
const waterways = layer('waterways')

type Props = { frame: Frame; label: string; areas?: ReactNode; children?: ReactNode }

export function WesthoekBase({ frame, label, areas, children }: Props) {
  const d = useMemo(
    () => ({
      countries: westhoekCountries.map((f) => ({ id: f.properties.id!, d: frame.path(f) ?? '' })),
      waterways: waterways.map((f) => ({ name: f.properties.name!, d: frame.path(f) ?? '' })),
    }),
    [frame],
  )
  return (
    <svg className="lowlands-map westhoek-map" viewBox={`0 0 ${MAP_W} ${WESTHOEK_H}`} role="img" aria-label={label}>
      <rect className="sea" width={MAP_W} height={WESTHOEK_H} />
      {d.countries.map((c) => (
        <path key={c.id} d={c.d} className={c.id === 'BEL' ? 'land focus' : 'land'} />
      ))}
      {areas}
      {d.countries.map((c) => (
        <path key={`b-${c.id}`} d={c.d} className="country-border" />
      ))}
      {d.waterways.map((w) => (
        <path key={w.name} d={w.d} className={w.name === 'Yser' ? 'river' : 'river river-thin'}>
          <title>{w.name}</title>
        </path>
      ))}
      {children}
    </svg>
  )
}
