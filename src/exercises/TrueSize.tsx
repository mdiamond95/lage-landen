import { useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { shapes, type ShapeId } from '../data/projections'
import { km2, ProjectionMap } from '../map/ProjectionMap'
import type { ExerciseProps } from './types'
import { t } from '../i18n'

// The answer to a true-size question: the biggest of its shapes, or the smallest.
export const trueSizeAnswer = (e: Pick<ExerciseOf<'truesize'>, 'shapes' | 'ask'>): ShapeId =>
  [...e.shapes].sort((a, b) => (e.ask === 'bigger' ? shapes[b].area - shapes[a].area : shapes[a].area - shapes[b].area))[0]

// True size (Unit 25): Mercator's map with two or three countries on it, which can be dragged to the
// same latitude to compare them fairly. Pick the one that is really bigger (or smaller). Once
// checked, the true sizes show, and the map can be switched to equal area or a globe.
export function TrueSize({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'truesize'>>) {
  const [picked, setPicked] = useState<ShapeId>()
  const answer = trueSizeAnswer(exercise)
  const sized = exercise.shapes.map((id) => `${shapes[id].name} ${km2(shapes[id].area)}`).join(', ')

  const pick = (id: ShapeId) => {
    if (checked) return
    setPicked(id)
    const ok = id === answer
    setAnswer(() => ({ correct: ok, detail: `${ok ? '' : `${shapes[answer].name} is ${exercise.ask}. `}${sized}. ${exercise.explain}` }))
  }

  return (
    <div className="exercise exercise-truesize">
      <p className="eyebrow">{t('True size')}</p>
      <h2>{exercise.prompt}</h2>
      <ProjectionMap key={checked ? 'checked' : 'asking'} shapes={exercise.shapes} fixed={!checked} sizes={checked} picked={picked} label={t("Mercator's map of the world, with countries to drag")} />
      <div className="options options-two truesize-options" role="group" aria-label={t('Which is really {ask}?', { ask: exercise.ask })}>
        {exercise.shapes.map((id, i) => (
          <button
            key={id}
            type="button"
            data-shape={id}
            className={`option truesize-option${checked ? (id === answer ? ' right' : picked === id ? ' wrong' : ' dim') : picked === id ? ' picked' : ''}`}
            aria-pressed={picked === id}
            onClick={() => pick(id)}
            disabled={checked}
          >
            <span className={`key-swatch shape-swatch shape-${i}`} />
            {shapes[id].name}
          </button>
        ))}
      </div>
      <p className="hint">{checked ? t('Now switch the map to equal area or the globe.') : t('Drag the shapes to the same latitude to compare them fairly, then pick one.')}</p>
    </div>
  )
}
