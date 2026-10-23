import { useMemo, useState } from 'react'
import { dialectIds, dialectPieces, dialects, type DialectId } from '../data/dialects'
import { PlayButton, SoundCredit } from '../sounds/Sound'
import { sound } from '../sounds'
import { lowlandsFrame } from './geo'
import { LowlandsMap } from './LowlandsMap'
import { t } from '../i18n'

const pieceOf = new Map(dialectIds.flatMap((id) => dialects[id].pieces.map((p) => [p, id] as const)))

type Props = {
  // `explore` names every region and opens a card on tap; `pick` asks for one region,
  // unnamed, for a listening question, and `correct` marks the answer once checked.
  mode?: 'explore' | 'pick'
  focus?: DialectId
  picked?: DialectId | null
  correct?: DialectId
  onPick?: (id: DialectId) => void
}

// The clickable dialect map of Unit 20: every language and dialect group of the Low
// Countries in its own colour, by family. Tap one to read about it and hear it, where a
// free recording exists.
export function DialectMap({ mode = 'explore', focus, picked = null, correct, onPick }: Props) {
  const [open, setOpen] = useState<DialectId | null>(focus ?? null)
  const selected = mode === 'pick' ? picked : open
  const d = useMemo(
    () =>
      dialectPieces.map((f) => ({
        piece: f.properties.id,
        id: pieceOf.get(f.properties.id)!,
        d: lowlandsFrame.path(f) ?? '',
      })),
    [],
  )
  const tap = (id: DialectId) => {
    if (mode === 'pick') {
      if (correct === undefined) onPick?.(id)
    } else setOpen(id === open ? null : id)
  }
  const state = (id: DialectId) => {
    if (correct !== undefined) return id === correct ? ' is-right' : id === picked ? ' is-wrong' : ' is-dim'
    if (selected === null) return ''
    return id === selected ? ' is-selected' : ' is-dim'
  }
  const card = mode === 'explore' && open ? dialects[open] : undefined

  return (
    <figure className={`dialect-map dialect-${mode}`}>
      <div className="map-frame">
        <LowlandsMap label={mode === 'pick' ? t('Map of the languages and dialects of the Low Countries, unnamed') : t('Map of the languages and dialects of the Low Countries')}>
          {d.map((p) => (
            <path
              key={p.piece}
              d={p.d}
              className={`dialect dialect-${p.id}${state(p.id)}`}
              role="button"
              tabIndex={0}
              aria-label={mode === 'pick' && correct === undefined ? t('Region {n}', { n: dialectIds.indexOf(p.id) + 1 }) : dialects[p.id].name}
              aria-pressed={selected === p.id}
              onClick={() => tap(p.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), tap(p.id))}
            />
          ))}
          {(mode === 'explore' || correct !== undefined) &&
            dialectIds.map((id) => {
              if (mode === 'pick' && id !== correct && id !== picked) return null
              const [x, y] = lowlandsFrame.toXY(dialects[id].at)
              return (
                <text key={id} x={x} y={y} textAnchor="middle" className={`dialect-label${id === 'brussels' || id === 'new-land' ? ' dialect-label-small' : ''}`}>
                  {dialects[id].name}
                </text>
              )
            })}
        </LowlandsMap>
      </div>
      {mode === 'explore' && (
        <div className="dialect-card" aria-live="polite">
          {card ? (
            <>
              <p className="dialect-title">
                <span className={`dialect-swatch dialect-${open}`} aria-hidden="true" />
                {card.name}
                {card.own !== card.name && <span className="dialect-own"> · {card.own}</span>}
              </p>
              <p className="dialect-family">{card.family === 'None' ? 'Reclaimed land' : `${card.family} family`}</p>
              <p className="dialect-about">{card.about}</p>
              {card.status && <p className="dialect-status">{card.status}</p>}
              {card.sounds.length > 0 ? (
                <ul className="dialect-sounds">
                  {card.sounds.map((s) => (
                    <li key={s}>
                      <PlayButton id={s} name={sound(s).words} />
                      <span>
                        <b>{sound(s).words}</b>
                        {sound(s).meaning && <> · {sound(s).meaning}</>}
                        <span className="sound-credit">
                          {' '}
                          (<SoundCredit id={s} />)
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                card.family !== 'None' && <p className="dialect-status">{t('No free recording of it yet.')}</p>
              )}
            </>
          ) : (
            <p className="dialect-about">{t('Tap a region to read about it, and to hear it where there is a recording.')}</p>
          )}
        </div>
      )}
      {mode === 'explore' && (
        <ul className="dialect-key">
          {dialectIds.map((id) => (
            <li key={id}>
              <button type="button" className={open === id ? 'is-on' : ''} onClick={() => tap(id)}>
                <span className={`dialect-swatch dialect-${id}`} aria-hidden="true" />
                {dialects[id].name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {mode === 'explore' && <figcaption className="map-note">Dialects shade into each other from village to village; the lines are a summary, drawn along today's municipal borders.</figcaption>}
    </figure>
  )
}
