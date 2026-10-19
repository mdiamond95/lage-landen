import { useMemo, useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { shuffle } from '../lesson/shuffle'
import type { ExerciseProps } from './types'

type Side = 'left' | 'right'

export function MatchPairs({ exercise, setAnswer }: ExerciseProps<ExerciseOf<'match'>>) {
  const left = useMemo(() => shuffle(exercise.pairs.map((_, i) => i)), [exercise])
  const right = useMemo(() => shuffle(exercise.pairs.map((_, i) => i)), [exercise])
  const [pending, setPending] = useState<{ side: Side; i: number } | null>(null)
  const [done, setDone] = useState<number[]>([])
  const [mistakes, setMistakes] = useState(0)
  const [flash, setFlash] = useState<string[]>([])

  const tap = (side: Side, i: number) => {
    if (done.includes(i)) return
    if (!pending || pending.side === side) return setPending({ side, i })
    if (pending.i === i) {
      const next = [...done, i]
      setDone(next)
      setPending(null)
      if (next.length === exercise.pairs.length) {
        setAnswer(() => ({
          correct: mistakes === 0,
          detail: mistakes === 0 ? 'Every pair matched first time.' : `All matched, with ${mistakes} wrong ${mistakes === 1 ? 'try' : 'tries'} on the way.`,
        }))
      }
    } else {
      setMistakes((m) => m + 1)
      setFlash([`${pending.side}-${pending.i}`, `${side}-${i}`])
      setPending(null)
      setTimeout(() => setFlash([]), 450)
    }
  }

  const cls = (side: Side, i: number) =>
    done.includes(i) ? 'matched' : pending?.side === side && pending.i === i ? 'picked' : flash.includes(`${side}-${i}`) ? 'wrong' : ''

  return (
    <div className="exercise">
      <p className="eyebrow">Match the pairs</p>
      <h2>{exercise.prompt}</h2>
      <div className="match-grid">
        <div className="match-col">
          {left.map((i) => (
            <button type="button" key={i} className={`option ${cls('left', i)}`} onClick={() => tap('left', i)} disabled={done.includes(i)}>
              {exercise.pairs[i][0]}
            </button>
          ))}
        </div>
        <div className="match-col">
          {right.map((i) => (
            <button type="button" key={i} className={`option ${cls('right', i)}`} onClick={() => tap('right', i)} disabled={done.includes(i)}>
              {exercise.pairs[i][1]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
