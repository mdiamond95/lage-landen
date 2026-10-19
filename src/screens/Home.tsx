import { courseOutline } from '../content/course'
import { checkpointId } from '../content/checkpoint'
import { places } from '../content/places'
import type { Unit } from '../content/schema'
import { LowlandsMap } from '../map/LowlandsMap'
import { streakAlive, useProgress } from '../progress/store'
import { Icon } from './Icon'

type Props = { units: Unit[]; onStart: (lessonId: string) => void }

export function Home({ units, onStart }: Props) {
  const progress = useProgress()
  const totalPlaces = Object.keys(places).length
  const alive = streakAlive(progress)
  const playable = new Set(units.map((u) => u.number))

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
                    <span className="node-label">{lesson.title}</span>
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
        <p className="muted">26 units are planned. Unit 1 is playable now; the others arrive in later phases.</p>
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
        Map data from Natural Earth (public domain). Illustrations drawn for Lage Landen. Every lesson lists its sources at the end.
      </footer>
    </div>
  )
}
