import { geoMercator, geoPath } from 'd3-geo'
import { cities, type CityId } from '../data/cities'
import { MAP_W } from './geo'

// Widens [a0, a1] to at least `size`, about its middle, without leaving [lo, hi].
const widen = (a0: number, a1: number, size: number, lo: number, hi: number): [number, number] => {
  const mid = (a0 + a1) / 2
  const half = Math.max(size, a1 - a0) / 2
  let b0 = mid - half
  let b1 = mid + half
  if (b0 < lo) [b0, b1] = [lo, b1 + lo - b0]
  if (b1 > hi) [b0, b1] = [b0 - (b1 - hi), hi]
  return [Math.max(lo, b0), Math.min(hi, b1)]
}

// A city map's Mercator frame: as wide as the other maps, as tall as the city's extent needs.
// Given the places a question asks about, it zooms in on them, with room around them, a
// sensible shape, and never past the edge of the city's map.
export const cityFrame = (city: CityId, focus?: [number, number][]) => {
  const [s, w, n, e] = cities[city].bbox
  const m = geoMercator()
  let [x0, y0] = m([w, n])!
  let [x1, y1] = m([e, s])!
  if (focus?.length) {
    const xs = focus.map((c) => m(c)![0])
    const ys = focus.map((c) => m(c)![1])
    const span = x1 - x0
    const pad = span * 0.12
    const [fx0, fx1] = widen(Math.min(...xs) - pad, Math.max(...xs) + pad, span * 0.45, x0, x1)
    const [fy0, fy1] = widen(Math.min(...ys) - pad, Math.max(...ys) + pad, (fx1 - fx0) * 0.75, y0, y1)
    ;[x0, x1] = (fy1 - fy0) > (fx1 - fx0) * 1.1 ? widen(fx0, fx1, (fy1 - fy0) / 1.1, x0, x1) : [fx0, fx1]
    ;[y0, y1] = [fy0, fy1]
  }
  const height = Math.round((MAP_W * (y1 - y0)) / (x1 - x0))
  const projection = geoMercator().fitExtent(
    [
      [0, 0],
      [MAP_W, height],
    ],
    { type: 'MultiPoint', coordinates: [m.invert!([x0, y0])!, m.invert!([x1, y1])!] },
  )
  return { projection, path: geoPath(projection), height }
}
