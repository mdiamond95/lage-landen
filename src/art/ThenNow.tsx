import { useRef, useState, type PointerEvent } from 'react'
import { thenNows, type ThenNowId, type ThenNowPair } from '../data/thenNow'
import { photo } from '../photos'
import { Credit } from '../photos/Photo'

// Then and now: an old picture of a place laid over a photo of the same spot today.
// Dragging across the picture (or the slider under it, or the arrow keys on that) wipes
// from then on the left to now on the right. `hideCaption` keeps back what the place is
// and what changed until a question is checked, as they often say what it asks.
export function ThenNow({ pair, hideCaption = false }: { pair: ThenNowId; hideCaption?: boolean }) {
  const p: ThenNowPair = thenNows[pair]
  const [split, setSplit] = useState(50)
  const frame = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const then = photo(p.then.photo)
  const now = photo(p.now.photo)

  const follow = (e: PointerEvent) => {
    const box = frame.current?.getBoundingClientRect()
    if (!box || !dragging.current) return
    setSplit(Math.round(Math.min(100, Math.max(0, ((e.clientX - box.left) / box.width) * 100))))
  }

  return (
    <figure className="then-now">
      <div
        ref={frame}
        className="then-now-frame"
        style={{ aspectRatio: p.ratio ?? '4 / 3' }}
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          follow(e)
        }}
        onPointerMove={follow}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <img src={now.src} alt={now.alt} className="then-now-img" style={{ objectPosition: p.now.position }} draggable={false} />
        <img
          src={then.src}
          alt={then.alt}
          className="then-now-img then-now-then"
          style={{ objectPosition: p.then.position, clipPath: `inset(0 ${100 - split}% 0 0)` }}
          draggable={false}
        />
        <div className="compare-divider then-now-divider" style={{ left: `${split}%` }} aria-hidden="true">
          <span className="then-now-handle" />
        </div>
        <span className="compare-tag compare-tag-before">{p.then.when}</span>
        <span className="compare-tag compare-tag-after">{p.now.when}</span>
      </div>
      <figcaption>
        <label className="slider-row">
          <span>{p.then.when}</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            aria-label="Then and now"
            aria-valuetext={`${split}% ${p.then.when}, ${100 - split}% ${p.now.when}`}
          />
          <span className="slider-value">{p.now.when}</span>
        </label>
        <p className="compare-hint">Drag across the picture to go from {p.then.when} to {p.now.when}.</p>
        {!hideCaption && (
          <>
            <p className="then-now-place">{p.place}</p>
            <p className="then-now-text">{p.text}</p>
          </>
        )}
        <p className="then-now-credits">
          {hideCaption ? 'Then' : then.caption}: <Credit id={p.then.photo} />. {hideCaption ? 'Now' : now.caption}: <Credit id={p.now.photo} />.
        </p>
      </figcaption>
    </figure>
  )
}
