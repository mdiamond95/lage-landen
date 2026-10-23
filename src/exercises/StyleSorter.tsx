import { useMemo, useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { shuffle } from '../lesson/shuffle'
import { photo } from '../photos'
import { Credit } from '../photos/Photo'
import { ZoomImage } from '../photos/ZoomImage'
import type { ExerciseProps } from './types'
import { t } from '../i18n'

// Style sorter: one painting at a time, name its style. After each pick the painting
// glides to the detail that gives the style away, with a word on what to look for, so
// each card teaches the next. Every painting has to be named right. Unit 19 sorts
// building fronts the same way (`of: building`).
export function StyleSorter({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'style'>>) {
  const order = useMemo(() => shuffle(exercise.items.map((_, i) => i)), [exercise])
  const [picks, setPicks] = useState<number[]>([])
  // The card on screen: the next to sort, or the last one sorted while its tell shows.
  const [at, setAt] = useState(0)
  const item = exercise.items[order[at]]
  const pick = picks[at]
  const answered = pick !== undefined
  const p = photo(item.photo)
  const done = picks.length === order.length
  const building = exercise.of === 'building'

  const choose = (g: number) => {
    if (answered || checked) return
    const next = [...picks, g]
    setPicks(next)
    if (next.length < order.length) return
    const wrong = order.filter((i, k) => next[k] !== exercise.items[i].group)
    const lead = wrong.length
      ? `${wrong.map((i) => t('{title} is {group}', { title: exercise.items[i].title, group: exercise.groups[exercise.items[i].group] })).join('; ')}. `
      : `${t('All {n} named right.', { n: order.length })} `
    setAnswer(() => ({ correct: wrong.length === 0, detail: `${lead}${exercise.explain}` }))
  }

  return (
    <div className="exercise exercise-style">
      <p className="eyebrow">{t('Style sorter')}</p>
      <h2>{exercise.prompt}</h2>
      <p className="style-count muted" aria-live="polite">
        {t(building ? 'Building {n} of {total}' : 'Painting {n} of {total}', { n: at + 1, total: order.length })} ·{' '}
        {t('{n} right so far', { n: picks.filter((g, k) => g === exercise.items[order[k]].group).length })}
      </p>
      <figure className="photo-figure">
        <ZoomImage key={item.photo} src={p.src} alt={p.alt} max={6} focus={answered ? item.box : null} />
        {/* The title and credit name the painter, so they wait for the pick. */}
        <figcaption>
          {answered ? (
            <>
              {item.title} · <span className="photo-credit">{t('Credit:')} <Credit id={item.photo} /></span>
            </>
          ) : (
            t(building ? 'Who built it, and when, shows once you have chosen.' : 'Who painted it, and when, shows once you have chosen.')
          )}
        </figcaption>
      </figure>
      <div className={`style-groups style-groups-${exercise.groups.length}`} role="group" aria-label={t('Styles')}>
        {exercise.groups.map((g, gi) => {
          const state = !answered ? '' : gi === item.group ? 'right' : gi === pick ? 'wrong' : ''
          return (
            <button key={g} type="button" className={`option style-group ${state}`} disabled={answered} onClick={() => choose(gi)}>
              {g}
            </button>
          )
        })}
      </div>
      {answered && (
        <div className={`style-tell ${pick === item.group ? 'is-right' : 'is-wrong'}`} aria-live="polite">
          <p className="tour-title">{pick === item.group ? t('Yes: {group}', { group: exercise.groups[item.group] }) : t('No: it is {group}', { group: exercise.groups[item.group] })}</p>
          <p className="tour-text">{item.tell}</p>
          {!done && (
            <button type="button" className="zoom-btn zoom-reset tour-next style-next" onClick={() => setAt(at + 1)}>
              {t(building ? 'Next building' : 'Next painting')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
