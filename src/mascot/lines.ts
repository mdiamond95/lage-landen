import { t } from '../i18n'

// What the stork says. It encourages and never scolds; a few everyday Dutch and French
// words (goed zo, bravo, chapeau, tot morgen) come in where the meaning is clear.

// A cheer during a lesson, after a right answer: on a run of right answers in a row,
// or on the first right answer after two or more slips.
const runs = {
  3: () => t('Three in a row. Goed zo!'),
  5: () => t('Five in a row. Bravo!'),
  10: () => t('Ten in a row. Chapeau!'),
  15: () => t('Fifteen in a row. You’re flying.'),
  20: () => t('Twenty in a row. Even storks are impressed.'),
} as Record<number, (() => string) | undefined>

export const cheer = (run: number, slipsBefore: number): string | undefined =>
  runs[run]?.() ?? (run === 1 && slipsBefore >= 2 ? t('Back on track. That’s the way.') : undefined)

// The line on the results screen.
export type Finish = { asked: number; mistakes: number; timedOut?: boolean; legendary?: 'passed' | 'failed' }

export const finishLine = ({ asked, mistakes, timedOut, legendary }: Finish) => {
  if (timedOut) return t('The clock is the hardest part. Try again when you’re ready.')
  if (legendary === 'passed') return t('Legendary. Chapeau!')
  if (legendary === 'failed') return t('Close. Practice makes the clock feel slower.')
  const share = asked ? (asked - mistakes) / asked : 1
  if (mistakes === 0) return t('Not a single slip. Chapeau!')
  if (share >= 0.8) return t('Goed gedaan! That one is sticking.')
  if (share >= 0.5) return t('Good work. The ones you missed come back in your review.')
  return t('Every try counts. Your review brings these back, spaced out, until they stick.')
}

// The greeting on the home screen, from where the learner is today.
export type Day = { fresh: boolean; playedToday: boolean; streak: number; streakAlive: boolean; due: number; questsLeft: number | null }

export const greeting = ({ fresh, playedToday, streak, streakAlive, due, questsLeft }: Day) => {
  if (fresh) return t('Hallo, bonjour! I’m your guide to the Low Countries. Start at Unit 1, with the painters of Unit 16, or skip ahead with the placement test.')
  if (playedToday && questsLeft === 0) return t('Today is done, quests and all. Tot morgen!')
  if (playedToday) {
    const safe = t('Your {n}-day streak is safe for today.', { n: streak })
    if (!questsLeft) return safe
    return `${safe} ${t(questsLeft === 1 ? 'One quest is still open.' : '{n} quests are still open.', { n: questsLeft })}`
  }
  if (due > 0) return t(due === 1 ? '1 question is waiting in your review. A few minutes keeps it fresh.' : '{n} questions are waiting in your review. A few minutes keeps them fresh.', { n: due })
  if (streakAlive) return t('One lesson today keeps your {n}-day streak going.', { n: streak })
  return t('Welkom terug, bon retour! Your next lesson is waiting.')
}
