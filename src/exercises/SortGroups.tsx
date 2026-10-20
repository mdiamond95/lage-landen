import { useMemo, useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { shuffle } from '../lesson/shuffle'
import { Photo } from '../photos/Photo'
import type { ExerciseProps } from './types'
import { VisualView } from './VisualView'

// Sort into groups: tap a card, then the group it belongs in. Cards already sorted
// can be tapped again to move them. Every card has to land in the right group.
export function SortGroups({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'sort'>>) {
  const order = useMemo(() => shuffle(exercise.items.map((_, i) => i)), [exercise])
  const [placed, setPlaced] = useState<(number | null)[]>(() => exercise.items.map(() => null))
  const [picked, setPicked] = useState<number | null>(null)

  const place = (group: number) => {
    if (checked || picked === null) return
    const next = placed.map((g, i) => (i === picked ? group : g))
    setPlaced(next)
    setPicked(null)
    if (next.some((g) => g === null)) return setAnswer(null)
    const wrong = exercise.items.map((it, i) => ({ ...it, i })).filter((it) => next[it.i] !== it.group)
    const lead = wrong.length
      ? `${wrong.map((w) => `${w.label} belongs under ${exercise.groups[w.group]}`).join('; ')}. `
      : ''
    setAnswer(() => ({ correct: wrong.length === 0, detail: `${lead}${exercise.explain}` }))
  }

  const card = (i: number) => {
    const it = exercise.items[i]
    const state = checked ? (placed[i] === it.group ? 'right' : 'wrong') : picked === i ? 'picked' : ''
    return (
      <button
        type="button"
        key={i}
        className={`option sort-card ${state}`}
        aria-pressed={picked === i}
        onClick={() => !checked && setPicked(picked === i ? null : i)}
        disabled={checked}
      >
        {it.photo && <Photo id={it.photo} className="photo photo-option" />}
        <span>{it.label}</span>
      </button>
    )
  }

  const loose = order.filter((i) => placed[i] === null)

  return (
    <div className="exercise">
      <p className="eyebrow">Sort into groups</p>
      <h2>{exercise.prompt}</h2>
      {exercise.visual && <VisualView visual={exercise.visual} label={exercise.prompt} />}
      {loose.length > 0 && (
        <>
          <p className="sort-hint muted">{picked === null ? 'Tap a card, then the group it belongs in.' : 'Now tap its group.'}</p>
          <div className={`sort-pool${exercise.items.some((it) => it.photo) ? ' sort-pool-pictures' : ''}`}>{loose.map(card)}</div>
        </>
      )}
      <div className={`sort-groups sort-groups-${exercise.groups.length}`}>
        {exercise.groups.map((g, gi) => (
          <div key={g} className={`sort-group${picked !== null ? ' sort-ready' : ''}`}>
            <button type="button" className="sort-group-head" onClick={() => place(gi)} disabled={checked || picked === null}>
              {g}
            </button>
            <div className="sort-group-items">{order.filter((i) => placed[i] === gi).map(card)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
