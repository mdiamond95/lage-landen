import { useMemo, useState } from 'react'
import { geoPath } from 'd3-geo'
import { partNames, provinces as info, provincesOf, type ProvinceId } from '../data/provinces'
import { Credit, Photo } from '../photos/Photo'
import { countries, lakes, lowlandsFrame, makeFrame, MAP_W, provinces, type Frame, type GeoFeature } from './geo'
import { t } from '../i18n'

export type Country = 'NLD' | 'BEL' | 'both'

// The Netherlands is taller than wide and Belgium wider than tall, so each gets a frame of its own.
const NLD_H = 640
const BEL_H = 500
const frames: Record<Country, { frame: Frame; height: number }> = {
  NLD: { frame: makeFrame(countries.find((f) => f.properties.id === 'NLD')!, NLD_H), height: NLD_H },
  BEL: { frame: makeFrame(countries.find((f) => f.properties.id === 'BEL')!, BEL_H), height: BEL_H },
  both: { frame: lowlandsFrame, height: 680 },
}

const shapeOf = new Map(provinces.map((f) => [f.properties.id as ProvinceId, f]))

// A label inside its province: the centre of its biggest piece, as Zeeland and the Wadden provinces
// are islands and peninsulas.
const labelAt = (f: GeoFeature, frame: Frame): [number, number] => {
  const g = f.geometry
  if (g.type !== 'MultiPolygon') return frame.path.centroid(f)
  const area = geoPath().area
  const biggest = g.coordinates.reduce((a, b) => (area({ type: 'Polygon', coordinates: b }) > area({ type: 'Polygon', coordinates: a }) ? b : a))
  return frame.path.centroid({ type: 'Polygon', coordinates: biggest })
}

// Where a label can't sit at the middle of its province: Flemish Brabant wraps round Brussels, whose
// name goes just below it, in the gap before Walloon Brabant.
const labelSpots: Partial<Record<ProvinceId, [number, number]>> = { 'BE-VBR': [4.85, 50.92], 'BE-BRU': [4.36, 50.79] }

// A province's mark in a drill: answered right, missed (the right one is then shown), or tapped wrongly.
export type Mark = 'right' | 'missed' | 'wrong'

type Props = {
  country?: Country
  mode?: 'explore' | 'drill'
  focus?: ProvinceId
  // The drill (Unit 26): marks so far, the provinces whose names show, and a tap.
  marks?: Partial<Record<ProvinceId, Mark>>
  named?: ProvinceId[]
  onPick?: (id: ProvinceId) => void
  label?: string
}

// The provinces and regions of the Netherlands and Belgium (Unit 26). To explore: tap a province for
// its flag, capital, people and size, and switch between the two countries. In a drill the shapes are
// unnamed until answered, and a tap is an answer.
export function ProvinceMap({ country: start = 'both', mode = 'explore', focus, marks = {}, named = [], onPick, label }: Props) {
  const [country, setCountry] = useState<Country>(start)
  const [open, setOpen] = useState<ProvinceId | null>(focus ?? null)
  const { frame, height } = frames[country]
  const ids = useMemo(() => provincesOf(country), [country])
  const tappable = new Set(ids)
  const card = mode === 'explore' && open ? info[open] : undefined

  const tap = (id: ProvinceId) => {
    if (mode === 'drill') onPick?.(id)
    else setOpen(id === open ? null : id)
  }
  const pick = (c: Country) => {
    setCountry(c)
    if (open && !provincesOf(c).includes(open)) setOpen(null)
  }
  const cls = (id: ProvinceId) => {
    const mark = marks[id]
    const state = mark ? ` is-${mark}` : mode === 'explore' && open ? (id === open ? ' is-selected' : ' is-dim') : ''
    return `prov prov-${info[id].part}${state}`
  }
  const shownName = (id: ProvinceId) => (mode === 'explore' ? true : named.includes(id))

  return (
    <figure className={`province-map province-${mode}`}>
      {mode === 'explore' && (
        <div className="food-kinds province-countries" role="group" aria-label={t('Country')}>
          {(['NLD', 'BEL', 'both'] as const).map((c) => (
            <button type="button" key={c} className={country === c ? 'is-on' : ''} aria-pressed={country === c} onClick={() => pick(c)}>
              {c === 'NLD' ? t('The Netherlands') : c === 'BEL' ? t('Belgium') : t('Both')}
            </button>
          ))}
        </div>
      )}
      <div className="map-frame">
        <svg className="lowlands-map province-svg" viewBox={`0 0 ${MAP_W} ${height}`} role="img" aria-label={label ?? (country === 'NLD' ? t('Map of the provinces of the Netherlands') : country === 'BEL' ? t('Map of the provinces of Belgium') : t('Map of the provinces of the Netherlands and Belgium'))}>
          <rect className="sea" width={MAP_W} height={height} />
          {countries.map((f) => (
            <path key={f.properties.id} d={frame.path(f) ?? undefined} className={f.properties.id === 'NLD' || f.properties.id === 'BEL' ? 'land focus' : 'land'} />
          ))}
          {provinces.map((f) => {
            const id = f.properties.id as ProvinceId
            if (!tappable.has(id)) return <path key={id} d={frame.path(f) ?? undefined} className="prov prov-off" />
            const name = info[id].name
            return (
              <path
                key={id}
                d={frame.path(f) ?? undefined}
                className={cls(id)}
                data-province={id}
                role="button"
                tabIndex={0}
                aria-label={mode === 'drill' && !shownName(id) ? 'A province' : name}
                aria-pressed={mode === 'explore' ? open === id : undefined}
                onClick={() => tap(id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), tap(id))}
              />
            )
          })}
          {lakes.map((f, i) => (
            <path key={`lake-${i}`} d={frame.path(f) ?? undefined} className="lake" />
          ))}
          {countries
            .filter((f) => f.properties.id === 'NLD' || f.properties.id === 'BEL')
            .map((f) => (
              <path key={`b-${f.properties.id}`} d={frame.path(f) ?? undefined} className="country-border" />
            ))}
          {mode === 'explore' &&
            ids.map((id) => {
              const [x, y] = frame.toXY(info[id].at)
              return <circle key={`c-${id}`} cx={x} cy={y} r={open === id ? 4.5 : 3} className={`prov-capital${open === id ? ' is-on' : ''}`} />
            })}
          {ids.filter(shownName).map((id) => {
            const spot = labelSpots[id]
            const [x, y] = spot ? frame.toXY(spot) : labelAt(shapeOf.get(id)!, frame)
            const small = id === 'BE-BRU' || country === 'both'
            // Two-word names take two lines, so that neighbours' names don't run into each other.
            const words = info[id].name.split(' ')
            const lines = words.length === 2 ? words : [info[id].name]
            return (
              <text key={`l-${id}`} x={x} y={y + 4 - (lines.length - 1) * (small ? 6 : 8)} textAnchor="middle" className={`prov-label${small ? ' prov-label-small' : ''}`}>
                {lines.map((line, i) => (
                  <tspan key={line} x={x} dy={i ? (small ? 13 : 16) : 0}>
                    {line}
                  </tspan>
                ))}
              </text>
            )
          })}
        </svg>
      </div>
      {mode === 'explore' && (
        <div className="food-card province-card" aria-live="polite">
          {card && open ? (
            <>
              <Photo id={card.flag} className="photo province-flag" />
              <p className="food-title">
                {card.name}
                {card.own && <span className="food-own"> · {card.own}</span>}
              </p>
              <p className="food-place">
                {partNames[card.part]} · Capital: {card.capital}
                {card.biggest && ` · Biggest town: ${card.biggest}`}
              </p>
              <p className="province-facts">
                {card.pop.toLocaleString('en-CA')} people in 2024 · {card.area.toLocaleString('en-CA')} km²
              </p>
              <p className="food-about">{card.note}</p>
              <p className="food-status">{card.head}</p>
              <p className="photo-credit">
                Flag: <Credit id={card.flag} />
              </p>
            </>
          ) : (
            <p className="food-about">Tap a province to see its flag, its capital and how many people live there. The dots are the capitals.</p>
          )}
        </div>
      )}
    </figure>
  )
}
