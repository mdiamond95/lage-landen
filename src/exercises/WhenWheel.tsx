import { useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { dateOf, daysOff, feasts } from '../data/feasts'
import { FeastWheel } from '../map/FeastWheel'
import { photo } from '../photos'
import { Credit, Photo } from '../photos/Photo'
import type { ExerciseProps } from './types'
import { t } from '../i18n'

// When is it? (Unit 22): a photo of a feast, then the hand of the calendar wheel is turned to its
// date. A feast that moves counts anywhere in its span, and `days` either side of it. The caption
// waits until the answer is checked, as it often gives the date away.
export function WhenWheel({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'when'>>) {
  const [picked, setPicked] = useState<number | null>(null)
  const feast = feasts[exercise.answer]
  const right = picked !== null && daysOff(feast, picked) <= exercise.days

  const pick = (day: number) => {
    if (checked) return
    setPicked(day)
    const ok = daysOff(feast, day) <= exercise.days
    setAnswer(() => ({ correct: ok, detail: ok ? exercise.explain : `${t('It falls on {when}.', { when: feast.when.replace(/^The /, 'the ') })} ${exercise.explain}` }))
  }

  return (
    <div className="exercise exercise-when">
      <p className="eyebrow">{t('When is it?')}</p>
      <h2>{exercise.prompt}</h2>
      <figure className="photo-figure taste-photo">
        <Photo id={exercise.photo} className="photo photo-large" />
        <figcaption>
          {checked ? (
            <>
              {photo(exercise.photo).caption} · <span className="photo-credit">{t('Credit:')} <Credit id={exercise.photo} /></span>
            </>
          ) : (
            <span className="photo-credit">{t('Caption and credit shown once you answer')}</span>
          )}
        </figcaption>
      </figure>
      <FeastWheel mode="pick" picked={picked} correct={checked ? exercise.answer : undefined} right={right} onPick={pick} />
      <p className="hint">
        {checked && picked !== null
          ? t('You picked {name}.', { name: dateOf(picked) })
          : exercise.days
            ? `${t('Turn the hand to the date.')} ${t(exercise.days > 1 ? 'Within {n} days counts.' : 'Within 1 day counts.', { n: exercise.days })}`
            : t('Turn the hand to the date.')}
      </p>
    </div>
  )
}
