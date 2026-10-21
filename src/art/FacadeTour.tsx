import { useState } from 'react'
import { facades, type FacadeId, type FacadeSpot } from '../data/facades'
import { photo } from '../photos'
import { Credit } from '../photos/Photo'
import { ZoomImage } from '../photos/ZoomImage'

const pct = (n: number) => `${n * 100}%`

// A building's front with its parts named on hotspots (Unit 19): every hotspot carries its
// label from the start, so the front reads like a labelled drawing. Tap one, or step
// through with Next, and the photo glides to that part and says what it is and which
// style it gives away; "Whole front" glides back out.
// With `focus` it is the picture for a question: it opens zoomed in on one part, without
// the labels or what they say, and can be zoomed out to the whole front.
export function FacadeTour({ facade, focus }: { facade: FacadeId; focus?: string }) {
  const f = facades[facade]
  const spots: FacadeSpot[] = f.spots
  const p = photo(f.photo)
  const [spot, setSpot] = useState<number | null>(null)
  const quiz = focus !== undefined
  const box = quiz ? spots.find((s) => s.id === focus)!.box : spot === null ? null : spots[spot].box
  const current = spot === null ? undefined : spots[spot]

  return (
    <figure className="photo-figure tour facade">
      <ZoomImage src={p.src} alt={p.alt} max={8} focus={box}>
        {!quiz &&
          spots.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`facade-spot facade-spot-${s.side ?? 'right'}${i === spot ? ' is-active' : ''}`}
              style={{ left: pct(s.at[0]), top: pct(s.at[1]) }}
              // Keeps the tap from starting a drag of the photo underneath.
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setSpot(i)}
              aria-label={`${i + 1}: ${s.label}`}
            >
              <span className="facade-dot" aria-hidden="true" />
              <span className="facade-label" aria-hidden="true">
                {s.label}
              </span>
            </button>
          ))}
      </ZoomImage>
      {quiz ? (
        <p className="hint">Zoomed in on one part. Zoom out with − to see the whole building.</p>
      ) : (
        <div className="tour-panel" aria-live="polite">
          {current ? (
            <>
              <p className="tour-title">{current.label}</p>
              <p className="tour-text">{current.text}</p>
            </>
          ) : (
            <p className="tour-text">{f.intro}</p>
          )}
          <div className="tour-nav">
            <button type="button" className="zoom-btn zoom-reset" disabled={spot === null} onClick={() => setSpot(spot === null || spot === 0 ? null : spot - 1)}>
              Back
            </button>
            <button
              type="button"
              className="zoom-btn zoom-reset tour-next"
              onClick={() => setSpot(spot === null ? 0 : spot + 1 < spots.length ? spot + 1 : null)}
            >
              {spot === null ? 'Walk along the front' : spot + 1 < spots.length ? 'Next part' : 'Whole front'}
            </button>
          </div>
        </div>
      )}
      <figcaption>
        {p.caption} · <span className="photo-credit">Credit: <Credit id={f.photo} /></span>
      </figcaption>
    </figure>
  )
}
