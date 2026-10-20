import { useState } from 'react'
import { buildCheckpoint, checkpointId } from './content/checkpoint'
import { cards, findLesson, units } from './content'
import type { Exercise, Lesson } from './content/schema'
import { LessonPlayer, type LessonOutcome } from './lesson/LessonPlayer'
import { lessonXp } from './lesson/scoring'
import { dueToday, pickReview } from './progress/review'
import { getProgress, recordSession, todayKey } from './progress/store'
import { Home } from './screens/Home'
import { Results } from './screens/Results'
import { TimeTravel } from './screens/TimeTravel'
import { photosUsed } from './photos/used'

type Playing = { id: string; title: string; exercises: Exercise[]; sources: Lesson['sources'] }

const REVIEW_ID = 'review'
type Screen = { name: 'home' } | { name: 'timemap' } | { name: 'lesson'; playing: Playing } | { name: 'results'; playing: Playing; outcome: LessonOutcome; xp: number }

// Today's review: up to ten due questions from the lessons finished so far.
const buildReview = (): Playing => {
  const p = getProgress()
  const picked = pickReview(dueToday(cards.items, p.cards, p.completed, todayKey()))
  const lessonIds = new Set(picked.map((c) => c.lessonId))
  return {
    id: REVIEW_ID,
    title: 'Daily review',
    exercises: picked.map((c) => c.exercise),
    sources: units.flatMap((u) => u.lessons.filter((l) => lessonIds.has(l.id)).flatMap((l) => l.sources)),
  }
}

const resolve = (id: string): Playing | undefined => {
  if (id === REVIEW_ID) {
    const review = buildReview()
    return review.exercises.length ? review : undefined
  }
  const cp = units.find((u) => checkpointId(u) === id)
  if (cp)
    return {
      id,
      title: `Unit ${cp.number} checkpoint`,
      exercises: buildCheckpoint(cp),
      sources: cp.lessons.flatMap((l) => l.sources),
    }
  const found = findLesson(id)
  return found && { id, title: found.lesson.title, exercises: found.lesson.exercises, sources: found.lesson.sources }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const home = () => {
    setScreen({ name: 'home' })
    window.scrollTo(0, 0)
  }

  if (screen.name === 'lesson') {
    const { playing } = screen
    return (
      <LessonPlayer
        key={playing.id}
        title={playing.title}
        exercises={playing.exercises}
        onExit={home}
        onFinish={(outcome) => {
          const xp = lessonXp(outcome.mistakes, outcome.bonuses)
          recordSession({
            lessonId: playing.id === REVIEW_ID ? undefined : playing.id,
            xp,
            perfect: outcome.mistakes === 0,
            places: outcome.places,
            answers: outcome.answers.flatMap(([exercise, correct]) => {
              const card = cards.byExercise.get(exercise)
              return card ? [[card.id, correct] as [string, boolean]] : []
            }),
          })
          setScreen({ name: 'results', playing, outcome, xp })
        }}
      />
    )
  }
  if (screen.name === 'timemap') return <TimeTravel onBack={home} />
  if (screen.name === 'results') {
    return <Results title={screen.playing.title} outcome={screen.outcome} xp={screen.xp} sources={screen.playing.sources} photos={photosUsed(screen.playing.exercises)} onDone={home} />
  }
  return (
    <Home
      units={units}
      onStart={(id) => {
        const playing = resolve(id)
        if (playing) setScreen({ name: 'lesson', playing })
        window.scrollTo(0, 0)
      }}
      onTimeMap={() => {
        setScreen({ name: 'timemap' })
        window.scrollTo(0, 0)
      }}
    />
  )
}
