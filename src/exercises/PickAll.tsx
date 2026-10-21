import { useMemo, useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { shuffle } from '../lesson/shuffle'
import { Photo } from '../photos/Photo'
import type { ExerciseProps } from './types'
import { VisualView } from './VisualView'

// Pick all that belong (Unit 21): tap every card that fits, and none that doesn't, such as
// the spices in speculaas or the Trappist beers. Once checked, the ones missed are marked.
export function PickAll({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'pick'>>) {
  const order = useMemo(() => shuffle(exercise.items.map((_, i) => i)), [exercise])
  const [chosen, setChosen] = useState<Set<number>>(new Set())
  const right = new Set(exercise.answers)
  const pictures = exercise.items.some((i) => i.photo)

  const toggle = (i: number) => {
    if (checked) return
    const next = new Set(chosen)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    setChosen(next)
    if (next.size === 0) return setAnswer(null)
    const wrong = [...next].filter((j) => !right.has(j))
    const missed = exercise.answers.filter((j) => !next.has(j))
    const names = (js: number[]) => js.map((j) => exercise.items[j].label).join(', ')
    const lead = wrong.length ? `${names(wrong)} ${wrong.length > 1 ? "don't" : "doesn't"} belong. ` : missed.length ? `You missed ${names(missed)}. ` : ''
    setAnswer(() => ({ correct: wrong.length === 0 && missed.length === 0, detail: `${lead}${exercise.explain}` }))
  }

  const state = (i: number) => {
    if (!checked) return chosen.has(i) ? 'picked' : ''
    if (chosen.has(i)) return right.has(i) ? 'right' : 'wrong'
    return right.has(i) ? 'missed' : 'dim'
  }

  return (
    <div className="exercise exercise-pick">
      <p className="eyebrow">Pick all that belong</p>
      <h2>{exercise.prompt}</h2>
      {exercise.visual && <VisualView visual={exercise.visual} label={exercise.prompt} hideCaption={!checked} />}
      <div className={pictures ? 'options options-grid' : 'options options-two'}>
        {order.map((i) => {
          const it = exercise.items[i]
          return (
            <button type="button" key={i} className={`option ${state(i)}`} aria-pressed={chosen.has(i)} onClick={() => toggle(i)} disabled={checked}>
              {it.photo && <Photo id={it.photo} className="photo photo-option" />}
              <span>{it.label}</span>
            </button>
          )
        })}
      </div>
      <p className="hint">{checked ? `${exercise.answers.length} of the ${exercise.items.length} belong.` : 'Tap every card that belongs, then check.'}</p>
    </div>
  )
}
