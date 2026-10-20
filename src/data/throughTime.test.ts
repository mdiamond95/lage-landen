import { describe, expect, it } from 'vitest'
import { activeAt } from './timeline'
import { throughTimeStory } from './throughTime'

describe('time map through the eras', () => {
  const { events, areas = [], labels } = throughTimeStory

  it('has 33 snapshots in order, each with a caption', () => {
    expect(events).toHaveLength(33)
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
  })
})
