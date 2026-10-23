import { useEffect } from 'react'
import { provinceIds } from '../data/provinces'
import { cards } from '../content'
import { courseOutline } from '../content/course'
import { checkpointId } from '../content/checkpoint'
import { mapStoryId } from '../content/mapStory'
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
import { getLang, langTags, list, t, type Key } from '../i18n'
import { LangPicker } from './LangPicker'

type Props = { units: Unit[]; onStart: (lessonId: string) => void; onTimeMap: () => void; onPhrasebook: () => void; onDrill: () => void; onPlacement: () => void; onMuseum: () => void; onCities: () => void }


const dayName = (day: string, today: string) => {
  const d = new Date(`${day}T12:00:00`)
  const diff = Math.round((d.getTime() - Date.parse(`${today}T12:00:00`)) / 86_400_000)
  return diff <= 1 ? t('tomorrow') : d.toLocaleDateString(langTags[getLang()], { weekday: 'long', month: 'long', day: 'numeric' })
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
          <span className={`stat ${alive ? 'stat-streak' : 'stat-off'}`} title={t('Day streak')}>
            <Icon name="flame" /> {alive ? progress.streak : 0}
          </span>
          <span className="stat stat-xp" title={t('Total XP')}>
            <Icon name="star" /> {progress.xp}
          </span>
          <span className="stat stat-crowns" title={t('Crowns')}>
            <Icon name="crown" /> {crownCount(progress, units)}
          </span>
          <LangPicker />
        </div>
      </header>

      <StorkSays hat={hat} className="greeting card" size={72}>
        {greeting({ fresh, playedToday: progress.lastDay === today, streak: progress.streak, streakAlive: alive, due, questsLeft: day ? day.picks.length - day.done.length : null })}
      </StorkSays>

      {day && (
        <section className="quests card" aria-label={t('Daily quests')}>
          <div className="quests-head">
            <h2>{t('Daily quests')}</h2>
            <span className="muted">{day.done.length === day.picks.length ? t('All done. New quests tomorrow.') : t('+{xp} XP each', { xp: QUEST_XP })}</span>
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
                    {t(quest.text as Key)}
                    <span className="quest-bar" role="progressbar" aria-label={t(quest.text as Key)} aria-valuemin={0} aria-valuemax={quest.goal} aria-valuenow={count}>
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
          <h2>{t('Your map')}</h2>
          <p>{t('{n} of {total} places discovered. Every place you pin in a lesson lights up here.', { n: progress.discovered.length, total: totalPlaces })}</p>
        </div>
        <div className="map-frame small">
          <LowlandsMap
            label={t('Map of places you have discovered')}
            highlight={['NLD', 'BEL']}
            pins={progress.discovered.map((place) => ({ place, tone: 'info' as const }))}
          />
        </div>
      </section>

      <section className="review card">
        <div className="review-text">
          <h2>{t('Daily review')}</h2>
          <p>
            {learned === 0 && due === 0
              ? t('Finish a lesson and its questions come back here, spaced out so they stick.')
              : due > 0
                ? t(due === 1 ? '1 question is due. Missed ones come back sooner.' : '{n} questions are due. Missed ones come back sooner.', { n: due })
                : t('All caught up on {n} questions. The next ones are due {when}.', { n: learned, when: next ? dayName(next, today) : t('soon') })}
          </p>
        </div>
        <button type="button" className="btn-primary" disabled={due === 0} onClick={() => onStart('review')}>
          {due > 0 ? t('Review {n}', { n: Math.min(due, REVIEW_SIZE) }) : t('Nothing due')}
        </button>
      </section>

      <section className="museum-teaser card">
        <div>
          <h2>{t('Your museum')}</h2>
          <p>{t('{n} of {total} cards collected: the artworks, people, buildings and food of the lessons you finish.', { n: wall.filter((c) => collected(progress, c)).length, total: wall.length })}</p>
        </div>
        <button type="button" className="btn-ghost" onClick={onMuseum}>
          {t('Open the museum')}
        </button>
      </section>

      <section className="timemap-teaser card">
        <div>
          <h2>{t('Time map')}</h2>
          <p>{t('Watch the Low Countries change in {n} snapshots, from Caesar to the provinces of today.', { n: throughTimeStory.events.length })}</p>
        </div>
        <button type="button" className="btn-ghost" onClick={onTimeMap}>
          {t('Open the time map')}
        </button>
      </section>

      <section className="phrasebook-teaser card">
        <div>
          <h2>{t('Phrasebook')}</h2>
          <p>{t('{n} everyday phrases in Dutch, Flemish and Belgian French, {recorded} of them recorded by speakers.', { n: allPhrases.length, recorded: allPhrases.filter((p) => p.sound).length })}</p>
        </div>
        <button type="button" className="btn-ghost" onClick={onPhrasebook}>
          {t('Open the phrasebook')}
        </button>
      </section>

      <section className="drill-teaser card">
        <div>
          <h2>{t('Map drill')}</h2>
          <p>{t('The {n} provinces of both countries and Brussels, to find by name, capital or flag.', { n: provinceIds.length - 1 })}</p>
        </div>
        <button type="button" className="btn-ghost" onClick={onDrill}>
          {t('Open the map drill')}
        </button>
      </section>

      <section className="cities-teaser card">
        <div>
          <h2>{t('City explorer')}</h2>
          <p>
            {t('{n} old town centres, from {first} to {last}, street by street, with {landmarks} landmarks to tap and find.', {
              n: cityIds.length,
              first: cities[cityIds[0]].name,
              last: cities[cityIds[cityIds.length - 1]].name,
              landmarks: cityIds.reduce((n, c) => n + landmarkIds(c).length, 0),
            })}
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={onCities}>
          {t('Open the city explorer')}
        </button>
      </section>

      <section className="unit placement-unit">
        <div className="unit-banner">
          <p className="eyebrow light">{t('Unit 0 · Placement test')}</p>
          <h2>{t('Skip ahead')}</h2>
          <p>
            {t('Know some of this already? Answer five questions a unit and open the units you know, lessons and checkpoint.')}
            {progress.placed.length > 0 && ` ${t(progress.placed.length === 1 ? '1 unit is open so far.' : '{n} units are open so far.', { n: progress.placed.length })}`}
          </p>
        </div>
        <ol className="path">
          <li className="path-node offset-0">
            <button type="button" className="node placement-node" onClick={onPlacement} aria-label={t('Placement test')}>
              <Icon name="signpost" />
            </button>
            <span className="node-label">{t('Placement test')}</span>
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
        // The map story comes next once the lessons are done, then the checkpoint.
        const story = mapStoryId(unit)
        const storyDone = !!progress.completed[story]
        const cpPassed = cpScore !== undefined && cpScore >= GATE
        const next = unitsAfter(unit, units)
        return (
          <section key={unit.id} className={`unit ${gateOpen ? '' : 'is-gated'}`}>
            <div className="unit-banner">
              {unitHat(unit) && <Stork hat={unitHat(unit)} size={52} portrait className="banner-stork" />}
              <p className="eyebrow light">
                {t('Unit {n}', { n: unit.number })} · <span lang="en-CA">{unit.era}</span>
                {placed && <span className="tag tag-placed">{t('Opened by the placement test')}</span>}
              </p>
              <h2 lang="en-CA">{unit.title}</h2>
              <p lang="en-CA">{unit.summary}</p>
              {before && (
                <p className="gate-line">
                  <Icon name="lock" /> {t('Opens when the Unit {n} checkpoint is passed with {pct}%, or test out with the placement test.', { n: before.number, pct: Math.round(GATE * 100) })}
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
                      aria-label={`${lesson.title}${done ? t(', completed, level {n}', { n: level }) : open ? '' : t(', locked')}`}
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
                      <span lang="en-CA">{lesson.title}</span>
                      {lesson.note && <span className="lesson-note-tag">{t('Content note')}</span>}
                    </span>
                    {current && <span className="node-start">{t('Start')}</span>}
                  </li>
                )
              })}
              <li className="path-node offset-3">
                <button
                  type="button"
                  className={`node map-story-node ${storyDone ? 'done' : cpOpen && allDone && cpScore === undefined ? 'current' : cpOpen ? '' : 'locked'}`}
                  disabled={!cpOpen}
                  onClick={() => onStart(story)}
                  aria-label={`${t('Unit {n} map story', { n: unit.number })}${storyDone ? t(', completed') : cpOpen ? '' : t(', locked')}`}
                >
                  <Icon name={cpOpen ? 'map' : 'lock'} />
                </button>
                <span className="node-label">
                  {t('Map story: the unit in 90 seconds')}
                  {cpOpen && !storyDone && <span className="node-hint">{t('Narrated, then three find-the-year questions')}</span>}
                </span>
              </li>
              <li className="path-node offset-0">
                <button
                  type="button"
                  className={`node checkpoint ${cpPassed ? 'done' : cpOpen && ((allDone && storyDone) || cpScore !== undefined) ? 'current' : cpOpen ? '' : 'locked'}`}
                  disabled={!cpOpen}
                  onClick={() => onStart(cp)}
                  aria-label={`${t('Unit {n} checkpoint', { n: unit.number })}${cpOpen ? '' : t(', locked')}`}
                >
                  <Icon name={cpOpen ? 'trophy' : 'lock'} />
                </button>
                <span className="node-label">
                  {t('Checkpoint: 10 mixed questions')}
                  {!cpPassed && next.length > 0 && (
                    <span className="node-hint">
                      {cpScore !== undefined ? `${t('Best {pct}%.', { pct: Math.round(cpScore * 100) })} ` : ''}
                      {t('{n} of 10 right opens {units}', { n: Math.round(GATE * 10), units: list(next.map((u) => t('Unit {n}', { n: u.number }))) })}
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
                    aria-label={`${t('Unit {n} Legendary', { n: unit.number })}${progress.legendary.includes(unit.id) ? t(', passed') : legendaryOpen(progress, unit) ? '' : t(', locked')}`}
                  >
                    <Icon name={legendaryOpen(progress, unit) ? 'crown' : 'lock'} />
                  </button>
                  <span className="node-label">
                    {t('Legendary: 15 questions against the clock')}
                    {!legendaryOpen(progress, unit) && <span className="node-hint">{t('Opens with every lesson at level 4')}</span>}
                  </span>
                </li>
              )}
            </ol>
          </section>
        )
      })}

      <BackupCard />

      <section className="outline card">
        <h2>{t('The whole course')}</h2>
        <p className="muted">
          {units.length === 1
            ? t('26 units are planned. Unit 1 is playable now; the others arrive in later phases.')
            : t('26 units are planned. Units {units} are playable now; the others arrive in later phases.', { units: list(units.map((u) => u.number)) })}
        </p>
        {courseOutline.map((track) => (
          <div key={track.track} className="outline-track">
            <h3 lang="en-CA">{track.track}</h3>
            <ul>
              {track.units.map(([n, title]) => (
                <li key={n} className={playable.has(n) ? 'ready' : ''}>
                  <span className="outline-num">{n}</span>
                  <span lang="en-CA">{title}</span>
                  {playable.has(n) ? <span className="tag">{t('Playable')}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <footer className="credits muted">
        {t('Map data from Natural Earth (public domain). Photos and historical maps from Wikimedia Commons, credited under each picture and at the end of every lesson. Other illustrations drawn for Lage Landen.')}
      </footer>
    </div>
  )
}
