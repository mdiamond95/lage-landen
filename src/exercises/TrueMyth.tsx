import { useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import type { ExerciseProps } from './types'
import { VisualView } from './VisualView'

export function TrueMyth({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'truemyth'>>) {
  const [picked, setPicked] = useState<boolean | null>(null)
  const pick = (v: boolean) => {
    if (checked) return
    setPicked(v)
    setAnswer(() => ({ correct: v === exercise.answer, detail: exercise.explain }))
  }
  const cls = (v: boolean) =>
    checked ? (v === exercise.answer ? 'right' : v === picked ? 'wrong' : 'dim') : v === picked ? 'picked' : ''
  return (
    <div className="exercise">
      <p className="eyebrow">True or myth?</p>
      <blockquote className="claim">{exercise.statement}</blockquote>
      {exercise.visual && <VisualView visual={exercise.visual} label={exercise.statement} hideCaption={!checked} />}
      <div className="options options-two">
        <button type="button" className={`option big ${cls(true)}`} onClick={() => pick(true)} disabled={checked} aria-pressed={picked === true}>
          True
        </button>
        <button type="button" className={`option big ${cls(false)}`} onClick={() => pick(false)} disabled={checked} aria-pressed={picked === false}>
          Myth
        </button>
      </div>
    </div>
  )
}
