import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Landmark } from 'lucide-react'
import { PageHero, CtaBand, EmptyState, SectionHead } from '../components/ui'
import { UzMap } from '../components/UzMap'
import { CompanyCard, OpportunityCard } from '../components/cards'
import { useData } from '../lib/store'
import { sectorById } from '../data/taxonomy'
import { useI18n } from '../i18n'
import NotFound from './NotFound'

export default function RegionDetail() {
  const { t, l, ll } = useI18n()
  const { regionBySlug, publicOpportunities: opportunities, publicCompanies: companies } = useData()
  const { slug = '' } = useParams()
  const region = regionBySlug(slug)
  if (!region) return <NotFound />

  const opps = opportunities.filter((o) => o.region === slug)
  const partners = companies.filter((c) => c.region === slug)
  const zones = ll(region.zones)

  return (
    <>
      <PageHero
        eyebrow={`${t('nav.regions')} · ${l(region.center)}`}
        title={
          <>
            {l(region.name)}: <span className="accent">{l(region.tagline).toLowerCase()}</span>
          </>
        }
      >
        <Link to="/hududlar" className="back-link">
          <ArrowLeft size={16} /> {t('regions.back')}
        </Link>
      </PageHero>

      <section className="section--tight">
        <div className="container region-overview">
          <div className="card region-overview__info">
            <h3>{t('regions.about')}</h3>
            <div className="region-panel__stats">
              <div>
                <strong>{opps.length}</strong>
                <span>{t('map.projects')}</span>
              </div>
              <div>
                <strong>{partners.length}</strong>
                <span>{t('map.partners')}</span>
              </div>
              <div>
                <strong>{zones.length}</strong>
                <span>{t('map.fez')}</span>
              </div>
            </div>
            <h4>{t('map.sectors')}</h4>
            <div className="region-panel__tags">
              {region.sectors.map((s) => {
                const sec = sectorById(s)
                const Icon = sec.icon
                return (
                  <Link key={s} to={`/imkoniyatlar?soha=${s}`} className="tag tag--icon">
                    <Icon size={15} /> {l(sec.name)}
                  </Link>
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
            {zones.length > 0 && (
              <p className="region-panel__zone">
                <Landmark size={16} /> {t('regions.fezLabel', { names: zones.join(', ') })}
              </p>
            )}
          </div>
          <div className="card region-overview__map">
            <UzMap active={region.slug} labels={[region.slug]} labelSize={16} />
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <SectionHead
            title={
              <>
                {t('regions.projectsTitle')} <span className="accent">{t('regions.projectsAccent')}</span>
              </>
            }
          />
          {opps.length ? (
            <div className="grid grid--3">
              {opps.map((o) => (
                <OpportunityCard key={o.id} item={o} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('regions.emptyProjects')}
              text={t('regions.emptyProjectsText')}
              action={
                <Link to="/murojaat?xizmat=advisory" className="btn btn--primary">
                  {t('regions.askAdvisory')}
                </Link>
              }
            />
          )}
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <SectionHead
            title={
              <>
                {t('regions.partnersTitle')} <span className="accent">{t('regions.partnersAccent')}</span>
              </>
            }
            action={
              <Link to={`/kompaniyalar?hudud=${region.slug}`} className="btn btn--ghost">
                {t('common.allItems')} <ArrowRight size={18} />
              </Link>
            }
          />
          {partners.length ? (
            <div className="grid grid--3">
              {partners.map((c) => (
                <CompanyCard key={c.id} company={c} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('regions.emptyPartners')}
              text={t('regions.emptyPartnersText')}
              action={
                <Link to="/murojaat?xizmat=matching" className="btn btn--primary">
                  {t('regions.findPartner')}
                </Link>
              }
            />
          )}
        </div>
      </section>

      <CtaBand title={t('regions.ctaRegion', { name: l(region.name) })} />
    </>
  )
}
