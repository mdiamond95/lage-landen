import unit01 from './unit-01-land-and-water.yaml'
import unit02 from './unit-02-celts-romans-franks.yaml'
import unit03 from './unit-03-counts-bishops-cloth.yaml'
import unit04 from './unit-04-burgundian-netherlands.yaml'
import unit05 from './unit-05-revolt-and-split.yaml'
import unit06 from './unit-06-golden-age.yaml'
import unit07 from './unit-07-trade-empire-slavery.yaml'
import unit08 from './unit-08-disaster-year-to-waterloo.yaml'
import unit09 from './unit-09-one-kingdom-then-two.yaml'
import unit10 from './unit-10-constitution-and-pillars.yaml'
import unit11 from './unit-11-occupation-and-liberation.yaml'
import unit12 from './unit-12-water-welfare-tolerance.yaml'
import unit13 from './unit-13-industry-and-empire.yaml'
import unit14 from './unit-14-flanders-fields.yaml'
import unit15 from './unit-15-language-and-federal-state.yaml'
import unit16 from './unit-16-flemish-primitives-to-bruegel.yaml'
import unit17 from './unit-17-rembrandt-vermeer-rubens.yaml'
import unit18 from './unit-18-modern-art.yaml'
import unit19 from './unit-19-architecture.yaml'
import unit20 from './unit-20-languages.yaml'
import unit21 from './unit-21-food-and-drink.yaml'
import unit22 from './unit-22-feasts-and-traditions.yaml'
import unit23 from './unit-23-sport.yaml'
import unit24 from './unit-24-comics-and-pop-culture.yaml'
import unit25 from './unit-25-thinkers-and-scientists.yaml'
import unit26 from './unit-26-how-the-countries-work-today.yaml'
import { buildCards } from './cards'
import { Unit } from './schema'

// Each unit's YAML is read at build time and arrives here as data (see vite.config.ts),
// so the app doesn't parse 1.3 MB of YAML every time it opens.

export const units: Unit[] = [unit01, unit02, unit03, unit04, unit05, unit06, unit07, unit08, unit09, unit10, unit11, unit12, unit13, unit14, unit15, unit16, unit17, unit18, unit19, unit20, unit21, unit22, unit23, unit24, unit25, unit26].map((data) => Unit.parse(data))

export const cards = buildCards(units)

export const findLesson = (lessonId: string) => {
  for (const unit of units) {
    const lesson = unit.lessons.find((l) => l.id === lessonId)
    if (lesson) return { unit, lesson }
  }
  return undefined
}
