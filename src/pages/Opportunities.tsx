import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { PageHero, CtaBand, EmptyState } from '../components/ui'
import { OpportunityCard } from '../components/cards'
import { formatUsd } from '../data/opportunities'
import { useData } from '../lib/store'
import { regions } from '../data/regions'
import { sectors } from '../data/taxonomy'
import { useClearQuery, useQueryState } from '../lib/useQueryState'
import { useI18n } from '../i18n'
import { Select } from '../components/Select'

export default function Opportunities() {
  const { t, l } = useI18n()
  const { publicOpportunities: opportunities } = useData()
  const [sector, setSector] = useQueryState('soha', 'all')
  const [region, setRegion] = useQueryState('hudud', 'all')
  const [size, setSize] = useQueryState('hajm', 'all')
  const [sort, setSort] = useQueryState('tartib', 'featured')

  const sizes = [
    { id: 'all', label: t('opp.size.all'), test: () => true },
    { id: 's', label: t('opp.size.s'), test: (v: number) => v <= 5 },
    { id: 'm', label: t('opp.size.m'), test: (v: number) => v > 5 && v <= 20 },
    { id: 'l', label: t('opp.size.l'), test: (v: number) => v > 20 },
  ]

  const list = useMemo(() => {
    const sizeTest = sizes.find((s) => s.id === size)?.test ?? (() => true)
    const result = opportunities.filter(
      (o) =>
        (sector === 'all' || o.sector === sector) &&
        (region === 'all' || o.region === region) &&
        sizeTest(o.investment),
    )
    if (sort === 'asc') result.sort((a, b) => a.investment - b.investment)
    if (sort === 'desc') result.sort((a, b) => b.investment - a.investment)
    if (sort === 'featured') result.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    return result
  }, [opportunities, sector, region, size, sort, sizes])

  const total = list.reduce((sum, o) => sum + o.investment, 0)
  const dirty = sector !== 'all' || region !== 'all' || size !== 'all'
  const reset = useClearQuery(['soha', 'hudud', 'hajm'])

  return (
    <>
      <PageHero
        eyebrow={t('opp.eyebrow')}
        title={
          <>
            {t('opp.title')} <span className="accent">{t('opp.accent')}</span>
          </>
        }
        text={t('opp.text')}
      />

      <section className="section--tight">
        <div className="container">
          <div className="sector-tabs" role="group" aria-label={t('opp.sector')}>
            <button type="button" className={`pill${sector === 'all' ? ' is-active' : ''}`} onClick={() => setSector('all')}>
              {t('common.all')}
            </button>
            {sectors.map((s) => {
              const Icon = s.icon
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`pill pill--icon${sector === s.id ? ' is-active' : ''}`}
                  onClick={() => setSector(s.id)}
                >
                  <Icon size={16} /> {l(s.name)}
                </button>
              )
            })}
          </div>

          <div className="toolbar">
            <div className="toolbar__filters">
              <label className="field field--inline">
                <span>{t('opp.region')}</span>
                <Select
                  value={region}
                  onChange={setRegion}
                  options={[
                    { value: 'all', label: t('regions.all') },
                    ...regions.map((r) => ({ value: r.slug, label: l(r.name) })),
                  ]}
                />
              </label>
              <label className="field field--inline">
                <span>{t('opp.size')}</span>
                <Select
                  value={size}
                  onChange={setSize}
                  options={sizes.map((s) => ({ value: s.id, label: s.label }))}
                />
              </label>
              <label className="field field--inline">
                <span>{t('opp.sort')}</span>
                <Select
                  value={sort}
                  onChange={setSort}
                  options={[
                    { value: 'featured', label: t('opp.sort.featured') },
                    { value: 'asc', label: t('opp.sort.asc') },
                    { value: 'desc', label: t('opp.sort.desc') },
                  ]}
                />
              </label>
              {dirty && (
                <button type="button" className="btn btn--ghost btn--sm" onClick={reset}>
                  <RotateCcw size={15} /> {t('common.clear')}
                </button>
              )}
            </div>
            <div className="toolbar__summary">
              {t('opp.summary', { n: list.length, total: t('money.mln', { n: formatUsd(total) }) })}
            </div>
          </div>

          {list.length ? (
            <div className="grid grid--3">
              {list.map((o) => (
                <OpportunityCard key={o.id} item={o} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('opp.empty')}
              text={t('opp.emptyText')}
              action={
                <Link to="/murojaat?xizmat=advisory" className="btn btn--primary">
                  {t('opp.ask')}
                </Link>
              }
            />
          )}
        </div>
      </section>

      <CtaBand title={t('opp.cta.title')} text={t('opp.cta.text')} />
    </>
  )
}
