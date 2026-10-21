import { useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { dialects, type DialectId } from '../data/dialects'
import { DialectMap } from '../map/DialectMap'
import { SoundFigure } from '../sounds/Sound'
import type { ExerciseProps } from './types'

// Listen and find (Unit 20): play the recording, then tap where it is spoken on the
// dialect map. The regions are unnamed until the answer is checked.
export function ListenMap({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'listen'>>) {
  const [picked, setPicked] = useState<DialectId | null>(null)

  const pick = (id: DialectId) => {
    if (checked) return
    setPicked(id)
    const right = dialects[exercise.answer]
    setAnswer(() => ({
      correct: id === exercise.answer,
      detail: id === exercise.answer ? exercise.explain : `That was ${right.name}, not ${dialects[id].name}. ${exercise.explain}`,
    }))
  }

  return (
    <div className="exercise">
      <p className="eyebrow">Listen and find</p>
      <h2>{exercise.prompt}</h2>
      <SoundFigure id={exercise.sound} hideWords={!checked} hideLanguage={!checked} />
      <DialectMap mode="pick" picked={picked} correct={checked ? exercise.answer : undefined} onPick={pick} />
      <p className="hint">{checked && picked ? `You picked ${dialects[picked].name}.` : picked ? 'Region picked. Tap another to change your mind.' : 'Play the recording, then tap where it is spoken.'}</p>
    </div>
  )
}
