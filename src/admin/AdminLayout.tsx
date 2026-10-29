import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Building,
  ChartColumn,
  ExternalLink,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  RotateCcw,
  Wallet,
  X,
} from 'lucide-react'
import mark from '../assets/brand/logo-mark.png'
import { getSession, logout } from '../lib/auth'
import { useData } from '../lib/store'
import { Confirm, ToastProvider, useToast } from './ui'
import { initials } from './format'
import { LanguageMenu } from '../components/LanguageMenu'
import { useI18n } from '../i18n'
import type { DictKey } from '../i18n'

function Shell() {
  const { t } = useI18n()
  const { applications, reset } = useData()
  const toast = useToast()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const user = getSession()!
  const [menuOn, setMenuOn] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const menuOpen = menuOn === pathname
  const newCount = applications.filter((a) => a.status === 'new').length

  const nav = [
    { to: '/admin', label: t('admin.nav.dash'), icon: LayoutDashboard, end: true, badge: false },
    { to: '/admin/murojaatlar', label: t('admin.nav.apps'), icon: Inbox, end: false, badge: true },
    { to: '/admin/kompaniyalar', label: t('admin.nav.companies'), icon: Building, end: false, badge: false },
    { to: '/admin/loyihalar', label: t('admin.nav.opps'), icon: FolderKanban, end: false, badge: false },
    { to: '/admin/hududlar', label: t('admin.nav.regions'), icon: MapPinned, end: false, badge: false },
    { to: '/admin/moliya', label: t('admin.nav.finance'), icon: Wallet, end: false, badge: false },
  ]

  const titles: Record<string, DictKey> = {
    '/admin': 'admin.title.dash',
    '/admin/murojaatlar': 'admin.title.apps',
    '/admin/kompaniyalar': 'admin.title.companies',
    '/admin/loyihalar': 'admin.title.opps',
    '/admin/hududlar': 'admin.title.regions',
    '/admin/moliya': 'admin.title.finance',
  }
  const pageTitle = titles[pathname] ? t(titles[pathname]) : 'Admin'

  useEffect(() => {
    document.title = t('admin.docTitle', { page: pageTitle })
    return () => {
      document.title = t('meta.title')
    }
  }, [pageTitle, t])

  const signOut = () => {
    logout()
    navigate('/admin/kirish', { replace: true })
  }

  return (
    <div className="adm">
      <aside className={`adm-side${menuOpen ? ' is-open' : ''}`}>
        <div className="adm-side__brand">
          <img src={mark} alt="" width={36} height={25} />
          <span>
            Bridge<b>Uz</b>
          </span>
          <span className="adm-side__tag">Admin</span>
        </div>
        <nav className="adm-nav" aria-label={t('admin.nav.menu')}>
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className="adm-nav__link">
                <Icon size={19} />
                {item.label}
                {item.badge && newCount > 0 && <span className="adm-nav__badge">{newCount}</span>}
              </NavLink>
            )
          })}
        </nav>
        <div className="adm-side__foot">
          <Link to="/" className="adm-nav__link" target="_blank">
            <ExternalLink size={18} /> {t('admin.openSite')}
          </Link>
          <button type="button" className="adm-nav__link" onClick={() => setConfirmReset(true)}>
            <RotateCcw size={18} /> {t('admin.reset')}
          </button>
          <button type="button" className="adm-nav__link" onClick={signOut}>
            <LogOut size={18} /> {t('admin.logout')}
          </button>
        </div>
      </aside>
      {menuOpen && <div className="adm-scrim" onClick={() => setMenuOn(null)} />}

      <div className="adm-main">
        <header className="adm-top">
          <button
            type="button"
            className="burger adm-top__burger"
            aria-label={menuOpen ? t('nav.menuClose') : t('nav.menu')}
            onClick={() => setMenuOn(menuOpen ? null : pathname)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="adm-top__title">
            <ChartColumn size={18} /> {pageTitle}
          </span>
          <div className="adm-top__tools">
            <LanguageMenu />
            <div className="adm-user">
              <span className="adm-user__avatar">{initials(user.name)}</span>
              <span className="adm-user__text">
                <strong>{user.name}</strong>
                <small>{user.role}</small>
              </span>
            </div>
          </div>
        </header>
        <div className="adm-content">
          <Outlet />
        </div>
      </div>

      {confirmReset && (
        <Confirm
          title={t('admin.resetTitle')}
          text={t('admin.resetText')}
          confirmLabel={t('admin.resetOk')}
          onConfirm={() => {
            reset()
            toast(t('admin.resetDone'))
          }}
          onClose={() => setConfirmReset(false)}
        />
      )}
    </div>
  )
}

export function AdminLayout() {
  const { pathname } = useLocation()
  if (!getSession()) return <Navigate to="/admin/kirish" replace state={{ from: pathname }} />
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  )
}
