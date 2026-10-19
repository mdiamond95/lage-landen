// Ids live apart from the image imports so content tests can check them in Node.
export const photoIds = [
  'kinderdijk',
  'terp-hogebeintum',
  'polder-beemster',
  'afsluitdijk',
  'oosterscheldekering',
  'flood-1953-rilland',
  'flood-1953-map',
  'cruquius',
] as const
export type PhotoId = (typeof photoIds)[number]
