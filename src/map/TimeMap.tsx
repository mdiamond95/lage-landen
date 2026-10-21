import { useId, useMemo, type ReactNode } from 'react'
import { dialectPieces } from '../data/dialects'
import { activeAt, eventAt, type FlowTone, type HistArea, type TimeStory } from '../data/timeline'
import { AFRICA_H, BELGIUM_H, CITY_H, countries, DELTA_H, lowlandsFrame, makeFrame, makeWorldFrame, MAP_H, provinces, WESTHOEK_H, type Frame, type GeoFeature } from './geo'
import { AfricaBase, africaCountries } from './AfricaBase'
import { AmsterdamBase } from './AmsterdamBase'
import { BelgiumBase, belgiumParts } from './BelgiumBase'
import { DeltaBase, deltaProvinces } from './DeltaBase'
import { LowlandsMap } from './LowlandsMap'
import { WesthoekBase, westhoekCountries } from './WesthoekBase'
import { WorldBase } from './WorldBase'
import { TimeControls } from './TimeControls'
import { usePlayback } from './usePlayback'

// A plain SVG polygon through projected points. Unlike d3's spherical paths it
// doesn't care which way the ring winds.
const polygon = (frame: Frame, coords: [number, number][]) => `M${coords.map((c) => frame.toXY(c).join(',')).join('L')}Z`

// The Low Countries map can also tint the pieces of the dialect map (the language map, Unit 20).
const lowlandsShapes = [...countries, ...provinces, ...(dialectPieces as GeoFeature[])]
const tones: FlowTone[] = ['asia', 'atlantic', 'enslaved']

// `fresh` marks land that changed hands in the stage on screen, so it stands out.
// Land split between two sides is hatched in both their colours. `regions` name shapes
// of the story's own base: the delta's detailed provinces, Africa's or the Westhoek's
// countries, Belgium's pieces on the language map, or the Low Countries' countries
// and provinces. Dutch-speaking towns with facilities for French speakers are striped.
type AreaProps = { area: HistArea; frame: Frame; uid: string; fresh: false | 'fill' | 'outline'; regionShapes: GeoFeature[] }

function Area({ area, frame, uid, fresh, regionShapes }: AreaProps) {
  const cls = `hist-area hist-area-${area.kind ?? 'sea'}${fresh === 'fill' ? ' hist-area-new' : fresh === 'outline' ? ' hist-area-flash' : ''}`
  const style = area.kind === 'contested' ? { fill: `url(#${uid}-hatch)` } : area.kind === 'facility' ? { fill: `url(#${uid}-facility)` } : undefined
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

const bases = { amsterdam: AmsterdamBase, world: WorldBase, delta: DeltaBase, africa: AfricaBase, westhoek: WesthoekBase, belgium: BelgiumBase, lowlands: LowlandsBase }

// One year of a time map: the base map with the story's areas, labels, lines and
// sites as they stood that year. `fresh` marks land that changed hands in the stage
// on screen; a still picture (the before-and-after swipe) leaves it out.
export function StoryMap({ story, year, highlightFresh = true }: { story: TimeStory; year: number; highlightFresh?: boolean }) {
  const event = eventAt(story.events, year)
  const uid = useId().replace(/:/g, '')
  const frame = useMemo(
    () =>
      story.base === 'world'
        ? makeWorldFrame(story.bounds ?? [[-98, 8], [152, -5], [27, 64], [27, -46]])
        : story.bounds
          ? makeFrame({ type: 'MultiPoint', coordinates: story.bounds }, story.base === 'amsterdam' ? CITY_H : story.base === 'delta' ? DELTA_H : story.base === 'africa' ? AFRICA_H : story.base === 'westhoek' ? WESTHOEK_H : story.base === 'belgium' ? BELGIUM_H : MAP_H)
          : lowlandsFrame,
    [story],
  )
  const { toXY, linePath } = frame
  const Base = bases[story.base ?? 'lowlands']
  const regionShapes = story.base === 'delta' ? deltaProvinces : story.base === 'africa' ? africaCountries : story.base === 'westhoek' ? westhoekCountries : story.base === 'belgium' ? belgiumParts : lowlandsShapes
  const shown = (item: { end?: number }) => item.end === undefined || year <= item.end
  const fresh = highlightFresh && (event.fresh ?? story.fresh ?? 'fill')
  const areas = (story.areas ?? [])
    .filter((a) => activeAt(year, a))
    .map((a) => (
      <Area
        key={a.name}
        area={a}
        frame={frame}
        uid={uid}
        regionShapes={regionShapes}
        fresh={(a.kind ?? 'sea') !== 'sea' && a.from === event.from && a.from > story.min && fresh}
      />
    ))

  return (
    <Base label={`Map of ${story.place} in ${story.format(year)}: ${event.title}`} frame={frame} areas={areas}>
      <defs>
        <pattern id={`${uid}-hatch`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" className="hatch-a" />
          <rect width="4" height="8" className="hatch-b" />
        </pattern>
        <pattern id={`${uid}-facility`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="7" height="7" className="facility-a" />
          <rect width="2.5" height="7" className="facility-b" />
        </pattern>
        <marker id={`${uid}-flow`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" className="hist-flow-head" />
        </marker>
        {story.base === 'world' &&
          tones.map((t) => (
            <marker key={t} id={`${uid}-${t}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M0 0 10 5 0 10z" className={`hist-flow-head hist-head-${t}`} />
            </marker>
          ))}
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
          const tone = line.tone ? ` hist-flow-${line.tone}` : ''
          return (
            <g key={`${line.name}-${line.from}`} className="fade-in">
              <path d={d} className={`hist-line hist-flow${tone}`} markerEnd={`url(#${uid}-${line.tone ?? 'flow'})`} />
              <path d={d} className="trade-flow">
                <title>{line.name}</title>
              </path>
            </g>
          )
        }
        // Keyed by state so the draw-in animation replays when a line returns, and by year,
        // as the time map can hold one line from several snapshots of the same era.
        const gone = !activeAt(year, line)
        const draw = !gone && line.kind !== 'road'
        const effect = gone ? 'hist-gone' : draw ? 'draw-in' : 'fade-in'
        return (
          <path
            key={`${line.name}-${line.from}-${effect}`}
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
              ) : s.kind === 'grave' ? (
                <path d="M-1.6-7h3.2v3.4h3.4v3.2h-3.4v7.4h-3.2v-7.4h-3.4v-3.2h3.4z" />
              ) : s.kind === 'memorial' ? (
                <path d="M-3.5 6h7l-1.5-11.5h-4z" />
              ) : s.kind === 'workshop' ? (
                <path d="M0-6.5c4 0 7 2.6 7 5.8 0 2-1.6 2.6-3 2.4-1.3-.2-2 .6-1.7 1.7.4 1.6-.6 3.1-2.6 3.1-4 0-6.7-3-6.7-6.5S-4-6.5 0-6.5z" />
              ) : s.kind === 'market' ? (
                <path d="M-6 6V-1.5L0-6.5 6-1.5V6z" />
              ) : s.kind === 'village' ? (
                <path d="M0-7 5 1H2.5L6 6H-6l3.5-5H-5z" />
              ) : s.kind === 'museum' ? (
                <path d="M-7-2.5 0-7l7 4.5zM-6 6h12M-5-1.5h2v6.5h-2zM-1-1.5h2v6.5h-2zM3-1.5h2v6.5H3z" />
              ) : s.kind === 'gothic' ? (
                <path d="M0-8.5 4.5-1.5V6.5h-9v-8z" />
              ) : s.kind === 'classic' ? (
                <path d="M-6 6.5V-.5a6 6 0 0 1 12 0v7z" />
              ) : s.kind === 'revival' ? (
                <path d="M0-7 7 0 0 7-7 0z" />
              ) : s.kind === 'nouveau' ? (
                <path d="M0-8C4-4 6-1 6 1.5a6 6 0 0 1-12 0C-6-1-4-4 0-8z" />
              ) : s.kind === 'beguinage' ? (
                <path d="M-6-6h12v12h-12zM-2.5-2.5v5h5v-5z" fillRule="evenodd" />
              ) : s.kind === 'mill' ? (
                <path d="M-1.3-7.5h2.6v6.2h6.2v2.6H1.3v6.2h-2.6V1.3h-6.2v-2.6h6.2z" transform="rotate(45)" />
              ) : (
                <rect x={-4.5} y={-4.5} width={9} height={9} />
              )}
              {/* A battle's, a breach's or a dead painter's name goes once its stage is over; its grey mark stays. */}
              {s.label && !(gone && (s.kind === 'battle' || s.kind === 'breach' || s.kind === 'workshop')) && (
                <text x={s.label === 'left' ? -8 : 8} y={4} textAnchor={s.label === 'left' ? 'end' : 'start'} className="hist-site-label">
                  {s.name}
                </text>
              )}
              <title>{s.note ? `${s.name} (${s.note})` : s.name}</title>
            </g>
          )
        })}
    </Base>
  )
}

export function TimeMap({ story, start = story.min, onYear, hideCaption = false, snapshots = false }: Props) {
  const starts = useMemo(() => story.events.map((e) => e.from), [story])
  const { year, playing, togglePlay, scrub } = usePlayback(starts, story.min, start, onYear)
  const event = eventAt(story.events, year)

  return (
    <figure className="time-map">
      <div className="map-frame">
        <StoryMap story={story} year={year} />
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
        months={story.months}
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
