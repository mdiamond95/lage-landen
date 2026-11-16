import { useRef, useState } from 'react'
import { describe, readBackup, type Backup } from '../progress/backup'
import { saveBest } from '../progress/drill'
import { getProgress, replaceProgress } from '../progress/store'
import { getLang, langTags, t } from '../i18n'
import { onIosBrowser, saveBackupFile, useKept } from '../progress/keep'

type Step = { name: 'idle' } | { name: 'check'; backup: Backup } | { name: 'error'; text: string } | { name: 'done'; text: string }

const dateOf = (iso: string) => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? t('an unknown date') : d.toLocaleDateString(langTags[getLang()], { year: 'numeric', month: 'long', day: 'numeric' })
}

// Progress lives on the device, so this card saves it to a file and loads one back: a
// backup, or the way to carry it to another phone or computer. Loading shows what the
// file holds next to what the device holds, and replaces nothing until it is confirmed.
export function BackupCard() {
  const [step, setStep] = useState<Step>({ name: 'idle' })
  const input = useRef<HTMLInputElement>(null)

  const kept = useKept()
  const save = () => {
    const file = saveBackupFile()
    setStep({ name: 'done', text: t('Saved as {file}.', { file }) })
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
    setStep({ name: 'done', text: t('Progress loaded from the file.') })
  }

  return (
    <section className="backup card" aria-label={t('Your progress')}>
      <h2>{t('Your progress')}</h2>
      <p>{t('Everything is kept on this device. Save it to a file to keep a backup, or to carry it to another phone or computer and load it there.')}</p>
      {kept.saved && <p className="muted">{t('Last saved to a file on {date}.', { date: dateOf(kept.saved) })}</p>}
      {onIosBrowser() && <p className="muted">{t('On an iPhone or iPad, add Lage Landen to the home screen: Safari clears what a site keeps after a week without a visit, but not for an app on the home screen.')}</p>}
      <div className="backup-actions">
        <button type="button" className="btn-ghost" onClick={save}>
          {t('Save to a file')}
        </button>
        <label className="btn-ghost backup-load">
          {t('Load from a file')}
          <input ref={input} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
        </label>
      </div>
      {step.name === 'check' && (
        <div className="backup-check" role="alertdialog" aria-label={t('Replace your progress?')}>
          <p className="crown-head">{t('Replace your progress?')}</p>
          <p>{t('The file, saved on {date}: {what}.', { date: dateOf(step.backup.exported), what: describe(step.backup.progress) })}</p>
          <p>{t('This device now: {what}.', { what: describe(getProgress()) })}</p>
          <div className="backup-actions">
            <button type="button" className="btn-primary" onClick={() => load(step.backup)}>
              {t('Replace my progress')}
            </button>
            <button type="button" className="btn-ghost" onClick={() => setStep({ name: 'idle' })}>
              {t("Keep what's here")}
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
