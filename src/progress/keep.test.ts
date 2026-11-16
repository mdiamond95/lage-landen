import { describe, expect, it } from 'vitest'
import { backupDue, daysSince } from './keep'

const now = new Date('2026-11-15T12:00:00Z')
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000).toISOString()

describe('the backup reminder', () => {
  it('waits until there is something worth keeping', () => {
    expect(backupDue(2, {}, false, now)).toBe(false)
    expect(backupDue(3, {}, false, now)).toBe(true)
  })
  it('is never shown when the browser keeps the storage', () => {
    expect(backupDue(30, {}, true, now)).toBe(false)
  })
  it('comes back two weeks after the last file was saved', () => {
    expect(backupDue(10, { saved: daysAgo(13) }, false, now)).toBe(false)
    expect(backupDue(10, { saved: daysAgo(14) }, false, now)).toBe(true)
  })
  it('stays away for a week when put off', () => {
    expect(backupDue(10, { snoozed: daysAgo(6) }, false, now)).toBe(false)
    expect(backupDue(10, { snoozed: daysAgo(7) }, false, now)).toBe(true)
  })
  it('counts whole days', () => {
    expect(daysSince(daysAgo(20.5), now)).toBe(20)
  })
})
