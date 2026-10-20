import { Art } from '../art/Art'
import { FamilyTree } from '../art/FamilyTree'
import { LineChart } from '../art/LineChart'
import { PolderSlider } from '../art/PolderSlider'
import type { Visual } from '../content/schema'
import { amsterdamStory } from '../data/amsterdam'
import { burgundyStory } from '../data/burgundy'
import { empireStory } from '../data/empire'
import { revoltStory } from '../data/revolt'
import { romanStory } from '../data/roman'
import { spanishStory } from '../data/spanish'
import { waterStory } from '../data/water'
import { LowlandsMap } from '../map/LowlandsMap'
import { TimeMap } from '../map/TimeMap'
import { TradeMap } from '../map/TradeMap'
import { PhotoFigure } from '../photos/Photo'

const stories = {
  water: waterStory,
  roman: romanStory,
  burgundy: burgundyStory,
  revolt: revoltStory,
  amsterdam: amsterdamStory,
  spanish: spanishStory,
  empire: empireStory,
}

type TimeMapProps = {
  map: Extract<Visual, { kind: 'time-map' }>['map']
  year?: number
  onYear?: (year: number) => void
  hideCaption?: boolean
}

// Any of the year-slider maps, by name.
export function AnyTimeMap({ map, year, onYear, hideCaption }: TimeMapProps) {
  if (map === 'cloth') return <TradeMap start={year} onYear={onYear} hideCaption={hideCaption} />
  return <TimeMap story={stories[map]} start={year} onYear={onYear} hideCaption={hideCaption} />
}

export function VisualView({ visual, label }: { visual: Visual; label: string }) {
  if (visual.kind === 'art') return <Art id={visual.art} className="art art-large" />
  if (visual.kind === 'photo') return <PhotoFigure id={visual.photo} />
  if (visual.kind === 'polder-slider') return <PolderSlider />
  if (visual.kind === 'time-map') return <AnyTimeMap map={visual.map} year={visual.year} />
  if (visual.kind === 'family-tree') return <FamilyTree tree={visual.tree} hide={visual.hide} />
  if (visual.kind === 'chart') return <LineChart chart={visual.chart} until={visual.until} />
  return (
    <div className="map-frame">
      <LowlandsMap
        label={label}
        highlight={visual.highlight}
        rivers={visual.rivers}
        lines={visual.lines}
        pins={visual.pins.map((place) => ({ place, tone: 'info' as const }))}
      />
    </div>
  )
}
