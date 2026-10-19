import { geoDistance, geoMercator, geoPath } from 'd3-geo'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import raw from '../data/lowlands.topo.json'

type Props = { id?: string; name?: string; name_nl?: string; country?: string }
export type GeoFeature = Feature<Geometry, Props>

const topology = raw as unknown as Topology
const layer = (name: string) =>
  feature(topology, topology.objects[name]) as unknown as FeatureCollection<Geometry, Props>

export const countries = layer('countries').features
export const provinces = layer('provinces').features
export const rivers = layer('rivers').features
export const lakes = layer('lakes').features

export const MAP_W = 600
export const MAP_H = 680

// Fit the Netherlands and Belgium, leaving a margin of neighbouring land and sea.
const focus: FeatureCollection<Geometry, Props> = {
  type: 'FeatureCollection',
  features: countries.filter((f) => f.properties.id === 'NLD' || f.properties.id === 'BEL'),
}
export const projection = geoMercator().fitExtent(
  [
    [30, 30],
    [MAP_W - 30, MAP_H - 30],
  ],
  focus,
)
export const path = geoPath(projection)

const EARTH_RADIUS_KM = 6371

export const distanceKm = (a: [number, number], b: [number, number]) => geoDistance(a, b) * EARTH_RADIUS_KM
