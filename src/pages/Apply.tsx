import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building, Check, CircleCheck, Clock, Globe, ShieldCheck } from 'lucide-react'
import { categories, sectors, type CategoryId, type SectorId } from '../data/taxonomy'
import { regions } from '../data/regions'
import { slugify, useData } from '../lib/store'
import { applyPlan, type CompanyPlan } from '../lib/plan'
import type { Company } from '../data/companies'
import { useI18n } from '../i18n'
import type { DictKey } from '../i18n'
import { Select } from '../components/Select'

type Role = 'investor' | 'provayder'

interface FormData {
  role: Role
  service: string
  needs: string[]
  sector: string
  region: string
  budget: string
  timeline: string
  message: string
  name: string
  company: string
  country: string
  email: string
  phone: string
  consent: boolean
}

export default function Apply() {
  const { t, l } = useI18n()
  const { publicOpportunities: opportunities, companyById, upsert } = useData()
  const [params] = useSearchParams()
  const presetCompanies = (params.get('kompaniyalar') ?? '').split(',').map(companyById).filter(Boolean)
  const presetOpp = opportunities.find((o) => o.id === params.get('imkoniyat'))

  const services = [
    { id: 'advisory', label: t('apply.svc.advisory') },
    { id: 'matching', label: t('apply.svc.matching') },
    { id: 'entry', label: t('apply.svc.entry') },
    { id: 'unsure', label: t('apply.svc.unsure') },
  ]
  const tariffs = [
    { id: 'free', label: t('apply.tariff.free'), price: t('apply.tariff.freePrice'), hint: t('apply.tariff.freeHint') },
    { id: 'subscription', label: t('apply.tariff.sub'), price: t('apply.tariff.subPrice'), hint: t('apply.tariff.subHint') },
    { id: 'premium', label: t('apply.tariff.prem'), price: t('apply.tariff.premPrice'), hint: t('apply.tariff.premHint') },
  ]
  const budgets: { id: string; label: string }[] = [
    { id: 'b1', label: t('apply.b1') },
    { id: 'b2', label: t('apply.b2') },
    { id: 'b3', label: t('apply.b3') },
    { id: 'b4', label: t('apply.b4') },
  ]
  const timelines: { id: string; label: string }[] = [
    { id: 't1', label: t('apply.t1') },
    { id: 't2', label: t('apply.t2') },
    { id: 't3', label: t('apply.t3') },
    { id: 't4', label: t('apply.t4') },
  ]
  const stepTitles: DictKey[] = ['apply.s1', 'apply.s2', 'apply.s3', 'apply.s4']

  const [step, setStep] = useState(0)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [data, setData] = useState<FormData>(() => ({
    role: params.get('turi') === 'provayder' ? 'provayder' : 'investor',
    service: params.get('tarif') ?? params.get('xizmat') ?? '',
    needs: [],
    sector: presetOpp?.sector ?? '',
    region: presetOpp?.region ?? '',
    budget: '',
    timeline: '',
    message: '',
    name: '',
    company: '',
    country: '',
    email: '',
    phone: '',
    consent: false,
  }))

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  const toggleNeed = (id: string) =>
    set('needs', data.needs.includes(id) ? data.needs.filter((n) => n !== id) : [...data.needs, id])

  const isProvider = data.role === 'provayder'

  const validate = () => {
    const e: Record<string, string> = {}
    if (step === 1) {
      if (!data.service) e.service = isProvider ? t('apply.err.tariff') : t('apply.err.service')
      if (isProvider && data.needs.length === 0) e.needs = t('apply.err.needs')
    }
    if (step === 3) {
      if (!data.name.trim()) e.name = t('apply.err.name')
      if (!data.company.trim()) e.company = t('apply.err.company')
      if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = t('apply.err.email')
      if (!data.consent) e.consent = t('apply.err.consent')
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => validate() && setStep((s) => Math.min(s + 1, stepTitles.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (step < stepTitles.length - 1) return next()
    if (!validate()) return
    const extras = [
      presetOpp && t('apply.presetOpp', { title: l(presetOpp.title) }),
      presetCompanies.length > 0 && t('apply.presetCo', { names: presetCompanies.map((c) => c!.name).join(', ') }),
    ]
      .filter(Boolean)
      .join(' ')
    upsert('applications', {
      id: `a-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      role: data.role,
      service: data.service,
      needs: data.needs as CategoryId[],
      sector: data.sector as SectorId | '',
      region: data.region,
      budget: data.budget,
      timeline: data.timeline,
      message: [extras, data.message.trim()].filter(Boolean).join(' '),
      name: data.name.trim(),
      company: data.company.trim(),
      country: data.country.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      status: 'new',
      assignee: '',
      companyIds: presetCompanies.map((c) => c!.id),
      notes: [],
    })
    if (isProvider) {
      const plan: CompanyPlan = data.service === 'premium' ? 'premium' : data.service === 'subscription' ? 'subscription' : 'free'
      const draft: Company = applyPlan(
        {
          id: slugify(data.company.trim()),
          name: data.company.trim(),
          category: (data.needs[0] as CategoryId) ?? 'konsalting',
          region: data.region || 'toshkent-shahri',
          founded: new Date().getFullYear(),
          employees: '10–25',
          rating: 0,
          reviews: 0,
          verified: false,
          premium: false,
          plan: 'free',
          languages: ['uz', 'ru'],
          priceFrom: 0,
          responseHours: 24,
          description: { uz: data.message.trim() || data.company.trim() },
          services: { uz: [] },
          industries: { uz: [] },
          hidden: true,
        },
        plan,
      )
      upsert('companies', draft)
    }
    setSent(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (sent) {
    return (
      <section className="apply apply--done">
        <div className="container">
          <div className="done-card">
            <span className="done-card__icon">
              <CircleCheck size={40} />
            </span>
            <h1>{t('apply.thanks', { name: data.name.split(' ')[0] })}</h1>
            <p>
              {isProvider
                ? t('apply.thanksProvider', { company: data.company })
                : t('apply.thanksText', { email: data.email })}
            </p>
            <div className="done-card__actions">
              <Link to="/kompaniyalar" className="btn btn--primary">
                {t('apply.seeCompanies')}
              </Link>
              <Link to="/" className="btn btn--ghost">
                {t('apply.home')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="apply">
      <div className="container apply__grid">
        <div className="apply__intro">
          <span className="eyebrow eyebrow--solid">{t('apply.eyebrow')}</span>
          <h1>
            {isProvider ? (
              <>
                {t('apply.titleProvider')} <span className="accent">{t('apply.accentProvider')}</span>
              </>
            ) : (
              <>
                {t('apply.titleInvestor')} <span className="accent">{t('apply.accentInvestor')}</span>
              </>
            )}
          </h1>
          <p className="apply__lead">{isProvider ? t('apply.leadProvider') : t('apply.leadInvestor')}</p>
          <ul className="apply__perks">
            <li>
              <Clock size={20} /> {t('apply.perk1')}
            </li>
            <li>
              <ShieldCheck size={20} /> {t('apply.perk2')}
            </li>
            <li>
              <Check size={20} /> {t('apply.perk3')}
            </li>
          </ul>
        </div>

        <form className="wizard" onSubmit={submit} noValidate>
          <ol className="wizard__steps" aria-label={t('apply.steps')}>
            {stepTitles.map((key, i) => (
              <li key={key} className={i === step ? 'is-current' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
                <span>{i < step ? <Check size={14} /> : i + 1}</span>
                {t(key)}
              </li>
            ))}
          </ol>

          {step === 0 && (
            <fieldset className="wizard__body">
              <legend>{t('apply.who')}</legend>
              <div className="choice-grid choice-grid--2">
                <button
                  type="button"
                  className={`choice choice--big${data.role === 'investor' ? ' is-active' : ''}`}
                  onClick={() => set('role', 'investor')}
                  aria-pressed={data.role === 'investor'}
                >
                  <Globe size={26} />
                  <strong>{t('apply.investor')}</strong>
                  <span>{t('apply.investorHint')}</span>
                </button>
                <button
                  type="button"
                  className={`choice choice--big${data.role === 'provayder' ? ' is-active' : ''}`}
                  onClick={() => {
                    set('role', 'provayder')
                    set('service', '')
                  }}
                  aria-pressed={data.role === 'provayder'}
                >
                  <Building size={26} />
                  <strong>{t('apply.provider')}</strong>
                  <span>{t('apply.providerHint')}</span>
                </button>
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="wizard__body">
              <legend>{isProvider ? t('apply.tariffTitle') : t('apply.needTitle')}</legend>
              <div className={`choice-grid ${isProvider ? 'choice-grid--3' : 'choice-grid--2'}`}>
                {isProvider
                  ? tariffs.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`choice choice--plan${data.service === s.id ? ' is-active' : ''}`}
                        aria-pressed={data.service === s.id}
                        onClick={() => set('service', s.id)}
                      >
                        <strong>{s.label}</strong>
                        <em>{s.price}</em>
                        <span>{s.hint}</span>
                      </button>
                    ))
                  : services.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`choice${data.service === s.id ? ' is-active' : ''}`}
                        aria-pressed={data.service === s.id}
                        onClick={() => set('service', s.id)}
                      >
                        {s.label}
                      </button>
                    ))}
              </div>
              {isProvider && <p className="muted wizard__note">{t('apply.demoPay')}</p>}
              {errors.service && <p className="field-error">{errors.service}</p>}

              <span className="wizard__label">
                {isProvider ? t('apply.catProvider') : t('apply.catInvestor')}
                {!isProvider && <span className="muted"> {t('common.optional')}</span>}
              </span>
              <div className="choice-grid choice-grid--4">
                {categories.map((c) => {
                  const Icon = c.icon
                  const on = data.needs.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`choice choice--icon${on ? ' is-active' : ''}`}
                      aria-pressed={on}
                      onClick={() => toggleNeed(c.id)}
                    >
                      <Icon size={20} />
                      {l(c.short)}
                    </button>
                  )
                })}
              </div>
              {errors.needs && <p className="field-error">{errors.needs}</p>}
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="wizard__body">
              <legend>{isProvider ? t('apply.aboutCompany') : t('apply.aboutProject')}</legend>
              <div className="form-grid">
                <label className="field">
                  <span>{t('apply.sector')}</span>
                  <Select
                    value={data.sector}
                    onChange={(v) => set('sector', v)}
                    placeholder={t('common.select')}
                    options={[
                      { value: '', label: t('common.select') },
                      ...sectors.map((s) => ({ value: s.id, label: l(s.name) })),
                    ]}
                  />
                </label>
                <label className="field">
                  <span>{isProvider ? t('apply.location') : t('apply.interestRegion')}</span>
                  <Select
                    value={data.region}
                    onChange={(v) => set('region', v)}
                    placeholder={isProvider ? t('common.select') : t('common.notSet')}
                    options={[
                      { value: '', label: isProvider ? t('common.select') : t('common.notSet') },
                      ...regions.map((r) => ({ value: r.slug, label: l(r.name) })),
                    ]}
                  />
                </label>
              </div>
              {!isProvider && (
                <>
                  <span className="wizard__label">{t('apply.budget')}</span>
                  <div className="choice-grid choice-grid--4">
                    {budgets.map((b) => (
                      <button key={b.id} type="button" className={`choice${data.budget === b.id ? ' is-active' : ''}`} aria-pressed={data.budget === b.id} onClick={() => set('budget', b.id)}>
                        {b.label}
                      </button>
                    ))}
                  </div>
                  <span className="wizard__label">{t('apply.when')}</span>
                  <div className="choice-grid choice-grid--4">
                    {timelines.map((item) => (
                      <button key={item.id} type="button" className={`choice${data.timeline === item.id ? ' is-active' : ''}`} aria-pressed={data.timeline === item.id} onClick={() => set('timeline', item.id)}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <label className="field">
                <span>{isProvider ? t('apply.msgProvider') : t('apply.msgInvestor')}</span>
                <textarea
                  rows={4}
                  value={data.message}
                  onChange={(e) => set('message', e.target.value)}
                  placeholder={isProvider ? t('apply.phProvider') : t('apply.phInvestor')}
                />
              </label>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="wizard__body">
              <legend>{t('apply.contact')}</legend>
              <div className="form-grid">
                <label className={`field${errors.name ? ' has-error' : ''}`}>
                  <span>{t('apply.name')}</span>
                  <input value={data.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
                  {errors.name && <small className="field-error">{errors.name}</small>}
                </label>
                <label className={`field${errors.company ? ' has-error' : ''}`}>
                  <span>{t('apply.company')}</span>
                  <input value={data.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" />
                  {errors.company && <small className="field-error">{errors.company}</small>}
                </label>
                <label className={`field${errors.email ? ' has-error' : ''}`}>
                  <span>{t('apply.email')}</span>
                  <input type="email" value={data.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />
                  {errors.email && <small className="field-error">{errors.email}</small>}
                </label>
                <label className="field">
                  <span>{t('apply.phone')}</span>
                  <input type="tel" value={data.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" placeholder="+998 …" />
                </label>
                {!isProvider && (
                  <label className="field">
                    <span>{t('apply.country')}</span>
                    <input value={data.country} onChange={(e) => set('country', e.target.value)} autoComplete="country-name" />
                  </label>
                )}
              </div>
              <label className={`checkbox${errors.consent ? ' has-error' : ''}`}>
                <input type="checkbox" checked={data.consent} onChange={(e) => set('consent', e.target.checked)} />
                <span>{t('apply.consent')}</span>
              </label>
              {errors.consent && <p className="field-error">{errors.consent}</p>}
            </fieldset>
          )}

          <div className="wizard__nav">
            {step > 0 ? (
              <button type="button" className="btn btn--ghost" onClick={back}>
                <ArrowLeft size={18} /> {t('common.back')}
              </button>
            ) : (
              <span />
            )}
            <button type="submit" className="btn btn--primary">
              {step === stepTitles.length - 1 ? t('apply.send') : t('common.continue')}
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
