import type { Exercise } from '../content/schema'
import { tours } from '../data/paintings'
import type { PhotoId } from './ids'

// Every photo a list of exercises shows, in order of first appearance.
export const photosUsed = (exercises: Exercise[]): PhotoId[] => {
  const ids = exercises.flatMap((e) => [
    ...('visual' in e && e.visual?.kind === 'photo' ? [e.visual.photo] : []),
    ...('visual' in e && e.visual?.kind === 'painting' ? [tours[e.visual.painting].photo] : []),
    ...(e.type === 'choice' ? e.options.flatMap((o) => (o.photo ? [o.photo] : [])) : []),
    ...(e.type === 'who' || e.type === 'hunt' ? [e.photo] : []),
    ...(e.type === 'odd' ? e.items.flatMap((i) => (i.photo ? [i.photo] : [])) : []),
    ...(e.type === 'voices' ? e.voices.flatMap((v) => (v.photo ? [v.photo] : [])) : []),
    ...(e.type === 'sort' ? e.items.flatMap((i) => (i.photo ? [i.photo] : [])) : []),
  ])
  return [...new Set(ids)]
}
