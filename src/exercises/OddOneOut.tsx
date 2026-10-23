import { useMemo, useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { shuffle } from '../lesson/shuffle'
import { Photo } from '../photos/Photo'
import type { ExerciseProps } from './types'
import { t } from '../i18n'

// Odd one out: pick the item that doesn't belong, then the reason why. The reasons
// only appear once an item is picked, and both must be right.
export function OddOneOut({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'odd'>>) {
  const order = useMemo(() => shuffle(exercise.items.map((_, i) => i)), [exercise])
  const reasons = useMemo(() => shuffle(exercise.reasons.map((_, i) => i)), [exercise])
  const [item, setItem] = useState<number | null>(null)
  const [reason, setReason] = useState<number | null>(null)
  const pictures = exercise.items.some((i) => i.photo)

  const choose = (nextItem: number | null, nextReason: number | null) => {
    setItem(nextItem)
    setReason(nextReason)
    if (nextItem === null || nextReason === null) return setAnswer(null)
    const rightItem = nextItem === exercise.answer
    const rightReason = nextReason === exercise.reason
    const odd = exercise.items[exercise.answer].label
    const lead = rightItem && rightReason ? '' : rightItem ? `${t('Right one, wrong reason.')} ` : `${t('The odd one out is {odd}.', { odd })} `
    setAnswer(() => ({ correct: rightItem && rightReason, detail: `${lead}${exercise.explain}` }))
  }

  const state = (i: number, picked: number | null, answer: number) =>
    checked ? (i === answer ? 'right' : i === picked ? 'wrong' : 'dim') : i === picked ? 'picked' : ''

  return (
    <div className="exercise exercise-odd">
      <p className="eyebrow">{t('Odd one out')}</p>
      <h2>{exercise.prompt}</h2>
      <div className={pictures ? 'options options-grid' : 'options options-two'}>
        {order.map((i) => {
          const it = exercise.items[i]
          return (
            <button
              type="button"
              key={i}
              className={`option ${state(i, item, exercise.answer)}`}
              aria-pressed={i === item}
              onClick={() => !checked && choose(i, reason)}
              disabled={checked}
            >
              {it.photo && <Photo id={it.photo} className="photo photo-option" />}
              <span>{it.label}</span>
            </button>
          )
        })}
      </div>
      {item !== null && (
        <div className="odd-reasons">
          <p className="odd-why">{t("Why doesn't it belong?")}</p>
          <div className="options">
            {reasons.map((r) => (
              <button
                type="button"
                key={r}
                className={`option ${state(r, reason, exercise.reason)}`}
                aria-pressed={r === reason}
                onClick={() => !checked && choose(item, r)}
                disabled={checked}
              >
                {exercise.reasons[r]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
