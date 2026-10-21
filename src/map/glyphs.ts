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
