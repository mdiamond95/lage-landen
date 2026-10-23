import { trees, type Person, type TreeId } from '../data/families'
import { t as tr } from '../i18n'

function Card({ person, hidden, role }: { person: Person; hidden: boolean; role: 'heir' | 'spouse' | 'sibling' }) {
  return (
    <div className={`tree-card tree-${person.house} tree-${role}${hidden ? ' tree-hidden' : ''}`}>
      <span className="tree-name">{hidden ? '?' : person.name}</span>
      <span className="tree-dates">{person.dates}</span>
      {person.note && !hidden && <span className="tree-note">{person.note}</span>}
    </div>
  )
}

// A family tree as one line of heirs, top to bottom. `hide` blanks out one person
// so a question can ask who belongs there.
export function FamilyTree({ tree, hide }: { tree: TreeId; hide?: string }) {
  const t = trees[tree]
  return (
    <figure className="family-tree" aria-label={tr('Family tree: {title}', { title: t.title })}>
      <figcaption className="tree-title">{t.title}</figcaption>
      <ol className="tree-gens">
        {t.generations.map((g) => (
          <li key={g.heir.id} className="tree-gen">
            <div className="tree-row">
              <Card person={g.heir} hidden={hide === g.heir.id} role="heir" />
              {g.spouse && (
                <>
                  <span className="tree-wed" aria-label={tr('married')}>⚭</span>
                  <Card person={g.spouse} hidden={hide === g.spouse.id} role="spouse" />
                </>
              )}
            </div>
            {g.sibling && <Card person={g.sibling} hidden={hide === g.sibling.id} role="sibling" />}
          </li>
        ))}
      </ol>
      <ul className="time-map-key tree-key" aria-label={tr('Key')}>
        {Object.entries(t.key).map(([house, text]) => (
          <li key={house}>
            <span className={`key-swatch key-${house}`} />
            {text}
          </li>
        ))}
      </ul>
    </figure>
  )
}
