import { PhotoFigure } from '../photos/Photo'
import type { PhotoId } from '../photos/ids'
import { sound, type SoundId } from '.'
import { toggleSound, useSound } from './player'

export function SoundCredit({ id }: { id: SoundId }) {
  const s = sound(id)
  return (
    <>
      <a href={s.source} target="_blank" rel="noreferrer">
        {s.author}
      </a>
      ,{' '}
      <a href={s.licenceUrl} target="_blank" rel="noreferrer">
        {s.licence}
      </a>
    </>
  )
}

// A round play button with a ring that fills as the recording plays. `name` is what a
// screen reader hears; in a question it says only "Recording 1", not the words.
export function PlayButton({ id, name, big = false }: { id: SoundId; name: string; big?: boolean }) {
  const { playing, progress } = useSound()
  const on = playing === id
  return (
    <button
      type="button"
      className={`play-btn${big ? ' play-big' : ''}${on ? ' is-playing' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        toggleSound(id, sound(id).src)
      }}
      aria-label={on ? `Stop ${name}` : `Play ${name}`}
      aria-pressed={on}
    >
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18" className="play-track" />
        {on && <circle cx="20" cy="20" r="18" className="play-ring" pathLength={1} strokeDasharray={`${progress} 1`} transform="rotate(-90 20 20)" />}
        {on ? <rect x="14" y="14" width="12" height="12" rx="2" className="play-icon" /> : <path d="M16 12.5v15l12-7.5z" className="play-icon" />}
      </svg>
    </button>
  )
}

// A recording as the picture for a story or question: a big play button, and what is said
// and in which language. A question hides the words until it is checked, as they are often
// the answer; the language stays hidden too when `hideLanguage` is set.
export function SoundFigure({ id, photo, hideWords = false, hideLanguage = false }: { id: SoundId; photo?: PhotoId; hideWords?: boolean; hideLanguage?: boolean }) {
  const s = sound(id)
  return (
    <figure className="sound-figure">
      {photo && <PhotoFigure id={photo} />}
      <div className="sound-card">
        <PlayButton id={id} name={hideWords ? 'the recording' : s.words} big />
        <div className="sound-text">
          <p className="sound-words">{hideWords ? 'Listen' : s.words}</p>
          <p className="sound-meta">
            {hideLanguage ? 'A recording' : s.language}
            {!hideWords && s.meaning ? `: ${s.meaning}` : ''}
          </p>
          <p className="sound-credit">
            {hideWords ? 'Credit shown once you answer' : <>Recording: <SoundCredit id={id} /></>}
          </p>
        </div>
      </div>
    </figure>
  )
}
