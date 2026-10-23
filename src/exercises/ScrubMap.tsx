import { useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import type { ExerciseProps } from './types'
import { frameOf } from '../data/stories'
import { AnyTimeMap } from './VisualView'
import { t } from '../i18n'

// Border scrubber: drag the year slider until the map matches the prompt.
export function ScrubMap({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'scrub'>>) {
  const [moved, setMoved] = useState(false)
  const [from, to] = exercise.answer
  // Years, or months on the occupation map.
  const { format } = frameOf(exercise.map)
  const range = from === to ? format(from) : t('{from} to {to}', { from: format(from), to: format(to) })

  const onYear = (year: number) => {
    if (checked) return
    setMoved(true)
    const correct = year >= from && year <= to
    const lead = correct ? t('{year} it is.', { year: format(year) }) : t('You chose {year}; the answer is {range}.', { year: format(year), range })
    setAnswer(() => ({ correct, detail: `${lead} ${exercise.explain}` }))
  }

  return (
    <div className="exercise exercise-scrub">
      <p className="eyebrow">{t('Find the year')}</p>
      <h2>{exercise.prompt}</h2>
      <AnyTimeMap map={exercise.map} year={exercise.start} onYear={onYear} hideCaption={!checked} />
      {!moved && <p className="hint">{t('Drag the year slider, or press play and pause, until the map matches.')}</p>}
    </div>
  )
}
