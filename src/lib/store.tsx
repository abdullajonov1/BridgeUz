import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { companies as companiesSeed, type Company } from '../data/companies'
import { opportunities as opportunitiesSeed, type Opportunity } from '../data/opportunities'
import { regions as regionsSeed, type Region } from '../data/regions'
import { applicationsSeed, type Application } from '../data/applications'
import { paymentsSeed, type Payment } from '../data/payments'
import { applyPlan, companyPlan, isCompanyPublic } from './plan'

/**
 * Sayt va admin panel uchun umumiy ma'lumotlar ombori.
 * Hozircha brauzer xotirasida (localStorage) saqlanadi — backend ulanganda
 * har bir amal API chaqiruviga almashtiriladi.
 */
export interface Collections {
  companies: Company
  opportunities: Opportunity
  regions: Region
  applications: Application
  payments: Payment
}
export type CollectionKey = keyof Collections
type State = { [K in CollectionKey]: Collections[K][] }

const STORAGE_KEY = 'bridgeuz-demo-data-v5'

const seed = (): State => ({
  companies: companiesSeed,
  opportunities: opportunitiesSeed,
  regions: regionsSeed,
  applications: applicationsSeed,
  payments: paymentsSeed,
})

function normalizeCompany(c: Company): Company {
  return applyPlan(c, companyPlan(c), c.planUntil)
}

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<State>
      const merged = { ...seed(), ...parsed }
      return { ...merged, companies: merged.companies.map(normalizeCompany) }
    }
  } catch {
    // xotira mavjud emas yoki buzilgan — demo ma'lumotlar bilan boshlaymiz
  }
  return seed()
}

const keyOf = (item: object) => ('id' in item ? (item.id as string) : (item as Region).slug)

interface Store extends State {
  upsert: <K extends CollectionKey>(key: K, item: Collections[K]) => void
  patch: <K extends CollectionKey>(key: K, id: string, change: Partial<Collections[K]>) => void
  remove: (key: CollectionKey, id: string) => void
  reset: () => void
  /** Saytda ko‘rinadigan kompaniyalar va ochiq loyihalar */
  publicCompanies: Company[]
  publicOpportunities: Opportunity[]
  companyById: (id: string) => Company | undefined
  regionBySlug: (slug: string) => Region | undefined
}

const StoreContext = createContext<Store | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // saqlab bo‘lmadi — sessiya davomida xotirada ishlayveradi
    }
  }, [state])

  const upsert = useCallback(<K extends CollectionKey>(key: K, item: Collections[K]) => {
    setState((s) => {
      const list = s[key] as Collections[K][]
      const id = keyOf(item)
      const exists = list.some((x) => keyOf(x) === id)
      return { ...s, [key]: exists ? list.map((x) => (keyOf(x) === id ? item : x)) : [item, ...list] }
    })
  }, [])

  const patch = useCallback(<K extends CollectionKey>(key: K, id: string, change: Partial<Collections[K]>) => {
    setState((s) => ({
      ...s,
      [key]: (s[key] as Collections[K][]).map((x) => (keyOf(x) === id ? { ...x, ...change } : x)),
    }))
  }, [])

  const remove = useCallback((key: CollectionKey, id: string) => {
    setState((s) => ({ ...s, [key]: (s[key] as object[]).filter((x) => keyOf(x) !== id) }))
  }, [])

  const reset = useCallback(() => setState(seed()), [])

  const value = useMemo<Store>(
    () => ({
      ...state,
      upsert,
      patch,
      remove,
      reset,
      publicCompanies: state.companies.filter(isCompanyPublic),
      publicOpportunities: state.opportunities.filter((o) => !o.closed),
      companyById: (id) => state.companies.find((c) => c.id === id),
      regionBySlug: (slug) => state.regions.find((r) => r.slug === slug),
    }),
    [state, upsert, patch, remove, reset],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useData() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useData DataProvider ichida ishlatilishi kerak')
  return ctx
}

/** Lotin harflaridan URL uchun identifikator yasaydi */
export function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[‘’ʻʼ'`]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'item'
  ) + '-' + Math.random().toString(36).slice(2, 6)
}
