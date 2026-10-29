import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, GitCompareArrows, RotateCcw, Search } from 'lucide-react'
import { PageHero, CtaBand, EmptyState } from '../components/ui'
import { CompanyCard } from '../components/cards'
import { useData } from '../lib/store'
import { regions } from '../data/regions'
import { categories } from '../data/taxonomy'
import { useClearQuery, useQueryState } from '../lib/useQueryState'
import { useI18n } from '../i18n'
import { locFlat } from '../i18n/loc'
import { isPremiumListing } from '../lib/plan'
import { Select } from '../components/Select'

export default function Companies() {
  const { t, l } = useI18n()
  const { publicCompanies: companies } = useData()
  const [q, setQ] = useQueryState('q')
  const [category, setCategory] = useQueryState('toifa', 'all')
  const [region, setRegion] = useQueryState('hudud', 'all')
  const [verified, setVerified] = useQueryState('tekshirilgan')
  const [sort, setSort] = useQueryState('tartib', 'tavsiya')

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const result = companies.filter(
      (c) =>
        (category === 'all' || c.category === category) &&
        (region === 'all' || c.region === region) &&
        (!verified || c.verified) &&
        (!needle ||
          c.name.toLowerCase().includes(needle) ||
          locFlat(c.description).toLowerCase().includes(needle) ||
          locFlat(c.services).toLowerCase().includes(needle) ||
          locFlat(c.industries).toLowerCase().includes(needle)),
    )
    if (sort === 'reyting') result.sort((a, b) => b.rating - a.rating)
    if (sort === 'tajriba') result.sort((a, b) => a.founded - b.founded)
    if (sort === 'tavsiya') result.sort((a, b) => Number(isPremiumListing(b)) - Number(isPremiumListing(a)) || b.rating - a.rating)
    return result
  }, [companies, q, category, region, verified, sort])

  const dirty = q || category !== 'all' || region !== 'all' || verified
  const reset = useClearQuery(['q', 'toifa', 'hudud', 'tekshirilgan'])

  return (
    <>
      <PageHero
        eyebrow={t('co.eyebrow')}
        title={
          <>
            {t('co.title')} <span className="accent">{t('co.accent')}</span>
          </>
        }
        text={t('co.text')}
      />

      <section className="section--tight">
        <div className="container directory">
          <aside className="directory__side" aria-label={t('co.filters')}>
            <div className="side-block">
              <label className="field">
                <span>{t('common.search')}</span>
                <div className="input-icon">
                  <Search size={17} />
                  <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('co.searchPh')} />
                </div>
              </label>
            </div>
            <div className="side-block">
              <span className="side-block__title">{t('co.category')}</span>
              <div className="radio-list">
                <button
                  type="button"
                  className={`radio-item${category === 'all' ? ' is-active' : ''}`}
                  onClick={() => setCategory('all')}
                >
                  {t('co.allCategories')}
                  <span className="count">{companies.length}</span>
                </button>
                {categories.map((c) => {
                  const Icon = c.icon
                  const n = companies.filter((x) => x.category === c.id).length
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`radio-item${category === c.id ? ' is-active' : ''}`}
                      onClick={() => setCategory(c.id)}
                    >
                      <Icon size={16} /> {l(c.name)}
                      <span className="count">{n}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="side-block">
              <label className="field">
                <span>{t('co.region')}</span>
                <Select
                  value={region}
                  onChange={setRegion}
                  options={[
                    { value: 'all', label: t('regions.all') },
                    ...regions.map((r) => ({ value: r.slug, label: l(r.name) })),
                  ]}
                />
              </label>
            </div>
            <div className="side-block">
              <label className="switch">
                <input type="checkbox" checked={Boolean(verified)} onChange={(e) => setVerified(e.target.checked ? '1' : '')} />
                <span className="switch__track" />
                <span>
                  <BadgeCheck size={16} /> {t('co.verifiedOnly')}
                </span>
              </label>
            </div>
            {dirty && (
              <button type="button" className="btn btn--ghost btn--sm btn--block" onClick={reset}>
                <RotateCcw size={15} /> {t('co.clearFilters')}
              </button>
            )}
            <div className="side-promo">
              <GitCompareArrows size={22} />
              <p>
                <strong>{t('co.compareHint')}</strong> {t('co.compareText')}
              </p>
            </div>
          </aside>

          <div className="directory__main">
            <div className="toolbar toolbar--compact">
              <div className="toolbar__summary">{t('co.found', { n: list.length })}</div>
              <label className="field field--inline">
                <span>{t('co.sort')}</span>
                <Select
                  value={sort}
                  onChange={setSort}
                  options={[
                    { value: 'tavsiya', label: t('co.sort.rec') },
                    { value: 'reyting', label: t('co.sort.rating') },
                    { value: 'tajriba', label: t('co.sort.exp') },
                  ]}
                />
              </label>
            </div>
            {list.length ? (
              <div className="grid grid--2-3">
                {list.map((c) => (
                  <CompanyCard key={c.id} company={c} />
                ))}
              </div>
            ) : (
              <EmptyState
                title={t('co.empty')}
                text={t('co.emptyText')}
                action={
                  <Link to="/murojaat?xizmat=matching" className="btn btn--primary">
                    {t('co.findPartner')}
                  </Link>
                }
              />
            )}
          </div>
        </div>
      </section>

      <CtaBand title={t('co.cta.title')} text={t('co.cta.text')} />
    </>
  )
}
