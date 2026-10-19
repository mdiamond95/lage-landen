import afsluitdijk from './afsluitdijk.jpg'
import cruquius from './cruquius.jpg'
import flood1953Map from './flood-1953-map.jpg'
import flood1953Rilland from './flood-1953-rilland.jpg'
import kinderdijk from './kinderdijk.jpg'
import oosterscheldekering from './oosterscheldekering.jpg'
import polderBeemster from './polder-beemster.jpg'
import terpHogebeintum from './terp-hogebeintum.jpg'
import { credits } from './credits'
import type { PhotoId } from './ids'

export type { PhotoId } from './ids'

// Photos and maps from Wikimedia Commons, resized to 880 px and bundled with the app.
// Credits (author, licence, source page) live in credits.ts so tests can check them.
const files: Record<PhotoId, string> = {
  kinderdijk,
  'terp-hogebeintum': terpHogebeintum,
  'polder-beemster': polderBeemster,
  afsluitdijk,
  oosterscheldekering,
  'flood-1953-rilland': flood1953Rilland,
  'flood-1953-map': flood1953Map,
  cruquius,
}

export const photo = (id: PhotoId) => ({ src: files[id], ...credits[id] })
