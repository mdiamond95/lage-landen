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
const BY_4 = { licence: 'CC BY 4.0', licenceUrl: 'https://creativecommons.org/licenses/by/4.0/' }
const BY_SA_2 = { licence: 'CC BY-SA 2.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/2.0/' }
const BY_SA_3 = { licence: 'CC BY-SA 3.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/' }
// Old artworks whose copyright has long expired; Commons marks them public domain.
const PD = { licence: 'Public domain', licenceUrl: 'https://creativecommons.org/publicdomain/mark/1.0/' }

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

  // Unit 2
  'ambiorix-statue': {
    alt: 'Bronze statue of a long-haired warrior with a winged helmet and an axe, on a stone pedestal in a town square',
    caption: 'Statue of Ambiorix by Jules Bertin (1866), Grote Markt, Tongeren',
    author: 'Trougnouf (Benoit Brummer)',
    ...BY_4,
    source: commons('Ambiorix statue on the Grote Markt of Tongeren (DSCF4344).jpg'),
  },
  'claudius-civilis': {
    alt: 'Dark painting of men around a glowing table raising swords together, a large crowned figure in the middle',
    caption: 'Rembrandt, The Conspiracy of the Batavians under Claudius Civilis (1661 to 1662), Nationalmuseum, Stockholm',
    author: 'Rembrandt van Rijn; photo Nationalmuseum',
    ...PD,
    source: commons('The Conspiracy of the Batavians under Claudius Civilis (Rembrandt Harmensz. van Rijn) - Nationalmuseum - 17581.jpg'),
  },
  'deurne-helmet': {
    alt: 'A gilded helmet with a ridge over the top, a neck guard and cheek pieces, studded with glass stones',
    caption: 'The Deurne helmet, about 320 CE, Rijksmuseum van Oudheden, Leiden',
    author: 'Michiel (Flickr)',
    ...BY_SA_2,
    source: commons('Roman cavalry helmet of Deurne.jpg'),
  },
  'tongeren-wall': {
    alt: 'A long, low ruined wall of rough grey stones on a grassy bank beside a road',
    caption: 'The Roman town wall of Tongeren, 2nd century',
    author: 'Romaine',
    ...CC0,
    source: commons('Tongeren-Romeinse muur (04).JPG'),
  },
  'heerlen-thermen': {
    alt: 'Low brick and stone foundations of rooms laid out under a big modern roof',
    caption: 'Remains of the Roman baths of Coriovallum, Thermenmuseum, Heerlen',
    author: 'Romaine',
    ...CC0,
    source: commons('Heerlen-Thermenmuseum (8).jpg'),
  },
  'nehalennia-altar': {
    alt: 'A stone altar carved with a dog on one side, a basket of fruit on the other, and a Latin inscription',
    caption: 'Altar to Nehalennia set up by Placidus, a trader with Britain, Rijksmuseum van Oudheden, Leiden',
    author: 'Ben Pirard',
    ...BY_SA_3,
    source: commons('Leiden-Nehalennia-Placidus.JPG'),
  },
  'peutinger-map': {
    alt: 'Engraved strip map crowded with place names, wavy rivers, thin road lines and small buildings for towns, with FRANCIA written along the top',
    caption: 'The first segment of the Peutinger Map, "from the mouths of the Rhine to Bonn", in an edition printed in Antwerp in 1598',
    author: 'Johannes Moretus, Antwerp; National Library of Israel',
    ...PD,
    source: commons('Ioannes Moretvs Typographus, Tabula itineraria ex illustri Peutingerorum bibliotheca qvae Avgustae Vindel. est beneficio Marci Velseri (FL7330888 2368870).jpg'),
  },
  'childeric-bees': {
    alt: 'Two small gold insects with wings inlaid with red garnets',
    caption: "Two of Childeric's golden bees, Bibliothèque nationale de France, Paris",
    author: 'Unknown, Bibliothèque nationale de France (Gallica)',
    ...PD,
    source: commons('Abeilles de Childéric Ier.jpg'),
  },
  'clovis-baptism': {
    alt: 'Painting of a bishop pouring water over a man standing in a stone font, surrounded by a crowd in a church',
    caption: 'Master of Saint Giles, The Baptism of Clovis, about 1500, National Gallery of Art, Washington',
    author: 'Master of Saint Giles; National Gallery of Art',
    ...CC0,
    source: commons('Master of Saint Giles, The Baptism of Clovis, c. 1500, NGA 41597.jpg'),
  },
  'dorestad-brooch': {
    alt: 'A round gold brooch covered in red, blue and white inlays and pearls, with a large red stone in the middle',
    caption: 'The Dorestad brooch, about 800, Rijksmuseum van Oudheden, Leiden',
    author: 'Brian92828',
    ...BY_4,
    source: commons('FibulavanDorestad.jpg'),
  },
  'boniface-fulda': {
    alt: 'Two painted scenes in a decorated border: above, a bishop baptising a man in a font; below, a bishop holding up a book as a soldier strikes',
    caption: 'Boniface baptising (top) and his death (bottom), Fulda sacramentary, 11th century',
    author: 'Unknown illuminator, Fulda',
    ...PD,
    source: commons('St Boniface - Baptising-Martyrdom - Sacramentary of Fulda - 11Century.jpg'),
  },
  'aachen-chapel': {
    alt: 'Inside an eight-sided chapel: round arches with striped stone, two storeys of columns and a gold mosaic dome',
    caption: "Charlemagne's palace chapel, built around 800, now the core of Aachen Cathedral",
    author: 'Traveler100',
    ...BY_SA_3,
    source: commons('Aachen-dom-oktogon-s1.jpg'),
  },
  'charlemagne-durer': {
    alt: 'Painting of a bearded emperor in a crown and gold robes holding a sword and an orb',
    caption: 'Albrecht Dürer, Emperor Charlemagne, about 1512 to 1513, Germanisches Nationalmuseum, Nuremberg',
    author: 'Albrecht Dürer',
    ...PD,
    source: commons('Albrecht Dürer - Emperor Charlemagne.jpg'),
  },
  'utrecht-psalter': {
    alt: 'Pen drawing of a king enthroned under a porch with guards, a man raising his arms on a hillside, and groups of seated figures beside Christ in an oval of light',
    caption: 'Detail from the Utrecht Psalter, made near Reims about 830, Utrecht University Library',
    author: 'Unknown artist, Reims',
    ...PD,
    source: commons('Utrecht psalter (salterio di utrecht), utrecht Bibliothek der Rijksuniversiteit, Ms.32 f.30 r., 820-830 circa.jpg'),
  },
}
