import { useI18n } from '../i18n'
import type { Lang, Loc, LocList } from '../i18n/types'
import { isLoc, isLocList } from '../i18n/loc'

export type LocCode = 'uz' | 'en' | 'ru'

export function locCode(lang: Lang): LocCode {
  return lang === 'en' || lang === 'ru' ? lang : 'uz'
}

export function toLoc(v: Loc | string | undefined): Loc {
  if (!v) return { uz: '' }
  return typeof v === 'string' ? { uz: v } : v
}

export function toLocList(v: LocList | string[] | undefined): LocList {
  if (!v) return { uz: [] }
  return Array.isArray(v) ? { uz: v } : v
}

export function locFilled(v: Loc | LocList | string | string[] | undefined, code: LocCode) {
  if (!v) return false
  if (typeof v === 'string') return code === 'uz' && v.trim().length > 0
  if (Array.isArray(v)) return code === 'uz' && v.some(Boolean)
  if (isLocList(v)) return (v[code] ?? []).some((x) => x.trim())
  if (isLoc(v)) return Boolean(v[code]?.trim())
  return false
}

export function LocLangBar({
  value,
  onChange,
  filled,
}: {
  value: LocCode
  onChange: (code: LocCode) => void
  filled?: Partial<Record<LocCode, boolean>>
}) {
  const { t } = useI18n()
  const tabs: { code: LocCode; key: 'admin.loc.uz' | 'admin.loc.en' | 'admin.loc.ru' }[] = [
    { code: 'uz', key: 'admin.loc.uz' },
    { code: 'en', key: 'admin.loc.en' },
    { code: 'ru', key: 'admin.loc.ru' },
  ]
  return (
    <div className="locbar field--full">
      <div className="locbar__tabs" role="tablist" aria-label={t('admin.loc.label')}>
        {tabs.map((tab) => (
          <button
            key={tab.code}
            type="button"
            role="tab"
            aria-selected={value === tab.code}
            className={`locbar__tab${value === tab.code ? ' is-active' : ''}${filled?.[tab.code] ? ' has-text' : ''}`}
            onClick={() => onChange(tab.code)}
          >
            {t(tab.key)}
            {filled?.[tab.code] ? <span className="locbar__dot" aria-hidden="true" /> : null}
          </button>
        ))}
      </div>
      <p className="locbar__hint muted">{t('admin.loc.hint')}</p>
    </div>
  )
}
