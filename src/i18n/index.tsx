import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { uz, type DictKey } from './dict/uz'
import { en } from './dict/en'
import { ru } from './dict/ru'
import { toCyrillic } from './translit'
import { languages, type Lang, type Loc, type LocList } from './types'

export type { DictKey }
export type Vars = Record<string, string | number>

const STORAGE_KEY = 'bridgeuz-lang'
const dicts: Record<'uz' | 'en' | 'ru', Record<DictKey, string>> = { uz, en, ru }

/** Ko'plik shakli: "a|b" (en), "a|b|c" (ru: 1, 2–4, 5+) */
function plural(forms: string[], n: number, lang: Lang) {
  if (forms.length === 1) return forms[0]
  if (lang === 'ru' && forms.length >= 3) {
    const m10 = n % 10
    const m100 = n % 100
    if (m10 === 1 && m100 !== 11) return forms[0]
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms[1]
    return forms[2]
  }
  return n === 1 ? forms[0] : forms[1]
}

function format(str: string, vars: Vars | undefined, lang: Lang) {
  let s = str
  if (s.includes('|')) s = plural(s.split('|'), Number(vars?.n ?? 0), lang)
  if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`))
  return s
}

function readLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v && languages.some((l) => l.code === v)) return v as Lang
  } catch {
    // xotira yopiq — standart til
  }
  return 'uz'
}

interface I18n {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Interfeys matni */
  t: (key: DictKey, vars?: Vars) => string
  /** Ma'lumotlardagi ko'p tilli matn */
  l: (value: Loc | string | undefined) => string
  ll: (value: LocList | string[] | undefined) => string[]
  /** O'zbekcha manba matnni joriy tilga moslaydi (kirill uchun transliteratsiya) */
  cyr: (uzText: string) => string
}

const I18nContext = createContext<I18n | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // e'tiborsiz qoldiramiz
    }
  }, [])

  const value = useMemo<I18n>(() => {
    const cyr = (s: string) => (lang === 'uzc' ? toCyrillic(s) : s)
    const pick = <T,>(v: { uz: T; en?: T; ru?: T }): T =>
      lang === 'en' ? (v.en ?? v.uz) : lang === 'ru' ? (v.ru ?? v.uz) : v.uz
    return {
      lang,
      setLang,
      cyr,
      t: (key, vars) => {
        const raw = lang === 'en' || lang === 'ru' ? (dicts[lang][key] ?? uz[key]) : uz[key]
        const formatted = format(raw, vars, lang)
        return lang === 'uzc' ? toCyrillic(formatted) : formatted
      },
      l: (v) => {
        if (v === undefined) return ''
        if (typeof v === 'string') return cyr(v)
        return lang === 'uzc' ? cyr(pick(v)) : pick(v)
      },
      ll: (v) => {
        if (!v) return []
        if (Array.isArray(v)) return lang === 'uzc' ? v.map(toCyrillic) : v
        const list = lang === 'en' ? (v.en?.length ? v.en : v.uz) : lang === 'ru' ? (v.ru?.length ? v.ru : v.uz) : v.uz
        return lang === 'uzc' ? list.map(toCyrillic) : list
      },
    }
  }, [lang, setLang])

  useEffect(() => {
    document.documentElement.lang = languages.find((l) => l.code === lang)!.html
    document.title = value.t('meta.title')
  }, [lang, value])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n LangProvider ichida ishlatilishi kerak')
  return ctx
}
