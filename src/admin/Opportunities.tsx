import { useMemo, useState, type FormEvent } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { slugify, useData } from '../lib/store'
import { useQueryState } from '../lib/useQueryState'
import { formatUsd, opportunityFormatKeys, opportunityFormats, type Opportunity, type OpportunityFormat } from '../data/opportunities'
import { regions } from '../data/regions'
import { sectors, sectorById, type SectorId } from '../data/taxonomy'
import { Confirm, Empty, Modal, PageHead, Toggle, useToast } from './ui'
import { useI18n } from '../i18n'
import { locFlat, locInput, locListInput, parseLines, writeLoc, writeLocList } from '../i18n/loc'
import { LocLangBar, locCode, locFilled, toLoc, toLocList, type LocCode } from './LocLangBar'
import { Select } from '../components/Select'

const blank: Opportunity = {
  id: '',
  title: { uz: '' },
  region: 'toshkent-shahri',
  sector: 'sanoat',
  investment: 1,
  format: 'new',
  summary: { uz: '' },
  advantages: { uz: [] },
}

function OpportunityForm({ initial, onClose }: { initial: Opportunity; onClose: () => void }) {
  const { t, l, lang } = useI18n()
  const { upsert } = useData()
  const toast = useToast()
  const isNew = !initial.id
  const [locLang, setLocLang] = useState<LocCode>(() => locCode(lang))
  const [title, setTitle] = useState(() => toLoc(initial.title))
  const [summary, setSummary] = useState(() => toLoc(initial.summary))
  const [advantages, setAdvantages] = useState(() => toLocList(initial.advantages))
  const [f, setF] = useState({
    region: initial.region,
    sector: initial.sector,
    investment: initial.investment,
    format: initial.format,
    featured: initial.featured,
    closed: initial.closed,
  })
  const [error, setError] = useState('')
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.uz.trim() || !summary.uz.trim() || !(f.investment > 0)) {
      setError(t('admin.opp.err'))
      setLocLang('uz')
      return
    }
    const item: Opportunity = {
      ...initial,
      ...f,
      id: initial.id || slugify(title.uz),
      title,
      summary,
      advantages,
    }
    upsert('opportunities', item)
    toast(isNew ? t('admin.opp.added') : t('admin.opp.saved'))
    onClose()
  }

  return (
    <Modal
      title={isNew ? t('admin.opp.create') : t('admin.opp.edit')}
      subtitle={isNew ? undefined : l(initial.title)}
      onClose={onClose}
      wide
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="submit" form="opp-form" className="btn btn--primary">
            {t('common.save')}
          </button>
        </>
      }
    >
      <form id="opp-form" className="adm-form" onSubmit={submit} noValidate>
        <LocLangBar
          value={locLang}
          onChange={setLocLang}
          filled={{ uz: locFilled(title, 'uz'), en: locFilled(title, 'en'), ru: locFilled(title, 'ru') }}
        />
        <label className={`field field--full${error && !title.uz.trim() ? ' has-error' : ''}`}>
          <span>{t('admin.opp.title')}</span>
          <input value={locInput(title, locLang, false)} onChange={(e) => setTitle(writeLoc(title, e.target.value, locLang))} autoFocus />
        </label>
        <label className="field">
          <span>{t('admin.opp.region')}</span>
          <Select
            value={f.region}
            onChange={(v) => set('region', v)}
            options={regions.map((r) => ({ value: r.slug, label: l(r.name) }))}
          />
        </label>
        <label className="field">
          <span>{t('admin.opp.sector')}</span>
          <Select
            value={f.sector}
            onChange={(v) => set('sector', v as SectorId)}
            options={sectors.map((s) => ({ value: s.id, label: l(s.name) }))}
          />
        </label>
        <label className="field">
          <span>{t('admin.opp.size')}</span>
          <input type="number" min={0.1} step={0.1} value={f.investment} onChange={(e) => set('investment', Number(e.target.value))} />
        </label>
        <label className="field">
          <span>{t('admin.opp.format')}</span>
          <Select
            value={f.format}
            onChange={(v) => set('format', v as OpportunityFormat)}
            options={opportunityFormats.map((x) => ({ value: x, label: t(opportunityFormatKeys[x]) }))}
          />
        </label>
        <label className={`field field--full${error && !summary.uz.trim() ? ' has-error' : ''}`}>
          <span>{t('admin.opp.summary')}</span>
          <textarea rows={3} value={locInput(summary, locLang, false)} onChange={(e) => setSummary(writeLoc(summary, e.target.value, locLang))} />
        </label>
        <label className="field field--full">
          <span>{t('admin.opp.adv')}</span>
          <textarea
            rows={3}
            value={locListInput(advantages, locLang, '\n', false)}
            onChange={(e) => setAdvantages(writeLocList(advantages, parseLines(e.target.value).slice(0, 4), locLang))}
          />
        </label>
        <div className="adm-form__checks field--full">
          <label className="checkbox">
            <input type="checkbox" checked={Boolean(f.featured)} onChange={(e) => set('featured', e.target.checked)} />
            <span>{t('admin.opp.featured')}</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" checked={!f.closed} onChange={(e) => set('closed', !e.target.checked)} />
            <span>{t('admin.opp.visible')}</span>
          </label>
        </div>
        {error && <p className="field-error field--full">{error}</p>}
      </form>
    </Modal>
  )
}

export default function AdminOpportunities() {
  const { t, l } = useI18n()
  const { opportunities, patch, remove } = useData()
  const toast = useToast()
  const [q, setQ] = useQueryState('q')
  const [sector, setSector] = useQueryState('soha', 'all')
  const [editing, setEditing] = useState<Opportunity | null>(null)
  const [deleting, setDeleting] = useState<Opportunity | null>(null)

  const list = useMemo(() => {
    const n = q.trim().toLowerCase()
    return opportunities.filter((o) => (sector === 'all' || o.sector === sector) && (!n || locFlat(o.title).toLowerCase().includes(n)))
  }, [opportunities, q, sector])

  const total = list.filter((o) => !o.closed).reduce((s, o) => s + o.investment, 0)

  return (
    <>
      <PageHead
        title={t('admin.title.opps')}
        text={t('admin.opp.lead', { n: t('money.mln', { n: formatUsd(total) }) })}
        actions={
          <button type="button" className="btn btn--primary" onClick={() => setEditing(blank)}>
            <Plus size={18} /> {t('admin.opp.new')}
          </button>
        }
      />

      <div className="adm-card adm-card--flush">
        <div className="adm-toolbar">
          <div className="input-icon adm-search">
            <Search size={17} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('admin.opp.search')} aria-label={t('common.search')} />
          </div>
          <Select
            className="adm-select"
            value={sector}
            onChange={setSector}
            aria-label={t('admin.opp.sector')}
            options={[
              { value: 'all', label: t('admin.opp.allSectors') },
              ...sectors.map((s) => ({ value: s.id, label: l(s.name) })),
            ]}
          />
          <span className="muted adm-toolbar__count">{t('common.count', { n: list.length })}</span>
        </div>

        {list.length ? (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>{t('admin.opp.project')}</th>
                  <th>{t('admin.opp.region')}</th>
                  <th>{t('admin.opp.sector')}</th>
                  <th className="right">{t('admin.opp.amount')}</th>
                  <th>{t('admin.opp.format')}</th>
                  <th className="center">{t('admin.opp.featuredShort')}</th>
                  <th className="center">{t('admin.opp.open')}</th>
                  <th>
                    <span className="sr-only">{t('admin.opp.actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((o) => {
                  const Icon = sectorById(o.sector).icon
                  return (
                    <tr key={o.id} className={o.closed ? 'is-muted' : ''}>
                      <td>
                        <div className="adm-rowbtn">
                          <span className={`adm-avatar adm-avatar--sq opp-dot opp-dot--${o.sector}`}>
                            <Icon size={16} />
                          </span>
                          <strong className="adm-clamp">{l(o.title)}</strong>
                        </div>
                      </td>
                      <td>{l(regions.find((r) => r.slug === o.region)?.center)}</td>
                      <td>{l(sectorById(o.sector).name)}</td>
                      <td className="right nowrap">
                        <strong>{t('money.mln', { n: formatUsd(o.investment) })}</strong>
                      </td>
                      <td>{t(opportunityFormatKeys[o.format])}</td>
                      <td className="center">
                        <Toggle
                          checked={Boolean(o.featured)}
                          label={t('admin.opp.featuredShort')}
                          onChange={(v) => {
                            patch('opportunities', o.id, { featured: v })
                            toast(v ? t('admin.opp.featuredOn') : t('admin.opp.featuredOff'))
                          }}
                        />
                      </td>
                      <td className="center">
                        <Toggle
                          checked={!o.closed}
                          label={t('admin.opp.open')}
                          onChange={(v) => {
                            patch('opportunities', o.id, { closed: !v })
                            toast(v ? t('admin.opp.opened') : t('admin.opp.closedToast'))
                          }}
                        />
                      </td>
                      <td>
                        <div className="adm-actions">
                          <button type="button" className="icon-btn icon-btn--sm" aria-label={t('common.edit')} title={t('common.edit')} onClick={() => setEditing(o)}>
                            <Pencil size={16} />
                          </button>
                          <button type="button" className="icon-btn icon-btn--sm icon-btn--danger" aria-label={t('common.delete')} title={t('common.delete')} onClick={() => setDeleting(o)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty text={t('admin.opp.empty')} />
        )}
      </div>

      {editing && <OpportunityForm initial={editing} onClose={() => setEditing(null)} />}
      {deleting && (
        <Confirm
          title={t('admin.opp.deleteTitle')}
          text={t('admin.opp.deleteText', { title: l(deleting.title) })}
          onConfirm={() => {
            remove('opportunities', deleting.id)
            toast(t('admin.opp.deleted'), 'danger')
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  )
}
