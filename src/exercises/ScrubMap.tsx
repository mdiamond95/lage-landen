import { useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import type { ExerciseProps } from './types'
import { AnyTimeMap } from './VisualView'

// Border scrubber: drag the year slider until the map matches the prompt.
export function ScrubMap({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'scrub'>>) {
  const [moved, setMoved] = useState(false)
  const [from, to] = exercise.answer
  const range = from === to ? String(from) : `${from} to ${to}`

  const onYear = (year: number) => {
    if (checked) return
    setMoved(true)
    const correct = year >= from && year <= to
    const lead = correct ? `${year} it is.` : `You chose ${year}; the answer is ${range}.`
    setAnswer(() => ({ correct, detail: `${lead} ${exercise.explain}` }))
  }

  return (
    <div className="exercise exercise-scrub">
      <p className="eyebrow">Find the year</p>
      <h2>{exercise.prompt}</h2>
      <AnyTimeMap map={exercise.map} year={exercise.start} onYear={onYear} hideCaption={!checked} />
      {!moved && <p className="hint">Drag the year slider, or press play and pause, until the map matches.</p>}
    </div>
  )
}
