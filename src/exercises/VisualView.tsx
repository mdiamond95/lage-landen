import { Art } from '../art/Art'
import { FacadeTour } from '../art/FacadeTour'
import { FamilyTree } from '../art/FamilyTree'
import { FederalDiagram } from '../art/FederalDiagram'
import { LineChart } from '../art/LineChart'
import { PaintingPair } from '../art/PaintingPair'
import { PainterRoad } from '../art/PainterRoad'
import { PaintingTour } from '../art/PaintingTour'
import { PillarDiagram } from '../art/PillarDiagram'
import { PolderSlider } from '../art/PolderSlider'
import { StormBarrier } from '../art/StormBarrier'
import type { Visual } from '../content/schema'
import { amsterdamStory } from '../data/amsterdam'
import { bordersStory } from '../data/borders'
import { buildingsStory } from '../data/buildings'
import { burgundyStory } from '../data/burgundy'
import { congoStory } from '../data/congo'
import { deltaStory } from '../data/delta'
import { empireStory } from '../data/empire'
import { greatWarStory } from '../data/greatwar'
import { industryStory } from '../data/industry'
import { kingdomStory } from '../data/kingdom'
import { languageStory } from '../data/language'
import { mastersStory } from '../data/masters'
import { modernsStory } from '../data/moderns'
import { occupationStory } from '../data/occupation'
import { paintersStory } from '../data/painters'
import { railsStory } from '../data/rails'
import { revoltStory } from '../data/revolt'
import { romanStory } from '../data/roman'
import { spanishStory } from '../data/spanish'
import { waterStory } from '../data/water'
import { tonguesStory } from '../data/tongues'
import { foodStory } from '../data/food'
import { feastStory } from '../data/feastMap'
import { sportStory } from '../data/sport'
import { westhoekStory } from '../data/westhoek'
import { CompareMap } from '../map/CompareMap'
import { DialectMap } from '../map/DialectMap'
import { FoodMap } from '../map/FoodMap'
import { FeastWheel } from '../map/FeastWheel'
import { RouteMap } from '../map/RouteMap'
import { LowlandsMap } from '../map/LowlandsMap'
import { TimeMap } from '../map/TimeMap'
import { TradeMap } from '../map/TradeMap'
import { PhotoFigure } from '../photos/Photo'
import { PhraseCards } from '../art/PhraseCards'
import { SoundFigure } from '../sounds/Sound'

// Every year-slider map but the cloth trade map, which has a frame of its own.
export const stories = {
  water: waterStory,
  roman: romanStory,
  burgundy: burgundyStory,
  revolt: revoltStory,
  amsterdam: amsterdamStory,
  spanish: spanishStory,
  empire: empireStory,
  borders: bordersStory,
  kingdom: kingdomStory,
  rails: railsStory,
  occupation: occupationStory,
  delta: deltaStory,
  industry: industryStory,
  congo: congoStory,
  greatwar: greatWarStory,
  westhoek: westhoekStory,
  language: languageStory,
  painters: paintersStory,
  masters: mastersStory,
  moderns: modernsStory,
  buildings: buildingsStory,
  tongues: tonguesStory,
  food: foodStory,
  feasts: feastStory,
  sport: sportStory,
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

// `hideCaption` keeps a time map's stage captions back until the question is checked, as
// they often say what the question asks; the map alone has to answer it.
export function VisualView({ visual, label, hideCaption }: { visual: Visual; label: string; hideCaption?: boolean }) {
  if (visual.kind === 'art') return <Art id={visual.art} className="art art-large" />
  if (visual.kind === 'photo') return <PhotoFigure id={visual.photo} />
  if (visual.kind === 'painting') return <PaintingTour painting={visual.painting} focus={visual.focus} />
  if (visual.kind === 'pair') return <PaintingPair pair={visual.pair} focus={visual.focus} />
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
  if (visual.kind === 'route') return <RouteMap route={visual.route} at={visual.at} />
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
