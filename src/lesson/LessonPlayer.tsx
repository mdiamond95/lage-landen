import { useState } from 'react'
import type { Exercise } from '../content/schema'
import { MatchPairs } from '../exercises/MatchPairs'
import { PictureChoice } from '../exercises/PictureChoice'
import { PinMap } from '../exercises/PinMap'
import { RegionPaint } from '../exercises/RegionPaint'
import { StoryCard } from '../exercises/StoryCard'
import { TimelineOrder } from '../exercises/TimelineOrder'
import { TrueMyth } from '../exercises/TrueMyth'
import type { Evaluate, Result } from '../exercises/types'

export type LessonOutcome = { mistakes: number; pinBonuses: number; places: string[]; asked: number }

type Props = {
  title: string
  exercises: Exercise[]
  onExit: () => void
  onFinish: (outcome: LessonOutcome) => void
}

// Plays a lesson Duolingo-style: answer, check, read why, continue.
// A question answered wrong comes back once at the end of the lesson.
export function LessonPlayer({ title, exercises, onExit, onFinish }: Props) {
  const [queue, setQueue] = useState(exercises)
  const [index, setIndex] = useState(0)
  const [evaluate, setEvaluate] = useState<Evaluate | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [requeued, setRequeued] = useState(false)
  const [retried, setRetried] = useState<Set<Exercise>>(new Set())
  const [tally, setTally] = useState<LessonOutcome>({ mistakes: 0, pinBonuses: 0, places: [], asked: 0 })

  const exercise = queue[index]
  const isStory = exercise.type === 'story'
  const progress = index / queue.length

  const setAnswer = (fn: Evaluate | null) => setEvaluate(() => fn)

  const check = () => {
    if (!evaluate) return
    const r = evaluate()
    setResult(r)
    setTally((t) => ({
      mistakes: t.mistakes + (r.correct ? 0 : 1),
      pinBonuses: t.pinBonuses + (r.bonus && !retried.has(exercise) ? 1 : 0),
      places: r.places ? [...t.places, ...r.places] : t.places,
      asked: t.asked + 1,
    }))
    const again = !r.correct && !retried.has(exercise)
    setRequeued(again)
    if (again) {
      setQueue((q) => [...q, exercise])
      setRetried((s) => new Set(s).add(exercise))
    }
  }

  const next = () => {
    if (index + 1 >= queue.length) {
      onFinish(tally)
      return
    }
    setIndex(index + 1)
    setEvaluate(null)
    setResult(null)
    setRequeued(false)
  }

  const props = { checked: result !== null, setAnswer }
  const body = (() => {
    switch (exercise.type) {
      case 'story':
        return <StoryCard exercise={exercise} />
      case 'pin':
        return <PinMap exercise={exercise} {...props} />
      case 'region':
        return <RegionPaint exercise={exercise} {...props} />
      case 'order':
        return <TimelineOrder exercise={exercise} {...props} />
      case 'choice':
        return <PictureChoice exercise={exercise} {...props} />
      case 'truemyth':
        return <TrueMyth exercise={exercise} {...props} />
      case 'match':
        return <MatchPairs exercise={exercise} {...props} />
    }
  })()

  return (
    <div className="lesson">
      <header className="lesson-top">
        <button type="button" className="icon-btn" onClick={onExit} aria-label="Leave lesson">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label={`${title} progress`}>
          <div className="progress-fill" style={{ width: `${Math.max(4, progress * 100)}%` }} />
        </div>
      </header>

      <main className="lesson-body" key={index}>
        {body}
      </main>

      <footer className={`lesson-foot ${result ? (result.correct ? 'is-right' : 'is-wrong') : ''}`} aria-live="polite">
        {result && (
          <div className="feedback">
            <p className="feedback-head">{result.correct ? (result.bonus ? 'Spot on! +2 XP' : 'Correct!') : 'Not quite'}</p>
            <p className="feedback-detail">{result.detail}</p>
            {requeued && <p className="feedback-note">You'll see this one again before the lesson ends.</p>}
          </div>
        )}
        {isStory ? (
          <button type="button" className="btn-primary" onClick={next}>
            Continue
          </button>
        ) : result ? (
          <button type="button" className="btn-primary" onClick={next}>
            Continue
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={check} disabled={!evaluate}>
            Check
          </button>
        )}
      </footer>
    </div>
  )
}
