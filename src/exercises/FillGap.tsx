import { useMemo, useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { shuffle } from '../lesson/shuffle'
import type { ExerciseProps } from './types'
import { VisualView } from './VisualView'

// Fill the gap: pick the word missing from a quote out of a letter, treaty or song.
export function FillGap({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'gap'>>) {
  const order = useMemo(() => shuffle(exercise.options.map((_, i) => i)), [exercise])
  const [picked, setPicked] = useState<number | null>(null)
  const [before, after] = exercise.quote.split('___')

  const pick = (i: number) => {
    if (checked) return
    setPicked(i)
    const correct = i === exercise.answer
    const lead = correct ? '' : `The missing word is "${exercise.options[exercise.answer]}". `
    setAnswer(() => ({ correct, detail: `${lead}${exercise.explain}` }))
  }

  const shown = checked ? exercise.answer : picked
  const gapState = checked ? (picked === exercise.answer ? 'right' : 'wrong') : ''
  return (
    <div className="exercise">
      <p className="eyebrow">Fill the gap</p>
      <h2>{exercise.prompt}</h2>
      {exercise.visual && <VisualView visual={exercise.visual} label={exercise.source} hideCaption={!checked} />}
      <blockquote className="source-quote">
        “{before}
        <span className={`gap ${gapState}`}>{shown === null ? ' ' : exercise.options[shown]}</span>
        {after}”<cite>{exercise.source}</cite>
      </blockquote>
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
