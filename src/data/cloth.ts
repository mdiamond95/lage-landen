// The wool and cloth trade map for Unit 3: English wool into Flanders, Flemish
// cloth out to the fairs and the wider world, and the goods Bruges drew in.
// Coordinates are [lon, lat] (WGS84). Sea routes are drawn through a few points
// to keep them off the land; they show the direction of trade, not exact courses.
// The coastline is today's: in 1300 the Zwin, Zeeland and the Zuiderzee looked different.

import { eventAt as stageAt, type Dated, type HistEvent } from './timeline'

export { activeAt } from './timeline'

export type Flow = 'wool' | 'cloth' | 'goods'
export type Route = Dated & { name: string; flow: Flow; coords: [number, number][]; label?: { text: string; at: [number, number] } }
export type Town = Dated & {
  name: string
  kind: 'wool' | 'cloth' | 'market'
  at: [number, number]
  label?: 'left' | 'right' | 'above' | 'below'
}
export type Region = Dated & { text: string; at: [number, number]; small?: boolean }

const P = {
  boston: [-0.03, 52.98],
  london: [-0.12, 51.51],
  calais: [1.86, 50.95],
  sluis: [3.39, 51.31],
  damme: [3.28, 51.25],
  bruges: [3.225, 51.209],
  ghent: [3.717, 51.054],
  ypres: [2.885, 50.851],
  douai: [3.08, 50.37],
  arras: [2.78, 50.29],
  provins: [3.3, 48.56],
  troyes: [4.07, 48.3],
  brussels: [4.357, 50.847],
  leuven: [4.7, 50.879],
  mechelen: [4.48, 51.03],
  antwerp: [4.402, 51.219],
  maastricht: [5.69, 50.85],
  aachen: [6.08, 50.775],
  cologne: [6.96, 50.94],
  dordrecht: [4.67, 51.81],
} satisfies Record<string, [number, number]>

export const routeIds = [
  'wool-boston',
  'wool-london',
  'wool-calais',
  'wool-inland',
  'calais-inland',
  'cloth-fairs',
  'cloth-fairs-ghent',
  'galleys',
  'wine',
  'hanse',
  'land-road',
  'rhine',
  'brabant-cloth',
] as const
export type RouteId = (typeof routeIds)[number]

export const routes: Record<RouteId, Route> = {
  'wool-boston': {
    name: 'English wool from Boston',
    flow: 'wool',
    from: 1180,
    to: 1362,
    off: [[1336, 1337]],
    coords: [P.boston, [0.35, 53.03], [1.9, 52.95], [3.0, 51.65], P.sluis],
    label: { text: 'wool', at: [1.55, 52.62] },
  },
  'wool-london': {
    name: 'English wool from London',
    flow: 'wool',
    from: 1180,
    to: 1362,
    off: [[1336, 1337]],
    coords: [P.london, [0.9, 51.5], [1.7, 51.45], [2.9, 51.42], P.sluis],
  },
  'wool-calais': {
    name: 'English wool through the Calais staple',
    flow: 'wool',
    from: 1363,
    coords: [P.london, [0.9, 51.47], [1.45, 51.2], P.calais],
    label: { text: 'wool', at: [0.8, 51.2] },
  },
  'wool-inland': {
    name: 'Wool from Bruges to the weaving towns',
    flow: 'wool',
    from: 1180,
    to: 1362,
    off: [[1336, 1337]],
    coords: [P.bruges, [3.0, 51.03], P.ypres],
  },
  'calais-inland': {
    name: 'Wool from Calais to the weaving towns',
    flow: 'wool',
    from: 1363,
    coords: [P.calais, [2.4, 50.9], P.ypres, [3.3, 50.95], P.ghent],
  },
  'cloth-fairs': {
    name: 'Flemish cloth to the Champagne fairs',
    flow: 'cloth',
    from: 1180,
    to: 1320,
    coords: [P.ypres, P.arras, [3.0, 49.45], P.provins, P.troyes],
    label: { text: 'cloth', at: [2.62, 49.5] },
  },
  'cloth-fairs-ghent': {
    name: 'Cloth from Ghent and Douai to the fairs',
    flow: 'cloth',
    from: 1180,
    to: 1320,
    coords: [P.ghent, [3.3, 50.75], P.douai, P.arras],
  },
  galleys: {
    name: 'Italian galleys: Flemish cloth out, spices and silk in',
    flow: 'cloth',
    from: 1277,
    coords: [P.sluis, [2.6, 51.33], [1.55, 51.02], [0.6, 50.55], [-0.95, 50.27]],
    label: { text: 'to Genoa and Venice', at: [0.15, 50.6] },
  },
  wine: {
    name: 'Wine from Gascony and Poitou',
    flow: 'goods',
    from: 1200,
    coords: [[-0.95, 49.85], [0.3, 50.12], [1.25, 50.62], [2.35, 51.18], P.sluis, P.damme],
    label: { text: 'wine from France', at: [0.55, 50.1] },
  },
  hanse: {
    name: 'Hanseatic ships: cloth out, furs, wax, grain and timber in',
    flow: 'goods',
    from: 1252,
    coords: [P.sluis, [3.65, 51.75], [4.25, 52.4], [4.7, 53.2], [6.0, 53.65], [8.0, 53.95], [9.05, 53.9]],
    label: { text: 'to Hamburg and the Baltic', at: [7.2, 54.12] },
  },
  'land-road': {
    name: 'The land road from Bruges to Cologne',
    flow: 'goods',
    from: 1100,
    coords: [P.bruges, P.ghent, P.brussels, P.leuven, [5.2, 50.8], P.maastricht, P.aachen, P.cologne],
  },
  rhine: {
    name: 'Rhine wine down to Dordrecht',
    flow: 'goods',
    from: 1200,
    coords: [P.cologne, [6.7, 51.35], [6.15, 51.85], [5.5, 51.83], [5.0, 51.8], P.dordrecht],
    label: { text: 'Rhine wine', at: [6.75, 51.62] },
  },
  'brabant-cloth': {
    name: 'Cloth from Brussels and Mechelen to Antwerp',
    flow: 'cloth',
    from: 1300,
    coords: [P.brussels, P.mechelen, P.antwerp],
  },
}

export const towns: Town[] = [
  { name: 'London', kind: 'wool', from: 1100, at: P.london, label: 'below' },
  { name: 'Boston', kind: 'wool', from: 1180, at: P.boston, label: 'left' },
  { name: 'Calais', kind: 'wool', from: 1363, at: P.calais, label: 'left' },
  { name: 'Bruges', kind: 'market', from: 1100, at: P.bruges, label: 'left' },
  { name: 'Damme', kind: 'market', from: 1180, at: P.damme },
  { name: 'Ghent', kind: 'cloth', from: 1100, at: P.ghent, label: 'above' },
  { name: 'Ypres', kind: 'cloth', from: 1100, at: P.ypres, label: 'left' },
  { name: 'Douai', kind: 'cloth', from: 1180, at: P.douai, label: 'right' },
  { name: 'Arras', kind: 'cloth', from: 1180, at: P.arras, label: 'left' },
  { name: 'Provins', kind: 'market', from: 1180, to: 1320, at: P.provins, label: 'left' },
  { name: 'Troyes', kind: 'market', from: 1180, to: 1320, at: P.troyes, label: 'right' },
  { name: 'Brussels', kind: 'cloth', from: 1300, at: P.brussels, label: 'below' },
  { name: 'Leuven', kind: 'cloth', from: 1300, at: P.leuven, label: 'right' },
  { name: 'Mechelen', kind: 'cloth', from: 1300, at: P.mechelen },
  { name: 'Antwerp', kind: 'market', from: 1300, at: P.antwerp, label: 'right' },
  { name: 'Cologne', kind: 'market', from: 1100, at: P.cologne, label: 'right' },
  { name: 'Dordrecht', kind: 'market', from: 1200, at: P.dordrecht, label: 'above' },
]

export const regions: Region[] = [
  { text: 'England', from: 1100, at: [0.75, 52.3] },
  { text: 'North Sea', from: 1100, at: [2.7, 53.45] },
  { text: 'Kingdom of France', from: 1100, at: [1.6, 49.25] },
  { text: 'Holy Roman Empire', from: 1100, at: [7.3, 52.6] },
  { text: 'Flanders', from: 1100, at: [2.4, 50.6], small: true },
  { text: 'Brabant', from: 1100, at: [5.2, 51.45], small: true },
  { text: 'Holland', from: 1100, at: [4.95, 52.45], small: true },
]

export const CLOTH_MIN = 1100
export const CLOTH_MAX = 1384

// One caption per stage. Each runs until the next one starts.
export const clothEvents: HistEvent[] = [
  {
    from: 1100,
    title: 'About 1100: Cloth from Flemish sheep',
    text: 'Weavers in Ghent, Ypres and Bruges make cloth from the wool of sheep grazing on the coastal marshes. Goods already travel the old land road to Cologne.',
  },
  {
    from: 1180,
    title: 'The 1100s: Wool from England',
    text: 'Flemish towns now weave far more than their own sheep can supply. Ships bring sacks of fine English wool from London and Boston to Bruges, and Flemish cloth goes south to the great fairs of Champagne.',
  },
  {
    from: 1200,
    title: 'About 1200: Wine comes north',
    text: 'Ships bring wine from western France to Damme, the port of Bruges, founded around 1180 on the new Zwin inlet. Rhine wine floats down the river from Cologne to Dordrecht.',
  },
  {
    from: 1252,
    title: '1252: The Hanse comes to Bruges',
    text: 'Countess Margaret grants privileges to German merchants of the Hanse. Their ships bring furs, wax, grain and timber from the Baltic and take Flemish cloth back.',
  },
  {
    from: 1277,
    title: '1277: Galleys from Genoa',
    text: 'Genoese ships sail straight to Bruges around Spain, and Venetian galleys follow in the 1310s, bringing spices, silk and alum. Bruges becomes the market of northern Europe, and the Champagne fairs slowly fade.',
  },
  {
    from: 1300,
    title: 'About 1300: Brabant weaves too',
    text: 'Leuven and Brussels in Brabant, and nearby Mechelen, make fine cloth of their own and sell it through Antwerp and along the road to Cologne.',
  },
  {
    from: 1336,
    title: '1336: England stops the wool',
    text: 'At the start of his war with France, Edward III bans wool exports to Flanders. Looms in Ghent and Ypres fall silent and weavers go hungry.',
  },
  {
    from: 1338,
    title: '1338: Ghent sides with England',
    text: 'Jacob van Artevelde takes charge in Ghent and strikes a deal with Edward III: Flanders stays out of the war, and the wool flows again. In 1340 Ghent openly takes England\'s side.',
  },
  {
    from: 1363,
    title: '1363: The Calais staple',
    text: 'England now sells all its exported wool through Calais, which it captured in 1347. Flemish buyers must fetch it there.',
  },
  {
    from: 1384,
    title: '1384: Flanders passes to Burgundy',
    text: 'Count Louis of Male dies and Flanders goes to his son-in-law, Philip the Bold, duke of Burgundy. A new era begins.',
  },
]

export const clothEventAt = (year: number) => stageAt(clothEvents, year)
