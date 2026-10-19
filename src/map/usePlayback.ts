import { useEffect, useState } from 'react'

const STEP_MS = 2600

// A year that the learner drags, or that steps from one stage start to the next on play.
// `onYear` hears about every year the map moves to, but not the one it opens at.
export function usePlayback(starts: number[], min: number, initial = min, onYear?: (year: number) => void) {
  const [year, setYear] = useState(initial)
  const [playing, setPlaying] = useState(false)
  const moveTo = (y: number) => {
    setYear(y)
    onYear?.(y)
  }

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      const next = starts.find((s) => s > year)
      if (next !== undefined) moveTo(next)
      else setPlaying(false)
    }, STEP_MS)
    return () => window.clearTimeout(timer)
  })

  const togglePlay = () => {
    if (!playing && year >= starts[starts.length - 1]) moveTo(min)
    setPlaying(!playing)
  }
  const scrub = (y: number) => {
    setPlaying(false)
    moveTo(y)
  }
  return { year, playing, togglePlay, scrub }
}
