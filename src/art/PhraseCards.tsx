import { phraseSets, type Phrase, type PhraseSet, type PhraseSetId } from '../data/phrases'
import { sound } from '../sounds'
import { PlayButton, SoundCredit } from '../sounds/Sound'
import { toggleSpeech, useSound, useVoices, voiceFor } from '../sounds/player'
import { t } from '../i18n'

// Says a phrase nobody has recorded with the device's own voice, when it has one for the
// language; the button says it is a computer voice.
function SpeakButton({ phrase, lang }: { phrase: Phrase; lang: PhraseSet['lang'] }) {
  useVoices()
  const { playing } = useSound()
  if (!voiceFor(lang)) return <span className="play-none" aria-hidden="true" />
  const key = `say:${phrase.say}`
  const on = playing === key
  return (
    <button
      type="button"
      className={`play-btn play-voice${on ? ' is-playing' : ''}`}
      onClick={() => toggleSpeech(key, phrase.say, lang)}
      aria-label={on ? t('Stop {name}', { name: phrase.say }) : t("Say {name} in the device's computer voice", { name: phrase.say })}
      title={t('Computer voice')}
    >
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18" className="play-track" />
        <path d="M13 17h4l5-4v14l-5-4h-4zM25 16c2 2 2 6 0 8" className="play-icon play-icon-line" />
      </svg>
    </button>
  )
}

// `set` on a phrase (from a search across sets) picks its own language.
export function PhraseList({ phrases, lang }: { phrases: (Phrase & { set?: PhraseSetId })[]; lang: PhraseSet['lang'] }) {
  return (
    <ul className="phrase-list">
      {phrases.map((p) => (
        <li key={p.say} className="phrase">
          {p.sound ? <PlayButton id={p.sound} name={p.say} /> : <SpeakButton phrase={p} lang={p.set ? phraseSets[p.set].lang : lang} />}
          <div className="phrase-text">
            <p className="phrase-say" lang={p.set ? phraseSets[p.set].lang : lang}>
              {p.say}
            </p>
            <p className="phrase-means">{p.means}</p>
            {p.note && <p className="phrase-note">{p.note}</p>}
            {p.sound && (
              <p className="sound-credit">
                Recording: <SoundCredit id={p.sound} />
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

// One page of the phrasebook, as the picture for a story.
export function PhraseCards({ set }: { set: PhraseSetId }) {
  const s = phraseSets[set]
  const recorded = s.phrases.filter((p) => p.sound && sound(p.sound)).length
  return (
    <figure className="phrase-cards">
      <p className="phrase-set-title">{s.title}</p>
      <PhraseList phrases={s.phrases} lang={s.lang} />
      <figcaption className="map-note">
        {recorded > 0 ? `${recorded} of ${s.phrases.length} recorded by speakers on Wikimedia Commons; ` : ''}
        the speaker button uses your device's own voice, where it has one.
      </figcaption>
    </figure>
  )
}
