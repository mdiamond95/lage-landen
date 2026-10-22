// Seats in the two lower houses (Unit 26), drawn as a half circle of 150 seats by SeatChart. The
// Dutch House of Representatives (Tweede Kamer) after the election of 29 October 2025, and the
// Belgian Chamber of Representatives after the election of 9 June 2024, from the Kiesraad's and the
// FPS Interior's results as Wikipedia gives them. `cabinet` marks the parties of the government
// formed after it: the Jetten cabinet, sworn in on 23 February 2026, and the De Wever government,
// sworn in on 3 February 2025. In Belgium every party but PVDA-PTB stands on one side of the
// language border only, so `side` says which.

export type Party = { name: string; seats: number; colour: string; cabinet?: boolean; side?: 'dutch' | 'french' | 'both' }

export type Chamber = {
  title: string
  election: string
  cabinet: string
  parties: Party[]
}

export const chamberIds = ['tk-2025', 'be-2024'] as const
export type ChamberId = (typeof chamberIds)[number]

export const chambers: Record<ChamberId, Chamber> = {
  'tk-2025': {
    title: 'House of Representatives of the Netherlands',
    election: '29 October 2025',
    cabinet: 'The Jetten cabinet, sworn in on 23 February 2026',
    parties: [
      { name: 'D66', seats: 26, colour: '#3fa535', cabinet: true },
      { name: 'PVV', seats: 26, colour: '#1c3f72' },
      { name: 'VVD', seats: 22, colour: '#f28b1d', cabinet: true },
      { name: 'GroenLinks–PvdA', seats: 20, colour: '#c0213a' },
      { name: 'CDA', seats: 18, colour: '#2f9e8a', cabinet: true },
      { name: 'JA21', seats: 9, colour: '#24344d' },
      { name: 'FvD', seats: 7, colour: '#8a1c2b' },
      { name: 'BBB', seats: 4, colour: '#94c11f' },
      { name: 'DENK', seats: 3, colour: '#36b6c2' },
      { name: 'SGP', seats: 3, colour: '#e96c27' },
      { name: 'PvdD', seats: 3, colour: '#1f7a3a' },
      { name: 'ChristenUnie', seats: 3, colour: '#2a8bc9' },
      { name: 'SP', seats: 3, colour: '#e1001a' },
      { name: '50PLUS', seats: 2, colour: '#8e2c8e' },
      { name: 'Volt', seats: 1, colour: '#562883' },
    ],
  },
  'be-2024': {
    title: 'Chamber of Representatives of Belgium',
    election: '9 June 2024',
    cabinet: 'The De Wever government, sworn in on 3 February 2025',
    parties: [
      { name: 'N-VA', seats: 24, colour: '#e8b500', cabinet: true, side: 'dutch' },
      { name: 'Vlaams Belang', seats: 20, colour: '#5a4a1c', side: 'dutch' },
      { name: 'MR', seats: 20, colour: '#1f5bb8', cabinet: true, side: 'french' },
      { name: 'PS', seats: 16, colour: '#e2001a', side: 'french' },
      { name: 'PVDA-PTB', seats: 15, colour: '#8b0f1a', side: 'both' },
      { name: 'Les Engagés', seats: 14, colour: '#14b5b0', cabinet: true, side: 'french' },
      { name: 'Vooruit', seats: 13, colour: '#ff4f5e', cabinet: true, side: 'dutch' },
      { name: 'CD&V', seats: 11, colour: '#f28c00', cabinet: true, side: 'dutch' },
      { name: 'Open Vld', seats: 7, colour: '#2a4fa0', side: 'dutch' },
      { name: 'Groen', seats: 6, colour: '#7cb342', side: 'dutch' },
      { name: 'Ecolo', seats: 3, colour: '#3c8d2f', side: 'french' },
      { name: 'DéFI', seats: 1, colour: '#d6177a', side: 'french' },
    ],
  },
}

export const SEATS = 150
export const MAJORITY = 76
export const cabinetSeats = (c: Chamber) => c.parties.filter((p) => p.cabinet).reduce((n, p) => n + p.seats, 0)
