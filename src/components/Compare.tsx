import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, GitCompareArrows, Star, X } from 'lucide-react'
import type { Company } from '../data/companies'
import { useData } from '../lib/store'
import { regionBySlug } from '../data/regions'
import { categoryById, displayLanguages } from '../data/taxonomy'
import { COMPARE_LIMIT, useCompare } from '../lib/compare'
import { useI18n } from '../i18n'

const YEAR = new Date().getFullYear()

function CompareModal() {
  const { t, l } = useI18n()
  const { companyById } = useData()
  const { ids, setOpen, toggle } = useCompare()
  const list = ids.map(companyById).filter((c): c is Company => Boolean(c))

  const rows: { label: string; render: (c: Company) => ReactNode }[] = [
    { label: t('cmp.category'), render: (c) => l(categoryById(c.category).name) },
    { label: t('cmp.region'), render: (c) => {
      const r = regionBySlug(c.region)
      return r ? l(r.name) : ''
    } },
    {
      label: t('cmp.rating'),
      render: (c) => (
        <span className="rating">
          <Star size={15} fill="currentColor" /> {c.rating.toFixed(1)}
          <span className="muted"> ({c.reviews})</span>
        </span>
      ),
    },
    { label: t('cmp.exp'), render: (c) => t('cmp.years', { n: YEAR - c.founded }) },
    { label: t('cmp.staff'), render: (c) => c.employees },
    {
      label: t('cmp.price'),
      render: (c) => (c.priceFrom ? t('money.from', { n: `$${c.priceFrom.toLocaleString('en-US')}` }) : t('money.negotiable')),
    },
    { label: t('cmp.response'), render: (c) => t('common.hours', { n: c.responseHours }) },
    { label: t('cmp.langs'), render: (c) => displayLanguages(c.languages, l) },
    {
      label: t('cmp.verified'),
      render: (c) =>
        c.verified ? (
          <span className="status status--full">
            <BadgeCheck size={16} /> {t('common.yes')}
          </span>
        ) : (
          <span className="muted">{t('cmp.pending')}</span>
        ),
    },
  ]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [setOpen])

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="compare-title" onClick={() => setOpen(false)}>
      <div className="modal__panel modal__panel--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <div>
            <span className="eyebrow">{t('cmp.eyebrow')}</span>
            <h3 id="compare-title">{t('cmp.title')}</h3>
          </div>
          <button type="button" className="icon-btn" aria-label={t('common.close')} onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">{t('cmp.metric')}</span>
                </th>
                {list.map((c) => (
                  <th scope="col" key={c.id}>
                    <div className="compare-table__company">
                      <span className="avatar">{c.name.slice(0, 2).toUpperCase()}</span>
                      <Link to={`/kompaniyalar/${c.id}`} onClick={() => setOpen(false)}>
                        {c.name}
                      </Link>
                      <button type="button" className="link-btn" onClick={() => toggle(c.id)}>
                        {t('cmp.remove')}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {list.map((c) => (
                    <td key={c.id}>{row.render(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal__foot">
          <p className="muted">{t('cmp.hint')}</p>
          <Link
            to={`/murojaat?xizmat=matching&kompaniyalar=${ids.join(',')}`}
            className="btn btn--primary"
            onClick={() => setOpen(false)}
          >
            {t('co.intro')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export function CompareTray() {
  const { t } = useI18n()
  const { companyById } = useData()
  const { ids, toggle, clear, isOpen, setOpen } = useCompare()
  if (ids.length === 0) return null

  return (
    <>
      <div className="compare-tray" role="region" aria-label={t('cmp.list')}>
        <div className="compare-tray__icon">
          <GitCompareArrows size={20} />
        </div>
        <div className="compare-tray__items">
          {ids.map((id) => {
            const c = companyById(id)
            if (!c) return null
            return (
              <span key={id} className="chip chip--removable">
                {c.name}
                <button type="button" aria-label={t('cmp.removeAria', { name: c.name })} onClick={() => toggle(id)}>
                  <X size={14} />
                </button>
              </span>
            )
          })}
          <span className="compare-tray__count">
            {ids.length}/{COMPARE_LIMIT}
          </span>
        </div>
        <div className="compare-tray__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={clear}>
            {t('common.clear')}
          </button>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            disabled={ids.length < 2}
            title={ids.length < 2 ? t('cmp.needTwo') : undefined}
            onClick={() => setOpen(true)}
          >
            {t('co.compare')}
          </button>
        </div>
      </div>
      {isOpen && <CompareModal />}
    </>
  )
}
