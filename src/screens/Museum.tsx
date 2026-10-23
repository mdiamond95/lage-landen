import { useEffect, useState } from 'react'
import { MuseumWalk } from '../art/MuseumWalk'
import { findLesson, units } from '../content'
import { wall } from '../content/wall'
import { cardKindNames, cardKinds, type CardKind } from '../data/collection'
import { walkIds, walks, type WalkId } from '../data/walks'
import type { PhotoId } from '../photos'
import { Photo, PhotoFigure } from '../photos/Photo'
import { collected, type Hung } from '../progress/collection'
import { useProgress } from '../progress/store'
import { t } from '../i18n'

type Show = CardKind | 'all'

// Where each museum walk is first taken: it opens here once that lesson is finished.
const walkLessons = walkIds.map((walk) => {
  for (const unit of units)
    for (const lesson of unit.lessons)
      if (lesson.exercises.some((e) => 'visual' in e && e.visual?.kind === 'walk' && e.visual.walk === walk)) return { walk, unit, lesson }
  return undefined
}).filter((w) => w !== undefined)

// The museum wall (plan: "Collections"): every artwork, person, building and food the
// lessons show, hung once a lesson that shows it is finished. Each unit is a room; the
// cards not yet collected wait under it as small empty frames.
export function Museum({ onBack }: { onBack: () => void }) {
  const progress = useProgress()
  const [show, setShow] = useState<Show>('all')
  const [open, setOpen] = useState<PhotoId | null>(null)
  const [walk, setWalk] = useState<WalkId | null>(null)
  const have = (c: Hung) => collected(progress, c)
  const shown = wall.filter((c) => show === 'all' || c.kind === show)
  const rooms = units
    .map((u) => ({ unit: u, cards: shown.filter((c) => c.unit === u.number) }))
    .filter((r) => r.cards.length > 0)
    .sort((a, b) => a.unit.number - b.unit.number)
  const card = open ? wall.find((c) => c.photo === open) : undefined

  useEffect(() => {
    if (!open && !walk) return
    const close = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(null)
      setWalk(null)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open, walk])

  const count = (k: Show) => {
    const of = wall.filter((c) => k === 'all' || c.kind === k)
    return `${of.filter(have).length} of ${of.length}`
  }

  return (
    <div className="museum">
      <header className="lesson-top">
        <button type="button" className="icon-btn" onClick={onBack} aria-label={t('Back to the course')}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="time-travel-title">{t('Your museum')}</h1>
      </header>
      <p className="muted time-travel-intro">
        {t('{n} of {total} cards on your wall. Finish a lesson and the artworks, people, buildings and food it shows are hung here, one room for each unit.', { n: wall.filter(have).length, total: wall.length })}
      </p>
      <section className="museum-walks" aria-label={t('Museum walks')}>
        <h2>{t('Museum walks')}</h2>
        <ul>
          {walkLessons.map(({ walk: id, unit, lesson }) => {
            const done = !!progress.completed[lesson.id]
            return (
              <li key={id}>
                <button type="button" className="museum-walk" onClick={() => setWalk(id)} disabled={!done}>
                  <span className="museum-walk-name" lang="en-CA">
                    {walks[id].museum}, {walks[id].city}
                  </span>
                  <span className="museum-line">
                    {done ? t('{n} paintings', { n: walks[id].stops.length }) : t('Finish Unit {n}, {lesson}, to open it', { n: unit.number, lesson: lesson.title })}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <div className="phrase-tabs" role="tablist" aria-label={t('Kinds of card')}>
        {(['all', ...cardKinds] as Show[]).map((k) => (
          <button key={k} type="button" role="tab" aria-selected={k === show} className={k === show ? 'is-on' : ''} onClick={() => setShow(k)}>
            {k === 'all' ? t('Everything') : t(cardKindNames[k])} <span className="museum-count">{count(k)}</span>
          </button>
        ))}
      </div>
      {rooms.map(({ unit, cards }) => (
        <section key={unit.id} className="museum-room" aria-label={`${t('Unit {n}', { n: unit.number })}, ${unit.title}`}>
          <h2>
            <span className="eyebrow">{t('Unit {n}', { n: unit.number })}</span> <span lang="en-CA">{unit.title}</span>
            <span className="museum-count">
              {cards.filter(have).length} of {cards.length}
            </span>
          </h2>
          {cards.some(have) && (
            <ul className="museum-wall">
              {cards.filter(have).map((c) => (
                <li key={c.photo}>
                  <button type="button" className={`museum-card kind-${c.kind}`} onClick={() => setOpen(c.photo)}>
                    <Photo id={c.photo} className="museum-photo" lazy />
                    <span className="museum-title" lang="en-CA">{c.title}</span>
                    <span className="museum-line" lang="en-CA">{c.line}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!cards.every(have) && (
            <p className="museum-left">
              <span className="museum-dots" aria-hidden="true">
                {cards
                  .filter((c) => !have(c))
                  .map((c) => (
                    <span key={c.photo} className={`museum-dot kind-${c.kind}`} />
                  ))}
              </span>
              {t('{n} still to collect', { n: cards.filter((c) => !have(c)).length })}
            </p>
          )}
        </section>
      ))}
      {walk && (
        <div className="museum-detail" role="dialog" aria-modal="true" aria-label={`${walks[walk].museum}, ${walks[walk].city}`} onClick={(e) => e.target === e.currentTarget && setWalk(null)}>
          <div className="museum-detail-card card">
            <button type="button" className="icon-btn museum-close" onClick={() => setWalk(null)} aria-label={t('Close')}>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </button>
            <p className="eyebrow">{t('Museum walk')}</p>
            <MuseumWalk walk={walk} intro />
          </div>
        </div>
      )}
      {card && (
        <div className="museum-detail" role="dialog" aria-modal="true" aria-label={card.title} onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
          <div className="museum-detail-card card">
            <button type="button" className="icon-btn museum-close" onClick={() => setOpen(null)} aria-label={t('Close')}>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </button>
            <p className="eyebrow">{t(cardKindNames[card.kind])}</p>
            <h2 lang="en-CA">{card.title}</h2>
            <p className="muted" lang="en-CA">{card.line}</p>
            <PhotoFigure id={card.photo} />
            <p className="museum-from">
              {card.lessons
                .filter((id) => progress.completed[id])
                .slice(0, 1)
                .map((id) => {
                  const found = findLesson(id)!
                  return t('Collected in Unit {n}, {lesson}', { n: found.unit.number, lesson: found.lesson.title })
                })}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
