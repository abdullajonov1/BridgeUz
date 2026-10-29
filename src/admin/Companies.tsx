import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react'
import { slugify, useData } from '../lib/store'
import { useQueryState } from '../lib/useQueryState'
import type { Company } from '../data/companies'
import { regions } from '../data/regions'
import { categories, categoryById, parseLanguageCodes, type CategoryId } from '../data/taxonomy'
import { Confirm, Empty, Modal, PageHead, Pill, Toggle, useToast } from './ui'
import { fmtDate, initials } from './format'
import { useI18n } from '../i18n'
import type { DictKey } from '../i18n'
import { locFlat, locInput, locListInput, parseLines, writeLoc, writeLocList } from '../i18n/loc'
import { LocLangBar, locCode, locFilled, toLoc, toLocList, type LocCode } from './LocLangBar'
import {
  applyPlan,
  changePlan,
  companyPlan,
  companyPlans,
  defaultPlanUntil,
  isCompanyPublic,
  isPlanOverdue,
  planTone,
  type CompanyPlan,
} from '../lib/plan'
import { Select } from '../components/Select'

const blank: Company = {
  id: '',
  name: '',
  category: 'yuridik',
  region: 'toshkent-shahri',
  founded: new Date().getFullYear(),
  employees: '10–25',
  rating: 0,
  reviews: 0,
  verified: false,
  premium: false,
  plan: 'free',
  languages: ['uz', 'ru'],
  priceFrom: 0,
  responseHours: 24,
  description: { uz: '' },
  services: { uz: [] },
  industries: { uz: [] },
}

function CompanyForm({ initial, onClose }: { initial: Company; onClose: () => void }) {
  const { t, l, lang } = useI18n()
  const { upsert } = useData()
  const toast = useToast()
  const isNew = !initial.id
  const [locLang, setLocLang] = useState<LocCode>(() => locCode(lang))
  const [description, setDescription] = useState(() => toLoc(initial.description))
  const [services, setServices] = useState(() => toLocList(initial.services))
  const [industries, setIndustries] = useState(() => toLocList(initial.industries))
  const [f, setF] = useState({
    name: initial.name,
    category: initial.category,
    region: initial.region,
    founded: initial.founded,
    employees: initial.employees,
    rating: initial.rating,
    reviews: initial.reviews,
    verified: initial.verified,
    hidden: initial.hidden,
    plan: companyPlan(initial),
    planUntil: initial.planUntil ?? '',
    priceFrom: initial.priceFrom,
    responseHours: initial.responseHours,
    languagesText: initial.languages.join(', '),
  })
  const [error, setError] = useState('')
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!f.name.trim() || !description.uz.trim()) {
      setError(t('admin.co.err'))
      setLocLang('uz')
      return
    }
    const { languagesText, plan, planUntil, ...rest } = f
    const company: Company = applyPlan(
      {
        ...initial,
        ...rest,
        id: initial.id || slugify(f.name),
        name: f.name.trim(),
        description,
        services,
        industries,
        languages: parseLanguageCodes(languagesText),
      },
      plan,
      planUntil || undefined,
    )
    upsert('companies', company)
    toast(isNew ? t('admin.co.added', { name: company.name }) : t('admin.co.saved'))
    onClose()
  }

  return (
    <Modal
      title={isNew ? t('admin.co.create') : t('admin.co.edit')}
      subtitle={isNew ? t('admin.co.createHint') : initial.name}
      onClose={onClose}
      wide
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="submit" form="company-form" className="btn btn--primary">
            {t('common.save')}
          </button>
        </>
      }
    >
      <form id="company-form" className="adm-form" onSubmit={submit} noValidate>
        <label className={`field field--full${error && !f.name.trim() ? ' has-error' : ''}`}>
          <span>{t('admin.co.fieldName')}</span>
          <input value={f.name} onChange={(e) => set('name', e.target.value)} autoFocus />
        </label>
        <label className="field">
          <span>{t('admin.co.category')}</span>
          <Select
            value={f.category}
            onChange={(v) => set('category', v as CategoryId)}
            options={categories.map((c) => ({ value: c.id, label: l(c.name) }))}
          />
        </label>
        <label className="field">
          <span>{t('admin.co.region')}</span>
          <Select
            value={f.region}
            onChange={(v) => set('region', v)}
            options={regions.map((r) => ({ value: r.slug, label: l(r.name) }))}
          />
        </label>
        <label className="field">
          <span>{t('admin.co.founded')}</span>
          <input type="number" min={1950} max={2100} value={f.founded} onChange={(e) => set('founded', Number(e.target.value))} />
        </label>
        <label className="field">
          <span>{t('admin.co.staff')}</span>
          <Select
            value={f.employees}
            onChange={(v) => set('employees', v)}
            options={['1–5', '5–10', '10–25', '25–50', '50–100', '100–250', '250+'].map((x) => ({ value: x, label: x }))}
          />
        </label>
        <label className="field">
          <span>{t('admin.co.price')}</span>
          <input type="number" min={0} value={f.priceFrom} onChange={(e) => set('priceFrom', Number(e.target.value))} />
        </label>
        <label className="field">
          <span>{t('admin.co.response')}</span>
          <input type="number" min={1} value={f.responseHours} onChange={(e) => set('responseHours', Number(e.target.value))} />
        </label>
        <label className="field">
          <span>{t('admin.co.rating')} (0–5)</span>
          <input type="number" min={0} max={5} step={0.1} value={f.rating} onChange={(e) => set('rating', Number(e.target.value))} />
        </label>
        <label className="field">
          <span>{t('admin.co.reviews')}</span>
          <input type="number" min={0} value={f.reviews} onChange={(e) => set('reviews', Number(e.target.value))} />
        </label>
        <LocLangBar
          value={locLang}
          onChange={setLocLang}
          filled={{
            uz: locFilled(description, 'uz') || locFilled(services, 'uz'),
            en: locFilled(description, 'en') || locFilled(services, 'en'),
            ru: locFilled(description, 'ru') || locFilled(services, 'ru'),
          }}
        />
        <label className={`field field--full${error && !description.uz.trim() ? ' has-error' : ''}`}>
          <span>{t('admin.co.desc')}</span>
          <textarea
            rows={3}
            value={locInput(description, locLang, false)}
            onChange={(e) => setDescription(writeLoc(description, e.target.value, locLang))}
          />
        </label>
        <label className="field">
          <span>{t('admin.co.services')}</span>
          <textarea
            rows={4}
            value={locListInput(services, locLang, '\n', false)}
            onChange={(e) => setServices(writeLocList(services, parseLines(e.target.value), locLang))}
          />
        </label>
        <div className="adm-form__col">
          <label className="field">
            <span>{t('admin.co.langs')}</span>
            <input value={f.languagesText} onChange={(e) => set('languagesText', e.target.value)} />
          </label>
          <label className="field">
            <span>{t('admin.co.industries')}</span>
            <input
              value={locListInput(industries, locLang, ', ', false)}
              onChange={(e) => setIndustries(writeLocList(industries, parseLines(e.target.value, /[\n,]/), locLang))}
            />
          </label>
        </div>
        <label className="field">
          <span>{t('admin.co.plan')}</span>
          <Select
            value={f.plan}
            onChange={(v) => {
              const plan = v as CompanyPlan
              setF((x) => ({
                ...x,
                plan,
                planUntil: plan === 'free' ? '' : x.planUntil || defaultPlanUntil(plan) || '',
              }))
            }}
            options={companyPlans.map((p) => ({ value: p, label: t(`plan.${p}` as DictKey) }))}
          />
        </label>
        {f.plan !== 'free' && (
          <label className="field">
            <span>{t('admin.co.planUntil')}</span>
            <input type="date" value={f.planUntil} onChange={(e) => set('planUntil', e.target.value)} />
          </label>
        )}
        <p className="muted field--full">{t('admin.co.planHint')}</p>
        <div className="adm-form__checks field--full">
          <label className="checkbox">
            <input type="checkbox" checked={f.verified} onChange={(e) => set('verified', e.target.checked)} />
            <span>{t('common.verified')}</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" checked={!f.hidden} onChange={(e) => set('hidden', !e.target.checked)} />
            <span>{t('admin.co.onSite')}</span>
          </label>
        </div>
        {error && <p className="field-error field--full">{error}</p>}
      </form>
    </Modal>
  )
}

export default function AdminCompanies() {
  const { t, l, cyr } = useI18n()
  const { companies, patch, remove } = useData()
  const toast = useToast()
  const [q, setQ] = useQueryState('q')
  const [category, setCategory] = useQueryState('toifa', 'all')
  const [verified, setVerified] = useQueryState('tekshirilgan', 'all')
  const [plan, setPlan] = useQueryState('tarif', 'all')
  const [editing, setEditing] = useState<Company | null>(null)
  const [deleting, setDeleting] = useState<Company | null>(null)

  const list = useMemo(() => {
    const n = q.trim().toLowerCase()
    return companies.filter((c) => {
      const matchesPlan =
        plan === 'all' ||
        (plan === 'overdue' && isPlanOverdue(c)) ||
        (plan !== 'overdue' && companyPlan(c) === plan)
      return (
        (category === 'all' || c.category === category) &&
        (verified === 'all' || c.verified === (verified === '1')) &&
        matchesPlan &&
        (!n || locFlat(c.name).toLowerCase().includes(n) || locFlat(c.description).toLowerCase().includes(n))
      )
    })
  }, [companies, q, category, verified, plan])

  return (
    <>
      <PageHead
        title={t('admin.nav.companies')}
        text={t('admin.co.planHint')}
        actions={
          <button type="button" className="btn btn--primary" onClick={() => setEditing(blank)}>
            <Plus size={18} /> {t('admin.co.new')}
          </button>
        }
      />

      <div className="adm-card adm-card--flush">
        <div className="adm-toolbar">
          <div className="input-icon adm-search">
            <Search size={17} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('admin.co.search')} aria-label={t('common.search')} />
          </div>
          <Select
            className="adm-select"
            value={category}
            onChange={setCategory}
            aria-label={t('admin.co.category')}
            options={[
              { value: 'all', label: t('co.allCategories') },
              ...categories.map((c) => ({ value: c.id, label: l(c.name) })),
            ]}
          />
          <Select
            className="adm-select"
            value={verified}
            onChange={setVerified}
            aria-label={t('admin.co.verify')}
            options={[
              { value: 'all', label: t('admin.co.all') },
              { value: '1', label: t('admin.co.verified') },
              { value: '0', label: t('admin.co.unverified') },
            ]}
          />
          <Select
            className="adm-select"
            value={plan}
            onChange={setPlan}
            aria-label={t('admin.co.filterPlan')}
            options={[
              { value: 'all', label: t('admin.co.allPlans') },
              ...companyPlans.map((p) => ({ value: p, label: t(`plan.${p}` as DictKey) })),
              { value: 'overdue', label: t('admin.co.overdue') },
            ]}
          />
          <span className="muted adm-toolbar__count">{t('common.count', { n: list.length })}</span>
        </div>

        {list.length ? (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>{t('admin.co.name')}</th>
                  <th>{t('admin.co.category')}</th>
                  <th>{t('admin.co.region')}</th>
                  <th>{t('admin.co.rating')}</th>
                  <th className="center">{t('common.verified')}</th>
                  <th>{t('admin.co.plan')}</th>
                  <th className="center">{t('admin.co.show')}</th>
                  <th>
                    <span className="sr-only">{t('admin.opp.actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id} className={isCompanyPublic(c) ? '' : 'is-muted'}>
                    <td>
                      <div className="adm-rowbtn">
                        <span className="adm-avatar adm-avatar--sq">{initials(c.name)}</span>
                        <span>
                          <strong>{c.name}</strong>
                          <small>{t('admin.co.meta', { year: t('common.year', { n: c.founded }), staff: cyr(c.employees) })}</small>
                        </span>
                      </div>
                    </td>
                    <td>{l(categoryById(c.category).name)}</td>
                    <td>{l(regions.find((r) => r.slug === c.region)?.center)}</td>
                    <td className="nowrap">
                      <span className="rating">
                        <Star size={14} fill="currentColor" /> {c.rating.toFixed(1)}
                        <span className="muted">({c.reviews})</span>
                      </span>
                    </td>
                    <td className="center">
                      <Toggle
                        checked={c.verified}
                        label={t('common.verified')}
                        onChange={(v) => {
                          patch('companies', c.id, { verified: v })
                          toast(v ? t('admin.co.checked', { name: c.name }) : t('admin.co.unchecked', { name: c.name }))
                        }}
                      />
                    </td>
                    <td>
                      <div className="adm-plan">
                        <Select
                          className="adm-select adm-select--compact"
                          value={companyPlan(c)}
                          aria-label={t('admin.co.plan')}
                          onChange={(v) => {
                            const next = changePlan(c, v as CompanyPlan)
                            patch('companies', c.id, { plan: next.plan, planUntil: next.planUntil, premium: next.premium })
                            toast(t('admin.co.planOn', { name: c.name, plan: t(`plan.${next.plan}` as DictKey) }))
                          }}
                          options={companyPlans.map((p) => ({ value: p, label: t(`plan.${p}` as DictKey) }))}
                        />
                        <Pill tone={planTone(c)}>{isPlanOverdue(c) ? t('plan.overdue') : t(`plan.${companyPlan(c)}` as DictKey)}</Pill>
                        {c.planUntil && companyPlan(c) !== 'free' && (
                          <small className="muted">{t('plan.until', { date: fmtDate(c.planUntil, t) })}</small>
                        )}
                      </div>
                    </td>
                    <td className="center">
                      <Toggle
                        checked={!c.hidden}
                        label={t('admin.co.onSite')}
                        onChange={(v) => {
                          patch('companies', c.id, { hidden: !v })
                          toast(v ? t('admin.co.visible', { name: c.name }) : t('admin.co.hidden', { name: c.name }))
                        }}
                      />
                    </td>
                    <td>
                      <div className="adm-actions">
                        {isCompanyPublic(c) && (
                          <Link to={`/kompaniyalar/${c.id}`} target="_blank" className="icon-btn icon-btn--sm" aria-label={t('admin.co.viewSite')} title={t('admin.co.viewSite')}>
                            <ExternalLink size={16} />
                          </Link>
                        )}
                        <button type="button" className="icon-btn icon-btn--sm" aria-label={t('common.edit')} title={t('common.edit')} onClick={() => setEditing(c)}>
                          <Pencil size={16} />
                        </button>
                        <button type="button" className="icon-btn icon-btn--sm icon-btn--danger" aria-label={t('common.delete')} title={t('common.delete')} onClick={() => setDeleting(c)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty text={t('admin.co.empty')} />
        )}
      </div>

      {editing && <CompanyForm initial={editing} onClose={() => setEditing(null)} />}
      {deleting && (
        <Confirm
          title={t('admin.co.deleteTitle')}
          text={t('admin.co.deleteText', { name: deleting.name })}
          onConfirm={() => {
            remove('companies', deleting.id)
            toast(t('admin.co.deleted'), 'danger')
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  )
}
