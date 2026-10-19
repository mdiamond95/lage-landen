import type { Lesson } from '../content/schema'
import { LowlandsMap } from '../map/LowlandsMap'
import type { LessonOutcome } from '../lesson/LessonPlayer'
import { photo, type PhotoId } from '../photos'
import { Credit } from '../photos/Photo'
import { Icon } from './Icon'

type Props = { title: string; outcome: LessonOutcome; xp: number; sources: Lesson['sources']; photos: PhotoId[]; onDone: () => void }

export function Results({ title, outcome, xp, sources, photos, onDone }: Props) {
  const right = outcome.asked - outcome.mistakes
  const accuracy = outcome.asked ? Math.round((right / outcome.asked) * 100) : 100
  const newPlaces = [...new Set(outcome.places)]
  return (
    <div className="results">
      <div className="results-hero">
        <Icon name="trophy" />
        <h1>{outcome.mistakes === 0 ? 'Perfect lesson!' : 'Lesson complete!'}</h1>
        <p className="muted">{title}</p>
      </div>
      <div className="results-stats">
        <div className="tile tile-xp">
          <span className="tile-label">XP earned</span>
          <span className="tile-value">+{xp}</span>
        </div>
        <div className="tile tile-acc">
          <span className="tile-label">Accuracy</span>
          <span className="tile-value">{accuracy}%</span>
        </div>
        <div className="tile tile-map">
          <span className="tile-label">Places</span>
          <span className="tile-value">{newPlaces.length}</span>
        </div>
      </div>
      {newPlaces.length > 0 && (
        <div className="map-frame small">
          <LowlandsMap label="Places from this lesson" highlight={['NLD', 'BEL']} pins={newPlaces.map((place) => ({ place, tone: 'answer' as const }))} />
        </div>
      )}
      <details className="sources">
        <summary>{photos.length ? 'Sources and credits' : 'Sources for this lesson'}</summary>
        <ul>
          {sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
        {photos.length > 0 && (
          <>
            <p className="sources-sub">Photos and maps</p>
            <ul>
              {photos.map((id) => (
                <li key={id}>
                  {photo(id).caption}: <Credit id={id} />
                </li>
              ))}
            </ul>
          </>
        )}
      </details>
      <button type="button" className="btn-primary" onClick={onDone}>
        Continue
      </button>
    </div>
  )
}
