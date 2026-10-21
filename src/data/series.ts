// A painter's road (`{ kind: series }`): one painter's pictures in the order they were
// made, on a slider, to watch a way of painting change. Unit 18 brought it in, for
// Van Gogh's ten years and Mondrian's road from a tree to a grid. `at` opens a series at
// one picture, by its index.

import type { PhotoId } from '../photos/ids'

export type SeriesStep = { photo: PhotoId; year: string; title: string; text: string }
export type Series = { painter: string; intro: string; steps: SeriesStep[] }

export const series = {
  'van-gogh': {
    painter: 'Vincent van Gogh',
    intro: 'Ten years, from a drawing in The Hague to a church at Auvers. Drag the slider and watch the colour come in.',
    steps: [
      {
        photo: 'vg-sorrow',
        year: '1882',
        title: 'Sorrow, The Hague',
        text: 'Black chalk on paper. In his first years Van Gogh mostly drew, and taught himself figures by drawing the poor of The Hague.',
      },
      {
        photo: 'vg-nuenen-church',
        year: '1884 to 1885',
        title: 'Leaving church in Nuenen',
        text: 'Browns and greys, the colours of the Hague School painters. He painted it for his mother, and added the churchgoers after his father died.',
      },
      {
        photo: 'vg-bible',
        year: '1885',
        title: 'Still life with Bible, Nuenen',
        text: 'Still dark and heavy, but a bright yellow book has crept in.',
      },
      {
        photo: 'vg-pipe',
        year: '1886',
        title: 'Self-portrait with a pipe, Paris',
        text: 'His first months in Paris. The palette is still the dark one he brought from Brabant.',
      },
      {
        photo: 'vg-plum',
        year: '1887',
        title: 'Flowering plum orchard, after Hiroshige, Paris',
        text: 'Japanese prints and the Paris painters have opened his eyes: flat, bright colour and strong outlines.',
      },
      {
        photo: 'vg-yellow-house',
        year: '1888',
        title: 'The Yellow House, Arles',
        text: 'The south: a yellow house under a deep blue sky, colours set side by side at full strength.',
      },
      {
        photo: 'vg-irises',
        year: '1889',
        title: 'Irises, Saint-Rémy',
        text: 'Painted in the garden of the asylum in his first week there. Outlines and flat colour, like a Japanese print.',
      },
      {
        photo: 'vg-auvers-church',
        year: '1890',
        title: 'The church at Auvers',
        text: 'Weeks before his death: a church that seems to move, under a sky of dark blue strokes.',
      },
    ],
  },
  mondrian: {
    painter: 'Piet Mondrian',
    intro: 'From a tree at dusk to a grid of coloured blocks, in 35 years. Drag the slider and watch the tree turn into lines.',
    steps: [
      {
        photo: 'mondrian-red-tree',
        year: '1908 to 1910',
        title: 'Evening: the red tree',
        text: 'A real tree, painted in hot red against blue, the two colours fighting. Mondriaan had seen Van Gogh’s work in Amsterdam.',
      },
      {
        photo: 'mondrian-grey-tree',
        year: '1911',
        title: 'Grey tree',
        text: 'The colour has gone, and the branches have become a net of curving black lines.',
      },
      {
        photo: 'mondrian-apple',
        year: '1912',
        title: 'Flowering apple tree',
        text: 'Painted after he saw the Cubists in Paris. Can you still find the tree? Only short curves and crossings are left.',
      },
      {
        photo: 'mondrian-pier',
        year: '1915',
        title: 'Composition 10: pier and ocean',
        text: 'A pier running out into the sea, turned into little plus and minus signs.',
      },
      {
        photo: 'mondrian-1921',
        year: '1921',
        title: 'Tableau I',
        text: 'Back in Paris: only straight black lines, white and grey planes, and red, yellow and blue.',
      },
      {
        photo: 'mondrian-1930',
        year: '1930',
        title: 'Composition II with red, blue and yellow',
        text: 'One big red square holds the picture in balance against two small patches of blue and yellow.',
      },
      {
        photo: 'mondrian-broadway',
        year: '1942 to 1943',
        title: 'Broadway Boogie Woogie, New York',
        text: 'In New York the black lines go and the grid fills with little coloured blocks, like taxis in the streets or the beat of boogie-woogie jazz.',
      },
      {
        photo: 'mondrian-victory',
        year: '1942 to 1944',
        title: 'Victory Boogie Woogie',
        text: 'Turned on its point and left unfinished at his death, with coloured tape still stuck on the canvas.',
      },
    ],
  },
} satisfies Record<string, Series>

export type SeriesId = keyof typeof series
export const seriesIds = Object.keys(series) as [SeriesId, ...SeriesId[]]
