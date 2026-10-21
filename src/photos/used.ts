import type { Exercise } from '../content/schema'
import { pairs } from '../data/pairs'
import { tours } from '../data/paintings'
import { series } from '../data/series'
import type { PhotoId } from './ids'

// Every photo a list of exercises shows, in order of first appearance.
export const photosUsed = (exercises: Exercise[]): PhotoId[] => {
  const ids = exercises.flatMap((e) => [
    ...('visual' in e && e.visual?.kind === 'photo' ? [e.visual.photo] : []),
    ...('visual' in e && e.visual?.kind === 'painting' ? [tours[e.visual.painting].photo] : []),
    ...('visual' in e && e.visual?.kind === 'pair' ? [pairs[e.visual.pair].left.photo, pairs[e.visual.pair].right.photo] : []),
    ...(e.type === 'choice' ? e.options.flatMap((o) => (o.photo ? [o.photo] : [])) : []),
    ...(e.type === 'who' || e.type === 'hunt' ? [e.photo] : []),
    ...(e.type === 'odd' ? e.items.flatMap((i) => (i.photo ? [i.photo] : [])) : []),
    ...(e.type === 'voices' ? e.voices.flatMap((v) => (v.photo ? [v.photo] : [])) : []),
    ...('visual' in e && e.visual?.kind === 'series' ? series[e.visual.series].steps.map((s) => s.photo) : []),
    ...(e.type === 'sort' ? e.items.flatMap((i) => (i.photo ? [i.photo] : [])) : []),
    ...(e.type === 'style' ? e.items.map((i) => i.photo) : []),
  ])
  return [...new Set(ids)]
}
