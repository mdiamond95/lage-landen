// What the stork says. It encourages and never scolds; a few everyday Dutch and French
// words (goed zo, bravo, chapeau, tot morgen) come in where the meaning is clear.

// A cheer during a lesson, after a right answer: on a run of right answers in a row,
// or on the first right answer after two or more slips.
const runs: Record<number, string> = {
  3: 'Three in a row. Goed zo!',
  5: 'Five in a row. Bravo!',
  10: 'Ten in a row. Chapeau!',
  15: 'Fifteen in a row. You’re flying.',
  20: 'Twenty in a row. Even storks are impressed.',
}

export const cheer = (run: number, slipsBefore: number): string | undefined =>
  runs[run] ?? (run === 1 && slipsBefore >= 2 ? 'Back on track. That’s the way.' : undefined)

// The line on the results screen.
export type Finish = { asked: number; mistakes: number; timedOut?: boolean; legendary?: 'passed' | 'failed' }

export const finishLine = ({ asked, mistakes, timedOut, legendary }: Finish) => {
  if (timedOut) return 'The clock is the hardest part. Try again when you’re ready.'
  if (legendary === 'passed') return 'Legendary. Chapeau!'
  if (legendary === 'failed') return 'Close. Practice makes the clock feel slower.'
  const share = asked ? (asked - mistakes) / asked : 1
  if (mistakes === 0) return 'Not a single slip. Chapeau!'
  if (share >= 0.8) return 'Goed gedaan! That one is sticking.'
  if (share >= 0.5) return 'Good work. The ones you missed come back in your review.'
  return 'Every try counts. Your review brings these back, spaced out, until they stick.'
}

// The greeting on the home screen, from where the learner is today.
export type Day = { fresh: boolean; playedToday: boolean; streak: number; streakAlive: boolean; due: number; questsLeft: number | null }

export const greeting = ({ fresh, playedToday, streak, streakAlive, due, questsLeft }: Day) => {
  if (fresh) return 'Hallo, bonjour! I’m your guide to the Low Countries. Start at Unit 1, with the painters of Unit 16, or skip ahead with the placement test.'
  if (playedToday && questsLeft === 0) return 'Today is done, quests and all. Tot morgen!'
  if (playedToday)
    return `Your ${streak}-day streak is safe for today.${questsLeft ? ` ${questsLeft === 1 ? 'One quest is' : `${questsLeft} quests are`} still open.` : ''}`
  if (due > 0) return `${due} ${due === 1 ? 'question is' : 'questions are'} waiting in your review. A few minutes keeps them fresh.`
  if (streakAlive) return `One lesson today keeps your ${streak}-day streak going.`
  return 'Welkom terug, bon retour! Your next lesson is waiting.'
}
