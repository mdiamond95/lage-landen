import { distanceKm } from '../map/geo'

export const XP = { lesson: 10, perfect: 5, pinBonus: 2 }

export type PinResult = { km: number; correct: boolean; bonus: boolean }

export const scorePin = (
  guess: [number, number],
  target: [number, number],
  okKm: number,
  fullKm: number,
): PinResult => {
  const km = distanceKm(guess, target)
  return { km, correct: km <= okKm, bonus: km <= fullKm }
}

export const sameSet = (a: string[], b: string[]) => {
  const sa = new Set(a)
  return sa.size === new Set(b).size && b.every((x) => sa.has(x))
}

export const isChronological = (years: number[]) => years.every((y, i) => i === 0 || years[i - 1] < y)

export const lessonXp = (mistakes: number, pinBonuses: number) =>
  XP.lesson + (mistakes === 0 ? XP.perfect : 0) + pinBonuses * XP.pinBonus

export const formatKm = (km: number) => (km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`)
