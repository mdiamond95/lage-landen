import type { ReactNode } from 'react'
import type { HistEvent } from '../data/timeline'

type Props = {
  event: HistEvent
  year: number
  min: number
  max: number
  format: (year: number) => string
  playing: boolean
  onScrub: (year: number) => void
  onTogglePlay: () => void
  // The map key, as <li> items.
  children: ReactNode
}

// The caption, year slider, play button and key under a time map.
export function TimeControls({ event, year, min, max, format, playing, onScrub, onTogglePlay, children }: Props) {
  return (
    <figcaption>
      <div className="time-map-caption" aria-live="polite">
        <p className="time-map-title">{event.title}</p>
        <p className="time-map-text">{event.text}</p>
      </div>
      <label className="slider-row">
        <span>Year</span>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={year}
          onChange={(e) => onScrub(Number(e.target.value))}
          aria-label="Year"
          aria-valuetext={format(year)}
        />
        <span className="slider-value">{format(year)}</span>
      </label>
      <div className="time-map-foot">
        <button type="button" className="btn-ghost" onClick={onTogglePlay}>
          {playing ? 'Pause' : 'Play the story'}
        </button>
        <ul className="time-map-key" aria-label="Map key">
          {children}
        </ul>
      </div>
    </figcaption>
  )
}
