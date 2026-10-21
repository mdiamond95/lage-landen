// Route maps of the classic races (Unit 23): the Tour of Flanders of 2025 over its cobbled climbs,
// Liège–Bastogne–Liège out to the Ardennes and back, and the Elfstedentocht on the ice past the
// eleven towns of Friesland; and, for Unit 11, the road of Operation Market Garden from the Belgian
// border to Arnhem in September 1944, and, for Unit 8, Napoleon's last four days in June 1815. A route is a list of places, visited in the order of `path`; a place
// can be passed more than once (the Oude Kwaremont and the Paterberg are climbed twice in 2025).
// `via` points bend the line between two places so it doesn't cut across a lake or a hill. The
// climbs' lengths and gradients are those of the race's own route book, as Wikipedia gives them.
// Coordinates are [lon, lat]; the climbs are placed at their tops, to within about a kilometre.

export type RoutePlace = {
  name: string
  at: [number, number]
  // A climb's length, average and steepest gradient, and how much of it is cobbled.
  climb?: { m: number; avg: number; max: number; cobbles?: number }
  about: string
  // The start or finish, named on the map even in a question.
  end?: boolean
}

export type RouteStep = { place: string; km?: number; via?: [number, number][] }

export type Route = {
  title: string
  // Named on the map's accessible label and on the card before a stop is chosen.
  intro: string
  places: Record<string, RoutePlace>
  path: RouteStep[]
  // How `km` counts: from the start, or down to the finish (the Tour of Flanders' route book).
  km?: 'from-start' | 'to-finish'
  // Towns, waters and hills named on the map for orientation, not stops on the route.
  labels: { text: string; at: [number, number]; kind?: 'water' | 'town' }[]
  // Two corners, [lon, lat], to frame; otherwise the places themselves.
  bounds?: [[number, number], [number, number]]
  // What moves along the line: a rider, a skater, a column of tanks or an army under its flag.
  mover: 'rider' | 'skater' | 'convoy' | 'army'
  note: string
}

const ronde: Route = {
  title: 'Tour of Flanders, 2025: the last 92 km',
  intro:
    'On 6 April 2025 the Tour of Flanders ran 268.9 km from Bruges to Oudenaarde. Its last 92 km wind over the hills of the Flemish Ardennes, up and down short, steep climbs, many of them cobbled. Step along the route, or tap a climb.',
  km: 'to-finish',
  mover: 'rider',
  places: {
    berendries: { name: 'Berendries', at: [3.77, 50.806], climb: { m: 940, avg: 7, max: 12.3 }, about: 'A tarmac climb in Brakel, the first of the hills in this stretch.' },
    valkenberg: { name: 'Valkenberg', at: [3.792, 50.797], climb: { m: 540, avg: 8.1, max: 12.8 }, about: 'Short and steep, also in Brakel.' },
    'berg-ten-houte': { name: 'Berg ten Houte', at: [3.7, 50.823], climb: { m: 1100, avg: 6.3, max: 21 }, about: 'Over a kilometre long, with one ramp of 21%.' },
    kruisberg: {
      name: 'Oude Kruisberg',
      at: [3.598, 50.763],
      climb: { m: 2500, avg: 5, max: 9, cobbles: 450 },
      about: 'Above Ronse, the town on the language border: the cobbles at the bottom, the Hotondberg on top.',
    },
    kwaremont: {
      name: 'Oude Kwaremont',
      at: [3.533, 50.779],
      climb: { m: 2200, avg: 4, max: 11.6, cobbles: 1500 },
      about: 'The longest cobbled climb of the race, 1.5 km of stones on a 2.2 km climb. Crowds line it three deep, and in 2025 it was climbed three times; here are the last two.',
    },
    paterberg: {
      name: 'Paterberg',
      at: [3.551, 50.772],
      climb: { m: 360, avg: 12.9, max: 20.3, cobbles: 360 },
      about: 'A local farmer had the lane cobbled in 1986, so the story goes, because he wanted the race to pass his house. It did, that same year. Only 360 m, all cobbles, up to 20%.',
    },
    koppenberg: {
      name: 'Koppenberg',
      at: [3.582, 50.811],
      climb: { m: 600, avg: 11.6, max: 22, cobbles: 600 },
      about: 'The steepest climb of the race, 22% on wet, uneven cobbles, so narrow that one slip can stop the riders behind and send them walking.',
    },
    steenbeekdries: { name: 'Steenbeekdries', at: [3.613, 50.806], climb: { m: 1100, avg: 3.1, max: 7.6, cobbles: 1100 }, about: 'A gentle cobbled rise, all stones.' },
    taaienberg: {
      name: 'Taaienberg',
      at: [3.627, 50.8],
      climb: { m: 530, avg: 6.6, max: 15.8, cobbles: 500 },
      about: 'Tom Boonen made his move here so often that commentators began calling it Boonen’s hill.',
    },
    oudenaarde: { name: 'Oudenaarde', at: [3.6, 50.845], end: true, about: 'The finish since 2012, and home of the race museum, the Centrum Ronde van Vlaanderen.' },
  },
  path: [
    { place: 'berendries', km: 91.5 },
    { place: 'valkenberg', km: 86.2 },
    { place: 'berg-ten-houte', km: 73.7 },
    { place: 'kruisberg', km: 64.5, via: [[3.66, 50.79]] },
    { place: 'kwaremont', km: 54.3 },
    { place: 'paterberg', km: 50.9 },
    { place: 'koppenberg', km: 44.6 },
    { place: 'steenbeekdries', km: 39.2 },
    { place: 'taaienberg', km: 36.8 },
    { place: 'kruisberg', km: 26.5 },
    { place: 'kwaremont', km: 16.7, via: [[3.56, 50.757]] },
    { place: 'paterberg', km: 13.2 },
    { place: 'oudenaarde', km: 0, via: [[3.57, 50.82]] },
  ],
  labels: [
    { text: 'Ronse', at: [3.6, 50.745], kind: 'town' },
    { text: 'Brakel', at: [3.763, 50.79], kind: 'town' },
    { text: 'Schelde', at: [3.548, 50.825], kind: 'water' },
  ],
  bounds: [
    [3.43, 50.73],
    [3.85, 50.87],
  ],
  note: 'The first 177 km, from Bruges and over the first five climbs, are left out. Climbs are placed at their tops, and the line between them is drawn straight.',
}

const liege: Route = {
  title: 'Liège–Bastogne–Liège',
  intro:
    'The oldest of the great one-day races, first run in 1892, so it is called La Doyenne, the old lady. It runs about 95 km south through the Ardennes to Bastogne and about 160 km back, over one steep hill after another. Step along the route, or tap a place.',
  km: 'from-start',
  mover: 'rider',
  places: {
    liege: { name: 'Liège', at: [5.575, 50.635], end: true, about: 'Start and finish, in the city on the Meuse. From 1992 to 2018 the race finished uphill in Ans, just outside.' },
    bastogne: { name: 'Bastogne', at: [5.72, 50.004], about: 'The turn, about 95 km south: the race heads back north from here.' },
    stockeu: {
      name: 'Côte de Stockeu',
      at: [5.936, 50.384],
      about: 'A short, steep climb near Stavelot. A statue of Eddy Merckx, who won the race five times, stands at the top.',
    },
    redoute: {
      name: 'La Redoute',
      at: [5.7, 50.485],
      climb: { m: 2000, avg: 8.9, max: 20 },
      about: 'Above the motorway at Sougné-Remouchamps, 2 km at 8.9%. In the 1980s and 1990s the winning attack often began here.',
    },
    faucons: {
      name: 'Roche-aux-Faucons',
      at: [5.555, 50.575],
      about: 'The last named climb, its top about 13 km from the finish.',
    },
  },
  path: [
    { place: 'liege', km: 0 },
    { place: 'bastogne', km: 95, via: [[5.6, 50.43], [5.62, 50.22]] },
    { place: 'stockeu', via: [[5.92, 50.2]] },
    { place: 'redoute' },
    { place: 'faucons' },
    { place: 'liege' },
  ],
  labels: [
    { text: 'Meuse', at: [5.33, 50.56], kind: 'water' },
    { text: 'Ourthe', at: [5.62, 50.4], kind: 'water' },
    { text: 'ARDENNES', at: [5.35, 50.2] },
  ],
  bounds: [
    [5.15, 49.95],
    [6.1, 50.7],
  ],
  note: 'The route changes a little every year; this is its shape, with three of its best-known climbs. Lines between places are drawn straight.',
}

const elfsteden: Route = {
  title: 'The Elfstedentocht',
  intro:
    'The Tour of the Eleven Towns: about 200 km on natural ice over the canals, rivers and lakes of Friesland, from Leeuwarden and back, through the eleven towns that once held city rights. It is skated only when the ice is at least 15 cm thick all the way. Step along the route, or tap a town.',
  km: 'from-start',
  mover: 'skater',
  places: {
    leeuwarden: { name: 'Leeuwarden', at: [5.795, 53.2], end: true, about: 'The capital of Friesland: start and finish. The start is in the dark, early in the morning.' },
    sneek: { name: 'Sneek', at: [5.66, 53.033], about: 'A town of water sports, with its gate over the canal, the Waterpoort.' },
    ijlst: { name: 'IJlst', at: [5.62, 53.011], about: 'A small town on the canal, where the Nooitgedagt factory made skates.' },
    sloten: { name: 'Sloten', at: [5.646, 52.895], about: 'The smallest town of Friesland, a few streets round a canal, with a windmill on its wall.' },
    stavoren: { name: 'Stavoren', at: [5.36, 52.884], about: 'The oldest of the eleven, on the shore of the IJsselmeer. The farthest point from the finish.' },
    hindeloopen: { name: 'Hindeloopen', at: [5.402, 52.943], about: 'A former port on the old Zuiderzee, known for its painted furniture.' },
    workum: { name: 'Workum', at: [5.447, 52.979], about: 'A little town known for its pottery and its weigh house of 1650.' },
    bolsward: { name: 'Bolsward', at: [5.531, 53.064], about: 'A town of the Hanseatic League, with a carved town hall.' },
    harlingen: { name: 'Harlingen', at: [5.42, 53.175], about: 'The port on the Wadden Sea, where the ferries leave for the islands.' },
    franeker: { name: 'Franeker', at: [5.54, 53.187], about: 'An old university town, with the oldest working planetarium in the world, built by a wool comber in 1774–1781.' },
    bartlehiem: { name: 'Bartlehiem', at: [5.842, 53.277], about: 'Not a town but a hamlet with a famous bridge: the skaters pass it twice, on the way to Dokkum and back.' },
    dokkum: { name: 'Dokkum', at: [5.999, 53.325], about: 'The last of the eleven, in the far northeast, where Saint Boniface was killed in 754.' },
  },
  path: [
    { place: 'leeuwarden' },
    { place: 'sneek', via: [[5.73, 53.11]] },
    { place: 'ijlst' },
    { place: 'sloten', via: [[5.6, 52.95]] },
    { place: 'stavoren' },
    { place: 'hindeloopen' },
    { place: 'workum' },
    { place: 'bolsward' },
    { place: 'harlingen', via: [[5.45, 53.12]] },
    { place: 'franeker' },
    { place: 'bartlehiem', via: [[5.68, 53.22]] },
    { place: 'dokkum' },
    { place: 'bartlehiem' },
    { place: 'leeuwarden' },
  ],
  labels: [
    { text: 'IJSSELMEER', at: [5.27, 52.92], kind: 'water' },
    { text: 'WADDEN SEA', at: [5.55, 53.36], kind: 'water' },
    { text: 'FRIESLAND', at: [5.9, 53.05] },
  ],
  bounds: [
    [5.2, 52.83],
    [6.08, 53.38],
  ],
  note: 'The ice route bends with the waterways; here the line is drawn straight from town to town.',
}

const marketGarden: Route = {
  title: 'Operation Market Garden, September 1944',
  intro:
    'On 17 September 1944 paratroopers landed along a single road from the Belgian border to Arnhem, to seize its bridges, and British tanks set off up the road to join them: about 100 km, to be covered in two days. Step along the road, or tap a place.',
  km: 'from-start',
  mover: 'convoy',
  places: {
    'joes-bridge': {
      name: 'Joe’s Bridge',
      at: [5.42, 51.235],
      end: true,
      about: 'A bridge over the canal near Lommel, in Belgium, taken a week before. The tanks of XXX Corps set off from here at 14:35 on 17 September.',
    },
    eindhoven: { name: 'Eindhoven', at: [5.478, 51.441], about: 'The first town on the road, freed on 18 September, a day later than planned.' },
    son: {
      name: 'Son',
      at: [5.494, 51.513],
      about: 'The Germans blew up the bridge over the Wilhelmina Canal as the American paratroopers reached it. The tanks had to wait for engineers to build a new one, ready on 19 September.',
    },
    veghel: { name: 'Veghel', at: [5.549, 51.616], about: 'American paratroopers took the bridges over the canal and the river Aa. The road between here and Eindhoven, cut again and again by German attacks, was called Hell’s Highway.' },
    grave: { name: 'Grave', at: [5.74, 51.76], about: 'The long bridge over the Maas, taken on the first day by a small group of American paratroopers dropped close to it.' },
    nijmegen: {
      name: 'Nijmegen',
      at: [5.866, 51.84],
      about: 'The great bridge over the Waal. On 20 September American paratroopers rowed across the river in 26 boats under fire, and that evening British tanks crossed the bridge.',
    },
    arnhem: {
      name: 'Arnhem',
      at: [5.913, 51.977],
      end: true,
      about: 'The bridge over the Rhine, the bridge too far. British paratroopers held its north end from the evening of 17 September until the night of 20 September. The tanks never reached them.',
    },
  },
  path: [
    { place: 'joes-bridge', km: 0 },
    { place: 'eindhoven' },
    { place: 'son' },
    { place: 'veghel' },
    { place: 'grave' },
    { place: 'nijmegen' },
    { place: 'arnhem', km: 100 },
  ],
  labels: [
    { text: 'Maas', at: [5.6, 51.79], kind: 'water' },
    { text: 'Waal', at: [5.65, 51.88], kind: 'water' },
    { text: 'Rhine', at: [5.72, 51.96], kind: 'water' },
    { text: 'BELGIUM', at: [5.55, 51.2] },
  ],
  bounds: [
    [5.25, 51.15],
    [6.1, 52.05],
  ],
  note: 'The road ran north in a nearly straight line; the bridges are placed in their towns.',
}

const waterloo: Route = {
  title: 'Napoleon’s last campaign, June 1815',
  intro:
    'On 15 June 1815 Napoleon’s Army of the North crossed the Sambre at Charleroi, to beat the Prussians and the British-led army one at a time before they could join up. Step along the road, or tap a place.',
  mover: 'army',
  places: {
    charleroi: {
      name: 'Charleroi',
      at: [4.444, 50.411],
      end: true,
      about: 'The French cross the Sambre here on 15 June. By daybreak on 19 June the beaten army is fleeing back over it.',
    },
    ligny: {
      name: 'Ligny',
      at: [4.575, 50.512],
      about: '16 June: Napoleon beats the Prussians under Blücher, but they retreat north in good order, towards Wavre.',
    },
    'quatre-bras': {
      name: 'Quatre Bras',
      at: [4.458, 50.571],
      about: 'The crossroads that Dutch and Belgian troops held against Ney on 16 June. On 17 June Napoleon follows Wellington north from here, in pouring rain.',
    },
    'belle-alliance': {
      name: 'La Belle Alliance',
      at: [4.412, 50.674],
      about: '18 June: the inn at the centre of the French line. Napoleon attacks Wellington, the Prussians arrive from the east at Plancenoit, and the French army breaks. Prussian cavalry chase it south through the night.',
    },
  },
  path: [{ place: 'charleroi' }, { place: 'ligny' }, { place: 'quatre-bras' }, { place: 'belle-alliance', via: [[4.451, 50.611]] }, { place: 'charleroi', via: [[4.451, 50.611], [4.462, 50.576], [4.432, 50.47]] }],
  labels: [
    { text: 'Genappe', at: [4.49, 50.612], kind: 'town' },
    { text: 'Waterloo', at: [4.399, 50.73], kind: 'town' },
    { text: 'Wavre', at: [4.607, 50.717], kind: 'town' },
  ],
  bounds: [
    [4.25, 50.37],
    [4.72, 50.75],
  ],
  note: 'The armies are drawn as one line along the main roads; Wellington’s headquarters were in the village of Waterloo, north of the field.',
}

export const routes = { ronde, liege, elfsteden, 'market-garden': marketGarden, waterloo } satisfies Record<string, Route>
export type RouteId = keyof typeof routes
export const routeIds = Object.keys(routes) as [RouteId, ...RouteId[]]
// Every place on every route, for questions that ask for one: "ronde.koppenberg".
export const placeIdsOf = (id: RouteId) => Object.keys(routes[id].places)
