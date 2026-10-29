import type { DictKey } from '../i18n/dict/uz'

type T = (key: DictKey, vars?: Record<string, string | number>) => string

export const fmtDate = (iso: string, t: T) => {
  const d = new Date(iso)
  return `${d.getDate()}-${t(`month.${d.getMonth()}` as DictKey)}, ${d.getFullYear()}`
}
export const fmtDateTime = (iso: string, t: T) => {
  const d = new Date(iso)
  return `${d.getDate()}-${t(`month.${d.getMonth()}` as DictKey)}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
export const fmtDay = (d: Date, t: T) => `${d.getDate()}-${t(`month.${d.getMonth()}` as DictKey)}`
export const fmtMoney = (usd: number) => `$${usd.toLocaleString('en-US')}`
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
