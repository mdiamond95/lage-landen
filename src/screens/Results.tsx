import type { Lesson } from '../content/schema'
import { LowlandsMap } from '../map/LowlandsMap'
import type { LessonOutcome } from '../lesson/LessonPlayer'
import { photo, type PhotoId } from '../photos'
import { Credit, Photo } from '../photos/Photo'
import type { Hung } from '../progress/collection'
import { QUEST_XP, quests as questList, type QuestId } from '../progress/quests'
import type { CrownNote } from '../progress/crowns'
import { Icon } from './Icon'
import { sound, type SoundId } from '../sounds'
import { SoundCredit } from '../sounds/Sound'

// A calm lesson (on slavery, say) ends without a trophy or "Perfect lesson!".
type Props = { title: string; outcome: LessonOutcome; xp: number; sources: Lesson['sources']; photos: PhotoId[]; sounds?: SoundId[]; calm?: boolean; crown?: CrownNote; gate?: { passed: boolean; head: string; detail: string }; hung?: Hung[]; quests?: QuestId[]; onMuseum?: () => void; onDone: () => void }

// How many new cards the results screen shows; the rest are counted.
const HUNG_SHOWN = 6

export function Results({ title, outcome, xp, sources, photos, sounds = [], calm = false, crown, gate, hung = [], quests = [], onMuseum, onDone }: Props) {
  const right = outcome.asked - outcome.mistakes
  const accuracy = outcome.asked ? Math.round((right / outcome.asked) * 100) : 100
  const newPlaces = [...new Set(outcome.places)]
  return (
    <div className="results">
      <div className="results-hero">
        <Icon name={calm ? 'book' : 'trophy'} />
        <h1>{outcome.timedOut ? "Time's up" : crown?.head === 'Legendary' ? 'Legendary!' : crown?.head === 'Not this time' ? 'Challenge over' : calm ? 'Lesson complete' : outcome.mistakes === 0 ? 'Perfect lesson!' : 'Lesson complete!'}</h1>
        <p className="muted">{title}</p>
      </div>
      {gate && (
        <div className={`gate-note ${gate.passed ? 'is-open' : ''}`}>
          <Icon name={gate.passed ? 'trophy' : 'lock'} />
          <div>
            <p className="crown-head">{gate.head}</p>
            <p className="muted">{gate.detail}</p>
          </div>
        </div>
      )}
      {crown && (
        <div className={`crown-note level-${crown.level}`}>
          <span className="crown-badge" aria-hidden="true">
            <Icon name="crown" />
            <span>{crown.level}</span>
          </span>
          <div>
            <p className="crown-head">{crown.head}</p>
            <p className="muted">{crown.detail}</p>
          </div>
        </div>
      )}
      {quests.map((id) => (
        <div key={id} className="quest-note">
          <span className="quest-tick" aria-hidden="true">
            <Icon name="check" />
          </span>
          <div>
            <p className="crown-head">Daily quest done</p>
            <p className="muted">{questList[id].text}</p>
          </div>
          <span className="quest-bonus">+{QUEST_XP} XP</span>
        </div>
      ))}
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
      {hung.length > 0 && (
        <section className="hung-note">
          <h2>
            {hung.length} new {hung.length === 1 ? 'card' : 'cards'} in your museum
          </h2>
          <ul className="hung-list">
            {hung.slice(0, HUNG_SHOWN).map((c) => (
              <li key={c.photo}>
                <Photo id={c.photo} className="hung-photo" />
                <span>{c.title}</span>
              </li>
            ))}
          </ul>
          {hung.length > HUNG_SHOWN && <p className="muted">and {hung.length - HUNG_SHOWN} more</p>}
          {onMuseum && (
            <button type="button" className="btn-ghost" onClick={onMuseum}>
              See your museum
            </button>
          )}
        </section>
      )}
      <SourceDetails sources={sources} photos={photos} sounds={sounds} />
      <button type="button" className="btn-primary" onClick={onDone}>
        Continue
      </button>
    </div>
  )
}

// The lesson's sources, then the credits for every photo and recording in it.
export function SourceDetails({ sources, photos, sounds = [] }: { sources: Lesson['sources']; photos: PhotoId[]; sounds?: SoundId[] }) {
  return (
    <details className="sources">
      <summary>{photos.length || sounds.length ? 'Sources and credits' : 'Sources for this lesson'}</summary>
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
      {sounds.length > 0 && (
        <>
          <p className="sources-sub">Recordings</p>
          <ul>
            {sounds.map((id) => (
              <li key={id}>
                {sound(id).words} ({sound(id).language}): <SoundCredit id={id} />
              </li>
            ))}
          </ul>
        </>
      )}
    </details>
  )
}
