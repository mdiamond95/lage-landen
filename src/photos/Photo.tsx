import { photo, type PhotoId } from '.'
import { ZoomImage } from './ZoomImage'

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

export function Photo({ id, className }: { id: PhotoId; className?: string }) {
  const p = photo(id)
  return <img src={p.src} alt={p.alt} className={className ?? 'photo'} />
}

// A large photo with its caption and credit underneath. Paintings full of detail can
// be zoomed into. A Who am I? holds the credit back until it is answered, since a
// self-portrait's painter is the answer.
export function PhotoFigure({ id, hideCredit = false }: { id: PhotoId; hideCredit?: boolean }) {
  const p = photo(id)
  return (
    <figure className="photo-figure">
      {p.zoom ? <ZoomImage src={p.src} alt={p.alt} /> : <Photo id={id} className="photo photo-large" />}
      <figcaption>
        {p.caption} ·{' '}
        <span className="photo-credit">{hideCredit ? 'Credit shown once you answer' : <>Credit: <Credit id={id} /></>}</span>
      </figcaption>
    </figure>
  )
}
