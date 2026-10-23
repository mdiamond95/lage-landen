import { charts, type ChartId } from '../data/charts'
import { t } from '../i18n'

const W = 600
const H = 330
const M = { top: 20, right: 92, bottom: 34, left: 62 }

// Round an axis maximum up to a tidy step: 50,000 rather than 47,300.
const niceStep = (max: number) => {
  const raw = max / 4
  const mag = 10 ** Math.floor(Math.log10(raw))
  return [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw)!
}

const fmt = (n: number) => n.toLocaleString('en-CA')

// A line chart of one or more series over the years. `until` stops it at a year, so
// an earlier unit can show the rise without giving away the fall.
export function LineChart({ chart, until }: { chart: ChartId; until?: number }) {
  const c = charts[chart]
  const series = c.series
    .map((s) => ({ ...s, points: s.points.filter(([y]) => until === undefined || y <= until) }))
    .filter((s) => s.points.length > 0)
  const all = series.flatMap((s) => s.points)
  const x0 = Math.min(...all.map(([y]) => y))
  const x1 = Math.max(...all.map(([y]) => y))
  const step = niceStep(Math.max(...all.map(([, v]) => v)))
  const yMax = Math.ceil(Math.max(...all.map(([, v]) => v)) / step) * step
  const x = (year: number) => M.left + ((year - x0) / (x1 - x0 || 1)) * (W - M.left - M.right)
  const y = (v: number) => H - M.bottom - (v / yMax) * (H - M.top - M.bottom)
  const yTicks = Array.from({ length: yMax / step + 1 }, (_, i) => i * step)
  const decade = x1 - x0 > 80 ? 50 : 25
  const xTicks = Array.from({ length: Math.floor(x1 / decade) - Math.ceil(x0 / decade) + 1 }, (_, i) => (Math.ceil(x0 / decade) + i) * decade)
  const title = until === undefined ? c.title : c.title.replace(/\d{4}$/, String(x1))

  return (
    <figure className="line-chart">
      <figcaption className="tree-title">{title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t('Line chart: {title}', { title })}>
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={M.left} x2={W - M.right} y1={y(v)} y2={y(v)} className="chart-grid" />
            <text x={M.left - 8} y={y(v) + 4} textAnchor="end" className="chart-tick">
              {fmt(v)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={x(t)} y={H - M.bottom + 20} textAnchor="middle" className="chart-tick">
            {t}
          </text>
        ))}
        {series.map((s) => {
          const [lx, ly] = s.points[s.points.length - 1]
          return (
            <g key={s.name} className={`chart-series chart-${s.tone}`}>
              <polyline points={s.points.map(([py, pv]) => `${x(py)},${y(pv)}`).join(' ')} />
              {s.points.map(([py, pv]) => (
                <circle key={py} cx={x(py)} cy={y(pv)} r={4.5}>
                  <title>{`${s.name}, ${py}: about ${fmt(pv)} ${c.unit}`}</title>
                </circle>
              ))}
              <text x={x(lx) + 8} y={y(ly) + 4} className="chart-label">
                {s.name}
              </text>
            </g>
          )
        })}
      </svg>
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {series.flatMap((s) =>
            s.points.map(([py, pv]) => (
              <tr key={`${s.name}-${py}`}>
                <th scope="row">{`${s.name}, ${py}`}</th>
                <td>{fmt(pv)}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>
      <p className="time-map-note">{c.source}</p>
    </figure>
  )
}
