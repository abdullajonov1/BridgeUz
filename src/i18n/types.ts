/** uz — o'zbek (lotin), uzc — o'zbek (kirill, lotindan avtomatik), en — ingliz, ru — rus */
export type Lang = 'uz' | 'uzc' | 'en' | 'ru'

/** Ko'p tilli matn. en/ru bo'lmasa o'zbekcha ko'rsatiladi */
export interface Loc {
  uz: string
  en?: string
  ru?: string
}

export interface LocList {
  uz: string[]
  en?: string[]
  ru?: string[]
}

export const L = (uz: string, en: string, ru: string): Loc => ({ uz, en, ru })
export const LL = (uz: string[], en: string[], ru: string[]): LocList => ({ uz, en, ru })

export const languages: { code: Lang; short: string; name: string; html: string }[] = [
  { code: 'uz', short: 'UZ', name: 'O‘zbekcha', html: 'uz' },
  { code: 'uzc', short: 'ЎЗ', name: 'Ўзбекча', html: 'uz-Cyrl' },
  { code: 'en', short: 'EN', name: 'English', html: 'en' },
  { code: 'ru', short: 'RU', name: 'Русский', html: 'ru' },
]
