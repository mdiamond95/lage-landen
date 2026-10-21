import { useMemo, useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { shuffle } from '../lesson/shuffle'
import { photo } from '../photos'
import { Credit } from '../photos/Photo'
import { ZoomImage } from '../photos/ZoomImage'
import type { ExerciseProps } from './types'

const pct = (n: number) => `${n * 100}%`

// Label the parts: tap a label, then the numbered spot on the picture it belongs to (or
// the spot first, then the label). A placed label can be tapped off its spot again. Once
// every spot has a label the answer can be checked; every label has to be on its own spot.
export function LabelParts({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'label'>>) {
  const labels = useMemo(() => shuffle([...exercise.spots.map((s) => s.label), ...exercise.extra]), [exercise])
  // The label on each spot, by its place in `labels`.
  const [placed, setPlaced] = useState<(number | null)[]>(() => exercise.spots.map(() => null))
  const [label, setLabel] = useState<number | null>(null)
  const [spot, setSpot] = useState<number | null>(null)
  const p = photo(exercise.photo)

  const put = (s: number, l: number) => {
    const next = placed.map((x, i) => (i === s ? l : x === l ? null : x))
    setPlaced(next)
    setLabel(null)
    setSpot(null)
    if (next.some((x) => x === null)) return setAnswer(null)
    const wrong = exercise.spots.filter((sp, i) => labels[next[i]!] !== sp.label)
    const lead = wrong.length ? `${wrong.map((w) => `${exercise.spots.indexOf(w) + 1} is ${w.label}`).join('; ')}. ` : 'Every label in its place. '
    setAnswer(() => ({ correct: wrong.length === 0, detail: `${lead}${exercise.explain}` }))
  }

  const tapSpot = (s: number) => {
    if (checked) return
    if (label !== null) return put(s, label)
    if (placed[s] !== null) {
      setPlaced(placed.map((x, i) => (i === s ? null : x)))
      return setAnswer(null)
    }
    setSpot(spot === s ? null : s)
  }

  const tapLabel = (l: number) => {
    if (checked) return
    if (spot !== null) return put(spot, l)
    setLabel(label === l ? null : l)
  }

  const loose = labels.map((_, i) => i).filter((i) => !placed.includes(i))

  return (
    <div className="exercise exercise-label">
      <p className="eyebrow">Label the parts</p>
      <h2>{exercise.prompt}</h2>
      <figure className="photo-figure">
        <ZoomImage src={p.src} alt={p.alt} max={6} className="label-image">
          {exercise.spots.map((s, i) => {
            const on = placed[i]
            const state = checked ? (on !== null && labels[on] === s.label ? 'right' : 'wrong') : spot === i ? 'picked' : ''
            return (
              <button
                key={i}
                type="button"
                className={`label-spot ${state}${on !== null ? ' is-filled' : ''}${s.at[0] > 0.6 ? ' label-spot-left' : ''}`}
                style={{ left: pct(s.at[0]), top: pct(s.at[1]) }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => tapSpot(i)}
                disabled={checked}
                aria-label={`Spot ${i + 1}: ${on === null ? 'empty' : labels[on]}`}
              >
                <span className="label-num" aria-hidden="true">
                  {i + 1}
                </span>
                {on !== null && (
                  <span className="label-chip" aria-hidden="true">
                    {checked && labels[on] !== s.label ? (
                      <>
                        <s>{labels[on]}</s> <span className="label-fix">{s.label}</span>
                      </>
                    ) : (
                      labels[on]
                    )}
                  </span>
                )}
              </button>
            )
          })}
        </ZoomImage>
        <figcaption>
          {p.caption} · <span className="photo-credit">Credit: <Credit id={exercise.photo} /></span>
        </figcaption>
      </figure>
      {loose.length > 0 && !checked && (
        <>
          <p className="sort-hint muted">
            {label !== null ? 'Now tap its number on the picture.' : spot !== null ? `Now tap the label for ${spot + 1}.` : 'Tap a label, then its number on the picture.'}
          </p>
          <div className="label-pool" role="group" aria-label="Labels">
            {loose.map((l) => (
              <button key={l} type="button" className={`option label-card${label === l ? ' picked' : ''}`} aria-pressed={label === l} onClick={() => tapLabel(l)}>
                {labels[l]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
