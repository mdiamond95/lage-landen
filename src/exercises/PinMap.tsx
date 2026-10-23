import { useState } from 'react'
import { places } from '../content/places'
import type { ExerciseOf } from '../content/schema'
import { LowlandsMap, toXY, type MapPin } from '../map/LowlandsMap'
import { formatKm, scorePin } from '../lesson/scoring'
import type { ExerciseProps } from './types'
import { t } from '../i18n'

export function PinMap({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'pin'>>) {
  const [guess, setGuess] = useState<[number, number] | null>(null)
  const place = places[exercise.place]
  const target: [number, number] = [place.lon, place.lat]

  const onPin = (lonLat: [number, number]) => {
    if (checked) return
    setGuess(lonLat)
    setAnswer(() => {
      const r = scorePin(lonLat, target, exercise.okKm, exercise.fullKm)
      const off = r.km < 1 ? t('Spot on.') : t('You were {km} away.', { km: formatKm(r.km) })
      return { correct: r.correct, bonus: r.bonus, detail: `${off} ${exercise.explain}`, places: [exercise.place] }
    })
  }

  const pins: MapPin[] = []
  if (guess) pins.push({ lonLat: guess, tone: 'guess', label: checked ? t('Your pin') : undefined })
  if (checked) pins.push({ place: exercise.place, tone: 'answer' })
  const line = checked && guess ? [toXY(guess), toXY(target)] : null

  return (
    <div className="exercise">
      <p className="eyebrow">{t('Pin the map')}</p>
      <h2>{exercise.prompt}</h2>
      <div className="map-frame">
        <LowlandsMap label={t('Map for: {prompt}', { prompt: exercise.prompt })} mode={checked ? 'view' : 'pin'} layer="provinces" pins={pins} onPin={onPin}>
          {line && (
            <line x1={line[0][0]} y1={line[0][1]} x2={line[1][0]} y2={line[1][1]} className="miss-line" />
          )}
        </LowlandsMap>
      </div>
      {!guess && <p className="hint">{t('Tap the map to drop a pin. Tap again to move it.')}</p>}
    </div>
  )
}
