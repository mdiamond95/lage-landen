import { photo, type PhotoId } from '.'

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

// A large photo with its caption and credit underneath.
export function PhotoFigure({ id }: { id: PhotoId }) {
  const p = photo(id)
  return (
    <figure className="photo-figure">
      <Photo id={id} className="photo photo-large" />
      <figcaption>
        {p.caption} · <span className="photo-credit">Credit: <Credit id={id} /></span>
      </figcaption>
    </figure>
  )
}
