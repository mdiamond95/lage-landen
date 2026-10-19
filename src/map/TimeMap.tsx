import {
  ROMAN_MAX,
  ROMAN_MIN,
  activeAt,
  eventAt,
  formatYear,
  lineIds,
  romanEvents,
  romanLabels,
  romanLines,
  romanSites,
} from '../data/roman'
import { linePath } from './geo'
import { LowlandsMap, toXY } from './LowlandsMap'
import { TimeControls } from './TimeControls'
import { usePlayback } from './usePlayback'

const starts = romanEvents.map((e) => e.from)

// The Roman frontier map: drag the years, or press play to step through each stage.
// Lines draw themselves in when they first appear; after the frontier is given up
// it stays on the map as a faint dashed line.
export function TimeMap() {
  const { year, playing, togglePlay, scrub } = usePlayback(starts, ROMAN_MIN)
  const event = eventAt(year)

  return (
    <figure className="time-map">
      <div className="map-frame">
        <LowlandsMap label={`Map of the Low Countries in ${formatYear(year)}: ${event.title}`}>
          {romanLabels
            .filter((l) => activeAt(year, l))
            .map((l) => {
              const [x, y] = toXY(l.at)
              return (
                <text key={l.text} x={x} y={y} textAnchor="middle" className="hist-people">
                  {l.text}
                </text>
              )
            })}
          {lineIds.map((id) => {
            const line = romanLines[id]
            if (line.from > year) return null
            // Keyed by state so the draw-in animation replays when a line returns.
            const gone = !activeAt(year, line)
            const draw = !gone && line.kind !== 'road'
            const effect = gone ? 'hist-gone' : draw ? 'draw-in' : 'fade-in'
            return (
              <path
                key={`${id}-${effect}`}
                d={linePath(line.coords)}
                pathLength={draw ? 1 : undefined}
                className={`hist-line hist-${line.kind} ${effect}`}
              />
            )
          })}
          {romanSites
            .filter((s) => s.from <= year)
            .map((s) => {
              const [x, y] = toXY(s.at)
              const gone = !activeAt(year, s)
              return (
                <g key={s.latin} className={`hist-site hist-${s.kind}${gone ? ' hist-gone' : ''}`} transform={`translate(${x},${y})`}>
                  {s.kind === 'fort' ? <rect x={-4.5} y={-4.5} width={9} height={9} /> : <circle r={5} />}
                  {s.label && (
                    <text x={s.label === 'left' ? -8 : 8} y={4} textAnchor={s.label === 'left' ? 'end' : 'start'} className="hist-site-label">
                      {s.latin}
                    </text>
                  )}
                  <title>{`${s.latin} (${s.modern})`}</title>
                </g>
              )
            })}
        </LowlandsMap>
      </div>
      <TimeControls
        event={event}
        year={year}
        min={ROMAN_MIN}
        max={ROMAN_MAX}
        format={formatYear}
        playing={playing}
        onScrub={scrub}
        onTogglePlay={togglePlay}
      >
        <li><span className="key-swatch key-frontier" />Frontier</li>
        <li><span className="key-swatch key-road" />Road</li>
        <li><span className="key-swatch key-fort" />Fort</li>
        <li><span className="key-swatch key-town" />Town</li>
      </TimeControls>
    </figure>
  )
}
