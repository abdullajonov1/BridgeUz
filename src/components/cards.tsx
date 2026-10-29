import { Link } from 'react-router-dom'
import { ArrowUpRight, BadgeCheck, Check, Crown, MapPin, Plus, Star } from 'lucide-react'
import type { Company } from '../data/companies'
import { formatUsd, opportunityFormatKeys, type Opportunity } from '../data/opportunities'
import { regionBySlug, type Region } from '../data/regions'
import { categoryById, sectorById } from '../data/taxonomy'
import { COMPARE_LIMIT, useCompare } from '../lib/compare'
import { useI18n } from '../i18n'
import { isPremiumListing } from '../lib/plan'

export function CompanyCard({ company }: { company: Company }) {
  const { has, toggle, ids } = useCompare()
  const { t, l } = useI18n()
  const category = categoryById(company.category)
  const region = regionBySlug(company.region)
  const selected = has(company.id)
  const full = !selected && ids.length >= COMPARE_LIMIT
  const Icon = category.icon

  return (
    <article className={`company-card${isPremiumListing(company) ? ' company-card--premium' : ''}`}>
      <div className="company-card__top">
        <span className="avatar avatar--lg">{company.name.slice(0, 2).toUpperCase()}</span>
        <div className="company-card__badges">
          {isPremiumListing(company) && (
            <span className="badge badge--amber">
              <Crown size={13} /> {t('common.premium')}
            </span>
          )}
          {company.verified && (
            <span className="badge badge--green">
              <BadgeCheck size={13} /> {t('common.verified')}
            </span>
          )}
        </div>
      </div>
      <h3 className="company-card__name">
        <Link to={`/kompaniyalar/${company.id}`} className="stretched">
          {company.name}
        </Link>
      </h3>
      <div className="company-card__meta">
        <span>
          <Icon size={15} /> {l(category.name)}
        </span>
        <span>
          <MapPin size={15} /> {region ? l(region.center) : ''}
        </span>
      </div>
      <p className="company-card__desc">{l(company.description)}</p>
      <div className="company-card__foot">
        <span className="rating">
          <Star size={15} fill="currentColor" /> {company.rating.toFixed(1)}
          <span className="muted">({company.reviews})</span>
        </span>
        <button
          type="button"
          className={`compare-toggle${selected ? ' is-on' : ''}`}
          aria-pressed={selected}
          disabled={full}
          title={full ? t('co.compareLimit', { n: COMPARE_LIMIT }) : undefined}
          onClick={() => toggle(company.id)}
        >
          {selected ? <Check size={15} /> : <Plus size={15} />}
          {selected ? t('co.selected') : t('co.compare')}
        </button>
      </div>
    </article>
  )
}

export function OpportunityCard({ item }: { item: Opportunity }) {
  const { t, l, ll } = useI18n()
  const sector = sectorById(item.sector)
  const region = regionBySlug(item.region)
  const Icon = sector.icon
  return (
    <article className="opp-card">
      <div className={`opp-card__cover opp-card__cover--${item.sector}`}>
        <span className="opp-card__icon">
          <Icon size={26} />
        </span>
        <span className="badge badge--glass">{t(opportunityFormatKeys[item.format])}</span>
      </div>
      <div className="opp-card__body">
        <div className="opp-card__meta">
          <span>
            <MapPin size={14} /> {region ? l(region.name) : ''}
          </span>
          <span className="dot-sep">{l(sector.name)}</span>
        </div>
        <h3>{l(item.title)}</h3>
        <p>{l(item.summary)}</p>
        <ul className="opp-card__adv">
          {ll(item.advantages).map((a) => (
            <li key={a}>
              <Check size={14} /> {a}
            </li>
          ))}
        </ul>
      </div>
      <div className="opp-card__foot">
        <div>
          <span className="opp-card__label">{t('opp.investment')}</span>
          <strong className="opp-card__value">{t('money.mln', { n: formatUsd(item.investment) })}</strong>
        </div>
        <Link to={`/murojaat?xizmat=advisory&imkoniyat=${item.id}`} className="btn btn--soft btn--sm">
          {t('opp.interest')} <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  )
}

export function RegionCard({ region, count }: { region: Region; count: number }) {
  const { t, l } = useI18n()
  return (
    <Link to={`/hududlar/${region.slug}`} className="region-card">
      <div className="region-card__head">
        <span className="region-card__pin">
          <MapPin size={18} />
        </span>
        <ArrowUpRight size={18} className="region-card__arrow" />
      </div>
      <h3>{l(region.name)}</h3>
      <p>{l(region.tagline)}</p>
      <div className="region-card__tags">
        {region.sectors.map((s) => (
          <span key={s} className="tag">
            {l(sectorById(s).name)}
          </span>
        ))}
      </div>
      <span className="region-card__count">{t('regions.cardCount', { n: count })}</span>
    </Link>
  )
}
