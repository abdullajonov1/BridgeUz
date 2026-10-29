import { useState, type FormEvent } from 'react'
import { CircleAlert, Clock, Plus, Trash2, Wallet } from 'lucide-react'
import { useData } from '../lib/store'
import { useQueryState } from '../lib/useQueryState'
import { paymentStatusMeta, type Payment, type PaymentStatus, type PaymentType } from '../data/payments'
import { Confirm, Empty, Kpi, Modal, PageHead, useToast } from './ui'
import { fmtDate, fmtMoney } from './format'
import { useI18n } from '../i18n'
import type { DictKey } from '../i18n'
import { Select } from '../components/Select'

const types: PaymentType[] = ['advisory', 'matching', 'premium', 'subscription']
const statuses = Object.keys(paymentStatusMeta) as PaymentStatus[]

function PaymentForm({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const { upsert } = useData()
  const toast = useToast()
  const [f, setF] = useState<Payment>(() => ({
    id: '',
    date: new Date().toISOString().slice(0, 10),
    payer: '',
    type: 'advisory',
    amount: 0,
    status: 'pending',
    note: '',
  }))
  const [error, setError] = useState('')
  const set = <K extends keyof Payment>(k: K, v: Payment[K]) => setF((x) => ({ ...x, [k]: v }))
  const typeLabel = (x: PaymentType) => t(`payType.${x}` as DictKey)
  const statusLabel = (s: PaymentStatus) => t(`payStatus.${s}` as DictKey)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!f.payer.trim() || !(f.amount > 0)) {
      setError(t('admin.fin.err'))
      return
    }
    upsert('payments', { ...f, id: `p-${Date.now().toString(36)}`, payer: f.payer.trim() })
    toast(t('admin.fin.added'))
    onClose()
  }

  return (
    <Modal
      title={t('admin.fin.new')}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="submit" form="pay-form" className="btn btn--primary">
            {t('common.save')}
          </button>
        </>
      }
    >
      <form id="pay-form" className="adm-form" onSubmit={submit} noValidate>
        <label className="field field--full">
          <span>{t('admin.fin.payer')}</span>
          <input value={f.payer} onChange={(e) => set('payer', e.target.value)} autoFocus />
        </label>
        <label className="field">
          <span>{t('admin.fin.type')}</span>
          <Select
            value={f.type}
            onChange={(v) => set('type', v as PaymentType)}
            options={types.map((x) => ({ value: x, label: typeLabel(x) }))}
          />
        </label>
        <label className="field">
          <span>{t('admin.fin.amount')}</span>
          <input type="number" min={1} value={f.amount || ''} onChange={(e) => set('amount', Number(e.target.value))} />
        </label>
        <label className="field">
          <span>{t('admin.fin.date')}</span>
          <input type="date" value={f.date} onChange={(e) => set('date', e.target.value)} />
        </label>
        <label className="field">
          <span>{t('admin.fin.status')}</span>
          <Select
            value={f.status}
            onChange={(v) => set('status', v as PaymentStatus)}
            options={statuses.map((s) => ({ value: s, label: statusLabel(s) }))}
          />
        </label>
        <label className="field field--full">
          <span>{t('admin.fin.note')}</span>
          <input value={f.note} onChange={(e) => set('note', e.target.value)} />
        </label>
        {error && <p className="field-error field--full">{error}</p>}
      </form>
    </Modal>
  )
}

export default function Payments() {
  const { t } = useI18n()
  const { payments, patch, remove } = useData()
  const toast = useToast()
  const [status, setStatus] = useQueryState('holat', 'all')
  const [type, setType] = useQueryState('turi', 'all')
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState<Payment | null>(null)
  const typeLabel = (x: PaymentType) => t(`payType.${x}` as DictKey)
  const statusLabel = (s: PaymentStatus) => t(`payStatus.${s}` as DictKey)

  const sum = (list: Payment[]) => list.reduce((s, p) => s + p.amount, 0)
  const paid = payments.filter((p) => p.status === 'paid')
  const pending = payments.filter((p) => p.status === 'pending')
  const overdue = payments.filter((p) => p.status === 'overdue')
  const byType = types.map((x) => ({ t: x, total: sum(paid.filter((p) => p.type === x)) }))
  const maxType = Math.max(1, ...byType.map((x) => x.total))

  const [now] = useState(() => new Date())
  const months = Array.from({ length: 4 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 3 + i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    return { label: t(`monthFull.${d.getMonth()}` as DictKey), total: sum(paid.filter((p) => p.date.startsWith(key))) }
  })
  const maxMonth = Math.max(1, ...months.map((m) => m.total))

  const list = payments
    .filter((p) => (status === 'all' || p.status === status) && (type === 'all' || p.type === type))
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <PageHead
        title={t('admin.nav.finance')}
        text={t('admin.fin.lead')}
        actions={
          <button type="button" className="btn btn--primary" onClick={() => setAdding(true)}>
            <Plus size={18} /> {t('admin.fin.add')}
          </button>
        }
      />

      <div className="kpis kpis--3">
        <Kpi icon={Wallet} label={t('admin.fin.total')} value={fmtMoney(sum(paid))} hint={t('admin.fin.paidCount', { n: paid.length })} tone="green" />
        <Kpi icon={Clock} label={t('admin.fin.pending')} value={fmtMoney(sum(pending))} hint={t('admin.fin.bills', { n: pending.length })} tone="amber" />
        <Kpi icon={CircleAlert} label={t('admin.fin.overdue')} value={fmtMoney(sum(overdue))} hint={t('admin.fin.bills', { n: overdue.length })} tone="red" />
      </div>

      <div className="adm-grid adm-grid--1-1">
        <section className="adm-card">
          <h2 className="adm-card__title">{t('admin.fin.byType')}</h2>
          <ul className="funnel">
            {byType.map(({ t: x, total }) => (
              <li key={x}>
                <div>
                  <span className="funnel__label">{typeLabel(x)}</span>
                  <span className="funnel__track">
                    <span className="funnel__bar funnel__bar--green" style={{ width: `${(total / maxType) * 100}%` }} />
                  </span>
                  <strong>{fmtMoney(total)}</strong>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="adm-card">
          <h2 className="adm-card__title">{t('admin.fin.byMonth')}</h2>
          <ul className="funnel">
            {months.map((m, i) => (
              <li key={m.label}>
                <div>
                  <span className="funnel__label">{m.label}</span>
                  <span className="funnel__track">
                    <span className={`funnel__bar funnel__bar--${i === months.length - 1 ? 'navy' : 'blue'}`} style={{ width: `${(m.total / maxMonth) * 100}%` }} />
                  </span>
                  <strong>{fmtMoney(m.total)}</strong>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="adm-card adm-card--flush">
        <div className="adm-toolbar">
          <Select
            className="adm-select"
            value={status}
            onChange={setStatus}
            aria-label={t('admin.fin.status')}
            options={[
              { value: 'all', label: t('admin.fin.allStatuses') },
              ...statuses.map((s) => ({ value: s, label: statusLabel(s) })),
            ]}
          />
          <Select
            className="adm-select"
            value={type}
            onChange={setType}
            aria-label={t('admin.fin.type')}
            options={[
              { value: 'all', label: t('admin.fin.allTypes') },
              ...types.map((x) => ({ value: x, label: typeLabel(x) })),
            ]}
          />
          <span className="muted adm-toolbar__count">
            {t('common.count', { n: list.length })} · {fmtMoney(sum(list))}
          </span>
        </div>
        {list.length ? (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>{t('admin.fin.date')}</th>
                  <th>{t('admin.fin.payerName')}</th>
                  <th>{t('admin.fin.type')}</th>
                  <th>{t('admin.fin.note')}</th>
                  <th className="right">{t('admin.fin.amountCol')}</th>
                  <th>{t('admin.fin.status')}</th>
                  <th>
                    <span className="sr-only">{t('admin.opp.actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id}>
                    <td className="nowrap muted">{fmtDate(p.date, t)}</td>
                    <td>
                      <strong>{p.payer}</strong>
                    </td>
                    <td>{typeLabel(p.type)}</td>
                    <td className="muted">{p.note || t('common.dash')}</td>
                    <td className="right nowrap">
                      <strong>{fmtMoney(p.amount)}</strong>
                    </td>
                    <td>
                      <Select
                        className={`adm-status-select adm-status-select--${paymentStatusMeta[p.status].tone}`}
                        value={p.status}
                        aria-label={t('admin.fin.status')}
                        onChange={(v) => {
                          const next = v as PaymentStatus
                          patch('payments', p.id, { status: next })
                          toast(t('admin.fin.statusSet', { payer: p.payer, status: statusLabel(next) }))
                        }}
                        options={statuses.map((s) => ({ value: s, label: statusLabel(s) }))}
                      />
                    </td>
                    <td>
                      <div className="adm-actions">
                        <button type="button" className="icon-btn icon-btn--sm icon-btn--danger" aria-label={t('common.delete')} title={t('common.delete')} onClick={() => setDeleting(p)}>
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
          <Empty text={t('admin.fin.empty')} />
        )}
      </div>

      {adding && <PaymentForm onClose={() => setAdding(false)} />}
      {deleting && (
        <Confirm
          title={t('admin.fin.deleteTitle')}
          text={t('admin.fin.deleteText', { payer: `${deleting.payer} — ${fmtMoney(deleting.amount)}` })}
          onConfirm={() => {
            remove('payments', deleting.id)
            toast(t('admin.fin.deleted'), 'danger')
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  )
}
