import type { Exercise, Unit } from './schema'

// Every question in the course as a review card. A card's id is its lesson plus a
// hash of the question, so editing a question makes it a new card rather than
// mixing its history with a different question.
export type CardItem = { id: string; lessonId: string; unit: number; exercise: Exercise }

// FNV-1a, 32 bit, in base 36: short, stable and good enough to tell questions apart.
const hash = (text: string) => {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(36)
}

export const buildCards = (units: Unit[]) => {
  const items: CardItem[] = units.flatMap((unit) =>
    unit.lessons.flatMap((lesson) =>
      lesson.exercises
        .filter((e) => e.type !== 'story')
        .map((exercise) => ({ id: `${lesson.id}:${hash(JSON.stringify(exercise))}`, lessonId: lesson.id, unit: unit.number, exercise })),
    ),
  )
  // Checkpoints and reviews replay the same question objects, so a lookup by
  // object finds the card whichever way the question was reached.
  const byExercise = new Map(items.map((c) => [c.exercise, c]))
  return { items, byExercise }
}
