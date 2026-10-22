import { collection, type CollectionCard } from '../data/collection'
import { foodIds, foods } from '../data/foods'
import type { Exercise, Lesson, Unit } from '../content/schema'
import type { PhotoId } from '../photos/ids'
import { photosUsed } from '../photos/used'
import type { Progress } from './store'

// The photos a lesson hangs on the wall. The food map counts for the marks it opens on: one
// food with `focus`, one kind with `only`, all of them otherwise; a taste question for the
// marks of its answer's kind, which its map shows.
export const lessonPhotos = (lesson: Lesson): Set<PhotoId> => {
  const shown = new Set<PhotoId>()
  // Every photo but the food map's, which follows.
  const plain = lesson.exercises.map((e) => ('visual' in e && e.visual?.kind === 'foods' ? ({ ...e, visual: undefined } as unknown as Exercise) : e))
  photosUsed(plain).forEach((p) => shown.add(p))
  for (const e of lesson.exercises) {
    const v = 'visual' in e && e.visual?.kind === 'foods' ? e.visual : undefined
    const ids = v
      ? v.focus
        ? [v.focus]
        : foodIds.filter((id) => !v.only || foods[id].kind === v.only)
      : e.type === 'taste'
        ? foodIds.filter((id) => foods[id].kind === foods[e.answer].kind)
        : []
    ids.forEach((id) => foods[id].photo && shown.add(foods[id].photo))
  }
  return shown
}

export type Hung = CollectionCard & { lessons: string[]; unit: number }

// Each card with the lessons that collect it, in course order. A photo that a Who am I?
// asks about waits for that question's lesson, so the wall never names a face first.
export const hangCards = (units: Unit[]): Hung[] => {
  const ordered = [...units].sort((a, b) => a.number - b.number)
  const shows = ordered.flatMap((u) => u.lessons.map((l) => ({ unit: u.number, lesson: l, photos: lessonPhotos(l) })))
  return collection.flatMap((card) => {
    const all = shows.filter((s) => s.photos.has(card.photo))
    const asked = all.findIndex((s) => s.lesson.exercises.some((e) => e.type === 'who' && e.photo === card.photo))
    const from = asked >= 0 ? all.slice(asked) : all
    return from.length ? [{ ...card, lessons: from.map((s) => s.lesson.id), unit: from[0].unit }] : []
  })
}

type Done = Pick<Progress, 'completed'>

export const collected = (p: Done, card: Hung) => card.lessons.some((id) => !!p.completed[id])

// The cards a lesson adds to the wall when it is finished for the first time.
export const newCards = (p: Done, cards: Hung[], lessonId: string) =>
  p.completed[lessonId] ? [] : cards.filter((c) => c.lessons.includes(lessonId) && !collected(p, c))
