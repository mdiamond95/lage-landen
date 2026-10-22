// The marks of the food map (Unit 21), shared by the time map and the regional food map:
// a cheese wedge, a fish, a waffle, a bowl, a beer glass and a bottle, drawn about a 16 px box.
export const foodGlyphs = {
  cheese: 'M-7.5 5.5H7.5V-1L-7.5 5.5zM2.5 3a1.6 1.6 0 1 0 .01 0z',
  fish: 'M-7.5 0C-4.5-4.5 2-4.5 4 0-2 4.5-4.5 4.5-7.5 0zM3.2 0 7.8-3.8V3.8z',
  sweet: 'M-5.5-5.5h11v11h-11zM-2.2-5.5v11M2.2-5.5v11M-5.5-2.2h11M-5.5 2.2h11',
  dish: 'M-7.5-1.5h15A7.5 7 0 0 1-7.5-1.5zM-3-4.5h6',
  brewery: 'M-5-6.5h8.5l-1.3 13h-5.9zM3.4-3.5h2.4v5H3',
  distillery: 'M-1.6-7.5h3.2v3.2L4 -2v9h-8v-9l2.4-2.3z',
} as const
export type FoodGlyph = keyof typeof foodGlyphs

// The marks of the feasts (Unit 22), shared by the feast time map and the calendar wheel: a
// cross for the church year, a mitre for the saints, a mask for carnival, a giant for the
// processions, a crown for kings and nations, a flame for remembrance and a star for folk customs.
export const feastGlyphs = {
  church: 'M-1.6-7.5h3.2v4.3h4.3v3.2H1.6v7.5h-3.2V0h-4.3v-3.2h4.3z',
  saint: 'M-6 7.5h12V-1.5L0-8-6-1.5zM-1-4h2v8.5h-2z',
  carnival: 'M-8-3C-8-6.5 8-6.5 8-3 8 3 3 5 0 2-3 5-8 3-8-3zM-5.2-1.8a1.8 1.4 0 1 0 3.6 0a1.8 1.4 0 1 0-3.6 0zM1.6-1.8a1.8 1.4 0 1 0 3.6 0a1.8 1.4 0 1 0-3.6 0z',
  procession: 'M-2.6-5.4a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0-5.2 0zM-3.5-2h7L6 8H-6z',
  nation: 'M-7 5.5-8-5l4.5 3.5L0-7l3.5 5.5L8-5 7 5.5z',
  memory: 'M0-8C1-4 5-3 5 2a5 5 0 0 1-10 0c0-3 2-4 2-6.5 1.5 1 2 2 2 3.5 1-2 .5-4 1-7z',
  folk: 'M0-8 2-2.5h5.6L3.1 1l1.8 5.5L0 3.2-4.9 6.5-3.1 1-7.6-2.5H-2z',
} as const
export type FeastGlyph = keyof typeof feastGlyphs

// The marks of the sports (Unit 23), on the sport time map: a wheel for cycling, a ball for football
// and korfball, a skate for the ice and a flame for the Olympic Games.
export const sportGlyphs = {
  race: 'M0-7.5a7.5 7.5 0 1 0 .01 0zM0-5a5 5 0 1 1-.01 0zM-.9-4.9h1.8V4.9H-.9zM-4.9-.9h9.8V.9h-9.8z',
  ball: 'M0-7.5a7.5 7.5 0 1 0 .01 0zM0-3.2 3 -1 1.9 2.6h-3.8L-3-1z',
  ice: 'M-7.5 4.5h13c1.5 0 2.2-1.2 2.2-2.4h-1.8c0 .5-.3.7-.6.7H-7.5zM-5.5 2.6V-6.5h4.5l1.3 4.6 4.2 1.6v2.9z',
  games: 'M0-8C1.5-4 5-2.5 5 2.2a5 5 0 0 1-10 0C-5-1-3-2.5-3-5c1.4 1 2 2.2 2 3.6C0-3.5.3-5.5 0-8z',
} as const
export type SportGlyph = keyof typeof sportGlyphs

// The marks of pop culture (Unit 24), on the pop time map: a speech balloon for a comic strip, a
// note for music and a frame of film for cinema and television. Museums take the temple front.
export const popGlyphs = {
  strip: 'M-7.5-6.5h15a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H-1.5L-5.5 7.5V3.5h-2a1.5 1.5 0 0 1-1.5-1.5v-7a1.5 1.5 0 0 1 1.5-1.5z',
  music: 'M-1-7.5H6v3.2H1.5V4a3.2 3.2 0 1 1-2.5-3.1z',
  film: 'M-7.5-5.5h15v11h-15zM-6-4.2v1.6h1.6v-1.6zM-6-.8v1.6h1.6V-.8zM-6 2.6v1.6h1.6V2.6zM4.4-4.2v1.6H6v-1.6zM4.4-.8v1.6H6V-.8zM4.4 2.6v1.6H6V2.6zM-3-4v8h6v-8z',
} as const
export type PopGlyph = keyof typeof popGlyphs

// The marks of learning (Unit 25), on the science time map: a mortarboard for a university, an open
// book for a printer or an atlas, a quill for a thinker's work, a flask for a laboratory or observatory,
// a leaf for a garden of plants and a medal for a Nobel Prize.
export const scienceGlyphs = {
  university: 'M0-6.5 8-2.5 0 1.5-8-2.5zM-4.5 0v3.5c0 1.5 9 1.5 9 0V0L0 2.2zM6.5-1.8v5.3h1v-5.3z',
  press: 'M0-4C-2-6-5.5-6.5-8-6v11c2.5-.5 6 0 8 2 2-2 5.5-2.5 8-2V-6c-2.5-.5-6 0-8 2zM-.6-3v8.5h1.2V-3z',
  scholar: 'M6.5-8C1-6.5-3.5-2-5.5 5L-6.5 8l1.6-.7C-3.5 2-.5-1.5 3-3c-2 1.8-4 4.5-5 7.5C3 3 6-2 6.5-8z',
  lab: 'M-2.2-7.5h4.4v1.5H1.2v4.3L6.5 5.5c.7 1.1 0 2-1.2 2H-5.3c-1.2 0-1.9-.9-1.2-2L-1.2-1.7V-6h-1z',
  garden: 'M-6.5 6.5C-7-2-2-7.5 7-7.5 7 2 1.5 6.5-6.5 6.5zM-6.5 6.5-5 5C-2 1 1-2 4-4.5-.5-1.5-3.5 2-6.5 6.5z',
  prize: 'M-4-8h3l1 3.5L1-8h3L1.5-2.6A4.6 4.6 0 1 1-1.5-2.6zM0-1.3a3.3 3.3 0 1 0 .01 0z',
} as const
export type ScienceGlyph = keyof typeof scienceGlyphs

// The marks of the state (Unit 26), on the state map: a columned front for a seat of government,
// scales for an international court, a rolled treaty with its seal, and a star for the European
// institutions and NATO.
export const stateGlyphs = {
  seat: 'M0-7.5 7.5-3.5H-7.5zM-6.5-2.5h13v1.3h-13zM-5.8-.6h2v5h-2zM-1-.6h2v5h-2zM3.8-.6h2v5h-2zM-7.5 5h15v2h-15z',
  court: 'M-.7-7.5h1.4v12.5H3V6.5h-6V5h2.3zM-6.5-4.5h13v1.2h-13zM-5.5-3.3l-2.5 5h5zM5.5-3.3l-2.5 5h5zM-7.8 1.9a2.3 1.3 0 0 0 4.6 0zM3.2 1.9a2.3 1.3 0 0 0 4.6 0z',
  treaty: 'M-5.5-7.5h11v15h-11zM-3.5-4.5h7v1.2h-7zM-3.5-1.8h7v1.2h-7zM-3.5.9h7v1.2h-7zM-3.5 3.6h4v1.2h-4z',
  hq: 'M0-7.5 2.2-2.4 7.5-2l-4.1 3.5 1.3 5.3L0 3.9-4.7 6.8l1.3-5.3L-7.5-2l5.3-.4z',
}
export type StateGlyph = keyof typeof stateGlyphs
