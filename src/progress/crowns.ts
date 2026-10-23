import { LEGENDARY_LEVEL, LEVEL_PASS, levelPassed } from '../content/levels'
import { t } from '../i18n'

// What a finished play did to the crowns, and the line the results screen shows;
// `legendary` how a Legendary challenge went.
export type CrownNote = { level: number; head: string; detail: string; legendary?: 'passed' | 'failed' | 'timeout' }

const pct = (right: number, asked: number) => `${Math.round((right / Math.max(1, asked)) * 100)}%`
const need = () => `${Math.round(LEVEL_PASS * 100)}%`

const nextStep = (level: number, legendary: boolean) =>
  level === 1
    ? t('Play it again for level 2: the lesson once more, stories and all.')
    : level === 2
      ? t('Next, level 3: its questions alone, in a new order.')
      : level === 3
        ? t('Next, level 4: the questions with no second chance at a miss.')
        : legendary
          ? t("With every lesson of the unit at level 4, the unit's timed Legendary challenge opens.")
          : t('Level 4 is the top for this unit, which has no timed challenge.')

// A lesson played for `target` from `before` (0 if never finished), with `right` of
// `asked` first tries right. Level 1 needs only finishing; levels 2 to 4 need 80%.
export const lessonCrown = (before: number, target: number, right: number, asked: number, legendary: boolean): CrownNote => {
  if (target === 1) return { level: 1, head: t('Level {n}', { n: 1 }), detail: nextStep(1, legendary) }
  if (before >= 4) return { level: before, head: t('Level {n}', { n: before }), detail: nextStep(4, legendary) }
  if (levelPassed(right, asked)) return { level: target, head: t('Level {n} reached', { n: target }), detail: nextStep(target, legendary) }
  return {
    level: before,
    head: t('Still level {n}', { n: before }),
    detail: t('Level {n} needs {need} right first time, and this time it was {pct}. Play it again to try once more.', { n: target, need: need(), pct: pct(right, asked) }),
  }
}

// A Legendary challenge of `size` questions: passed with 80% right before the clock runs out.
export const legendaryCrown = (unitNumber: number, right: number, size: number, timedOut: boolean): CrownNote & { passed: boolean } => {
  const passed = !timedOut && levelPassed(right, size)
  if (passed) return { passed, legendary: 'passed', level: LEGENDARY_LEVEL, head: t('Legendary'), detail: t('Every lesson of Unit {n} is at level 5.', { n: unitNumber }) }
  return {
    passed,
    legendary: timedOut ? 'timeout' : 'failed',
    level: LEGENDARY_LEVEL - 1,
    head: timedOut ? t("Time's up") : t('Not this time'),
    detail: t('{tally}: Legendary needs {need} of {size} in time. Try again whenever you like.', {
      tally: timedOut ? t('The clock ran out') : t('{right} of {size} right', { right, size }),
      need: Math.ceil(LEVEL_PASS * size),
      size,
    }),
  }
}
