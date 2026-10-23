import { useState } from 'react'
import { foodIds, foodKindNames, foodKinds, foods, type FoodId, type FoodKind } from '../data/foods'
import { Credit, Photo } from '../photos/Photo'
import { PlayButton } from '../sounds/Sound'
import { sound } from '../sounds'
import { lowlandsFrame } from './geo'
import { foodGlyphs, type FoodGlyph } from './glyphs'
import { LowlandsMap } from './LowlandsMap'
import { t } from '../i18n'

// Each kind of food has the mark it has on the food time map.
export const glyphOf: Record<FoodKind, FoodGlyph> = { cheese: 'cheese', sea: 'fish', sweet: 'sweet', dish: 'dish', beer: 'brewery', spirit: 'distillery' }

type Props = {
  // `explore` names the foods and opens a card on tap; `pick` asks for one place, unnamed,
  // for a taste-and-find question, and `correct` marks the answer once checked.
  mode?: 'explore' | 'pick'
  focus?: FoodId
  // Opens on one kind of food; a pick question shows only the marks of its answer's kind.
  only?: FoodKind
  picked?: FoodId | null
  correct?: FoodId
  onPick?: (id: FoodId) => void
}

// The regional food map of Unit 21: the cheeses, fish, sweets, dishes, beers and jenevers of
// the Low Countries where they come from. Tap one for a photo, a word on it and its name said
// aloud; the buttons above pick one kind.
export function FoodMap({ mode = 'explore', focus, only, picked = null, correct, onPick }: Props) {
  const [kind, setKind] = useState<FoodKind | null>(only ?? (focus ? foods[focus].kind : null))
  const [open, setOpen] = useState<FoodId | null>(focus ?? null)
  const selected = mode === 'pick' ? picked : open
  const shown = foodIds.filter((id) => kind === null || foods[id].kind === kind)

  const tap = (id: FoodId) => {
    if (mode === 'pick') {
      if (correct === undefined) onPick?.(id)
    } else setOpen(id === open ? null : id)
  }
  const filter = (k: FoodKind | null) => {
    setKind(k)
    if (open && k && foods[open].kind !== k) setOpen(null)
  }
  const state = (id: FoodId) => {
    if (correct !== undefined) return id === correct ? ' is-right' : id === picked ? ' is-wrong' : ' is-dim'
    if (selected === null) return ''
    return id === selected ? ' is-selected' : ' is-dim'
  }
  // Names show for one kind at a time, or for the picked food, so the map isn't crowded.
  const named = (id: FoodId) => (mode === 'explore' ? kind !== null || id === open : correct !== undefined && (id === correct || id === picked))
  const card = mode === 'explore' && open ? foods[open] : undefined

  return (
    <figure className={`food-map food-${mode}`}>
      {mode === 'explore' && (
        <div className="food-kinds" role="group" aria-label={t('Kinds of food')}>
          <button type="button" className={kind === null ? 'is-on' : ''} aria-pressed={kind === null} onClick={() => filter(null)}>
            {t('Everything')}
          </button>
          {foodKinds.map((k) => (
            <button type="button" key={k} className={kind === k ? 'is-on' : ''} aria-pressed={kind === k} onClick={() => filter(k)}>
              <span className={`key-swatch key-${glyphOf[k]}`} aria-hidden="true" />
              {foodKindNames[k]}
            </button>
          ))}
        </div>
      )}
      <div className="map-frame">
        <LowlandsMap label={mode === 'pick' ? t('Map of the Low Countries with unnamed places to pick') : t('Map of the food and drink of the Low Countries')}>
          {shown.map((id, i) => {
            const f = foods[id]
            const [x, y] = lowlandsFrame.toXY(f.at)
            const left = f.at[0] < 4.3
            return (
              <g
                key={id}
                className={`food-mark hist-${glyphOf[f.kind]}${state(id)}`}
                data-food={id}
                transform={`translate(${x},${y})`}
                role="button"
                tabIndex={0}
                aria-label={mode === 'pick' && correct === undefined ? t('Place {n}', { n: i + 1 }) : f.name}
                aria-pressed={selected === id}
                onClick={() => tap(id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), tap(id))}
              >
                <circle r={13} className="food-hit" />
                <path d={foodGlyphs[glyphOf[f.kind]]} fillRule="evenodd" />
                {named(id) && (
                  <text x={left ? -10 : 10} y={4} textAnchor={left ? 'end' : 'start'} className="hist-site-label food-label">
                    {f.name}
                  </text>
                )}
              </g>
            )
          })}
        </LowlandsMap>
      </div>
      {mode === 'explore' && (
        <div className="food-card" aria-live="polite">
          {card && open ? (
            <>
              {card.photo && <Photo id={card.photo} className="photo food-photo" />}
              <p className="food-title">
                <span className={`key-swatch key-${glyphOf[card.kind]}`} aria-hidden="true" />
                {card.name}
                {card.own && card.own !== card.name && <span className="food-own"> · {card.own}</span>}
                {card.sound && <PlayButton id={card.sound} name={sound(card.sound).words} />}
              </p>
              <p className="food-place">{card.place}</p>
              <p className="food-about">{card.about}</p>
              {card.status && <p className="food-status">{card.status}</p>}
              {card.photo && (
                <p className="photo-credit">
                  Photo: <Credit id={card.photo} />
                </p>
              )}
            </>
          ) : (
            <p className="food-about">{t('Tap a mark to see what is eaten or drunk there. The buttons pick one kind at a time.')}</p>
          )}
        </div>
      )}
    </figure>
  )
}
