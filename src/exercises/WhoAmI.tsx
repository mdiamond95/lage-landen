import { useMemo, useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { shuffle } from '../lesson/shuffle'
import { XP } from '../lesson/scoring'
import { PhotoFigure } from '../photos/Photo'
import type { ExerciseProps } from './types'

// Clues appear one at a time; guess as early as you dare. Answering right before
// the last clue earns the bonus.
export function WhoAmI({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'who'>>) {
  const order = useMemo(() => shuffle(exercise.options.map((_, i) => i)), [exercise])
  const [shown, setShown] = useState(1)
  const [picked, setPicked] = useState<number | null>(null)
  const total = exercise.clues.length
  const visible = checked ? total : shown

  // Re-armed whenever the pick or the number of clues changes, since both decide the score.
  const answer = (pick: number, clues: number) => {
    const correct = pick === exercise.answer
    const early = correct && clues < total
    const name = exercise.options[exercise.answer]
    // Most explanations open with the name already; don't say it twice.
    const first = name.split(' ')[0]
    const named = first !== 'The' && exercise.explain.startsWith(first)
    const detail = correct
      ? `${early ? `Got it after ${clues} of ${total} clues. ` : ''}${exercise.explain}`
      : named
        ? exercise.explain
        : `It was ${name}. ${exercise.explain}`
    setAnswer(() => ({ correct, bonus: early, detail }))
  }
  const pick = (i: number) => {
    if (checked) return
    setPicked(i)
    answer(i, shown)
  }
  const moreClues = () => {
    setShown(shown + 1)
    if (picked !== null) answer(picked, shown + 1)
  }

  return (
    <div className="exercise">
      <p className="eyebrow">Who am I?</p>
      <PhotoFigure id={exercise.photo} hideCredit={!checked} />
      <ol className="clues" aria-live="polite">
        {exercise.clues.slice(0, visible).map((c, i) => (
          <li key={i} className="clue">
            <span className="clue-num">{i + 1}</span>
            {c}
          </li>
        ))}
      </ol>
      {!checked && shown < total && (
        <button type="button" className="btn-ghost clue-more" onClick={moreClues}>
          Show clue {shown + 1} of {total}
        </button>
      )}
      {!checked && shown < total && <p className="hint">Answer before the last clue for +{XP.bonus} XP.</p>}
      <div className="options">
        {order.map((i) => {
          const state = checked ? (i === exercise.answer ? 'right' : i === picked ? 'wrong' : 'dim') : i === picked ? 'picked' : ''
          return (
            <button
              type="button"
              key={i}
              className={`option ${state}`}
              aria-pressed={i === picked}
              onClick={() => pick(i)}
              disabled={checked}
            >
              <span>{exercise.options[i]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
