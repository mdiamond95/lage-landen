import type { Exercise } from '../content/schema'
import { dialects } from '../data/dialects'
import { phraseSets } from '../data/phrases'
import type { SoundId } from './ids'

// Every recording a list of exercises plays, in order of first appearance, for the credits.
export const soundsUsed = (exercises: Exercise[]): SoundId[] => {
  const ids = exercises.flatMap((e) => [
    ...('visual' in e && e.visual?.kind === 'sound' ? [e.visual.sound] : []),
    ...('visual' in e && e.visual?.kind === 'dialects' ? Object.values(dialects).flatMap((d) => d.sounds) : []),
    ...('visual' in e && e.visual?.kind === 'phrases' ? phraseSets[e.visual.set].phrases.flatMap((p) => (p.sound ? [p.sound] : [])) : []),
    ...(e.type === 'choice' ? e.options.flatMap((o) => (o.sound ? [o.sound] : [])) : []),
    ...(e.type === 'listen' ? [e.sound, ...Object.values(dialects).flatMap((d) => d.sounds)] : []),
  ])
  return [...new Set(ids)]
}
