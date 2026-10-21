import { useState } from 'react'
import { tours, type TourId } from '../data/paintings'
import { photo } from '../photos'
import { Credit } from '../photos/Photo'
import { ZoomImage } from '../photos/ZoomImage'

const pct = (n: number) => `${n * 100}%`

// A painting tour: a big painting, saved large enough to zoom deep into, with numbered
// details on it. Tap a number, or step through with Next, and the painting glides to
// that detail and says what it is; "Whole painting" glides back out. The painting can
// be zoomed and dragged by hand as well.
// With `focus` it is the picture for a question instead: it opens zoomed in on one
// detail, without the numbers or what they say, and can be zoomed out to the whole.
export function PaintingTour({ painting, focus }: { painting: TourId; focus?: string }) {
  const tour = tours[painting]
  const p = photo(tour.photo)
  const [stop, setStop] = useState<number | null>(null)
  const quiz = focus !== undefined
  const box = quiz ? tour.stops.find((s) => s.id === focus)!.box : stop === null ? null : tour.stops[stop].box
  const current = stop === null ? undefined : tour.stops[stop]

  return (
    <figure className="photo-figure tour">
      <ZoomImage src={p.src} alt={p.alt} max={10} focus={box}>
        {!quiz &&
          tour.stops.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`tour-marker${i === stop ? ' is-active' : ''}`}
              style={{ left: pct(s.box[0] + s.box[2] / 2), top: pct(s.box[1] + s.box[3] / 2) }}
              // Keeps the tap from starting a drag of the painting underneath.
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setStop(i)}
              aria-label={`Detail ${i + 1}: ${s.title}`}
            >
              {i + 1}
            </button>
          ))}
      </ZoomImage>
      {quiz ? (
        <p className="hint">Zoomed in on a detail. Zoom out with − to see the whole painting.</p>
      ) : (
        <div className="tour-panel" aria-live="polite">
          {current ? (
            <>
              <p className="tour-title">
                {stop! + 1}. {current.title}
              </p>
              <p className="tour-text">{current.text}</p>
            </>
          ) : (
            <p className="tour-text">{tour.intro}</p>
          )}
          <div className="tour-nav">
            <button type="button" className="zoom-btn zoom-reset" disabled={stop === null} onClick={() => setStop(stop === null || stop === 0 ? null : stop - 1)}>
              Back
            </button>
            <button
              type="button"
              className="zoom-btn zoom-reset tour-next"
              onClick={() => setStop(stop === null ? 0 : stop + 1 < tour.stops.length ? stop + 1 : null)}
            >
              {stop === null ? 'Start the tour' : stop + 1 < tour.stops.length ? 'Next detail' : 'Whole painting'}
            </button>
          </div>
        </div>
      )}
      <figcaption>
        {p.caption} · <span className="photo-credit">Credit: <Credit id={tour.photo} /></span>
      </figcaption>
    </figure>
  )
}
