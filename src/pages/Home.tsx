import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChartColumn,
  BadgeCheck,
  BuildingComplex,
  Clock,
  FileText,
  Globe,
  Handshake,
  MapPin,
  MapPinned,
  MessageCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Users,
  CircleQuestionMark,
  Settings,
  UserRound,
  ChartNoAxesColumnIncreasing,
} from 'lucide-react'
import { Skyline } from '../components/Skyline'
import { UzMap } from '../components/UzMap'
import { SearchBar } from '../components/SearchBar'
import { MarketChart } from '../components/MarketChart'
import { OpportunityCard } from '../components/cards'
import { CtaBand, SectionHead, SupportMark } from '../components/ui'
import { categories, sectors } from '../data/taxonomy'
import { comparison, marketStats, problems, steps } from '../data/content'
import { useData } from '../lib/store'
import { useI18n } from '../i18n'

const problemIcons = [
  [FileText, ChartColumn, MapPin],
  [Users, ShieldCheck, Handshake],
  [Clock, Settings, CircleQuestionMark],
]
const stepIcons = [FileText, Search, SlidersHorizontal, MessageCircle, Target]
const statIcons = [ChartNoAxesColumnIncreasing, Users, Globe]

function Hero() {
  const { t, l } = useI18n()
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="eyebrow">
            <span className="eyebrow__dot" /> {t('home.eyebrow')}
          </span>
          <h1>
            {t('home.hero.title')} <span className="accent">{t('home.hero.accent')}</span>
          </h1>
          <p className="hero__lead">{t('home.hero.lead')}</p>
          <SearchBar />
          <div className="hero__quick">
            <span className="muted">{t('search.popular')}</span>
            <Link to="/hududlar/toshkent-shahri">{t('search.quick.tashkent')}</Link>
            <Link to="/kompaniyalar?toifa=yuridik">{t('search.quick.legal')}</Link>
            <Link to="/kompaniyalar?toifa=logistika">{t('search.quick.logistics')}</Link>
            <Link to="/imkoniyatlar?soha=yashil">{t('search.quick.green')}</Link>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero-map">
            <div className="hero-map__head">
              <span className="hero-map__title">
                <MapPinned size={18} /> {t('map.title')}
              </span>
            </div>
            <UzMap labels={['toshkent-shahri', 'samarqand', 'navoiy', 'fargona', 'xorazm']} />
          </div>
          <div className="float-card float-card--a">
            <span className="float-card__icon float-card__icon--blue">
              <TrendingUp size={20} />
            </span>
            <div>
              <strong>+20,2%</strong>
              <span>{t('home.float.growth')}</span>
            </div>
          </div>
          <div className="float-card float-card--b">
            <span className="float-card__icon float-card__icon--green">
              <BadgeCheck size={20} />
            </span>
            <div>
              <strong>{t('home.float.partners')}</strong>
              <span>{t('home.float.partnersNote')}</span>
            </div>
          </div>
          <div className="float-card float-card--c">
            <span className="float-card__icon float-card__icon--navy">
              <BuildingComplex size={20} />
            </span>
            <div>
              <strong>5000+</strong>
              <span>{t('home.float.companies')}</span>
            </div>
          </div>
        </div>
      </div>

      <Skyline className="hero__skyline" />

      <div className="container">
        <nav className="category-strip" aria-label={t('home.cats')}>
          {categories.map((c) => {
            const Icon = c.icon
            return (
              <Link key={c.id} to={`/kompaniyalar?toifa=${c.id}`} className="category-tile">
                <span className="category-tile__icon">
                  <Icon size={24} />
                </span>
                <span>{l(c.short)}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </section>
  )
}

function Problem() {
  const { t } = useI18n()
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow={t('home.problem.eyebrow')}
          title={
            <>
              {t('home.problem.title')} <span className="accent">{t('home.problem.accent')}</span>
            </>
          }
          text={t('home.problem.text')}
        />
        <div className="grid grid--3">
          {problems.map((p, i) => (
            <article key={p.title} className="problem-card">
              <div className="problem-card__head">
                <span className="num-badge">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t(p.title)}</h3>
              </div>
              <ul className="problem-card__list">
                {p.items.map((item, j) => {
                  const Icon = problemIcons[i][j]
                  return (
                    <li key={item}>
                      <Icon size={20} />
                      {t(item)}
                    </li>
                  )
                })}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Market() {
  const { t, l } = useI18n()
  return (
    <section className="section section--white">
      <div className="container">
        <SectionHead
          eyebrow={t('home.market.eyebrow')}
          title={
            <>
              {t('home.market.title')} <span className="accent">{t('home.market.accent')}</span>
            </>
          }
          text={t('home.market.text')}
        />
        <div className="market">
          <div className="market__stats">
            {marketStats.map((s, i) => {
              const Icon = statIcons[i]
              return (
                <div key={s.label} className="stat-tile">
                  <span className="stat-tile__icon">
                    <Icon size={22} />
                  </span>
                  <strong className="stat-tile__value">{s.valueKey ? t(s.valueKey) : s.value}</strong>
                  <span className="stat-tile__label">{t(s.label)}</span>
                  <span className="stat-tile__note">{t(s.note)}</span>
                </div>
              )
            })}
          </div>
          <MarketChart />
          <div className="sectors-panel">
            <h3>{t('home.market.sectors')}</h3>
            <div className="sectors-grid">
              {sectors.map((s) => {
                const Icon = s.icon
                return (
                  <Link key={s.id} to={`/imkoniyatlar?soha=${s.id}`} className="sector-chip">
                    <span className="sector-chip__icon">
                      <Icon size={20} />
                    </span>
                    {l(s.name)}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Solution() {
  const { t } = useI18n()
  const pillars = [
    { to: '/hududlar', icon: MapPinned, title: 'home.pillar1.title', text: 'home.pillar1.text', tone: 'blue' },
    { to: '/imkoniyatlar', icon: BuildingComplex, title: 'home.pillar2.title', text: 'home.pillar2.text', tone: 'navy' },
    { to: '/kompaniyalar', icon: Handshake, title: 'home.pillar3.title', text: 'home.pillar3.text', tone: 'green' },
    { to: '/xizmatlar', icon: UserRound, title: 'home.pillar4.title', text: 'home.pillar4.text', tone: 'violet' },
  ] as const
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow={t('home.solution.eyebrow')}
          title={
            <>
              {t('home.solution.title')} <span className="accent">{t('home.solution.accent')}</span>
            </>
          }
          text={t('home.solution.text')}
        />
        <div className="grid grid--4">
          {pillars.map((p, i) => {
            const Icon = p.icon
            return (
              <Link key={p.to} to={p.to} className={`pillar pillar--${p.tone}`}>
                <div className="pillar__top">
                  <span className="pillar__icon">
                    <Icon size={26} />
                  </span>
                  <span className="pillar__num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3>{t(p.title)}</h3>
                <p>{t(p.text)}</p>
                <span className="pillar__link">
                  {t('common.more')} <ArrowRight size={16} />
                </span>
              </Link>
            )
          })}
        </div>

        <div className="how">
          <h3 className="how__title">{t('home.how')}</h3>
          <ol className="steps">
            {steps.map((s, i) => {
              const Icon = stepIcons[i]
              return (
                <li key={s.title} className="step">
                  <span className="step__num">{i + 1}</span>
                  <span className="step__icon">
                    <Icon size={22} />
                  </span>
                  <strong>{t(s.title)}</strong>
                  <p>{t(s.text)}</p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Featured() {
  const { publicOpportunities: opportunities } = useData()
  const { t } = useI18n()
  const items = opportunities.filter((o) => o.featured)
  return (
    <section className="section section--white">
      <div className="container">
        <SectionHead
          eyebrow={t('home.featured.eyebrow')}
          title={
            <>
              {t('home.featured.title')} <span className="accent">{t('home.featured.accent')}</span>
            </>
          }
          action={
            <Link to="/imkoniyatlar" className="btn btn--ghost">
              {t('common.seeAll')} <ArrowRight size={18} />
            </Link>
          }
        />
        <div className="grid grid--3">
          {items.map((o) => (
            <OpportunityCard key={o.id} item={o} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Audience() {
  const { t, l } = useI18n()
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow={t('home.audience.eyebrow')}
          title={
            <>
              {t('home.audience.title')} <span className="accent">{t('home.audience.accent')}</span>
            </>
          }
        />
        <div className="audience">
          <div className="audience__group audience__group--blue">
            <div className="audience__head">
              <span className="audience__icon">
                <Globe size={22} />
              </span>
              <h3>{t('home.audience.investors')}</h3>
            </div>
            <ul className="audience__list">
              <li>
                <span className="num-badge num-badge--sm">01</span>
                <div>
                  <strong>{t('home.audience.i1.title')}</strong>
                  <p>{t('home.audience.i1.text')}</p>
                </div>
              </li>
              <li>
                <span className="num-badge num-badge--sm">02</span>
                <div>
                  <strong>{t('home.audience.i2.title')}</strong>
                  <p>{t('home.audience.i2.text')}</p>
                </div>
              </li>
              <li>
                <span className="num-badge num-badge--sm">03</span>
                <div>
                  <strong>{t('home.audience.i3.title')}</strong>
                  <p>{t('home.audience.i3.text')}</p>
                </div>
              </li>
            </ul>
            <Link to="/murojaat" className="btn btn--primary">
              {t('home.audience.startInvestor')} <ArrowRight size={18} />
            </Link>
          </div>

          <div className="audience__group audience__group--green">
            <div className="audience__head">
              <span className="audience__icon">
                <Users size={22} />
              </span>
              <h3>{t('home.audience.providers')}</h3>
            </div>
            <div className="audience__tiles">
              {categories
                .filter((c) => ['yuridik', 'konsalting', 'logistika', 'ishlab-chiqaruvchi'].includes(c.id))
                .map((c) => {
                  const Icon = c.icon
                  return (
                    <div key={c.id} className="audience__tile">
                      <Icon size={22} />
                      {l(c.name)}
                    </div>
                  )
                })}
            </div>
            <p className="audience__note">{t('home.audience.note')}</p>
            <Link to="/narxlar?tab=provayder" className="btn btn--green">
              {t('home.audience.addCompany')} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Comparison() {
  const { t } = useI18n()
  const last = comparison.columns.length - 1
  return (
    <section className="section section--white">
      <div className="container">
        <SectionHead
          eyebrow={t('home.vs.eyebrow')}
          title={
            <>
              {t('home.vs.title')} <span className="accent">{t('home.vs.accent')}</span>
            </>
          }
        />
        <div className="vs-wrap">
          <table className="vs">
            <thead>
              <tr>
                <th scope="col" className="vs__corner">
                  {t('home.vs.corner')}
                </th>
                {comparison.columns.map((c, i) => (
                  <th scope="col" key={c.name} className={i === last ? 'vs__ours' : ''}>
                    <strong>{t(c.name)}</strong>
                    <span>{t(c.hint)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{t(r.label)}</th>
                  {r.values.map((v, i) => (
                    <td key={i} className={i === last ? 'vs__ours' : ''}>
                      <SupportMark value={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Market />
      <Solution />
      <Featured />
      <Audience />
      <Comparison />
      <CtaBand />
    </>
  )
}
