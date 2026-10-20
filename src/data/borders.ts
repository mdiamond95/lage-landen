// The border-change map for Unit 8: from the Disaster Year to Waterloo, 1672 to 1815.
// The north is the Dutch Republic, then a republic and a kingdom run under France,
// then part of France itself; the south passes from Spain to Austria, is fought over
// in war after war, rises in revolt and is annexed to France, until the Congress of
// Vienna joins north and south in one kingdom. As on the earlier maps, each land is
// drawn with the modern provinces closest to it, cut by rough hand-drawn shapes where
// only part of one changed hands. Coordinates are [lon, lat] (WGS84).

import { artois, frenchFlanders, limburgDuchy } from './burgundy'
import { sides, zeelandicFlanders, zeelandIslands } from './revolt'
import { cambresis, kortrijk, maastricht, tournai, ypres } from './spanish'
import type { HistArea, HistEvent, HistLabel, HistLine, HistSite, TimeStory } from './timeline'

export const BORDERS_MIN = 1672
export const BORDERS_MAX = 1815

// The Eupen and Malmedy lands, which went to Prussia in 1815 (and to Belgium in 1920).
const eastCantons: [number, number][] = [[5.97, 50.76], [6.2, 50.75], [6.42, 50.32], [6.2, 50.12], [5.95, 50.3], [5.98, 50.55]]

const FLANDERS_BRABANT = ['BE-VWV', 'BE-VOV', 'BE-VAN', 'BE-VBR', 'BE-WBR', 'BE-BRU']
const LIEGE = ['BE-WLG', 'BE-VLI']

// Each land's rulers over time. Later entries draw on top: Tournai over Hainaut,
// Limburg over Liège, Maastricht over the rest of Limburg.
const areas: HistArea[] = [
  { name: 'Still sea', kind: 'sea', from: BORDERS_MIN, regions: ['NL-FL'] },
  ...sides('Holland and the north', ['NL-NH', 'NL-ZH', 'NL-FR', 'NL-GR'], [[1672, 'rebel'], [1795, 'sister'], [1810, 'france'], [1813, 'rebel']]),
  // Utrecht and Guelders are overrun by France, Overijssel and Drenthe by Münster.
  ...sides('The east', ['NL-UT', 'NL-GE', 'NL-OV', 'NL-DR'], [[1672, 'france'], [1674, 'rebel'], [1795, 'sister'], [1810, 'france'], [1813, 'rebel']]),
  ...sides('States Brabant', ['NL-NB'], [[1672, 'rebel'], [1795, 'sister'], [1810, 'france'], [1814, 'rebel']]),
  ...sides('Zeeland', ['NL-ZE'], [[1672, 'rebel'], [1795, 'sister'], [1810, 'france'], [1814, 'rebel']], zeelandIslands),
  ...sides('Zeelandic Flanders', ['NL-ZE'], [[1672, 'rebel'], [1747, 'france'], [1748, 'rebel'], [1795, 'france'], [1814, 'rebel']], zeelandicFlanders),
  ...sides('Flanders and Brabant', FLANDERS_BRABANT, [
    [1672, 'ruled'], [1706, 'contested'], [1714, 'austria'], [1746, 'france'], [1748, 'austria'], [1790, 'contested'],
    [1791, 'austria'], [1792, 'france'], [1793, 'austria'], [1794, 'france'], [1814, 'contested'], [1815, 'rebel'],
  ]),
  // Marshal Saxe takes the west first, in 1745, and Brussels and the rest in 1746.
  { name: 'Flanders to France, 1745', kind: 'france', from: 1745, to: 1745, regions: ['BE-VWV', 'BE-VOV'] },
  ...sides('Hainaut', ['BE-WHT'], [
    [1672, 'ruled'], [1709, 'contested'], [1714, 'austria'], [1745, 'france'], [1748, 'austria'], [1790, 'contested'],
    [1791, 'austria'], [1792, 'france'], [1793, 'austria'], [1794, 'france'], [1814, 'contested'], [1815, 'rebel'],
  ]),
  ...sides('Namur', ['BE-WNA'], [
    [1672, 'ruled'], [1692, 'france'], [1695, 'ruled'], [1714, 'austria'], [1746, 'france'], [1748, 'austria'],
    [1790, 'contested'], [1791, 'austria'], [1792, 'france'], [1793, 'austria'], [1794, 'france'], [1814, 'contested'], [1815, 'rebel'],
  ]),
  // Luxembourg stays loyal to the emperor in 1790, and its fortress holds out until 1795.
  ...sides('Luxembourg', ['LUX', 'BE-WLX'], [
    [1672, 'ruled'], [1684, 'france'], [1697, 'ruled'], [1714, 'austria'], [1795, 'france'], [1814, 'contested'], [1815, 'rebel'],
  ]),
  // The prince-bishopric of Liège is a state of its own until the French take it.
  ...sides('Liège', LIEGE, [
    [1672, 'outside'], [1790, 'contested'], [1791, 'outside'], [1792, 'france'], [1793, 'outside'], [1794, 'france'],
    [1814, 'contested'], [1815, 'rebel'],
  ]),
  ...sides('Duchy of Limburg', ['BE-WLG'], [
    [1672, 'ruled'], [1714, 'austria'], [1790, 'contested'], [1791, 'austria'], [1792, 'france'], [1793, 'austria'],
    [1794, 'france'], [1814, 'contested'], [1815, 'rebel'],
  ], limburgDuchy),
  { name: 'Eupen and Malmedy to Prussia', kind: 'outside', from: 1815, regions: ['BE-WLG'], clip: eastCantons },
  ...sides('Upper Guelders', ['NL-LI'], [[1672, 'ruled'], [1714, 'austria'], [1794, 'france'], [1814, 'rebel']]),
  ...sides('Maastricht', ['NL-LI'], [[1672, 'rebel'], [1673, 'france'], [1678, 'rebel'], [1794, 'france'], [1814, 'rebel']], maastricht),
  // The towns France took or gave back.
  { name: 'Tournai, French', kind: 'france', from: 1672, to: 1708, regions: ['BE-WHT'], clip: tournai },
  { name: 'Kortrijk and Oudenaarde, French', kind: 'france', from: 1672, to: 1677, regions: ['BE-VWV', 'BE-VOV'], clip: kortrijk },
  { name: 'Ypres, French', kind: 'france', from: 1678, to: 1713, regions: ['BE-VWV'], clip: ypres },
  ...sides('Lille', ['FRA'], [[1672, 'france'], [1708, 'contested'], [1713, 'france']], frenchFlanders),
  { name: 'Artois', kind: 'france', from: 1672, regions: ['FRA'], clip: artois },
  ...sides('Cambrai and Valenciennes', ['FRA'], [[1672, 'ruled'], [1678, 'france']], cambresis),
]

const lines: HistLine[] = [
  // The Old Dutch Water Line, from the Zuiderzee at Muiden to the Waal at Gorinchem.
  {
    name: 'The Water Line',
    kind: 'barrier',
    from: 1672,
    to: 1673,
    coords: [[5.07, 52.33], [4.98, 52.2], [4.9, 52.09], [4.88, 51.97], [4.97, 51.83]],
  },
  { name: "William's fleet sails for England", kind: 'flow', from: 1688, to: 1691, coords: [[4.13, 51.82], [3.4, 51.75], [2.4, 51.45], [1.6, 51.2]] },
  { name: 'The Prussian army marches on Amsterdam', kind: 'flow', from: 1787, to: 1789, coords: [[5.85, 51.84], [5.4, 51.98], [5.12, 52.09], [4.95, 52.3]] },
]

// Barrier forts held by Dutch garrisons inside the Austrian Netherlands, 1715 to 1781.
const barrier = (name: string, at: [number, number], label?: 'left' | 'right'): HistSite => ({
  name,
  kind: 'fort',
  from: 1715,
  to: 1781,
  at,
  label,
  note: 'Barrier fort with a Dutch garrison, 1715 to 1781',
})

const sites: HistSite[] = [
  { name: 'Amsterdam', kind: 'town', from: BORDERS_MIN, at: [4.893, 52.373], label: 'right' },
  { name: 'Brussels', kind: 'town', from: BORDERS_MIN, at: [4.357, 50.847], label: 'right' },
  { name: 'Groningen', kind: 'battle', from: 1672, to: 1672, at: [6.567, 53.219], label: 'left', note: 'Besieged by the bishop of Münster, relieved 28 August 1672' },
  { name: 'Maastricht', kind: 'battle', from: 1673, to: 1673, at: [5.691, 50.851], label: 'right', note: 'Taken by Louis XIV, June 1673; d\'Artagnan killed' },
  { name: 'Namur', kind: 'battle', from: 1692, to: 1694, at: [4.867, 50.466], label: 'right', note: 'Taken by Louis XIV, 1692' },
  { name: 'Namur', kind: 'battle', from: 1695, to: 1696, at: [4.867, 50.466], label: 'right', note: 'Retaken by William III, 1695' },
  { name: 'Brussels bombarded', kind: 'battle', from: 1695, to: 1696, at: [4.357, 50.847], label: 'left', note: 'French guns shell the city centre, 13 to 15 August 1695' },
  { name: 'Ramillies', kind: 'battle', from: 1706, to: 1707, at: [4.912, 50.638], label: 'right', note: 'Marlborough beats the French, 23 May 1706' },
  { name: 'Oudenaarde', kind: 'battle', from: 1708, to: 1708, at: [3.604, 50.845], label: 'right', note: 'Marlborough and Eugene beat the French, 11 July 1708' },
  { name: 'Malplaquet', kind: 'battle', from: 1709, to: 1712, at: [3.86, 50.335], label: 'right', note: 'The bloodiest battle of the war, 11 September 1709' },
  barrier('Namur', [4.867, 50.466], 'right'),
  barrier('Tournai', [3.389, 50.606], 'left'),
  barrier('Menen', [3.122, 50.796]),
  barrier('Warneton', [2.95, 50.753]),
  barrier('Ypres', [2.885, 50.851], 'left'),
  barrier('Fort Knokke', [2.8, 50.93]),
  barrier('Veurne', [2.662, 51.073], 'left'),
  barrier('Dendermonde', [4.101, 51.028]),
  { name: 'Fontenoy', kind: 'battle', from: 1745, to: 1745, at: [3.475, 50.57], label: 'left', note: 'Marshal Saxe beats the British, Dutch and Austrians, 11 May 1745' },
  { name: 'Bergen op Zoom', kind: 'battle', from: 1747, to: 1747, at: [4.292, 51.495], label: 'right', note: 'Taken by the French, September 1747' },
  { name: 'Turnhout', kind: 'battle', from: 1790, to: 1790, at: [4.948, 51.322], label: 'right', note: 'Brabant rebels beat the Austrians, 27 October 1789' },
  { name: 'Jemappes', kind: 'battle', from: 1792, to: 1792, at: [3.89, 50.452], label: 'left', note: 'The French beat the Austrians, 6 November 1792' },
  { name: 'Neerwinden', kind: 'battle', from: 1793, to: 1793, at: [5.05, 50.76], label: 'right', note: 'The Austrians beat the French, 18 March 1793' },
  { name: 'Fleurus', kind: 'battle', from: 1794, to: 1794, at: [4.55, 50.483], label: 'right', note: 'The French beat the Austrians, 26 June 1794' },
  { name: 'Den Helder', kind: 'battle', from: 1795, to: 1805, at: [4.76, 52.955], label: 'right', note: 'French cavalry take the Dutch fleet, frozen in the ice, January 1795' },
  { name: 'Scheveningen', kind: 'town', from: 1813, to: 1813, at: [4.27, 52.11], label: 'left', note: 'The Prince of Orange lands, 30 November 1813' },
  { name: 'Quatre Bras', kind: 'battle', from: 1815, at: [4.453, 50.571], label: 'left', note: 'Dutch and Belgian troops hold the crossroads, 16 June 1815' },
  { name: 'Ligny', kind: 'battle', from: 1815, at: [4.58, 50.51], label: 'right', note: 'Napoleon beats the Prussians, 16 June 1815' },
  { name: 'Waterloo', kind: 'battle', from: 1815, at: [4.412, 50.68], label: 'right', note: 'Wellington and Blücher beat Napoleon, 18 June 1815' },
]

const labels: HistLabel[] = [
  { text: 'FRANCE', kind: 'people', from: BORDERS_MIN, at: [3.4, 49.7] },
  { text: 'EMPIRE', kind: 'people', from: BORDERS_MIN, to: 1794, at: [7.0, 51.35] },
  { text: 'PRUSSIA', kind: 'people', from: 1815, at: [7.0, 51.35] },
  { text: 'Liège', kind: 'territory', from: BORDERS_MIN, to: 1791, at: [5.45, 50.45] },
  { text: 'DUTCH REPUBLIC', kind: 'water', from: BORDERS_MIN, to: 1794, at: [3.9, 52.85] },
  { text: 'BATAVIAN REPUBLIC', kind: 'water', from: 1795, to: 1805, at: [3.9, 52.85] },
  { text: 'KINGDOM OF HOLLAND', kind: 'water', from: 1806, to: 1809, at: [3.9, 52.85] },
  { text: 'FRENCH EMPIRE', kind: 'water', from: 1810, to: 1812, at: [3.9, 52.85] },
  { text: 'UNITED NETHERLANDS', kind: 'water', from: 1813, to: 1814, at: [3.9, 52.85] },
  { text: 'KINGDOM OF THE NETHERLANDS', kind: 'water', from: 1815, at: [3.9, 52.85] },
  { text: 'SPANISH NETHERLANDS', kind: 'people', from: BORDERS_MIN, to: 1713, at: [4.2, 50.3] },
  { text: 'AUSTRIAN NETHERLANDS', kind: 'people', from: 1714, to: 1793, off: [[1790, 1790]], at: [4.2, 50.3] },
  { text: 'UNITED BELGIAN STATES', kind: 'people', from: 1790, to: 1790, at: [4.2, 50.3] },
  { text: 'ANNEXED TO FRANCE', kind: 'people', from: 1795, to: 1813, at: [4.2, 50.3] },
  { text: 'DISASTER YEAR', kind: 'alert', from: 1672, to: 1673, at: [3.3, 52.35] },
]

const events: HistEvent[] = [
  {
    from: 1672,
    title: '1672: The Disaster Year',
    text: 'France, England and the bishops of Münster and Cologne attack the Republic at once. Louis XIV crosses the Rhine at Lobith on 12 June, Utrecht falls and the east is overrun. Holland floods its fields along the Water Line, and the French stop. Groningen holds out against the bishop of Münster.',
  },
  {
    from: 1673,
    title: '1673: Maastricht falls',
    text: 'Louis XIV takes Maastricht after a short siege; d\'Artagnan, captain of his musketeers, is killed there. At sea Michiel de Ruyter fights off the English and French fleets three times, so no army can land on the coast.',
  },
  {
    from: 1674,
    title: '1674: The invaders leave',
    text: 'England and the two bishops make peace, and the French pull out of the Republic. They keep Maastricht and fight on in the Spanish Netherlands.',
  },
  {
    from: 1678,
    title: '1678: The Peace of Nijmegen',
    text: 'France gives back Maastricht, Kortrijk and Oudenaarde, but takes Cambrai, Valenciennes and Ypres from Spain.',
  },
  {
    from: 1684,
    title: '1684: Luxembourg',
    text: 'French troops take the great fortress of Luxembourg.',
  },
  {
    from: 1688,
    title: '1688: William sails for England',
    text: 'The stadtholder William III crosses to England with about 450 ships and lands at Torbay on 5 November. In 1689 he and his wife Mary are crowned king and queen. From now on the Republic and England fight France together.',
  },
  {
    from: 1692,
    title: '1692: Namur taken',
    text: 'In a new war, Louis XIV comes in person to watch his army take Namur, the strongest fortress on the Meuse.',
  },
  {
    from: 1695,
    title: '1695: Brussels in flames',
    text: 'French guns bombard Brussels for two days and burn the Grand Place. William III retakes Namur.',
  },
  {
    from: 1697,
    title: '1697: The Peace of Rijswijk',
    text: 'France gives back Luxembourg and the other towns it has taken in the war.',
  },
  {
    from: 1701,
    title: '1701: A French king for Spain',
    text: 'Charles II of Spain has died without children and left his empire to Louis XIV\'s grandson, Philip V. French troops march into the Spanish Netherlands. The Republic, England and the emperor go to war to stop France ruling Spain too: the War of the Spanish Succession.',
  },
  {
    from: 1706,
    title: '1706: Ramillies',
    text: 'The Duke of Marlborough\'s British and Dutch army beats the French at Ramillies on 23 May. Brussels, Antwerp, Ghent and Bruges go over to the allies, who rule them for the Austrian claimant to Spain.',
  },
  {
    from: 1708,
    title: '1708: Oudenaarde and Lille',
    text: 'Marlborough and Prince Eugene beat the French at Oudenaarde, then take Lille after a long siege.',
  },
  {
    from: 1709,
    title: '1709: Malplaquet',
    text: 'The allies take Tournai and then Mons, and win the bloodiest battle of the war at Malplaquet, losing far more men than the French.',
  },
  {
    from: 1713,
    title: '1713: The Peace of Utrecht',
    text: 'The war ends in treaties signed at Utrecht. Philip V keeps Spain but not the Spanish Netherlands. France keeps Lille, but gives back Tournai, Ypres and other towns.',
  },
  {
    from: 1714,
    title: '1714: The Austrian Netherlands',
    text: 'By the Treaty of Rastatt the south goes to Emperor Charles VI in Vienna. For the next 80 years it is the Austrian Netherlands, run by a governor in Brussels.',
  },
  {
    from: 1715,
    title: '1715: The Barrier',
    text: 'By the Barrier Treaty, Dutch soldiers garrison a row of forts inside the Austrian Netherlands, from Veurne to Namur, as a shield against France. Austria pays for them.',
  },
  {
    from: 1745,
    title: '1745: Fontenoy',
    text: 'In the War of the Austrian Succession, Marshal Saxe beats the British, Dutch and Austrians at Fontenoy on 11 May and takes Tournai, Ghent and Bruges. The barrier forts fall one by one.',
  },
  {
    from: 1746,
    title: '1746: France takes the south',
    text: 'Brussels, Antwerp, Mons and Namur fall. Only Luxembourg holds out.',
  },
  {
    from: 1747,
    title: '1747: France invades the Republic',
    text: 'French troops take Zeelandic Flanders and Bergen op Zoom. In panic, every province makes William IV its stadtholder.',
  },
  {
    from: 1748,
    title: '1748: The Peace of Aachen',
    text: 'France gives back everything it has taken in the Low Countries.',
  },
  {
    from: 1782,
    title: '1782: The Barrier ends',
    text: 'Emperor Joseph II has the barrier forts pulled down, and the Dutch garrisons go home.',
  },
  {
    from: 1787,
    title: '1787: The Prussians restore the stadtholder',
    text: 'The Patriots have taken over towns across the Republic and forced William V out of The Hague. After Patriots stop his wife on her way to The Hague, her brother the king of Prussia sends 20,000 soldiers. Amsterdam gives in on 10 October, and thousands of Patriots flee to France.',
  },
  {
    from: 1790,
    title: '1790: The United Belgian States',
    text: 'The south rises against Joseph II\'s reforms. Rebels beat the Austrians at Turnhout in October 1789, and in January 1790 the provinces declare themselves the United Belgian States. In Liège, the people drive out their prince-bishop.',
  },
  {
    from: 1791,
    title: '1791: The emperor returns',
    text: 'The rebels quarrel among themselves, and Austrian troops retake Brussels in December 1790. The prince-bishop is back in Liège.',
  },
  {
    from: 1792,
    title: '1792: The French Revolution arrives',
    text: 'Revolutionary France is at war with Austria. Its army beats the Austrians at Jemappes on 6 November and overruns the south and Liège.',
  },
  {
    from: 1793,
    title: '1793: Neerwinden',
    text: 'The Austrians beat the French at Neerwinden on 18 March and win the south back, for one more year.',
  },
  {
    from: 1794,
    title: '1794: Fleurus',
    text: 'The French win at Fleurus on 26 June and take the south for good. Maastricht falls in November.',
  },
  {
    from: 1795,
    title: '1795: The Batavian Republic',
    text: 'In January the rivers freeze, French armies march in over the ice, and William V flees to England. Patriots proclaim the Batavian Republic, which hands Zeelandic Flanders, Maastricht and Venlo to France. On 1 October France annexes the south and Liège.',
  },
  {
    from: 1806,
    title: '1806: The Kingdom of Holland',
    text: 'Napoleon makes his brother Louis king of Holland. Amsterdam\'s town hall on the Dam becomes his palace.',
  },
  {
    from: 1810,
    title: '1810: Part of France',
    text: 'Louis takes the Dutch side too often. He gives up the throne on 1 July, and on 9 July Napoleon annexes Holland to France.',
  },
  {
    from: 1813,
    title: '1813: Orange returns',
    text: 'Napoleon is beaten at Leipzig in October, and the French leave. In The Hague, Gijsbert Karel van Hogendorp and his friends take power, and on 30 November the son of William V lands at Scheveningen.',
  },
  {
    from: 1814,
    title: '1814: The allies in the south',
    text: 'Allied armies drive the French out of the south, and Napoleon gives up his throne in April. The great powers agree that north and south will be joined.',
  },
  {
    from: 1815,
    title: '1815: Waterloo and a new kingdom',
    text: 'William I proclaims himself king of the United Kingdom of the Netherlands, north and south together, and grand duke of Luxembourg. Napoleon returns from exile, but is beaten at Waterloo on 18 June. Prussia takes Eupen and Malmedy.',
  },
]

export const bordersStory: TimeStory = {
  place: 'the Low Countries',
  min: BORDERS_MIN,
  max: BORDERS_MAX,
  format: String,
  events,
  lines,
  sites,
  labels,
  areas,
  fresh: 'outline',
  note: 'Borders are approximate and drawn with today\'s provinces; the towns France took are grouped into rough areas. The hatching means land held by the British and Dutch allies (1706 to 1713, 1814) or in revolt (1790).',
  key: [
    { swatch: 'key-rebel', text: 'The Dutch Republic, then the kingdom' },
    { swatch: 'key-ruled', text: 'The king of Spain' },
    { swatch: 'key-austria', text: 'The emperor in Vienna' },
    { swatch: 'key-france', text: 'France and its armies' },
    { swatch: 'key-sister', text: 'Run under France, 1795 to 1810' },
    { swatch: 'key-contested', text: 'Held by the allies, or in revolt' },
    { swatch: 'key-flash', text: 'Just changed hands' },
    { swatch: 'key-fort', text: 'Barrier fort' },
    { swatch: 'key-battle', text: 'Battle or siege' },
  ],
}
