import { useState } from 'react'
import { eventAt, type TimeStory } from '../data/timeline'
import { StoryMap } from './TimeMap'
import { t } from '../i18n'

// Before and after: two years of a time map laid one over the other. Dragging the
// divider (or using the arrow keys on it) wipes from the earlier map on the left to
// the later one on the right, so what changed stands out against what stayed.
export function CompareMap({ story, years: [before, after] }: { story: TimeStory; years: [number, number] }) {
  const [split, setSplit] = useState(50)
  const then = eventAt(story.events, before)
  const now = eventAt(story.events, after)
  // Both years' keys, without repeats, and without the mark for what just changed
  // hands: the wipe shows the change, so neither map highlights it.
  const key = [...(then.key ?? story.key), ...(now.key ?? story.key)].filter(
    (k, i, all) => k.swatch !== 'key-flash' && all.findIndex((o) => o.swatch === k.swatch) === i,
  )

  return (
    <figure className="compare-map">
      <div className="map-frame compare-frame">
        <div className="compare-layer">
          <StoryMap story={story} year={after} highlightFresh={false} />
        </div>
        <div className="compare-layer compare-before" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
          <StoryMap story={story} year={before} highlightFresh={false} />
        </div>
        <div className="compare-divider" style={{ left: `${split}%` }} aria-hidden="true" />
        <span className="compare-tag compare-tag-before">{story.format(before)}</span>
        <span className="compare-tag compare-tag-after">{story.format(after)}</span>
      </div>
      <figcaption>
        <label className="slider-row">
          <span>{story.format(before)}</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            aria-label={t('Before and after')}
            aria-valuetext={`${split}% ${story.format(before)}, ${100 - split}% ${story.format(after)}`}
          />
          <span className="slider-value">{story.format(after)}</span>
        </label>
        <p className="compare-hint">{t('Drag to wipe from {from} to {to}.', { from: story.format(before), to: story.format(after) })}</p>
        <div className="compare-captions">
          <p>
            <span className="compare-side">{t('Left')}</span> <span lang="en-CA">{then.title}</span>
          </p>
          <p>
            <span className="compare-side">{t('Right')}</span> <span lang="en-CA">{now.title}</span>
          </p>
        </div>
        <ul className="time-map-key" aria-label={t('Map key')}>
          {key.map((k) => (
            <li key={k.text}>
              <span className={`key-swatch ${k.swatch}`} />
              {k.text}
            </li>
          ))}
        </ul>
        {story.note && <p className="time-map-note">{story.note}</p>}
      </figcaption>
    </figure>
  )
}
