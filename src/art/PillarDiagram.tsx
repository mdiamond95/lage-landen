import { useState } from 'react'
import { pillars, rowIds, rowNames, type PillarId } from '../data/pillars'

// The pillars of Dutch society: four columns under one roof, where only the leaders
// met. Tap a pillar's name to bring it forward. `hide` blanks one cell ("socialist.radio")
// so a question can ask what belongs there; `only` shows a single row.
export function PillarDiagram({ hide, only }: { hide?: string; only?: (typeof rowIds)[number] }) {
  const [focus, setFocus] = useState<PillarId | null>(null)
  const rows = only ? [only] : rowIds

  return (
    <figure className="pillars" aria-label="Diagram: the four pillars of Dutch society, about 1930">
      <figcaption className="tree-title">The pillars of Dutch society, about 1930</figcaption>
      <div className="pillars-roof">
        <span>The state: the pillars' leaders meet at the top</span>
      </div>
      <div className="pillars-cols">
        {pillars.map((p) => (
          <div key={p.id} className={`pillar pillar-${p.id}${focus && focus !== p.id ? ' pillar-dim' : ''}`}>
            <button
              type="button"
              className="pillar-head"
              aria-pressed={focus === p.id}
              onClick={() => setFocus(focus === p.id ? null : p.id)}
            >
              {p.name}
            </button>
            <ul className="pillar-cells">
              {rows.map((r) => {
                const hidden = hide === `${p.id}.${r}`
                const cell = p.rows[r]
                return (
                  <li key={r} className={`pillar-cell${hidden ? ' pillar-hidden' : ''}`}>
                    <span className="pillar-row">{rowNames[r]}</span>
                    <span className="pillar-name">{hidden ? '?' : cell.name}</span>
                    {cell.note && !hidden && <span className="pillar-note">{cell.note}</span>}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="pillars-base">Dutch society</div>
    </figure>
  )
}
