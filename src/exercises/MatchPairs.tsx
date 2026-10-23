import { useMemo, useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { shuffle } from '../lesson/shuffle'
import type { ExerciseProps } from './types'
import { t } from '../i18n'

type Side = 'left' | 'right'

// Match pairs, or cause and effect: tap one card on each side to link them.
export function MatchPairs({ exercise, setAnswer }: ExerciseProps<ExerciseOf<'match'> | ExerciseOf<'cause'>>) {
  const cause = exercise.type === 'cause'
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
        const lead = mistakes === 0 ? t('Every pair matched first time.') : t(mistakes === 1 ? 'All matched, with 1 wrong try on the way.' : 'All matched, with {n} wrong tries on the way.', { n: mistakes })
        setAnswer(() => ({ correct: mistakes === 0, detail: cause ? `${lead} ${exercise.explain}` : lead }))
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
      <p className="eyebrow">{cause ? t('Cause and effect') : t('Match the pairs')}</p>
      <h2>{exercise.prompt}</h2>
      {cause && (
        <p className="cause-heads" aria-hidden="true">
          <span>{t('Cause')}</span>
          <span>{t('Effect')}</span>
        </p>
      )}
      <div className={`match-grid${cause ? ' cause-grid' : ''}`}>
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
