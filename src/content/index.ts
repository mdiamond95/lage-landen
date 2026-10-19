import { parse } from 'yaml'
import unit01 from './unit-01-land-and-water.yaml?raw'
import unit02 from './unit-02-celts-romans-franks.yaml?raw'
import unit03 from './unit-03-counts-bishops-cloth.yaml?raw'
import unit04 from './unit-04-burgundian-netherlands.yaml?raw'
import { Unit } from './schema'

export const units: Unit[] = [unit01, unit02, unit03, unit04].map((text) => Unit.parse(parse(text)))

export const findLesson = (lessonId: string) => {
  for (const unit of units) {
    const lesson = unit.lessons.find((l) => l.id === lessonId)
    if (lesson) return { unit, lesson }
  }
  return undefined
}
