// Building fronts (`{ kind: facade }`, Unit 19): a photo of a building with its parts named on
// hotspots, the way a guide points them out from across the street. Each spot's `at` is the
// hotspot, [x, y] as fractions of the photo, and its `box` [left, top, width, height] the part
// the photo glides to; `side` puts the hotspot's label to the left of it, away from the edge.
// A question can open a front zoomed in on one part with `focus`.

import type { PhotoId } from '../photos/ids'

type Box = [number, number, number, number]
export type FacadeSpot = { id: string; label: string; text: string; at: [number, number]; box: Box; side?: 'left' | 'right' }
export type Facade = { photo: PhotoId; intro: string; spots: FacadeSpot[] }

export const facades = {
  'bruges-belfry': {
    photo: 'belfry-bruges-hall',
    intro:
      'The market hall and belfry of Bruges, on the Markt. The hall was where cloth and other goods were sold; the tower held the bells and the town’s treasures. Tap a part, or walk along the front.',
    spots: [
      {
        id: 'hall',
        label: 'Market hall',
        text: 'The hall wraps around an inner courtyard. Merchants sold cloth and other goods in it, at the heart of one of the richest trading towns of medieval Europe.',
        at: [0.2, 0.74],
        box: [0.03, 0.64, 0.46, 0.26],
      },
      {
        id: 'gate',
        label: 'Gateway',
        text: 'Through the gate under the tower lies the courtyard of the hall, and the stair to the top: 366 narrow steps.',
        at: [0.49, 0.89],
        box: [0.4, 0.82, 0.18, 0.12],
      },
      {
        id: 'tower',
        label: 'Square tower',
        text: 'The square lower part of the tower was begun around 1240. Inside it was the treasury, where the town kept its charters, its seals and its money.',
        at: [0.62, 0.58],
        box: [0.32, 0.46, 0.36, 0.3],
      },
      {
        id: 'octagon',
        label: 'Eight-sided top',
        text: 'The eight-sided top was added from 1483 to 1487. The whole tower is 83 metres tall, and leans 87 centimetres to the east.',
        at: [0.6, 0.2],
        box: [0.34, 0.08, 0.3, 0.3],
      },
    ],
  },
  'canal-house': {
    photo: 'canal-house',
    intro:
      'A house on the Lindengracht in Amsterdam, three windows wide, and tall and narrow like most canal houses. Read it from the top down. Tap a part, or walk along the front.',
    spots: [
      {
        id: 'gable',
        label: 'Bell gable',
        text: 'The top of the front is shaped like a bell, edged in white stone with scrolls at its sides. Bell gables were built in Amsterdam from about 1660 to 1790. The gable hides an ordinary pointed roof behind it.',
        at: [0.4, 0.07],
        box: [0.28, 0.0, 0.44, 0.25],
        side: 'left',
      },
      {
        id: 'hoist',
        label: 'Hoisting beam',
        text: 'Under the little hood at the very top a beam sticks out. With a rope and a pulley on it, goods and furniture went up the front and in through the windows, because the stairs inside are steep and narrow.',
        at: [0.56, 0.08],
        box: [0.46, 0.02, 0.16, 0.12],
      },
      {
        id: 'anchors',
        label: 'Wall anchors',
        text: 'The small iron pieces in the brick are wall anchors. They tie the front to the wooden beams of the floors inside, so the tall, thin wall cannot fall outwards.',
        at: [0.35, 0.3],
        box: [0.28, 0.22, 0.16, 0.16],
        side: 'left',
      },
      {
        id: 'windows',
        label: 'Sash windows',
        text: 'The tall windows slide up and down, with many small panes. Glass was expensive, and a front full of windows showed what its owner could afford. The windows get smaller towards the top.',
        at: [0.5, 0.47],
        box: [0.32, 0.36, 0.38, 0.18],
        side: 'left',
      },
      {
        id: 'door',
        label: 'Front door',
        text: 'The door sits up a few steps, in a white frame. Many canal houses have a basement half below the street, with its own door under the steps.',
        at: [0.68, 0.86],
        box: [0.56, 0.7, 0.24, 0.3],
      },
      {
        id: 'cornice',
        label: 'A cornice next door',
        text: 'The house next door has no gable at all, just a straight cornice along the top. In the 1700s and 1800s that was the fashion, and many gables were replaced by one.',
        at: [0.86, 0.37],
        box: [0.68, 0.3, 0.32, 0.18],
        side: 'left',
      },
    ],
  },
  tassel: {
    photo: 'tassel-front',
    intro:
      'The Hôtel Tassel, in Brussels, finished in 1893. At first sight it is a stone town house like its neighbours. Look closer. Tap a part, or walk along the front.',
    spots: [
      {
        id: 'bay',
        label: 'Bay window',
        text: 'The middle of the front swells out into a curved bay of glass, framed in slender iron, two storeys high. Horta let the iron show instead of hiding it in stone.',
        at: [0.5, 0.42],
        box: [0.32, 0.34, 0.38, 0.28],
      },
      {
        id: 'railing',
        label: 'Iron railing',
        text: 'The railing of the balcony curls and twists like a climbing plant. These lines, which snap back like a whip, are called whiplash lines, the signature of Art Nouveau.',
        at: [0.62, 0.55],
        box: [0.32, 0.48, 0.38, 0.12],
      },
      {
        id: 'curves',
        label: 'Bending stone',
        text: 'Even the stone bends. The moulding beside the top balcony sweeps out and down like a stem, instead of running in a straight line.',
        at: [0.36, 0.33],
        box: [0.18, 0.25, 0.26, 0.14],
        side: 'left',
      },
      {
        id: 'top',
        label: 'Top floor',
        text: 'The top floor has its own balcony and a row of windows under the deep eaves. Inside, the rooms open into each other around a stair lit from above.',
        at: [0.58, 0.24],
        box: [0.32, 0.17, 0.38, 0.16],
      },
      {
        id: 'door',
        label: 'Front door',
        text: 'The door sits in a stone frame that seems to grow out of the wall. Inside it, a hall with a mosaic floor of curling lines leads to the famous stair.',
        at: [0.5, 0.86],
        box: [0.36, 0.74, 0.28, 0.24],
      },
    ],
  },
  schroder: {
    photo: 'schroder-house',
    intro:
      'The Rietveld Schröder House in Utrecht, 1924. It looks like a painting by Mondrian built in three dimensions: flat planes, straight lines, grey, white and the primary colours. Tap a part, or walk along it.',
    spots: [
      {
        id: 'planes',
        label: 'Floating planes',
        text: 'The white panel in front of the balcony seems to float in the air. Rietveld built the house as flat planes that slide past each other, never quite closing into a box.',
        at: [0.32, 0.54],
        box: [0.24, 0.42, 0.22, 0.22],
        side: 'left',
      },
      {
        id: 'upstairs',
        label: 'Upper floor',
        text: 'The upper floor, behind the big windows, is where the family lived: one open space, flooded with light.',
        at: [0.38, 0.38],
        box: [0.22, 0.28, 0.36, 0.24],
        side: 'left',
      },
      {
        id: 'roof',
        label: 'Jutting roof',
        text: 'The flat roof juts out over the corner on its own, like a lid lifted off the house.',
        at: [0.66, 0.33],
        box: [0.52, 0.28, 0.2, 0.1],
      },
      {
        id: 'colours',
        label: 'Primary colours',
        text: 'A red beam here, a yellow post at the far end: lines in the primary colours of De Stijl pick out the joints between the planes.',
        at: [0.6, 0.43],
        box: [0.52, 0.36, 0.16, 0.12],
      },
      {
        id: 'skylight',
        label: 'Roof light',
        text: 'A little glass box on the roof lights the stair below it, in the middle of the house.',
        at: [0.38, 0.22],
        box: [0.32, 0.18, 0.12, 0.08],
      },
    ],
  },
  'dam-town-hall': {
    photo: 'dam-town-hall',
    intro:
      'The new town hall on the Dam, as Gerrit Berckheyde painted it in 1672: a palace of stone for a city of merchants, now the Royal Palace. Tap a part, or walk along the front.',
    spots: [
      {
        id: 'arches',
        label: 'Seven arches',
        text: 'There is no grand doorway, only seven small arches. They are often said to stand for the seven provinces of the Republic, but nothing from the time it was built says so.',
        at: [0.45, 0.74],
        box: [0.32, 0.67, 0.27, 0.11],
      },
      {
        id: 'orders',
        label: 'Flat columns',
        text: 'Two rows of pilasters, columns flat against the wall, stand one above the other, as on the buildings of ancient Rome. This calm, regular style is called Dutch classicism.',
        at: [0.2, 0.56],
        box: [0.04, 0.46, 0.3, 0.3],
        side: 'left',
      },
      {
        id: 'pediment',
        label: 'Pediment',
        text: 'The triangle over the middle is filled with sculpture by Artus Quellinus and his workshop, who also carved the marble halls inside.',
        at: [0.56, 0.44],
        box: [0.32, 0.37, 0.28, 0.11],
      },
      {
        id: 'dome',
        label: 'Domed tower',
        text: 'A high dome rises over the middle. From up there a lookout could see far over the city and the IJ.',
        at: [0.48, 0.27],
        box: [0.34, 0.18, 0.16, 0.22],
      },
      {
        id: 'church',
        label: 'Nieuwe Kerk',
        text: 'Next door stands the Gothic Nieuwe Kerk, begun around 1400. Side by side, the two show how far taste had moved in 250 years.',
        at: [0.86, 0.5],
        box: [0.74, 0.25, 0.26, 0.5],
        side: 'left',
      },
    ],
  },
  'gouda-waag': {
    photo: 'gouda-waag',
    intro:
      'The front of the Waag, the weigh house of Gouda, finished in 1668. Farmers brought their cheese here to be weighed, and paid the town a fee for every weighing. Tap a part, or walk along the front.',
    spots: [
      {
        id: 'relief',
        label: 'The relief',
        text: 'Bartholomeus Eggers carved what went on inside: a stack of cheeses waiting their turn, a man writing down the weight at a table, and the buyer and seller looking on.',
        at: [0.42, 0.7],
        box: [0.36, 0.45, 0.27, 0.4],
        side: 'left',
      },
      {
        id: 'scale',
        label: 'The scale',
        text: 'A great balance hangs from a beam, with cheeses on one pan and weights on the other. The town kept the scales and the weights, so buyer and seller could trust the result.',
        at: [0.5, 0.33],
        box: [0.38, 0.14, 0.24, 0.4],
      },
      {
        id: 'arms',
        label: 'Coats of arms',
        text: 'Four coats of arms, of the four burgomasters who ran Gouda when the weigh house was built.',
        at: [0.28, 0.38],
        box: [0.0, 0.18, 0.34, 0.4],
      },
      {
        id: 'date',
        label: '1668',
        text: 'The year it was finished. The architect was Pieter Post, who also designed the weigh house of Leiden and the palace of Huis ten Bosch in The Hague.',
        at: [0.49, 0.95],
        box: [0.4, 0.84, 0.18, 0.16],
        side: 'left',
      },
    ],
  },
} satisfies Record<string, Facade>

export type FacadeId = keyof typeof facades
export const facadeIds = Object.keys(facades) as [FacadeId, ...FacadeId[]]
