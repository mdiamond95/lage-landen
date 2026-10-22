// The projection explorer of Unit 25: the world on Mercator's map of 1569, on an equal-area map
// and on a globe, with countries to drag north and south and a ship's course drawn two ways.
// Land is Natural Earth's 1:110m countries (public domain), from world-atlas 2.0.2 (ISC licence),
// in globe.topo.json. Each shape's area is the figure its source gives, in km²; the drawn shapes
// come within a few per cent of it (a test checks), and a question about sizes is decided by it.

import { geoArea, geoCentroid, geoDistance, geoRotation } from 'd3-geo'
import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon, Position } from 'geojson'
import { feature, merge } from 'topojson-client'
import type { GeometryCollection, MultiPolygon as TopoMultiPolygon, Polygon as TopoPolygon, Topology } from 'topojson-specification'
import raw from './globe.topo.json'

const topology = raw as unknown as Topology
const collection = topology.objects.countries as GeometryCollection<{ name: string }>
const countryParts = collection.geometries as (TopoPolygon<{ name: string }> | TopoMultiPolygon<{ name: string }>)[]

export const world = feature(topology, collection) as unknown as FeatureCollection<Geometry, { name: string }>

// The countries of Africa as world-atlas names them.
const AFRICA = [
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Central African Rep.', 'Chad', 'Congo',
  "Côte d'Ivoire", 'Dem. Rep. Congo', 'Djibouti', 'Egypt', 'Eq. Guinea', 'Eritrea', 'eSwatini', 'Ethiopia', 'Gabon', 'Gambia',
  'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania',
  'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'S. Sudan', 'Senegal', 'Sierra Leone', 'Somalia',
  'Somaliland', 'South Africa', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'W. Sahara', 'Zambia', 'Zimbabwe',
]

type ShapeDef = {
  name: string
  // The countries it is made of, as world-atlas names them.
  countries: string[]
  // Only the parts whose middle lies in this box, [west, south, east, north]: France without
  // French Guiana, Spain without the Canaries.
  keep?: [number, number, number, number]
  // Its area in km², from its source.
  area: number
  // Says what it is made of, where the name alone doesn't.
  about?: string
}

const defs = {
  greenland: { name: 'Greenland', countries: ['Greenland'], area: 2_166_086 },
  africa: { name: 'Africa', countries: AFRICA, area: 30_370_000 },
  congo: { name: 'DR Congo', countries: ['Dem. Rep. Congo'], area: 2_345_409 },
  'western-europe': {
    name: 'Western Europe',
    about: 'France, Germany, Spain, Italy, Britain and the Low Countries together',
    countries: ['France', 'Germany', 'Spain', 'Italy', 'United Kingdom', 'Netherlands', 'Belgium', 'Luxembourg'],
    keep: [-11, 35, 20, 61],
    area: 551_695 + 357_592 + 505_990 + 302_068 + 242_495 + 41_850 + 30_689 + 2_586,
  },
  netherlands: { name: 'Netherlands', countries: ['Netherlands'], area: 41_850 },
  belgium: { name: 'Belgium', countries: ['Belgium'], area: 30_689 },
  indonesia: { name: 'Indonesia', countries: ['Indonesia'], area: 1_904_569 },
  brazil: { name: 'Brazil', countries: ['Brazil'], area: 8_515_767 },
  australia: { name: 'Australia', countries: ['Australia'], area: 7_688_287 },
  india: { name: 'India', countries: ['India'], area: 3_287_263 },
  mexico: { name: 'Mexico', countries: ['Mexico'], area: 1_972_550 },
  norway: { name: 'Norway', countries: ['Norway'], keep: [4, 57, 32, 72], area: 323_802 },
} satisfies Record<string, ShapeDef>

export type ShapeId = keyof typeof defs
export const shapeIds = Object.keys(defs) as [ShapeId, ...ShapeId[]]

const polygonsOf = (g: Geometry): Position[][][] => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [])

const build = (d: ShapeDef): Feature<MultiPolygon> => {
  const merged = merge(topology, countryParts.filter((g) => d.countries.includes(g.properties!.name)))
  const kept = polygonsOf(merged).filter((p) => {
    if (!d.keep) return true
    const [x, y] = geoCentroid({ type: 'Polygon', coordinates: p } as Polygon)
    return x >= d.keep[0] && y >= d.keep[1] && x <= d.keep[2] && y <= d.keep[3]
  })
  return { type: 'Feature', properties: {}, geometry: { type: 'MultiPolygon', coordinates: kept } }
}

export type Shape = ShapeDef & { id: ShapeId; feature: Feature<MultiPolygon>; centre: [number, number] }

export const shapes = Object.fromEntries(
  (Object.entries(defs) as [ShapeId, ShapeDef][]).map(([id, d]) => {
    const f = build(d)
    return [id, { ...d, id, feature: f, centre: geoCentroid(f) as [number, number] }]
  }),
) as Record<ShapeId, Shape>

// The Earth's mean radius, in km.
export const EARTH_R = 6371.0088

// The area of a drawn shape, in km², measured on the sphere.
export const areaOf = (f: Feature | Geometry) => geoArea(f as Feature) * EARTH_R * EARTH_R

// A shape picked up and set down elsewhere on the globe: turned about the Earth's middle so that
// its centre lands on `to`, keeping its true shape and size, as a cut-out slid over a globe would.
export const moveShape = (shape: Shape, to: [number, number]): Feature<MultiPolygon> => {
  const from = geoRotation([-shape.centre[0], -shape.centre[1]])
  const back = geoRotation([-to[0], -to[1]])
  const move = (p: Position) => back.invert(from([p[0], p[1]]))
  return {
    ...shape.feature,
    geometry: { type: 'MultiPolygon', coordinates: shape.feature.geometry.coordinates.map((poly) => poly.map((ring) => ring.map(move))) },
  }
}

// How much bigger Mercator's map draws an area at a latitude than at the equator: the square
// of the secant. About 4 times at 60°, 11 times at Greenland's middle, 72°.
export const mercatorStretch = (lat: number) => 1 / Math.cos((lat * Math.PI) / 180) ** 2

type Port = { name: string; at: [number, number] }
type CourseDef = { from: Port; to: Port; about: string }

// A ship's course, drawn as a rhumb line (one steady compass bearing all the way, a straight line on
// Mercator's map) and as a great circle (the shortest way, which needs the bearing changed as it goes).
export const courses = {
  'new-amsterdam': {
    from: { name: 'Amsterdam', at: [4.9, 52.37] },
    to: { name: 'New Amsterdam', at: [-74.01, 40.71] },
    about: 'The West India Company founded New Amsterdam, now New York, in 1625.',
  },
} satisfies Record<string, CourseDef>

export type CourseId = keyof typeof courses
export const courseIds = Object.keys(courses) as [CourseId, ...CourseId[]]

const rad = Math.PI / 180
// Mercator's stretched latitude.
const psi = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * rad) / 2))

// The rhumb line between two points, as points along it: on Mercator's map it is straight, so
// longitude and stretched latitude both change evenly along it.
export const rhumbLine = (a: [number, number], b: [number, number], n = 64): [number, number][] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n
    const y = psi(a[1]) + t * (psi(b[1]) - psi(a[1]))
    return [a[0] + t * (b[0] - a[0]), (2 * Math.atan(Math.exp(y)) - Math.PI / 2) / rad]
  })

// The rhumb line's length in km and its compass bearing in degrees.
export const rhumb = (a: [number, number], b: [number, number]) => {
  const dphi = (b[1] - a[1]) * rad
  const dpsi = psi(b[1]) - psi(a[1])
  const dlon = (b[0] - a[0]) * rad
  const q = Math.abs(dpsi) > 1e-12 ? dphi / dpsi : Math.cos(a[1] * rad)
  const km = Math.sqrt(dphi * dphi + q * q * dlon * dlon) * EARTH_R
  const bearing = ((Math.atan2(dlon, dpsi) / rad) + 360) % 360
  return { km, bearing }
}

export const greatCircleKm = (a: [number, number], b: [number, number]) => geoDistance(a, b) * EARTH_R
