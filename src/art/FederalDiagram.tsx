import { useId, useMemo, useState } from 'react'
import { belgiumOutline, belgiumParts } from '../map/BelgiumBase'
import { BELGIUM_H, MAP_W, makeFrame } from '../map/geo'

// How Belgium has been run since 1989: one federal state, three regions that look
// after the land, and three communities that look after the people in their language.
// The two maps cover the same country differently: Brussels is a region of its own,
// but belongs to both the Flemish and the French Community, and the German-speaking
// Community lies inside the Walloon Region. Tap a region or community to see what it
// runs. `show` draws only one of the two maps.

type Part = { id: string; name: string; tone: 'dutch' | 'french' | 'german' | 'bilingual'; parts: string[]; runs: string; seat: string }

const flemishLand = ['flanders', 'halle-vilvoorde', 'rand-1954', 'rand-1963', 'voeren']
const brussels = ['brussels', 'brussels-1954']
const frenchLand = ['wallonia', 'comines', 'mouscron', 'malmedy']

const regions: Part[] = [
  { id: 'flemish-region', name: 'Flemish Region', tone: 'dutch', parts: flemishLand, runs: 'The economy and jobs, roads and ports, housing, farming and the environment, in Flanders.', seat: 'Parliament in Brussels' },
  { id: 'walloon-region', name: 'Walloon Region', tone: 'french', parts: [...frenchLand, 'east-cantons'], runs: 'The economy and jobs, roads, housing, farming and the environment, in Wallonia, the German-speaking towns included.', seat: 'Parliament in Namur' },
  { id: 'brussels-region', name: 'Brussels-Capital Region', tone: 'bilingual', parts: brussels, runs: 'The economy and jobs, roads and public transport, housing and the environment, in the 19 municipalities of Brussels.', seat: 'Parliament in Brussels' },
]

const communities: Part[] = [
  { id: 'flemish-community', name: 'Flemish Community', tone: 'dutch', parts: [...flemishLand, ...brussels], runs: 'Schools, culture, Dutch-language television and radio, youth and much of health and family care, for Dutch speakers in Flanders and in Brussels.', seat: 'Shares its parliament with the Flemish Region' },
  { id: 'french-community', name: 'French Community', tone: 'french', parts: [...frenchLand, ...brussels], runs: 'Schools, culture, French-language television and radio and youth care, for French speakers in Wallonia and in Brussels.', seat: 'Parliament in Brussels' },
  { id: 'german-community', name: 'German-speaking Community', tone: 'german', parts: ['east-cantons'], runs: 'Schools, culture, German-language radio and television and youth care, for about 80,000 people in nine municipalities.', seat: 'Parliament in Eupen' },
]

// Where each name goes on the map, [lon, lat].
const labelAt: Record<string, [number, number]> = {
  'flemish-region': [4.0, 51.08],
  'walloon-region': [4.85, 50.2],
  'brussels-region': [4.36, 50.72],
  'flemish-community': [4.0, 51.08],
  'french-community': [4.85, 50.2],
  'german-community': [6.2, 50.08],
}

const frame = makeFrame({ type: 'MultiPoint', coordinates: [[2.5, 49.45], [6.45, 51.55]] }, BELGIUM_H)

function FederalMap({ title, intro, groups }: { title: string; intro: string; groups: Part[] }) {
  const uid = useId().replace(/:/g, '')
  const [picked, setPicked] = useState<string | null>(null)
  const paths = useMemo(() => Object.fromEntries(belgiumParts.map((f) => [f.properties.id!, frame.path(f) ?? ''])), [])
  const outline = useMemo(() => belgiumOutline.map((f) => frame.path(f) ?? ''), [])
  // Brussels belongs to two communities, so it is striped in both their colours.
  const shared = (id: string) => groups.filter((g) => g.parts.includes(id)).length > 1
  const pick = groups.find((g) => g.id === picked)

  return (
    <div className="federal-panel">
      <h4 className="federal-title">{title}</h4>
      <p className="federal-intro">{intro}</p>
      <svg viewBox={`0 0 ${MAP_W} ${BELGIUM_H}`} className="federal-map" role="img" aria-label={`Map: ${groups.map((g) => g.name).join(', ')}`}>
        <defs>
          <pattern id={`${uid}-both`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="9" height="9" className="facility-a" />
            <rect width="4.5" height="9" className="facility-b" />
          </pattern>
        </defs>
        {groups.map((g) =>
          g.parts.map((id) => (
            <path
              key={`${g.id}-${id}`}
              d={paths[id]}
              className={`federal-part hist-area-${g.tone}${pick && !pick.parts.includes(id) ? ' federal-dim' : ''}`}
              style={shared(id) ? { fill: `url(#${uid}-both)` } : undefined}
              onClick={() => setPicked(picked === g.id ? null : g.id)}
            />
          )),
        )}
        {outline.map((d, i) => (
          <path key={i} d={d} className="country-border" />
        ))}
        {groups.map((g) => {
          const [x, y] = frame.toXY(labelAt[g.id])
          return (
            <text key={g.id} x={x} y={y} textAnchor="middle" className={`federal-label${picked === g.id ? ' federal-label-on' : ''}`}>
              {g.name}
            </text>
          )
        })}
      </svg>
      <div className="federal-buttons">
        {groups.map((g) => (
          <button key={g.id} type="button" className={`federal-button federal-${g.tone}`} aria-pressed={picked === g.id} onClick={() => setPicked(picked === g.id ? null : g.id)}>
            {g.name}
          </button>
        ))}
      </div>
      <p className="federal-runs" aria-live="polite">
        {pick ? (
          <>
            <strong>{pick.name}:</strong> {pick.runs} {pick.seat}.
          </>
        ) : (
          'Tap one to see what it runs.'
        )}
      </p>
    </div>
  )
}

export function FederalDiagram({ show }: { show?: 'regions' | 'communities' }) {
  return (
    <figure className="federal" aria-label="Diagram: Belgium's federal state, its three regions and its three communities">
      <figcaption className="tree-title">Belgium since 1989: one federal state, three regions, three communities</figcaption>
      <div className="federal-roof">The federal state: the army, justice and police, foreign affairs, social security and pensions</div>
      <div className={`federal-maps${show ? ' federal-one' : ''}`}>
        {show !== 'communities' && <FederalMap title="Three regions" intro="They look after the land." groups={regions} />}
        {show !== 'regions' && <FederalMap title="Three communities" intro="They look after the people, in their language." groups={communities} />}
      </div>
    </figure>
  )
}
