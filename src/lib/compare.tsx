import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export const COMPARE_LIMIT = 3

interface CompareState {
  ids: string[]
  has: (id: string) => boolean
  toggle: (id: string) => void
  clear: () => void
  isOpen: boolean
  setOpen: (open: boolean) => void
}

const CompareContext = createContext<CompareState | null>(null)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([])
  const [isOpen, setOpen] = useState(false)

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= COMPARE_LIMIT) return prev
      return [...prev, id]
    })
  }, [])

  const value = useMemo<CompareState>(
    () => ({
      ids,
      has: (id) => ids.includes(id),
      toggle,
      clear: () => {
        setIds([])
        setOpen(false)
      },
      isOpen,
      setOpen,
    }),
    [ids, isOpen, toggle],
  )

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare CompareProvider ichida ishlatilishi kerak')
  return ctx
}
