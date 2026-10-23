import { useMemo, useState } from 'react'
import { geoMercator } from 'd3-geo'
import { routes, type RouteId } from '../data/routes'
import { makeFrame, MAP_W } from './geo'
import { LowlandsMap } from './LowlandsMap'
import { t } from '../i18n'

type Props = {
  route: RouteId
  // `explore` steps a rider or skater along the route and names every place; `pick` leaves the
  // places unnamed (all but the start, the finish and those in `show`) for a ride-the-route
  // question: tap them in order. `correct` is the asked order, once checked.
  mode?: 'explore' | 'pick'
  // Opens at a step of the route, by its index.
  at?: number
  show?: string[]
  picked?: string[]
  // How many places a question asks for.
  need?: number
  correct?: string[]
  onPick?: (place: string) => void
}

// How tall the map is for its frame: Mercator keeps shapes, so a frame wider than tall gets a
// lower map. Between a wide landscape and a tall portrait.
const heightFor = (bounds: [[number, number], [number, number]]) => {
  const p = geoMercator()
  const [x0, y0] = p(bounds[0])!
  const [x1, y1] = p(bounds[1])!
  return Math.round(Math.min(720, Math.max(380, ((MAP_W - 60) * Math.abs(y1 - y0)) / Math.abs(x1 - x0) + 60)))
}

const pct = (n: number) => `${n}%`

// The route maps of Unit 23: a classic race drawn on the map, step by step, with each climb's
// length and gradient, or the towns of the Elfstedentocht. A question asks for places on the
// route in the order the race passes them.
export function RouteMap({ route: id, mode = 'explore', at = 0, show = [], picked = [], need, correct, onPick }: Props) {
  const route = routes[id]
  const bounds = route.bounds!
  const height = heightFor(bounds)
  const frame = useMemo(() => makeFrame({ type: 'MultiPoint', coordinates: bounds }, height), [bounds, height])
  const [step, setStep] = useState(Math.min(at, route.path.length - 1))
  const explore = mode === 'explore'
  const current = route.path[step]
  const here = route.places[current.place]

  // The line from each step to the next, through its `via` points.
  const legs = route.path.slice(1).map((s, i) => [route.places[route.path[i].place].at, ...(s.via ?? []), route.places[s.place].at])
  const ridden = explore ? legs.slice(0, step) : []
  const ahead = explore ? legs.slice(step) : legs

  const named = (p: string) => explore || route.places[p].end || show.includes(p) || (correct !== undefined && (correct.includes(p) || picked.includes(p)))
  const tap = (p: string) => {
    if (!explore) {
      if (correct === undefined) onPick?.(p)
      return
    }
    // The next time the route passes the place, or its first.
    const next = route.path.findIndex((s, i) => i > step && s.place === p)
    setStep(next >= 0 ? next : route.path.findIndex((s) => s.place === p))
  }
  const state = (p: string) => {
    if (explore) return p === current.place ? ' is-here' : ''
    if (correct !== undefined) {
      const i = picked.indexOf(p)
      if (i >= 0) return correct[i] === p ? ' is-right' : ' is-wrong'
      return correct.includes(p) ? ' is-missed' : ' is-dim'
    }
    return picked.includes(p) ? ' is-picked' : ''
  }
  const kmText = (km?: number) => (km === undefined ? '' : route.km === 'to-finish' ? (km === 0 ? 'Finish' : `${km} km to go`) : km === 0 ? 'Start' : `km ${km}`)
  const [mx, my] = frame.toXY(here.at)

  return (
    <figure className={`route-map route-${mode}`} data-route={id} data-need={need}>
      {explore && (
        <>
          <p className="route-title">{route.title}</p>
          <p className="route-intro">{route.intro}</p>
        </>
      )}
      <div className="map-frame">
        <LowlandsMap label={explore ? t('Route map: {title}', { title: route.title }) : t('Route map of {title} with unnamed places to tap in order', { title: route.title })} frame={frame} height={height}>
          {route.labels.map((l) => {
            const [x, y] = frame.toXY(l.at)
            return (
              <text key={l.text} x={x} y={y} textAnchor="middle" className={`route-label route-label-${l.kind ?? 'land'}`}>
                {l.text}
              </text>
            )
          })}
          {ahead.map((c, i) => (
            <path key={`a${i}`} d={frame.linePath(c)} className="route-line route-ahead" />
          ))}
          {ridden.map((c, i) => (
            <path key={`r${i}`} d={frame.linePath(c)} className="route-line route-ridden" />
          ))}
          {Object.entries(route.places).map(([p, place], i) => {
            const [x, y] = frame.toXY(place.at)
            const left = place.at[0] < (bounds[0][0] + bounds[1][0]) / 2
            const order = picked.indexOf(p)
            return (
              <g
                key={p}
                className={`route-place${place.climb ? ' is-climb' : ''}${place.end ? ' is-end' : ''}${state(p)}`}
                data-place={p}
                transform={`translate(${x},${y})`}
                role="button"
                tabIndex={0}
                aria-label={named(p) ? place.name : t('Place {n}', { n: i + 1 })}
                aria-pressed={explore ? p === current.place : order >= 0}
                onClick={() => tap(p)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), tap(p))}
              >
                <circle r={14} className="route-hit" />
                {place.climb ? <path d="M-7 5 0-7 7 5z" className="route-mark" /> : <circle r={place.end ? 7 : 5.5} className="route-mark" />}
                {!explore && order >= 0 && (
                  <text y={-11} textAnchor="middle" className="route-order">
                    {order + 1}
                  </text>
                )}
                {named(p) && (
                  <text x={left ? -11 : 11} y={4} textAnchor={left ? 'end' : 'start'} className="hist-site-label route-name">
                    {place.name}
                  </text>
                )}
              </g>
            )
          })}
          {explore && (
            <g className={`route-mover route-${route.mover}`} transform={`translate(${mx},${my - 22})`} aria-hidden="true">
              <circle r={10} />
              {route.mover === 'rider' ? (
                <path d="M-5.5 3a2.6 2.6 0 1 0 .01 0zM5.5 3a2.6 2.6 0 1 0 .01 0zM-5.5 3 -1.5-3H3.5L5.5 3M-1.5-3 0 3 3.5-3M2-5h3" />
              ) : route.mover === 'skater' ? (
                <path d="M-6 4h11c1 0 1.5-1 1.5-2M-4 4v-3M3 4v-3M-4 1h7l1-6h-5z" />
              ) : route.mover === 'convoy' ? (
                <path d="M-6 3.5h12M-5 3.5-6 0h12l-1 3.5M-3 0v-3h5v3M2-1.5h5" />
              ) : (
                <path d="M-4 6V-6M-4-6h9l-2.5 3 2.5 3h-9" />
              )}
            </g>
          )}
        </LowlandsMap>
      </div>
      {explore && (
        <>
          <div className="route-controls">
            <button type="button" className="btn-small" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} aria-label={t('Back along the route')}>
              ‹
            </button>
            <input
              type="range"
              min={0}
              max={route.path.length - 1}
              value={step}
              onChange={(e) => setStep(Number(e.target.value))}
              aria-label={t('Along the route')}
              aria-valuetext={`${here.name}${current.km !== undefined ? `, ${kmText(current.km)}` : ''}`}
            />
            <button type="button" className="btn-small" onClick={() => setStep(Math.min(route.path.length - 1, step + 1))} disabled={step === route.path.length - 1} aria-label={t('On along the route')}>
              ›
            </button>
          </div>
          <div className="route-card" aria-live="polite">
            <p className="route-stop">
              <span className="route-count">
                {t('{n} of {total}', { n: step + 1, total: route.path.length })}
              </span>
              {here.name}
              {current.km !== undefined && <span className="route-km">{kmText(current.km)}</span>}
            </p>
            {here.climb && (
              <dl className="climb-stats">
                <div>
                  <dt>{t('Length')}</dt>
                  <dd>{here.climb.m >= 1000 ? `${here.climb.m / 1000} km` : `${here.climb.m} m`}</dd>
                </div>
                <div>
                  <dt>{t('Average')}</dt>
                  <dd>{pct(here.climb.avg)}</dd>
                </div>
                <div>
                  <dt>{t('Steepest')}</dt>
                  <dd>
                    {pct(here.climb.max)}
                    <svg viewBox="0 0 40 12" className="climb-wedge" aria-hidden="true">
                      <path d={`M0 12H40V${(12 - Math.min(12, here.climb.max * 0.45)).toFixed(1)}z`} />
                    </svg>
                  </dd>
                </div>
                {here.climb.cobbles && (
                  <div>
                    <dt>{t('Cobbles')}</dt>
                    <dd>{here.climb.cobbles >= 1000 ? `${here.climb.cobbles / 1000} km` : `${here.climb.cobbles} m`}</dd>
                  </div>
                )}
              </dl>
            )}
            <p className="route-about">{here.about}</p>
            <p className="route-note">{route.note}</p>
          </div>
        </>
      )}
    </figure>
  )
}
