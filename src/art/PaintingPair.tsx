import { useState } from 'react'
import { pairs, type PairId } from '../data/pairs'
import { photo } from '../photos'
import { Credit } from '../photos/Photo'
import { ZoomImage } from '../photos/ZoomImage'

// Two paintings side by side, to compare how two painters went about the same thing.
// Pick a way of looking (the light, the faces, the brushwork) and both paintings glide
// to the matching detail, with a word on what to see; "Side by side" glides back out.
// Each painting can be zoomed and dragged by hand as well.
// With `focus` it is the picture for a question: both open zoomed in on one way of
// looking, without what it says, and can be zoomed out to the whole.
export function PaintingPair({ pair, focus }: { pair: PairId; focus?: string }) {
  const p = pairs[pair]
  const [look, setLook] = useState<number | null>(null)
  const quiz = focus !== undefined
  const current = quiz ? p.looks.find((l) => l.id === focus) : look === null ? undefined : p.looks[look]
  const sides = [p.left, p.right] as const

  return (
    <figure className="photo-figure pair">
      <div className="pair-grid">
        {sides.map((side, i) => {
          const pic = photo(side.photo)
          return (
            <div key={side.photo} className="pair-side">
              <p className="pair-label">{side.title}</p>
              <ZoomImage src={pic.src} alt={pic.alt} max={8} focus={current ? current.boxes[i] : quiz ? undefined : null} />
            </div>
          )
        })}
      </div>
      {quiz ? (
        <p className="hint">Both zoomed in on the same thing. Zoom out with − to see each whole painting.</p>
      ) : (
        <div className="tour-panel" aria-live="polite">
          <div className="pair-looks" role="group" aria-label="Compare">
            <button type="button" className={`pair-look${look === null ? ' is-active' : ''}`} aria-pressed={look === null} onClick={() => setLook(null)}>
              Side by side
            </button>
            {p.looks.map((l, i) => (
              <button key={l.id} type="button" className={`pair-look${i === look ? ' is-active' : ''}`} aria-pressed={i === look} onClick={() => setLook(i)}>
                {l.title}
              </button>
            ))}
          </div>
          <p className="tour-text">{current ? current.text : p.intro}</p>
        </div>
      )}
      <figcaption>
        {sides.map((side, i) => (
          <span key={side.photo}>
            {i === 1 && <br />}
            {i === 0 ? 'Left: ' : 'Right: '}
            {photo(side.photo).caption} · <span className="photo-credit">Credit: <Credit id={side.photo} /></span>
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
