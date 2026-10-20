// Pillarisation (verzuiling): from the 1870s on, Catholics, orthodox Protestants and
// socialists each built a world of their own, with a party, a newspaper, unions,
// schools and later a broadcaster; liberals and everyone else shared the "general"
// ones. People lived inside their pillar from cradle to grave, and only the leaders
// met at the top. The diagram shows the pillars as they stood by about 1930, with the
// year each body was founded. Sources: Parlement.com and the founding dates of each body.

export const pillarIds = ['catholic', 'protestant', 'socialist', 'liberal'] as const
export type PillarId = (typeof pillarIds)[number]

export const rowIds = ['leader', 'party', 'paper', 'union', 'radio', 'school'] as const
export type RowId = (typeof rowIds)[number]

export const rowNames: Record<RowId, string> = {
  leader: 'Leader',
  party: 'Party',
  paper: 'Newspaper',
  union: 'Trade unions',
  radio: 'Broadcaster',
  school: 'Schools',
}

export type Cell = { name: string; note?: string }
export type Pillar = { id: PillarId; name: string; rows: Record<RowId, Cell> }

export const pillars: Pillar[] = [
  {
    id: 'catholic',
    name: 'Catholic',
    rows: {
      leader: { name: 'Herman Schaepman', note: 'priest and MP' },
      party: { name: 'League of Catholic voters, the RKSP', note: '1904, 1926' },
      paper: { name: 'De Tijd', note: '1845' },
      union: { name: 'Catholic workers’ unions (RKWV)', note: '1925' },
      radio: { name: 'KRO', note: '1925' },
      school: { name: 'Catholic schools, a Catholic university at Nijmegen', note: '1923' },
    },
  },
  {
    id: 'protestant',
    name: 'Protestant',
    rows: {
      leader: { name: 'Abraham Kuyper', note: 'preacher, prime minister 1901–05' },
      party: { name: 'Anti-Revolu\u00adtionary Party (ARP)', note: '1879' },
      paper: { name: 'De Standaard', note: '1872' },
      union: { name: 'Christian unions (CNV)', note: '1909' },
      radio: { name: 'NCRV', note: '1924' },
      school: { name: 'Schools with the Bible, the Free University in Amsterdam', note: '1880' },
    },
  },
  {
    id: 'socialist',
    name: 'Socialist',
    rows: {
      leader: { name: 'Pieter Jelles Troelstra', note: 'lawyer and MP' },
      party: { name: 'Social Democratic Workers’ Party (SDAP)', note: '1894' },
      paper: { name: 'Het Volk', note: '1900' },
      union: { name: 'NVV', note: '1906' },
      radio: { name: 'VARA', note: '1925' },
      school: { name: 'Public schools' },
    },
  },
  {
    id: 'liberal',
    name: 'Liberal and general',
    rows: {
      leader: { name: 'Johan Rudolph Thorbecke', note: 'died 1872' },
      party: { name: 'Liberal Union', note: '1885' },
      paper: { name: 'Algemeen Handelsblad', note: '1828' },
      union: { name: 'None of their own' },
      radio: { name: 'AVRO', note: '1927' },
      school: { name: 'Public schools, the state universities' },
    },
  },
]

// A cell to blank out in a question, written as "pillar.row", e.g. "socialist.radio".
export const cellIds = pillars.flatMap((p) => rowIds.map((r) => `${p.id}.${r}`))
