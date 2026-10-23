// Builds the city explorer's street maps (src/data/cities/<city>.topo.json) from the
// Overpass results in scripts/maps/raw (see overpass.py and the maps workflow).
// Run: npm i --no-save osmtogeojson && node scripts/maps/build.mjs
// Layers: water (areas), canal (waterway lines), green (parks and larger grass),
// square (squares and pedestrian areas), major and minor (streets), rail.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import osmtogeojson from 'osmtogeojson'
import mapshaper from 'mapshaper'

const files = { maastricht: 'maastricht2' }
const cities = process.argv.slice(2).length ? process.argv.slice(2) : ['bruges', 'amsterdam', 'ghent', 'antwerp', 'delft', 'brussels', 'maastricht']
const MAJOR = /^(motorway|trunk|primary|secondary|tertiary)(_link)?$/
const MINOR = /^(unclassified|residential|pedestrian|living_street)$/

const layer = (f) => {
  const t = f.properties ?? {}
  const area = f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
  if (area && (t.natural === 'water' || t.waterway === 'riverbank' || t.water)) return 'water'
  if (!area && (t.waterway === 'canal' || t.waterway === 'river')) return 'canal'
  if (area && (t.leisure === 'park' || t.landuse === 'cemetery' || t.landuse === 'recreation_ground' || t.landuse === 'grass')) return 'green'
  if (area && (t.place === 'square' || (t.highway === 'pedestrian' && t.area === 'yes'))) return 'square'
  if (!area && t.highway && MAJOR.test(t.highway)) return 'major'
  if (!area && t.highway && MINOR.test(t.highway)) return 'minor'
  if (!area && t.railway === 'rail') return 'rail'
  return null
}

mkdirSync('src/data/cities', { recursive: true })
for (const city of cities) {
  const raw = JSON.parse(gunzipSync(readFileSync(`scripts/maps/raw/${files[city] ?? city}.json.gz`)))
  const gj = osmtogeojson(raw, { flatProperties: true })
  const byLayer = {}
  for (const f of gj.features) {
    const l = layer(f)
    if (!l) continue
    ;(byLayer[l] ??= []).push({ type: 'Feature', properties: {}, geometry: f.geometry })
  }
  const input = {}
  const names = Object.keys(byLayer)
  for (const l of names) input[`${l}.json`] = { type: 'FeatureCollection', features: byLayer[l] }
  const [s, w, n, e] = raw.elements.length ? bboxOf(city) : []
  const cmd = [
    `-i ${names.map((l) => `${l}.json`).join(' ')} combine-files`,
    `-clip bbox=${w},${s},${e},${n}`,
    `-filter 'this.area > 5000' target=green`,
    `-filter 'this.area > 1500' target=square`,
    `-dissolve2 target=water,green,square`,
    `-dissolve target=major,minor,canal,rail`,
    `-simplify interval=8 keep-shapes`,
    `-o format=topojson quantization=8000 combine-layers out.json`,
  ].join(' ')
  const out = await mapshaper.applyCommands(cmd, input)
  writeFileSync(`src/data/cities/${city}.topo.json`, out['out.json'])
  console.log(city, names.join(','), Math.round(out['out.json'].length / 1024), 'KB')
}

function bboxOf(city) {
  const q = JSON.parse(readFileSync('scripts/maps/bbox.json', 'utf8'))
  return q[city]
}
