import { z } from 'zod'
import { measures, quests, type QuestId } from './quests'
import { dayKey, type Progress } from './store'

// Progress export and import (plan: "IndexedDB on the device, with export and import"):
// everything is kept on the device, so a file is how it moves to another phone or computer,
// or is kept safe. The file is JSON: the progress, the map drill's best scores, and which
// app and version wrote it. Loading one replaces what is on the device, after a check.

export const BACKUP_APP = 'lage-landen'
export const BACKUP_VERSION = 1

const questIds = Object.keys(quests) as [QuestId, ...QuestId[]]
const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const Count = z.number().int().nonnegative()

const ProgressFile = z.object({
  xp: Count,
  streak: Count,
  lastDay: Day.nullable(),
  freezeWeek: Day.nullable(),
  completed: z.record(
    z.string(),
    z.object({ bestXp: Count, perfect: z.boolean(), level: z.number().int().min(1).max(5).optional(), score: z.number().min(0).max(1).optional() }),
  ),
  discovered: z.array(z.string()),
  cards: z.record(z.string(), z.object({ due: Day, interval: z.number().nonnegative(), ease: z.number().positive(), reps: Count, lapses: Count })),
  // Files from before a feature have no entry for it.
  placed: z.array(z.string()).default([]),
  legendary: z.array(z.string()).default([]),
  quests: z
    .object({ day: Day, picks: z.array(z.enum(questIds)), counts: z.record(z.enum(measures), Count), done: z.array(z.enum(questIds)) })
    .nullable()
    .default(null),
})

const BackupFile = z.object({
  app: z.literal(BACKUP_APP),
  version: z.number().int().positive(),
  exported: z.string(),
  progress: z.unknown(),
  drill: z.record(z.string(), z.number()).default({}),
})

export type Backup = { app: typeof BACKUP_APP; version: number; exported: string; progress: Progress; drill: Record<string, number> }

export const makeBackup = (progress: Progress, drill: Record<string, number>, now = new Date()): Backup => ({
  app: BACKUP_APP,
  version: BACKUP_VERSION,
  exported: now.toISOString(),
  progress,
  drill,
})

export const backupName = (now = new Date()) => `lage-landen-progress-${dayKey(now)}.json`

export type Read = { ok: true; backup: Backup } | { ok: false; error: string }

// Reads a file's text, and says plainly why it can't be used if it can't.
export const readBackup = (text: string): Read => {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    return { ok: false, error: 'That file isn’t a Lage Landen progress file.' }
  }
  const file = BackupFile.safeParse(json)
  if (!file.success) return { ok: false, error: 'That file isn’t a Lage Landen progress file.' }
  if (file.data.version > BACKUP_VERSION) return { ok: false, error: 'That file was saved by a newer version of Lage Landen. Update the app, then try again.' }
  const progress = ProgressFile.safeParse(file.data.progress)
  if (!progress.success) return { ok: false, error: 'That progress file is damaged, so nothing was changed.' }
  return { ok: true, backup: { ...file.data, app: BACKUP_APP, progress: progress.data as Progress } }
}

// A line about a progress, to compare the file with the device before replacing it.
export const describe = (p: Progress) => {
  const finished = Object.keys(p.completed).length
  const learned = Object.keys(p.cards).length
  return `${p.xp} XP, ${finished} ${finished === 1 ? 'step' : 'steps'} on the path finished, ${learned} ${learned === 1 ? 'question' : 'questions'} in the review`
}
