import { cards } from '../content'
import { courseOutline } from '../content/course'
import { checkpointId } from '../content/checkpoint'
import { places } from '../content/places'
import type { Unit } from '../content/schema'
import { LowlandsMap } from '../map/LowlandsMap'
import { dueToday, nextDue, REVIEW_SIZE } from '../progress/review'
import { streakAlive, todayKey, useProgress } from '../progress/store'
import { Icon } from './Icon'

type Props = { units: Unit[]; onStart: (lessonId: string) => void; onTimeMap: () => void }

const listUnits = (ns: number[]) => (ns.length < 3 ? ns.join(' and ') : `${ns.slice(0, -1).join(', ')} and ${ns[ns.length - 1]}`)

const dayName = (day: string, today: string) => {
  const d = new Date(`${day}T12:00:00`)
  const diff = Math.round((d.getTime() - Date.parse(`${today}T12:00:00`)) / 86_400_000)
  return diff <= 1 ? 'tomorrow' : d.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function Home({ units, onStart, onTimeMap }: Props) {
  const progress = useProgress()
  const totalPlaces = Object.keys(places).length
  const alive = streakAlive(progress)
  const playable = new Set(units.map((u) => u.number))
  const today = todayKey()
  const due = dueToday(cards.items, progress.cards, progress.completed, today).length
  const learned = Object.keys(progress.cards).length
  const next = nextDue(progress.cards)

  return (
    <div className="home">
      <header className="topbar">
        <div className="brand">
          <Icon name="logo" />
          <span>Lage Landen</span>
        </div>
        <div className="stats">
          <span className={`stat ${alive ? 'stat-streak' : 'stat-off'}`} title="Day streak">
            <Icon name="flame" /> {alive ? progress.streak : 0}
          </span>
          <span className="stat stat-xp" title="Total XP">
            <Icon name="star" /> {progress.xp}
          </span>
        </div>
      </header>

      <section className="discover card">
        <div className="discover-text">
          <h2>Your map</h2>
          <p>
            {progress.discovered.length} of {totalPlaces} places discovered. Every place you pin in a lesson lights up here.
          </p>
        </div>
        <div className="map-frame small">
          <LowlandsMap
            label="Map of places you have discovered"
            highlight={['NLD', 'BEL']}
            pins={progress.discovered.map((place) => ({ place, tone: 'info' as const }))}
          />
        </div>
      </section>

      <section className="review card">
        <div className="review-text">
          <h2>Daily review</h2>
          <p>
            {learned === 0 && due === 0
              ? 'Finish a lesson and its questions come back here, spaced out so they stick.'
              : due > 0
                ? `${due} question${due === 1 ? ' is' : 's are'} due. Missed ones come back sooner.`
                : `All caught up on ${learned} questions. The next ones are due ${next ? dayName(next, today) : 'soon'}.`}
          </p>
        </div>
        <button type="button" className="btn-primary" disabled={due === 0} onClick={() => onStart('review')}>
          {due > 0 ? `Review ${Math.min(due, REVIEW_SIZE)}` : 'Nothing due'}
        </button>
      </section>

      <section className="timemap-teaser card">
        <div>
          <h2>Time map</h2>
          <p>Watch the Low Countries change in 15 snapshots, from Caesar to the Delta Works.</p>
        </div>
        <button type="button" className="btn-ghost" onClick={onTimeMap}>
          Open the time map
        </button>
      </section>

      {units.map((unit) => {
        const ids = unit.lessons.map((l) => l.id)
        const doneCount = ids.filter((id) => progress.completed[id]).length
        const cp = checkpointId(unit)
        return (
          <section key={unit.id} className="unit">
            <div className="unit-banner">
              <p className="eyebrow light">Unit {unit.number} · {unit.era}</p>
              <h2>{unit.title}</h2>
              <p>{unit.summary}</p>
            </div>
            <ol className="path">
              {unit.lessons.map((lesson, i) => {
                const done = !!progress.completed[lesson.id]
                const open = i === 0 || !!progress.completed[ids[i - 1]]
                const current = open && !done
                return (
                  <li key={lesson.id} className={`path-node offset-${i % 4}`}>
                    <button
                      type="button"
                      className={`node ${done ? 'done' : current ? 'current' : open ? '' : 'locked'}`}
                      disabled={!open}
                      onClick={() => onStart(lesson.id)}
                      aria-label={`${lesson.title}${done ? ', completed' : open ? '' : ', locked'}`}
                    >
                      <Icon name={open ? lesson.icon : 'lock'} />
                    </button>
                    <span className="node-label">
                      {lesson.title}
                      {lesson.note && <span className="lesson-note-tag">Content note</span>}
                    </span>
                    {current && <span className="node-start">Start</span>}
                  </li>
                )
              })}
              <li className="path-node offset-0">
                <button
                  type="button"
                  className={`node checkpoint ${progress.completed[cp] ? 'done' : doneCount === ids.length ? 'current' : 'locked'}`}
                  disabled={doneCount < ids.length}
                  onClick={() => onStart(cp)}
                  aria-label={`Unit ${unit.number} checkpoint${doneCount < ids.length ? ', locked' : ''}`}
                >
                  <Icon name={doneCount === ids.length ? 'trophy' : 'lock'} />
                </button>
                <span className="node-label">Checkpoint: 10 mixed questions</span>
              </li>
            </ol>
          </section>
        )
      })}

      <section className="outline card">
        <h2>The whole course</h2>
        <p className="muted">
          26 units are planned. {units.length === 1 ? 'Unit 1 is' : `Units ${listUnits(units.map((u) => u.number))} are`} playable now; the
          others arrive in later phases.
        </p>
        {courseOutline.map((track) => (
          <div key={track.track} className="outline-track">
            <h3>{track.track}</h3>
            <ul>
              {track.units.map(([n, title]) => (
                <li key={n} className={playable.has(n) ? 'ready' : ''}>
                  <span className="outline-num">{n}</span>
                  {title}
                  {playable.has(n) ? <span className="tag">Playable</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <footer className="credits muted">
        Map data from Natural Earth (public domain). Photos and historical maps from Wikimedia Commons, credited under each picture and at the end of every lesson. Other illustrations drawn for Lage Landen.
      </footer>
    </div>
  )
}
