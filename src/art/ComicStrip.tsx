import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Panel } from '../content/schema'
import { photo } from '../photos'
import { Credit } from '../photos/Photo'

type Box = [number, number, number, number]
const WHOLE: Box = [0, 0, 1, 1]

// A panel's picture: the photo, or the box cut from it, filling a frame of the box's own shape.
// The shape is known once the photo has loaded; until then the frame is square.
export function PanelPicture({ id, box = WHOLE, onShape }: { id: Panel['photo']; box?: Box; onShape?: (ratio: number) => void }) {
  const p = photo(id)
  const [x, y, w, h] = box
  const [ratio, setRatio] = useState<number | null>(null)
  const img = useRef<HTMLImageElement>(null)
  const measure = () => {
    const el = img.current
    if (!el?.naturalWidth) return
    const r = (el.naturalWidth * w) / (el.naturalHeight * h)
    setRatio(r)
    onShape?.(r)
  }
  // A photo already in the cache can finish loading before React listens for it.
  useEffect(() => {
    if (img.current?.complete) measure()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, w, h])
  return (
    <div className="panel-picture" style={{ aspectRatio: String(ratio ?? 1) }}>
      <img ref={img} src={p.src} alt={p.alt} onLoad={measure} style={{ width: `${100 / w}%`, left: `${(-x / w) * 100}%`, top: `${(-y / h) * 100}%` }} />
    </div>
  )
}

// A balloon: rounded with a tail for speech, a square box for the narrator's caption.
export function Balloon({ kind = 'speech', children, className = '' }: { kind?: Panel['kind']; children: ReactNode; className?: string }) {
  return <span className={`balloon balloon-${kind} ${className}`}>{children}</span>
}

// One panel of a strip, laid out so the panels of a row share a height: each grows in
// proportion to its shape, as the panels of a printed page do.
export function PanelFrame({
  panel,
  top,
  className = '',
  number,
  onClick,
  label,
  disabled,
}: {
  panel: Panel
  top?: ReactNode
  className?: string
  number?: number
  // A panel to tap is a button.
  onClick?: () => void
  label?: string
  disabled?: boolean
}) {
  const [ratio, setRatio] = useState(1)
  // A tall picture still gets room for its balloon, and a panel alone on its row doesn't
  // swell to fill it.
  const share = Math.max(ratio, 0.85)
  const style = { flexGrow: share, flexBasis: `${share * 7.5}rem`, maxWidth: `min(100%, ${share * 13}rem)` }
  const inner = (
    <>
      {number !== undefined && <span className="panel-number">{number}</span>}
      {top}
      <PanelPicture id={panel.photo} box={panel.box as Box | undefined} onShape={setRatio} />
    </>
  )
  return onClick ? (
    <button type="button" className={`comic-panel ${className}`} style={style} onClick={onClick} aria-label={label} disabled={disabled}>
      {inner}
    </button>
  ) : (
    <div className={`comic-panel ${className}`} style={style}>
      {inner}
    </div>
  )
}

// The photos' credits, panel by panel, under a strip.
export function StripCredits({ panels }: { panels: Panel[] }) {
  const ids = [...new Set(panels.map((p) => p.photo))]
  return (
    <p className="strip-credits photo-credit">
      Credit:{' '}
      {ids.map((id, i) => (
        <span key={id}>
          {i > 0 && '; '}
          {ids.length > 1 && `${photo(id).caption}, `}
          <Credit id={id} />
        </span>
      ))}
    </p>
  )
}

// A comic strip (`{ kind: strip }`): panels read left to right, row by row, each with its
// balloon or caption, and the credits underneath.
export function ComicStrip({ title, panels }: { title?: string; panels: Panel[] }) {
  return (
    <figure className="comic-strip-figure">
      {title && <figcaption className="strip-title">{title}</figcaption>}
      <div className="comic-strip">
        {panels.map((p, i) => (
          <PanelFrame key={i} panel={p} top={<Balloon kind={p.kind}>{p.say}</Balloon>} />
        ))}
      </div>
      <StripCredits panels={panels} />
    </figure>
  )
}
