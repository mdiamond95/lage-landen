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
