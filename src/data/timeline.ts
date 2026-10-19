// Shared by the time maps: items that exist between two years, and one caption per stage.

export type HistEvent = { from: number; title: string; text: string }

// An item can drop out for a while (a trade ban, say): `off` lists those gaps.
export type Dated = { from: number; to?: number; off?: [number, number][] }

export const activeAt = (year: number, item: Dated) =>
  item.from <= year && (item.to === undefined || year <= item.to) && !item.off?.some(([a, b]) => a <= year && year <= b)

// The caption whose stage the year falls in. Each runs until the next one starts.
export const eventAt = (events: HistEvent[], year: number) => [...events].reverse().find((e) => e.from <= year) ?? events[0]
