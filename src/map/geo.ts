import { geoDistance, geoEqualEarth, geoMercator, geoPath, type GeoPath, type GeoPermissibleObjects, type GeoProjection } from 'd3-geo'
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
// The Amsterdam map is about as wide as it is tall.
export const CITY_H = 560
// The world map is wide and low: from the Americas to Japan, Norway to Tasmania.
export const WORLD_H = 340

// Fit the Netherlands and Belgium, leaving a margin of neighbouring land and sea.
const focus: FeatureCollection<Geometry, Props> = {
  type: 'FeatureCollection',
  features: countries.filter((f) => f.properties.id === 'NLD' || f.properties.id === 'BEL'),
}

// A Mercator view of the map data fitted around some area: the whole Low Countries
// by default, or a closer view for a time map that only needs the Netherlands.
export type Frame = {
  projection: GeoProjection
  path: GeoPath
  linePath: (coords: [number, number][]) => string | undefined
  toXY: (lonLat: [number, number]) => [number, number]
}

export const makeFrame = (fit: GeoPermissibleObjects, height = MAP_H): Frame => {
  const projection = geoMercator().fitExtent(
    [
      [30, 30],
      [MAP_W - 30, height - 30],
    ],
    fit,
  )
  const path = geoPath(projection)
  return {
    projection,
    path,
    linePath: (coords) => path({ type: 'LineString', coordinates: coords }) ?? undefined,
    toXY: (lonLat) => projection(lonLat)!,
  }
}

// An equal-area view of the world, centred on the Indian Ocean side of Africa so the
// Atlantic and Asian routes both fit, from New York to Japan and Norway to Tasmania.
// `fit` is the area to fit: its corners as [lon, lat].
export const makeWorldFrame = (fit: [number, number][]): Frame => {
  const projection = geoEqualEarth()
    .rotate([-27, 0])
    .fitExtent(
      [
        [6, 6],
        [MAP_W - 6, WORLD_H - 6],
      ],
      { type: 'MultiPoint', coordinates: fit },
    )
  const path = geoPath(projection)
  return {
    projection,
    path,
    linePath: (coords) => path({ type: 'LineString', coordinates: coords }) ?? undefined,
    toXY: (lonLat) => projection(lonLat)!,
  }
}

export const lowlandsFrame = makeFrame(focus)
export const { projection, path, linePath } = lowlandsFrame

const EARTH_RADIUS_KM = 6371

export const distanceKm = (a: [number, number], b: [number, number]) => geoDistance(a, b) * EARTH_RADIUS_KM
