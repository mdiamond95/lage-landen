// Family trees drawn as one line of heirs, generation by generation: each heir with
// the person they married, and sometimes a brother or sister who mattered too.
// `house` colours the card, so a change of dynasty shows at a glance.

export type House = 'valois' | 'habsburg' | 'other'
export type Person = { id: string; name: string; dates: string; house: House; note?: string }
export type Generation = { heir: Person; spouse?: Person; sibling?: Person }
// `key` names the houses that get a colour; everyone else is plain.
export type FamilyTree = { title: string; key: Partial<Record<House, string>>; generations: Generation[] }

export const treeIds = ['burgundy'] as const
export type TreeId = (typeof treeIds)[number]

export const trees: Record<TreeId, FamilyTree> = {
  burgundy: {
    title: 'From the dukes of Burgundy to Charles V',
    key: { valois: 'Dukes of Burgundy', habsburg: 'Habsburgs' },
    generations: [
      {
        heir: { id: 'philip-bold', name: 'Philip the Bold', dates: '1342–1404', house: 'valois', note: 'Duke of Burgundy' },
        spouse: { id: 'margaret-male', name: 'Margaret of Male', dates: '1350–1405', house: 'other', note: 'Heiress of Flanders' },
      },
      {
        heir: { id: 'john-fearless', name: 'John the Fearless', dates: '1371–1419', house: 'valois' },
        spouse: { id: 'margaret-bavaria', name: 'Margaret of Bavaria', dates: '1363–1424', house: 'other' },
      },
      {
        heir: { id: 'philip-good', name: 'Philip the Good', dates: '1396–1467', house: 'valois' },
        spouse: { id: 'isabella-portugal', name: 'Isabella of Portugal', dates: '1397–1471', house: 'other' },
      },
      {
        heir: { id: 'charles-bold', name: 'Charles the Bold', dates: '1433–1477', house: 'valois' },
        spouse: { id: 'isabella-bourbon', name: 'Isabella of Bourbon', dates: 'died 1465', house: 'other' },
      },
      {
        heir: { id: 'mary', name: 'Mary of Burgundy', dates: '1457–1482', house: 'valois' },
        spouse: { id: 'maximilian', name: 'Maximilian of Austria', dates: '1459–1519', house: 'habsburg' },
      },
      {
        heir: { id: 'philip-handsome', name: 'Philip the Handsome', dates: '1478–1506', house: 'habsburg' },
        spouse: { id: 'joanna', name: 'Joanna of Castile', dates: '1479–1555', house: 'other', note: 'Heiress of Spain' },
        sibling: { id: 'margaret-austria', name: 'Margaret of Austria', dates: '1480–1530', house: 'habsburg', note: 'His sister, regent in Mechelen' },
      },
      {
        heir: { id: 'charles-v', name: 'Charles V', dates: '1500–1558', house: 'habsburg', note: 'Born in Ghent' },
      },
    ],
  },
}

export const peopleIn = (tree: FamilyTree) =>
  tree.generations.flatMap((g) => [g.heir, ...(g.spouse ? [g.spouse] : []), ...(g.sibling ? [g.sibling] : [])])
