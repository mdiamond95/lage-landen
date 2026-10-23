import { useState } from 'react'
import { buildCheckpoint, checkpointId } from './content/checkpoint'
import { buildMapStory, mapStoryId } from './content/mapStory'
import { cards, findLesson, units } from './content'
import type { Exercise, Lesson } from './content/schema'
import { LessonPlayer, type LessonOutcome } from './lesson/LessonPlayer'
import { lessonXp } from './lesson/scoring'
import { dueToday, pickReview } from './progress/review'
import { ensureQuests, getProgress, recordSession, todayKey } from './progress/store'
import { canToday } from './content/today'
import type { QuestId } from './progress/quests'
import { buildLegendary, buildLevel, hasLegendary, legendaryId, timeLimit } from './content/levels'
import { GATE, lessonLevel, unitMastered, unitsAfter } from './progress/path'
import { legendaryCrown, lessonCrown, type CrownNote } from './progress/crowns'
import { Home } from './screens/Home'
import { Results } from './screens/Results'
import { TimeTravel } from './screens/TimeTravel'
import { MapDrill } from './screens/MapDrill'
import { Phrasebook } from './screens/Phrasebook'
import { Placement } from './screens/Placement'
import { Museum } from './screens/Museum'
import { CityExplorer } from './screens/CityExplorer'
import { wall } from './content/wall'
import { newCards, type Hung } from './progress/collection'
import { photosUsed } from './photos/used'
import { soundsUsed } from './sounds/used'
import { unitHat, type HatId } from './mascot/hats'
import { list, t, useLang } from './i18n'

// `note` is a content note shown first; `calm` plays without celebrations, for
// lessons on painful subjects and any review or checkpoint that draws on them.
// What a checkpoint did at the mastery gate, for the results screen.
type GateNote = { passed: boolean; head: string; detail: string }

const listNames = (us: { number: number }[]) => list(us.map((u) => t('Unit {n}', { n: u.number })))

const gateNote = (unitId: string, right: number, asked: number, wasMastered: boolean): GateNote => {
  const unit = units.find((u) => u.id === unitId)!
  const next = unitsAfter(unit, units)
  const need = Math.ceil(GATE * asked)
  const tally = t('{right} of {asked} right first time', { right, asked })
  if (right >= need)
    return {
      passed: true,
      head: next.length && !wasMastered ? t(next.length > 1 ? '{units} are open' : '{units} is open', { units: listNames(next) }) : t('Unit {n} mastered', { n: unit.number }),
      detail: next.length ? t('{tally}: {need} open the next unit.', { tally, need }) : t('{tally}, at the end of its track.', { tally }),
    }
  return {
    passed: false,
    head: wasMastered ? t('Unit {n} stays mastered', { n: unit.number }) : t('{need} of {asked} needed', { need, asked }),
    detail: wasMastered
      ? t('{tally} this time; your earlier pass still counts.', { tally })
      : next.length
        ? t('{tally}. {need} open {units}: take the checkpoint again whenever you like.', { tally, need, units: listNames(next) })
        : t('{tally}. {need} master the unit: take the checkpoint again whenever you like.', { tally, need }),
  }
}

// A lesson carries the crown level it is played for; a Legendary challenge its unit
// and the seconds on its clock; a map story `story`, so it counts apart from lessons.
type Playing = {
  id: string
  title: string
  exercises: Exercise[]
  sources: Lesson['sources']
  note?: string
  calm?: boolean
  hat?: HatId
  retry?: boolean
  level?: { before: number; target: number; legendary: boolean }
  checkpoint?: string
  story?: boolean
  legendary?: { unit: string; number: number; seconds: number }
}

const REVIEW_ID = 'review'
type Screen =
  | { name: 'home' }
  | { name: 'timemap' }
  | { name: 'phrasebook' }
  | { name: 'drill' }
  | { name: 'placement' }
  | { name: 'museum' }
  | { name: 'cities' }
  | { name: 'lesson'; playing: Playing }
  | { name: 'results'; playing: Playing; outcome: LessonOutcome; xp: number; crown?: CrownNote; gate?: GateNote; hung?: Hung[]; quests?: QuestId[] }

// Today's review: up to ten due questions from the lessons finished so far.
const buildReview = (): Playing => {
  const p = getProgress()
  const picked = pickReview(dueToday(cards.items, p.cards, p.completed, todayKey()))
  const lessonIds = new Set(picked.map((c) => c.lessonId))
  return {
    id: REVIEW_ID,
    title: t('Daily review'),
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
      title: t('Unit {n} checkpoint', { n: cp.number }),
      checkpoint: cp.id,
      exercises: buildCheckpoint(cp),
      sources: cp.lessons.flatMap((l) => l.sources),
      note: cp.note,
      calm: cp.lessons.some((l) => l.note),
      hat: unitHat(cp),
    }
  const told = units.find((u) => mapStoryId(u) === id)
  if (told)
    return {
      id,
      title: t('Unit {n} map story', { n: told.number }),
      story: true,
      exercises: buildMapStory(told),
      sources: told.lessons.flatMap((l) => l.sources),
      note: told.note,
      calm: told.lessons.some((l) => l.note),
      hat: unitHat(told),
    }
  const legend = units.find((u) => legendaryId(u.id) === id)
  if (legend) {
    const exercises = buildLegendary(legend)
    const seconds = timeLimit(exercises)
    return {
      id,
      title: t('Unit {n} Legendary', { n: legend.number }),
      exercises,
      sources: legend.lessons.flatMap((l) => l.sources),
      retry: false,
      hat: unitHat(legend),
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
    title: target > 1 && before < 4 ? t('{title}, level {n}', { title: lesson.title, n: target }) : lesson.title,
    exercises: play.exercises,
    retry: play.retry,
    sources: lesson.sources,
    note: lesson.note,
    calm: !!lesson.note,
    hat: unitHat(unit),
    level: { before, target, legendary: hasLegendary(unit) },
  }
}

export default function App() {
  // Everything below re-renders in the new language when it changes.
  useLang()
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
        hat={playing.hat}
        retry={playing.retry}
        timeLimit={playing.legendary?.seconds}
        onExit={home}
        onFinish={(outcome) => {
          const xp = lessonXp(outcome.mistakes, outcome.bonuses)
          const right = outcome.answers.filter(([, ok]) => ok).length
          const { level, legendary, checkpoint } = playing
          const score = checkpoint ? right / Math.max(1, outcome.answers.length) : undefined
          // Cards a lesson finished for the first time hangs on the museum wall.
          const hung = level ? newCards(getProgress(), wall, playing.id) : undefined
          const gate = checkpoint
            ? gateNote(checkpoint, right, outcome.answers.length, unitMastered(getProgress(), units.find((u) => u.id === checkpoint)!))
            : undefined
          const crown = level
            ? lessonCrown(level.before, level.target, right, outcome.answers.length, level.legendary)
            : legendary
              ? legendaryCrown(legendary.number, right, playing.exercises.length, !!outcome.timedOut)
              : undefined
          const passed = !!legendary && !!crown && 'passed' in crown && crown.passed === true
          ensureQuests(canToday(getProgress()))
          const quests = recordSession({
            kind: playing.id === REVIEW_ID ? 'review' : legendary ? 'legendary' : checkpoint ? 'checkpoint' : playing.story ? 'story' : 'lesson',
            hung: hung?.length,
            crowned: level ? !!crown && crown.level > level.before : passed,
            lessonId: playing.id === REVIEW_ID || legendary ? undefined : playing.id,
            level: level ? crown?.level : undefined,
            score,
            legendary: passed ? legendary.unit : undefined,
            xp,
            perfect: outcome.mistakes === 0,
            places: outcome.places,
            answers: outcome.answers.flatMap(([exercise, correct]) => {
              const card = cards.byExercise.get(exercise)
              return card ? [[card.id, correct] as [string, boolean]] : []
            }),
          })
          setScreen({ name: 'results', playing, outcome, xp, crown, gate, hung, quests })
        }}
      />
    )
  }
  if (screen.name === 'timemap') return <TimeTravel onBack={home} />
  if (screen.name === 'phrasebook') return <Phrasebook onBack={home} />
  if (screen.name === 'drill') return <MapDrill onBack={home} />
  if (screen.name === 'placement') return <Placement units={units} onBack={home} />
  if (screen.name === 'museum') return <Museum onBack={home} />
  if (screen.name === 'cities') return <CityExplorer onBack={home} />
  if (screen.name === 'results') {
    return <Results title={screen.playing.title} outcome={screen.outcome} xp={screen.xp} sources={screen.playing.sources} photos={photosUsed(screen.playing.exercises)} sounds={soundsUsed(screen.playing.exercises)} calm={screen.playing.calm} hat={screen.playing.hat} crown={screen.crown} gate={screen.gate} hung={screen.hung} quests={screen.quests} onMuseum={() => setScreen({ name: 'museum' })} onDone={home} />
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
      onMuseum={() => {
        setScreen({ name: 'museum' })
        window.scrollTo(0, 0)
      }}
      onCities={() => {
        setScreen({ name: 'cities' })
        window.scrollTo(0, 0)
      }}
    />
  )
}
