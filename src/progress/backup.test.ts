import { describe as group, expect, it } from 'vitest'
import { BACKUP_VERSION, backupName, describe, makeBackup, readBackup } from './backup'
import { startDay } from './quests'
import type { Progress } from './store'

const progress: Progress = {
  xp: 120,
  streak: 3,
  lastDay: '2026-10-22',
  freezeWeek: null,
  completed: { 'u1-l1': { bestXp: 20, perfect: true, level: 2 }, 'unit-01-checkpoint': { bestXp: 30, perfect: false, score: 0.9 } },
  discovered: ['amsterdam', 'brussels'],
  cards: { 'u1-l1-q2': { due: '2026-10-25', interval: 3, ease: 2.5, reps: 2, lapses: 0 } },
  placed: ['unit-03'],
  legendary: [],
  quests: startDay('2026-10-22', { due: 0, finished: 1, cardsLeft: 400 }),
}
const now = new Date('2026-10-22T18:00:00Z')
const text = (o: unknown) => JSON.stringify(o)

group('progress files', () => {
  it('reads back what it saved', () => {
    const read = readBackup(text(makeBackup(progress, { 'NLD-name': 12 }, now)))
    expect(read).toEqual({ ok: true, backup: { app: 'lage-landen', version: BACKUP_VERSION, exported: now.toISOString(), progress, drill: { 'NLD-name': 12 } } })
  })
  it('names the file by the day', () => {
    expect(backupName(new Date('2026-10-22T12:00:00'))).toBe('lage-landen-progress-2026-10-22.json')
  })
  it('fills in what a file from before a feature lacks', () => {
    const old: Partial<Progress> = { ...progress }
    delete old.placed
    delete old.legendary
    delete old.quests
    const read = readBackup(text({ app: 'lage-landen', version: 1, exported: now.toISOString(), progress: old }))
    expect(read.ok && read.backup.progress).toEqual({ ...old, placed: [], legendary: [], quests: null })
    expect(read.ok && read.backup.drill).toEqual({})
  })
  it('turns down other files, newer versions and damaged progress, saying why', () => {
    expect(readBackup('not json')).toEqual({ ok: false, error: 'That file isn’t a Lage Landen progress file.' })
    expect(readBackup(text({ app: 'something-else', version: 1, exported: '', progress }))).toMatchObject({ ok: false })
    expect(readBackup(text(makeBackup(progress, {}, now)).replace('"version":1', '"version":2'))).toEqual({
      ok: false,
      error: 'That file was saved by a newer version of Lage Landen. Update the app, then try again.',
    })
    const damaged = [{ ...progress, xp: -5 }, { ...progress, cards: { x: { due: 'soon' } } }, { ...progress, quests: { ...progress.quests!, picks: ['fly'] } }]
    for (const p of damaged) expect(readBackup(text(makeBackup(p as Progress, {}, now)))).toEqual({ ok: false, error: 'That progress file is damaged, so nothing was changed.' })
  })
  it('sums up a progress in a line', () => {
    expect(describe(progress)).toBe('120 XP, 2 lessons and checkpoints finished, 1 question in the review')
  })
})
