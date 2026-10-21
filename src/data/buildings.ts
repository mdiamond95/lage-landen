// The map for Unit 19: the buildings of the Low Countries, from the first belfry in Tournai
// in 1188 to the World Heritage list of 2000. Each building is a mark from the year it was
// finished, in the colour of its style: Gothic, Renaissance and Baroque, the revivals of the
// 1800s, Art Nouveau and modern. Béguinages and mills have marks of their own. A building
// that was destroyed fades to grey: the Cloth Hall of Ypres from 1914 until it was rebuilt,
// the Maison du Peuple for good in 1965. Coordinates are [lon, lat].

import type { HistEvent, HistLabel, HistSite, TimeStory } from './timeline'

export const BUILDINGS_MIN = 1188
export const BUILDINGS_MAX = 2000

const B = {
  tournai: [3.389, 50.606],
  bruges: [3.225, 51.209],
  ypres: [2.885, 50.851],
  ghent: [3.725, 51.054],
  utrecht: [5.121, 52.091],
  amsterdam: [4.893, 52.373],
  brussels: [4.352, 50.847],
  leuven: [4.701, 50.879],
  antwerp: [4.401, 51.22],
  mechelen: [4.478, 51.029],
  hague: [4.314, 52.08],
  zaandam: [4.82, 52.44],
  kinderdijk: [4.635, 51.884],
  lemmer: [5.696, 52.84],
  rotterdam: [4.48, 51.922],
  hilversum: [5.181, 52.229],
} satisfies Record<string, [number, number]>

// Moves a mark a little, so two in one town don't sit on top of each other.
const by = ([lon, lat]: [number, number], dlon: number, dlat: number): [number, number] => [lon + dlon, lat + dlat]

export const buildingsSites: HistSite[] = [
  { name: 'Belfry of Tournai', kind: 'gothic', from: 1188, at: B.tournai, label: 'right', note: 'begun around 1188, when Tournai was granted its charter; 72 m' },
  { name: 'Belfry of Bruges', kind: 'gothic', from: 1240, at: B.bruges, label: 'left', note: 'begun around 1240 beside the market hall; the eight-sided top was added in 1483 to 1487' },
  { name: 'Béguinage of Bruges', kind: 'beguinage', from: 1245, at: by(B.bruges, 0.02, -0.06), label: 'left', note: 'Ten Wijngaerde, founded around 1245' },
  { name: 'Cloth Hall of Ypres', kind: 'gothic', from: 1304, off: [[1914, 1966]], at: B.ypres, label: 'right', note: 'built from 1200 to 1304; shelled to ruins in the First World War; rebuilt from 1933 to 1967' },
  { name: 'Belfry of Ghent', kind: 'gothic', from: 1382, at: B.ghent, label: 'right', note: 'built from 1313 to 1380; 91 m, the tallest belfry in Belgium' },
  { name: 'Dom tower', kind: 'gothic', from: 1382, at: B.utrecht, label: 'right', note: 'Utrecht, built from 1321 to 1382; 112 m, the tallest church tower in the Netherlands' },
  { name: 'Begijnhof', kind: 'beguinage', from: 1389, at: by(B.amsterdam, -0.06, -0.03), label: 'left', note: 'Amsterdam: beguines lived here by 1346, and the court is first named in 1389' },
  { name: 'Brussels Town Hall', kind: 'gothic', from: 1455, at: B.brussels, label: 'left', note: 'built from 1401 to 1455; the tower is 96 m' },
  { name: 'Leuven Town Hall', kind: 'gothic', from: 1469, at: B.leuven, label: 'right', note: 'built from 1448 to 1469 by Matheus de Layens' },
  { name: 'Cathedral of Our Lady', kind: 'gothic', from: 1521, at: B.antwerp, label: 'left', note: 'Antwerp, built from 1352 to 1521; its north tower is 123 m' },
  { name: 'St Rumbold’s tower', kind: 'gothic', from: 1521, at: B.mechelen, label: 'right', note: 'Mechelen, built from 1452 to 1520; meant to reach about 167 m, it stopped at 97 m for lack of money' },
  { name: 'Antwerp City Hall', kind: 'classic', from: 1565, at: by(B.antwerp, 0.04, 0.05), label: 'right', note: 'built from 1561 to 1565 by Cornelis Floris, in the new style from Italy' },
  { name: 'Wind sawmills', kind: 'mill', from: 1597, at: B.zaandam, label: 'right', note: 'on the Zaan: Cornelis Corneliszoon built his first wind-driven sawmill in 1594 and patented an improved one in 1597' },
  { name: 'Canal ring', kind: 'classic', from: 1613, at: by(B.amsterdam, 0, -0.06), label: 'right', note: 'Amsterdam’s three canals, dug from 1613 and lined with merchants’ houses' },
  { name: 'Westerkerk', kind: 'classic', from: 1631, at: by(B.amsterdam, -0.06, 0.04), label: 'left', note: 'Amsterdam, built from 1620 to 1631 to a design by Hendrick de Keyser' },
  { name: 'Saint Charles Borromeo', kind: 'classic', from: 1631, at: by(B.antwerp, -0.04, -0.05), label: 'left', note: 'Antwerp, the Jesuit church, built from 1615 to 1621' },
  { name: 'Mauritshuis', kind: 'classic', from: 1641, at: B.hague, label: 'left', note: 'The Hague, built from 1636 to 1641 by Jacob van Campen and Pieter Post' },
  { name: 'Town hall on the Dam', kind: 'classic', from: 1655, at: by(B.amsterdam, 0.06, 0.03), label: 'right', note: 'Amsterdam, by Jacob van Campen, opened in 1655; a royal palace since 1808' },
  { name: 'Guild houses', kind: 'classic', from: 1700, at: by(B.brussels, 0.05, 0.05), label: 'right', note: 'on the Grand Place in Brussels, rebuilt from 1695 to about 1700 after the French bombardment' },
  { name: 'Kinderdijk', kind: 'mill', from: 1740, at: B.kinderdijk, label: 'right', note: '19 polder mills, built around 1740' },
  { name: 'Palace of Justice', kind: 'revival', from: 1885, at: by(B.brussels, 0, -0.05), label: 'left', note: 'Brussels, by Joseph Poelaert, built from 1866 to 1883' },
  { name: 'Rijksmuseum', kind: 'revival', from: 1885, at: by(B.amsterdam, 0.01, -0.12), label: 'right', note: 'Amsterdam, by Pierre Cuypers, opened in 1885' },
  { name: 'Hôtel Tassel', kind: 'nouveau', from: 1893, at: by(B.brussels, 0.06, -0.04), label: 'right', note: 'Brussels, by Victor Horta, 1892 to 1893' },
  { name: 'Maison du Peuple', kind: 'nouveau', from: 1899, to: 1964, at: by(B.brussels, -0.05, 0.04), label: 'left', note: 'Brussels, by Victor Horta for the Belgian Workers’ Party, 1896 to 1899; pulled down in 1965' },
  { name: 'Beurs van Berlage', kind: 'modern', from: 1905, at: by(B.amsterdam, 0.07, -0.03), label: 'right', note: 'Amsterdam’s exchange, by H. P. Berlage, 1898 to 1903' },
  { name: 'Antwerp Central', kind: 'revival', from: 1905, at: by(B.antwerp, 0.05, -0.02), label: 'right', note: 'the station by Louis Delacenserie, 1895 to 1905' },
  { name: 'Stoclet Palace', kind: 'nouveau', from: 1911, at: by(B.brussels, 0.08, 0.01), label: 'right', note: 'Brussels, by Josef Hoffmann of Vienna, 1905 to 1911' },
  { name: 'Wouda pumping station', kind: 'mill', from: 1920, at: B.lemmer, label: 'left', note: 'at Lemmer, the largest steam pumping station ever built, opened in 1920' },
  { name: 'Het Schip', kind: 'modern', from: 1921, at: by(B.amsterdam, -0.05, 0.08), label: 'left', note: 'Amsterdam, workers’ flats by Michel de Klerk, 1919 to 1921' },
  { name: 'Rietveld Schröder House', kind: 'modern', from: 1924, at: by(B.utrecht, 0, -0.05), label: 'right', note: 'Utrecht, by Gerrit Rietveld and Truus Schröder, 1924' },
  { name: 'Van Nelle Factory', kind: 'modern', from: 1931, at: by(B.rotterdam, -0.04, 0.04), label: 'left', note: 'Rotterdam, by Brinkman and Van der Vlugt, 1925 to 1931' },
  { name: 'Hilversum Town Hall', kind: 'modern', from: 1931, at: B.hilversum, label: 'right', note: 'by Willem Dudok, 1928 to 1931' },
  { name: 'Lijnbaan', kind: 'modern', from: 1953, at: B.rotterdam, label: 'right', note: 'Rotterdam: a street of shops for walkers only, opened in 1953 on ground cleared by the bombing' },
  { name: 'Atomium', kind: 'modern', from: 1958, at: by(B.brussels, -0.02, 0.06), label: 'left', note: 'Brussels, by André Waterkeyn with André and Jean Polak, for Expo 58' },
  { name: 'Cube houses', kind: 'modern', from: 1984, at: by(B.rotterdam, 0.04, -0.03), label: 'right', note: 'Rotterdam, by Piet Blom, finished in 1984' },
  { name: 'Erasmus Bridge', kind: 'modern', from: 1996, at: by(B.rotterdam, -0.01, -0.07), label: 'left', note: 'Rotterdam, by Ben van Berkel, opened in 1996' },
]

export const buildingsLabels: HistLabel[] = [
  { text: 'NETHERLANDS', kind: 'territory', from: 1830, at: [6.2, 52.75] },
  { text: 'BELGIUM', kind: 'territory', from: 1830, at: [4.9, 50.55] },
  { text: 'BRUSSELS BOMBARDED', kind: 'alert', from: 1695, to: 1699, at: [4.0, 50.62] },
  { text: 'YPRES IN RUINS', kind: 'alert', from: 1914, to: 1919, at: [3.3, 50.62] },
  { text: 'ROTTERDAM BOMBED', kind: 'alert', from: 1940, to: 1952, at: [4.0, 52.0] },
]

export const buildingsEvents: HistEvent[] = [
  {
    from: 1188,
    title: '1188: A belfry for Tournai',
    text: 'The king of France grants Tournai a charter, and the town begins a tower of its own: a belfry, to hold its bells and its charters. Over the next three centuries every proud town in Flanders and Brabant will want one.',
  },
  {
    from: 1240,
    title: '1240: The belfry of Bruges',
    text: 'Bruges, the richest trading town of the north, begins its belfry beside the market hall on the Markt, where cloth is sold.',
  },
  {
    from: 1245,
    title: '1245: A court for the beguines',
    text: 'Women who want to live a religious life without lifelong vows, the beguines, are given a walled court of little houses beside the water in Bruges. Béguinages spring up across the Low Countries.',
  },
  {
    from: 1304,
    title: '1304: The Cloth Hall of Ypres',
    text: 'After a century of building, Ypres finishes its Cloth Hall, 125 m long, where the town’s famous cloth is checked, stored and sold, with a belfry rising from its middle.',
  },
  {
    from: 1382,
    title: '1382: Two great towers',
    text: 'Ghent has finished its belfry, 91 m tall, with a gilded dragon on top. In Utrecht the bishop’s church has its Dom tower, 112 m, the tallest church tower the Netherlands will ever have.',
  },
  {
    from: 1389,
    title: '1389: The Begijnhof in Amsterdam',
    text: 'Amsterdam’s beguines have a court of their own off the Kalverstraat, first named in 1389. It is still there, hidden behind a door off a busy square.',
  },
  {
    from: 1455,
    title: '1455: A town hall for Brussels',
    text: 'Brussels finishes its town hall on the Grand Place, built in two goes since 1401, with a lacy tower 96 m tall and Saint Michael on top.',
  },
  {
    from: 1469,
    title: '1469: Leuven’s town hall',
    text: 'Leuven answers with a town hall of its own, every inch of it covered in pinnacles, niches and tracery: Gothic at its richest.',
  },
  {
    from: 1521,
    title: '1521: The towers of Antwerp and Mechelen',
    text: 'Antwerp’s cathedral tower is finished at 123 m. In Mechelen, St Rumbold’s tower stops at 97 m: it was meant to reach about 167 m, but the money ran out.',
  },
  {
    from: 1565,
    title: '1565: A new style from Italy',
    text: 'Antwerp, now the busiest port in Europe, builds a city hall by Cornelis Floris with columns, a pediment and classical orders from Rome: the Renaissance has come north.',
  },
  {
    from: 1597,
    title: '1597: Mills that saw wood',
    text: 'On the Zaan, north of Amsterdam, Cornelis Corneliszoon patents an improved wind-driven sawmill. It cuts logs into planks many times faster than men with saws, and the shipyards boom.',
  },
  {
    from: 1613,
    title: '1613: The canal ring',
    text: 'Amsterdam begins its ring of three canals, the Herengracht, Keizersgracht and Prinsengracht, and sells the plots beside them to merchants who build tall, narrow houses with gables.',
  },
  {
    from: 1631,
    title: '1631: Two churches, two faiths',
    text: 'In Antwerp, the Jesuits have built a Baroque church full of marble and gold for the Catholic south. In Amsterdam, the Westerkerk, still the largest church in the Netherlands built for Protestants, is finished: light, plain and white inside.',
  },
  {
    from: 1641,
    title: '1641: A house for a count',
    text: 'In The Hague, the Mauritshuis is finished for Count John Maurice of Nassau, governor of Dutch Brazil, to a design by Jacob van Campen and Pieter Post: calm, square and classical, with columns flat against the walls.',
  },
  {
    from: 1655,
    title: '1655: The eighth wonder of the world',
    text: 'Amsterdam opens its new town hall on the Dam, by Jacob van Campen, a palace of stone for a city of merchants, standing on 13,659 wooden piles, in the same calm, classical style as his Mauritshuis.',
  },
  {
    from: 1695,
    title: '1695: Brussels bombarded',
    text: 'In August a French army fires thousands of cannonballs and firebombs into Brussels. The Grand Place burns; only the stone shell of the town hall still stands.',
  },
  {
    from: 1700,
    title: '1700: The Grand Place rebuilt',
    text: 'Within about five years the guilds have rebuilt their houses on the Grand Place, with gilded Baroque gables, finer than before.',
  },
  {
    from: 1740,
    title: '1740: The mills of Kinderdijk',
    text: 'Nineteen mills are built at Kinderdijk to pump the water out of the Alblasserwaard, lifting it in two steps from the polder into the river.',
  },
  {
    from: 1830,
    title: '1830: Two kingdoms',
    text: 'Belgium breaks away from the Netherlands. Both kingdoms will soon want grand buildings for their museums, courts and stations, and for a while they build them in the styles of the past.',
  },
  {
    from: 1885,
    title: '1885: Grand buildings in old styles',
    text: 'Brussels has finished Joseph Poelaert’s Palace of Justice, the largest building of the century. Amsterdam opens the Rijksmuseum, by Pierre Cuypers, in a mix of Gothic and Renaissance. The new age builds in the styles of the past.',
  },
  {
    from: 1893,
    title: '1893: A house of curving lines',
    text: 'In Brussels, Victor Horta finishes a house for Professor Émile Tassel, with iron columns, a stair under a glass roof and lines that curve like plant stems: one of the first buildings of Art Nouveau.',
  },
  {
    from: 1899,
    title: '1899: A palace for the workers',
    text: 'Horta’s Maison du Peuple opens in Brussels for the Belgian Workers’ Party: an iron and glass front, shops, a café and a hall for more than 2,000 people.',
  },
  {
    from: 1905,
    title: '1905: A station and an exchange',
    text: 'Antwerp’s new Central Station, a “railway cathedral” of stone, iron and glass, is finished. In Amsterdam, H. P. Berlage’s exchange shows bare brick and iron, with ornament only where it is needed.',
  },
  {
    from: 1911,
    title: '1911: A palace from Vienna',
    text: 'The banker Adolphe Stoclet moves into the palace Josef Hoffmann built him in Brussels: white marble boxes edged in bronze, with mosaics by Gustav Klimt in the dining room.',
  },
  {
    from: 1914,
    title: '1914: War',
    text: 'Germany invades Belgium. Leuven’s university library is burned, and German shells begin to destroy Ypres. By 1918 its Cloth Hall is a stump of broken walls.',
  },
  {
    from: 1920,
    title: '1920: The last steam giant',
    text: 'At Lemmer in Friesland the Wouda pumping station starts work, the largest steam pumping station ever built. Steam and then electric pumps take over from the mills.',
  },
  {
    from: 1921,
    title: '1921: Het Schip',
    text: 'In Amsterdam, Michel de Klerk finishes Het Schip, “the ship”, a block of workers’ flats in curving brick with a tower, built under the Housing Act of 1901. Its style is called the Amsterdam School.',
  },
  {
    from: 1924,
    title: '1924: A house of planes and colours',
    text: 'In Utrecht, Gerrit Rietveld builds a house for Truus Schröder and her three children, made of flat planes and lines in white, grey and the primary colours, with walls upstairs that slide away.',
  },
  {
    from: 1931,
    title: '1931: Glass, light and air',
    text: 'In Rotterdam, the Van Nelle factory for coffee, tea and tobacco is finished, with walls of glass. In Hilversum, Willem Dudok’s town hall stacks blocks of yellow brick around a tall tower.',
  },
  {
    from: 1940,
    title: '1940: Rotterdam bombed',
    text: 'On 14 May 1940 German bombers destroy the centre of Rotterdam. The city decides not to rebuild the old streets but to build a new, modern centre.',
  },
  {
    from: 1953,
    title: '1953: The Lijnbaan',
    text: 'Rotterdam opens the Lijnbaan, low shops along a street for walkers only, one of the first of its kind in Europe.',
  },
  {
    from: 1958,
    title: '1958: Expo 58 and the Atomium',
    text: 'Brussels holds the first world’s fair since the war. Its symbol is the Atomium, nine spheres 18 m across, an iron crystal magnified 165 billion times. It was meant to stand for six months.',
  },
  {
    from: 1965,
    title: '1965: The Maison du Peuple pulled down',
    text: 'Despite protests from more than 700 architects, Horta’s Maison du Peuple is demolished to make way for an office tower. The loss helps turn Brussels to protecting its old buildings.',
  },
  {
    from: 1967,
    title: '1967: Ypres rebuilt',
    text: 'The Cloth Hall of Ypres is finished again, rebuilt as it was, more than fifty years after it was shot to pieces.',
  },
  {
    from: 1984,
    title: '1984: Living in a cube',
    text: 'In Rotterdam, Piet Blom’s cube houses are finished: cubes tipped on one corner and set on poles, like trees in a wood.',
  },
  {
    from: 1996,
    title: '1996: The Swan',
    text: 'Rotterdam opens the Erasmus Bridge across the Maas, with a white pylon 139 m tall. People call it the Swan.',
  },
  {
    from: 2000,
    title: '2000: World heritage',
    text: 'In a few years UNESCO has listed the mills of Kinderdijk (1997), the Flemish béguinages (1998), the belfries (1999), and Horta’s town houses and the Rietveld Schröder House (2000).',
  },
]

export const buildingsStory: TimeStory = {
  place: 'the Low Countries',
  bounds: [
    [2.55, 50.3],
    [6.95, 53.0],
  ],
  min: BUILDINGS_MIN,
  max: BUILDINGS_MAX,
  format: String,
  events: buildingsEvents,
  lines: [],
  sites: buildingsSites,
  labels: buildingsLabels,
  note: 'Each building appears in the year it was finished, in the colour of its style. A building destroyed turns grey.',
  key: [
    { swatch: 'key-gothic', text: 'Gothic' },
    { swatch: 'key-classic', text: 'Renaissance and Baroque' },
    { swatch: 'key-revival', text: 'Old styles revived, 1800s' },
    { swatch: 'key-nouveau', text: 'Art Nouveau' },
    { swatch: 'key-modern', text: 'Modern' },
    { swatch: 'key-beguinage', text: 'Béguinage' },
    { swatch: 'key-mill', text: 'Mill or pumping station' },
    { swatch: 'key-lost', text: 'Destroyed' },
  ],
}
