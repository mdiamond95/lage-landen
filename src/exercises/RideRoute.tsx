import { useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { routes } from '../data/routes'
import { RouteMap } from '../map/RouteMap'
import type { ExerciseProps } from './types'
import { t } from '../i18n'

// Ride the route (Unit 23): tap places on a race's route map in the order the race passes them.
// A tap on a place already picked takes it back, with any picked after it.
export function RideRoute({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'ride'>>) {
  const [picked, setPicked] = useState<string[]>([])
  const route = routes[exercise.route]
  const need = exercise.ask.length
  const names = (ids: string[]) => ids.map((p) => route.places[p].name).join(', then ')

  const pick = (p: string) => {
    if (checked) return
    const i = picked.indexOf(p)
    const next = i >= 0 ? picked.slice(0, i) : picked.length < need ? [...picked, p] : [...picked.slice(0, need - 1), p]
    setPicked(next)
    if (next.length < need) return setAnswer(null)
    const ok = next.every((q, j) => q === exercise.ask[j])
    setAnswer(() => ({ correct: ok, detail: ok ? exercise.explain : `${t('In order: {names}.', { names: names(exercise.ask) })} ${exercise.explain}` }))
  }

  return (
    <div className="exercise exercise-ride">
      <p className="eyebrow">{t('Ride the route')}</p>
      <h2>{exercise.prompt}</h2>
      <RouteMap route={exercise.route} mode="pick" show={exercise.show} picked={picked} need={need} correct={checked ? exercise.ask : undefined} onPick={pick} />
      <p className="hint">
        {checked
          ? t('You picked {names}.', { names: picked.length ? names(picked) : t('nothing') })
          : need === 1
            ? picked.length
              ? t('Place picked. Tap another to change your mind.')
              : t('Tap the place on the route.')
            : t('Tap {need} places in order: {n} of {need} picked. Tap a picked place to take it back.', { need, n: picked.length })}
      </p>
    </div>
  )
}
