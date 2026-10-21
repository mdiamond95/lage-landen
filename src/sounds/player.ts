import { useSyncExternalStore } from 'react'

// One recording plays at a time, app-wide: starting another stops the first. Components
// read what is playing, and how far along it is, through useSound.

type State = { playing: string | null; progress: number }

let state: State = { playing: null, progress: 0 }
let audio: HTMLAudioElement | null = null
const listeners = new Set<() => void>()

const set = (next: Partial<State>) => {
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function stopSound() {
  audio?.pause()
  audio = null
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel()
  set({ playing: null, progress: 0 })
}

// Plays `src` under the key `key`; playing the same key again stops it.
export function toggleSound(key: string, src: string) {
  if (state.playing === key) return stopSound()
  stopSound()
  const a = new Audio(src)
  audio = a
  a.ontimeupdate = () => audio === a && set({ progress: a.duration ? a.currentTime / a.duration : 0 })
  a.onended = () => audio === a && set({ playing: null, progress: 0 })
  a.onerror = () => audio === a && set({ playing: null, progress: 0 })
  set({ playing: key, progress: 0 })
  a.play().catch(() => audio === a && set({ playing: null, progress: 0 }))
}

// The browser's own voice, for phrases nobody has recorded yet: only offered when the
// device has a voice for the language (Dutch as nl-NL or nl-BE, French as fr-BE or fr-FR).
export const voiceFor = (lang: string) => {
  if (typeof speechSynthesis === 'undefined') return undefined
  const voices = speechSynthesis.getVoices()
  const base = lang.slice(0, 2)
  return voices.find((v) => v.lang.replace('_', '-') === lang) ?? voices.find((v) => v.lang.startsWith(base))
}

export function toggleSpeech(key: string, text: string, lang: string) {
  if (state.playing === key) return stopSound()
  stopSound()
  const voice = voiceFor(lang)
  if (!voice) return
  const u = new SpeechSynthesisUtterance(text)
  u.voice = voice
  u.lang = voice.lang
  u.rate = 0.9
  u.onend = () => state.playing === key && set({ playing: null, progress: 0 })
  u.onerror = u.onend
  set({ playing: key, progress: 0 })
  speechSynthesis.speak(u)
}

export const useSound = () => useSyncExternalStore(subscribe, () => state)

// Voices load late in some browsers: re-render once they arrive.
const voiceListeners = new Set<() => void>()
let voicesReady = 0
if (typeof speechSynthesis !== 'undefined')
  speechSynthesis.addEventListener?.('voiceschanged', () => {
    voicesReady++
    voiceListeners.forEach((l) => l())
  })
export const useVoices = () =>
  useSyncExternalStore(
    (l) => {
      voiceListeners.add(l)
      return () => voiceListeners.delete(l)
    },
    () => voicesReady,
  )
