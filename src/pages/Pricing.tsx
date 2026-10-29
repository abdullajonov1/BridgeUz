import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Award, Check, FileSearch, Handshake, Users } from 'lucide-react'
import { PageHero, CtaBand } from '../components/ui'
import { investorPlans, providerPlans, type Plan } from '../data/content'
import { useQueryState } from '../lib/useQueryState'
import { useI18n } from '../i18n'
import type { DictKey } from '../i18n'

const planIcons: Record<string, typeof Award> = {
  advisory: FileSearch,
  matching: Handshake,
  premium: Award,
  subscription: Users,
}

function PlanCard({ plan, cta, ctaKey }: { plan: Plan; cta: string; ctaKey: DictKey }) {
  const { t } = useI18n()
  const Icon = planIcons[plan.id]
  return (
    <article className={`plan plan--${plan.tone}${plan.popular ? ' plan--popular' : ''}`}>
      {plan.popular && <span className="plan__ribbon">{t('common.popular')}</span>}
      <div className="plan__head">
        <span className="plan__icon">
          <Icon size={26} />
        </span>
        <div>
          <h3>{plan.name}</h3>
          <p>{t(plan.subtitle)}</p>
        </div>
      </div>
      <div className="plan__price">
        <strong>{plan.price}</strong>
        <span>{t(plan.unit)}</span>
      </div>
      <ul className="check-list">
        {plan.features.map((f) => (
          <li key={f}>
            <Check size={16} /> {t(f)}
          </li>
        ))}
      </ul>
      <p className="plan__payer">{t(plan.payer)}</p>
      <Link to={cta} className="btn btn--primary btn--block">
        {t(ctaKey)}
      </Link>
    </article>
  )
}

export default function Pricing() {
  const { t } = useI18n()
  const [tab, setTab] = useQueryState('tab', 'investor')
  const isInvestor = tab !== 'provayder'

  useEffect(() => {
    if (tab !== 'provayder') return
    document.getElementById('mahalliy')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [tab])

  const invFree = ['price.inv.f1', 'price.inv.f2', 'price.inv.f3', 'price.inv.f4'] as const
  const prvFree = ['price.prv.f1', 'price.prv.f2', 'price.prv.f3', 'price.prv.f4'] as const

  return (
    <>
      <PageHero
        eyebrow={t('price.eyebrow')}
        title={
          <>
            {t('price.title')} <span className="accent">{t('price.accent')}</span> {t('price.title2')}
          </>
        }
        text={t('price.text')}
      >
        <div className="segmented" role="tablist" aria-label={t('price.tabs')}>
          <button
            type="button"
            role="tab"
            aria-selected={isInvestor}
            className={isInvestor ? 'is-active' : ''}
            onClick={() => {
              setTab('investor')
              document.getElementById('investorlar')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            {t('price.forInvestors')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isInvestor}
            className={!isInvestor ? 'is-active' : ''}
            onClick={() => {
              setTab('provayder')
              document.getElementById('mahalliy')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            {t('price.forProviders')}
          </button>
        </div>
      </PageHero>

      <section id="investorlar" className="section--tight">
        <div className="container">
          <div className="plans-block">
            <h2>{t('price.forInvestors')}</h2>
            <p className="muted">{t('price.invLead')}</p>
          </div>
          <div className="plans">
            <article className="plan plan--free">
              <div className="plan__head">
                <div>
                  <h3>{t('common.free')}</h3>
                  <p>{t('price.freeExplore')}</p>
                </div>
              </div>
              <div className="plan__price">
                <strong>$0</strong>
                <span>{t('price.forever')}</span>
              </div>
              <ul className="check-list">
                {invFree.map((f) => (
                  <li key={f}>
                    <Check size={16} /> {t(f)}
                  </li>
                ))}
              </ul>
              <Link to="/kompaniyalar" className="btn btn--ghost btn--block">
                {t('price.viewCatalog')}
              </Link>
            </article>
            {investorPlans.map((p) => (
              <PlanCard key={p.id} plan={p} cta={`/murojaat?xizmat=${p.id}`} ctaKey="price.start" />
            ))}
          </div>
        </div>
      </section>

      <section id="mahalliy" className="section--tight">
        <div className="container">
          <div className="plans-block">
            <h2>{t('price.forProviders')}</h2>
            <p className="muted">{t('price.providerLead')}</p>
            <p className="price-note">{t('price.payNote')}</p>
          </div>
          <div className="plans">
            <article className="plan plan--free">
              <div className="plan__head">
                <div>
                  <h3>{t('common.free')}</h3>
                  <p>{t('price.freeProfile')}</p>
                </div>
              </div>
              <div className="plan__price">
                <strong>$0</strong>
                <span>{t('price.forever')}</span>
              </div>
              <ul className="check-list">
                {prvFree.map((f) => (
                  <li key={f}>
                    <Check size={16} /> {t(f)}
                  </li>
                ))}
              </ul>
              <Link to="/murojaat?turi=provayder&tarif=free" className="btn btn--ghost btn--block">
                {t('price.createProfile')}
              </Link>
            </article>
            {providerPlans.map((p) => (
              <PlanCard
                key={p.id}
                plan={p}
                cta={`/murojaat?turi=provayder&tarif=${p.id}`}
                ctaKey={p.id === 'premium' ? 'price.premiumAsk' : 'price.subscribe'}
              />
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={t('price.cta.title')} text={t('price.cta.text')} />
    </>
  )
}
