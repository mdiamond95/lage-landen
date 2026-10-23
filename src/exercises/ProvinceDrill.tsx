import { useMemo, useState } from 'react'
import type { ExerciseOf } from '../content/schema'
import { provinceIds, provinces, provincesOf, type ProvinceId } from '../data/provinces'
import { shuffle } from '../lesson/shuffle'
import { ProvinceMap, type Country, type Mark } from '../map/ProvinceMap'
import { Photo } from '../photos/Photo'
import type { ExerciseProps } from './types'
import { t } from '../i18n'

export type Ask = 'name' | 'capital' | 'flag'

// Both countries have a Limburg, so on a map of both a shared name says which country.
const nameOf = (id: ProvinceId, country: Country) => {
  const { name, part } = provinces[id]
  const shared = country === 'both' && provinceIds.some((o) => o !== id && provinces[o].name === name)
  return shared ? (part === 'netherlands' ? t('{name}, in the Netherlands', { name }) : t('{name}, in Belgium', { name })) : name
}

const clue = (ask: Ask, id: ProvinceId, country: Country) =>
  ask === 'name' ? t('Tap {name}', { name: nameOf(id, country) }) : ask === 'capital' ? t('Tap the province whose capital is {capital}', { capital: provinces[id].capital }) : t('Tap the province that flies this flag')

// The provinces drill (Unit 26): one province at a time, named, by its capital or by its flag, to find
// on the unnamed map. A right tap names it in green; a wrong one shows where it was, in orange, and
// counts as a miss. Used in lessons and on its own screen.
export function Drill({ country, ask, rounds, onDone }: { country: Country; ask: Ask; rounds: ProvinceId[]; onDone: (missed: ProvinceId[]) => void }) {
  const [round, setRound] = useState(0)
  const [marks, setMarks] = useState<Partial<Record<ProvinceId, Mark>>>({})
  const [missed, setMissed] = useState<ProvinceId[]>([])
  const [said, setSaid] = useState('')
  const target = rounds[round]
  const done = round >= rounds.length

  const pick = (id: ProvinceId) => {
    if (done) return
    const right = id === target
    const next = Object.fromEntries(Object.entries(marks).filter(([, m]) => m !== 'wrong')) as Partial<Record<ProvinceId, Mark>>
    next[target] = right ? 'right' : 'missed'
    if (!right) next[id] = next[id] ?? 'wrong'
    const nowMissed = right ? missed : [...missed, target]
    setMarks(next)
    setMissed(nowMissed)
    setSaid(right ? t('Right: {name}.', { name: provinces[target].name }) : t('That was {wrong}. {right} is the one in orange.', { wrong: provinces[id].name, right: provinces[target].name }))
    setRound(round + 1)
    if (round + 1 >= rounds.length) onDone(nowMissed)
  }

  return (
    <div className="drill" data-target={done ? undefined : target}>
      <div className="drill-clue" aria-live="polite">
        {done ? (
          <p className="drill-ask">
            {rounds.length - missed.length} of {rounds.length} right
          </p>
        ) : (
          <>
            {ask === 'flag' && <Photo id={provinces[target].flag} className="photo drill-flag" />}
            <p className="drill-ask">{clue(ask, target, country)}</p>
            <p className="drill-count">
              {round + 1} of {rounds.length}
            </p>
          </>
        )}
        {said && <p className="drill-said">{said}</p>}
      </div>
      <ProvinceMap country={country} mode="drill" marks={marks} named={rounds.slice(0, round)} onPick={pick} label={t('Map of unnamed provinces to find')} />
    </div>
  )
}

export function ProvinceDrill({ exercise, checked, setAnswer }: ExerciseProps<ExerciseOf<'drill'>>) {
  const rounds = useMemo(() => shuffle(exercise.only ?? provincesOf(exercise.country)).slice(0, exercise.rounds), [exercise])

  const done = (missed: ProvinceId[]) =>
    setAnswer(() => ({
      correct: missed.length <= exercise.misses,
      detail: `${missed.length ? t('Missed: {names}.', { names: missed.map((id) => provinces[id].name).join(', ') }) : t('Every one right.')} ${exercise.explain}`,
    }))

  return (
    <div className="exercise exercise-drill">
      <p className="eyebrow">{t('Map drill')}</p>
      <h2>{exercise.prompt}</h2>
      {checked ? <ProvinceMap country={exercise.country} /> : <Drill country={exercise.country} ask={exercise.ask} rounds={rounds} onDone={done} />}
      <p className="hint">
        {checked ? t('Now tap any province to read about it.') : exercise.misses ? t(exercise.misses === 1 ? 'Find them all, with up to 1 miss.' : 'Find them all, with up to {n} misses.', { n: exercise.misses }) : t('Find them all without a miss.')}
      </p>
    </div>
  )
}
