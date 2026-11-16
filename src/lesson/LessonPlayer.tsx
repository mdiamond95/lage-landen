import { useEffect, useState } from 'react'
import type { Exercise } from '../content/schema'
import type { Evaluate, Result } from '../exercises/types'
import { ExerciseView } from './ExerciseView'
import { stopSound } from '../sounds/player'
import { XP } from './scoring'
import { cheer } from '../mascot/lines'
import type { HatId } from '../mascot/hats'
import { Stork } from '../mascot/Stork'
import { t } from '../i18n'

// `answers` holds each question's first try, for the review schedule; `timedOut` that
// the clock of a timed challenge ran out before the last question.
export type LessonOutcome = { mistakes: number; bonuses: number; places: string[]; asked: number; answers: [Exercise, boolean][]; timedOut?: boolean }

type Props = {
  title: string
  exercises: Exercise[]
  // Shown before the first question of a lesson on a painful subject.
  note?: string
  // No cheering: a quieter "Correct" in place of "Spot on!", and no stork.
  calm?: boolean
  // The stork's hat, from the unit being played.
  hat?: HatId
  // Whether a wrong answer comes back at the end; a placement test asks each question once.
  retry?: boolean
  // Seconds on the clock for a timed challenge (Legendary). It runs only while a
  // question is open, and the challenge ends when it runs out.
  timeLimit?: number
  onExit: () => void
  onFinish: (outcome: LessonOutcome) => void
}

const feedbackHead = (r: Result, calm: boolean) => {
  if (!r.correct) return t('Not quite')
  if (calm) return r.bonus ? t('Correct. +{xp} XP', { xp: XP.bonus }) : t('Correct')
  return r.bonus ? t('Spot on! +{xp} XP', { xp: XP.bonus }) : t('Correct!')
}

// Plays a lesson Duolingo-style: answer, check, read why, continue.
// A question answered wrong comes back once at the end of the lesson.
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export function LessonPlayer({ title, exercises, note, calm = false, hat, retry = true, timeLimit, onExit, onFinish }: Props) {
  const [noteRead, setNoteRead] = useState(!note)
  const [queue, setQueue] = useState(exercises)
  const [index, setIndex] = useState(0)
  const [evaluate, setEvaluate] = useState<Evaluate | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [requeued, setRequeued] = useState(false)
  const [retried, setRetried] = useState<Set<Exercise>>(new Set())
  const [tally, setTally] = useState<LessonOutcome>({ mistakes: 0, bonuses: 0, places: [], asked: 0, answers: [] })

  const [left, setLeft] = useState(timeLimit ?? 0)
  // Right answers in a row and wrong ones in a row, for the stork's cheers.
  const [streak, setStreak] = useState({ run: 0, slips: 0 })
  const [cheered, setCheered] = useState<string | undefined>()

  const exercise = queue[index]
  const isStory = exercise.type === 'story'
  const progress = index / queue.length
  const ticking = timeLimit !== undefined && noteRead && !isStory && !result && left > 0

  useEffect(() => {
    if (!ticking) return
    const id = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(id)
  }, [ticking])

  useEffect(() => {
    if (timeLimit !== undefined && left === 0 && !result) {
      stopSound()
      onFinish({ ...tally, timedOut: true })
    }
    // Only the clock reaching zero ends the challenge.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left])

  const setAnswer = (fn: Evaluate | null) => setEvaluate(() => fn)

  // On a short screen a question's answers can sit below the picture, out of sight:
  // until one is picked, the Check button says so instead, and scrolls them into view.
  const [answersBelow, setAnswersBelow] = useState(false)
  const asking = noteRead && !isStory && !result
  useEffect(() => {
    if (!asking) {
      setAnswersBelow(false)
      return
    }
    const measure = () => {
      const options = document.querySelectorAll('.lesson-body .options .option')
      const foot = document.querySelector('.lesson-foot')
      const last = options[options.length - 1]
      setAnswersBelow(!!last && !!foot && last.getBoundingClientRect().bottom > foot.getBoundingClientRect().top + 4)
    }
    measure()
    const body = document.querySelector('.lesson-body')
    const resized = new ResizeObserver(measure)
    if (body) resized.observe(body)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      resized.disconnect()
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [asking, index])
  const showAnswers = () => document.querySelector('.lesson-body .options')?.scrollIntoView({ block: 'end', behavior: 'smooth' })


  const check = () => {
    if (!evaluate) return
    const r = evaluate()
    setResult(r)
    const run = r.correct ? streak.run + 1 : 0
    setCheered(r.correct && !calm ? cheer(run, streak.slips) : undefined)
    setStreak({ run, slips: r.correct ? 0 : streak.slips + 1 })
    setTally((t) => ({
      mistakes: t.mistakes + (r.correct ? 0 : 1),
      bonuses: t.bonuses + (r.bonus && !retried.has(exercise) ? 1 : 0),
      places: r.places ? [...t.places, ...r.places] : t.places,
      asked: t.asked + 1,
      answers: retried.has(exercise) ? t.answers : [...t.answers, [exercise, r.correct]],
    }))
    const again = retry && !r.correct && !retried.has(exercise)
    setRequeued(again)
    if (again) {
      setQueue((q) => [...q, exercise])
      setRetried((s) => new Set(s).add(exercise))
    }
  }

  const next = () => {
    stopSound()
    if (index + 1 >= queue.length) {
      onFinish(tally)
      return
    }
    setIndex(index + 1)
    setEvaluate(null)
    setResult(null)
    setRequeued(false)
    setCheered(undefined)
  }

  const props = { checked: result !== null, setAnswer }
  const body = <ExerciseView exercise={exercise} {...props} />

  return (
    <div className="lesson">
      <header className="lesson-top">
        <button type="button" className="icon-btn" onClick={() => (stopSound(), onExit())} aria-label={t('Leave lesson')}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label={t('{title} progress', { title })}>
          <div className="progress-fill" style={{ width: `${Math.max(4, progress * 100)}%` }} />
        </div>
        {timeLimit !== undefined && (
          <span className={`lesson-clock ${left <= 30 ? 'is-low' : ''}`} role="timer" aria-label={t('Time left {time}', { time: clock(left) })}>
            {clock(left)}
          </span>
        )}
      </header>

      {/* The lessons are in English, whatever the interface language. */}
      <main className="lesson-body" key={noteRead ? index : 'note'} lang="en-CA">
        {noteRead ? (
          body
        ) : (
          <div className="exercise">
            <p className="eyebrow">{t('Content note')}</p>
            <div className="content-note">
              <h2>{t('Before you begin')}</h2>
              <p>{note}</p>
            </div>
          </div>
        )}
      </main>

      <footer className={`lesson-foot ${result ? (result.correct ? 'is-right' : 'is-wrong') : ''}`} aria-live="polite">
        {result && (
          <div className={`feedback ${cheered ? 'has-stork' : ''}`}>
            {cheered && <Stork hat={hat} size={52} className="stork-cheer" />}
            <div>
              <p className="feedback-head">{feedbackHead(result, calm)}</p>
              {cheered && <p className="stork-line">{cheered}</p>}
              <p className="feedback-detail">{result.detail}</p>
              {requeued && <p className="feedback-note">{t("You'll see this one again before the lesson ends.")}</p>}
            </div>
          </div>
        )}
        {!noteRead ? (
          <button type="button" className="btn-primary" onClick={() => setNoteRead(true)}>
            {t('Continue')}
          </button>
        ) : isStory ? (
          <button type="button" className="btn-primary" onClick={next}>
            {t('Continue')}
          </button>
        ) : result ? (
          <button type="button" className="btn-primary" onClick={next}>
            {t('Continue')}
          </button>
        ) : answersBelow && !evaluate ? (
          <button type="button" className="btn-primary answers-below" onClick={showAnswers}>
            {t('Answers below')}
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={check} disabled={!evaluate}>
            {t('Check')}
          </button>
        )}
      </footer>
    </div>
  )
}
