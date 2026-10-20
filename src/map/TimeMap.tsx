import { useId, useMemo, type ReactNode } from 'react'
import { activeAt, eventAt, type HistArea, type TimeStory } from '../data/timeline'
import { CITY_H, countries, lowlandsFrame, makeFrame, MAP_H, provinces, type Frame } from './geo'
import { AmsterdamBase } from './AmsterdamBase'
import { LowlandsMap } from './LowlandsMap'
import { TimeControls } from './TimeControls'
import { usePlayback } from './usePlayback'

// A plain SVG polygon through projected points. Unlike d3's spherical paths it
// doesn't care which way the ring winds.
const polygon = (frame: Frame, coords: [number, number][]) => `M${coords.map((c) => frame.toXY(c).join(',')).join('L')}Z`

const regionShapes = [...countries, ...provinces]

// `fresh` marks land that changed hands in the stage on screen, so it stands out.
// Land split between two sides is hatched in both their colours.
type AreaProps = { area: HistArea; frame: Frame; uid: string; fresh: false | 'fill' | 'outline' }

function Area({ area, frame, uid, fresh }: AreaProps) {
  const cls = `hist-area hist-area-${area.kind ?? 'sea'}${fresh === 'fill' ? ' hist-area-new' : fresh === 'outline' ? ' hist-area-flash' : ''}`
  const style = area.kind === 'contested' ? { fill: `url(#${uid}-hatch)` } : undefined
  if (area.shape) return <path d={polygon(frame, area.shape)} className={cls} style={style} />
  const shapes = regionShapes.filter((f) => area.regions?.includes(f.properties.id!))
  const clipId = `${uid}-${area.name.replace(/\W+/g, '-')}`
  return (
    <>
      {area.clip && (
        <clipPath id={clipId}>
          <path d={polygon(frame, area.clip)} />
        </clipPath>
      )}
      <g className={cls} style={style} clipPath={area.clip ? `url(#${clipId})` : undefined}>
        {shapes.map((f) => (
          <path key={f.properties.id} d={frame.path(f) ?? undefined} />
        ))}
      </g>
    </>
  )
}

// A year-slider map of the Low Countries: drag the years, or press play to step
// through each stage. Lines draw themselves in when they first appear; a line that
// has gone (the Roman frontier after 405) stays on the map as a faint dashed line.
// Flows (refugees leaving Antwerp) are arrows with dashes moving along them, and
// vanish when they stop. Areas tint land that was still sea, or flooded, at the time,
// or who held it.
type Props = {
  story: TimeStory
  start?: number
  // Told about every year the map shows, for exercises that ask for a year.
  onYear?: (year: number) => void
  // Hides the stage captions, so the map alone must answer the question.
  hideCaption?: boolean
  // The slider steps from stage to stage instead of year by year.
  snapshots?: boolean
}

// Areas go under the city's water, and first on the Low Countries map.
function LowlandsBase({ areas, children, ...props }: { label: string; frame: Frame; areas: ReactNode; children: ReactNode }) {
  return (
    <LowlandsMap {...props}>
      {areas}
      {children}
    </LowlandsMap>
  )
}

export function TimeMap({ story, start = story.min, onYear, hideCaption = false, snapshots = false }: Props) {
  const starts = useMemo(() => story.events.map((e) => e.from), [story])
  const { year, playing, togglePlay, scrub } = usePlayback(starts, story.min, start, onYear)
  const event = eventAt(story.events, year)
  const uid = useId().replace(/:/g, '')
  const frame = useMemo(
    () =>
      story.bounds
        ? makeFrame({ type: 'MultiPoint', coordinates: story.bounds }, story.base === 'amsterdam' ? CITY_H : MAP_H)
        : lowlandsFrame,
    [story],
  )
  const { toXY, linePath } = frame
  const Base = story.base === 'amsterdam' ? AmsterdamBase : LowlandsBase
  const shown = (item: { end?: number }) => item.end === undefined || year <= item.end
  const fresh = event.fresh ?? story.fresh ?? 'fill'
  const areas = (story.areas ?? [])
    .filter((a) => activeAt(year, a))
    .map((a) => (
      <Area key={a.name} area={a} frame={frame} uid={uid} fresh={a.kind !== 'sea' && a.from === event.from && a.from > story.min && fresh} />
    ))

  return (
    <figure className="time-map">
      <div className="map-frame">
        <Base label={`Map of ${story.place} in ${story.format(year)}: ${event.title}`} frame={frame} areas={areas}>
          <defs>
            <pattern id={`${uid}-hatch`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="8" height="8" className="hatch-a" />
              <rect width="4" height="8" className="hatch-b" />
            </pattern>
            <marker id={`${uid}-flow`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M0 0 10 5 0 10z" className="hist-flow-head" />
            </marker>
          </defs>
          {story.labels
            .filter((l) => activeAt(year, l))
            .map((l) => {
              const [x, y] = toXY(l.at)
              return (
                <text key={`${l.text}-${l.from}`} x={x} y={y} textAnchor="middle" className={`hist-${l.kind ?? 'people'}`}>
                  {l.text}
                </text>
              )
            })}
          {story.lines.map((line) => {
            if (line.from > year || !shown(line)) return null
            if (line.kind === 'flow') {
              if (!activeAt(year, line)) return null
              const d = linePath(line.coords)
              return (
                <g key={line.name} className="fade-in">
                  <path d={d} className="hist-line hist-flow" markerEnd={`url(#${uid}-flow)`} />
                  <path d={d} className="trade-flow">
                    <title>{line.name}</title>
                  </path>
                </g>
              )
            }
            // Keyed by state so the draw-in animation replays when a line returns.
            const gone = !activeAt(year, line)
            const draw = !gone && line.kind !== 'road'
            const effect = gone ? 'hist-gone' : draw ? 'draw-in' : 'fade-in'
            return (
              <path
                key={`${line.name}-${effect}`}
                d={linePath(line.coords)}
                pathLength={draw ? 1 : undefined}
                className={`hist-line hist-${line.kind} ${effect}`}
              >
                <title>{line.name}</title>
              </path>
            )
          })}
          {story.sites
            .filter((s) => s.from <= year && shown(s))
            .map((s) => {
              const [x, y] = toXY(s.at)
              const gone = !activeAt(year, s)
              return (
                <g key={`${s.name}-${s.from}`} className={`hist-site hist-${s.kind}${gone ? ' hist-gone' : ''}`} transform={`translate(${x},${y})`}>
                  {s.kind === 'town' ? (
                    <circle r={5} />
                  ) : s.kind === 'battle' ? (
                    <path d="M0-7 2 -2 7 0 2 2 0 7-2 2-7 0-2-2z" />
                  ) : (
                    <rect x={-4.5} y={-4.5} width={9} height={9} />
                  )}
                  {/* A battle's name goes once its stage is over; its grey mark stays. */}
                  {s.label && !(gone && s.kind === 'battle') && (
                    <text x={s.label === 'left' ? -8 : 8} y={4} textAnchor={s.label === 'left' ? 'end' : 'start'} className="hist-site-label">
                      {s.name}
                    </text>
                  )}
                  <title>{s.note ? `${s.name} (${s.note})` : s.name}</title>
                </g>
              )
            })}
        </Base>
      </div>
      <TimeControls
        event={event}
        year={year}
        min={story.min}
        max={story.max}
        format={story.format}
        playing={playing}
        onScrub={scrub}
        onTogglePlay={togglePlay}
        hideCaption={hideCaption}
        note={story.note}
        stops={snapshots ? starts : undefined}
      >
        {(event.key ?? story.key).map((k) => (
          <li key={k.text}>
            <span className={`key-swatch ${k.swatch}`} />
            {k.text}
          </li>
        ))}
      </TimeControls>
    </figure>
  )
}
