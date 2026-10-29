import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { CompareTray } from './Compare'
import { useI18n } from '../i18n'

export function Layout() {
  const { pathname } = useLocation()
  const { t } = useI18n()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <>
      <a className="skip-link" href="#main">
        {t('skip')}
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <CompareTray />
    </>
  )
}
