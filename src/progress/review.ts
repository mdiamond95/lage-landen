// Spaced repetition: every question in a finished lesson is a card that comes back
// in the daily review, sooner if it was missed. The schedule is a small SM-2 style
// one: each right answer stretches the gap (1 day, 3 days, then times the card's
// ease), and a miss brings the card back tomorrow and makes it come round faster.

export type Card = {
  // The day it is next due, as yyyy-mm-dd.
  due: string
  interval: number
  ease: number
  // Right answers in a row, and misses in all.
  reps: number
  lapses: number
}

const START_EASE = 2.5
const MIN_EASE = 1.3
const MAX_EASE = 3

export const addDays = (day: string, n: number) => {
  const d = new Date(`${day}T12:00:00`)
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const schedule = (card: Card | undefined, correct: boolean, today: string): Card => {
  const c = card ?? { due: today, interval: 0, ease: START_EASE, reps: 0, lapses: 0 }
  if (!correct) {
    return { due: addDays(today, 1), interval: 1, ease: Math.max(MIN_EASE, c.ease - 0.2), reps: 0, lapses: c.lapses + 1 }
  }
  const interval = c.reps === 0 ? 1 : c.reps === 1 ? 3 : Math.round(c.interval * c.ease)
  return { due: addDays(today, interval), interval, ease: Math.min(MAX_EASE, c.ease + 0.05), reps: c.reps + 1, lapses: c.lapses }
}

export const REVIEW_SIZE = 10

type Pick = { id: string; lessonId: string }

// The cards to review today: the ones missed most come first, then the longest
// overdue. The chosen ones are then shuffled so eras and question types mix, and
// two questions from the same lesson are kept apart where possible.
export const pickReview = <T extends Pick>(due: { item: T; card: Card | undefined }[], random = Math.random, size = REVIEW_SIZE): T[] => {
  const chosen = [...due]
    .sort((a, b) => (b.card?.lapses ?? 0) - (a.card?.lapses ?? 0) || (a.card?.due ?? '').localeCompare(b.card?.due ?? ''))
    .slice(0, size)
    .map((d) => d.item)
  const pool = chosen.map((item) => ({ item, r: random() })).sort((a, b) => a.r - b.r).map((x) => x.item)
  const out: T[] = []
  while (pool.length) {
    const prev = out[out.length - 1]
    const i = pool.findIndex((x) => x.lessonId !== prev?.lessonId)
    out.push(pool.splice(i === -1 ? 0 : i, 1)[0])
  }
  return out
}

// Cards that are due today: those with a due date that has come, and questions from
// lessons finished before reviews existed, which have no card yet.
export const dueToday = <T extends Pick>(items: T[], cards: Record<string, Card>, completed: Record<string, unknown>, today: string) =>
  items
    .filter((item) => cards[item.id] || completed[item.lessonId])
    .map((item) => ({ item, card: cards[item.id] as Card | undefined }))
    .filter(({ card }) => !card || card.due <= today)

// The next day anything comes due, once today's are done.
export const nextDue = (cards: Record<string, Card>) =>
  Object.values(cards)
    .map((c) => c.due)
    .sort()[0]
