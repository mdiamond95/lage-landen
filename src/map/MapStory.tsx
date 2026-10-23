import { useEffect, useRef, useState } from 'react'
import { mapStories } from '../data/mapStories'
import { frameOf, stories } from '../data/stories'
import { eventAt } from '../data/timeline'
import { StoryMap } from './TimeMap'
import { TradeKey, TradeSvg } from './TradeMap'
import { t } from '../i18n'

const VOICE_KEY = 'lage-landen-voice'
// Without a voice (or with it off), a step stays up as long as reading it takes.
const MS_PER_WORD = 380
const MIN_STEP_MS = 3000

const speech = () => (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : undefined)

const loadVoice = () => {
  try {
    return localStorage.getItem(VOICE_KEY) !== 'off'
  } catch {
    return true
  }
}

const saveVoice = (on: boolean) => {
  try {
    localStorage.setItem(VOICE_KEY, on ? 'on' : 'off')
  } catch {
    // Private windows may refuse storage.
  }
}

// An English voice, Canadian if the device has one.
const pickVoice = (synth: SpeechSynthesis) => {
  const voices = synth.getVoices()
  return voices.find((v) => v.lang === 'en-CA') ?? voices.find((v) => v.lang === 'en-GB') ?? voices.find((v) => v.lang.startsWith('en'))
}

const readingMs = (text: string) => Math.max(MIN_STEP_MS, text.split(/\s+/).length * MS_PER_WORD)

// A map story: the unit's map moves from stage to stage while each line is read aloud
// by the browser's voice and shown as a caption. Play runs it through; Back and Next, or
// the row of steps, go one stage at a time. The voice can be switched off, and the
// choice is kept on this device.
export function MapStory({ unit }: { unit: string }) {
  const story = mapStories[unit]
  const frame = frameOf(story.map)
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [voice, setVoice] = useState(() => !!speech() && loadVoice())
  const last = story.steps.length - 1
  const step = story.steps[i]
  const event = eventAt(frame.events, step.at)
  const advance = useRef(() => {})
  advance.current = () => {
    if (i < last) setI(i + 1)
    else setPlaying(false)
  }

  useEffect(() => {
    if (!playing) return
    let done = false
    const next = () => {
      if (done) return
      done = true
      advance.current()
    }
    const synth = speech()
    let timer = 0
    const wait = (ms: number) => {
      window.clearTimeout(timer)
      timer = window.setTimeout(next, ms)
    }
    if (voice && synth) {
      const line = new SpeechSynthesisUtterance(step.say)
      line.lang = 'en-CA'
      const v = pickVoice(synth)
      if (v) line.voice = v
      line.onend = () => wait(600)
      // No voice to speak with: fall back to reading time.
      line.onerror = () => wait(readingMs(step.say))
      synth.cancel()
      synth.speak(line)
      // Some browsers never say the line has ended; don't wait for ever.
      wait(readingMs(step.say) * 2 + 4000)
    } else wait(readingMs(step.say))
    return () => {
      done = true
      window.clearTimeout(timer)
      synth?.cancel()
    }
  }, [playing, i, voice, step.say])

  useEffect(() => () => speech()?.cancel(), [])

  const go = (j: number) => {
    setPlaying(false)
    setI(j)
  }
  const togglePlay = () => {
    if (!playing && i === last) setI(0)
    setPlaying(!playing)
  }
  const toggleVoice = () => {
    saveVoice(!voice)
    setVoice(!voice)
  }

  const key =
    story.map === 'cloth' ? (
      <TradeKey />
    ) : (
      (event.key ?? stories[story.map].key).map((k) => (
        <li key={k.text}>
          <span className={`key-swatch ${k.swatch}`} />
          {k.text}
        </li>
      ))
    )

  return (
    <figure className={`time-map map-story${story.map === 'cloth' ? ' trade-map' : ''}`} data-step={i}>
      <div className="map-frame">{story.map === 'cloth' ? <TradeSvg year={step.at} /> : <StoryMap story={stories[story.map]} year={step.at} />}</div>
      <figcaption>
        <ol className="map-story-steps" aria-label={t('The story in {n} steps', { n: story.steps.length })}>
          {story.steps.map((s, j) => (
            <li key={s.at}>
              <button
                type="button"
                className={`map-story-dot${j === i ? ' is-on' : j < i ? ' is-past' : ''}`}
                aria-current={j === i ? 'step' : undefined}
                aria-label={t('Step {n}: {when}', { n: j + 1, when: frame.format(s.at) })}
                onClick={() => go(j)}
              />
            </li>
          ))}
        </ol>
        <div className="time-map-caption" aria-live={playing && voice ? 'off' : 'polite'}>
          <p className="map-story-count">
            {t('{n} of {total}', { n: i + 1, total: story.steps.length })} · {frame.format(step.at)}
          </p>
          <p className="time-map-title" lang="en-CA">{event.title}</p>
          <p className="time-map-text map-story-say" lang="en-CA">{step.say}</p>
        </div>
        <div className="map-story-nav">
          <button type="button" className="btn-ghost" onClick={() => go(i - 1)} disabled={i === 0}>
            {t('Back')}
          </button>
          <button type="button" className="btn-ghost map-story-play" onClick={togglePlay}>
            {playing ? t('Pause') : i === last ? t('Play again') : i === 0 ? t('Play the story') : t('Play on')}
          </button>
          <button type="button" className="btn-ghost" onClick={() => go(i + 1)} disabled={i === last}>
            {t('Next')}
          </button>
        </div>
        <div className="time-map-foot">
          {speech() && (
            <label className="map-story-voice">
              <input type="checkbox" checked={voice} onChange={toggleVoice} /> {t('Read aloud')}
            </label>
          )}
          <ul className="time-map-key" aria-label={t('Map key')}>
            {key}
          </ul>
        </div>
      </figcaption>
    </figure>
  )
}
