import { useRef, useState } from 'react'
import { backupName, describe, makeBackup, readBackup, type Backup } from '../progress/backup'
import { loadBest, saveBest } from '../progress/drill'
import { getProgress, replaceProgress } from '../progress/store'

type Step = { name: 'idle' } | { name: 'check'; backup: Backup } | { name: 'error'; text: string } | { name: 'done'; text: string }

const dateOf = (iso: string) => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? 'an unknown date' : d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Progress lives on the device, so this card saves it to a file and loads one back: a
// backup, or the way to carry it to another phone or computer. Loading shows what the
// file holds next to what the device holds, and replaces nothing until it is confirmed.
export function BackupCard() {
  const [step, setStep] = useState<Step>({ name: 'idle' })
  const input = useRef<HTMLInputElement>(null)

  const save = () => {
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
    setStep({ name: 'done', text: `Saved as ${backupName(now)}.` })
  }

  const pick = async (file: File | undefined) => {
    if (!file) return
    const read = readBackup(await file.text())
    setStep(read.ok ? { name: 'check', backup: read.backup } : { name: 'error', text: read.error })
    if (input.current) input.current.value = ''
  }

  const load = (backup: Backup) => {
    replaceProgress(backup.progress)
    saveBest(backup.drill)
    setStep({ name: 'done', text: 'Progress loaded from the file.' })
  }

  return (
    <section className="backup card" aria-label="Your progress">
      <h2>Your progress</h2>
      <p>Everything is kept on this device. Save it to a file to keep a backup, or to carry it to another phone or computer and load it there.</p>
      <div className="backup-actions">
        <button type="button" className="btn-ghost" onClick={save}>
          Save to a file
        </button>
        <label className="btn-ghost backup-load">
          Load from a file
          <input ref={input} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
        </label>
      </div>
      {step.name === 'check' && (
        <div className="backup-check" role="alertdialog" aria-label="Replace your progress?">
          <p className="crown-head">Replace your progress?</p>
          <p>
            The file, saved on {dateOf(step.backup.exported)}: {describe(step.backup.progress)}.
          </p>
          <p>This device now: {describe(getProgress())}.</p>
          <div className="backup-actions">
            <button type="button" className="btn-primary" onClick={() => load(step.backup)}>
              Replace my progress
            </button>
            <button type="button" className="btn-ghost" onClick={() => setStep({ name: 'idle' })}>
              Keep what's here
            </button>
          </div>
        </div>
      )}
      {step.name === 'error' && (
        <p className="backup-note is-error" role="alert">
          {step.text}
        </p>
      )}
      {step.name === 'done' && (
        <p className="backup-note" role="status">
          {step.text}
        </p>
      )}
    </section>
  )
}
