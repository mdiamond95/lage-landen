import { throughTimeStory } from '../data/throughTime'
import { TimeMap } from '../map/TimeMap'

// The time map on its own screen: 14 snapshots of the Low Countries, stepped
// through with the slider or played one after another.
export function TimeTravel({ onBack }: { onBack: () => void }) {
  return (
    <div className="time-travel">
      <header className="lesson-top">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back to the course">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="time-travel-title">Time map</h1>
      </header>
      <p className="muted time-travel-intro">
        Two thousand years of the Low Countries in 14 snapshots. Drag the slider, or play them one after another.
      </p>
      <TimeMap story={throughTimeStory} snapshots />
    </div>
  )
}
