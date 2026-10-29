import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck, CircleMinus, CircleX } from 'lucide-react'
import type { Support } from '../data/content'
import { Skyline } from './Skyline'
import { useI18n } from '../i18n'

interface SectionHeadProps {
  eyebrow?: string
  title: ReactNode
  text?: ReactNode
  align?: 'left' | 'center'
  action?: ReactNode
}

export function SectionHead({ eyebrow, title, text, align = 'left', action }: SectionHeadProps) {
  return (
    <div className={`section-head section-head--${align}`}>
      <div className="section-head__main">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {text && <p className="section-head__text">{text}</p>}
      </div>
      {action && <div className="section-head__action">{action}</div>}
    </div>
  )
}

interface PageHeroProps {
  eyebrow: string
  title: ReactNode
  text?: ReactNode
  children?: ReactNode
}

export function PageHero({ eyebrow, title, text, children }: PageHeroProps) {
  return (
    <section className="page-hero">
      <Skyline className="page-hero__skyline" />
      <div className="container page-hero__inner">
        <span className="eyebrow eyebrow--solid">{eyebrow}</span>
        <h1>{title}</h1>
        {text && <p className="page-hero__text">{text}</p>}
        {children}
      </div>
    </section>
  )
}

export function CtaBand({ title, text }: { title?: string; text?: string }) {
  const { t } = useI18n()
  return (
    <section className="section--tight">
      <div className="container">
        <div className="cta-band">
          <div className="cta-band__pattern" aria-hidden="true" />
          <div className="cta-band__content">
            <h2>{title ?? t('cta.title')}</h2>
            <p>{text ?? t('cta.text')}</p>
          </div>
          <div className="cta-band__actions">
            <Link to="/murojaat" className="btn btn--white btn--lg">
              {t('cta.apply')} <ArrowRight size={18} />
            </Link>
            <Link to="/narxlar?tab=provayder" className="btn btn--outline-light btn--lg">
              {t('cta.addCompany')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function SupportMark({ value }: { value: Support }) {
  const { t } = useI18n()
  const meta = {
    full: { label: t('support.full'), icon: CircleCheck },
    partial: { label: t('support.partial'), icon: CircleMinus },
    none: { label: t('support.none'), icon: CircleX },
  }[value]
  const Icon = meta.icon
  return (
    <span className={`status status--${value}`}>
      <Icon size={20} strokeWidth={2.2} />
      {meta.label}
    </span>
  )
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p className="muted">{text}</p>
      {action}
    </div>
  )
}
