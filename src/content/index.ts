import { parse } from 'yaml'
import unit01 from './unit-01-land-and-water.yaml?raw'
import unit02 from './unit-02-celts-romans-franks.yaml?raw'
import unit03 from './unit-03-counts-bishops-cloth.yaml?raw'
import unit04 from './unit-04-burgundian-netherlands.yaml?raw'
import unit05 from './unit-05-revolt-and-split.yaml?raw'
import unit06 from './unit-06-golden-age.yaml?raw'
import unit07 from './unit-07-trade-empire-slavery.yaml?raw'
import unit08 from './unit-08-disaster-year-to-waterloo.yaml?raw'
import unit09 from './unit-09-one-kingdom-then-two.yaml?raw'
import { buildCards } from './cards'
import { Unit } from './schema'

export const units: Unit[] = [unit01, unit02, unit03, unit04, unit05, unit06, unit07, unit08, unit09].map((text) => Unit.parse(parse(text)))

export const cards = buildCards(units)

export const findLesson = (lessonId: string) => {
  for (const unit of units) {
    const lesson = unit.lessons.find((l) => l.id === lessonId)
    if (lesson) return { unit, lesson }
  }
  return undefined
}
