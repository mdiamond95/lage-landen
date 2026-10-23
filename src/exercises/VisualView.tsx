import { Art } from '../art/Art'
import { ComicStrip } from '../art/ComicStrip'
import { SeatChart } from '../art/SeatChart'
import { ProvinceMap } from '../map/ProvinceMap'
import { ProjectionMap } from '../map/ProjectionMap'
import { FacadeTour } from '../art/FacadeTour'
import { FamilyTree } from '../art/FamilyTree'
import { FederalDiagram } from '../art/FederalDiagram'
import { LineChart } from '../art/LineChart'
import { PaintingPair } from '../art/PaintingPair'
import { ThenNow } from '../art/ThenNow'
import { MuseumWalk } from '../art/MuseumWalk'
import { PainterRoad } from '../art/PainterRoad'
import { PaintingTour } from '../art/PaintingTour'
import { PillarDiagram } from '../art/PillarDiagram'
import { PolderSlider } from '../art/PolderSlider'
import { StormBarrier } from '../art/StormBarrier'
import type { Visual } from '../content/schema'
import { CompareMap } from '../map/CompareMap'
import { DialectMap } from '../map/DialectMap'
import { FoodMap } from '../map/FoodMap'
import { FeastWheel } from '../map/FeastWheel'
import { RouteMap } from '../map/RouteMap'
import { LowlandsMap } from '../map/LowlandsMap'
import { MapStory } from '../map/MapStory'
import { TimeMap } from '../map/TimeMap'
import { TradeMap } from '../map/TradeMap'
import { stories } from '../data/stories'
import { PhotoFigure } from '../photos/Photo'
import { PhraseCards } from '../art/PhraseCards'
import { SoundFigure } from '../sounds/Sound'

export { stories }

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

// `hideCaption` keeps a time map's stage captions back until the question is checked, as
// they often say what the question asks; the map alone has to answer it.
export function VisualView({ visual, label, hideCaption }: { visual: Visual; label: string; hideCaption?: boolean }) {
  if (visual.kind === 'art') return <Art id={visual.art} className="art art-large" />
  if (visual.kind === 'photo') return <PhotoFigure id={visual.photo} />
  if (visual.kind === 'painting') return <PaintingTour painting={visual.painting} focus={visual.focus} />
  if (visual.kind === 'pair') return <PaintingPair pair={visual.pair} focus={visual.focus} />
  if (visual.kind === 'then-now') return <ThenNow pair={visual.pair} hideCaption={hideCaption} />
  if (visual.kind === 'walk') return <MuseumWalk walk={visual.walk} />
  if (visual.kind === 'map-story') return <MapStory unit={visual.unit} />
  if (visual.kind === 'series') return <PainterRoad id={visual.series} at={visual.at} />
  if (visual.kind === 'facade') return <FacadeTour facade={visual.facade} focus={visual.focus} />
  if (visual.kind === 'polder-slider') return <PolderSlider />
  if (visual.kind === 'storm-barrier') return <StormBarrier />
  if (visual.kind === 'time-map') return <AnyTimeMap map={visual.map} year={visual.year} hideCaption={hideCaption} />
  if (visual.kind === 'family-tree') return <FamilyTree tree={visual.tree} hide={visual.hide} />
  if (visual.kind === 'chart') return <LineChart chart={visual.chart} until={visual.until} />
  if (visual.kind === 'federal') return <FederalDiagram show={visual.show} />
  if (visual.kind === 'pillars') return <PillarDiagram hide={visual.hide} only={visual.only} />
  if (visual.kind === 'compare') return <CompareMap story={stories[visual.map]} years={visual.years} />
  if (visual.kind === 'sound') return <SoundFigure id={visual.sound} photo={visual.photo} hideWords={hideCaption} hideLanguage={hideCaption} />
  if (visual.kind === 'dialects') return <DialectMap focus={visual.focus} />
  if (visual.kind === 'phrases') return <PhraseCards set={visual.set} />
  if (visual.kind === 'foods') return <FoodMap focus={visual.focus} only={visual.only} />
  if (visual.kind === 'wheel') return <FeastWheel focus={visual.focus} only={visual.only} />
  if (visual.kind === 'projection') return <ProjectionMap view={visual.view} shapes={visual.shapes} course={visual.course} circles={visual.circles} />
  if (visual.kind === 'strip') return <ComicStrip title={visual.title} panels={visual.panels} />
  if (visual.kind === 'route') return <RouteMap route={visual.route} at={visual.at} />
  if (visual.kind === 'provinces') return <ProvinceMap country={visual.country} focus={visual.focus} />
  if (visual.kind === 'seats') return <SeatChart chamber={visual.chamber} hideCabinet={visual.hideCabinet} />
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
