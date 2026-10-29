import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { LanguageMenu } from './LanguageMenu'
import { useI18n } from '../i18n'

export function Header() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const setOpen = (fn: (v: boolean) => boolean) => setOpenOn(fn(open) ? pathname : null)
  const [scrolled, setScrolled] = useState(false)

  const navItems = [
    { to: '/hududlar', label: t('nav.regions') },
    { to: '/imkoniyatlar', label: t('nav.opportunities') },
    { to: '/kompaniyalar', label: t('nav.companies') },
    { to: '/xizmatlar', label: t('nav.services') },
    { to: '/narxlar', label: t('nav.pricing') },
    { to: '/biz-haqimizda', label: t('nav.about') },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <header className={`header${scrolled || open ? ' header--scrolled' : ''}`}>
        <div className="container header__inner">
          <Logo />
          <nav className="nav" aria-label={t('nav.main')}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="nav__link">
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="header__actions">
            <LanguageMenu />
            <Link to="/murojaat" className="btn btn--primary btn--sm header__cta">
              {t('nav.contact')}
            </Link>
            <button
              type="button"
              className="burger"
              aria-label={open ? t('nav.menuClose') : t('nav.menu')}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>
      {open && (
        <div className="mobile-nav">
          <nav className="container" aria-label={t('nav.mobile')}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="mobile-nav__link">
                {item.label}
              </NavLink>
            ))}
            <Link to="/murojaat" className="btn btn--primary btn--lg mobile-nav__cta">
              {t('nav.contact')}
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
