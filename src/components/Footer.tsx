import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { Logo } from './Logo'
import { useI18n } from '../i18n'

const YEAR = new Date().getFullYear()

export function Footer() {
  const { t } = useI18n()
  const columns = [
    {
      title: t('footer.platform'),
      links: [
        { to: '/hududlar', label: t('nav.regions') },
        { to: '/imkoniyatlar', label: t('footer.opportunities') },
        { to: '/kompaniyalar', label: t('footer.companies') },
        { to: '/xizmatlar', label: t('nav.services') },
      ],
    },
    {
      title: t('footer.forInvestors'),
      links: [
        { to: '/murojaat?xizmat=advisory', label: t('footer.advisory') },
        { to: '/murojaat?xizmat=matching', label: t('footer.matching') },
        { to: '/narxlar', label: t('nav.pricing') },
        { to: '/qidiruv', label: t('footer.search') },
      ],
    },
    {
      title: t('footer.forCompanies'),
      links: [
        { to: '/narxlar?tab=provayder', label: t('footer.plans') },
        { to: '/murojaat?turi=provayder', label: t('footer.addCompany') },
        { to: '/biz-haqimizda', label: t('nav.about') },
      ],
    },
  ]

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo tone="light" />
          <p>{t('footer.blurb')}</p>
          <ul className="footer__contacts">
            <li>
              <MapPin size={16} /> {t('footer.city')}
            </li>
            <li>
              <Mail size={16} /> <a href="mailto:hello@bridgeuz.uz">hello@bridgeuz.uz</a>
            </li>
            <li>
              <Phone size={16} /> <a href="tel:+998000000000">+998 (00) 000-00-00</a>
            </li>
            <li>
              <Send size={16} />{' '}
              <a href="https://t.me/" target="_blank" rel="noreferrer">
                Telegram
              </a>
            </li>
          </ul>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="footer__col">
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container footer__bottom">
        <span>{t('footer.rights', { year: YEAR })}</span>
        <span>
          {t('footer.tagline')} · <Link to="/admin">{t('footer.admin')}</Link>
        </span>
      </div>
    </footer>
  )
}
