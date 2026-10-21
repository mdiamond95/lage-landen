// The map for Unit 20: the languages of the Low Countries from the Frisians, Saxons and
// Franks of about 800 to the regional languages recognised in the 1990s, on the Low
// Countries map. Areas use the pieces of the dialect map (dialects.ts): Frisian once
// reached the countryside of Groningen and West Friesland, north of Amsterdam, before the
// Saxon dialects of the city of Groningen and the Dutch of Holland took over, and Flemish
// was once spoken all over French Flanders. Flevoland, drained in the 20th century, stays
// blank. The colours show the family of the language people spoke at home, not the
// language of government.

import type { HistArea, HistEvent, HistLabel, HistSite, TimeStory } from './timeline'

export const TONGUES_MIN = 800
export const TONGUES_MAX = 1996

const OLD_DUTCH = 1100
const MIDDLE_DUTCH = 1270
const ANTWERP = 1585
const BIBLE = 1637
const BELGIUM = 1830
const FRISIAN_LAW = 1956
const TAALUNIE = 1980
const WALLOON = 1990
const CHARTER = TONGUES_MAX
const until = (next: number) => next - 1

const dutch = ['hollandic', 'zeelandic', 'west-flemish', 'east-flemish', 'brabantian', 'limburgish', 'guelderish', 'brussels']
const romance = ['walloon', 'picard', 'lorrain']

const areas: HistArea[] = [
  { name: 'Frisian', kind: 'frisian', from: TONGUES_MIN, to: until(BIBLE), regions: ['frisian', 'groningen', 'west-friesland'] },
  { name: 'Frisian in Fryslân', kind: 'frisian', from: BIBLE, regions: ['frisian'] },
  { name: 'Saxon', kind: 'saxon', from: TONGUES_MIN, to: until(BIBLE), regions: ['saxon', 'stellingwerf'] },
  { name: 'Low Saxon', kind: 'saxon', from: BIBLE, regions: ['saxon', 'stellingwerf', 'groningen'] },
  { name: 'Frankish, then Dutch', kind: 'dutch', from: TONGUES_MIN, to: until(BIBLE), regions: [...dutch, 'french-flanders'] },
  { name: 'Dutch', kind: 'dutch', from: BIBLE, to: until(FRISIAN_LAW), regions: [...dutch, 'west-friesland', 'french-flanders'] },
  { name: 'Dutch, without French Flanders', kind: 'dutch', from: FRISIAN_LAW, regions: [...dutch, 'west-friesland'] },
  { name: 'French Flanders, now French-speaking', kind: 'french', from: FRISIAN_LAW, regions: ['french-flanders'] },
  { name: 'Romance: Walloon, Picard and Gaumais', kind: 'french', from: TONGUES_MIN, regions: romance },
  { name: 'German dialects and Luxembourgish', kind: 'german', from: TONGUES_MIN, regions: ['german', 'luxembourgish'] },
]

const sites: HistSite[] = [
  { name: 'Damme', kind: 'town', from: MIDDLE_DUTCH, to: until(ANTWERP), at: [3.282, 51.251], label: 'left', note: 'Jacob van Maerlant, town clerk and poet, wrote here in Dutch' },
  { name: 'Antwerp', kind: 'town', from: ANTWERP, to: until(BIBLE), at: [4.402, 51.219], label: 'right' },
  { name: 'Dordrecht', kind: 'town', from: BIBLE, to: until(BELGIUM), at: [4.69, 51.81], label: 'right', note: 'The synod of 1618 to 1619 ordered the States Bible' },
  { name: 'Leiden', kind: 'town', from: BIBLE, to: until(BELGIUM), at: [4.497, 52.16], label: 'left', note: 'Where the States Bible was printed, 1637' },
  { name: 'Brussels', kind: 'town', from: BELGIUM, at: [4.352, 50.847], label: 'right' },
  { name: 'Leeuwarden', kind: 'town', from: FRISIAN_LAW, at: [5.8, 53.2], label: 'right', note: 'Kneppelfreed, 16 November 1951' },
  { name: 'Namur', kind: 'town', from: WALLOON, at: [4.867, 50.467], label: 'right' },
]

const labels: HistLabel[] = [
  { text: 'FRISIANS', kind: 'people', from: TONGUES_MIN, to: until(OLD_DUTCH), at: [5.6, 53.12] },
  { text: 'SAXONS', kind: 'people', from: TONGUES_MIN, to: until(OLD_DUTCH), at: [6.5, 52.55] },
  { text: 'FRANKS', kind: 'people', from: TONGUES_MIN, to: until(OLD_DUTCH), at: [4.6, 51.35] },
  { text: 'ROMANCE', kind: 'people', from: TONGUES_MIN, to: until(BELGIUM), at: [4.9, 50.25] },
  { text: 'OLD DUTCH', kind: 'people', from: OLD_DUTCH, to: until(MIDDLE_DUTCH), at: [4.6, 51.35] },
  { text: 'MIDDLE DUTCH', kind: 'people', from: MIDDLE_DUTCH, to: until(BIBLE), at: [4.6, 51.35] },
  { text: 'FRISIAN', kind: 'people', from: OLD_DUTCH, at: [5.75, 53.05] },
  { text: 'LOW SAXON', kind: 'people', from: OLD_DUTCH, at: [6.55, 52.6] },
  { text: 'DUTCH', kind: 'people', from: BIBLE, at: [4.6, 51.35] },
  { text: 'FRENCH IN POWER', kind: 'alert', from: BELGIUM, to: until(TAALUNIE), at: [4.75, 50.15] },
  { text: 'WALLOON, PICARD, GAUMAIS', kind: 'people', from: TAALUNIE, to: until(WALLOON), at: [4.9, 50.2] },
  { text: 'REGIONAL LANGUAGES', kind: 'alert', from: WALLOON, at: [4.9, 50.2] },
  { text: 'ONE DUTCH LANGUAGE', kind: 'alert', from: TAALUNIE, to: until(WALLOON), at: [4.9, 52.0] },
  { text: 'RECOGNISED 1996', kind: 'alert', from: CHARTER, at: [6.55, 52.45] },
  { text: 'RECOGNISED 1997', kind: 'alert', from: CHARTER, at: [5.85, 51.2] },
]

const events: HistEvent[] = [
  {
    from: TONGUES_MIN,
    title: 'About 800: Frisians, Saxons and Franks',
    text: 'Frisians live along the coast, Saxons in the east and Franks inland, each with their own Germanic speech. South of a line across what is now Belgium, people speak the Latin of the Romans, turning into early Walloon and Picard. That line, the language border, has hardly moved since. Press play to follow the languages to today.',
  },
  {
    from: OLD_DUTCH,
    title: 'About 1100: Hebban olla vogala',
    text: 'In an English monastery a scribe tries out his pen with a line of verse: "All birds have begun nests, except me and you." It is a mix of Old Dutch and Old English, one of the few scraps of written Old Dutch to survive. Monks write in Latin; the people speak their dialects.',
  },
  {
    from: MIDDLE_DUTCH,
    title: '1270: Middle Dutch in Flanders',
    text: "The rich towns of Flanders and Brabant lead. Around 1260 a poet called Willem writes Van den vos Reynaerde, the tale of Reynard the fox, and in Damme near Bruges the town clerk Jacob van Maerlant writes history and science in Dutch for townspeople who read no Latin.",
  },
  {
    from: ANTWERP,
    title: '1585: Antwerp falls',
    text: 'When Spanish troops take Antwerp, tens of thousands of Protestants and merchants leave for Holland and Zeeland. They bring the Brabant way of speaking with them, and the centre of written Dutch moves north.',
  },
  {
    from: BIBLE,
    title: '1637: The States Bible',
    text: 'Ordered by the Synod of Dordrecht in 1618, a new Bible translation is printed in Leiden and read in Protestant homes for centuries. By now Frisian is spoken only in Fryslân: the countryside of Groningen has gone over to the Saxon speech of its city, and West Friesland to the Dutch of Holland.',
  },
  {
    from: BELGIUM,
    title: '1830: French, the language of power',
    text: "Belgium is born, run in French, though most Belgians speak Flemish dialects. In French Flanders, Flemish slowly gives way to French over the next century and more.",
  },
  {
    from: FRISIAN_LAW,
    title: '1956: Frisian in court',
    text: 'In 1951 a judge in Heerenveen told a vet who wanted to speak Frisian in his court that officially he did not understand him. A journalist attacked the judge in print, and police clubbed the crowd outside the journalist\'s trial in Leeuwarden: Kneppelfreed, Baton Friday. A law of 1955 lets schools teach in Frisian, and one of 1956 lets people speak it in court.',
  },
  {
    from: TAALUNIE,
    title: '1980: One Dutch language, two countries',
    text: 'On 9 September 1980 the Netherlands and Belgium sign the treaty of the Dutch Language Union, the Taalunie, in Brussels. From now on one body looks after the spelling, the word list and the teaching of Dutch for both. Suriname joins as an associate in 2004.',
  },
  {
    from: WALLOON,
    title: '1990: Walloon, Picard, Gaumais',
    text: "On 24 December 1990 the French Community recognises the regional languages spoken in Wallonia and Brussels, among them Walloon, Picard, Gaumais, Champenois and Luxembourgish. By then they are spoken mostly by older people.",
  },
  {
    from: CHARTER,
    title: '1996: Low Saxon and Limburgish',
    text: 'The Netherlands recognises Low Saxon in 1996 and Limburgish in 1997 as regional languages under the European Charter for Regional or Minority Languages. Frisian is protected under it too, more strongly.',
  },
]

export const tonguesStory: TimeStory = {
  place: 'the Low Countries',
  min: TONGUES_MIN,
  max: TONGUES_MAX,
  format: (y) => (y < 1000 ? `about ${y}` : String(y)),
  events,
  lines: [
    { name: 'Refugees from Antwerp', kind: 'flow', from: ANTWERP, to: until(BIBLE), coords: [[4.402, 51.219], [4.5, 51.62], [4.62, 52.0], [4.85, 52.33]] },
  ],
  sites,
  labels,
  areas,
  fresh: 'outline',
  note: 'Language areas are approximate, drawn along today\'s municipal borders. Flevoland, drained from 1942, is left blank.',
  key: [
    { swatch: 'key-frisian', text: 'Frisian' },
    { swatch: 'key-saxon', text: 'Saxon' },
    { swatch: 'key-dutch', text: 'Frankish and Dutch' },
    { swatch: 'key-french', text: 'Romance (Walloon, Picard) and French' },
    { swatch: 'key-german', text: 'German dialects' },
  ],
}
