import { useState } from 'react'
import { collection } from '../data/collection'
import { walks, type WalkId } from '../data/walks'
import { photo } from '../photos'
import { Credit, Photo } from '../photos/Photo'
import { ZoomImage } from '../photos/ZoomImage'

const cardOf = new Map(collection.map((c) => [c.photo, c]))

// A museum walk: a gallery's paintings one at a time, in the order they hang, from a row
// of small frames along the top (tap one to go to it) to the painting itself, which can be
// zoomed into, with its wall label and a few lines on what to look for. `intro` adds the
// museum's own story above the row, for a walk opened on its own rather than in a lesson.
export function MuseumWalk({ walk, intro = false }: { walk: WalkId; intro?: boolean }) {
  const w = walks[walk]
  const [i, setI] = useState(0)
  const stop = w.stops[i]
  const p = photo(stop.photo)
  const card = cardOf.get(stop.photo)
  const last = i === w.stops.length - 1

  return (
    <figure className="walk" data-walk={walk}>
      <p className="walk-museum">
        <strong>{w.museum}</strong>, {w.city}
      </p>
      {intro && <p className="walk-intro">{w.intro}</p>}
      <ol className="walk-wall" aria-label={`The paintings of the walk, ${w.stops.length} in all`}>
        {w.stops.map((s, j) => (
          <li key={s.photo}>
            <button
              type="button"
              className={`walk-thumb${j === i ? ' is-on' : ''}`}
              aria-current={j === i ? 'step' : undefined}
              aria-label={cardOf.get(s.photo)?.title ?? photo(s.photo).caption}
              onClick={() => setI(j)}
            >
              <Photo id={s.photo} className="walk-thumb-img" lazy />
            </button>
          </li>
        ))}
      </ol>
      <div className="walk-hang">
        <ZoomImage key={stop.photo} src={p.src} alt={p.alt} />
      </div>
      <div className="walk-label" aria-live="polite">
        <p className="walk-count">
          {i + 1} of {w.stops.length}
        </p>
        <p className="walk-title">{card?.title ?? p.caption}</p>
        {card && <p className="walk-line">{card.line}</p>}
        <p className="walk-text">{stop.text}</p>
        <div className="walk-nav">
          <button type="button" className="zoom-btn zoom-reset" onClick={() => setI(i - 1)} disabled={i === 0}>
            Back
          </button>
          <button type="button" className="zoom-btn zoom-reset walk-next" onClick={() => setI(i + 1)} disabled={last}>
            {last ? 'End of the walk' : 'Walk on'}
          </button>
        </div>
      </div>
      <figcaption>
        {p.caption} · <span className="photo-credit">Credit: <Credit id={stop.photo} /></span>
      </figcaption>
    </figure>
  )
}
