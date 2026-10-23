import { useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { dialects, type DialectId } from '../data/dialects'
import { DialectMap } from '../map/DialectMap'
import { SoundFigure } from '../sounds/Sound'
import type { ExerciseProps } from './types'
import { t } from '../i18n'

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
      detail: id === exercise.answer ? exercise.explain : `${t('That was {right}, not {wrong}.', { right: right.name, wrong: dialects[id].name })} ${exercise.explain}`,
    }))
  }

  return (
    <div className="exercise">
      <p className="eyebrow">{t('Listen and find')}</p>
      <h2>{exercise.prompt}</h2>
      <SoundFigure id={exercise.sound} hideWords={!checked} hideLanguage={!checked} />
      <DialectMap mode="pick" picked={picked} correct={checked ? exercise.answer : undefined} onPick={pick} />
      <p className="hint">{checked && picked ? t('You picked {name}.', { name: dialects[picked].name }) : picked ? t('Region picked. Tap another to change your mind.') : t('Play the recording, then tap where it is spoken.')}</p>
    </div>
  )
}
