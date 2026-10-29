import { useState } from 'react'
import { foreignEnterprises } from '../data/content'
import { useI18n } from '../i18n'

const fmt = (n: number) => n.toLocaleString('ru-RU').replace(/ /g, ' ')

export function MarketChart() {
  const { t } = useI18n()
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(...foreignEnterprises.map((d) => d.value))
  const last = foreignEnterprises.length - 1

  return (
    <figure className="chart">
      <figcaption className="chart__title">{t('chart.title')}</figcaption>
      <div className="chart__plot" onMouseLeave={() => setHover(null)}>
        {foreignEnterprises.map((d, i) => {
          const prev = foreignEnterprises[i - 1]
          const change = prev ? ((d.value - prev.value) / prev.value) * 100 : null
          const note = d.note ? t(d.note) : ''
          return (
            <div
              key={d.year}
              className={`chart__col${i === last ? ' is-latest' : ''}${hover === i ? ' is-hover' : ''}`}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              tabIndex={0}
              aria-label={t('chart.aria', { year: `${d.year}${note ? ` (${note})` : ''}`, n: fmt(d.value) })}
            >
              <span className="chart__value">{fmt(d.value)}</span>
              <span className="chart__bar" style={{ height: `${(d.value / max) * 100}%` }} />
              {hover === i && (
                <span className="chart__tip" role="tooltip">
                  <strong>{t('chart.tip', { n: fmt(d.value) })}</strong>
                  <span>
                    {d.year}
                    {note ? `, ${note}` : ''}
                  </span>
                  {change !== null && (
                    <span className={change >= 0 ? 'up' : 'down'}>
                      {t('chart.yoy', {
                        sign: change >= 0 ? '+' : '',
                        pct: change.toFixed(1).replace('.', ','),
                      })}
                    </span>
                  )}
                </span>
              )}
            </div>
          )
        })}
      </div>
      <div className="chart__axis">
        {foreignEnterprises.map((d, i) => (
          <span key={d.year} className={i === last ? 'is-latest' : ''}>
            {d.year}
            {d.note && <small>{t(d.note)}</small>}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>{t('chart.title')}</caption>
        <tbody>
          {foreignEnterprises.map((d) => (
            <tr key={d.year}>
              <th scope="row">{d.year}</th>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
