import { describe, expect, it } from 'vitest'
import { activeAt } from './timeline'
import { throughTimeStory } from './throughTime'

describe('time map through the eras', () => {
  const { events, areas = [], labels } = throughTimeStory

  it('has 14 snapshots in order, each with a caption', () => {
    expect(events).toHaveLength(14)
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
  })
})
