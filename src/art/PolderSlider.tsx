import { useState } from 'react'
import { t } from '../i18n'

// Cross-section from the North Sea to a polder. Heights are metres relative to
// NAP, the Dutch reference level that is roughly average sea level.
const Y = (m: number) => 104 - m * 8
const POLDER = -5
const CREST = 9

export function PolderSlider() {
  const [sea, setSea] = useState(0)
  const [dike, setDike] = useState(true)
  const flooded = !dike || sea > CREST

  const seaY = Y(sea)
  const land = `M0 ${Y(-12)} L50 ${Y(-4)} L90 ${Y(-0.5)} ` +
    (dike ? `L140 ${Y(CREST)} L165 ${Y(CREST)} L205 ${Y(POLDER)} ` : `L150 ${Y(-1.5)} L205 ${Y(POLDER)} `) +
    `L400 ${Y(POLDER)} L400 220 L0 220 Z`

  return (
    <figure className="polder-slider">
      <svg viewBox="0 0 400 220" role="img" aria-label={`Cross-section of a dike with the sea at ${sea} metres${flooded ? ', the polder is flooded' : ''}`}>
        <rect width="400" height="220" fill="var(--art-sky)" />
        <path d={`M0 ${seaY} H${flooded ? 400 : 152} V220 H0 Z`} fill="var(--art-water)" opacity={flooded ? 0.85 : 1} />
        <path d={land} fill="var(--art-grass)" />
        <path d={`M205 ${Y(POLDER)} H400`} stroke="var(--art-grass-dark)" strokeWidth="3" />
        {!flooded && (
          <g>
            <path d={`M262 ${Y(POLDER) - 12} l10 -10 10 10z`} fill="var(--art-roof)" />
            <rect x="264" y={Y(POLDER) - 12} width="16" height="12" fill="var(--art-wall)" />
            <circle cx="330" cy={Y(POLDER) - 4} r="4" fill="var(--art-sail)" />
          </g>
        )}
        <line x1="0" x2="400" y1={Y(0)} y2={Y(0)} stroke="var(--ink-soft)" strokeDasharray="4 4" />
        <text x="396" y={Y(0) - 4} textAnchor="end" className="tiny">0 m (NAP)</text>
        <text x="396" y={Y(POLDER) + 16} textAnchor="end" className="tiny">polder, 5 m below</text>
        <text x="8" y={seaY - 6} className="tiny">sea {sea > 0 ? `+${sea}` : sea} m</text>
        {dike && <text x="152" y={Y(CREST) - 6} textAnchor="middle" className="tiny">dike, +9 m</text>}
      </svg>
      <figcaption>
        <label className="slider-row">
          <span>{t('Sea level')}</span>
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={sea}
            onChange={(e) => setSea(Number(e.target.value))}
            aria-label={t('Sea level in metres')}
          />
          <span className="slider-value">{sea === 0 ? t('Calm') : sea >= 4.5 ? t('1953 storm') : `+${sea} m`}</span>
        </label>
        <button type="button" className="btn-ghost" onClick={() => setDike((d) => !d)}>
          {dike ? t('Take the dike away') : t('Put the dike back')}
        </button>
      </figcaption>
    </figure>
  )
}
