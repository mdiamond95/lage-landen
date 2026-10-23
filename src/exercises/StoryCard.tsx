import type { ExerciseOf } from '../content/schema'
import { VisualView } from './VisualView'
import { t } from '../i18n'

export function StoryCard({ exercise }: { exercise: ExerciseOf<'story'> }) {
  return (
    <div className="exercise story">
      <p className="eyebrow">{t('Story')}</p>
      <h2>{exercise.title}</h2>
      <VisualView visual={exercise.visual} label={exercise.title} />
      <p className="story-body">{exercise.body}</p>
    </div>
  )
}
