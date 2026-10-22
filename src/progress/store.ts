import { useSyncExternalStore } from 'react'
import { schedule, type Card } from './review'

// Progress lives on the device for now (phase 4 adds accounts and sync).
export type Progress = {
  xp: number
  streak: number
  lastDay: string | null
  freezeWeek: string | null
  // Finished lessons and checkpoints; a lesson's `level` (1 to 4) is its crown level,
  // 1 when left out (progress saved before crowns).
  completed: Record<string, { bestXp: number; perfect: boolean; level?: number }>
  discovered: string[]
  // Review cards by id (see content/cards.ts), for the daily review.
  cards: Record<string, Card>
  // Units opened by the placement test: all their lessons and the checkpoint.
  placed: string[]
  // Units whose timed Legendary challenge is passed: every lesson in them is at level 5.
  legendary: string[]
}

const KEY = 'lage-landen:progress:v1'
const empty: Progress = { xp: 0, streak: 0, lastDay: null, freezeWeek: null, completed: {}, discovered: [], cards: {}, placed: [], legendary: [] }

const load = (): Progress => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...empty, ...JSON.parse(raw) } : empty
  } catch {
    return empty
  }
}

let state = load()
const listeners = new Set<() => void>()

const save = (next: Progress) => {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Private mode or blocked storage: progress lasts for this visit only.
  }
  listeners.forEach((l) => l())
}

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const todayKey = () => dayKey(new Date())

const weekKey = (d: Date) => {
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return dayKey(monday)
}

const daysBetween = (a: string, b: string) =>
  Math.round((Date.parse(`${b}T12:00:00`) - Date.parse(`${a}T12:00:00`)) / 86_400_000)

// A day counts after one lesson. Missing exactly one day uses the weekly freeze.
export const nextStreak = (p: Progress, now: Date): Pick<Progress, 'streak' | 'lastDay' | 'freezeWeek'> => {
  const today = dayKey(now)
  if (p.lastDay === today) return { streak: p.streak, lastDay: p.lastDay, freezeWeek: p.freezeWeek }
  const gap = p.lastDay ? daysBetween(p.lastDay, today) : Infinity
  if (gap === 1) return { streak: p.streak + 1, lastDay: today, freezeWeek: p.freezeWeek }
  const week = weekKey(now)
  if (gap === 2 && p.freezeWeek !== week) return { streak: p.streak + 1, lastDay: today, freezeWeek: week }
  return { streak: 1, lastDay: today, freezeWeek: p.freezeWeek }
}

// One finished lesson, checkpoint, review, placement block or Legendary challenge.
// `lessonId` is left out for the last three, which count for the streak and XP but
// aren't steps on the path; `level` is the crown level a lesson reached, `placed` the
// unit a placement block opened and `legendary` the unit whose challenge was passed.
// Each question answered (first tries only) moves its review card.
export type Session = {
  lessonId?: string
  level?: number
  placed?: string
  legendary?: string
  xp: number
  perfect: boolean
  places: string[]
  answers: [cardId: string, correct: boolean][]
}

const addOnce = (list: string[], id: string | undefined) => (id && !list.includes(id) ? [...list, id] : list)

export const recordSession = ({ lessonId, level = 1, placed, legendary, xp, perfect, places, answers }: Session, now = new Date()) => {
  const today = dayKey(now)
  const cards = { ...state.cards }
  for (const [id, correct] of answers) cards[id] = schedule(cards[id], correct, today)
  const prev = lessonId ? state.completed[lessonId] : undefined
  save({
    ...state,
    ...nextStreak(state, now),
    xp: state.xp + xp,
    completed: lessonId
      ? {
          ...state.completed,
          [lessonId]: { bestXp: Math.max(prev?.bestXp ?? 0, xp), perfect: (prev?.perfect ?? false) || perfect, level: Math.max(prev ? (prev.level ?? 1) : 0, level) },
        }
      : state.completed,
    discovered: [...new Set([...state.discovered, ...places])],
    cards,
    placed: addOnce(state.placed, placed),
    legendary: addOnce(state.legendary, legendary),
  })
}

export const getProgress = () => state

export const resetProgress = () => save(empty)

export const useProgress = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
  )

// Shown on the home screen when the streak would break today.
export const streakAlive = (p: Progress, now = new Date()) =>
  p.lastDay !== null && daysBetween(p.lastDay, dayKey(now)) <= 1
