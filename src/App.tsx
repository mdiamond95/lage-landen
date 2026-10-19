import { useState } from 'react'
import { buildCheckpoint, checkpointId } from './content/checkpoint'
import { findLesson, units } from './content'
import type { Exercise, Lesson } from './content/schema'
import { LessonPlayer, type LessonOutcome } from './lesson/LessonPlayer'
import { lessonXp } from './lesson/scoring'
import { recordLesson } from './progress/store'
import { Home } from './screens/Home'
import { Results } from './screens/Results'

type Playing = { id: string; title: string; exercises: Exercise[]; sources: Lesson['sources'] }
type Screen = { name: 'home' } | { name: 'lesson'; playing: Playing } | { name: 'results'; playing: Playing; outcome: LessonOutcome; xp: number }

const resolve = (id: string): Playing | undefined => {
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
          const xp = lessonXp(outcome.mistakes, outcome.pinBonuses)
          recordLesson(playing.id, xp, outcome.mistakes === 0, outcome.places)
          setScreen({ name: 'results', playing, outcome, xp })
        }}
      />
    )
  }
  if (screen.name === 'results') {
    return <Results title={screen.playing.title} outcome={screen.outcome} xp={screen.xp} sources={screen.playing.sources} onDone={home} />
  }
  return (
    <Home
      units={units}
      onStart={(id) => {
        const playing = resolve(id)
        if (playing) setScreen({ name: 'lesson', playing })
        window.scrollTo(0, 0)
      }}
    />
  )
}
