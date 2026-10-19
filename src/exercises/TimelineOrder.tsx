import { useMemo, useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { isChronological } from '../lesson/scoring'
import { shuffle } from '../lesson/shuffle'
import type { ExerciseProps } from './types'

export function TimelineOrder({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'order'>>) {
  const pool = useMemo(() => shuffle(exercise.items.map((_, i) => i)), [exercise])
  const [placed, setPlaced] = useState<number[]>([])

  const update = (next: number[]) => {
    setPlaced(next)
    setAnswer(
      next.length === exercise.items.length
        ? () => ({
            correct: isChronological(next.map((i) => exercise.items[i].year)),
            detail: exercise.explain,
          })
        : null,
    )
  }

  const sorted = [...exercise.items].sort((a, b) => a.year - b.year)

  return (
    <div className="exercise">
      <p className="eyebrow">Timeline</p>
      <h2>{exercise.prompt}</h2>
      <ol className="timeline">
        {exercise.items.map((_, slot) => {
          const i = placed[slot]
          const item = i === undefined ? undefined : exercise.items[i]
          const right = checked && item && item.year === sorted[slot].year
          return (
            <li key={slot} className={`timeline-slot ${item ? 'filled' : ''} ${checked ? (right ? 'right' : 'wrong') : ''}`}>
              <span className="timeline-dot" />
              {item ? (
                <button type="button" className="timeline-card" disabled={checked} onClick={() => update(placed.filter((p) => p !== i))}>
                  <span>{item.label}</span>
                  {checked && <span className="when">{item.when}</span>}
                </button>
              ) : (
                <span className="timeline-empty">{slot === 0 ? 'Oldest' : slot === exercise.items.length - 1 ? 'Most recent' : ''}</span>
              )}
            </li>
          )
        })}
      </ol>
      {checked ? (
        <ol className="timeline-answer">
          {sorted.map((item) => (
            <li key={item.label}>
              <strong>{item.when}</strong> {item.label}
            </li>
          ))}
        </ol>
      ) : (
        <div className="chip-pool">
          {pool
            .filter((i) => !placed.includes(i))
            .map((i) => (
              <button type="button" key={i} className="chip" onClick={() => update([...placed, i])}>
                {exercise.items[i].label}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
