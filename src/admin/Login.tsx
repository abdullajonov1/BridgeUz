import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, LogIn } from 'lucide-react'
import mark from '../assets/brand/logo-mark.png'
import { DEMO_EMAIL, DEMO_PASSWORD, getSession, login } from '../lib/auth'
import { LanguageMenu } from '../components/LanguageMenu'
import { useI18n } from '../i18n'

export default function Login() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const from = (location.state as { from?: string } | null)?.from ?? '/admin'

  if (getSession()) return <Navigate to="/admin" replace />

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (login(email, password)) navigate(from, { replace: true })
    else setError(t('admin.login.error'))
  }

  return (
    <div className="adm-login">
      <div className="adm-login__lang">
        <LanguageMenu />
      </div>
      <form className="adm-login__card" onSubmit={submit} noValidate>
        <div className="adm-login__brand">
          <img src={mark} alt="" width={52} height={36} />
          <div>
            <strong>
              Bridge<span className="accent">Uz</span>
            </strong>
            <span>{t('admin.login.panel')}</span>
          </div>
        </div>
        <h1>{t('admin.login.title')}</h1>
        <label className={`field${error ? ' has-error' : ''}`}>
          <span>{t('admin.login.email')}</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" autoFocus />
        </label>
        <label className={`field${error ? ' has-error' : ''}`}>
          <span>{t('admin.login.password')}</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>
        {error && <p className="field-error">{error}</p>}
        <button type="submit" className="btn btn--primary btn--lg btn--block">
          <LogIn size={18} /> {t('admin.login.submit')}
        </button>
        <div className="adm-login__demo">
          <Lock size={16} />
          <div>
            <strong>{t('admin.login.demo')}</strong>
            <span>
              {DEMO_EMAIL} · {DEMO_PASSWORD}
            </span>
          </div>
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setEmail(DEMO_EMAIL)
              setPassword(DEMO_PASSWORD)
              setError('')
            }}
          >
            {t('admin.login.fill')}
          </button>
        </div>
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> {t('admin.login.back')}
        </Link>
      </form>
    </div>
  )
}
