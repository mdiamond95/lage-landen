import { useEffect, useRef, useState, type ReactNode } from 'react'

const MAX = 6
const STEP = 1.8
// A pointer that moves less than this many pixels between down and up is a tap.
const TAP_PX = 8

type View = { scale: number; x: number; y: number }
const START: View = { scale: 1, x: 0, y: 0 }

type Props = {
  src: string
  alt: string
  // Told where a tap landed, as fractions of the picture, wherever it is zoomed to.
  onTap?: (x: number, y: number) => void
  // Drawn over the picture, zooming with it: detail hunt targets and marks.
  children?: ReactNode
  className?: string
}

// A painting that can be zoomed into: the + and − buttons, a pinch, or a trackpad
// pinch (ctrl + wheel) zoom in; dragging moves around once zoomed in. Overlays are
// placed in percentages of the picture, so they stay on their detail.
export function ZoomImage({ src, alt, onTap, children, className = '' }: Props) {
  const frame = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const [view, setView] = useState<View>(START)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef<{ startX: number; startY: number; moved: boolean; pinch?: number }>({ startX: 0, startY: 0, moved: false })

  // Keeps the picture covering the frame: no gaps at the edges when zoomed in.
  const clamp = (v: View): View => {
    const box = frame.current?.getBoundingClientRect()
    if (!box) return v
    const scale = Math.min(MAX, Math.max(1, v.scale))
    const minX = box.width - box.width * scale
    const minY = box.height - box.height * scale
    return { scale, x: Math.min(0, Math.max(minX, v.x)), y: Math.min(0, Math.max(minY, v.y)) }
  }

  // Zooms by a factor, keeping the point (px, py) of the frame where it is.
  const zoomAt = (factor: number, px?: number, py?: number) => {
    const box = frame.current?.getBoundingClientRect()
    if (!box) return
    const cx = px ?? box.width / 2
    const cy = py ?? box.height / 2
    setView((v) => {
      const scale = Math.min(MAX, Math.max(1, v.scale * factor))
      const k = scale / v.scale
      return clamp({ scale, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k })
    })
  }

  const local = (e: { clientX: number; clientY: number }) => {
    const box = frame.current!.getBoundingClientRect()
    return { x: e.clientX - box.left, y: e.clientY - box.top }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, local(e))
    e.currentTarget.setPointerCapture?.(e.pointerId)
    if (pointers.current.size === 1) gesture.current = { startX: e.clientX, startY: e.clientY, moved: false }
    else gesture.current.moved = true
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const before = pointers.current.get(e.pointerId)
    if (!before) return
    const now = local(e)
    pointers.current.set(e.pointerId, now)
    const g = gesture.current
    if (Math.hypot(e.clientX - g.startX, e.clientY - g.startY) > TAP_PX) g.moved = true
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      if (g.pinch) zoomAt(dist / g.pinch, (a.x + b.x) / 2, (a.y + b.y) / 2)
      g.pinch = dist
    } else if (view.scale > 1) {
      setView((v) => clamp({ ...v, x: v.x + now.x - before.x, y: v.y + now.y - before.y }))
    }
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const wasTap = pointers.current.size === 1 && !gesture.current.moved
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) gesture.current.pinch = undefined
    if (!wasTap || !onTap || !img.current) return
    const box = img.current.getBoundingClientRect()
    onTap((e.clientX - box.left) / box.width, (e.clientY - box.top) / box.height)
  }

  // A trackpad pinch arrives as a wheel event with ctrl held. React's wheel listener
  // is passive, so this one is added by hand to stop the whole page zooming instead.
  // zoomAt only reads refs and sets state, so the first render's copy stays good.
  useEffect(() => {
    const el = frame.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return
      e.preventDefault()
      const box = el.getBoundingClientRect()
      zoomAt(Math.exp(-e.deltaY / 200), e.clientX - box.left, e.clientY - box.top)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const zoomed = view.scale > 1.01
  return (
    <div className={`zoom ${className}`}>
      <div
        ref={frame}
        className={`zoom-frame${zoomed ? ' is-zoomed' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="zoom-inner" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}>
          <img ref={img} src={src} alt={alt} draggable={false} />
          {children}
        </div>
      </div>
      <div className="zoom-controls">
        <button type="button" className="zoom-btn" onClick={() => zoomAt(STEP)} disabled={view.scale >= MAX} aria-label="Zoom in">
          +
        </button>
        <button type="button" className="zoom-btn" onClick={() => zoomAt(1 / STEP)} disabled={!zoomed} aria-label="Zoom out">
          −
        </button>
        {zoomed && (
          <button type="button" className="zoom-btn zoom-reset" onClick={() => setView(START)}>
            Whole picture
          </button>
        )}
      </div>
    </div>
  )
}
