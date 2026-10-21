import { useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { foods, type FoodId } from '../data/foods'
import { FoodMap } from '../map/FoodMap'
import { photo } from '../photos'
import { Credit, Photo } from '../photos/Photo'
import type { ExerciseProps } from './types'

// Taste and find (Unit 21): a photo of something to eat or drink, then a tap on where it
// comes from. The map shows only the marks of its kind, unnamed until the answer is checked,
// and the photo's caption waits too, as it often names the place.
export function TasteMap({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'taste'>>) {
  const [picked, setPicked] = useState<FoodId | null>(null)
  const right = foods[exercise.answer]

  const pick = (id: FoodId) => {
    if (checked) return
    setPicked(id)
    setAnswer(() => ({
      correct: id === exercise.answer,
      detail: id === exercise.answer ? exercise.explain : `It comes from ${right.place.replace(/^The /, 'the ')}. ${exercise.explain}`,
    }))
  }

  return (
    <div className="exercise">
      <p className="eyebrow">Taste and find</p>
      <h2>{exercise.prompt}</h2>
      <figure className="photo-figure taste-photo">
        <Photo id={exercise.photo} className="photo photo-large" />
        <figcaption>
          {checked ? (
            <>
              {photo(exercise.photo).caption} · <span className="photo-credit">Credit: <Credit id={exercise.photo} /></span>
            </>
          ) : (
            <span className="photo-credit">Caption and credit shown once you answer</span>
          )}
        </figcaption>
      </figure>
      <FoodMap mode="pick" only={right.kind} picked={picked} correct={checked ? exercise.answer : undefined} onPick={pick} />
      <p className="hint">{checked && picked ? `You picked ${foods[picked].place}.` : picked ? 'Place picked. Tap another to change your mind.' : 'Tap the mark where it comes from.'}</p>
    </div>
  )
}
