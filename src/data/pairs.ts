// Paintings side by side (`{ kind: pair }`): two pictures of the same kind of thing by two
// painters, and a few ways of looking at them. Unit 17 brought them in; Unit 16 compares
// Bosch with Bruegel. Each way of looking has a box on each painting, [left, top, width,
// height] as fractions of the picture, the same as a painting tour's stops; picking it
// glides both paintings to their box. A question can open a pair on one look with `focus`.

import type { PhotoId } from '../photos/ids'

type Box = [number, number, number, number]
export type PairSide = { photo: PhotoId; title: string }
export type PairLook = { id: string; title: string; text: string; boxes: [Box, Box] }
export type Pair = { left: PairSide; right: PairSide; intro: string; looks: PairLook[] }

export const pairs = {
  'second-bosch': {
    left: { photo: 'garden-delights', title: 'Bosch, about 1490 to 1510' },
    right: { photo: 'big-fish', title: 'Bruegel, 1556' },
    intro:
      'Bosch died in 1516, but buyers in Antwerp still wanted his monsters forty years later. On the left, his Garden of Earthly Delights; on the right, the drawing the young Bruegel made for a print. Pick a way of looking.',
    looks: [
      {
        id: 'creatures',
        title: 'Strange creatures',
        text: 'Bosch fills his hell with creatures nobody had ever seen: a pair of ears pushing a blade, a man whose body is a broken egg. Bruegel plays the same game: a fish walks off on human legs with another fish in its mouth, and one flies through the sky.',
        boxes: [
          [0.78, 0.2, 0.2, 0.32],
          [0.83, 0.26, 0.14, 0.2],
        ],
      },
      {
        id: 'knife',
        title: 'The knife',
        text: 'Both have a giant knife. Bosch’s cuts between two ears in hell. Bruegel’s slits open the belly of a stranded fish, and out spill the fish it swallowed, each with a smaller one in its mouth.',
        boxes: [
          [0.8, 0.24, 0.09, 0.1],
          [0.6, 0.42, 0.22, 0.2],
        ],
      },
      {
        id: 'meaning',
        title: 'The meaning',
        text: 'Nobody knows for sure what Bosch’s garden of naked lovers means, and historians still argue. Bruegel’s drawing says it plainly: in the boat, a father shows his son the old proverb that the big fish eat the little ones, the powerful eat the poor.',
        boxes: [
          [0.27, 0.58, 0.46, 0.4],
          [0.48, 0.72, 0.45, 0.22],
        ],
      },
    ],
  },
  calling: {
    left: { photo: 'caravaggio-calling', title: 'Caravaggio, Rome, 1599 to 1600' },
    right: { photo: 'brugghen-calling', title: 'Ter Brugghen, Utrecht, 1621' },
    intro:
      'Christ calls the tax collector Matthew to follow him. Caravaggio painted it for a chapel in Rome; Ter Brugghen saw it there, and painted the story again at home in Utrecht. Pick a way of looking.',
    looks: [
      {
        id: 'light',
        title: 'The light',
        text: 'Caravaggio’s light falls in a hard slanting beam from high on the right, above Christ’s hand, and picks out the faces at the table against a dark wall. Ter Brugghen’s light comes from the left. It is softer and cooler, and it falls on a few big figures pressed close to you.',
        boxes: [
          [0.28, 0.28, 0.65, 0.3],
          [0.3, 0.05, 0.55, 0.4],
        ],
      },
      {
        id: 'matthew',
        title: 'The tax collectors',
        text: 'Caravaggio’s tax collectors sit at a table in the gloom with their coins, some looking up, one not. Ter Brugghen brings his so close that they fill the frame, with money and a ledger under their hands. Look at the hands: who is being called?',
        boxes: [
          [0.18, 0.4, 0.27, 0.27],
          [0.45, 0.13, 0.25, 0.45],
        ],
      },
      {
        id: 'christ',
        title: 'Christ',
        text: 'Caravaggio’s Christ stands at the right, half hidden behind Saint Peter, with only his face and his pointing hand in the light. Ter Brugghen’s Christ is at the left edge, seen from the side, his hand reaching in.',
        boxes: [
          [0.62, 0.33, 0.33, 0.2],
          [0, 0.05, 0.46, 0.5],
        ],
      },
    ],
  },
  descent: {
    left: { photo: 'rubens-descent', title: 'Rubens, Antwerp, 1612 to 1614' },
    right: { photo: 'rembrandt-descent', title: 'Rembrandt, about 1633' },
    intro:
      'Christ’s body is lowered from the cross. Rubens painted it as a great altarpiece for Antwerp Cathedral; Rembrandt painted it twenty years later, much smaller, for the prince of Orange. Pick a way of looking.',
    looks: [
      {
        id: 'light',
        title: 'The light',
        text: 'Rubens’s scene is bright and clear from corner to corner, with Saint John in a blaze of red. Rembrandt’s is night. One pool of light falls on the body and the white sheet, and the rest sink into shadow.',
        boxes: [
          [0.25, 0.15, 0.55, 0.5],
          [0.1, 0.2, 0.8, 0.65],
        ],
      },
      {
        id: 'ladder',
        title: 'The helpers',
        text: 'Rubens’s helpers are strong and handsome, like ancient statues; one workman at the top even holds the sheet in his teeth. Rembrandt’s are ordinary men, clumsy and straining under the weight.',
        boxes: [
          [0.15, 0.02, 0.45, 0.27],
          [0.33, 0.33, 0.2, 0.22],
        ],
      },
      {
        id: 'body',
        title: 'The body',
        text: 'Rubens’s Christ is a hero even in death, a long, beautiful body sliding down the white sheet. Rembrandt’s hangs heavy and awkward, a real dead man, thin and broken.',
        boxes: [
          [0.4, 0.28, 0.3, 0.32],
          [0.38, 0.4, 0.2, 0.3],
        ],
      },
    ],
  },
  regents: {
    left: { photo: 'syndics', title: 'Rembrandt, 1662' },
    right: { photo: 'regentesses', title: 'Frans Hals, about 1664' },
    intro:
      'Governors of a city institution, painted for the room where they met. Rembrandt painted the syndics of the Amsterdam cloth makers’ guild; Frans Hals, past eighty, the women who ran the old men’s home in Haarlem. Pick a way of looking.',
    looks: [
      {
        id: 'faces',
        title: 'The faces',
        text: 'Rembrandt’s men look up at you all at once, as if you had just come in. Hals’s women look past you, stiff and pale, painted in a few quick strokes each.',
        boxes: [
          [0.2, 0.22, 0.6, 0.35],
          [0.05, 0.25, 0.65, 0.35],
        ],
      },
      {
        id: 'hands',
        title: 'The hands',
        text: 'Rembrandt’s hands rest on the book and the rich carpet on the table. Hals painted his with a few bare, slashing strokes; up close they barely hold together, and from a step back they are bony, old hands.',
        boxes: [
          [0.35, 0.62, 0.35, 0.15],
          [0.25, 0.55, 0.25, 0.2],
        ],
      },
      {
        id: 'standing',
        title: 'Who is standing?',
        text: 'One syndic is half out of his chair, caught in the middle of a movement. In Hals’s painting the only one standing is the maid at the right, coming in at the back.',
        boxes: [
          [0.22, 0.22, 0.2, 0.5],
          [0.78, 0.12, 0.2, 0.3],
        ],
      },
    ],
  },
  street: {
    left: { photo: 'little-street', title: 'Vermeer, about 1658' },
    right: { photo: 'hooch-courtyard', title: 'Pieter de Hooch, 1658' },
    intro:
      'Two painters, the same town, the same years: ordinary Delft houses, with women at work. Pick a way of looking.',
    looks: [
      {
        id: 'passage',
        title: 'The passage',
        text: 'Both painters show a passage through to the back of a house. Look at how far each one lets you see.',
        boxes: [
          [0.34, 0.68, 0.16, 0.22],
          [0.1, 0.25, 0.3, 0.45],
        ],
      },
      {
        id: 'women',
        title: 'The women',
        text: 'Vermeer’s women are small and busy, one sewing in a doorway, one bent over a barrel. De Hooch’s woman and child stand in the courtyard, close to you, at the heart of the picture.',
        boxes: [
          [0.74, 0.7, 0.18, 0.2],
          [0.44, 0.38, 0.3, 0.4],
        ],
      },
      {
        id: 'brick',
        title: 'The brick',
        text: 'Vermeer paints every crack and patch of the old brick and whitewash, in small dabs of paint. De Hooch’s brick is neat, its lines drawn straight to lead your eye deep into the picture.',
        boxes: [
          [0.48, 0.38, 0.3, 0.15],
          [0.05, 0.2, 0.4, 0.15],
        ],
      },
    ],
  },
  'still-life': {
    left: { photo: 'heda-goblet', title: 'Willem Claesz Heda, 1635' },
    right: { photo: 'kalf-pronk', title: 'Willem Kalf, 1678' },
    intro:
      'Two tables of fine things, forty years apart: Heda’s in Haarlem, Kalf’s in Amsterdam. Pick a way of looking.',
    looks: [
      {
        id: 'lemon',
        title: 'The fruit',
        text: 'Heda peels a lemon in a long spiral that hangs over the edge of the table. Kalf cuts open a peach in a bowl of Chinese porcelain. Look at the pith, the fuzz and the wet flesh.',
        boxes: [
          [0.84, 0.6, 0.12, 0.24],
          [0.56, 0.56, 0.4, 0.2],
        ],
      },
      {
        id: 'cups',
        title: 'The cups',
        text: 'Heda’s gilt goblet and glass stand among pewter and silver, nearly all grey, gold and brown. Kalf’s cup is a nautilus shell from the far side of the world, mounted in gilded silver, beside a crystal bowl set in gold and jewels.',
        boxes: [
          [0.52, 0, 0.26, 0.55],
          [0.55, 0.18, 0.35, 0.3],
        ],
      },
      {
        id: 'cloth',
        title: 'The cloth',
        text: 'Heda’s table is covered in white linen, crumpled and cool, with oysters, bread and a knife. Kalf’s glows with a red Turkish carpet, itself a costly import.',
        boxes: [
          [0.05, 0.55, 0.8, 0.43],
          [0.6, 0.7, 0.4, 0.3],
        ],
      },
    ],
  },
  winter: {
    left: { photo: 'hunters-snow', title: 'Pieter Bruegel, 1565' },
    right: { photo: 'avercamp-winter', title: 'Hendrick Avercamp, about 1608' },
    intro:
      'Two winters on the ice, forty years apart. Bruegel painted his in Brussels; Avercamp, a generation later, in the north. Pick a way of looking.',
    looks: [
      {
        id: 'view',
        title: 'Where you stand',
        text: 'Bruegel puts you on a hilltop behind his tired hunters, looking far down on the frozen ponds. Avercamp still lifts you a little, so you can see over the heads, but you stand at the edge of the ice, among the crowd.',
        boxes: [
          [0.1, 0.45, 0.9, 0.55],
          [0.25, 0.5, 0.75, 0.5],
        ],
      },
      {
        id: 'skaters',
        title: 'The skaters',
        text: 'Bruegel’s skaters are tiny dark dots on the ponds. Avercamp’s are close enough to tell apart: couples in their best clothes, a horse pulling a sleigh, children, fishermen and gentlemen in furs.',
        boxes: [
          [0.6, 0.52, 0.35, 0.22],
          [0.7, 0.58, 0.3, 0.32],
        ],
      },
      {
        id: 'air',
        title: 'The air',
        text: 'Bruegel’s air is clear and icy, with a hard green sky and sharp mountains that the Low Countries do not have. Avercamp’s is a soft, milky haze, the damp winter air of the flat land, fading the town into the distance.',
        boxes: [
          [0.55, 0, 0.45, 0.35],
          [0.3, 0, 0.6, 0.45],
        ],
      },
    ],
  },
} satisfies Record<string, Pair>

export type PairId = keyof typeof pairs
export const pairIds = Object.keys(pairs) as [PairId, ...PairId[]]
