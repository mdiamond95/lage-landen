import type { Unit } from '../content/schema'
import { checkpointId } from '../content/checkpoint'
import { mapStoryId } from '../content/mapStory'

// The stork (plan: "a mascot for encouragement: a stork, common in both countries,
// wearing a different hat per era. Kept out of sensitive lessons"). Each unit gives it
// a hat from its time or subject; the names say what it wears, for a tooltip.
export const hats = {
  souwester: 'a fisher’s sou’wester',
  galea: 'a Roman helmet',
  mitre: 'a bishop’s mitre',
  hennin: 'a Burgundian hennin',
  morion: 'a morion helmet',
  capotain: 'a tall Golden Age hat',
  bicorne: 'a bicorne with an orange cockade',
  shako: 'a shako from 1830',
  boater: 'a straw boater',
  tulip: 'a liberation tulip',
  hardhat: 'a Delta Works hard hat',
  miner: 'a miner’s helmet and lamp',
  poppy: 'a remembrance poppy',
  calotte: 'a student’s calotte',
  chaperon: 'Van Eyck’s red chaperon',
  turban: 'a blue and yellow turban, after Vermeer',
  bowler: 'a bowler, after Magritte',
  paperhat: 'a builder’s paper hat',
  headphones: 'headphones, for the voices',
  toque: 'a chef’s toque',
  jester: 'a carnival cap',
  cycling: 'a cycling cap',
  propeller: 'a propeller beanie',
  mortarboard: 'a mortarboard',
  prinsjesdag: 'a Prinsjesdag hat',
} as const
export type HatId = keyof typeof hats

// One hat a unit. The wars get a flower, not a helmet: a tulip for the liberation of
// 1944 and 1945, a poppy for Flanders Fields.
export const unitHats: Record<number, HatId> = {
  1: 'souwester',
  2: 'galea',
  3: 'mitre',
  4: 'hennin',
  5: 'morion',
  6: 'capotain',
  8: 'bicorne',
  9: 'shako',
  10: 'boater',
  11: 'tulip',
  12: 'hardhat',
  13: 'miner',
  14: 'poppy',
  15: 'calotte',
  16: 'chaperon',
  17: 'turban',
  18: 'bowler',
  19: 'paperhat',
  20: 'headphones',
  21: 'toque',
  22: 'jester',
  23: 'cycling',
  24: 'propeller',
  25: 'mortarboard',
  26: 'prinsjesdag',
}

// A unit most of whose lessons are on painful subjects (Unit 7, on trade, empire and
// slavery) is quiet: the stork stays off it, as it stays out of every lesson with a
// content note.
export const quietUnit = (unit: Unit) => unit.lessons.filter((l) => l.note).length * 2 > unit.lessons.length

// The hat for a unit, or none on a quiet unit (or no unit).
export const unitHat = (unit: Unit | undefined): HatId | undefined => (unit && !quietUnit(unit) ? unitHats[unit.number] : undefined)

// The unit of the last lesson, map story or checkpoint finished for the first time: progress keeps
// them in the order they were first finished.
export const lastUnit = (completed: Record<string, unknown>, units: Unit[]): Unit | undefined => {
  for (const id of Object.keys(completed).reverse()) {
    const unit = units.find((u) => checkpointId(u) === id || mapStoryId(u) === id || u.lessons.some((l) => l.id === id))
    if (unit) return unit
  }
  return undefined
}
