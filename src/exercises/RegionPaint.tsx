import { useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { LowlandsMap } from '../map/LowlandsMap'
import { countries, provinces } from '../map/geo'
import { sameSet } from '../lesson/scoring'
import type { ExerciseProps } from './types'

const nameOf = (id: string) =>
  [...countries, ...provinces].find((f) => f.properties.id === id)?.properties.name ?? id

export function RegionPaint({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'region'>>) {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) => {
    if (checked) return
    const next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    setSelected(next)
    setAnswer(
      next.length === 0
        ? null
        : () => ({ correct: sameSet(next, exercise.answer), detail: exercise.explain }),
    )
  }

  return (
    <div className="exercise">
      <p className="eyebrow">{exercise.layer === 'countries' ? 'Find the country' : 'Paint the region'}</p>
      <h2>{exercise.prompt}</h2>
      <div className="map-frame">
        <LowlandsMap
          label={`Map for: ${exercise.prompt}`}
          mode={checked ? 'view' : 'region'}
          layer={exercise.layer}
          selected={selected}
          correct={checked ? exercise.answer : undefined}
          onRegion={toggle}
        />
      </div>
      <p className="hint">
        {selected.length === 0 ? 'Tap a shape to colour it in.' : `Selected: ${selected.map(nameOf).join(', ')}`}
      </p>
    </div>
  )
}
