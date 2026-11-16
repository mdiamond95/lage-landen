import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { units } from '../content'
import type { Exercise } from '../content/schema'
import { photo } from '../photos'
import { photoIds, type PhotoId } from '../photos/ids'
import { ExerciseView } from './ExerciseView'

// Every question of every unit, drawn as it first appears, before it is answered. The
// checkpoints and the placement test ask these same questions, so they are covered too.
// A picture's caption, its credit (the maker's name) and the link to its file on Wikimedia
// Commons (whose file name often says what the picture shows) can each give the answer
// away, so none of them may show until the answer is checked. They show after it, and in
// the lesson's credits at the end.

const bySrc = new Map<string, PhotoId>(photoIds.map((id) => [photo(id).src, id]))
const sources = new Map<string, PhotoId>(photoIds.map((id) => [photo(id).source, id]))
const unescape = (s: string) => s.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>')
const draw = (exercise: Exercise, checked: boolean) => renderToStaticMarkup(<ExerciseView exercise={exercise} checked={checked} setAnswer={() => {}} />)
const pictures = (html: string) => [...html.matchAll(/<img [^>]*src="([^"]+)"/g)].map((m) => bySrc.get(unescape(m[1]))).filter((id) => id !== undefined)
const links = (html: string) => [...html.matchAll(/href="([^"]+)"/g)].map((m) => unescape(m[1]))
// What a reader sees under the pictures: the text of their captions and credit lines,
// without tags. (A question may name a thing in its own words, say on an option.)
const text = (html: string) => unescape(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ')
const under = (html: string) =>
  [...html.matchAll(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>|<p class="[^"]*credit[^"]*"[^>]*>([\s\S]*?)<\/p>/g)].map((m) => text(m[1] ?? m[2])).join(' | ')
const squash = (s: string) => s.replace(/\s+/g, ' ')

describe.each(units.map((u) => [u.number, u] as const))('Unit %i', (_, unit) => {
  const asks = unit.lessons.flatMap((l) => l.exercises.map((e, i) => [`${l.id} #${i + 1} (${e.type})`, e] as const)).filter(([, e]) => e.type !== 'story')

  it('shows no caption, credit or link to a picture’s file before a question is answered', () => {
    for (const [where, e] of asks) {
      const html = draw(e, false)
      const seen = under(html)
      for (const href of links(html)) expect(sources.get(href), `${where} links to the file of ${sources.get(href)}`).toBeUndefined()
      for (const id of new Set(pictures(html))) {
        const { caption } = photo(id)
        expect(seen.includes(squash(caption)), `${where} shows the caption of ${id}: ${caption}`).toBe(false)
      }
    }
  })

  it('credits a question’s picture once it is answered', () => {
    for (const [where, e] of asks) {
      if (!('visual' in e) || e.visual?.kind !== 'photo') continue
      const html = draw(e, true)
      expect(links(html), `${where} credits ${e.visual.photo}`).toContain(photo(e.visual.photo).source)
    }
  })
})
