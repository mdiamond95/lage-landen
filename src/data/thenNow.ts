// Then and now (`{ kind: then-now }`): an old picture of a place and a photo of the same
// spot today, one over the other, wiped across by hand (src/art/ThenNow.tsx). Each side
// says when it shows and, as a CSS object-position, where to centre its photo so the two
// line up as well as they can. `place` and `text` say where it is and what changed; they
// stay hidden under a question until it is checked.

import type { PhotoId } from '../photos/ids'

export type ThenNowSide = { photo: PhotoId; when: string; position?: string }
export type ThenNowPair = { place: string; then: ThenNowSide; now: ThenNowSide; text: string; ratio?: string }

export const thenNows = {
  bruges: {
    place: 'The belfry on the Markt, Bruges',
    then: { photo: 'bruges-1890s', when: '1890s' },
    now: { photo: 'belfry-bruges-hall', when: 'Today' },
    ratio: '3 / 4',
    text: 'The eight-sided top was added from 1483 to 1487. Its wooden spire burned in 1493, and again in 1741, and was never rebuilt; the stone parapet on top dates from 1822.',
  },
  dam: {
    place: 'The town hall on the Dam, Amsterdam',
    then: { photo: 'dam-town-hall', when: '1672', position: '30% 45%' },
    now: { photo: 'dam-palace', when: 'Today', position: 'center 60%' },
    text: 'Gerrit Berckheyde painted the new town hall in 1672. The building has hardly changed, but since 1808 it has been a royal palace, and the Weigh House that stood in front of it was pulled down in 1808.',
  },
  'brussels-1695': {
    place: 'The Grand Place, Brussels',
    then: { photo: 'brussels-1695-ruins', when: '1695', position: '85% center' },
    now: { photo: 'brussels-hall-2015', when: 'Today', position: '65% center' },
    text: 'After the French bombardment of August 1695, only the town hall and a few walls stood. The guilds rebuilt their houses around it within a few years.',
  },
  rotterdam: {
    place: 'The Laurenskerk, Rotterdam',
    then: { photo: 'laurens-1940', when: '1940', position: '25% center' },
    now: { photo: 'laurens-today', when: 'Today', position: '30% center' },
    text: 'The bombing of 14 May 1940 burned out the old centre. The church of St Lawrence was left a shell; it was restored from 1952 to 1968, among the new buildings of a modern city.',
  },
  afsluitdijk: {
    place: 'The Afsluitdijk',
    then: { photo: 'sluitgat-1932', when: '1932' },
    now: { photo: 'afsluitdijk-today', when: 'Today' },
    text: 'On 28 May 1932 the last gap was closed and the Zuiderzee became a lake, the IJsselmeer. The dike is 32 km long, and the A7 motorway and a cycle path run along it.',
  },
  'antwerp-central': {
    place: 'Antwerp’s Central Station',
    then: { photo: 'antwerp-central-1905', when: '1905' },
    now: { photo: 'antwerp-central', when: 'Today' },
    text: 'Louis Delacenserie’s station opened in 1905. Its front and hall were kept when new platforms were dug below, so that since 2007 trains to the Netherlands pass straight through.',
  },
  ypres: {
    place: 'The Cloth Hall, Ypres',
    then: { photo: 'ypres-halls-1919', when: '1919', position: '35% center' },
    now: { photo: 'ypres-cloth-hall', when: 'Today', position: '70% center' },
    text: 'Four years of shelling left the belfry a broken stump. Ypres was rebuilt on its old plan, and the Cloth Hall was finished again in 1967.',
  },
  atomium: {
    place: 'The Atomium, Brussels',
    then: { photo: 'atomium-1957', when: '1957' },
    now: { photo: 'atomium', when: 'Today', position: 'center 30%' },
    text: 'Built for the world’s fair of 1958, Expo 58, and meant to stand only while the fair lasted. It is still there, its spheres reclad in steel in 2006.',
  },
  delft: {
    place: 'The south side of Delft, from across the harbour',
    then: { photo: 'view-delft', when: 'About 1660' },
    now: { photo: 'delft-today', when: 'Today' },
    text: 'Vermeer painted the Schiedam and Rotterdam gates, which were pulled down in 1836 and 1834. The tower of the Nieuwe Kerk still rises over the roofs, with a spire rebuilt in 1872.',
  },
  nuenen: {
    place: 'The Reformed church, Nuenen',
    then: { photo: 'vg-nuenen-church', when: '1884' },
    now: { photo: 'nuenen-church', when: 'Today' },
    ratio: '3 / 4',
    text: 'Van Gogh’s father preached in this little church. Vincent painted it in 1884 and added the churchgoers in 1885, after his father died. The church still stands.',
  },
} satisfies Record<string, ThenNowPair>

export type ThenNowId = keyof typeof thenNows
export const thenNowIds = Object.keys(thenNows) as [ThenNowId, ...ThenNowId[]]
