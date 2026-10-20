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

export const chartIds = ['antwerp-amsterdam', 'voters'] as const
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
  voters: {
    title: 'Men who could vote, 1850 to 1918',
    unit: '% of adult men',
    series: [
      { name: 'Men with the vote', tone: 'delft', points: [[1850, 10.8], [1860, 10.7], [1870, 11.1], [1880, 12.1], [1890, 14], [1900, 49], [1913, 65], [1918, 100]] },
    ],
    source: 'Parlement.com, as a share of men over 23 until 1913; from the election of 1918 every man over 25 could vote. Women first voted in 1922.',
  },
}
