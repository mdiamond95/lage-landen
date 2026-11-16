import type { Exercise } from '../content/schema'
import { DetailHunt } from '../exercises/DetailHunt'
import { FillGap } from '../exercises/FillGap'
import { MatchPairs } from '../exercises/MatchPairs'
import { OddOneOut } from '../exercises/OddOneOut'
import { PictureChoice } from '../exercises/PictureChoice'
import { PinMap } from '../exercises/PinMap'
import { RegionPaint } from '../exercises/RegionPaint'
import { ScrubMap } from '../exercises/ScrubMap'
import { SortGroups } from '../exercises/SortGroups'
import { StoryCard } from '../exercises/StoryCard'
import { StyleSorter } from '../exercises/StyleSorter'
import { LabelParts } from '../exercises/LabelParts'
import { ListenMap } from '../exercises/ListenMap'
import { PickAll } from '../exercises/PickAll'
import { TasteMap } from '../exercises/TasteMap'
import { WhenWheel } from '../exercises/WhenWheel'
import { RideRoute } from '../exercises/RideRoute'
import { ComicPanels } from '../exercises/ComicPanels'
import { TrueSize } from '../exercises/TrueSize'
import { ProvinceDrill } from '../exercises/ProvinceDrill'
import { LandmarkFind } from '../exercises/LandmarkFind'
import { TimelineOrder } from '../exercises/TimelineOrder'
import { TrueMyth } from '../exercises/TrueMyth'
import type { ExerciseProps } from '../exercises/types'
import { Voices } from '../exercises/Voices'
import { WhoAmI } from '../exercises/WhoAmI'

// One question (or story card) on screen, by its type. `checked` is set once the answer has
// been checked; until then nothing that gives the answer away may show (see ExerciseView.test.tsx).
export function ExerciseView({ exercise, ...props }: { exercise: Exercise } & Omit<ExerciseProps<Exercise>, 'exercise'>) {
  switch (exercise.type) {
    case 'story':
      return <StoryCard exercise={exercise} />
    case 'pin':
      return <PinMap exercise={exercise} {...props} />
    case 'region':
      return <RegionPaint exercise={exercise} {...props} />
    case 'order':
      return <TimelineOrder exercise={exercise} {...props} />
    case 'choice':
      return <PictureChoice exercise={exercise} {...props} />
    case 'truemyth':
      return <TrueMyth exercise={exercise} {...props} />
    case 'match':
    case 'cause':
      return <MatchPairs exercise={exercise} {...props} />
    case 'who':
      return <WhoAmI exercise={exercise} {...props} />
    case 'scrub':
      return <ScrubMap exercise={exercise} {...props} />
    case 'hunt':
      return <DetailHunt exercise={exercise} {...props} />
    case 'gap':
      return <FillGap exercise={exercise} {...props} />
    case 'odd':
      return <OddOneOut exercise={exercise} {...props} />
    case 'voices':
      return <Voices exercise={exercise} {...props} />
    case 'sort':
      return <SortGroups exercise={exercise} {...props} />
    case 'style':
      return <StyleSorter exercise={exercise} {...props} />
    case 'label':
      return <LabelParts exercise={exercise} {...props} />
    case 'listen':
      return <ListenMap exercise={exercise} {...props} />
    case 'taste':
      return <TasteMap exercise={exercise} {...props} />
    case 'pick':
      return <PickAll exercise={exercise} {...props} />
    case 'when':
      return <WhenWheel exercise={exercise} {...props} />
    case 'ride':
      return <RideRoute exercise={exercise} {...props} />
    case 'panels':
      return <ComicPanels exercise={exercise} {...props} />
    case 'truesize':
      return <TrueSize exercise={exercise} {...props} />
    case 'drill':
      return <ProvinceDrill exercise={exercise} {...props} />
    case 'landmark':
      return <LandmarkFind exercise={exercise} {...props} />
  }
}
