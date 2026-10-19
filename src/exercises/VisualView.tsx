import { Art } from '../art/Art'
import { PolderSlider } from '../art/PolderSlider'
import type { Visual } from '../content/schema'
import { LowlandsMap } from '../map/LowlandsMap'
import { PhotoFigure } from '../photos/Photo'
import { romanStory } from '../data/roman'
import { waterStory } from '../data/water'
import { TimeMap } from '../map/TimeMap'
import { TradeMap } from '../map/TradeMap'

export function VisualView({ visual, label }: { visual: Visual; label: string }) {
  if (visual.kind === 'art') return <Art id={visual.art} className="art art-large" />
  if (visual.kind === 'photo') return <PhotoFigure id={visual.photo} />
  if (visual.kind === 'polder-slider') return <PolderSlider />
  if (visual.kind === 'time-map') {
    if (visual.map === 'cloth') return <TradeMap start={visual.year} />
    return <TimeMap story={visual.map === 'water' ? waterStory : romanStory} start={visual.year} />
  }
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
