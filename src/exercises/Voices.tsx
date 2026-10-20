import { useMemo, useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { shuffle } from '../lesson/shuffle'
import { Credit, Photo } from '../photos/Photo'
import type { ExerciseProps } from './types'

// Two voices: people of the time, often on opposite sides, each in their own words,
// side by side. The question needs both read.
export function Voices({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'voices'>>) {
  const order = useMemo(() => shuffle(exercise.options.map((_, i) => i)), [exercise])
  const [picked, setPicked] = useState<number | null>(null)

  const pick = (i: number) => {
    if (checked) return
    setPicked(i)
    const correct = i === exercise.answer
    const lead = correct ? '' : `The answer is "${exercise.options[exercise.answer]}". `
    setAnswer(() => ({ correct, detail: `${lead}${exercise.explain}` }))
  }

  return (
    <div className="exercise exercise-voices">
      <p className="eyebrow">{exercise.voices.length === 2 ? 'Two voices' : 'Three voices'}</p>
      <h2>{exercise.prompt}</h2>
      <div className="voices">
        {exercise.voices.map((v) => (
          <figure key={v.who} className="voice">
            {v.photo && <Photo id={v.photo} className="photo voice-photo" />}
            <blockquote className="source-quote">
              “{v.text}”<cite>{v.who}, {v.when}</cite>
            </blockquote>
            {v.photo && (
              <figcaption className="photo-credit">
                Picture: <Credit id={v.photo} />
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      <div className="options">
        {order.map((i) => {
          const state = checked ? (i === exercise.answer ? 'right' : i === picked ? 'wrong' : 'dim') : i === picked ? 'picked' : ''
          return (
            <button type="button" key={i} className={`option ${state}`} aria-pressed={i === picked} onClick={() => pick(i)} disabled={checked}>
              {exercise.options[i]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
