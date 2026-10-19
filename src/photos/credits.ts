import type { PhotoId } from './ids'

export type Credit = {
  alt: string
  caption: string
  author: string
  licence: string
  licenceUrl: string
  // The file's page on Wikimedia Commons.
  source: string
}

const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(' ', '_'))}`
const BY_SA_4 = { licence: 'CC BY-SA 4.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' }
const BY_SA_3_NL = { licence: 'CC BY-SA 3.0 NL', licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/nl/deed.en' }
const CC0 = { licence: 'CC0 (public domain)', licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' }

export const credits: Record<PhotoId, Credit> = {
  kinderdijk: {
    alt: 'A row of brick windmills with sails along a canal at Kinderdijk',
    caption: 'The polder mills of Kinderdijk, built around 1740',
    author: 'Tarod',
    ...BY_SA_3_NL,
    source: commons('The windmills of Kinderdijk.JPG'),
  },
  'terp-hogebeintum': {
    alt: 'A village church on top of a high grassy mound, with a retaining wall where the mound was dug away',
    caption: 'The terp at Hogebeintum, Friesland, about 9 m high',
    author: 'Baykedevries',
    ...BY_SA_3_NL,
    source: commons('De terp Hogebeintum..JPG'),
  },
  'polder-beemster': {
    alt: 'Black-and-white aerial photo of long straight fields and roads in a regular grid',
    caption: 'The Beemster polder from the air, before 1940',
    author: 'Netherlands Institute of Military History (NIMH)',
    ...BY_SA_4,
    source: commons('NIMH - 2011 - 9034 - Aerial photograph of Midden-Beemster, The Netherlands.jpg'),
  },
  afsluitdijk: {
    alt: 'Black-and-white aerial photo of a long dam with open water on one side and fields on the other',
    caption: 'The Afsluitdijk from the air, before 1940',
    author: 'Netherlands Institute of Military History (NIMH)',
    ...BY_SA_4,
    source: commons('NIMH - 2155 005328 - Aerial photograph of Afsluitdijk, The Netherlands.jpg'),
  },
  oosterscheldekering: {
    alt: 'Tall concrete towers holding steel gates in a row across the water, beside a road',
    caption: 'The Oosterscheldekering storm surge barrier, Zeeland',
    author: 'Dietmar Rabich',
    ...BY_SA_4,
    source: commons('Vrouwenpolder (NL), Oosterscheldekering -- 2022 -- 5032.jpg'),
  },
  'flood-1953-rilland': {
    alt: 'Black-and-white aerial photo of a village with streets and fields under water',
    caption: 'Rilland, Zeeland, on 2 February 1953',
    author: 'Anefo / Nationaal Archief',
    ...CC0,
    source: commons('Watersnood 1953 Rilland, Bestanddeelnr 059-1219.jpg'),
  },
  'flood-1953-map': {
    alt: 'Map of the southwest Netherlands with the flooded areas of 1953 hatched, most of them in the Zeeland islands',
    caption: 'Areas flooded in 1953 (hatched)',
    author: 'Lencer',
    licence: 'CC BY-SA 2.5',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/2.5/',
    source: commons('Watersnood van 1953.png'),
  },
  cruquius: {
    alt: 'Old print of a round pumping station with a tall chimney beside a canal, cows in the foreground',
    caption: 'The Cruquius steam pumping station, Haarlemmermeer, in a 19th-century print',
    author: 'W. Hekking Jr., Rijksmuseum',
    ...CC0,
    source: commons('Stoomgemaal De Cruquius in Haarlemmermeer, RP-P-OB-28.402.jpg'),
  },
}
