import { useState } from 'react'
import type { Exercise } from '../content/schema'
import { DetailHunt } from '../exercises/DetailHunt'
import { FillGap } from '../exercises/FillGap'
import { MatchPairs } from '../exercises/MatchPairs'
import { OddOneOut } from '../exercises/OddOneOut'
import { PictureChoice } from '../exercises/PictureChoice'
import { PinMap } from '../exercises/PinMap'
import { RegionPaint } from '../exercises/RegionPaint'
import { ScrubMap } from '../exercises/ScrubMap'
import { SortGroups } from '../exercises/SortGroups'
import { StoryCard } from '../exercises/StoryCard'
import { StyleSorter } from '../exercises/StyleSorter'
import { LabelParts } from '../exercises/LabelParts'
import { ListenMap } from '../exercises/ListenMap'
import { PickAll } from '../exercises/PickAll'
import { TasteMap } from '../exercises/TasteMap'
import { WhenWheel } from '../exercises/WhenWheel'
import { TimelineOrder } from '../exercises/TimelineOrder'
import { TrueMyth } from '../exercises/TrueMyth'
import type { Evaluate, Result } from '../exercises/types'
import { Voices } from '../exercises/Voices'
import { WhoAmI } from '../exercises/WhoAmI'
import { stopSound } from '../sounds/player'
import { XP } from './scoring'

// `answers` holds each question's first try, for the review schedule.
export type LessonOutcome = { mistakes: number; bonuses: number; places: string[]; asked: number; answers: [Exercise, boolean][] }

type Props = {
  title: string
  exercises: Exercise[]
  // Shown before the first question of a lesson on a painful subject.
  note?: string
  // No cheering: a quieter "Correct" in place of "Spot on!".
  calm?: boolean
  onExit: () => void
  onFinish: (outcome: LessonOutcome) => void
}

const feedbackHead = (r: Result, calm: boolean) => {
  if (!r.correct) return 'Not quite'
  if (calm) return r.bonus ? `Correct. +${XP.bonus} XP` : 'Correct'
  return r.bonus ? `Spot on! +${XP.bonus} XP` : 'Correct!'
}

// Plays a lesson Duolingo-style: answer, check, read why, continue.
// A question answered wrong comes back once at the end of the lesson.
export function LessonPlayer({ title, exercises, note, calm = false, onExit, onFinish }: Props) {
  const [noteRead, setNoteRead] = useState(!note)
  const [queue, setQueue] = useState(exercises)
  const [index, setIndex] = useState(0)
  const [evaluate, setEvaluate] = useState<Evaluate | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [requeued, setRequeued] = useState(false)
  const [retried, setRetried] = useState<Set<Exercise>>(new Set())
  const [tally, setTally] = useState<LessonOutcome>({ mistakes: 0, bonuses: 0, places: [], asked: 0, answers: [] })

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
      bonuses: t.bonuses + (r.bonus && !retried.has(exercise) ? 1 : 0),
      places: r.places ? [...t.places, ...r.places] : t.places,
      asked: t.asked + 1,
      answers: retried.has(exercise) ? t.answers : [...t.answers, [exercise, r.correct]],
    }))
    const again = !r.correct && !retried.has(exercise)
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
      case 'cause':
        return <MatchPairs exercise={exercise} {...props} />
      case 'who':
        return <WhoAmI exercise={exercise} {...props} />
      case 'scrub':
        return <ScrubMap exercise={exercise} {...props} />
      case 'hunt':
        return <DetailHunt exercise={exercise} {...props} />
      case 'gap':
        return <FillGap exercise={exercise} {...props} />
      case 'odd':
        return <OddOneOut exercise={exercise} {...props} />
      case 'voices':
        return <Voices exercise={exercise} {...props} />
      case 'sort':
        return <SortGroups exercise={exercise} {...props} />
      case 'style':
        return <StyleSorter exercise={exercise} {...props} />
      case 'label':
        return <LabelParts exercise={exercise} {...props} />
      case 'listen':
        return <ListenMap exercise={exercise} {...props} />
      case 'taste':
        return <TasteMap exercise={exercise} {...props} />
      case 'pick':
        return <PickAll exercise={exercise} {...props} />
      case 'when':
        return <WhenWheel exercise={exercise} {...props} />
    }
  })()

  return (
    <div className="lesson">
      <header className="lesson-top">
        <button type="button" className="icon-btn" onClick={() => (stopSound(), onExit())} aria-label="Leave lesson">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label={`${title} progress`}>
          <div className="progress-fill" style={{ width: `${Math.max(4, progress * 100)}%` }} />
        </div>
      </header>

      <main className="lesson-body" key={noteRead ? index : 'note'}>
        {noteRead ? (
          body
        ) : (
          <div className="exercise">
            <p className="eyebrow">Content note</p>
            <div className="content-note">
              <h2>Before you begin</h2>
              <p>{note}</p>
            </div>
          </div>
        )}
      </main>

      <footer className={`lesson-foot ${result ? (result.correct ? 'is-right' : 'is-wrong') : ''}`} aria-live="polite">
        {result && (
          <div className="feedback">
            <p className="feedback-head">{feedbackHead(result, calm)}</p>
            <p className="feedback-detail">{result.detail}</p>
            {requeued && <p className="feedback-note">You'll see this one again before the lesson ends.</p>}
          </div>
        )}
        {!noteRead ? (
          <button type="button" className="btn-primary" onClick={() => setNoteRead(true)}>
            Continue
          </button>
        ) : isStory ? (
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
