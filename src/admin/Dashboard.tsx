import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, CalendarCheck, Inbox, Wallet } from 'lucide-react'
import { useData } from '../lib/store'
import { type ApplicationStatus } from '../data/applications'
import { Kpi, PageHead, Pill } from './ui'
import { fmtDateTime, fmtDay, fmtMoney, initials } from './format'
import { useI18n } from '../i18n'
import type { DictKey } from '../i18n'
import { isPlanOverdue } from '../lib/plan'

const WEEK = 7 * 24 * 3600 * 1000
const pipeline: ApplicationStatus[] = ['new', 'in_progress', 'meeting', 'won', 'lost']

function WeeklyChart({ dates }: { dates: string[] }) {
  const { t } = useI18n()
  const [hover, setHover] = useState<number | null>(null)
  const [now] = useState(() => Date.now())
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const end = now - (7 - i) * WEEK
    const start = end - WEEK
    const count = dates.filter((d) => {
      const ts = new Date(d).getTime()
      return ts > start && ts <= end
    }).length
    const label = fmtDay(new Date(end), t)
    return { count, label }
  })
  const max = Math.max(1, ...weeks.map((w) => w.count))

  return (
    <figure className="chart adm-chart">
      <figcaption className="chart__title">{t('admin.dash.chart')}</figcaption>
      <div className="chart__plot adm-chart__plot" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }} onMouseLeave={() => setHover(null)}>
        {weeks.map((w, i) => (
          <div
            key={i}
            className={`chart__col${i === weeks.length - 1 ? ' is-latest' : ''}${hover === i ? ' is-hover' : ''}`}
            onMouseEnter={() => setHover(i)}
            tabIndex={0}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            aria-label={t('admin.dash.weekAria', { label: w.label, n: w.count })}
          >
            <span className="chart__value">{w.count}</span>
            <span className="chart__bar" style={{ height: `${Math.max(2, (w.count / max) * 100)}%` }} />
            {hover === i && (
              <span className="chart__tip" role="tooltip">
                <strong>{t('admin.dash.weekTip', { n: w.count })}</strong>
                <span>{t('admin.dash.weekHint', { label: w.label })}</span>
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="chart__axis" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
        {weeks.map((w, i) => (
          <span key={i} className={i === weeks.length - 1 ? 'is-latest' : ''}>
            {w.label}
          </span>
        ))}
      </div>
    </figure>
  )
}

export default function Dashboard() {
  const { t } = useI18n()
  const { applications, companies, payments } = useData()
  const [now] = useState(() => new Date())
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const newCount = applications.filter((a) => a.status === 'new').length
  const active = applications.filter((a) => a.status === 'in_progress' || a.status === 'meeting').length
  const closed = applications.filter((a) => a.status === 'won' || a.status === 'lost')
  const won = closed.filter((a) => a.status === 'won').length
  const monthRevenue = payments.filter((p) => p.status === 'paid' && p.date.startsWith(monthKey)).reduce((s, p) => s + p.amount, 0)
  const pendingRevenue = payments.filter((p) => p.status !== 'paid').reduce((s, p) => s + p.amount, 0)
  const verified = companies.filter((c) => c.verified).length
  const unverified = companies.filter((c) => !c.verified)
  const overdue = companies.filter(isPlanOverdue)
  const recent = [...applications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6)
  const maxStage = Math.max(1, ...pipeline.map((s) => applications.filter((a) => a.status === s).length))
  const statusKey = (s: ApplicationStatus) => `status.${s}` as DictKey
  const serviceKey = (s: string) => `service.${s}` as DictKey

  return (
    <>
      <PageHead title={t('admin.dash.hello')} text={t('admin.dash.lead')} />

      <div className="kpis">
        <Kpi icon={Inbox} label={t('admin.dash.newApps')} value={newCount} hint={t('admin.dash.totalApps', { n: applications.length })} />
        <Kpi icon={CalendarCheck} label={t('admin.dash.active')} value={active} hint={t('admin.dash.activeHint')} tone="violet" />
        <Kpi
          icon={Wallet}
          label={t('admin.dash.revenue')}
          value={fmtMoney(monthRevenue)}
          hint={t('admin.dash.pending', { n: fmtMoney(pendingRevenue) })}
          tone="green"
        />
        <Kpi
          icon={BadgeCheck}
          label={t('admin.dash.verified')}
          value={`${verified}/${companies.length}`}
          hint={
            overdue.length
              ? t('admin.dash.overdueHint', { n: overdue.length })
              : closed.length
                ? t('admin.dash.conv', { n: Math.round((won / closed.length) * 100) })
                : undefined
          }
          tone={overdue.length ? 'red' : 'amber'}
        />
      </div>

      <div className="adm-grid adm-grid--2-1">
        <WeeklyChart dates={applications.map((a) => a.createdAt)} />
        <section className="adm-card">
          <h2 className="adm-card__title">{t('admin.dash.funnel')}</h2>
          <ul className="funnel">
            {pipeline.map((s) => {
              const n = applications.filter((a) => a.status === s).length
              return (
                <li key={s}>
                  <Link to={`/admin/murojaatlar?holat=${s}`}>
                    <span className="funnel__label">{t(statusKey(s))}</span>
                    <span className="funnel__track">
                      <span className={`funnel__bar funnel__bar--${s === 'new' ? 'blue' : s === 'in_progress' ? 'amber' : s === 'meeting' ? 'violet' : s === 'won' ? 'green' : 'gray'}`} style={{ width: `${(n / maxStage) * 100}%` }} />
                    </span>
                    <strong>{n}</strong>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <div className="adm-grid adm-grid--2-1">
        <section className="adm-card">
          <div className="adm-card__head">
            <h2 className="adm-card__title">{t('admin.dash.recent')}</h2>
            <Link to="/admin/murojaatlar" className="link-more">
              {t('common.allItems')} <ArrowRight size={15} />
            </Link>
          </div>
          <ul className="recent">
            {recent.map((a) => (
              <li key={a.id}>
                <Link to={`/admin/murojaatlar?id=${a.id}`}>
                  <span className="adm-avatar">{initials(a.name)}</span>
                  <span className="recent__main">
                    <strong>{a.name}</strong>
                    <small>
                      {a.company}
                      {a.country && ` · ${a.country}`}
                    </small>
                  </span>
                  <span className="recent__service">{t(serviceKey(a.service))}</span>
                  <Pill tone={a.status === 'new' ? 'blue' : a.status === 'in_progress' ? 'amber' : a.status === 'meeting' ? 'violet' : a.status === 'won' ? 'green' : 'gray'}>
                    {t(statusKey(a.status))}
                  </Pill>
                  <small className="recent__date">{fmtDateTime(a.createdAt, t)}</small>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="adm-card">
          <div className="adm-card__head">
            <h2 className="adm-card__title">{t('admin.dash.todo')}</h2>
            <Link to={overdue.length ? '/admin/kompaniyalar?tarif=overdue' : '/admin/kompaniyalar?tekshirilgan=0'} className="link-more">
              {t('common.open')} <ArrowRight size={15} />
            </Link>
          </div>
          {overdue.length || unverified.length ? (
            <ul className="todo">
              {overdue.map((c) => (
                <li key={`overdue-${c.id}`}>
                  <span className="adm-avatar adm-avatar--sq">{initials(c.name)}</span>
                  <span>
                    <strong>{c.name}</strong>
                    <small className="muted">{t('admin.dash.overdueTodo')}</small>
                  </span>
                </li>
              ))}
              {unverified.map((c) => (
                <li key={c.id}>
                  <span className="adm-avatar adm-avatar--sq">{initials(c.name)}</span>
                  <span>
                    <strong>{c.name}</strong>
                    <small className="muted">{t('admin.dash.langsYears', { n: c.languages.length, year: c.founded })}</small>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">{t('admin.dash.allVerified')}</p>
          )}
        </section>
      </div>
    </>
  )
}
