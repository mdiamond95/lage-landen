// The languages and dialects of the Low Countries (Unit 20), drawn on the map from
// dialects.topo.json: municipalities of the Netherlands (2023) and Belgium (589, from 1983)
// and the arrondissement of Dunkirk in France, from geoBoundaries (CC BY 4.0), each given to
// the dialect group spoken there and dissolved with mapshaper, clipped to the coastline of the
// base map. Pieces: frisian, stellingwerf, groningen, saxon, west-friesland, hollandic,
// flevoland, zeelandic, west-flemish, french-flanders, east-flemish, brabantian, limburgish,
// guelderish, brussels, walloon, picard, lorrain, luxembourgish and german. A time map can
// use the pieces too (Frisian once reached Groningen and West Friesland).
//
// Dialects shade into each other from village to village, so the lines are a summary, after
// the groups in Wikipedia's articles on Dutch dialects, Walloon and the German-speaking
// Community. Town dialects (Stadsfries in Leeuwarden, say) are not drawn.

import type { FeatureCollection, Geometry } from 'geojson'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import raw from './dialects.topo.json'
import type { SoundId } from '../sounds/ids'

const topology = raw as unknown as Topology
export const dialectPieces = (feature(topology, topology.objects.dialects) as unknown as FeatureCollection<Geometry, { id: string }>).features

export const dialectIds = [
  'frisian',
  'saxon',
  'hollandic',
  'zeelandic',
  'west-flemish',
  'east-flemish',
  'brabantian',
  'limburgish',
  'guelderish',
  'brussels',
  'walloon',
  'picard',
  'lorrain',
  'luxembourgish',
  'german',
  'new-land',
] as const
export type DialectId = (typeof dialectIds)[number]

export type Family = 'Frisian' | 'Low Saxon' | 'Low Franconian' | 'Romance' | 'High German' | 'None'

export type Dialect = {
  name: string
  // What its speakers call it.
  own: string
  family: Family
  pieces: string[]
  // Where the label goes, [lon, lat].
  at: [number, number]
  about: string
  // Official recognition, if any.
  status?: string
  sounds: SoundId[]
}

export const dialects: Record<DialectId, Dialect> = {
  frisian: {
    name: 'Frisian',
    own: 'Frysk',
    family: 'Frisian',
    pieces: ['frisian'],
    at: [5.75, 53.08],
    about:
      "A language of its own, and one of the closest living relatives of English, spoken as a first language by more than half the people of Fryslân (about 354,000 in 2005). The towns speak Stadsfries, Dutch with a Frisian accent, instead.",
    status: 'Allowed in court since 1956, and an official language of Fryslân beside Dutch by a law of 2013.',
    sounds: ['fy-ljouwert', 'fy-fryslan'],
  },
  saxon: {
    name: 'Low Saxon',
    own: 'Nedersaksisch',
    family: 'Low Saxon',
    pieces: ['saxon', 'groningen', 'stellingwerf'],
    at: [6.55, 52.65],
    about:
      'The dialects of the north-east, from Gronings and Drents to Twents, Sallands, Achterhoeks and Veluws, and Stellingwarfs in the corner of Fryslân. They are the same family as Low German across the border. In a study of 2005, 71% of people in the region could speak it, but fewer and fewer parents pass it on.',
    status: 'Recognised as a regional language of the Netherlands in 1996.',
    sounds: [],
  },
  hollandic: {
    name: 'Hollandic',
    own: 'Hollands',
    family: 'Low Franconian',
    pieces: ['hollandic', 'west-friesland'],
    at: [4.75, 52.25],
    about:
      "The dialects of Holland and Utrecht. The city dialects of the Randstad are close to standard Dutch, which owes much to them. North of Amsterdam, West Fries keeps Frisian words, from the time when Frisian was spoken there.",
    sounds: ['nl-goedemorgen'],
  },
  zeelandic: {
    name: 'Zeelandic',
    own: 'Zeêuws',
    family: 'Low Franconian',
    pieces: ['zeelandic'],
    at: [3.85, 51.6],
    about: 'Spoken on the islands of Zeeland and on Goeree-Overflakkee, between Holland and Flanders, and close kin to West Flemish across the Scheldt.',
    sounds: [],
  },
  'west-flemish': {
    name: 'West Flemish',
    own: 'West-Vlams',
    family: 'Low Franconian',
    pieces: ['west-flemish', 'french-flanders'],
    at: [2.9, 51.0],
    about:
      'Spoken in West Flanders, the west of Zeelandic Flanders and, by fewer and fewer people, in French Flanders around Dunkirk. Its g sounds almost like an h, and it drops the h altogether.',
    sounds: ['vls-taele'],
  },
  'east-flemish': {
    name: 'East Flemish',
    own: 'Oost-Vlaams',
    family: 'Low Franconian',
    pieces: ['east-flemish'],
    at: [3.75, 51.05],
    about: 'Spoken in East Flanders, around Ghent and Aalst, and in the east of Zeelandic Flanders. It sits between West Flemish and Brabantian.',
    sounds: [],
  },
  brabantian: {
    name: 'Brabantian',
    own: 'Brabants',
    family: 'Low Franconian',
    pieces: ['brabantian'],
    at: [5.0, 51.4],
    about:
      "Spoken in North Brabant, Antwerp and Flemish Brabant. It gives most to the tussentaal, the everyday 'in-between language' of Flanders, halfway between dialect and standard Dutch.",
    sounds: [],
  },
  limburgish: {
    name: 'Limburgish',
    own: 'Limburgs',
    family: 'Low Franconian',
    pieces: ['limburgish'],
    at: [5.6, 51.05],
    about:
      'Spoken in Dutch and Belgian Limburg and on into Germany, by about 800,000 people. Many of its dialects tell words apart by their tone alone, and many say ich for I, as German does.',
    status: 'Recognised as a regional language of the Netherlands in 1997; no legal status in Belgium.',
    sounds: ['li-ich', 'li-vastelaovend'],
  },
  guelderish: {
    name: 'South Guelderish',
    own: 'Zuid-Gelders',
    family: 'Low Franconian',
    pieces: ['guelderish'],
    at: [5.7, 51.86],
    about: 'Spoken along the great rivers, in the Betuwe and around Nijmegen and Arnhem, and in the north of Limburg. Its eastern dialects, Kleverlands, run on into Germany around Kleve.',
    sounds: [],
  },
  brussels: {
    name: 'Brussels',
    own: 'Brussel / Bruxelles',
    family: 'Low Franconian',
    pieces: ['brussels'],
    at: [4.37, 50.84],
    about:
      "Officially bilingual, and today mostly French-speaking. Its old dialect, Brusseleir, is Brabantian full of French words, and its French is full of Dutch: une fois, 'once', is used like Dutch eens.",
    sounds: ['nl-brussel', 'fr-bruxelles'],
  },
  walloon: {
    name: 'Walloon',
    own: 'Walon',
    family: 'Romance',
    pieces: ['walloon'],
    at: [5.2, 50.3],
    about:
      "A Romance language of its own, not a kind of French, in four main dialects, around Liège, Namur, Charleroi and Bastogne. About 600,000 people had some knowledge of it in 2007, most of them older.",
    status: 'Recognised as a regional language by the French Community in 1990.',
    sounds: ['wa-bondjou', 'wa-lidje'],
  },
  picard: {
    name: 'Picard',
    own: 'Picard',
    family: 'Romance',
    pieces: ['picard'],
    at: [3.75, 50.55],
    about: 'Spoken around Tournai, Ath and Mons, and over the border in the north of France, where most of its speakers live.',
    status: 'Recognised as a regional language by the French Community in 1990.',
    sounds: ['pcd-pigs'],
  },
  lorrain: {
    name: 'Gaumais',
    own: 'Gaumais',
    family: 'Romance',
    pieces: ['lorrain'],
    at: [5.5, 49.63],
    about: 'The Lorraine dialect of the Gaume, the warm southern tip of Belgium around Virton.',
    status: 'Recognised as a regional language by the French Community in 1990.',
    sounds: [],
  },
  luxembourgish: {
    name: 'Luxembourgish',
    own: 'Lëtzebuergesch',
    family: 'High German',
    pieces: ['luxembourgish'],
    at: [5.95, 49.7],
    about: "Spoken around Arlon, in the Arelerland, as it is over the border in the Grand Duchy, where it is the national language.",
    status: 'Recognised as a regional language by the French Community in 1990.',
    sounds: ['lb-moien'],
  },
  german: {
    name: 'German and Platt',
    own: 'Deutsch, Platt',
    family: 'High German',
    pieces: ['german'],
    at: [6.3, 50.45],
    about:
      'German is the official language of nine municipalities around Eupen and Sankt Vith, the German-speaking Community (79,479 people in 2024). At home many speak Platt, Ripuarian in the north and Moselle Franconian in the south, and Platt is heard too in Plombières, Welkenraedt and Baelen, which are French-speaking by law.',
    status: 'An official language of Belgium.',
    sounds: ['de-hallo'],
  },
  'new-land': {
    name: 'Flevoland',
    own: 'New land',
    family: 'None',
    pieces: ['flevoland'],
    at: [5.55, 52.5],
    about: 'Drained from the Zuiderzee between 1942 and 1968 and settled by people from all over the Netherlands, so it has no old dialect of its own. Urk, an island until 1942, keeps its fishermen\'s dialect.',
    sounds: [],
  },
}
