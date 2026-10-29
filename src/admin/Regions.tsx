import { useState, type FormEvent } from 'react'
import { Landmark, Pencil } from 'lucide-react'
import { useData } from '../lib/store'
import type { Region } from '../data/regions'
import { sectors, sectorById, type SectorId } from '../data/taxonomy'
import { Modal, PageHead, useToast } from './ui'
import { useI18n } from '../i18n'
import { locInput, locListInput, parseLines, writeLoc, writeLocList } from '../i18n/loc'
import { LocLangBar, locCode, locFilled, toLoc, toLocList, type LocCode } from './LocLangBar'

function RegionForm({ region, onClose }: { region: Region; onClose: () => void }) {
  const { t, l, lang } = useI18n()
  const { upsert } = useData()
  const toast = useToast()
  const [locLang, setLocLang] = useState<LocCode>(() => locCode(lang))
  const [tagline, setTagline] = useState(() => toLoc(region.tagline))
  const [picked, setPicked] = useState<SectorId[]>(region.sectors)
  const [highlights, setHighlights] = useState(() => toLocList(region.highlights))
  const [zones, setZones] = useState(() => toLocList(region.zones))
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!tagline.uz.trim() || picked.length === 0) {
      setError(t('admin.reg.err'))
      setLocLang('uz')
      return
    }
    upsert('regions', {
      ...region,
      tagline,
      sectors: picked,
      highlights,
      zones,
    })
    toast(t('admin.reg.updated', { name: l(region.name) }))
    onClose()
  }

  return (
    <Modal
      title={l(region.name)}
      subtitle={t('admin.reg.center', { n: l(region.center) })}
      onClose={onClose}
      wide
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="submit" form="region-form" className="btn btn--primary">
            {t('common.save')}
          </button>
        </>
      }
    >
      <form id="region-form" className="adm-form" onSubmit={submit} noValidate>
        <LocLangBar
          value={locLang}
          onChange={setLocLang}
          filled={{ uz: locFilled(tagline, 'uz'), en: locFilled(tagline, 'en'), ru: locFilled(tagline, 'ru') }}
        />
        <label className="field field--full">
          <span>{t('admin.reg.tagline')}</span>
          <input value={locInput(tagline, locLang, false)} onChange={(e) => setTagline(writeLoc(tagline, e.target.value, locLang))} />
        </label>
        <fieldset className="field field--full adm-fieldset">
          <span>{t('admin.reg.sectors')}</span>
          <div className="adm-chips">
            {sectors.map((s) => {
              const on = picked.includes(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`pill${on ? ' is-active' : ''}`}
                  aria-pressed={on}
                  onClick={() => setPicked(on ? picked.filter((x) => x !== s.id) : [...picked, s.id])}
                >
                  {l(s.name)}
                </button>
              )
            })}
          </div>
        </fieldset>
        <label className="field field--full">
          <span>{t('admin.reg.highlights')}</span>
          <textarea rows={4} value={locListInput(highlights, locLang, '\n', false)} onChange={(e) => setHighlights(writeLocList(highlights, parseLines(e.target.value), locLang))} />
        </label>
        <label className="field field--full">
          <span>{t('admin.reg.zones')}</span>
          <input
            value={locListInput(zones, locLang, ', ', false)}
            onChange={(e) => setZones(writeLocList(zones, parseLines(e.target.value, /,/), locLang))}
            placeholder={t('admin.reg.zonesPh')}
          />
        </label>
        {error && <p className="field-error field--full">{error}</p>}
      </form>
    </Modal>
  )
}

export default function AdminRegions() {
  const { t, l, ll } = useI18n()
  const { regions, publicOpportunities, publicCompanies } = useData()
  const [editing, setEditing] = useState<Region | null>(null)

  return (
    <>
      <PageHead title={t('admin.nav.regions')} text={t('admin.reg.lead')} />
      <div className="adm-regions">
        {regions.map((r) => (
          <article key={r.slug} className="adm-card adm-region">
            <div className="adm-region__head">
              <div>
                <h3>{l(r.name)}</h3>
                <p className="muted">{l(r.tagline)}</p>
              </div>
              <button type="button" className="icon-btn icon-btn--sm" aria-label={t('admin.reg.editAria', { name: l(r.name) })} onClick={() => setEditing(r)}>
                <Pencil size={16} />
              </button>
            </div>
            <div className="region-panel__tags">
              {r.sectors.map((s) => (
                <span key={s} className="tag">
                  {l(sectorById(s).name)}
                </span>
              ))}
            </div>
            <div className="adm-region__stats">
              <span>
                <strong>{publicOpportunities.filter((o) => o.region === r.slug).length}</strong> {t('admin.reg.projects')}
              </span>
              <span>
                <strong>{publicCompanies.filter((c) => c.region === r.slug).length}</strong> {t('admin.reg.partners')}
              </span>
              {ll(r.zones).length > 0 && (
                <span className="adm-region__zone">
                  <Landmark size={14} /> {ll(r.zones).join(', ')}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
      {editing && <RegionForm region={editing} onClose={() => setEditing(null)} />}
    </>
  )
}
