import { useSyncExternalStore } from 'react'
import { en, type Key } from './en'
import { nl } from './nl'
import { fr } from './fr'

// The interface language (plan: "English first, Dutch and French in phase 4"). Only the
// app's own words change: buttons, labels, hints and feedback. The lessons, captions and
// stories stay in English. The choice is kept on this device.
export const langs = ['en', 'nl', 'fr'] as const
export type Lang = (typeof langs)[number]
export type { Key }

// Each language's name in itself, for the picker, and its tag for <html lang> and dates.
export const langNames: Record<Lang, string> = { en: 'English', nl: 'Nederlands', fr: 'Français' }
export const langTags: Record<Lang, string> = { en: 'en-CA', nl: 'nl', fr: 'fr' }

const catalogues: Record<Lang, Record<Key, string>> = { en, nl, fr }
const KEY = 'lage-landen-lang'

const load = (): Lang => {
  try {
    const saved = localStorage.getItem(KEY)
    return langs.includes(saved as Lang) ? (saved as Lang) : 'en'
  } catch {
    return 'en'
  }
}

let current: Lang = load()
const listeners = new Set<() => void>()

export const getLang = () => current

export const setLang = (lang: Lang) => {
  current = lang
  try {
    localStorage.setItem(KEY, lang)
  } catch {
    // Private windows may refuse storage.
  }
  if (typeof document !== 'undefined') document.documentElement.lang = langTags[lang]
  listeners.forEach((l) => l())
}

// Re-renders a component when the language changes.
export const useLang = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => current,
  )

export type Vars = Record<string, string | number>

// A message in the current language, with {name} filled in from `vars`.
export const t = (key: Key, vars?: Vars, lang: Lang = current): string => {
  const text = catalogues[lang][key]
  return vars ? text.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m)) : text
}

// A list in the current language: "1, 2 and 3", "1, 2 en 3", "1, 2 et 3".
export const list = (items: (string | number)[], lang: Lang = current) =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} ${t('and', undefined, lang)} ${items[items.length - 1]}`

if (typeof document !== 'undefined') document.documentElement.lang = langTags[current]
