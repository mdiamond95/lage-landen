// Daily quests (plan: "3 small goals a day"): each day three goals are picked, one from
// each tier, warm-up, steady and stretch, so a day asks a little, then more. Each is worth
// a bonus of QUEST_XP once met. The day's picks and counts are kept in the progress, so
// they stay put however often the home screen is opened, and start again tomorrow.

import type { Key } from '../i18n'

export const QUEST_XP = 10

export const measures = ['xp', 'lessons', 'pins', 'reviewed', 'right', 'perfect', 'cards', 'crowns'] as const
export type Measure = (typeof measures)[number]

export type Quest = { id: string; measure: Measure; goal: number; text: Key }

const q = (id: string, measure: Measure, goal: number, text: Key): Quest => ({ id, measure, goal, text })

export const quests = {
  xp30: q('xp30', 'xp', 30, 'Earn 30 XP'),
  lesson: q('lesson', 'lessons', 1, 'Finish a lesson'),
  pins5: q('pins5', 'pins', 5, 'Find 5 places on the map'),
  right15: q('right15', 'right', 15, 'Get 15 answers right first time'),
  perfect: q('perfect', 'perfect', 1, 'Finish a lesson with no mistakes'),
  cards3: q('cards3', 'cards', 3, 'Hang 3 new cards in your museum'),
  review10: q('review10', 'reviewed', 10, 'Answer 10 questions in the daily review'),
  xp60: q('xp60', 'xp', 60, 'Earn 60 XP'),
  lessons2: q('lessons2', 'lessons', 2, 'Finish 2 lessons'),
  crown: q('crown', 'crowns', 1, 'Raise a lesson to its next crown'),
} satisfies Record<string, Quest>
export type QuestId = keyof typeof quests

const tiers: QuestId[][] = [
  ['xp30', 'lesson', 'pins5'],
  ['right15', 'perfect', 'cards3', 'review10'],
  ['xp60', 'lessons2', 'crown'],
]

// What the learner can do today: questions due in the review, lessons already finished
// (to raise a crown) and cards still to collect.
export type Can = { due: number; finished: number; cardsLeft: number }

const possible = (id: QuestId, can: Can) =>
  id === 'review10' ? can.due >= quests.review10.goal : id === 'crown' ? can.finished > 0 : id === 'cards3' ? can.cardsLeft >= quests.cards3.goal : true

// A number from the day, so everyone gets the same quests on the same day.
const seed = (day: string) => [...day].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

export const pickQuests = (day: string, can: Can): QuestId[] => {
  const picks: QuestId[] = []
  tiers.forEach((tier, i) => {
    const open = tier.filter((id) => possible(id, can) && !picks.some((p) => quests[p].measure === quests[id].measure))
    picks.push(open[seed(`${day}:${i}`) % open.length])
  })
  return picks
}

export type Counts = Record<Measure, number>
export type DayQuests = { day: string; picks: QuestId[]; counts: Counts; done: QuestId[] }

export const startDay = (day: string, can: Can): DayQuests => ({
  day,
  picks: pickQuests(day, can),
  counts: Object.fromEntries(measures.map((m) => [m, 0])) as Counts,
  done: [],
})

// What one session adds to the day's counts.
export type Tally = Partial<Counts>

// The counts after a session, and the quests it completed.
export const addTally = (d: DayQuests, t: Tally): { day: DayQuests; met: QuestId[] } => {
  const counts = { ...d.counts }
  for (const m of measures) counts[m] += t[m] ?? 0
  const met = d.picks.filter((id) => !d.done.includes(id) && counts[quests[id].measure] >= quests[id].goal)
  return { day: { ...d, counts, done: [...d.done, ...met] }, met }
}
