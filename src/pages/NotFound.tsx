import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useI18n } from '../i18n'

export default function NotFound() {
  const { t } = useI18n()
  return (
    <section className="not-found">
      <div className="container">
        <span className="not-found__code">404</span>
        <h1>
          {t('nf.title')} <span className="accent">{t('nf.accent')}</span>
        </h1>
        <p className="muted">{t('nf.text')}</p>
        <Link to="/" className="btn btn--primary">
          <ArrowLeft size={18} /> {t('nf.home')}
        </Link>
      </div>
    </section>
  )
}
