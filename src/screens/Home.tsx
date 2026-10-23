import { useEffect } from 'react'
import { provinceIds } from '../data/provinces'
import { cards } from '../content'
import { courseOutline } from '../content/course'
import { checkpointId } from '../content/checkpoint'
import { throughTimeStory } from '../data/throughTime'
import { places } from '../content/places'
import type { Unit } from '../content/schema'
import { LowlandsMap } from '../map/LowlandsMap'
import { checkpointOpen, crownCount, GATE, legendaryOpen, lessonLevel, lessonOpen, unitOpen, unitsAfter } from '../progress/path'
import { hasLegendary, legendaryId } from '../content/levels'
import { dueToday, nextDue, REVIEW_SIZE } from '../progress/review'
import { ensureQuests, streakAlive, todayKey, useProgress } from '../progress/store'
import { canToday } from '../content/today'
import { QUEST_XP, quests } from '../progress/quests'
import { Icon } from './Icon'
import { cities, cityIds, landmarkIds } from '../data/cities'
import { BackupCard } from './BackupCard'
import { allPhrases } from '../data/phrases'
import { wall } from '../content/wall'
import { collected } from '../progress/collection'
import { lastUnit, unitHat, unitHats } from '../mascot/hats'
import { greeting } from '../mascot/lines'
import { StorkSays, Stork } from '../mascot/Stork'

type Props = { units: Unit[]; onStart: (lessonId: string) => void; onTimeMap: () => void; onPhrasebook: () => void; onDrill: () => void; onPlacement: () => void; onMuseum: () => void; onCities: () => void }

const listUnits = (ns: number[]) => (ns.length < 3 ? ns.join(' and ') : `${ns.slice(0, -1).join(', ')} and ${ns[ns.length - 1]}`)

const dayName = (day: string, today: string) => {
  const d = new Date(`${day}T12:00:00`)
  const diff = Math.round((d.getTime() - Date.parse(`${today}T12:00:00`)) / 86_400_000)
  return diff <= 1 ? 'tomorrow' : d.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function Home({ units, onStart, onTimeMap, onPhrasebook, onDrill, onPlacement, onMuseum, onCities }: Props) {
  const progress = useProgress()
  const totalPlaces = Object.keys(places).length
  const alive = streakAlive(progress)
  const playable = new Set(units.map((u) => u.number))
  const today = todayKey()
  const due = dueToday(cards.items, progress.cards, progress.completed, today).length
  const learned = Object.keys(progress.cards).length
  const next = nextDue(progress.cards)
  // Today's quests are picked the first time the course is opened each day.
  useEffect(() => ensureQuests(canToday(progress)), [progress])
  const day = progress.quests?.day === today ? progress.quests : null
  // The stork greets in the hat of the unit last worked on; Unit 1's before any.
  const fresh = Object.keys(progress.completed).length === 0 && progress.placed.length === 0
  const hat = fresh ? unitHats[1] : unitHat(lastUnit(progress.completed, units))

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
          <span className="stat stat-crowns" title="Crowns">
            <Icon name="crown" /> {crownCount(progress, units)}
          </span>
        </div>
      </header>

      <StorkSays hat={hat} className="greeting card" size={72}>
        {greeting({ fresh, playedToday: progress.lastDay === today, streak: progress.streak, streakAlive: alive, due, questsLeft: day ? day.picks.length - day.done.length : null })}
      </StorkSays>

      {day && (
        <section className="quests card" aria-label="Daily quests">
          <div className="quests-head">
            <h2>Daily quests</h2>
            <span className="muted">{day.done.length === day.picks.length ? 'All done. New quests tomorrow.' : `+${QUEST_XP} XP each`}</span>
          </div>
          <ul className="quest-list">
            {day.picks.map((id) => {
              const quest = quests[id]
              const count = Math.min(day.counts[quest.measure], quest.goal)
              const done = day.done.includes(id)
              return (
                <li key={id} className={done ? 'is-done' : ''}>
                  <span className="quest-icon" aria-hidden="true">
                    <Icon name={done ? 'check' : 'target'} />
                  </span>
                  <span className="quest-text">
                    {quest.text}
                    <span className="quest-bar" role="progressbar" aria-label={quest.text} aria-valuemin={0} aria-valuemax={quest.goal} aria-valuenow={count}>
                      <span style={{ width: `${(count / quest.goal) * 100}%` }} />
                    </span>
                  </span>
                  <span className="quest-count">
                    {count} / {quest.goal}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

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

      <section className="museum-teaser card">
        <div>
          <h2>Your museum</h2>
          <p>
            {wall.filter((c) => collected(progress, c)).length} of {wall.length} cards collected: the artworks, people, buildings and food of the lessons you
            finish.
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={onMuseum}>
          Open the museum
        </button>
      </section>

      <section className="timemap-teaser card">
        <div>
          <h2>Time map</h2>
          <p>Watch the Low Countries change in {throughTimeStory.events.length} snapshots, from Caesar to the provinces of today.</p>
        </div>
        <button type="button" className="btn-ghost" onClick={onTimeMap}>
          Open the time map
        </button>
      </section>

      <section className="phrasebook-teaser card">
        <div>
          <h2>Phrasebook</h2>
          <p>{allPhrases.length} everyday phrases in Dutch, Flemish and Belgian French, {allPhrases.filter((p) => p.sound).length} of them recorded by speakers.</p>
        </div>
        <button type="button" className="btn-ghost" onClick={onPhrasebook}>
          Open the phrasebook
        </button>
      </section>

      <section className="drill-teaser card">
        <div>
          <h2>Map drill</h2>
          <p>The {provinceIds.length - 1} provinces of both countries and Brussels, to find by name, capital or flag.</p>
        </div>
        <button type="button" className="btn-ghost" onClick={onDrill}>
          Open the map drill
        </button>
      </section>

      <section className="cities-teaser card">
        <div>
          <h2>City explorer</h2>
          <p>
            {cityIds.length} old town centres, from {cities[cityIds[0]].name} to {cities[cityIds[cityIds.length - 1]].name}, street by street, with {cityIds.reduce((n, c) => n + landmarkIds(c).length, 0)} landmarks to
            tap and find.
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={onCities}>
          Open the city explorer
        </button>
      </section>

      <section className="unit placement-unit">
        <div className="unit-banner">
          <p className="eyebrow light">Unit 0 · Placement test</p>
          <h2>Skip ahead</h2>
          <p>
            Know some of this already? Answer five questions a unit and open the units you know, lessons and checkpoint.
            {progress.placed.length > 0 && ` ${progress.placed.length} ${progress.placed.length === 1 ? 'unit is' : 'units are'} open so far.`}
          </p>
        </div>
        <ol className="path">
          <li className="path-node offset-0">
            <button type="button" className="node placement-node" onClick={onPlacement} aria-label="Placement test">
              <Icon name="signpost" />
            </button>
            <span className="node-label">Placement test</span>
          </li>
        </ol>
      </section>

      {units.map((unit) => {
        const ids = unit.lessons.map((l) => l.id)
        const placed = progress.placed.includes(unit.id)
        const cp = checkpointId(unit)
        // The mastery gate: until the unit before is mastered, every node stays locked.
        const gateOpen = unitOpen(progress, unit, units)
        const before = units.find((u) => !gateOpen && unitsAfter(u, units).includes(unit))
        const cpOpen = gateOpen && checkpointOpen(progress, unit)
        const allDone = ids.every((id) => progress.completed[id])
        const cpScore = progress.completed[cp] ? (progress.completed[cp].score ?? 1) : undefined
        const cpPassed = cpScore !== undefined && cpScore >= GATE
        const next = unitsAfter(unit, units)
        return (
          <section key={unit.id} className={`unit ${gateOpen ? '' : 'is-gated'}`}>
            <div className="unit-banner">
              {unitHat(unit) && <Stork hat={unitHat(unit)} size={52} portrait className="banner-stork" />}
              <p className="eyebrow light">
                Unit {unit.number} · {unit.era}
                {placed && <span className="tag tag-placed">Opened by the placement test</span>}
              </p>
              <h2>{unit.title}</h2>
              <p>{unit.summary}</p>
              {before && (
                <p className="gate-line">
                  <Icon name="lock" /> Opens when the Unit {before.number} checkpoint is passed with {Math.round(GATE * 100)}%, or test out with the placement test.
                </p>
              )}
            </div>
            <ol className="path">
              {unit.lessons.map((lesson, i) => {
                const done = !!progress.completed[lesson.id]
                const level = lessonLevel(progress, unit, lesson.id)
                const open = gateOpen && lessonOpen(progress, unit, i)
                // The next lesson in order; a placed unit has every lesson open but one "Start".
                const current = open && !done && ids.slice(0, i).every((id) => progress.completed[id])
                return (
                  <li key={lesson.id} className={`path-node offset-${i % 4}`}>
                    <button
                      type="button"
                      className={`node ${done ? 'done' : current ? 'current' : open ? '' : 'locked'}`}
                      disabled={!open}
                      onClick={() => onStart(lesson.id)}
                      aria-label={`${lesson.title}${done ? `, completed, level ${level}` : open ? '' : ', locked'}`}
                    >
                      <Icon name={open ? lesson.icon : 'lock'} />
                      {done && (
                        <span className={`crown-badge level-${level}`} aria-hidden="true">
                          <Icon name="crown" />
                          <span>{level}</span>
                        </span>
                      )}
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
                  className={`node checkpoint ${cpPassed ? 'done' : cpOpen && (allDone || cpScore !== undefined) ? 'current' : cpOpen ? '' : 'locked'}`}
                  disabled={!cpOpen}
                  onClick={() => onStart(cp)}
                  aria-label={`Unit ${unit.number} checkpoint${cpOpen ? '' : ', locked'}`}
                >
                  <Icon name={cpOpen ? 'trophy' : 'lock'} />
                </button>
                <span className="node-label">
                  Checkpoint: 10 mixed questions
                  {!cpPassed && next.length > 0 && (
                    <span className="node-hint">
                      {cpScore !== undefined ? `Best ${Math.round(cpScore * 100)}%. ` : ''}
                      {Math.round(GATE * 10)} of 10 right opens {next.map((u) => `Unit ${u.number}`).join(' and ')}
                    </span>
                  )}
                </span>
              </li>
              {hasLegendary(unit) && (
                <li className="path-node offset-0">
                  <button
                    type="button"
                    className={`node legendary ${progress.legendary.includes(unit.id) ? 'done' : legendaryOpen(progress, unit) ? 'open' : 'locked'}`}
                    disabled={!legendaryOpen(progress, unit)}
                    onClick={() => onStart(legendaryId(unit))}
                    aria-label={`Unit ${unit.number} Legendary${progress.legendary.includes(unit.id) ? ', passed' : legendaryOpen(progress, unit) ? '' : ', locked'}`}
                  >
                    <Icon name={legendaryOpen(progress, unit) ? 'crown' : 'lock'} />
                  </button>
                  <span className="node-label">
                    Legendary: 15 questions against the clock
                    {!legendaryOpen(progress, unit) && <span className="node-hint">Opens with every lesson at level 4</span>}
                  </span>
                </li>
              )}
            </ol>
          </section>
        )
      })}

      <BackupCard />

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
