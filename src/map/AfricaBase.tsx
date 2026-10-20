import { useMemo, type ReactNode } from 'react'
import type { FeatureCollection, Geometry } from 'geojson'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import raw from '../data/congo.topo.json'
import { AFRICA_H, MAP_W, type Frame, type GeoFeature } from './geo'

// Central Africa, for the map of the Congo: Natural Earth 1:50m countries with today's
// borders, and the Congo, its main tributaries and the great lakes from the 1:10m
// data, clipped to the region and simplified with mapshaper.
const topology = raw as unknown as Topology
const layer = (name: string) => (feature(topology, topology.objects[name]) as unknown as FeatureCollection<Geometry, GeoFeature['properties']>).features

// Countries by ISO code (COD, RWA, BDI, AGO...), so a time map's areas can use them.
export const africaCountries = layer('countries')
const rivers = layer('rivers')
const lakes = layer('lakes')

// Rivers that carried the colony's boats and trade are drawn thicker.
const main = new Set(['Congo', 'Lualaba', 'Kasai', 'Ubangi'])

type Props = { frame: Frame; label: string; areas?: ReactNode; children?: ReactNode }

export function AfricaBase({ frame, label, areas, children }: Props) {
  const d = useMemo(
    () => ({
      countries: africaCountries.map((f) => ({ id: f.properties.id!, d: frame.path(f) ?? '' })),
      rivers: rivers.map((f) => ({ name: f.properties.name!, d: frame.path(f) ?? '' })),
      lakes: lakes.map((f) => frame.path(f) ?? ''),
    }),
    [frame],
  )
  return (
    <svg className="lowlands-map africa-map" viewBox={`0 0 ${MAP_W} ${AFRICA_H}`} role="img" aria-label={label}>
      <rect className="sea" width={MAP_W} height={AFRICA_H} />
      {d.countries.map((c) => (
        <path key={c.id} d={c.d} className={c.id === 'COD' ? 'land focus' : 'land'} />
      ))}
      {areas}
      {d.countries.map((c) => (
        <path key={`b-${c.id}`} d={c.d} className="province africa-border" />
      ))}
      {d.lakes.map((l, i) => (
        <path key={`lake-${i}`} d={l} className="lake" />
      ))}
      {d.rivers.map((r, i) => (
        <path key={`river-${i}`} d={r.d} className={main.has(r.name) ? 'river' : 'river river-thin'} />
      ))}
      {children}
    </svg>
  )
}
