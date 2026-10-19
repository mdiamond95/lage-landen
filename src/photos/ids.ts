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
  // Unit 2
  'ambiorix-statue',
  'claudius-civilis',
  'deurne-helmet',
  'tongeren-wall',
  'heerlen-thermen',
  'nehalennia-altar',
  'peutinger-map',
  'childeric-bees',
  'clovis-baptism',
  'dorestad-brooch',
  'boniface-fulda',
  'aachen-chapel',
  'charlemagne-durer',
  'utrecht-psalter',
] as const
export type PhotoId = (typeof photoIds)[number]
