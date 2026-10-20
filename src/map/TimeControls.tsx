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
  hideCaption?: boolean
  note?: string
  // Years the slider snaps between, one notch per stage, instead of every year.
  stops?: number[]
  // The map key, as <li> items.
  children: ReactNode
}

// The caption, year slider, play button and key under a time map.
export function TimeControls({ event, year, min, max, format, playing, onScrub, onTogglePlay, hideCaption, note, stops, children }: Props) {
  // With stops, the slider's value is the number of the stage on screen.
  const stop = stops ? Math.max(0, stops.findLastIndex((s) => s <= year)) : 0
  return (
    <figcaption>
      {hideCaption ? (
        <p className="time-map-caption time-map-hidden">Read the map: the captions come back once you check.</p>
      ) : (
        <div className="time-map-caption" aria-live="polite">
          <p className="time-map-title">{event.title}</p>
          <p className="time-map-text">{event.text}</p>
        </div>
      )}
      <label className="slider-row">
        <span>{stops ? `${stop + 1} of ${stops.length}` : 'Year'}</span>
        <input
          type="range"
          min={stops ? 0 : min}
          max={stops ? stops.length - 1 : max}
          step={1}
          value={stops ? stop : year}
          onChange={(e) => onScrub(stops ? stops[Number(e.target.value)] : Number(e.target.value))}
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
      {note && <p className="time-map-note">{note}</p>}
    </figcaption>
  )
}
