import { useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { photo } from '../photos'
import { Credit } from '../photos/Photo'
import { ZoomImage } from '../photos/ZoomImage'
import type { ExerciseProps } from './types'

// A little slack around the target box, as a fraction of the picture, so a tap on
// its edge still counts.
const SLACK = 0.03

// Detail hunt: tap the detail the prompt asks for inside a painting or photo. The
// picture can be zoomed into, so small details in big paintings can be found.
export function DetailHunt({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'hunt'>>) {
  const [tap, setTap] = useState<[number, number] | null>(null)
  const p = photo(exercise.photo)

  const onTap = (x: number, y: number) => {
    if (checked) return
    setTap([x, y])
    const correct = exercise.targets.some(
      ([left, top, width, height]) =>
        x >= left - SLACK && x <= left + width + SLACK && y >= top - SLACK && y <= top + height + SLACK,
    )
    const lead = correct ? 'Found it.' : exercise.targets.length > 1 ? 'Not there; look in the boxes.' : "Not there; it's in the box."
    setAnswer(() => ({ correct, detail: `${lead} ${exercise.explain}` }))
  }

  const pct = (n: number) => `${n * 100}%`
  return (
    <div className="exercise">
      <p className="eyebrow">Find the detail</p>
      <h2>{exercise.prompt}</h2>
      <figure className="photo-figure">
        <ZoomImage src={p.src} alt={p.alt} onTap={onTap} className={`hunt-image${checked ? '' : ' hunt-live'}`}>
          {checked &&
            exercise.targets.map(([left, top, width, height], i) => (
              <span key={i} className="hunt-target" style={{ left: pct(left), top: pct(top), width: pct(width), height: pct(height) }} />
            ))}
          {tap && <span className="hunt-tap" style={{ left: pct(tap[0]), top: pct(tap[1]) }} />}
        </ZoomImage>
        <figcaption>
          {p.caption} · <span className="photo-credit">Credit: <Credit id={exercise.photo} /></span>
        </figcaption>
      </figure>
      {!tap && <p className="hint">Tap the picture where you see it. Zoom in with + to look closer; tap again to move your mark.</p>}
    </div>
  )
}
