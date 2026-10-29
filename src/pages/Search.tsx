import { Link, useSearchParams } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { SearchBar } from '../components/SearchBar'
import { CompanyCard, OpportunityCard } from '../components/cards'
import { EmptyState } from '../components/ui'
import { useData } from '../lib/store'
import { categoryById, sectorById } from '../data/taxonomy'
import { useI18n } from '../i18n'
import { locFlat } from '../i18n/loc'

const norm = (s: string) => s.toLowerCase().replace(/[‘’ʻʼ'`]/g, '')

export default function Search() {
  const { t, l } = useI18n()
  const { regions, publicOpportunities: opportunities, publicCompanies: companies } = useData()
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const n = norm(q.trim())

  const match = (...fields: (string | undefined)[]) => !n || fields.some((f) => f && norm(f).includes(n))

  const regionHits = regions.filter((r) =>
    match(locFlat(r.name), locFlat(r.center), locFlat(r.tagline), locFlat(r.highlights)),
  )
  const oppHits = opportunities.filter((o) =>
    match(locFlat(o.title), locFlat(o.summary), locFlat(sectorById(o.sector).name), locFlat(regions.find((r) => r.slug === o.region)?.name)),
  )
  const companyHits = companies.filter((c) =>
    match(
      c.name,
      locFlat(c.description),
      locFlat(c.services),
      locFlat(c.industries),
      locFlat(categoryById(c.category).name),
      locFlat(regions.find((r) => r.slug === c.region)?.name),
    ),
  )
  const total = regionHits.length + oppHits.length + companyHits.length

  return (
    <>
      <section className="page-hero page-hero--search">
        <div className="container page-hero__inner">
          <span className="eyebrow eyebrow--solid">{t('find.eyebrow')}</span>
          <h1>{q ? t('find.results', { q }) : t('find.title')}</h1>
          <SearchBar key={q} initial={q} size="md" />
          {q && <p className="muted">{t('find.found', { n: total })}</p>}
        </div>
      </section>

      <section className="section--tight">
        <div className="container search-results">
          {total === 0 && (
            <EmptyState
              title={t('find.empty')}
              text={t('find.emptyText')}
              action={
                <Link to="/murojaat" className="btn btn--primary">
                  {t('cta.apply')}
                </Link>
              }
            />
          )}

          {regionHits.length > 0 && (
            <div className="result-group">
              <h2 className="h3">
                {t('find.regions')} <span className="count">{regionHits.length}</span>
              </h2>
              <div className="region-links">
                {regionHits.map((r) => (
                  <Link key={r.slug} to={`/hududlar/${r.slug}`} className="region-link">
                    <MapPin size={16} />
                    <span>
                      <strong>{l(r.name)}</strong>
                      <small>{l(r.tagline)}</small>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {oppHits.length > 0 && (
            <div className="result-group">
              <h2 className="h3">
                {t('find.opps')} <span className="count">{oppHits.length}</span>
              </h2>
              <div className="grid grid--3">
                {oppHits.slice(0, 6).map((o) => (
                  <OpportunityCard key={o.id} item={o} />
                ))}
              </div>
            </div>
          )}

          {companyHits.length > 0 && (
            <div className="result-group">
              <h2 className="h3">
                {t('find.companies')} <span className="count">{companyHits.length}</span>
              </h2>
              <div className="grid grid--3">
                {companyHits.slice(0, 6).map((c) => (
                  <CompanyCard key={c.id} company={c} />
                ))}
              </div>
              {companyHits.length > 6 && (
                <Link to={`/kompaniyalar?q=${encodeURIComponent(q)}`} className="btn btn--ghost result-group__more">
                  {t('find.moreCompanies', { n: companyHits.length })}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
