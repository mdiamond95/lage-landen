import { useId, useMemo } from 'react'
import { activeAt, eventAt, type HistArea, type TimeStory } from '../data/timeline'
import { lowlandsFrame, makeFrame, provinces, type Frame } from './geo'
import { LowlandsMap } from './LowlandsMap'
import { TimeControls } from './TimeControls'
import { usePlayback } from './usePlayback'

// A plain SVG polygon through projected points. Unlike d3's spherical paths it
// doesn't care which way the ring winds.
const polygon = (frame: Frame, coords: [number, number][]) => `M${coords.map((c) => frame.toXY(c).join(',')).join('L')}Z`

function Area({ area, frame, uid }: { area: HistArea; frame: Frame; uid: string }) {
  const cls = 'hist-area'
  if (area.shape) return <path d={polygon(frame, area.shape)} className={cls} />
  const province = provinces.find((f) => f.properties.id === area.province)
  if (!province) return null
  const clipId = `${uid}-${area.name.replace(/\W+/g, '-')}`
  return (
    <>
      {area.clip && (
        <clipPath id={clipId}>
          <path d={polygon(frame, area.clip)} />
        </clipPath>
      )}
      <path d={frame.path(province) ?? undefined} className={cls} clipPath={area.clip ? `url(#${clipId})` : undefined} />
    </>
  )
}

// A year-slider map of the Low Countries: drag the years, or press play to step
// through each stage. Lines draw themselves in when they first appear; a line that
// has gone (the Roman frontier after 405) stays on the map as a faint dashed line.
// Areas tint land that was still sea, or flooded, at the time.
export function TimeMap({ story, start = story.min }: { story: TimeStory; start?: number }) {
  const starts = useMemo(() => story.events.map((e) => e.from), [story])
  const { year, playing, togglePlay, scrub } = usePlayback(starts, story.min, start)
  const event = eventAt(story.events, year)
  const uid = useId().replace(/:/g, '')
  const frame = useMemo(
    () => (story.bounds ? makeFrame({ type: 'MultiPoint', coordinates: story.bounds }) : lowlandsFrame),
    [story],
  )
  const { toXY, linePath } = frame

  return (
    <figure className="time-map">
      <div className="map-frame">
        <LowlandsMap label={`Map of ${story.place} in ${story.format(year)}: ${event.title}`} frame={frame}>
          {(story.areas ?? [])
            .filter((a) => activeAt(year, a))
            .map((a) => (
              <Area key={a.name} area={a} frame={frame} uid={uid} />
            ))}
          {story.labels
            .filter((l) => activeAt(year, l))
            .map((l) => {
              const [x, y] = toXY(l.at)
              return (
                <text key={l.text} x={x} y={y} textAnchor="middle" className={`hist-${l.kind ?? 'people'}`}>
                  {l.text}
                </text>
              )
            })}
          {story.lines.map((line) => {
            if (line.from > year) return null
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
            .filter((s) => s.from <= year)
            .map((s) => {
              const [x, y] = toXY(s.at)
              const gone = !activeAt(year, s)
              return (
                <g key={s.name} className={`hist-site hist-${s.kind}${gone ? ' hist-gone' : ''}`} transform={`translate(${x},${y})`}>
                  {s.kind === 'town' ? <circle r={5} /> : <rect x={-4.5} y={-4.5} width={9} height={9} />}
                  {s.label && (
                    <text x={s.label === 'left' ? -8 : 8} y={4} textAnchor={s.label === 'left' ? 'end' : 'start'} className="hist-site-label">
                      {s.name}
                    </text>
                  )}
                  <title>{s.note ? `${s.name} (${s.note})` : s.name}</title>
                </g>
              )
            })}
        </LowlandsMap>
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
      >
        {story.key.map((k) => (
          <li key={k.text}>
            <span className={`key-swatch ${k.swatch}`} />
            {k.text}
          </li>
        ))}
      </TimeControls>
    </figure>
  )
}
