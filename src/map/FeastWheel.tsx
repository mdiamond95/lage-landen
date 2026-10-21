import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { DAYS, MONTHS, dateOf, feastIds, feastKindNames, feastKinds, feasts, monthStarts, spanOf, type FeastId, type FeastKind } from '../data/feasts'
import { Credit, Photo } from '../photos/Photo'
import { feastGlyphs } from './glyphs'

const C = 200
const R_OUT = 188
const R_MONTH = 160
// Each kind of feast runs round its own ring, the church year outermost.
const track = (k: FeastKind) => 144 - feastKinds.indexOf(k) * 14
const SEASONS = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter']

// A day of the year as an angle, 1 January at the top, running clockwise.
const angle = (day: number) => ((day - 0.5) / DAYS) * 2 * Math.PI - Math.PI / 2
const at = (day: number, r: number): [number, number] => [C + r * Math.cos(angle(day)), C + r * Math.sin(angle(day))]
const arc = (from: number, to: number, r: number) => {
  const [x1, y1] = at(from - 0.5, r)
  const [x2, y2] = at(to + 0.5, r)
  const large = to - from + 1 > DAYS / 2 ? 1 : 0
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`
}
const sector = (from: number, to: number, r1: number, r2: number) => {
  const [a, b] = at(from - 0.5, r2)
  const [c, d] = at(to + 0.5, r2)
  const [e, f] = at(to + 0.5, r1)
  const [g, h] = at(from - 0.5, r1)
  return `M${a.toFixed(1)} ${b.toFixed(1)}A${r2} ${r2} 0 0 1 ${c.toFixed(1)} ${d.toFixed(1)}L${e.toFixed(1)} ${f.toFixed(1)}A${r1} ${r1} 0 0 0 ${g.toFixed(1)} ${h.toFixed(1)}z`
}
const mid = (id: FeastId) => {
  const [a, b] = spanOf(feasts[id])
  return (a + b) / 2
}

type Country = 'all' | 'nl' | 'be'

type Props = {
  // `explore` shows the feasts and opens a card on tap; `pick` hides them and asks for a date,
  // set by dragging the hand round the wheel, for a when-is-it question. `correct` shows the
  // answer once checked.
  mode?: 'explore' | 'pick'
  focus?: FeastId
  only?: FeastKind
  picked?: number | null
  correct?: FeastId
  // Whether the picked date counts, once checked.
  right?: boolean
  onPick?: (day: number) => void
}

// The calendar wheel of Unit 22: the feasts of the Low Countries round the year, each kind on its
// own ring. Tap one for a photo and a word on it; feasts that move with Easter or a weekday are
// drawn as the stretch of days they can fall on.
export function FeastWheel({ mode = 'explore', focus, only, picked = null, correct, right, onPick }: Props) {
  const [country, setCountry] = useState<Country>('all')
  const [open, setOpen] = useState<FeastId | null>(focus ?? null)
  const svg = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const shown = feastIds.filter(
    (id) => (only === undefined || feasts[id].kind === only) && (country === 'all' || feasts[id].country === country || feasts[id].country === 'both'),
  )
  const card = mode === 'explore' && open ? feasts[open] : undefined
  const locked = correct !== undefined

  const dayAt = (e: PointerEvent<SVGSVGElement>) => {
    const box = svg.current!.getBoundingClientRect()
    const x = ((e.clientX - box.left) / box.width) * 400 - C
    const y = ((e.clientY - box.top) / box.height) * 400 - C
    if (Math.hypot(x, y) < 30) return null
    const turn = (Math.atan2(y, x) + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI)
    return Math.min(DAYS, Math.floor((turn / (2 * Math.PI)) * DAYS) + 1)
  }
  const move = (e: PointerEvent<SVGSVGElement>) => {
    if (mode !== 'pick' || locked || !dragging.current) return
    const d = dayAt(e)
    if (d) onPick?.(d)
  }
  const nudge = (by: number) => {
    if (locked) return
    onPick?.(((((picked ?? 1) - 1 + by) % DAYS) + DAYS) % DAYS + 1)
  }
  const keys = (e: KeyboardEvent) => {
    const by = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 30, PageDown: -30 }[e.key]
    if (by === undefined) return
    e.preventDefault()
    nudge(by)
  }

  const marks = mode === 'explore' ? shown : locked ? [correct] : []
  const tap = (id: FeastId) => mode === 'explore' && setOpen(id === open ? null : id)

  return (
    <figure className={`feast-wheel wheel-${mode}`}>
      {mode === 'explore' && !only && (
        <div className="food-kinds" role="group" aria-label="Country">
          {(
            [
              ['all', 'Both countries'],
              ['nl', 'Netherlands'],
              ['be', 'Belgium'],
            ] as const
          ).map(([c, label]) => (
            <button type="button" key={c} className={country === c ? 'is-on' : ''} aria-pressed={country === c} onClick={() => setCountry(c)}>
              {label}
            </button>
          ))}
        </div>
      )}
      <svg
        ref={svg}
        className="wheel-face"
        viewBox="0 0 400 400"
        role="img"
        aria-label={mode === 'pick' ? 'A calendar wheel to turn to a date' : 'Calendar wheel of the feasts of the year'}
        onPointerDown={(e) => {
          if (mode !== 'pick' || locked) return
          dragging.current = true
          e.currentTarget.setPointerCapture?.(e.pointerId)
          const d = dayAt(e)
          if (d) onPick?.(d)
        }}
        onPointerMove={move}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {MONTHS.map((m, i) => {
          const from = monthStarts[i]
          const to = (monthStarts[i + 1] ?? DAYS + 1) - 1
          const [lx, ly] = at((from + to) / 2, (R_OUT + R_MONTH) / 2)
          return (
            <g key={m} className={`wheel-month season-${SEASONS[i]}`}>
              <path d={sector(from, to, R_MONTH, R_OUT)} />
              <text x={lx} y={ly + 4} textAnchor="middle">
                {m.slice(0, 3)}
              </text>
            </g>
          )
        })}
        {feastKinds.map((k) => (
          <circle key={k} className="wheel-track" cx={C} cy={C} r={track(k)} />
        ))}
        {marks.map((id) => {
          const f = feasts[id!]
          const [a, b] = spanOf(f)
          const r = track(f.kind)
          const [x, y] = at(mid(id!), r)
          const state = locked ? ' is-right' : open === null ? '' : id === open ? ' is-selected' : ' is-dim'
          return (
            <g
              key={id}
              className={`wheel-mark hist-${f.kind}${state}`}
              data-feast={id}
              role="button"
              tabIndex={mode === 'explore' ? 0 : -1}
              aria-label={`${f.name}, ${f.when}`}
              aria-pressed={open === id}
              onClick={() => tap(id!)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), tap(id!))}
            >
              {a !== b && <path className="wheel-span" d={arc(a, b, r)} />}
              <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}>
                <circle r={9} className="wheel-hit" />
                <path d={feastGlyphs[f.kind]} fillRule="evenodd" transform="scale(0.9)" />
              </g>
            </g>
          )
        })}
        {mode === 'pick' && picked !== null && (
          <g className={`wheel-hand${locked ? (right ? ' is-right' : ' is-wrong') : ''}`}>
            <line x1={C} y1={C} x2={at(picked, R_MONTH - 4)[0]} y2={at(picked, R_MONTH - 4)[1]} />
            <circle cx={at(picked, R_MONTH - 4)[0]} cy={at(picked, R_MONTH - 4)[1]} r={7} />
          </g>
        )}
        <circle className="wheel-hub" cx={C} cy={C} r={34} />
        <text className="wheel-date" x={C} y={C + 5} textAnchor="middle">
          {mode === 'pick' ? (picked === null ? 'Drag' : dateOf(picked)) : card ? '' : 'The year'}
        </text>
      </svg>
      {mode === 'pick' && (
        <div className="wheel-controls">
          <button type="button" className="btn-ghost" onClick={() => nudge(-1)} disabled={locked || picked === null} aria-label="A day earlier">
            ‹ Day
          </button>
          <span
            className="wheel-slider"
            role="slider"
            tabIndex={0}
            aria-label="Date"
            aria-valuemin={1}
            aria-valuemax={DAYS}
            aria-valuenow={picked ?? 1}
            aria-valuetext={picked === null ? 'No date yet' : dateOf(picked)}
            aria-disabled={locked}
            onKeyDown={keys}
          >
            {picked === null ? 'Drag the hand, or use the arrow keys' : dateOf(picked)}
          </span>
          <button type="button" className="btn-ghost" onClick={() => nudge(1)} disabled={locked || picked === null} aria-label="A day later">
            Day ›
          </button>
        </div>
      )}
      {mode === 'explore' && (
        <>
          <ul className="wheel-key" aria-label="Kinds of feast">
            {feastKinds
              .filter((k) => !only || k === only)
              .map((k) => (
                <li key={k}>
                  <span className={`key-swatch key-${k}`} aria-hidden="true" />
                  {feastKindNames[k]}
                </li>
              ))}
          </ul>
          <div className="food-card" aria-live="polite">
            {card ? (
              <>
                {card.photo && <Photo id={card.photo} className="photo food-photo" />}
                <p className="food-title">
                  <span className={`key-swatch key-${card.kind}`} aria-hidden="true" />
                  {card.name}
                  {card.own && <span className="food-own"> · {card.own}</span>}
                </p>
                <p className="food-place">
                  {card.when} · {card.country === 'nl' ? 'Netherlands' : card.country === 'be' ? 'Belgium' : 'Both countries'}
                </p>
                <p className="food-about">{card.about}</p>
                <p className="wheel-where">{card.place}</p>
                {card.photo && (
                  <p className="photo-credit">
                    Photo: <Credit id={card.photo} />
                  </p>
                )}
              </>
            ) : (
              <p className="food-about">Tap a mark to read about the feast. A curved line shows the days a feast can move between.</p>
            )}
          </div>
        </>
      )}
    </figure>
  )
}
