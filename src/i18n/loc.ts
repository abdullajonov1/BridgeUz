import type { Lang, Loc, LocList } from './types'

export function isLoc(v: unknown): v is Loc {
  return Boolean(v) && typeof v === 'object' && typeof (v as Loc).uz === 'string'
}

export function isLocList(v: unknown): v is LocList {
  return Boolean(v) && typeof v === 'object' && Array.isArray((v as LocList).uz)
}

/** Qidiruv uchun barcha tillardagi matn */
export function locFlat(v: Loc | LocList | string | string[] | undefined): string {
  if (!v) return ''
  if (typeof v === 'string') return v
  if (Array.isArray(v)) return v.join(' ')
  if (isLocList(v)) return [...v.uz, ...(v.en ?? []), ...(v.ru ?? [])].join(' ')
  if (isLoc(v)) return [v.uz, v.en, v.ru].filter(Boolean).join(' ')
  return ''
}

export function locInput(v: Loc | string | undefined, lang: Lang, fallback = true): string {
  if (!v) return ''
  if (typeof v === 'string') return lang === 'en' || lang === 'ru' ? (fallback ? v : '') : v
  if (lang === 'en') return v.en ?? (fallback ? v.uz : '')
  if (lang === 'ru') return v.ru ?? (fallback ? v.uz : '')
  return v.uz
}

export function locListInput(v: LocList | string[] | undefined, lang: Lang, sep = '\n', fallback = true): string {
  if (!v) return ''
  if (Array.isArray(v)) return lang === 'en' || lang === 'ru' ? (fallback ? v.join(sep) : '') : v.join(sep)
  const own = lang === 'en' ? v.en : lang === 'ru' ? v.ru : v.uz
  const list = own?.length ? own : fallback ? v.uz : []
  return list.join(sep)
}

export function writeLoc(prev: Loc | string | undefined, value: string, lang: Lang): Loc {
  const base: Loc = typeof prev === 'string' ? { uz: prev } : prev ? { ...prev } : { uz: value }
  if (lang === 'en') return { ...base, en: value }
  if (lang === 'ru') return { ...base, ru: value }
  return { ...base, uz: value }
}

export function writeLocList(prev: LocList | string[] | undefined, lines: string[], lang: Lang): LocList {
  const base: LocList = Array.isArray(prev) ? { uz: prev } : prev ? { ...prev } : { uz: lines }
  if (lang === 'en') return { ...base, en: lines }
  if (lang === 'ru') return { ...base, ru: lines }
  return { ...base, uz: lines }
}

export function parseLines(s: string, sep: RegExp | string = /\n/) {
  return s
    .split(sep)
    .map((x) => x.trim())
    .filter(Boolean)
}
