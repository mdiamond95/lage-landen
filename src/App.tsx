import { useState } from 'react'
import { buildCheckpoint, checkpointId } from './content/checkpoint'
import { cards, findLesson, units } from './content'
import type { Exercise, Lesson } from './content/schema'
import { LessonPlayer, type LessonOutcome } from './lesson/LessonPlayer'
import { lessonXp } from './lesson/scoring'
import { dueToday, pickReview } from './progress/review'
import { getProgress, recordSession, todayKey } from './progress/store'
import { buildLegendary, buildLevel, hasLegendary, legendaryId, timeLimit } from './content/levels'
import { lessonLevel } from './progress/path'
import { legendaryCrown, lessonCrown, type CrownNote } from './progress/crowns'
import { Home } from './screens/Home'
import { Results } from './screens/Results'
import { TimeTravel } from './screens/TimeTravel'
import { MapDrill } from './screens/MapDrill'
import { Phrasebook } from './screens/Phrasebook'
import { Placement } from './screens/Placement'
import { photosUsed } from './photos/used'
import { soundsUsed } from './sounds/used'

// `note` is a content note shown first; `calm` plays without celebrations, for
// lessons on painful subjects and any review or checkpoint that draws on them.
// A lesson carries the crown level it is played for; a Legendary challenge its unit
// and the seconds on its clock.
type Playing = {
  id: string
  title: string
  exercises: Exercise[]
  sources: Lesson['sources']
  note?: string
  calm?: boolean
  retry?: boolean
  level?: { before: number; target: number; legendary: boolean }
  legendary?: { unit: string; number: number; seconds: number }
}

const REVIEW_ID = 'review'
type Screen =
  | { name: 'home' }
  | { name: 'timemap' }
  | { name: 'phrasebook' }
  | { name: 'drill' }
  | { name: 'placement' }
  | { name: 'lesson'; playing: Playing }
  | { name: 'results'; playing: Playing; outcome: LessonOutcome; xp: number; crown?: CrownNote }

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
    calm: units.some((u) => u.lessons.some((l) => l.note && lessonIds.has(l.id))),
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
      note: cp.note,
      calm: cp.lessons.some((l) => l.note),
    }
  const legend = units.find((u) => legendaryId(u.id) === id)
  if (legend) {
    const exercises = buildLegendary(legend)
    const seconds = timeLimit(exercises)
    return {
      id,
      title: `Unit ${legend.number} Legendary`,
      exercises,
      sources: legend.lessons.flatMap((l) => l.sources),
      retry: false,
      legendary: { unit: legend.id, number: legend.number, seconds },
    }
  }
  const found = findLesson(id)
  if (!found) return undefined
  const { unit, lesson } = found
  // A finished lesson plays for the next level up; at level 4 and above, as written.
  const before = lessonLevel(getProgress(), unit, lesson.id)
  const target = before === 0 ? 1 : Math.min(before + 1, 4)
  const play = buildLevel(lesson, before >= 4 ? 5 : target)
  return {
    id,
    title: target > 1 && before < 4 ? `${lesson.title}, level ${target}` : lesson.title,
    exercises: play.exercises,
    retry: play.retry,
    sources: lesson.sources,
    note: lesson.note,
    calm: !!lesson.note,
    level: { before, target, legendary: hasLegendary(unit) },
  }
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
        note={playing.note}
        calm={playing.calm}
        retry={playing.retry}
        timeLimit={playing.legendary?.seconds}
        onExit={home}
        onFinish={(outcome) => {
          const xp = lessonXp(outcome.mistakes, outcome.bonuses)
          const right = outcome.answers.filter(([, ok]) => ok).length
          const { level, legendary } = playing
          const crown = level
            ? lessonCrown(level.before, level.target, right, outcome.answers.length, level.legendary)
            : legendary
              ? legendaryCrown(legendary.number, right, playing.exercises.length, !!outcome.timedOut)
              : undefined
          recordSession({
            lessonId: playing.id === REVIEW_ID || legendary ? undefined : playing.id,
            level: level ? crown?.level : undefined,
            legendary: legendary && crown && 'passed' in crown && crown.passed ? legendary.unit : undefined,
            xp,
            perfect: outcome.mistakes === 0,
            places: outcome.places,
            answers: outcome.answers.flatMap(([exercise, correct]) => {
              const card = cards.byExercise.get(exercise)
              return card ? [[card.id, correct] as [string, boolean]] : []
            }),
          })
          setScreen({ name: 'results', playing, outcome, xp, crown })
        }}
      />
    )
  }
  if (screen.name === 'timemap') return <TimeTravel onBack={home} />
  if (screen.name === 'phrasebook') return <Phrasebook onBack={home} />
  if (screen.name === 'drill') return <MapDrill onBack={home} />
  if (screen.name === 'placement') return <Placement units={units} onBack={home} />
  if (screen.name === 'results') {
    return <Results title={screen.playing.title} outcome={screen.outcome} xp={screen.xp} sources={screen.playing.sources} photos={photosUsed(screen.playing.exercises)} sounds={soundsUsed(screen.playing.exercises)} calm={screen.playing.calm} crown={screen.crown} onDone={home} />
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
      onPhrasebook={() => {
        setScreen({ name: 'phrasebook' })
        window.scrollTo(0, 0)
      }}
      onDrill={() => {
        setScreen({ name: 'drill' })
        window.scrollTo(0, 0)
      }}
      onPlacement={() => {
        setScreen({ name: 'placement' })
        window.scrollTo(0, 0)
      }}
    />
  )
}
