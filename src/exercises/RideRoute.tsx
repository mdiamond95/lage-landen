import { useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { routes } from '../data/routes'
import { RouteMap } from '../map/RouteMap'
import type { ExerciseProps } from './types'

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
    setAnswer(() => ({ correct: ok, detail: ok ? exercise.explain : `The race passes ${names(exercise.ask)}. ${exercise.explain}` }))
  }

  return (
    <div className="exercise exercise-ride">
      <p className="eyebrow">Ride the route</p>
      <h2>{exercise.prompt}</h2>
      <RouteMap route={exercise.route} mode="pick" show={exercise.show} picked={picked} correct={checked ? exercise.ask : undefined} onPick={pick} />
      <p className="hint">
        {checked
          ? `You picked ${picked.length ? names(picked) : 'nothing'}.`
          : need === 1
            ? picked.length
              ? 'Place picked. Tap another to change your mind.'
              : 'Tap the place on the route.'
            : `Tap ${need} places in order: ${picked.length} of ${need} picked. Tap a picked place to take it back.`}
      </p>
    </div>
  )
}
