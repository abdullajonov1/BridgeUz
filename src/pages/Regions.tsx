import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Landmark, MapPin } from 'lucide-react'
import { PageHero, CtaBand } from '../components/ui'
import { UzMap } from '../components/UzMap'
import { RegionCard } from '../components/cards'
import { useData } from '../lib/store'
import { sectors, sectorById, type SectorId } from '../data/taxonomy'
import { useI18n } from '../i18n'

export default function Regions() {
  const { t, l, ll } = useI18n()
  const { regions, regionBySlug, publicOpportunities: opportunities, publicCompanies: companies } = useData()
  const oppCount = (slug: string) => opportunities.filter((o) => o.region === slug).length
  const [active, setActive] = useState('toshkent-shahri')
  const [sector, setSector] = useState<SectorId | 'all'>('all')

  const filtered = useMemo(
    () => (sector === 'all' ? regions : regions.filter((r) => r.sectors.includes(sector))),
    [regions, sector],
  )
  const region = regionBySlug(active)!
  const regionCompanies = companies.filter((c) => c.region === active).length

  return (
    <>
      <PageHero
        eyebrow={t('regions.eyebrow')}
        title={
          <>
            {t('regions.title')} <span className="accent">{t('regions.accent')}</span>
          </>
        }
        text={t('regions.text')}
      />

      <section className="section--tight">
        <div className="container">
          <div className="map-explorer">
            <div className="map-explorer__map">
              <div className="filter-row" role="group" aria-label={t('map.filterSectors')}>
                <button
                  type="button"
                  className={`pill${sector === 'all' ? ' is-active' : ''}`}
                  onClick={() => setSector('all')}
                >
                  {t('map.allSectors')}
                </button>
                {sectors.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`pill${sector === s.id ? ' is-active' : ''}`}
                    onClick={() => setSector(s.id)}
                  >
                    {l(s.name)}
                  </button>
                ))}
              </div>
              <UzMap
                active={active}
                onSelect={setActive}
                highlight={sector === 'all' ? undefined : filtered.map((r) => r.slug)}
                labels={['toshkent-shahri', 'samarqand', 'buxoro', 'navoiy', 'fargona', 'xorazm', 'qoraqalpogiston', 'surxondaryo']}
                labelSize={16}
              />
              <p className="map-explorer__hint muted">
                <MapPin size={14} /> {t('map.hint')}
              </p>
            </div>

            <aside className="region-panel" aria-live="polite">
              <span className="eyebrow">{l(region.center)}</span>
              <h2>{l(region.name)}</h2>
              <p className="region-panel__tagline">{l(region.tagline)}</p>
              <div className="region-panel__stats">
                <div>
                  <strong>{oppCount(region.slug)}</strong>
                  <span>{t('map.projects')}</span>
                </div>
                <div>
                  <strong>{regionCompanies}</strong>
                  <span>{t('map.partners')}</span>
                </div>
                <div>
                  <strong>{ll(region.zones).length}</strong>
                  <span>{t('map.fez')}</span>
                </div>
              </div>
              <h4>{t('map.sectors')}</h4>
              <div className="region-panel__tags">
                {region.sectors.map((s) => {
                  const sec = sectorById(s)
                  const Icon = sec.icon
                  return (
                    <span key={s} className="tag tag--icon">
                      <Icon size={15} /> {l(sec.name)}
                    </span>
                  )
                })}
              </div>
              <h4>{t('map.highlights')}</h4>
              <ul className="check-list">
                {ll(region.highlights).map((h) => (
                  <li key={h}>
                    <Check size={16} /> {h}
                  </li>
                ))}
              </ul>
              {ll(region.zones).length > 0 && (
                <p className="region-panel__zone">
                  <Landmark size={16} /> {ll(region.zones).join(', ')}
                </p>
              )}
              <Link to={`/hududlar/${region.slug}`} className="btn btn--primary btn--block">
                {t('map.page')} <ArrowRight size={18} />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="list-head">
            <h2 className="h3">
              {sector === 'all' ? t('regions.all') : t('regions.bySector', { name: l(sectorById(sector).name) })}
            </h2>
            <span className="muted">{t('regions.count', { n: filtered.length })}</span>
          </div>
          <div className="grid grid--3">
            {filtered.map((r) => (
              <RegionCard key={r.slug} region={r} count={oppCount(r.slug)} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={t('regions.cta.title')} text={t('regions.cta.text')} />
    </>
  )
}
