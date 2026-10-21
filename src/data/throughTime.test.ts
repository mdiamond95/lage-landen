import { describe, expect, it } from 'vitest'
import { activeAt } from './timeline'
import { throughTimeStory } from './throughTime'

describe('time map through the eras', () => {
  const { events, areas = [], labels } = throughTimeStory

  it('has 40 snapshots in order, each with a caption', () => {
    expect(events).toHaveLength(40)
    events.forEach((e, i) => {
      if (i) expect(e.from).toBeGreaterThan(events[i - 1].from)
      expect(e.title).toMatch(/\S/)
      expect(e.key?.length).toBeGreaterThan(0)
    })
  })

  it("never shows one era's areas or labels in another", () => {
    const at = (year: number) => [...areas, ...labels].filter((x) => activeAt(year, x))
    const roman = at(47).length
    expect(roman).toBeGreaterThan(0)
    expect(at(1302).some((x) => 'text' in x && x.text === 'Frisians')).toBe(false)
    expect(at(1997).some((x) => 'kind' in x && x.kind === 'rebel')).toBe(false)
    // The Golden Age painters stop at the peace of 1648, and don't name the countries twice.
    expect(at(1642).filter((x) => 'text' in x && x.text === 'SPANISH NETHERLANDS')).toHaveLength(1)
    // The map of 1672 to 1815 starts at its own first snapshot, after the Spanish map's.
    expect(at(1678).some((x) => 'kind' in x && x.kind === 'austria')).toBe(false)
    expect(at(1678).some((x) => 'text' in x && x.text === 'KINGDOM OF THE NETHERLANDS')).toBe(false)
    expect(at(1714).some((x) => 'kind' in x && x.kind === 'austria')).toBe(true)
    expect(at(1714).some((x) => 'text' in x && x.text === 'SPANISH NETHERLANDS')).toBe(false)
    // The kingdom map starts at its first snapshot, 1830, so 1815 is still the border map's.
    expect(at(1815).some((x) => 'kind' in x && x.kind === 'belgium')).toBe(false)
    expect(at(1830).some((x) => 'kind' in x && x.kind === 'belgium')).toBe(true)
    expect(at(1839).some((x) => 'kind' in x && x.kind === 'duchy')).toBe(true)
    // Belgium's first railways and its coal belt show in 1843, and give way to the railway map in 1856.
    expect(at(1843).some((x) => 'kind' in x && x.kind === 'coal')).toBe(true)
    expect(at(1843).some((x) => 'kind' in x && x.kind === 'duchy')).toBe(true)
    expect(at(1856).some((x) => 'kind' in x && x.kind === 'coal')).toBe(false)
    expect(at(1843).some((x) => 'text' in x && x.text === 'STRIKES')).toBe(false)
    // The railway map starts at 1856; Luxembourg leaves the Dutch crown in 1890.
    expect(at(1856).some((x) => 'kind' in x && x.kind === 'duchy')).toBe(true)
    expect(at(1890).some((x) => 'kind' in x && x.kind === 'duchy')).toBe(false)
    expect(at(1890).some((x) => 'text' in x && x.text === 'UNITED KINGDOM OF THE NETHERLANDS')).toBe(false)
    // The war: all occupied in 1940, the south free by 1944, all free in 1945, gone by 1997.
    const kinds = (year: number) => new Set(at(year).map((x) => ('kind' in x ? x.kind : undefined)))
    expect(kinds(1914).has('occupied')).toBe(false)
    // The front of 1915: Belgium occupied but for the corner behind the Yser, gone by 1940.
    expect(kinds(1915).has('occupied') && kinds(1915).has('belgium')).toBe(true)
    expect(kinds(1915).has('coal')).toBe(false)
    // The modern artists of 1917 stand on a map without the front, and are gone by 1940.
    expect(kinds(1917).has('occupied')).toBe(false)
    expect(at(1917).some((x) => 'text' in x && x.text === 'NETHERLANDS')).toBe(true)
    expect(at(1940).some((x) => 'text' in x && x.text === 'NETHERLANDS')).toBe(false)
    expect(kinds(1940).has('occupied')).toBe(true)
    expect(kinds(1940).has('free')).toBe(false)
    expect(kinds(1944).has('occupied') && kinds(1944).has('free')).toBe(true)
    expect(kinds(1945).has('occupied')).toBe(false)
    expect(kinds(1997).has('free')).toBe(false)
    // The flood of 1953 shows in 1953 only, not after the Delta Works.
    expect(kinds(1945).has('flooded')).toBe(false)
    expect(kinds(1953).has('flooded')).toBe(true)
    expect(kinds(1986).has('flooded')).toBe(false)
    expect(kinds(1953).has('occupied')).toBe(false)
    // Expo 58: the Atomium among the modern buildings, gone again by 1963; the older buildings stay off.
    const names = (year: number) => throughTimeStory.sites.filter((x) => activeAt(year, x) && x.from <= year && (x.end === undefined || year <= x.end)).map((x) => x.name)
    expect(names(1958)).toContain('Atomium')
    expect(names(1958)).not.toContain('Belfry of Bruges')
    expect(names(1953)).not.toContain('Atomium')
    expect(names(1963)).not.toContain('Atomium')
    // Belgium's language areas from 1963, beside the Delta Works until 1997, with both keys.
    expect(kinds(1953).has('dutch')).toBe(false)
    expect((['dutch', 'french', 'german', 'bilingual'] as const).every((k) => kinds(1963).has(k))).toBe(true)
    expect(kinds(1986).has('german')).toBe(true)
    const swatches = (year: number) => events.find((e) => e.from === year)!.key!.map((k) => k.swatch)
    expect(swatches(1986)).toContain('key-dutch')
    expect(swatches(1963)).toEqual(expect.arrayContaining(swatches(1953)))
    expect(swatches(2012)).toContain('key-german')
    expect(swatches(2012)).not.toContain('key-facility')
  })
})
