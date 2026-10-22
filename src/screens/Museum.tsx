import { useEffect, useState } from 'react'
import { findLesson, units } from '../content'
import { wall } from '../content/wall'
import { cardKindNames, cardKinds, type CardKind } from '../data/collection'
import type { PhotoId } from '../photos'
import { Photo, PhotoFigure } from '../photos/Photo'
import { collected, type Hung } from '../progress/collection'
import { useProgress } from '../progress/store'

type Show = CardKind | 'all'

// The museum wall (plan: "Collections"): every artwork, person, building and food the
// lessons show, hung once a lesson that shows it is finished. Each unit is a room; the
// cards not yet collected wait under it as small empty frames.
export function Museum({ onBack }: { onBack: () => void }) {
  const progress = useProgress()
  const [show, setShow] = useState<Show>('all')
  const [open, setOpen] = useState<PhotoId | null>(null)
  const have = (c: Hung) => collected(progress, c)
  const shown = wall.filter((c) => show === 'all' || c.kind === show)
  const rooms = units
    .map((u) => ({ unit: u, cards: shown.filter((c) => c.unit === u.number) }))
    .filter((r) => r.cards.length > 0)
    .sort((a, b) => a.unit.number - b.unit.number)
  const card = open ? wall.find((c) => c.photo === open) : undefined

  useEffect(() => {
    if (!open) return
    const close = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  const count = (k: Show) => {
    const of = wall.filter((c) => k === 'all' || c.kind === k)
    return `${of.filter(have).length} of ${of.length}`
  }

  return (
    <div className="museum">
      <header className="lesson-top">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back to the course">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="time-travel-title">Your museum</h1>
      </header>
      <p className="muted time-travel-intro">
        {wall.filter(have).length} of {wall.length} cards on your wall. Finish a lesson and the artworks, people, buildings and food it shows are hung
        here, one room for each unit.
      </p>
      <div className="phrase-tabs" role="tablist" aria-label="Kinds of card">
        {(['all', ...cardKinds] as Show[]).map((k) => (
          <button key={k} type="button" role="tab" aria-selected={k === show} className={k === show ? 'is-on' : ''} onClick={() => setShow(k)}>
            {k === 'all' ? 'Everything' : cardKindNames[k]} <span className="museum-count">{count(k)}</span>
          </button>
        ))}
      </div>
      {rooms.map(({ unit, cards }) => (
        <section key={unit.id} className="museum-room" aria-label={`Unit ${unit.number}, ${unit.title}`}>
          <h2>
            <span className="eyebrow">Unit {unit.number}</span> {unit.title}
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
                    <span className="museum-title">{c.title}</span>
                    <span className="museum-line">{c.line}</span>
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
              {cards.filter((c) => !have(c)).length} still to collect
            </p>
          )}
        </section>
      ))}
      {card && (
        <div className="museum-detail" role="dialog" aria-modal="true" aria-label={card.title} onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
          <div className="museum-detail-card card">
            <button type="button" className="icon-btn museum-close" onClick={() => setOpen(null)} aria-label="Close">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </button>
            <p className="eyebrow">{cardKindNames[card.kind]}</p>
            <h2>{card.title}</h2>
            <p className="muted">{card.line}</p>
            <PhotoFigure id={card.photo} />
            <p className="museum-from">
              Collected in{' '}
              {card.lessons
                .filter((id) => progress.completed[id])
                .slice(0, 1)
                .map((id) => {
                  const found = findLesson(id)!
                  return `Unit ${found.unit.number}, ${found.lesson.title}`
                })}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
