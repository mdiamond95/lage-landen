import { useMemo, useState } from 'react'
import { cabinetSeats, chambers, MAJORITY, SEATS, type ChamberId } from '../data/seats'

const ROWS = 7
const R0 = 0.42
const W = 600
const H = 330
const CX = W / 2
const CY = H - 20
const SCALE = 270

const sides = { dutch: 'Dutch-speaking', french: 'French-speaking', both: 'both sides' }

// Seats of a half circle, filled row by row in proportion to each row's length, then read from left to
// right as a parliament's seating plan is drawn.
const layout = () => {
  const radii = Array.from({ length: ROWS }, (_, i) => R0 + ((1 - R0) * i) / (ROWS - 1))
  const total = radii.reduce((a, b) => a + b, 0)
  const counts = radii.map((r) => Math.round((SEATS * r) / total))
  counts[ROWS - 1] += SEATS - counts.reduce((a, b) => a + b, 0)
  const seats = radii.flatMap((r, i) =>
    Array.from({ length: counts[i] }, (_, k) => {
      const angle = Math.PI - (Math.PI * (k + 0.5)) / counts[i]
      return { angle, x: CX + Math.cos(angle) * r * SCALE, y: CY - Math.sin(angle) * r * SCALE }
    }),
  )
  return seats.sort((a, b) => b.angle - a.angle)
}

// A lower house as a half circle of its 150 seats (Unit 26), each party in its colour. Tap a party to
// pick out its seats, or show which parties make up the government and whether they pass 76.
export function SeatChart({ chamber, hideCabinet = false }: { chamber: ChamberId; hideCabinet?: boolean }) {
  const c = chambers[chamber]
  const seats = useMemo(layout, [])
  const [party, setParty] = useState<string | null>(null)
  const [cabinet, setCabinet] = useState(false)
  const owners = c.parties.flatMap((p) => Array.from({ length: p.seats }, () => p))
  const lit = (name: string, inCabinet?: boolean) => (party ? name === party : cabinet ? !!inCabinet : true)
  const held = cabinetSeats(c)

  return (
    <figure className="seat-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${c.title}, seats after the election of ${c.election}`}>
        {seats.map((s, i) => {
          const p = owners[i]
          return <circle key={i} cx={s.x} cy={s.y} r={8.2} fill={p.colour} className={lit(p.name, p.cabinet) ? 'seat' : 'seat is-dim'} data-party={p.name} />
        })}
        <text x={CX} y={CY - 40} textAnchor="middle" className="seat-total">
          {party ? `${c.parties.find((p) => p.name === party)!.seats} seats` : cabinet ? `${held} seats` : `${SEATS} seats`}
        </text>
        <text x={CX} y={CY - 16} textAnchor="middle" className="seat-sub">
          {cabinet && !party ? (held >= MAJORITY ? `a majority: ${MAJORITY} needed` : `short of a majority: ${MAJORITY} needed`) : `${MAJORITY} for a majority`}
        </text>
      </svg>
      <figcaption>
        <p className="seat-title">
          {c.title}, after the election of {c.election}
        </p>
        <ul className="seat-parties">
          {c.parties.map((p) => (
            <li key={p.name}>
              <button type="button" className={party === p.name ? 'is-on' : ''} aria-pressed={party === p.name} onClick={() => setParty(party === p.name ? null : p.name)}>
                <span className="key-swatch" style={{ background: p.colour }} aria-hidden="true" />
                {p.name} <b>{p.seats}</b>
                {p.side && <span className="seat-side"> · {sides[p.side]}</span>}
              </button>
            </li>
          ))}
        </ul>
        {!hideCabinet && (
          <label className="seat-cabinet">
            <input type="checkbox" checked={cabinet} onChange={(e) => (setCabinet(e.target.checked), setParty(null))} /> Show the government: {c.cabinet}
          </label>
        )}
      </figcaption>
    </figure>
  )
}
