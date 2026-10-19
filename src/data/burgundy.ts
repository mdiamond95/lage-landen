// The Burgundian map for Unit 4: the lands of the Low Countries joining the dukes
// of Burgundy and then Charles V, 1384 to 1555. Medieval borders were not today's,
// so each territory is drawn with the modern provinces closest to it, and French
// Flanders, Artois, Limburg and Tournai with rough hand-drawn cuts. The map shows
// who ruled roughly where, not exact borders. Coordinates are [lon, lat] (WGS84).

import type { HistArea, HistEvent, HistLabel, HistSite, TimeStory } from './timeline'

export const BURGUNDY_MIN = 1384
export const BURGUNDY_MAX = 1555

// Rough cuts of the French map for the parts of Flanders and Artois now in France,
// and of the province of Liège for the old duchy of Limburg. The revolt map uses them too.
export const frenchFlanders: [number, number][] = [
  [2.1, 51.08], [2.6, 51.12], [2.62, 50.95], [2.9, 50.72], [3.1, 50.8], [3.3, 50.6], [3.3, 50.45],
  [3.2, 50.3], [3.0, 50.33], [2.85, 50.48], [2.6, 50.6], [2.35, 50.68], [2.12, 50.95],
]
export const artois: [number, number][] = [
  [2.12, 50.95], [2.35, 50.68], [2.6, 50.6], [2.85, 50.48], [3.0, 50.33], [3.05, 50.2], [2.9, 50.08],
  [2.5, 50.1], [2.05, 50.3], [1.98, 50.6], [2.0, 50.85],
]
export const limburgDuchy: [number, number][] = [[5.7, 50.77], [6.05, 50.78], [6.12, 50.62], [5.95, 50.55], [5.72, 50.6]]

// Later entries draw on top: Limburg over Liège, Tournai over Hainaut.
const areas: HistArea[] = [
  { name: 'Still sea', kind: 'sea', from: BURGUNDY_MIN, regions: ['NL-FL'] },
  { name: 'Flanders', kind: 'ruled', from: 1384, regions: ['BE-VWV', 'BE-VOV'] },
  { name: 'French Flanders', kind: 'ruled', from: 1384, regions: ['FRA'], clip: frenchFlanders },
  { name: 'Artois', kind: 'ruled', from: 1384, off: [[1477, 1492]], regions: ['FRA'], clip: artois },
  { name: 'Namur', kind: 'ruled', from: 1421, regions: ['BE-WNA'] },
  { name: 'Brabant', kind: 'ruled', from: 1430, regions: ['NL-NB', 'BE-VAN', 'BE-VBR', 'BE-WBR', 'BE-BRU'] },
  { name: 'Holland, Zeeland and Hainaut', kind: 'ruled', from: 1433, regions: ['NL-NH', 'NL-ZH', 'NL-ZE', 'BE-WHT'] },
  { name: 'Luxembourg', kind: 'ruled', from: 1443, regions: ['LUX', 'BE-WLX'] },
  { name: 'Liège', kind: 'client', from: 1456, to: 1476, regions: ['BE-WLG', 'BE-VLI'] },
  { name: 'Utrecht (bishop)', kind: 'client', from: 1456, to: 1527, regions: ['NL-UT', 'NL-OV'] },
  {
    name: 'Limburg',
    kind: 'ruled',
    from: 1430,
    regions: ['BE-WLG'],
    clip: limburgDuchy,
  },
  {
    name: 'Tournai',
    kind: 'outside',
    from: BURGUNDY_MIN,
    to: 1520,
    regions: ['BE-WHT'],
    clip: [[3.25, 50.68], [3.5, 50.7], [3.6, 50.58], [3.45, 50.5], [3.25, 50.55]],
  },
  { name: 'Guelders (Charles the Bold)', kind: 'ruled', from: 1473, to: 1492, regions: ['NL-GE', 'NL-LI'] },
  { name: 'Tournai (Charles V)', kind: 'ruled', from: 1521, regions: ['BE-WHT'], clip: [[3.25, 50.68], [3.5, 50.7], [3.6, 50.58], [3.45, 50.5], [3.25, 50.55]] },
  { name: 'Friesland', kind: 'ruled', from: 1524, regions: ['NL-FR'] },
  { name: 'Utrecht and Overijssel', kind: 'ruled', from: 1528, regions: ['NL-UT', 'NL-OV'] },
  { name: 'Groningen and Drenthe', kind: 'ruled', from: 1536, regions: ['NL-GR', 'NL-DR'] },
  { name: 'Guelders', kind: 'ruled', from: 1543, regions: ['NL-GE', 'NL-LI'] },
]

const labels: HistLabel[] = [
  { text: 'FRANCE', kind: 'people', from: BURGUNDY_MIN, at: [3.4, 49.7] },
  { text: 'EMPIRE', kind: 'people', from: BURGUNDY_MIN, at: [7.0, 51.35] },
  { text: 'Flanders', kind: 'territory', from: BURGUNDY_MIN, at: [3.3, 51.02] },
  { text: 'Artois', kind: 'territory', from: BURGUNDY_MIN, at: [2.45, 50.4] },
  { text: 'Namur', kind: 'territory', from: BURGUNDY_MIN, at: [4.85, 50.25] },
  { text: 'Brabant', kind: 'territory', from: BURGUNDY_MIN, at: [4.9, 51.42] },
  { text: 'Holland', kind: 'territory', from: BURGUNDY_MIN, at: [4.55, 52.35] },
  { text: 'Zeeland', kind: 'territory', from: BURGUNDY_MIN, at: [3.75, 51.55] },
  { text: 'Hainaut', kind: 'territory', from: BURGUNDY_MIN, at: [3.95, 50.48] },
  { text: 'Luxembourg', kind: 'territory', from: BURGUNDY_MIN, at: [5.75, 49.85] },
  { text: 'Liège', kind: 'territory', from: BURGUNDY_MIN, at: [5.55, 50.45] },
  { text: 'Utrecht', kind: 'territory', from: BURGUNDY_MIN, at: [5.4, 52.2] },
  { text: 'Guelders', kind: 'territory', from: BURGUNDY_MIN, at: [6.0, 52.05] },
  { text: 'Friesland', kind: 'territory', from: BURGUNDY_MIN, at: [5.75, 53.08] },
  { text: 'Groningen', kind: 'territory', from: BURGUNDY_MIN, at: [6.75, 53.25] },
  { text: 'THE SEVENTEEN PROVINCES', kind: 'water', from: 1549, at: [3.7, 52.85] },
]

const sites: HistSite[] = [
  { name: 'Bruges', kind: 'town', from: BURGUNDY_MIN, at: [3.225, 51.209], label: 'left' },
  { name: 'Ghent', kind: 'town', from: BURGUNDY_MIN, at: [3.717, 51.054], label: 'right' },
  { name: 'Lille', kind: 'town', from: BURGUNDY_MIN, at: [3.063, 50.633], label: 'left' },
  { name: 'Brussels', kind: 'town', from: 1430, at: [4.357, 50.847], label: 'right' },
  { name: 'Mechelen', kind: 'town', from: 1430, at: [4.48, 51.028], label: 'right' },
  { name: 'Antwerp', kind: 'town', from: 1430, at: [4.402, 51.219], label: 'right' },
]

const events: HistEvent[] = [
  {
    from: 1384,
    title: '1384: Flanders goes to Burgundy',
    text: 'The count of Flanders dies. His daughter Margaret and her husband, Duke Philip the Bold of Burgundy, inherit Flanders and Artois.',
  },
  {
    from: 1421,
    title: '1421: Philip the Good buys Namur',
    text: 'Philip the Bold\'s grandson buys the county of Namur. Its old count keeps it until he dies in 1429.',
  },
  {
    from: 1430,
    title: '1430: Brabant and Limburg',
    text: 'Philip inherits the duchies of Brabant and Limburg from a cousin. Brussels, Leuven and Antwerp are now his.',
  },
  {
    from: 1433,
    title: '1433: Holland, Zeeland and Hainaut',
    text: 'After years of war, Countess Jacqueline of Bavaria has to hand her three counties to Philip.',
  },
  {
    from: 1443,
    title: '1443: Luxembourg',
    text: 'Philip has bought the rights to Luxembourg, and his troops take the city in a night attack. He now rules most of the Low Countries.',
  },
  {
    from: 1456,
    title: '1456: Bishops in the family',
    text: 'Philip makes his son David bishop of Utrecht and his nephew Louis of Bourbon prince-bishop of Liège. Their lands stay separate, but Burgundy pulls the strings.',
  },
  {
    from: 1468,
    title: '1468: Liège burns',
    text: 'Liège rebels against its Burgundian bishop. Charles the Bold, Philip\'s son, storms the city and has it burned.',
  },
  {
    from: 1473,
    title: '1473: Guelders',
    text: 'Charles the Bold takes the duchy of Guelders. He dreams of a kingdom between France and the Empire.',
  },
  {
    from: 1477,
    title: '1477: Charles dies at Nancy',
    text: 'Charles is killed in battle. France seizes the duchy of Burgundy itself and Artois, and Liège throws off its Burgundian bishop. His daughter Mary keeps the Low Countries.',
  },
  {
    from: 1493,
    title: '1493: Artois comes back',
    text: 'A treaty at Senlis returns Artois to Mary\'s son, Philip the Handsome. But Guelders has broken free under a duke of its own.',
  },
  {
    from: 1500,
    title: '1500: A prince born in Ghent',
    text: 'Philip the Handsome\'s son Charles is born in Ghent. He will inherit the Low Countries, Spain and Austria.',
  },
  {
    from: 1521,
    title: '1521: Tournai',
    text: 'Charles, now emperor as Charles V, takes Tournai from France.',
  },
  {
    from: 1524,
    title: '1524: Friesland',
    text: 'After years of war in Friesland, Charles V is accepted as its lord.',
  },
  {
    from: 1528,
    title: '1528: Utrecht and Overijssel',
    text: 'The bishop of Utrecht hands his worldly power to Charles V.',
  },
  {
    from: 1536,
    title: '1536: Groningen and Drenthe',
    text: 'Groningen and Drenthe accept Charles V.',
  },
  {
    from: 1543,
    title: '1543: Guelders, at last',
    text: 'By the Treaty of Venlo, Guelders and Zutphen become Charles\'s. The Netherlands are one bloc for the first time.',
  },
  {
    from: 1549,
    title: '1549: The Seventeen Provinces',
    text: 'The Pragmatic Sanction says the provinces must pass to one heir, never to be split.',
  },
  {
    from: 1555,
    title: '1555: Charles steps down',
    text: 'In Brussels, Charles V hands the Seventeen Provinces to his son, Philip II.',
  },
]

export const burgundyStory: TimeStory = {
  place: 'the Low Countries',
  min: BURGUNDY_MIN,
  max: BURGUNDY_MAX,
  format: String,
  events,
  lines: [],
  sites,
  labels,
  areas,
  note: 'Borders are approximate and drawn with today\'s provinces. The prince-bishopric of Liège never joined.',
  key: [
    { swatch: 'key-ruled', text: 'Burgundian, then Habsburg' },
    { swatch: 'key-client', text: 'Under a Burgundian bishop' },
    { swatch: 'key-new', text: 'Just joined' },
  ],
}
