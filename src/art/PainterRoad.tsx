import { useState } from 'react'
import { series, type SeriesId } from '../data/series'
import { photo } from '../photos'
import { Credit } from '../photos/Photo'
import { t } from '../i18n'

// A painter's road: one painter's pictures in the order they were made, one at a time on
// a slider, with the year and a word on what changed. `at` opens it at one picture.
export function PainterRoad({ id, at = 0 }: { id: SeriesId; at?: number }) {
  const s = series[id]
  const [i, setI] = useState(Math.min(at, s.steps.length - 1))
  const step = s.steps[i]
  const p = photo(step.photo)

  return (
    <figure className="photo-figure road">
      <div className="road-frame">
        <img key={step.photo} src={p.src} alt={p.alt} className="road-image" />
      </div>
      <div className="road-controls">
        <p className="road-year" aria-live="polite">
          {step.year}: {step.title}
        </p>
        <input
          type="range"
          min={0}
          max={s.steps.length - 1}
          step={1}
          value={i}
          aria-label={`${s.painter}, picture by picture`}
          aria-valuetext={`${step.year}: ${step.title}`}
          onChange={(e) => setI(Number(e.target.value))}
        />
        <div className="road-ticks" aria-hidden="true">
          {s.steps.map((st, j) => (
            <span key={st.photo} className={j === i ? 'is-active' : ''} />
          ))}
        </div>
        <p className="tour-text">{step.text}</p>
      </div>
      <figcaption>
        {p.caption} · <span className="photo-credit">{t('Credit:')} <Credit id={step.photo} /></span>
      </figcaption>
    </figure>
  )
}
