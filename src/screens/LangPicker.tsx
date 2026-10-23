import { langNames, langs, setLang, t, useLang, type Lang } from '../i18n'

// The interface language: English, Dutch or French, short in the top bar (EN, NL, FR).
// Lessons stay in English.
export function LangPicker() {
  const lang = useLang()
  return (
    <label className="lang-picker" title={t('Interface language')}>
      <span className="sr-only">{t('Interface language')}</span>
      <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
        {langs.map((l) => (
          <option key={l} value={l} lang={l} label={l.toUpperCase()} title={langNames[l]}>
            {langNames[l]}
          </option>
        ))}
      </select>
    </label>
  )
}
