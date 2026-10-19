import { parse } from 'yaml'
import unit01 from './unit-01-land-and-water.yaml?raw'
import { Unit } from './schema'

export const units: Unit[] = [unit01].map((text) => Unit.parse(parse(text)))

export const findLesson = (lessonId: string) => {
  for (const unit of units) {
    const lesson = unit.lessons.find((l) => l.id === lessonId)
    if (lesson) return { unit, lesson }
  }
  return undefined
}
