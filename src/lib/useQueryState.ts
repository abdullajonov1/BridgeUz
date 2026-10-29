import { useSearchParams } from 'react-router-dom'

/** URL query parametri bilan sinxronlangan holat — filtrlarni havola orqali ulashish uchun */
export function useQueryState(key: string, fallback = '') {
  const [params, setParams] = useSearchParams()
  const value = params.get(key) ?? fallback

  const setValue = (next: string) => {
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev)
        if (!next || next === fallback) p.delete(key)
        else p.set(key, next)
        return p
      },
      { replace: true },
    )
  }

  return [value, setValue] as const
}

/** Bir nechta parametrni bitta yangilanishda olib tashlaydi (ketma-ket set chaqiruvlari bir-birini bosib ketadi) */
export function useClearQuery(keys: string[]) {
  const [, setParams] = useSearchParams()
  return () =>
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev)
        keys.forEach((k) => p.delete(k))
        return p
      },
      { replace: true },
    )
}
