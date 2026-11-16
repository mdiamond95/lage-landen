import { useSyncExternalStore } from 'react'
import { backupName, makeBackup } from './backup'
import { loadBest } from './drill'
import { getProgress } from './store'

// Keeping progress safe. It lives only in this browser's storage, which a browser may
// clear: Safari deletes a site's storage after seven days without a visit unless the
// site was added to the home screen, and any browser may clear storage when the device
// runs short unless the site's storage was made persistent. So the app asks for
// persistent storage once a lesson is finished, and reminds the learner now and then
// to save a backup file. When the last file was saved is kept apart from the progress,
// so loading a file doesn't change it.

const KEY = 'lage-landen:backup:v1'
export type Kept = { saved?: string; snoozed?: string }

export const loadKept = (): Kept => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Kept
  } catch {
    return {}
  }
}

const listeners = new Set<() => void>()
let snapshot = loadKept()

const store = (kept: Kept) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(kept))
  } catch {
    // Nothing to do: the reminder just comes back.
  }
  snapshot = kept
  listeners.forEach((l) => l())
}

// The home screen's reminder and the backup card both show it, so both follow it.
export const useKept = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => snapshot,
  )

export const markSaved = (now = new Date()) => store({ ...loadKept(), saved: now.toISOString(), snoozed: undefined })
export const snooze = (now = new Date()) => store({ ...loadKept(), snoozed: now.toISOString() })

// Asks the browser to keep this site's storage. Chrome and Edge answer silently, and
// Firefox asks the learner once; it is only asked when it hasn't been granted already.
export const keepStorage = async () => {
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) await navigator.storage.persist()
  } catch {
    // Not offered here: the backup reminder covers it.
  }
}

export const storageKept = async () => {
  try {
    return (await navigator.storage?.persisted?.()) ?? false
  } catch {
    return false
  }
}

// An iPhone or iPad browsing in Safari rather than from the home screen.
export const onIosBrowser = () => {
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1)
  const standalone = (navigator as Navigator & { standalone?: boolean }).standalone === true || window.matchMedia?.('(display-mode: standalone)').matches
  return ios && !standalone
}

const DAY = 86_400_000
export const BACKUP_EVERY = 14
const FIRST_AFTER = 3

// A reminder is due once there is something worth keeping (three lessons finished),
// storage isn't kept for sure, no file was saved in the last two weeks, and it wasn't
// put off in the last week.
export const backupDue = (lessonsDone: number, kept: Kept, safe: boolean, now = new Date()) => {
  if (safe || lessonsDone < FIRST_AFTER) return false
  const ago = (iso?: string) => (iso ? (now.getTime() - Date.parse(iso)) / DAY : Infinity)
  return ago(kept.saved) >= BACKUP_EVERY && ago(kept.snoozed) >= 7
}

export const daysSince = (iso: string, now = new Date()) => Math.max(0, Math.floor((now.getTime() - Date.parse(iso)) / DAY))

// Downloads the progress as a file, and notes when, for the backup reminder.
export const saveBackupFile = () => {
  const now = new Date()
  const blob = new Blob([JSON.stringify(makeBackup(getProgress(), loadBest(), now), null, 1)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = backupName(now)
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  markSaved(now)
  return backupName(now)
}
