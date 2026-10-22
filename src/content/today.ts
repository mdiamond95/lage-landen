import { cards, units } from '.'
import { wall } from './wall'
import { collected } from '../progress/collection'
import { lessonLevel } from '../progress/path'
import type { Can } from '../progress/quests'
import { dueToday } from '../progress/review'
import { todayKey, type Progress } from '../progress/store'

// What today's quests may ask for: the review only with enough questions due, a crown only
// with a lesson below level 4, museum cards only while some are left to collect.
export const canToday = (p: Progress, day = todayKey()): Can => ({
  due: dueToday(cards.items, p.cards, p.completed, day).length,
  finished: units.reduce((n, u) => n + u.lessons.filter((l) => [1, 2, 3].includes(lessonLevel(p, u, l.id))).length, 0),
  cardsLeft: wall.filter((c) => !collected(p, c)).length,
})
