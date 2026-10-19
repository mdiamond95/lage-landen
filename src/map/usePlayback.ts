import { useEffect, useState } from 'react'

const STEP_MS = 2600

// A year that the learner drags, or that steps from one stage start to the next on play.
export function usePlayback(starts: number[], min: number, initial = min) {
  const [year, setYear] = useState(initial)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      const next = starts.find((s) => s > year)
      if (next !== undefined) setYear(next)
      else setPlaying(false)
    }, STEP_MS)
    return () => window.clearTimeout(timer)
  }, [playing, year, starts])

  const togglePlay = () => {
    if (!playing && year >= starts[starts.length - 1]) setYear(min)
    setPlaying(!playing)
  }
  const scrub = (y: number) => {
    setPlaying(false)
    setYear(y)
  }
  return { year, playing, togglePlay, scrub }
}
