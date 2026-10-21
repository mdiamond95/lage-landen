// Painting tours (`{ kind: painting }`): a big painting saved large enough to zoom deep
// into, and the details on it worth stopping at. Unit 16 brought them in; the Ghent
// Altarpiece is toured in Unit 4 too, the Night Watch in Unit 6, and Unit 17 tours a
// Rubens and a Vermeer, Unit 18 an Ensor. Each stop's box is
// [left, top, width, height] as fractions of the picture, the same as a detail hunt's
// targets; the tour glides to it and fills the frame with it. A question can open a
// painting at one stop with `focus`.

import type { PhotoId } from '../photos/ids'

type Box = [number, number, number, number]
export type TourStop = { id: string; title: string; text: string; box: Box }
export type Tour = { photo: PhotoId; intro: string; stops: TourStop[] }

export const tours = {
  'ghent-altarpiece': {
    photo: 'ghent-open',
    intro:
      'The Ghent Altarpiece open, as it was shown on feast days: twelve oak panels, begun by Hubert van Eyck and finished by his brother Jan in 1432. Tap a number, or start the tour, and zoom in as far as you like.',
    stops: [
      {
        id: 'god',
        title: 'The king of heaven',
        text: 'In the middle sits a figure in red with a triple crown, like a pope’s, and a jewelled crown at his feet. Historians still argue whether he is God the Father or Christ as king.',
        box: [0.43, 0.04, 0.14, 0.24],
      },
      {
        id: 'mary',
        title: 'Mary, reading',
        text: 'Mary wears a crown of jewels, lilies and roses, and reads from a book whose pages you can almost turn. Dürer, who saw the altarpiece in 1521, singled her out as extremely good.',
        box: [0.28, 0.13, 0.13, 0.42],
      },
      {
        id: 'singers',
        title: 'The singing angels',
        text: 'Eight angels sing from a carved lectern, in brocade copes heavy with gold thread. Look at their faces: some strain for high notes, some frown. The frame below reads MELOS DEO LAUS, music in praise of God.',
        box: [0.1, 0.19, 0.14, 0.2],
      },
      {
        id: 'adam',
        title: 'Adam',
        text: 'Adam and Eve are almost life-size, and among the first nudes painted in northern Europe. Adam’s foot seems to step out of his niche towards you. In 1781 Emperor Joseph II found the pair so disagreeable that he had them taken down.',
        box: [0.0, 0.16, 0.09, 0.42],
      },
      {
        id: 'lamb',
        title: 'The Lamb on the altar',
        text: 'The Lamb of God stands on an altar, its blood running into a golden cup, with angels kneeling around. This photograph shows the lamb before the restoration that ended in 2019, which took off paint added in the 1500s and found Van Eyck’s own lamb, with startling, almost human eyes.',
        box: [0.465, 0.675, 0.06, 0.07],
      },
      {
        id: 'fountain',
        title: 'The fountain of life',
        text: 'A fountain pours the water of life into a stream that flows down towards you, with jewels glinting on its bed. Behind the meadow rise the towers of a heavenly city, painted like the churches of Van Eyck’s own day.',
        box: [0.46, 0.85, 0.07, 0.08],
      },
      {
        id: 'judges',
        title: 'The Just Judges, a copy',
        text: 'This panel was stolen in 1934 and has never been found. The one here is a copy, painted by Jef Van der Veken in the years after the theft.',
        box: [0.005, 0.6, 0.11, 0.38],
      },
    ],
  },
  garden: {
    photo: 'garden-delights',
    intro:
      'Bosch’s Garden of Earthly Delights, painted between about 1490 and 1510 and seen in the palace of the counts of Nassau in Brussels in 1517: paradise on the left, a garden of pleasures in the middle, hell on the right.',
    stops: [
      {
        id: 'eden',
        title: 'God brings Eve to Adam',
        text: 'In paradise, God takes Eve by the wrist and presents her to Adam, who has just woken. All around them, animals from Europe and from travellers’ tales: an elephant, a giraffe, a unicorn.',
        box: [0.05, 0.6, 0.16, 0.23],
      },
      {
        id: 'riders',
        title: 'The ring of riders',
        text: 'In the middle panel, men ride horses, camels, bears and griffins round and round a pool of women. Nobody works, nobody grows old, and everyone is naked.',
        box: [0.33, 0.32, 0.43, 0.24],
      },
      {
        id: 'fruit',
        title: 'Giant fruit and birds',
        text: 'People feast on giant strawberries and cherries, and climb inside fruit and shells. Many read the soft fruit, which soon rots, as pleasures that do not last.',
        box: [0.3, 0.5, 0.26, 0.2],
      },
      {
        id: 'tree-man',
        title: 'The Tree-Man',
        text: 'In hell, a man’s body is a broken eggshell on legs like dead trees, with a tavern inside it. His head, turned back towards us, carries a disc with a huge bagpipe. Some think the face is Bosch’s own.',
        box: [0.8, 0.26, 0.16, 0.26],
      },
      {
        id: 'music',
        title: 'Musicians’ hell',
        text: 'A harp, a lute and a hurdy-gurdy have become instruments of torture. Under the lute, a sinner lies face down with a song written on his backside, and a choir sings from it.',
        box: [0.765, 0.52, 0.14, 0.25],
      },
      {
        id: 'prince',
        title: 'The Prince of Hell',
        text: 'A blue monster with a bird’s head sits on a high chair, swallowing sinners and passing them out below. It has a cauldron on its head for a crown.',
        box: [0.905, 0.6, 0.08, 0.23],
      },
    ],
  },
  proverbs: {
    photo: 'proverbs',
    intro:
      'Bruegel’s Netherlandish Proverbs of 1559: well over a hundred sayings acted out in one village, many still used in Dutch and Flemish today. Can you work them out before reading?',
    stops: [
      {
        id: 'tarts',
        title: 'A roof tiled with tarts',
        text: 'Het dak met vlaaien gedekt: to have your roof tiled with tarts is to have more than enough of everything.',
        box: [0.13, 0.04, 0.12, 0.17],
      },
      {
        id: 'world',
        title: 'The world upside down',
        text: 'The orb, a globe with a cross on top, hangs from the inn wall the wrong way up: de wereld op zijn kop, the world turned upside down. Everything in this village is back to front.',
        box: [0.03, 0.38, 0.06, 0.1],
      },
      {
        id: 'cloak',
        title: 'The blue cloak',
        text: 'A woman in red hangs a blue cloak over her husband: de blauwe huik omhangen means she is cheating on him. The painting was once called The Blue Cloak.',
        box: [0.4, 0.62, 0.11, 0.23],
      },
      {
        id: 'cat',
        title: 'Who will bell the cat?',
        text: 'A man in armour ties a bell on a cat: de kat de bel aanbinden, to dare to do the dangerous job that everyone else talks about. He is also armed to the teeth, with a knife between them.',
        box: [0.215, 0.62, 0.08, 0.11],
      },
      {
        id: 'wall',
        title: 'Head against the wall',
        text: 'Met het hoofd tegen de muur lopen: to run your head into a wall is to try the impossible, and get hurt.',
        box: [0.13, 0.75, 0.1, 0.19],
      },
      {
        id: 'well',
        title: 'Too late',
        text: 'A man fills in a well with a calf drowned in it: de put dempen als het kalf verdronken is, to act only after the damage is done.',
        box: [0.42, 0.86, 0.13, 0.14],
      },
      {
        id: 'globe',
        title: 'Crawling through the world',
        text: 'A man squeezes through a hollow globe: you must stoop to get through the world. To get on, you sometimes have to bend.',
        box: [0.61, 0.86, 0.09, 0.13],
      },
    ],
  },
  hunters: {
    photo: 'hunters-snow',
    intro:
      'The Hunters in the Snow, 1565: one of a series of paintings of the times of the year that Bruegel made for the Antwerp merchant Niclaes Jongelinck. Five survive. Step through the details.',
    stops: [
      {
        id: 'hunters',
        title: 'A poor day’s hunting',
        text: 'Three hunters trudge home with their dogs, heads down. All they have to show for the day is one thin fox on a pole.',
        box: [0.22, 0.53, 0.21, 0.37],
      },
      {
        id: 'sign',
        title: 'The inn sign',
        text: 'The inn’s sign hangs loose from one hook. The inn is called the Stag, and its sign shows a saint kneeling before a stag with a cross between its antlers.',
        box: [0.08, 0.33, 0.06, 0.1],
      },
      {
        id: 'fire',
        title: 'Singeing a pig',
        text: 'Outside the inn, a family has lit a fire to burn the bristles off a pig they have killed: winter was the time to slaughter and salt meat.',
        box: [0.0, 0.52, 0.18, 0.16],
      },
      {
        id: 'skaters',
        title: 'On the ice',
        text: 'Down in the valley, tiny figures skate, fall, and play kolf, a game with sticks and a ball, and a curling game on the frozen ponds.',
        box: [0.6, 0.52, 0.35, 0.19],
      },
      {
        id: 'mill',
        title: 'A frozen mill',
        text: 'The water wheel of the mill is locked in ice, with icicles hanging from it. Nothing will be ground until the thaw.',
        box: [0.84, 0.66, 0.13, 0.25],
      },
      {
        id: 'mountains',
        title: 'Mountains in Flanders?',
        text: 'There are no peaks like these anywhere in the Low Countries. Bruegel drew the Alps on his way to Italy in the 1550s, and kept putting them in his landscapes.',
        box: [0.78, 0.12, 0.22, 0.22],
      },
      {
        id: 'magpie',
        title: 'A magpie',
        text: 'A magpie glides across the valley, and crows sit in the bare trees. The magpie was a bird of bad luck in Flemish folklore.',
        box: [0.67, 0.21, 0.07, 0.09],
      },
    ],
  },
  // Saved smaller than the others (1600 pixels wide), so its details are bigger boxes.
  'night-watch': {
    photo: 'night-watch',
    intro:
      'Rembrandt’s group portrait of Captain Frans Banninck Cocq’s company of musketeers, finished in 1642. Instead of standing them in rows, he painted them starting to move off. Tap a number, or start the tour.',
    stops: [
      {
        id: 'captain',
        title: 'The captain',
        text: 'Captain Frans Banninck Cocq, in black with a red sash, steps forward and gives his lieutenant the order to march. He later became a burgomaster of Amsterdam.',
        box: [0.42, 0.44, 0.14, 0.2],
      },
      {
        id: 'lieutenant',
        title: 'The lieutenant in yellow',
        text: 'Lieutenant Willem van Ruytenburch listens, all in pale yellow. Look at his coat: the shadow of the captain’s raised hand falls across it.',
        box: [0.55, 0.47, 0.16, 0.33],
      },
      {
        id: 'shooter',
        title: 'Firing',
        text: 'Half hidden behind the lieutenant, a musketeer in a helmet fires his gun. The company were kloveniers, musketeers, and elsewhere in the crowd others load their guns and blow the powder off the pan.',
        box: [0.66, 0.52, 0.13, 0.14],
      },
      {
        id: 'drummer',
        title: 'The drummer and the dog',
        text: 'On the right a drummer beats the march, and a little dog barks at the noise.',
        box: [0.76, 0.6, 0.24, 0.32],
      },
      {
        id: 'shield',
        title: 'The names',
        text: 'High up on the gateway hangs a shield with the names of eighteen of the men in the company, added some years after the painting was finished.',
        box: [0.53, 0.06, 0.135, 0.22],
      },
      {
        id: 'cut',
        title: 'A painting cut down',
        text: 'In 1715 the painting was moved to Amsterdam’s town hall and cut down on every side to fit the wall. A strip on the left, with several figures, was lost.',
        box: [0.0, 0.36, 0.12, 0.2],
      },
    ],
  },
  // Unit 17
  paradise: {
    photo: 'paradise',
    intro:
      'Paradise with the Fall of Man, painted around 1615 by Rubens and a friend, two Antwerp masters on one panel. Tap a number, or start the tour, and zoom in as far as you like.',
    stops: [
      {
        id: 'eve',
        title: 'Adam and Eve',
        text: 'Eve hands Adam the forbidden fruit, and he reaches for it. Their big, glowing bodies are in Rubens’s grand manner, like ancient statues come to life.',
        box: [0.1, 0.4, 0.3, 0.5],
      },
      {
        id: 'snake',
        title: 'The snake',
        text: 'The serpent coils round a branch of the tree of knowledge, just above the apple Eve has picked.',
        box: [0.18, 0.1, 0.15, 0.12],
      },
      {
        id: 'birds',
        title: 'The birds',
        text: 'Look up into the trees: blue and yellow macaws from South America, parrots and songbirds, each one painted feather by feather in tiny, exact strokes.',
        box: [0.48, 0.18, 0.14, 0.2],
      },
      {
        id: 'cats',
        title: 'The tiger and the leopard',
        text: 'Before the Fall there is no killing. A tiger and a leopard roll over each other at play, and the lion only watches.',
        box: [0.72, 0.62, 0.28, 0.25],
      },
      {
        id: 'peacock',
        title: 'The peacock',
        text: 'At Eve’s feet a peacock trails its tail over the grass, with every eye of the feathers painted, beside a white rabbit and a little dog.',
        box: [0.26, 0.68, 0.22, 0.32],
      },
    ],
  },
  'art-of-painting': {
    photo: 'art-of-painting',
    intro:
      'Vermeer’s Art of Painting, from about 1666 to 1668: a painter at work in his studio, as if a curtain had just been pulled back for you. It was still in his house when he died. Tap a number, or start the tour.',
    stops: [
      {
        id: 'curtain',
        title: 'The curtain',
        text: 'A heavy tapestry hangs in front, pulled aside like the curtain of a stage. You are let in on something private.',
        box: [0, 0, 0.42, 0.9],
      },
      {
        id: 'painter',
        title: 'The painter',
        text: 'The painter sits with his back to us, in a black doublet slashed to show the white beneath, and red stockings. We never see his face. He has only just begun: on his canvas, so far, there are a few leaves of a wreath.',
        box: [0.56, 0.42, 0.32, 0.5],
      },
      {
        id: 'clio',
        title: 'The model',
        text: 'His model wears a crown of laurel and holds a trumpet and a big book. These are the signs of Clio, the muse of history, as an Italian handbook of symbols described her.',
        box: [0.36, 0.38, 0.2, 0.3],
      },
      {
        id: 'map',
        title: 'The map',
        text: 'A great wall map of the Low Countries, framed by views of their towns. Vermeer painted it so exactly that historians know which map it is, and how it was folded.',
        box: [0.38, 0.18, 0.52, 0.32],
      },
      {
        id: 'chandelier',
        title: 'The chandelier',
        text: 'A brass chandelier without candles, crowned with a double-headed eagle, the badge of the Habsburgs who once ruled the Low Countries. Possibly another sign of the past.',
        box: [0.5, 0.05, 0.28, 0.2],
      },
    ],
  },
  'ensor-entry': {
    photo: 'ensor-entry',
    intro:
      'Christ’s Entry into Brussels in 1889: a crowd of masks marching straight at you, on a canvas more than four metres wide. Ensor painted it in 1888, at home in Ostend. Tap a number, or start the tour.',
    stops: [
      {
        id: 'christ',
        title: 'A small figure in the middle',
        text: 'Christ rides a donkey far back in the crowd, his hand raised in blessing, under a yellow halo. Nobody is looking at him. Some think he has Ensor’s own face.',
        box: [0.38, 0.22, 0.16, 0.24],
      },
      {
        id: 'banner',
        title: 'The red banner',
        text: 'A huge red banner stretches over the street. Read it, and you will see what the crowd is cheering for.',
        box: [0.1, 0, 0.55, 0.32],
      },
      {
        id: 'band',
        title: 'The band',
        text: 'A brass band in uniform marches ahead of Christ, under a sign that reads “Fanfares doctrinaires, toujours réussi”, the band of the doctrinaires, always a success. The doctrinaires were the moderate liberals of Belgian politics.',
        box: [0.2, 0.28, 0.2, 0.3],
      },
      {
        id: 'masks',
        title: 'The masks',
        text: 'In front, the crowd presses so close it seems to spill out of the picture: carnival masks, grinning clowns and blank faces, like the masks sold in his mother’s shop. Some are portraits of real people, members of his family among them.',
        box: [0.25, 0.6, 0.4, 0.4],
      },
      {
        id: 'death',
        title: 'Death',
        text: 'At the lower left a skeleton in a top hat walks with the crowd. Ensor painted skeletons all his life. This corner was damaged by shrapnel in the Second World War.',
        box: [0.05, 0.75, 0.17, 0.25],
      },
      {
        id: 'king',
        title: 'Long live Jesus',
        text: 'On the right, a sign reads “Vive Jésus roi de Bruxelles”, long live Jesus, king of Brussels. Below it Ensor signed and dated the painting 1888.',
        box: [0.82, 0.52, 0.18, 0.3],
      },
    ],
  },
} satisfies Record<string, Tour>

export type TourId = keyof typeof tours
export const tourIds = Object.keys(tours) as [TourId, ...TourId[]]
