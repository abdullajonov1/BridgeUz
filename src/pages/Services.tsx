import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, FileSearch, Handshake, Rocket } from 'lucide-react'
import { PageHero, CtaBand, SectionHead } from '../components/ui'
import { categories } from '../data/taxonomy'
import { useData } from '../lib/store'
import { faqs } from '../data/content'
import { useI18n } from '../i18n'
import type { DictKey } from '../i18n'

const core = [
  {
    id: 'advisory',
    icon: FileSearch,
    tone: 'blue',
    tag: 'Advisory',
    title: 'svc.advisory.title',
    text: 'svc.advisory.text',
    points: ['svc.advisory.p1', 'svc.advisory.p2', 'svc.advisory.p3', 'svc.advisory.p4'],
  },
  {
    id: 'matching',
    icon: Handshake,
    tone: 'green',
    tag: 'Matching',
    title: 'svc.matching.title',
    text: 'svc.matching.text',
    points: ['svc.matching.p1', 'svc.matching.p2', 'svc.matching.p3', 'svc.matching.p4'],
  },
  {
    id: 'entry',
    icon: Rocket,
    tone: 'violet',
    tag: 'Market entry',
    title: 'svc.entry.title',
    text: 'svc.entry.text',
    points: ['svc.entry.p1', 'svc.entry.p2', 'svc.entry.p3', 'svc.entry.p4'],
  },
] as const

function Faq() {
  const { t } = useI18n()
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="faq">
      {faqs.map((f, i) => {
        const isOpen = open === i
        return (
          <div key={f.q} className={`faq__item${isOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              className="faq__q"
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {t(f.q)}
              <ChevronDown size={20} />
            </button>
            <div id={`faq-${i}`} className="faq__a" hidden={!isOpen}>
              <p>{t(f.a)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Services() {
  const { t, l } = useI18n()
  const { publicCompanies: companies } = useData()
  return (
    <>
      <PageHero
        eyebrow={t('svc.eyebrow')}
        title={
          <>
            {t('svc.title')} <span className="accent">{t('svc.accent')}</span>
          </>
        }
        text={t('svc.text')}
      />

      <section className="section--tight">
        <div className="container">
          <div className="grid grid--3">
            {core.map((s) => {
              const Icon = s.icon
              return (
                <article key={s.id} className={`service-card service-card--${s.tone}`}>
                  <span className="service-card__icon">
                    <Icon size={26} />
                  </span>
                  <span className="service-card__tag">{s.tag}</span>
                  <h3>{t(s.title)}</h3>
                  <p>{t(s.text)}</p>
                  <ul className="check-list">
                    {s.points.map((p) => (
                      <li key={p}>
                        <Check size={16} /> {t(p as DictKey)}
                      </li>
                    ))}
                  </ul>
                  <Link to={`/murojaat?xizmat=${s.id}`} className="btn btn--soft btn--block">
                    {t('svc.ask')} <ArrowRight size={17} />
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow={t('svc.net.eyebrow')}
            title={
              <>
                {t('svc.net.title')} <span className="accent">{t('svc.net.accent')}</span>
              </>
            }
            text={t('svc.net.text')}
          />
          <div className="grid grid--4">
            {categories.map((c) => {
              const Icon = c.icon
              const n = companies.filter((x) => x.category === c.id).length
              return (
                <Link key={c.id} to={`/kompaniyalar?toifa=${c.id}`} className="cat-card">
                  <span className="cat-card__icon">
                    <Icon size={24} />
                  </span>
                  <h3>{l(c.name)}</h3>
                  <p>{l(c.description)}</p>
                  <span className="cat-card__count">
                    {t('svc.count', { n })} <ArrowRight size={15} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container faq-layout">
          <SectionHead
            eyebrow={t('svc.faq.eyebrow')}
            title={
              <>
                {t('svc.faq.title')} <span className="accent">{t('svc.faq.accent')}</span>
              </>
            }
            text={t('svc.faq.text')}
            action={
              <Link to="/murojaat" className="btn btn--ghost">
                {t('svc.faq.ask')}
              </Link>
            }
          />
          <Faq />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
