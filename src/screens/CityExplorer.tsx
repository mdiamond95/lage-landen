import { useState } from 'react'
import { units } from '../content'
import { cities, cityIds, landmarkIds, landmarkOf, type CityId } from '../data/cities'
import { shuffle } from '../lesson/shuffle'
import { CityMap, type CityPin } from '../map/CityMap'
import { PhotoFigure } from '../photos/Photo'
import { photosUsed } from '../photos/used'
import type { PhotoId } from '../photos/ids'
import { loadBest, saveBest } from '../progress/drill'
import { t } from '../i18n'

// The unit whose lessons first show a photo: a landmark's link back to the course.
const unitOfPhoto = new Map<PhotoId, { number: number; title: string }>()
for (const u of units) for (const l of u.lessons) for (const p of photosUsed(l.exercises)) if (!unitOfPhoto.has(p)) unitOfPhoto.set(p, { number: u.number, title: u.title })

type Mode = 'explore' | 'find'

// The city explorer (plan: "City explorer"): seven old town centres, street by street, with
// their landmarks to tap and read about, in the order of a walk through the centre; or a game
// of finding them, one after another, with the best score kept on the device.
export function CityExplorer({ onBack }: { onBack: () => void }) {
  const [city, setCity] = useState<CityId>('bruges')
  const [mode, setMode] = useState<Mode>('explore')
  const [at, setAt] = useState(0)
  const [rounds, setRounds] = useState<string[]>(() => shuffle(landmarkIds('bruges')))
  const [round, setRound] = useState(0)
  const [tapped, setTapped] = useState<string | null>(null)
  const [misses, setMisses] = useState<string[]>([])
  const [best, setBest] = useState(loadBest)
  const c = cities[city]
  const ids = landmarkIds(city)
  const key = `city-${city}`

  const start = (next: CityId, m: Mode) => {
    setCity(next)
    setMode(m)
    setAt(0)
    setRounds(shuffle(landmarkIds(next)))
    setRound(0)
    setTapped(null)
    setMisses([])
  }

  const done = mode === 'find' && round >= rounds.length
  const target = mode === 'find' && !done ? rounds[round] : null
  const tap = (id: string) => {
    if (mode === 'explore') return setAt(ids.indexOf(id))
    if (!target || tapped) return
    setTapped(id)
    const missed = id === target ? misses : [...misses, target]
    setMisses(missed)
    if (round === rounds.length - 1) {
      const score = rounds.length - missed.length
      if (score > (best[key] ?? -1)) {
        const next = { ...best, [key]: score }
        setBest(next)
        saveBest(next)
      }
    }
  }
  const nextRound = () => {
    setRound(round + 1)
    setTapped(null)
  }

  const pins: CityPin[] = ids.map((id, i) => {
    const name = landmarkOf(city, id).name
    if (mode === 'explore') return { id, n: i + 1, state: i === at ? 'on' : 'idle', label: i === at ? name : undefined }
    if (done) return { id, label: misses.includes(id) ? name : undefined, state: misses.includes(id) ? 'missed' : 'right' }
    if (!tapped) return { id }
    if (id === target) return { id, state: tapped === target ? 'right' : 'missed', label: name }
    if (id === tapped) return { id, state: 'wrong', label: name }
    return { id, state: 'dim' }
  })

  const here = landmarkOf(city, ids[at])
  const unit = here.photo ? unitOfPhoto.get(here.photo) : undefined

  return (
    <div className="city-explorer">
      <header className="lesson-top">
        <button type="button" className="icon-btn" onClick={onBack} aria-label={t('Back to the course')}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="time-travel-title">{t('City explorer')}</h1>
      </header>
      <p className="muted time-travel-intro">{t('Seven old town centres, street by street. Tap a landmark to read about it, or find them all on the map.')}</p>
      <div className="food-kinds" role="group" aria-label={t('City')}>
        {cityIds.map((id) => (
          <button type="button" key={id} className={city === id ? 'is-on' : ''} aria-pressed={city === id} onClick={() => start(id, mode)}>
            {cities[id].name}
          </button>
        ))}
      </div>
      <div className="food-kinds" role="group" aria-label={t('Mode')}>
        <button type="button" className={mode === 'explore' ? 'is-on' : ''} aria-pressed={mode === 'explore'} onClick={() => start(city, 'explore')}>
          {t('Explore')}
        </button>
        <button type="button" className={mode === 'find' ? 'is-on' : ''} aria-pressed={mode === 'find'} onClick={() => start(city, 'find')}>
          {t('Find them')}
        </button>
      </div>

      <p className="city-intro">
        <strong>
          {c.name}
          {'local' in c && c.local ? ` (${c.local})` : ''}.
        </strong>{' '}
        <span lang="en-CA">{c.intro}</span>
      </p>

      {mode === 'find' && (
        <div className="city-find" aria-live="polite" data-target={target ?? undefined}>
          {done ? (
            <p className="city-find-ask">
              {t('{n} of {total} found first time.', { n: rounds.length - misses.length, total: rounds.length })}
              {misses.length ? ` ${t('The ones you missed are named on the map.')}` : ''}
            </p>
          ) : (
            <p className="city-find-ask">
              <span className="city-count">
                {t('{n} of {total}', { n: round + 1, total: rounds.length })}
              </span>{' '}
              {t('Find')} <strong>{landmarkOf(city, target!).name}</strong>
            </p>
          )}
          <p className="drill-best">{best[key] !== undefined ? t('Your best: {n} of {total}', { n: best[key], total: rounds.length }) : t('No score yet for this city.')}</p>
        </div>
      )}

      <CityMap city={city} pins={pins} label={t('Street map of {city} with {n} landmarks', { city: c.name, n: ids.length })} onPick={tap} />

      {mode === 'explore' ? (
        <section className="city-card" aria-live="polite">
          <div className="city-card-nav">
            <button type="button" className="zoom-btn" onClick={() => setAt(Math.max(0, at - 1))} disabled={at === 0} aria-label={t('Previous landmark')}>
              ‹
            </button>
            <p className="city-card-name">
              <span className="city-count">
                {t('{n} of {total}', { n: at + 1, total: ids.length })}
              </span>
              {here.name}
            </p>
            <button type="button" className="zoom-btn" onClick={() => setAt(Math.min(ids.length - 1, at + 1))} disabled={at === ids.length - 1} aria-label={t('Next landmark')}>
              ›
            </button>
          </div>
          <p lang="en-CA">{here.text}</p>
          {unit && (
            <p className="city-unit">
              {t('In Unit {n}, {title}', { n: unit.number, title: unit.title })}
            </p>
          )}
          {here.photo && <PhotoFigure id={here.photo} />}
        </section>
      ) : tapped && !done ? (
        <div className="city-find-next">
          <p className={tapped === target ? 'city-right' : 'city-wrong'}>{tapped === target ? t('Right!') : t('That was {name}.', { name: landmarkOf(city, tapped).name })}</p>
          <button type="button" className="btn-primary" onClick={nextRound}>
            {round === rounds.length - 1 ? t('See the score') : t('Next')}
          </button>
        </div>
      ) : done ? (
        <button type="button" className="btn-primary" onClick={() => start(city, 'find')}>
          {t('Play again')}
        </button>
      ) : null}

      <details className="city-sources">
        <summary>{t('Sources')}</summary>
        <ul>
          {c.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}
