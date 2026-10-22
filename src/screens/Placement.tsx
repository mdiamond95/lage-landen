import { useState } from 'react'
import { cards } from '../content'
import { checkpointId } from '../content/checkpoint'
import { buildPlacement, PLACEMENT_PASS, PLACEMENT_SIZE, placementPassed, placementTracks, type PlacementPick } from '../content/placement'
import type { Unit } from '../content/schema'
import { LessonPlayer, type LessonOutcome } from '../lesson/LessonPlayer'
import { lessonXp } from '../lesson/scoring'
import { unitsToPlace } from '../progress/path'
import { recordSession, useProgress } from '../progress/store'
import { photosUsed } from '../photos/used'
import { soundsUsed } from '../sounds/used'
import { Icon } from './Icon'
import { SourceDetails } from './Results'

type Done = { unit: Unit; correct: number; passed: boolean; picks: PlacementPick[] }
type Step =
  | { name: 'pick' }
  | { name: 'play'; queue: Unit[]; picks: PlacementPick[]; done: Done[] }
  | { name: 'between'; queue: Unit[]; done: Done[] }
  | { name: 'summary'; done: Done[] }

const listUnits = (ns: number[]) => (ns.length < 3 ? ns.join(' and ') : `${ns.slice(0, -1).join(', ')} and ${ns[ns.length - 1]}`)

// Unit 0. Pick a track, then answer five questions a unit, in course order. Four
// right opens the whole unit; after a miss the learner can stop there or try the
// next unit anyway (culture units don't build on each other the way history does).
export function Placement({ units, onBack }: { units: Unit[]; onBack: () => void }) {
  const progress = useProgress()
  const [step, setStep] = useState<Step>({ name: 'pick' })
  const tracks = placementTracks(units)

  const play = (queue: Unit[], done: Done[]) => {
    setStep({ name: 'play', queue, picks: buildPlacement(queue[0]), done })
    window.scrollTo(0, 0)
  }
  const finish = (done: Done[]) => {
    setStep(done.length ? { name: 'summary', done } : { name: 'pick' })
    window.scrollTo(0, 0)
  }

  if (step.name === 'play') {
    const unit = step.queue[0]
    const calm = step.picks.some((p) => p.lesson.note)
    return (
      <LessonPlayer
        key={`${unit.id}-${step.done.length}`}
        title={`Placement: Unit ${unit.number}`}
        exercises={step.picks.map((p) => p.exercise)}
        note={calm ? unit.note : undefined}
        calm={calm}
        retry={false}
        onExit={() => finish(step.done)}
        onFinish={(outcome: LessonOutcome) => {
          const correct = outcome.answers.filter(([, right]) => right).length
          const passed = placementPassed(correct)
          recordSession({
            placed: passed ? unit.id : undefined,
            xp: lessonXp(outcome.mistakes, outcome.bonuses),
            perfect: outcome.mistakes === 0,
            places: outcome.places,
            answers: outcome.answers.flatMap(([exercise, right]) => {
              const card = cards.byExercise.get(exercise)
              return card ? [[card.id, right] as [string, boolean]] : []
            }),
          })
          setStep({ name: 'between', queue: step.queue.slice(1), done: [...step.done, { unit, correct, passed, picks: step.picks }] })
          window.scrollTo(0, 0)
        }}
      />
    )
  }

  const back = (
    <header className="lesson-top">
      <button type="button" className="icon-btn" onClick={onBack} aria-label="Back to the course">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="time-travel-title">Placement test</h1>
    </header>
  )

  if (step.name === 'between') {
    const last = step.done[step.done.length - 1]
    const next = step.queue[0]
    const credits = (
      <SourceDetails
        sources={[...new Map(last.picks.flatMap((p) => p.lesson.sources).map((s) => [s.url, s])).values()]}
        photos={photosUsed(last.picks.map((p) => p.exercise))}
        sounds={soundsUsed(last.picks.map((p) => p.exercise))}
      />
    )
    return (
      <div className="placement">
        {back}
        <section className={`placement-verdict card ${last.passed ? 'is-open' : 'is-start'}`} aria-live="polite">
          <Icon name={last.passed ? 'book' : 'signpost'} />
          <p className="eyebrow">Unit {last.unit.number} · {last.unit.title}</p>
          <h2>{last.passed ? `Unit ${last.unit.number} is open` : `Start with Unit ${last.unit.number}`}</h2>
          <p className="placement-score">
            {last.correct} of {PLACEMENT_SIZE} right
          </p>
          <p className="muted">
            {last.passed
              ? 'All its lessons and its checkpoint are open, so you can start anywhere in it or move on.'
              : `${PLACEMENT_PASS} of ${PLACEMENT_SIZE} open a unit. Its lessons will take you through it from the start.`}
          </p>
        </section>
        <div className="placement-actions">
          {next && last.passed && (
            <button type="button" className="btn-primary" onClick={() => play(step.queue, step.done)}>
              Next: Unit {next.number}
            </button>
          )}
          <button type="button" className={next && last.passed ? 'btn-ghost' : 'btn-primary'} onClick={() => finish(step.done)}>
            {next ? 'Stop here' : 'See your results'}
          </button>
          {next && !last.passed && (
            <button type="button" className="btn-ghost" onClick={() => play(step.queue, step.done)}>
              Try Unit {next.number} anyway
            </button>
          )}
        </div>
        {credits}
      </div>
    )
  }

  if (step.name === 'summary') {
    const opened = step.done.filter((d) => d.passed).map((d) => d.unit.number)
    return (
      <div className="placement">
        {back}
        <section className="card placement-summary">
          <h2>{opened.length ? `${opened.length === 1 ? 'Unit' : 'Units'} ${listUnits(opened)} ${opened.length === 1 ? 'is' : 'are'} open` : `Start with Unit ${step.done[0].unit.number}`}</h2>
          <p className="muted">
            {opened.length
              ? 'Their lessons and checkpoints are open on the path. The questions you answered come back in the daily review.'
              : 'No unit opened this time. Its lessons take you through it from the first one, and you can take the test again whenever you like.'}
          </p>
          <ol className="placement-list">
            {step.done.map((d) => (
              <li key={d.unit.id} className={d.passed ? 'is-open' : ''}>
                <span className="outline-num">{d.unit.number}</span>
                <span>{d.unit.title}</span>
                <span className="placement-list-score">
                  {d.correct} of {PLACEMENT_SIZE}
                </span>
                {d.passed && <span className="tag">Open</span>}
              </li>
            ))}
          </ol>
        </section>
        <div className="placement-actions">
          <button type="button" className="btn-primary" onClick={onBack}>
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="placement">
      {back}
      <p className="muted time-travel-intro">
        Know some of this already? Pick a track and answer {PLACEMENT_SIZE} questions a unit, in order. Get {PLACEMENT_PASS} right and the whole unit opens,
        lessons and checkpoint, so you can skip ahead. Stop whenever you like: the units you pass stay open.
      </p>
      {tracks.map((track) => {
        const left = unitsToPlace(progress, track.units, checkpointId)
        const first = track.units[0].number
        const last = track.units[track.units.length - 1].number
        return (
          <section key={track.title} className="card placement-track">
            <div>
              <h2>{track.title}</h2>
              <p>
                Units {first} to {last}
                {left.length < track.units.length && `, ${track.units.length - left.length} of ${track.units.length} already open`}
              </p>
            </div>
            <button type="button" className="btn-ghost" disabled={!left.length} onClick={() => play(left, [])}>
              {left.length ? `Start at Unit ${left[0].number}` : 'All open'}
            </button>
          </section>
        )
      })}
    </div>
  )
}
