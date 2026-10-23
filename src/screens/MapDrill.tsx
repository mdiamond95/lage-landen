import { useState } from 'react'
import { provincesOf, type ProvinceId } from '../data/provinces'
import { Drill, type Ask } from '../exercises/ProvinceDrill'
import { shuffle } from '../lesson/shuffle'
import type { Country } from '../map/ProvinceMap'
import { loadBest, saveBest } from '../progress/drill'
import { t, type Key } from '../i18n'

const countries: { id: Country; label: Key }[] = [
  { id: 'NLD', label: 'The Netherlands' },
  { id: 'BEL', label: 'Belgium' },
  { id: 'both', label: 'Both' },
]
const asks: { id: Ask; label: Key }[] = [
  { id: 'name', label: 'By name' },
  { id: 'capital', label: 'By capital' },
  { id: 'flag', label: 'By flag' },
]

// The provinces drill on its own screen (Unit 26): every province of one country or both, by
// name, capital or flag, as often as you like.
export function MapDrill({ onBack }: { onBack: () => void }) {
  const [country, setCountry] = useState<Country>('NLD')
  const [ask, setAsk] = useState<Ask>('name')
  const [rounds, setRounds] = useState<ProvinceId[]>(() => shuffle(provincesOf('NLD')))
  const [run, setRun] = useState(0)
  const [best, setBest] = useState(loadBest)
  const mode = `${country}-${ask}`

  const restart = (c: Country, a: Ask) => {
    setCountry(c)
    setAsk(a)
    setRounds(shuffle(provincesOf(c)))
    setRun(run + 1)
  }
  const done = (missed: ProvinceId[]) => {
    const score = rounds.length - missed.length
    if (score > (best[mode] ?? -1)) {
      const next = { ...best, [mode]: score }
      setBest(next)
      saveBest(next)
    }
  }

  return (
    <div className="map-drill">
      <header className="lesson-top">
        <button type="button" className="icon-btn" onClick={onBack} aria-label={t('Back to the course')}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="time-travel-title">{t('Map drill')}</h1>
      </header>
      <p className="muted time-travel-intro">{t('Find every province on the map. A wrong tap shows the right one in orange.')}</p>
      <div className="food-kinds" role="group" aria-label={t('Country')}>
        {countries.map((c) => (
          <button type="button" key={c.id} className={country === c.id ? 'is-on' : ''} aria-pressed={country === c.id} onClick={() => restart(c.id, ask)}>
            {t(c.label)}
          </button>
        ))}
      </div>
      <div className="food-kinds" role="group" aria-label={t('Find them')}>
        {asks.map((a) => (
          <button type="button" key={a.id} className={ask === a.id ? 'is-on' : ''} aria-pressed={ask === a.id} onClick={() => restart(country, a.id)}>
            {t(a.label)}
          </button>
        ))}
      </div>
      <p className="drill-best">{best[mode] !== undefined ? t('Your best: {n} of {total}', { n: best[mode], total: rounds.length }) : t('No score yet for this drill.')}</p>
      <Drill key={run} country={country} ask={ask} rounds={rounds} onDone={done} />
      <button type="button" className="btn-primary" onClick={() => restart(country, ask)}>
        {t('Start again')}
      </button>
    </div>
  )
}
