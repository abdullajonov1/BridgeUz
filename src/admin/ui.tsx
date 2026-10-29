import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { CircleCheck, TriangleAlert, X, type LucideIcon } from 'lucide-react'
import { useI18n } from '../i18n'

/* ---------- Xabarnomalar ---------- */
interface Toast {
  id: number
  text: string
  tone: 'success' | 'danger'
}
const ToastContext = createContext<(text: string, tone?: Toast['tone']) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((text: string, tone: Toast['tone'] = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, text, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.tone}`}>
            {t.tone === 'success' ? <CircleCheck size={18} /> : <TriangleAlert size={18} />}
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
export const useToast = () => useContext(ToastContext)

/* ---------- Oynalar ---------- */
function useEscape(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])
}

interface ModalProps {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}

export function Modal({ title, subtitle, onClose, children, footer, wide }: ModalProps) {
  const { t } = useI18n()
  useEscape(onClose)
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className={`modal__panel adm-modal${wide ? ' modal__panel--wide' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <div>
            <h3>{title}</h3>
            {subtitle && <p className="muted">{subtitle}</p>}
          </div>
          <button type="button" className="icon-btn" aria-label={t('common.close')} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="adm-modal__body">{children}</div>
        {footer && <div className="adm-modal__foot">{footer}</div>}
      </div>
    </div>
  )
}

export function Drawer({ title, onClose, children, footer }: Omit<ModalProps, 'wide' | 'subtitle'>) {
  const { t } = useI18n()
  useEscape(onClose)
  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <aside className="drawer__panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer__head">
          <h3>{title}</h3>
          <button type="button" className="icon-btn" aria-label={t('common.close')} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="drawer__body">{children}</div>
        {footer && <div className="drawer__foot">{footer}</div>}
      </aside>
    </div>
  )
}

export function Confirm({
  title,
  text,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  title: string
  text: string
  confirmLabel?: string
  onConfirm: () => void
  onClose: () => void
}) {
  const { t } = useI18n()
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel ?? t('common.delete')}
          </button>
        </>
      }
    >
      <p>{text}</p>
    </Modal>
  )
}

/* ---------- Kichik elementlar ---------- */
export function Pill({ tone, children }: { tone: string; children: ReactNode }) {
  return <span className={`adm-pill adm-pill--${tone}`}>{children}</span>
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="switch switch--sm" title={label}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch__track" />
      <span className="sr-only">{label}</span>
    </label>
  )
}

export function Kpi({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'blue',
}: {
  icon: LucideIcon
  label: string
  value: ReactNode
  hint?: ReactNode
  tone?: string
}) {
  return (
    <div className={`kpi kpi--${tone}`}>
      <span className="kpi__icon">
        <Icon size={20} />
      </span>
      <span className="kpi__label">{label}</span>
      <strong className="kpi__value">{value}</strong>
      {hint && <span className="kpi__hint">{hint}</span>}
    </div>
  )
}

export function PageHead({ title, text, actions }: { title: string; text?: string; actions?: ReactNode }) {
  return (
    <div className="adm-head">
      <div>
        <h1>{title}</h1>
        {text && <p className="muted">{text}</p>}
      </div>
      {actions && <div className="adm-head__actions">{actions}</div>}
    </div>
  )
}

export function Empty({ text }: { text: string }) {
  return <div className="adm-empty muted">{text}</div>
}
