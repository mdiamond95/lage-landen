import { useMemo, useState } from 'react'
import { Balloon, PanelFrame, StripCredits } from '../art/ComicStrip'
import type { ExerciseOf } from '../content/schema'
import { shuffle } from '../lesson/shuffle'
import type { ExerciseProps } from './types'
import { t } from '../i18n'

// Comic panel matching (Unit 24). Balloons: tap a balloon, then the panel it belongs in; tap a
// placed balloon to take it back. Order: tap the panels in the order the story happens; tap a
// placed panel to take it back, with those after it. Every panel has to be right.
export function ComicPanels({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'panels'>>) {
  return exercise.order ? <PanelOrder exercise={exercise} checked={checked} setAnswer={setAnswer} /> : <PanelBalloons exercise={exercise} checked={checked} setAnswer={setAnswer} />
}

const short = (s: string) => (s.length > 48 ? `${s.slice(0, 45).trimEnd()}…` : s)

function PanelBalloons({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'panels'>>) {
  const { panels } = exercise
  // Balloons 0..n-1 belong to the panels of the same index; the spares come after.
  const says = useMemo(() => [...panels.map((p) => p.say), ...exercise.extra], [exercise, panels])
  const pool = useMemo(() => shuffle(says.map((_, i) => i)), [says])
  const [placed, setPlaced] = useState<(number | null)[]>(() => panels.map(() => null))
  const [picked, setPicked] = useState<number | null>(null)

  const settle = (next: (number | null)[]) => {
    setPlaced(next)
    setPicked(null)
    if (next.some((b) => b === null)) return setAnswer(null)
    const wrong = panels.map((p, i) => ({ p, i })).filter(({ i }) => next[i] !== i)
    const lead = wrong.length ? `${wrong.map(({ p, i }) => t('Panel {n} says “{say}”', { n: i + 1, say: short(p.say) })).join('; ')}. ` : `${t('Every balloon in its panel.')} `
    setAnswer(() => ({ correct: wrong.length === 0, detail: `${lead}${exercise.explain}` }))
  }

  const tapSlot = (slot: number) => {
    if (checked) return
    if (picked === null) {
      if (placed[slot] === null) return
      return settle(placed.map((b, i) => (i === slot ? null : b)))
    }
    settle(placed.map((b, i) => (i === slot ? picked : b === picked ? null : b)))
  }

  const loose = pool.filter((b) => !placed.includes(b))
  const kindOf = (b: number) => panels[b]?.kind ?? panels[0].kind

  return (
    <div className="exercise exercise-panels">
      <p className="eyebrow">{t('Comic panels')}</p>
      <h2>{exercise.prompt}</h2>
      <div className="comic-strip">
        {panels.map((p, i) => {
          const b = placed[i]
          const state = checked ? (b === i ? 'is-right' : 'is-wrong') : picked !== null ? 'is-ready' : ''
          return (
            <PanelFrame
              key={i}
              panel={p}
              number={i + 1}
              className={state}
              top={
                <button type="button" className={`panel-slot${b === null ? ' is-empty' : ''}`} onClick={() => tapSlot(i)} disabled={checked} aria-label={b === null ? t('Panel {n}: empty', { n: i + 1 }) : t('Panel {n}: {say}', { n: i + 1, say: says[b] })}>
                  {b === null ? <Balloon kind={p.kind} className="balloon-empty">?</Balloon> : <Balloon kind={kindOf(b)}>{says[b]}</Balloon>}
                  {checked && b !== i && <Balloon kind={p.kind} className="balloon-right">{p.say}</Balloon>}
                </button>
              }
            />
          )
        })}
      </div>
      {!checked && loose.length > 0 && (
        <>
          <p className="sort-hint muted">{picked === null ? t('Tap a balloon, then the panel it belongs in.') : t('Now tap its panel.')}</p>
          <div className="panels-pool">
            {loose.map((b) => (
              <button type="button" key={b} className={`panel-chip${picked === b ? ' picked' : ''}`} aria-pressed={picked === b} onClick={() => setPicked(picked === b ? null : b)}>
                <Balloon kind={kindOf(b)}>{says[b]}</Balloon>
              </button>
            ))}
          </div>
        </>
      )}
      {checked && <StripCredits panels={panels} />}
    </div>
  )
}

function PanelOrder({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'panels'>>) {
  const { panels } = exercise
  const pool = useMemo(() => {
    // Never start in the right order.
    let order = shuffle(panels.map((_, i) => i))
    while (order.every((p, i) => p === i)) order = shuffle(order)
    return order
  }, [panels])
  const [placed, setPlaced] = useState<number[]>([])

  const settle = (next: number[]) => {
    setPlaced(next)
    if (next.length < panels.length) return setAnswer(null)
    const ok = next.every((p, i) => p === i)
    const lead = ok ? `${t('Every panel in its place.')} ` : `${t('The story runs: {panels}.', { panels: panels.map((p) => `“${short(p.say)}”`).join(t(', then ')) })} `
    setAnswer(() => ({ correct: ok, detail: `${lead}${exercise.explain}` }))
  }

  const take = (p: number) => {
    if (checked) return
    const at = placed.indexOf(p)
    settle(at >= 0 ? placed.slice(0, at) : [...placed, p])
  }

  return (
    <div className="exercise exercise-panels">
      <p className="eyebrow">{t('Comic panels')}</p>
      <h2>{exercise.prompt}</h2>
      <div className="comic-strip panel-slots">
        {panels.map((_, i) => {
          const p = placed[i]
          if (p === undefined)
            return (
              <div key={i} className="comic-panel panel-slot is-empty" aria-label={t('Panel {n}: empty', { n: i + 1 })}>
                <span className="panel-number">{i + 1}</span>
              </div>
            )
          const state = checked ? (p === i ? 'is-right' : 'is-wrong') : ''
          return (
            <PanelFrame
              key={i}
              panel={panels[p]}
              number={i + 1}
              className={`panel-placed ${state}`}
              onClick={() => take(p)}
              disabled={checked}
              label={t('Panel {n}: {say}', { n: i + 1, say: panels[p].say })}
              top={<Balloon kind={panels[p].kind}>{panels[p].say}</Balloon>}
            />
          )
        })}
      </div>
      {!checked && placed.length < panels.length && (
        <>
          <p className="sort-hint muted">{placed.length ? t('Panel {n}: which comes next?', { n: placed.length + 1 }) : t('Tap the panel the story starts with.')}</p>
          <div className="comic-strip panels-pool panels-pool-order">
            {pool
              .filter((p) => !placed.includes(p))
              .map((p) => (
                <PanelFrame key={p} panel={panels[p]} className="panel-chip" onClick={() => take(p)} top={<Balloon kind={panels[p].kind}>{panels[p].say}</Balloon>} />
              ))}
          </div>
        </>
      )}
      {checked && <StripCredits panels={panels} />}
    </div>
  )
}
