import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Check,
  Clock,
  Crown,
  GitCompareArrows,
  Languages,
  Lock,
  MapPin,
  Plus,
  Star,
  Users,
} from 'lucide-react'
import { CompanyCard } from '../components/cards'
import { SectionHead } from '../components/ui'
import { useData } from '../lib/store'
import { regionBySlug } from '../data/regions'
import { categoryById, displayLanguages } from '../data/taxonomy'
import { COMPARE_LIMIT, useCompare } from '../lib/compare'
import { useI18n } from '../i18n'
import { isPremiumListing } from '../lib/plan'
import NotFound from './NotFound'

export default function CompanyDetail() {
  const { t, l, ll } = useI18n()
  const { publicCompanies: companies } = useData()
  const { id = '' } = useParams()
  const company = companies.find((c) => c.id === id)
  const { has, toggle, ids } = useCompare()
  if (!company) return <NotFound />

  const category = categoryById(company.category)
  const region = regionBySlug(company.region)
  const CatIcon = category.icon
  const selected = has(company.id)
  const similar = companies.filter((c) => c.category === company.category && c.id !== company.id).slice(0, 3)
  const price = company.priceFrom
    ? t('money.from', { n: `$${company.priceFrom.toLocaleString('en-US')}` })
    : t('money.negotiable')

  const facts = [
    { icon: Calendar, label: t('co.founded'), value: t('common.year', { n: company.founded }) },
    { icon: Users, label: t('co.staff'), value: company.employees },
    { icon: Clock, label: t('co.response'), value: t('common.hours', { n: company.responseHours }) },
    { icon: Languages, label: t('co.langs'), value: displayLanguages(company.languages, l) },
  ]

  return (
    <>
      <section className="profile-hero">
        <div className="container">
          <Link to="/kompaniyalar" className="back-link">
            <ArrowLeft size={16} /> {t('co.back')}
          </Link>
          <div className="profile-hero__card">
            <span className="avatar avatar--xl">{company.name.slice(0, 2).toUpperCase()}</span>
            <div className="profile-hero__main">
              <div className="profile-hero__badges">
                {isPremiumListing(company) && (
                  <span className="badge badge--amber">
                    <Crown size={13} /> {t('common.premium')}
                  </span>
                )}
                {company.verified ? (
                  <span className="badge badge--green">
                    <BadgeCheck size={13} /> {t('common.verified')}
                  </span>
                ) : (
                  <span className="badge">{t('co.pending')}</span>
                )}
              </div>
              <h1>{company.name}</h1>
              <div className="profile-hero__meta">
                <span>
                  <CatIcon size={16} /> {l(category.name)}
                </span>
                <span>
                  <MapPin size={16} /> {region ? l(region.name) : ''}
                </span>
                <span className="rating">
                  <Star size={16} fill="currentColor" /> {company.rating.toFixed(1)}
                  <span className="muted">· {t('co.reviews', { n: company.reviews })}</span>
                </span>
              </div>
            </div>
            <div className="profile-hero__actions">
              <Link to={`/murojaat?xizmat=matching&kompaniyalar=${company.id}`} className="btn btn--primary btn--lg">
                {t('co.intro')}
              </Link>
              <button
                type="button"
                className={`btn btn--ghost btn--lg${selected ? ' is-on' : ''}`}
                aria-pressed={selected}
                disabled={!selected && ids.length >= COMPARE_LIMIT}
                onClick={() => toggle(company.id)}
              >
                {selected ? <GitCompareArrows size={18} /> : <Plus size={18} />}
                {selected ? t('co.inCompare') : t('co.addCompare')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container profile">
          <div className="profile__main">
            <div className="card">
              <h3>{t('co.about')}</h3>
              <p className="lead-text">{l(company.description)}</p>
              <div className="facts">
                {facts.map((f) => {
                  const Icon = f.icon
                  return (
                    <div key={f.label} className="fact">
                      <Icon size={18} />
                      <span>{f.label}</span>
                      <strong>{f.value}</strong>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="card">
              <h3>{t('co.services')}</h3>
              <ul className="service-list">
                {ll(company.services).map((s) => (
                  <li key={s}>
                    <Check size={16} /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3>{t('co.industries')}</h3>
              <div className="region-panel__tags">
                {ll(company.industries).map((i) => (
                  <span key={i} className="tag">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className="profile__side">
            <div className="card price-card">
              <span className="price-card__label">{t('co.price')}</span>
              <strong className="price-card__value">{price}</strong>
              <p className="muted">{t('co.priceNote')}</p>
            </div>
            <div className="card contact-lock">
              <span className="contact-lock__icon">
                <Lock size={20} />
              </span>
              <h4>{t('co.contactLock')}</h4>
              <p className="muted">{t('co.contactLockText')}</p>
              <Link to={`/murojaat?xizmat=matching&kompaniyalar=${company.id}`} className="btn btn--primary btn--block">
                {t('co.askContact')}
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="section--tight">
          <div className="container">
            <SectionHead
              title={
                <>
                  {t('co.similar')} <span className="accent">{t('co.similarAccent')}</span>
                </>
              }
            />
            <div className="grid grid--3">
              {similar.map((c) => (
                <CompanyCard key={c.id} company={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
