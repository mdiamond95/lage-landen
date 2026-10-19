// Line charts drawn from real figures, for "read the chart" questions. Each series is
// a list of [year, value] points; old population figures are estimates, so each chart
// names its source and says how sure the numbers are.

export type Series = { name: string; tone: 'orange' | 'delft' | 'red' | 'green'; points: [number, number][] }
export type Chart = {
  title: string
  // What the values count, for the axis, e.g. "people".
  unit: string
  series: Series[]
  source: string
}

export const chartIds = ['antwerp-amsterdam'] as const
export type ChartId = (typeof chartIds)[number]

export const charts: Record<ChartId, Chart> = {
  'antwerp-amsterdam': {
    title: 'People living in Antwerp and Amsterdam, 1500 to 1648',
    unit: 'people',
    series: [
      { name: 'Antwerp', tone: 'red', points: [[1500, 46000], [1568, 100000], [1585, 80000], [1589, 42000], [1645, 57000]] },
      { name: 'Amsterdam', tone: 'orange', points: [[1514, 11000], [1578, 28000], [1588, 33000], [1598, 49000], [1622, 105000], [1648, 173000]] },
    ],
    source: 'Counts for Antwerp in 1568 and 1645 and for Amsterdam in 1622; the rest are historians\' estimates (De Belder, Lesger, Nusteling).',
  },
}
