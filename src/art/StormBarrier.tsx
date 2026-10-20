import { useState } from 'react'

// Cross-section of the Oosterschelde barrier, from the North Sea to a polder behind
// the Oosterschelde. Raise the storm surge: the barrier's gates stay open for the tide
// and come down when the sea reaches 3 metres above NAP. Without the barrier the surge
// runs straight in, and over the dike once it is high enough. Heights are metres
// relative to NAP, the Dutch reference level that is roughly average sea level.
const Y = (m: number) => 120 - m * 9
const CLOSE_AT = 3
const STORM_1953 = 4.55
// A dike drawn for the picture, not a measured height.
const DIKE = 4
const POLDER = -2
// A normal high tide behind closed gates.
const TIDE = 1

export function StormBarrier() {
  const [sea, setSea] = useState(1)
  const [barrier, setBarrier] = useState(true)
  const closed = barrier && sea >= CLOSE_AT
  const inside = closed ? TIDE : sea
  const flooded = inside > DIKE

  const pillar = barrier && (
    <g>
      <rect x="182" y={Y(9)} width="22" height={Y(-6) - Y(9)} fill="var(--art-concrete)" stroke="var(--art-concrete-dark)" />
      <rect x="176" y={Y(9) - 6} width="34" height="8" fill="var(--art-concrete-dark)" />
      {/* The gate hangs above the water until it drops. */}
      <rect
        x="186"
        y={closed ? Y(5.5) : Y(9.5)}
        width="14"
        height={closed ? Y(-6) - Y(5.5) : 32}
        fill="var(--art-gate)"
        style={{ transition: 'y 0.5s, height 0.5s' }}
      />
    </g>
  )

  return (
    <figure className="polder-slider storm-barrier">
      <svg
        viewBox="0 0 400 200"
        role="img"
        aria-label={`Cross-section of the Oosterschelde with the sea at ${sea.toFixed(1)} metres above NAP. ${
          barrier ? (closed ? 'The barrier gates are closed.' : 'The barrier gates are open.') : 'There is no barrier.'
        }${flooded ? ' The water runs over the dike and floods the polder.' : ''}`}
      >
        <rect width="400" height="200" fill="var(--art-sky)" />
        {/* The North Sea on the left, the Oosterschelde in the middle, the polder on the right. */}
        <path d={`M0 ${Y(sea)} H193 V200 H0 Z`} fill="var(--art-water)" />
        <path d={`M193 ${Y(inside)} H${flooded ? 400 : 330} V200 H193 Z`} fill="var(--art-water)" opacity={0.9} />
        <path d={`M0 200 L0 ${Y(-6)} L400 ${Y(-6)} L400 200 Z`} fill="var(--art-thatch)" opacity={0.5} />
        <path
          d={`M300 200 L300 ${Y(-6)} L322 ${Y(DIKE)} L338 ${Y(DIKE)} L352 ${Y(POLDER)} L400 ${Y(POLDER)} L400 200 Z`}
          fill="var(--art-grass)"
        />
        {!flooded && (
          <g>
            <path d={`M362 ${Y(POLDER) - 12} l10 -10 10 10z`} fill="var(--art-roof)" />
            <rect x="364" y={Y(POLDER) - 12} width="16" height="12" fill="var(--art-wall)" />
          </g>
        )}
        {pillar}
        <line x1="0" x2="193" y1={Y(STORM_1953)} y2={Y(STORM_1953)} stroke="#b3261e" strokeDasharray="5 4" />
        <text x="6" y={Y(STORM_1953) - 4} className="tiny" fill="#b3261e">
          1953: +4.55 m
        </text>
        <line x1="0" x2="400" y1={Y(0)} y2={Y(0)} stroke="var(--ink-soft)" strokeDasharray="4 4" />
        <text x="396" y={Y(0) + 12} textAnchor="end" className="tiny">
          0 m (NAP)
        </text>
        <text x="6" y="192" className="tiny">
          North Sea
        </text>
        <text x="214" y="192" className="tiny">
          Oosterschelde
        </text>
        <text x="330" y={Y(DIKE) - 6} textAnchor="middle" className="tiny">
          dike
        </text>
        {barrier && (
          <text x="193" y={Y(9) - 10} textAnchor="middle" className="tiny">
            {closed ? 'gates down' : 'gates open'}
          </text>
        )}
      </svg>
      <figcaption>
        <label className="slider-row">
          <span>Storm surge</span>
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={sea}
            onChange={(e) => setSea(Number(e.target.value))}
            aria-label="Sea level in metres above NAP"
          />
          <span className="slider-value">+{sea.toFixed(1)} m</span>
        </label>
        <button type="button" className="btn-ghost" onClick={() => setBarrier((b) => !b)}>
          {barrier ? 'Take the barrier away' : 'Put the barrier back'}
        </button>
      </figcaption>
    </figure>
  )
}
