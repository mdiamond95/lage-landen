// Every place a lesson can pin. Coordinates are WGS84 decimal degrees.
export type Place = { name: string; lat: number; lon: number; note?: string }

export const places: Record<string, Place> = {
  amsterdam: { name: 'Amsterdam', lat: 52.373, lon: 4.893 },
  'the-hague': { name: 'The Hague', lat: 52.078, lon: 4.288 },
  rotterdam: { name: 'Rotterdam', lat: 51.922, lon: 4.479 },
  utrecht: { name: 'Utrecht', lat: 52.091, lon: 5.122 },
  groningen: { name: 'Groningen', lat: 53.219, lon: 6.567 },
  maastricht: { name: 'Maastricht', lat: 50.851, lon: 5.691 },
  nijmegen: { name: 'Nijmegen', lat: 51.842, lon: 5.853 },
  deventer: { name: 'Deventer', lat: 52.255, lon: 6.163 },
  lelystad: { name: 'Lelystad', lat: 52.518, lon: 5.471 },
  lobith: { name: 'Lobith', lat: 51.862, lon: 6.118, note: 'Where the Rhine enters the Netherlands' },
  kinderdijk: { name: 'Kinderdijk', lat: 51.884, lon: 4.639 },
  zuidplaspolder: {
    name: 'Zuidplaspolder',
    lat: 51.99,
    lon: 4.61,
    note: 'Lowest point of the Netherlands, 6.76 m below sea level',
  },
  afsluitdijk: { name: 'Afsluitdijk', lat: 53.03, lon: 5.2 },
  vaalserberg: { name: 'Vaalserberg', lat: 50.754, lon: 6.021, note: 'Highest point of the European Netherlands, 322 m' },
  brussels: { name: 'Brussels', lat: 50.847, lon: 4.357 },
  antwerp: { name: 'Antwerp', lat: 51.219, lon: 4.402 },
  ghent: { name: 'Ghent', lat: 51.054, lon: 3.717 },
  bruges: { name: 'Bruges', lat: 51.209, lon: 3.225 },
  liege: { name: 'Liège', lat: 50.633, lon: 5.567 },
  namur: { name: 'Namur', lat: 50.467, lon: 4.867 },
  botrange: { name: 'Signal de Botrange', lat: 50.501, lon: 6.093, note: 'Highest point of Belgium, 694 m' },
}
