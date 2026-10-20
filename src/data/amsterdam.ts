// The Amsterdam growth map for Unit 6: the city pushing its walls out, 1550 to 1700,
// drawn on today's canals (Kadaster TOP10NL, CC BY 4.0). Each stage's land inside the
// walls is a hand-drawn shape that follows the canals that bounded it: the Singel and
// Kloveniersburgwal for the medieval town, the line of the Herengracht and the
// Oudeschans for the expansion from 1585, the Lijnbaansgracht and Singelgracht for the
// canal ring of 1613 and its continuation in the 1660s. Old walls stay on the map as
// faint dashes. Coordinates are [lon, lat] (WGS84).

import type { HistArea, HistEvent, HistLabel, HistLine, HistSite, TimeStory } from './timeline'

export const AMSTERDAM_MIN = 1550
export const AMSTERDAM_MAX = 1700

const medieval: [number, number][] = [
  [4.895, 52.3795], [4.8928, 52.3776], [4.8913, 52.3763], [4.8901, 52.3752], [4.8893, 52.3745], [4.8889, 52.3735],
  [4.8885, 52.3722], [4.8882, 52.3713], [4.888, 52.3695], [4.888, 52.3686], [4.8891, 52.3677], [4.8899, 52.3672],
  [4.8915, 52.3669], [4.8932, 52.367], [4.8955, 52.3676], [4.8963, 52.3684], [4.8976, 52.3698], [4.8987, 52.3709],
  [4.8997, 52.372], [4.9006, 52.3728], [4.9013, 52.3742], [4.9016, 52.375], [4.9025, 52.3762], [4.9006, 52.3767],
  [4.899, 52.3772], [4.8975, 52.3778], [4.896, 52.3787],
]

// West to a new moat on the line of today's Herengracht, east around the Lastage.
const firstExpansion: [number, number][] = [
  [4.8917, 52.3789], [4.8907, 52.3776], [4.89, 52.3769], [4.8891, 52.3758], [4.8881, 52.3748], [4.8874, 52.3741],
  [4.8871, 52.373], [4.8871, 52.3714], [4.8868, 52.3687], [4.8868, 52.3676], [4.8883, 52.3668], [4.8904, 52.366],
  [4.8932, 52.3665], [4.896, 52.3668], [4.9, 52.3668], [4.9014, 52.3698], [4.9038, 52.3709], [4.9056, 52.3717],
  [4.9068, 52.3725], [4.907, 52.3745], [4.904, 52.376], [4.9025, 52.3762], [4.9006, 52.3767], [4.8975, 52.3778],
  [4.895, 52.3795], [4.8935, 52.38],
]

// The canal ring from the Brouwersgracht to the Leidsegracht, the Jordaan and the western islands.
const canalRingWest: [number, number][] = [
  [4.8825, 52.3852], [4.882, 52.3835], [4.8804, 52.3816], [4.8801, 52.3801], [4.8785, 52.3784], [4.8783, 52.3776],
  [4.8776, 52.3759], [4.8762, 52.3742], [4.8759, 52.3736], [4.8756, 52.3726], [4.8753, 52.3719], [4.8762, 52.3701],
  [4.8772, 52.3686], [4.8783, 52.3672], [4.8792, 52.3655], [4.8867, 52.3676], [4.8871, 52.3714], [4.8871, 52.373],
  [4.8881, 52.3748], [4.89, 52.3769], [4.8917, 52.3789], [4.8935, 52.38], [4.8935, 52.383], [4.8925, 52.3875],
  [4.889, 52.3885], [4.885, 52.3875],
]

// The ring carried on to the Amstel and beyond, with the Plantage and the eastern islands.
const canalRingEast: [number, number][] = [
  [4.8792, 52.3655], [4.8807, 52.3645], [4.8817, 52.3627], [4.8842, 52.3621], [4.8871, 52.361], [4.8894, 52.3599],
  [4.8914, 52.3589], [4.896, 52.3591], [4.8988, 52.358], [4.9023, 52.3587], [4.906, 52.3596], [4.909, 52.3606],
  [4.9131, 52.3614], [4.9176, 52.3623], [4.9218, 52.3638], [4.9263, 52.366], [4.9275, 52.37], [4.928, 52.3735],
  [4.922, 52.376], [4.912, 52.3775], [4.907, 52.376], [4.907, 52.3745], [4.9068, 52.3725], [4.9056, 52.3717],
  [4.9038, 52.3709], [4.9014, 52.3698], [4.9, 52.3668], [4.8932, 52.3665], [4.8904, 52.366], [4.8883, 52.3668],
  [4.8868, 52.3676],
]

// Each stage's shape takes in the town before it, so the newest is drawn first and
// the older ones on top: only the new ring shows as just added.
const areas: HistArea[] = [
  { name: 'The ring past the Amstel', kind: 'city', from: 1663, shape: canalRingEast },
  { name: 'The canal ring and the Jordaan', kind: 'city', from: 1613, shape: canalRingWest },
  { name: 'The first expansions', kind: 'city', from: 1585, shape: firstExpansion },
  { name: 'The medieval town', kind: 'city', from: AMSTERDAM_MIN, shape: medieval },
]

const lines: HistLine[] = [
  {
    name: 'Medieval wall along the Singel',
    kind: 'wall',
    from: AMSTERDAM_MIN,
    to: 1584,
    coords: [[4.895, 52.3795], [4.8913, 52.3763], [4.8893, 52.3745], [4.8885, 52.3722], [4.888, 52.3695], [4.8891, 52.3677], [4.8915, 52.3669], [4.8932, 52.367]],
  },
  {
    name: 'Medieval wall along the Kloveniersburgwal',
    kind: 'wall',
    from: AMSTERDAM_MIN,
    to: 1584,
    coords: [[4.8955, 52.3676], [4.8976, 52.3698], [4.8997, 52.372], [4.9006, 52.3728], [4.9016, 52.375], [4.9025, 52.3762]],
  },
  {
    name: 'Wall of 1585 on the line of the Herengracht',
    kind: 'wall',
    from: 1585,
    to: 1612,
    coords: [[4.8917, 52.3789], [4.89, 52.3769], [4.8881, 52.3748], [4.8871, 52.373], [4.8868, 52.3687], [4.8868, 52.3676]],
  },
  {
    name: 'Wall of 1585 from the Leidsegracht to the Amstel',
    kind: 'wall',
    from: 1585,
    to: 1662,
    coords: [[4.8868, 52.3676], [4.8883, 52.3668], [4.8904, 52.366], [4.8932, 52.3665]],
  },
  {
    name: 'Oudeschans, the wall around the Lastage',
    kind: 'wall',
    from: 1585,
    to: 1662,
    coords: [[4.9, 52.3668], [4.9014, 52.3698], [4.9038, 52.3709], [4.9056, 52.3717], [4.9068, 52.3725], [4.907, 52.3745]],
  },
  {
    name: 'Wall of 1613 around the Jordaan',
    kind: 'wall',
    from: 1613,
    coords: [
      [4.8825, 52.3852], [4.8804, 52.3816], [4.8785, 52.3784], [4.8776, 52.3759], [4.8756, 52.3726], [4.8762, 52.3701],
      [4.8783, 52.3672], [4.8792, 52.3655],
    ],
  },
  {
    name: 'Wall of 1613 along the Leidsegracht',
    kind: 'wall',
    from: 1613,
    to: 1662,
    coords: [[4.8792, 52.3655], [4.8867, 52.3676]],
  },
  {
    name: 'Wall of the 1660s past the Amstel',
    kind: 'wall',
    from: 1663,
    coords: [
      [4.8792, 52.3655], [4.8817, 52.3627], [4.8871, 52.361], [4.8914, 52.3589], [4.8988, 52.358], [4.906, 52.3596],
      [4.9131, 52.3614], [4.9218, 52.3638], [4.9263, 52.366], [4.9275, 52.37], [4.928, 52.3735],
    ],
  },
]

const sites: HistSite[] = [
  { name: 'Oude Kerk', kind: 'town', from: AMSTERDAM_MIN, at: [4.8983, 52.3743], label: 'left', note: 'The Old Church, the oldest building in the city' },
  { name: 'Dam', kind: 'town', from: AMSTERDAM_MIN, to: 1654, end: 1654, at: [4.8926, 52.3729], label: 'left', note: 'The dam in the Amstel that gave the city its name' },
  { name: 'Schreierstoren', kind: 'fort', from: AMSTERDAM_MIN, at: [4.9007, 52.3765], label: 'right', note: 'A tower of the medieval wall, built in 1487' },
  { name: 'Montelbaanstoren', kind: 'fort', from: 1585, at: [4.9066, 52.3718], label: 'right', note: 'Built in 1516 to guard the Lastage, inside the walls from 1585' },
  { name: 'East India House', kind: 'town', from: 1606, at: [4.8985, 52.3712], label: 'right', note: 'Oost-Indisch Huis, headquarters of the VOC from 1606' },
  { name: 'Exchange', kind: 'town', from: 1611, at: [4.8933, 52.3714], label: 'left', note: "Hendrick de Keyser's Exchange over the Rokin, opened 1611, pulled down 1838" },
  { name: 'Westerkerk', kind: 'town', from: 1631, at: [4.884, 52.3747], label: 'left', note: 'The West Church, finished 1631; Rembrandt was buried there in 1669' },
  { name: "Rembrandt's house", kind: 'town', from: 1631, at: [4.9011, 52.3694], label: 'right', note: 'Jodenbreestraat; Rembrandt lived here from 1639 until he lost it in 1658' },
  { name: 'Town Hall', kind: 'town', from: 1655, at: [4.8913, 52.3732], label: 'left', note: 'On the Dam, begun in 1648 and opened in 1655; the Royal Palace today' },
  { name: 'Zeemagazijn', kind: 'town', from: 1663, at: [4.9152, 52.3717], note: "The Admiralty's naval storehouse, 1656; the Maritime Museum today" },
  { name: 'Portuguese Synagogue', kind: 'town', from: 1675, at: [4.9047, 52.3675], label: 'right', note: 'Opened 1675' },
]

const labels: HistLabel[] = [
  { text: 'IJ', kind: 'water', from: AMSTERDAM_MIN, at: [4.906, 52.3815] },
  { text: 'Amstel', kind: 'water', from: AMSTERDAM_MIN, at: [4.9075, 52.3565] },
  { text: 'Lastage', kind: 'territory', from: AMSTERDAM_MIN, to: 1662, at: [4.9058, 52.3748] },
  { text: 'Jordaan', kind: 'territory', from: 1613, at: [4.8805, 52.3745] },
  { text: 'Canal ring', kind: 'territory', from: 1613, at: [4.8838, 52.3683] },
  { text: 'Western islands', kind: 'territory', from: 1613, at: [4.8875, 52.3868] },
  { text: 'Plantage', kind: 'territory', from: 1663, at: [4.914, 52.3655] },
  { text: 'Eastern islands', kind: 'territory', from: 1663, at: [4.9215, 52.3735] },
]

const events: HistEvent[] = [
  {
    from: 1550,
    title: 'About 1550: A walled town on the IJ',
    text: 'Amsterdam is a busy port for grain and timber from the Baltic, but small. It still fits inside walls built in the 1400s, along the Singel and the Kloveniersburgwal. Its shipyards, in the Lastage, lie outside.',
  },
  {
    from: 1585,
    title: '1585: Room for newcomers',
    text: 'Antwerp has fallen, and refugees pour in. The city pushes its walls out: west to a new moat on the line of today\'s Herengracht, and east around the Lastage, behind a rampart called the Oudeschans.',
  },
  {
    from: 1606,
    title: '1606: The East India House',
    text: 'The new East India Company, the VOC, founded in 1602, moves into its headquarters near the Kloveniersburgwal. Its warehouses fill with pepper, spices and silk.',
  },
  {
    from: 1611,
    title: '1611: The Exchange',
    text: 'Merchants get a covered Exchange over the Rokin, designed by Hendrick de Keyser. Here they trade goods and VOC shares at fixed hours every day.',
  },
  {
    from: 1613,
    title: '1613: The canal ring',
    text: 'On 5 March 1613 the city decides on a great expansion to the west. Three new canals are dug, the Herengracht, Keizersgracht and Prinsengracht, with the Jordaan beyond for workers and the western islands for shipyards.',
  },
  {
    from: 1631,
    title: '1631: The Westerkerk',
    text: 'The West Church is finished on the Prinsengracht, its tower the tallest in the city. About now a young painter from Leiden, Rembrandt, moves to Amsterdam.',
  },
  {
    from: 1655,
    title: '1655: A town hall like a palace',
    text: 'Begun in 1648, the year of the peace with Spain, the new town hall on the Dam opens in 1655. It stands on 13,659 wooden piles driven into the soft ground. Since 1808 it has been a royal palace.',
  },
  {
    from: 1663,
    title: '1663: Across the Amstel',
    text: 'The ring of canals is carried on to the Amstel and beyond, inside a new wall with 26 bastions. The Admiralty and the VOC build yards on new eastern islands. East of the Amstel, plots sell slowly, and the Plantage becomes gardens.',
  },
  {
    from: 1675,
    title: '1675: The Portuguese Synagogue',
    text: 'Jews whose families fled Spain and Portugal open a great synagogue near the Amstel. In the Republic they can worship openly, a freedom rare in Europe.',
  },
  {
    from: 1700,
    title: '1700: A city of 200,000',
    text: 'In a little over a century Amsterdam has grown from about 30,000 people in the 1580s to about 200,000, one of the largest cities in Europe. Its half-moon shape will hardly change until the 1800s.',
  },
]

export const amsterdamStory: TimeStory = {
  place: 'Amsterdam',
  base: 'amsterdam',
  bounds: [[4.8735, 52.3555], [4.9295, 52.389]],
  min: AMSTERDAM_MIN,
  max: AMSTERDAM_MAX,
  format: String,
  events,
  lines,
  sites,
  labels,
  areas,
  note: "Drawn on today's canals (Kadaster, CC BY 4.0); a few old canals have since been filled in. The station island in the IJ was only built in the 1800s.",
  key: [
    { swatch: 'key-city', text: 'Inside the walls' },
    { swatch: 'key-new', text: 'Just added' },
    { swatch: 'key-wall', text: 'Wall' },
    { swatch: 'key-town', text: 'Building' },
    { swatch: 'key-fort', text: 'Tower' },
  ],
}
