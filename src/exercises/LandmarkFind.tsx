import { useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { cities, landmarkIds, landmarkOf } from '../data/cities'
import { CityMap, type CityPin } from '../map/CityMap'
import { PhotoFigure } from '../photos/Photo'
import type { ExerciseProps } from './types'
import { t } from '../i18n'

// Find it in town: tap the landmark asked for on the city's street map. The pins are unnamed
// but for those in `show` until the answer is checked; then the right one and a wrong pick are
// named, and the answer's photo shows.
export function LandmarkFind({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'landmark'>>) {
  const [picked, setPicked] = useState<string | null>(null)
  const city = cities[exercise.city]
  const ids = exercise.options ?? landmarkIds(exercise.city)
  const answer = landmarkOf(exercise.city, exercise.answer)

  const pick = (id: string) => {
    if (checked) return
    setPicked(id)
    setAnswer(() => {
      const ok = id === exercise.answer
      return { correct: ok, detail: ok ? exercise.explain : `${t('You picked {name}.', { name: landmarkOf(exercise.city, id).name })} ${exercise.explain}` }
    })
  }

  const pins: CityPin[] = ids.map((id) => {
    const shown = exercise.show.includes(id) ? landmarkOf(exercise.city, id).name : undefined
    if (!checked) return { id, state: id === picked ? 'on' : 'idle', label: shown }
    if (id === exercise.answer) return { id, state: id === picked ? 'right' : 'missed', label: answer.name }
    if (id === picked) return { id, state: 'wrong', label: landmarkOf(exercise.city, id).name }
    return { id, state: 'dim', label: shown }
  })

  return (
    <div className="exercise exercise-landmark">
      <p className="eyebrow">Find it in {city.name}</p>
      <h2>{exercise.prompt}</h2>
      <CityMap city={exercise.city} pins={pins} label={t('Street map of {city} with unnamed landmarks to tap', { city: city.name })} onPick={checked ? undefined : pick} zoom />
      {checked && answer.photo ? <PhotoFigure id={answer.photo} /> : <p className="hint">{picked ? t('Landmark picked. Tap another to change your mind.') : t('Tap a pin on the map.')}</p>}
    </div>
  )
}
