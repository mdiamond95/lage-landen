import { Art } from '../art/Art'
import { PolderSlider } from '../art/PolderSlider'
import type { Visual } from '../content/schema'
import { LowlandsMap } from '../map/LowlandsMap'
import { PhotoFigure } from '../photos/Photo'
import { TimeMap } from '../map/TimeMap'
import { TradeMap } from '../map/TradeMap'

export function VisualView({ visual, label }: { visual: Visual; label: string }) {
  if (visual.kind === 'art') return <Art id={visual.art} className="art art-large" />
  if (visual.kind === 'photo') return <PhotoFigure id={visual.photo} />
  if (visual.kind === 'polder-slider') return <PolderSlider />
  if (visual.kind === 'time-map') return visual.map === 'cloth' ? <TradeMap start={visual.year} /> : <TimeMap />
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
