import type { timeMaps } from '../content/schema'
import { CLOTH_MAX, CLOTH_MIN, clothEvents } from './cloth'
import type { HistEvent } from './timeline'
import { amsterdamStory } from './amsterdam'
import { bordersStory } from './borders'
import { buildingsStory } from './buildings'
import { burgundyStory } from './burgundy'
import { congoStory } from './congo'
import { deltaStory } from './delta'
import { empireStory } from './empire'
import { greatWarStory } from './greatwar'
import { industryStory } from './industry'
import { kingdomStory } from './kingdom'
import { languageStory } from './language'
import { mastersStory } from './masters'
import { modernsStory } from './moderns'
import { occupationStory } from './occupation'
import { paintersStory } from './painters'
import { railsStory } from './rails'
import { revoltStory } from './revolt'
import { romanStory } from './roman'
import { spanishStory } from './spanish'
import { waterStory } from './water'
import { tonguesStory } from './tongues'
import { foodStory } from './food'
import { feastStory } from './feastMap'
import { sportStory } from './sport'
import { popStory } from './pop'
import { scienceStory } from './science'
import { stateStory } from './state'
import { westhoekStory } from './westhoek'

// Every year-slider map but the cloth trade map, which has a frame of its own.
export const stories = {
  water: waterStory,
  roman: romanStory,
  burgundy: burgundyStory,
  revolt: revoltStory,
  amsterdam: amsterdamStory,
  spanish: spanishStory,
  empire: empireStory,
  borders: bordersStory,
  kingdom: kingdomStory,
  rails: railsStory,
  occupation: occupationStory,
  delta: deltaStory,
  industry: industryStory,
  congo: congoStory,
  greatwar: greatWarStory,
  westhoek: westhoekStory,
  language: languageStory,
  painters: paintersStory,
  masters: mastersStory,
  moderns: modernsStory,
  buildings: buildingsStory,
  tongues: tonguesStory,
  food: foodStory,
  feasts: feastStory,
  sport: sportStory,
  pop: popStory,
  science: scienceStory,
  state: stateStory,
}

export type TimeMapId = (typeof timeMaps)[number]

// What every year-slider map shares, the cloth trade map included: its stages, its
// range and how it writes a year (or a month).
export type TimeFrame = { min: number; max: number; format: (year: number) => string; events: HistEvent[] }

export const frameOf = (map: TimeMapId): TimeFrame =>
  map === 'cloth' ? { min: CLOTH_MIN, max: CLOTH_MAX, format: String, events: clothEvents } : stories[map]
