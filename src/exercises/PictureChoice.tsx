import { useMemo, useState } from 'react'
import { Art } from '../art/Art'
import type { ExerciseOf } from '../content/schema'
import { Photo } from '../photos/Photo'
import { shuffle } from '../lesson/shuffle'
import type { ExerciseProps } from './types'
import { VisualView } from './VisualView'

export function PictureChoice({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'choice'>>) {
  const order = useMemo(() => shuffle(exercise.options.map((_, i) => i)), [exercise])
  const [picked, setPicked] = useState<number | null>(null)
  const pictures = exercise.options.some((o) => o.art || o.photo)

  const pick = (i: number) => {
    if (checked) return
    setPicked(i)
    const correct = i === exercise.answer
    const why = exercise.options[i].why
    const right = exercise.options[exercise.answer]
    setAnswer(() => ({ correct, detail: correct ? why : `${why} ${right.why}` }))
  }

  return (
    <div className="exercise">
      <p className="eyebrow">{pictures ? 'Pick the picture' : 'Choose'}</p>
      <h2>{exercise.prompt}</h2>
      {exercise.visual && <VisualView visual={exercise.visual} label={exercise.prompt} />}
      <div className={pictures ? 'options options-grid' : 'options'}>
        {order.map((i) => {
          const o = exercise.options[i]
          const state = checked ? (i === exercise.answer ? 'right' : i === picked ? 'wrong' : 'dim') : i === picked ? 'picked' : ''
          return (
            <button
              type="button"
              key={i}
              className={`option ${state}`}
              aria-pressed={i === picked}
              onClick={() => pick(i)}
              disabled={checked}
            >
              {o.art && <Art id={o.art} className="art art-option" />}
              {o.photo && <Photo id={o.photo} className="photo photo-option" />}
              {o.label && <span>{o.label}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
