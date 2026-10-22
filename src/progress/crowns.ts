import { LEGENDARY_LEVEL, LEVEL_PASS, levelPassed } from '../content/levels'

// What a finished play did to the crowns, and the line the results screen shows.
export type CrownNote = { level: number; head: string; detail: string }

const pct = (right: number, asked: number) => `${Math.round((right / Math.max(1, asked)) * 100)}%`
const need = `${Math.round(LEVEL_PASS * 100)}%`

const nextStep = (level: number, legendary: boolean) =>
  level === 1
    ? 'Play it again for level 2: the lesson once more, stories and all.'
    : level === 2
      ? 'Next, level 3: its questions alone, in a new order.'
      : level === 3
        ? 'Next, level 4: the questions with no second chance at a miss.'
        : legendary
          ? "With every lesson of the unit at level 4, the unit's timed Legendary challenge opens."
          : 'Level 4 is the top for this unit, which has no timed challenge.'

// A lesson played for `target` from `before` (0 if never finished), with `right` of
// `asked` first tries right. Level 1 needs only finishing; levels 2 to 4 need 80%.
export const lessonCrown = (before: number, target: number, right: number, asked: number, legendary: boolean): CrownNote => {
  if (target === 1) return { level: 1, head: 'Level 1', detail: nextStep(1, legendary) }
  if (before >= 4) return { level: before, head: `Level ${before}`, detail: nextStep(4, legendary) }
  if (levelPassed(right, asked)) return { level: target, head: `Level ${target} reached`, detail: nextStep(target, legendary) }
  return {
    level: before,
    head: `Still level ${before}`,
    detail: `Level ${target} needs ${need} right first time, and this time it was ${pct(right, asked)}. Play it again to try once more.`,
  }
}

// A Legendary challenge of `size` questions: passed with 80% right before the clock runs out.
export const legendaryCrown = (unitNumber: number, right: number, size: number, timedOut: boolean): CrownNote & { passed: boolean } => {
  const passed = !timedOut && levelPassed(right, size)
  if (passed) return { passed, level: LEGENDARY_LEVEL, head: 'Legendary', detail: `Every lesson of Unit ${unitNumber} is at level 5.` }
  return {
    passed,
    level: LEGENDARY_LEVEL - 1,
    head: timedOut ? "Time's up" : 'Not this time',
    detail: `${timedOut ? 'The clock ran out' : `${right} of ${size} right`}: Legendary needs ${Math.ceil(LEVEL_PASS * size)} of ${size} in time. Try again whenever you like.`,
  }
}
