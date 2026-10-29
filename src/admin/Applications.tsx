import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Globe, Mail, MapPin, Phone, Search, Send, Trash2 } from 'lucide-react'
import { useData } from '../lib/store'
import { useQueryState } from '../lib/useQueryState'
import { getSession } from '../lib/auth'
import { managers, statusMeta, type Application, type ApplicationStatus } from '../data/applications'
import { categoryById, sectorById } from '../data/taxonomy'
import { regionBySlug } from '../data/regions'
import { Confirm, Drawer, Empty, PageHead, Pill, useToast } from './ui'
import { fmtDateTime, initials } from './format'
import { useI18n } from '../i18n'
import type { DictKey } from '../i18n'
import { Select } from '../components/Select'

const statuses = Object.keys(statusMeta) as ApplicationStatus[]
const SERVICE_IDS = ['advisory', 'matching', 'entry', 'unsure', 'free', 'subscription', 'premium']

export default function Applications() {
  const { t, l } = useI18n()
  const { applications } = useData()
  const [status, setStatus] = useQueryState('holat', 'all')
  const [role, setRole] = useQueryState('turi', 'all')
  const [q, setQ] = useQueryState('q')
  const [openId, setOpenId] = useQueryState('id')

  const st = (s: ApplicationStatus) => t(`status.${s}` as DictKey)
  const svc = (s: string) => (SERVICE_IDS.includes(s) ? t(`service.${s}` as DictKey) : s)
  const tone = (s: ApplicationStatus) => statusMeta[s].tone

  const list = useMemo(() => {
    const n = q.trim().toLowerCase()
    return [...applications]
      .filter(
        (a) =>
          (status === 'all' || a.status === status) &&
          (role === 'all' || a.role === role) &&
          (!n || [a.name, a.company, a.email, a.country, a.message].some((f) => f.toLowerCase().includes(n))),
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [applications, status, role, q])

  const open = applications.find((a) => a.id === openId)

  return (
    <>
      <PageHead title={t('admin.title.apps')} text={t('admin.apps.lead')} />

      <div className="adm-tabs" role="tablist" aria-label={t('admin.apps.status')}>
        <button type="button" role="tab" aria-selected={status === 'all'} className={status === 'all' ? 'is-active' : ''} onClick={() => setStatus('all')}>
          {t('common.all')} <span className="count">{applications.length}</span>
        </button>
        {statuses.map((s) => (
          <button key={s} type="button" role="tab" aria-selected={status === s} className={status === s ? 'is-active' : ''} onClick={() => setStatus(s)}>
            {st(s)} <span className="count">{applications.filter((a) => a.status === s).length}</span>
          </button>
        ))}
      </div>

      <div className="adm-card adm-card--flush">
        <div className="adm-toolbar">
          <div className="input-icon adm-search">
            <Search size={17} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('admin.apps.search')} aria-label={t('common.search')} />
          </div>
          <Select
            className="adm-select"
            value={role}
            onChange={setRole}
            aria-label={t('admin.apps.type')}
            options={[
              { value: 'all', label: t('admin.apps.allTypes') },
              { value: 'investor', label: t('role.investor') },
              { value: 'provayder', label: t('role.provider') },
            ]}
          />
          <span className="muted adm-toolbar__count">{t('common.count', { n: list.length })}</span>
        </div>

        {list.length ? (
          <div className="adm-table-wrap">
            <table className="adm-table adm-table--click">
              <thead>
                <tr>
                  <th>{t('admin.apps.applicant')}</th>
                  <th>{t('admin.apps.type')}</th>
                  <th>{t('admin.apps.service')}</th>
                  <th>{t('admin.apps.region')}</th>
                  <th>{t('admin.apps.assignee')}</th>
                  <th>{t('admin.apps.status')}</th>
                  <th>{t('admin.apps.date')}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a.id} onClick={() => setOpenId(a.id)} className={a.status === 'new' ? 'is-unread' : ''}>
                    <td>
                      <button type="button" className="adm-rowbtn" onClick={() => setOpenId(a.id)}>
                        <span className="adm-avatar">{initials(a.name)}</span>
                        <span>
                          <strong>{a.name}</strong>
                          <small>{a.company}</small>
                        </span>
                      </button>
                    </td>
                    <td>{a.role === 'investor' ? t('role.investor') : t('role.provider')}</td>
                    <td>{svc(a.service) || t('common.dash')}</td>
                    <td>{regionBySlug(a.region) ? l(regionBySlug(a.region)!.center) : t('common.dash')}</td>
                    <td>{a.assignee || <span className="muted">{t('common.dash')}</span>}</td>
                    <td>
                      <Pill tone={tone(a.status)}>{st(a.status)}</Pill>
                    </td>
                    <td className="nowrap muted">{fmtDateTime(a.createdAt, t)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty text={t('admin.apps.empty')} />
        )}
      </div>

      {open && <Detail app={open} onClose={() => setOpenId('')} st={st} svc={svc} />}
    </>
  )
}

function Detail({
  app,
  onClose,
  st,
  svc,
}: {
  app: Application
  onClose: () => void
  st: (s: ApplicationStatus) => string
  svc: (s: string) => string
}) {
  const { t, l, cyr } = useI18n()
  const { patch, remove, companyById } = useData()
  const toast = useToast()
  const [note, setNote] = useState('')
  const [confirm, setConfirm] = useState(false)
  const region = regionBySlug(app.region)

  const addNote = () => {
    if (!note.trim()) return
    const author = getSession()?.name ?? 'Admin'
    patch('applications', app.id, { notes: [...app.notes, { at: new Date().toISOString(), author, text: note.trim() }] })
    setNote('')
    toast(t('admin.apps.noteAdded'))
  }

  const budget = app.budget.startsWith('b') && ['b1', 'b2', 'b3', 'b4'].includes(app.budget) ? t(`apply.${app.budget}` as DictKey) : cyr(app.budget)
  const timeline = app.timeline.startsWith('t') && ['t1', 't2', 't3', 't4'].includes(app.timeline) ? t(`apply.${app.timeline}` as DictKey) : cyr(app.timeline)

  const rows: [string, string][] = [
    [t('admin.apps.type'), app.role === 'investor' ? t('admin.apps.typeInvestor') : t('admin.apps.typeProvider')],
    [t('admin.apps.service'), svc(app.service) || t('common.dash')],
    [t('admin.apps.sector'), app.sector ? l(sectorById(app.sector).name) : t('common.dash')],
    [t('admin.apps.region'), region ? l(region.name) : t('common.dash')],
    [t('admin.apps.budget'), budget || t('common.dash')],
    [t('admin.apps.timeline'), timeline || t('common.dash')],
  ]

  return (
    <Drawer
      title={t('admin.apps.id', { id: app.id.toUpperCase() })}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--ghost btn--sm adm-danger-text" onClick={() => setConfirm(true)}>
            <Trash2 size={16} /> {t('common.delete')}
          </button>
          <a href={`mailto:${app.email}`} className="btn btn--primary btn--sm">
            <Mail size={16} /> {t('admin.apps.reply')}
          </a>
        </>
      }
    >
      <div className="app-person">
        <span className="adm-avatar adm-avatar--lg">{initials(app.name)}</span>
        <div>
          <strong>{app.name}</strong>
          <span>{app.company}</span>
          <small className="muted">{t('admin.apps.arrived', { n: fmtDateTime(app.createdAt, t) })}</small>
        </div>
      </div>

      <div className="app-contacts">
        <a href={`mailto:${app.email}`}>
          <Mail size={15} /> {app.email}
        </a>
        {app.phone && (
          <a href={`tel:${app.phone.replace(/\s/g, '')}`}>
            <Phone size={15} /> {app.phone}
          </a>
        )}
        {app.country && (
          <span>
            <Globe size={15} /> {app.country}
          </span>
        )}
        {region && (
          <span>
            <MapPin size={15} /> {l(region.center)}
          </span>
        )}
      </div>

      <div className="form-grid">
        <label className="field">
          <span>{t('admin.apps.status')}</span>
          <Select
            value={app.status}
            onChange={(v) => {
              const next = v as ApplicationStatus
              patch('applications', app.id, { status: next })
              toast(t('admin.apps.statusSet', { n: st(next) }))
            }}
            options={statuses.map((s) => ({ value: s, label: st(s) }))}
          />
        </label>
        <label className="field">
          <span>{t('admin.apps.assigneeField')}</span>
          <Select
            value={app.assignee}
            onChange={(v) => {
              patch('applications', app.id, { assignee: v })
              toast(v ? t('admin.apps.assigned', { n: v }) : t('admin.apps.unassigned'))
            }}
            options={[
              { value: '', label: t('admin.apps.unassignedShort') },
              ...managers.map((m) => ({ value: m, label: m })),
            ]}
          />
        </label>
      </div>

      <dl className="app-facts">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      {app.needs.length > 0 && (
        <div className="app-block">
          <h4>{app.role === 'investor' ? t('admin.apps.needsInvestor') : t('admin.apps.needsProvider')}</h4>
          <div className="region-panel__tags">
            {app.needs.map((n) => (
              <span key={n} className="tag">
                {l(categoryById(n).name)}
              </span>
            ))}
          </div>
        </div>
      )}

      {app.message && (
        <div className="app-block">
          <h4>{t('admin.apps.message')}</h4>
          <p className="app-message">{cyr(app.message)}</p>
        </div>
      )}

      {app.companyIds.length > 0 && (
        <div className="app-block">
          <h4>{t('admin.apps.introCos')}</h4>
          <ul className="app-links">
            {app.companyIds.map((id) => {
              const c = companyById(id)
              return (
                <li key={id}>
                  {c ? (
                    <Link to={`/kompaniyalar/${c.id}`} target="_blank">
                      {c.name}
                    </Link>
                  ) : (
                    <span className="muted">{t('admin.apps.deletedCo', { id })}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="app-block">
        <h4>{t('admin.apps.notes')}</h4>
        {app.notes.length ? (
          <ol className="notes">
            {app.notes.map((n, i) => (
              <li key={i}>
                <div>
                  <strong>{n.author}</strong>
                  <small className="muted">{fmtDateTime(n.at, t)}</small>
                </div>
                <p>{n.text}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="muted">{t('admin.apps.noNotes')}</p>
        )}
        <div className="note-input">
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('admin.apps.notePh')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) addNote()
            }}
          />
          <button type="button" className="btn btn--soft btn--sm" onClick={addNote} disabled={!note.trim()}>
            <Send size={15} /> {t('common.add')}
          </button>
        </div>
      </div>

      {confirm && (
        <Confirm
          title={t('admin.apps.deleteTitle')}
          text={t('admin.apps.deleteText', { name: app.name, company: app.company })}
          onConfirm={() => {
            remove('applications', app.id)
            toast(t('admin.apps.deleted'), 'danger')
            onClose()
          }}
          onClose={() => setConfirm(false)}
        />
      )}
    </Drawer>
  )
}
