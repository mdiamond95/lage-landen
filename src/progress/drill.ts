// The map drill's best scores, by country and kind of question. A convenience kept on this
// device only (and in a progress file); the drill works without them.
const KEY = 'lage-landen-drill-best'

export const loadBest = (): Record<string, number> => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

export const saveBest = (best: Record<string, number>) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(best))
  } catch {
    // Private windows may refuse storage.
  }
}
