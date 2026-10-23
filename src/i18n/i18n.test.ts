import { describe, expect, it } from 'vitest'
import { en, type Key } from './en'
import { nl } from './nl'
import { fr } from './fr'
import { langs, list, t } from '.'

const keys = Object.keys(en) as Key[]
const slots = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort()

describe('interface languages', () => {
  it.each([
    ['nl', nl],
    ['fr', fr],
  ] as const)('%s has every key, with the same slots', (_, catalogue) => {
    expect(Object.keys(catalogue).sort()).toEqual([...keys].sort())
    for (const key of keys) {
      const text = catalogue[key]
      expect(text.trim(), key).not.toBe('')
      expect(slots(text), key).toEqual(slots(key))
    }
  })

  it('French puts a no-break space before : ; ! ? and %', () => {
    for (const key of keys) {
      expect(fr[key], key).not.toMatch(/(^|[^\u00a0\u202f])[:;!?%]/)
    }
  })

  it('fills slots and lists in each language', () => {
    expect(t('Unit {n}', { n: 4 })).toBe('Unit 4')
    expect(t('Unit {n}', { n: 4 }, 'nl')).toBe('Hoofdstuk 4')
    expect(t('Unit {n}', { n: 4 }, 'fr')).toBe('Unité 4')
    expect(list([1, 2, 3])).toBe('1, 2 and 3')
    expect(list([1, 2], 'nl')).toBe('1 en 2')
    expect(list([7], 'fr')).toBe('7')
    expect(langs).toEqual(['en', 'nl', 'fr'])
  })
})
