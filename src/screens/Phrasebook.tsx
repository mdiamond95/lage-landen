import { useState } from 'react'
import { PhraseList } from '../art/PhraseCards'
import { allPhrases, phraseSetIds, phraseSets, type PhraseSetId } from '../data/phrases'

// The phrasebook on its own screen (Unit 20): 100 everyday phrases in ten sets, to browse
// or search, each with a recording or the device's voice.
export function Phrasebook({ onBack }: { onBack: () => void }) {
  const [set, setSet] = useState<PhraseSetId>('hello')
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const found = q ? allPhrases.filter((p) => `${p.say} ${p.means} ${p.note ?? ''}`.toLowerCase().includes(q)) : []

  return (
    <div className="phrasebook">
      <header className="lesson-top">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back to the course">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="time-travel-title">Phrasebook</h1>
      </header>
      <p className="muted time-travel-intro">{allPhrases.length} everyday phrases in Dutch, Flemish and Belgian French.</p>
      <label className="phrase-search">
        <span className="sr-only">Search the phrasebook</span>
        <input type="search" placeholder="Search, in English or Dutch" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      {q ? (
        found.length ? (
          <PhraseList phrases={found} lang="nl-NL" />
        ) : (
          <p className="muted phrase-empty">No phrase matches "{query}".</p>
        )
      ) : (
        <>
          <div className="phrase-tabs" role="tablist" aria-label="Phrase sets">
            {phraseSetIds.map((id) => (
              <button key={id} type="button" role="tab" aria-selected={id === set} className={id === set ? 'is-on' : ''} onClick={() => setSet(id)}>
                {phraseSets[id].title}
              </button>
            ))}
          </div>
          <PhraseList phrases={phraseSets[set].phrases} lang={phraseSets[set].lang} />
        </>
      )}
    </div>
  )
}
