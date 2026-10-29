import { Link } from 'react-router-dom'
import mark from '../assets/brand/logo-mark.png'
import { useI18n } from '../i18n'

interface LogoProps {
  tone?: 'dark' | 'light'
  tagline?: boolean
}

export function Logo({ tone = 'dark', tagline = true }: LogoProps) {
  const { t } = useI18n()
  return (
    <Link to="/" className={`logo logo--${tone}`} aria-label={t('logo.home')}>
      <span className="logo__mark">
        <img src={mark} alt="" width={44} height={31} />
      </span>
      <span className="logo__text">
        <span className="logo__word">
          Bridge<span className="logo__uz">Uz</span>
        </span>
        {tagline && <span className="logo__tag">Global Companies. Local Partners.</span>}
      </span>
    </Link>
  )
}
