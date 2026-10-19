import { useRef } from 'react'
import type { ReactNode } from 'react'
import { MAP_H, MAP_W, countries, lakes, path, projection, provinces, rivers } from './geo'
import { places } from '../content/places'

export type MapPin = { place?: string; lonLat?: [number, number]; tone: 'answer' | 'guess' | 'info'; label?: string }

type Props = {
  highlight?: string[]
  rivers?: string[]
  pins?: MapPin[]
  // In pin mode the whole map is a tap target; in region mode each shape is.
  mode?: 'view' | 'pin' | 'region'
  layer?: 'countries' | 'provinces'
  selected?: string[]
  correct?: string[]
  onPin?: (lonLat: [number, number]) => void
  onRegion?: (id: string) => void
  children?: ReactNode
  label: string
}

const FOCUS = new Set(['NLD', 'BEL'])

export function LowlandsMap({
  highlight = [],
  rivers: riverHighlight = [],
  pins = [],
  mode = 'view',
  layer = 'provinces',
  selected = [],
  correct,
  onPin,
  onRegion,
  children,
  label,
}: Props) {
  const svg = useRef<SVGSVGElement>(null)
  const hl = new Set(highlight)
  const riverHl = new Set(riverHighlight)
  const anyRiverHl = riverHighlight.length > 0
  const sel = new Set(selected)
  const ok = correct ? new Set(correct) : undefined

  const handlePin = (e: React.PointerEvent<SVGSVGElement>) => {
    if (mode !== 'pin' || !onPin || !svg.current) return
    const pt = svg.current.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const local = pt.matrixTransform(svg.current.getScreenCTM()!.inverse())
    const lonLat = projection.invert!([local.x, local.y])
    if (lonLat) onPin(lonLat as [number, number])
  }

  const regionClass = (id: string, base: string) => {
    if (ok) {
      if (ok.has(id) && sel.has(id)) return `${base} region-right`
      if (ok.has(id)) return `${base} region-missed`
      if (sel.has(id)) return `${base} region-wrong`
      return base
    }
    if (sel.has(id)) return `${base} region-selected`
    if (hl.has(id)) return `${base} region-highlight`
    return base
  }

  const tappable = mode === 'region'
  const shapes = layer === 'countries' || mode !== 'region' ? countries : countries.filter((f) => !FOCUS.has(f.properties.id!))

  return (
    <svg
      ref={svg}
      className={`lowlands-map mode-${mode}`}
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      role="img"
      aria-label={label}
      onPointerDown={handlePin}
    >
      <rect className="sea" width={MAP_W} height={MAP_H} />
      {shapes.map((f) => {
        const id = f.properties.id!
        const focus = FOCUS.has(id)
        const canTap = tappable && layer === 'countries'
        return (
          <path
            key={id}
            d={path(f) ?? undefined}
            className={regionClass(id, focus ? 'land focus' : 'land')}
            onClick={canTap ? () => onRegion?.(id) : undefined}
            role={canTap ? 'button' : undefined}
            aria-label={canTap ? f.properties.name : undefined}
            aria-pressed={canTap ? sel.has(id) : undefined}
            tabIndex={canTap ? 0 : undefined}
            onKeyDown={canTap ? (e) => (e.key === 'Enter' || e.key === ' ') && onRegion?.(id) : undefined}
          />
        )
      })}
      {provinces.map((f) => {
        const id = f.properties.id!
        const canTap = tappable && layer === 'provinces'
        const showProvince = layer === 'provinces' || hl.has(id)
        return (
          <path
            key={id}
            d={path(f) ?? undefined}
            className={regionClass(id, showProvince ? 'province' : 'province faint')}
            onClick={canTap ? () => onRegion?.(id) : undefined}
            role={canTap ? 'button' : undefined}
            aria-label={canTap ? f.properties.name : undefined}
            aria-pressed={canTap ? sel.has(id) : undefined}
            tabIndex={canTap ? 0 : undefined}
            onKeyDown={canTap ? (e) => (e.key === 'Enter' || e.key === ' ') && onRegion?.(id) : undefined}
            style={layer === 'countries' && mode === 'region' ? { pointerEvents: 'none' } : undefined}
          />
        )
      })}
      {countries
        .filter((f) => FOCUS.has(f.properties.id!))
        .map((f) => (
          <path key={`b-${f.properties.id}`} d={path(f) ?? undefined} className="country-border" />
        ))}
      {lakes.map((f, i) => (
        <path key={`lake-${i}`} d={path(f) ?? undefined} className="lake" />
      ))}
      {rivers.map((f, i) => {
        const name = f.properties.name!
        const on = riverHl.has(name)
        return (
          <path
            key={`r-${i}`}
            d={path(f) ?? undefined}
            className={on ? 'river river-on' : anyRiverHl ? 'river river-dim' : 'river'}
          />
        )
      })}
      {pins.map((pin, i) => {
        const place = pin.place ? places[pin.place] : undefined
        const lonLat = pin.lonLat ?? (place ? ([place.lon, place.lat] as [number, number]) : undefined)
        if (!lonLat) return null
        const [x, y] = projection(lonLat)!
        const text = pin.label ?? place?.name
        return (
          <g key={i} className={`pin pin-${pin.tone}`} transform={`translate(${x},${y})`}>
            <path d="M0 0c-6-9-10-13-10-19a10 10 0 0 1 20 0c0 6-4 10-10 19z" />
            <circle cy={-19} r={4} className="pin-dot" />
            {text && (
              <text x={13} y={-14} className="pin-label">
                {text}
              </text>
            )}
          </g>
        )
      })}
      {children}
    </svg>
  )
}

export const toXY = (lonLat: [number, number]) => projection(lonLat)!
