import { photo, type PhotoId } from '.'
import { ZoomImage } from './ZoomImage'
import { t } from '../i18n'

export function Credit({ id }: { id: PhotoId }) {
  const p = photo(id)
  return (
    <>
      <a href={p.source} target="_blank" rel="noreferrer">
        {p.author}
      </a>
      ,{' '}
      <a href={p.licenceUrl} target="_blank" rel="noreferrer">
        {p.licence}
      </a>
    </>
  )
}

export function Photo({ id, className, lazy = false }: { id: PhotoId; className?: string; lazy?: boolean }) {
  const p = photo(id)
  return <img src={p.src} alt={p.alt} className={className ?? 'photo'} loading={lazy ? 'lazy' : undefined} />
}

// Shown in place of a picture's caption and credit while a question is open.
export function HeldBack() {
  return <span className="photo-credit caption-held">{t('Caption and credit shown once you answer')}</span>
}

// What a picture shows and who made it, for under the picture. In an open question both are
// held back (`hidden`): a caption, a painter's name or the file name in the link to Wikimedia
// Commons can each give the answer away. They appear once it is checked, and every credit is
// listed again at the end of the lesson.
export function PhotoCaption({ id, hidden = false, lead = '' }: { id: PhotoId; hidden?: boolean; lead?: string }) {
  if (hidden) return <HeldBack />
  return (
    <>
      {lead}
      {photo(id).caption} · <span className="photo-credit">{t('Credit:')} <Credit id={id} /></span>
    </>
  )
}

// A large photo with its caption and credit underneath. Paintings full of detail can
// be zoomed into.
export function PhotoFigure({ id, hideCaption = false }: { id: PhotoId; hideCaption?: boolean }) {
  const p = photo(id)
  return (
    <figure className="photo-figure">
      {p.zoom ? <ZoomImage src={p.src} alt={p.alt} /> : <Photo id={id} className="photo photo-large" />}
      <figcaption>
        <PhotoCaption id={id} hidden={hideCaption} />
      </figcaption>
    </figure>
  )
}
