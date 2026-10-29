import {
  Building,
  Construction,
  Cpu,
  Factory,
  Leaf,
  Monitor,
  Network,
  Presentation,
  Scale,
  Sprout,
  Truck,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { L, type Loc } from '../i18n/types'

/** Investitsiya sohalari (taqdimot, 2-slayd: "Asosiy investitsiya sohalari") */
export type SectorId =
  | 'sanoat'
  | 'energetika'
  | 'qishloq'
  | 'xizmatlar'
  | 'logistika'
  | 'it'
  | 'qurilish'
  | 'yashil'

export interface Sector {
  id: SectorId
  name: Loc
  icon: LucideIcon
}

export const sectors: Sector[] = [
  { id: 'sanoat', name: L('Sanoat', 'Industry', 'Промышленность'), icon: Factory },
  { id: 'energetika', name: L('Energetika', 'Energy', 'Энергетика'), icon: Zap },
  { id: 'qishloq', name: L('Qishloq xo‘jaligi', 'Agriculture', 'Сельское хозяйство'), icon: Sprout },
  { id: 'xizmatlar', name: L('Xizmatlar', 'Services', 'Услуги'), icon: Building },
  { id: 'logistika', name: L('Logistika', 'Logistics', 'Логистика'), icon: Truck },
  { id: 'it', name: L('IT va raqamli iqtisodiyot', 'IT & digital economy', 'IT и цифровая экономика'), icon: Cpu },
  { id: 'qurilish', name: L('Qurilish', 'Construction', 'Строительство'), icon: Construction },
  { id: 'yashil', name: L('Yashil iqtisodiyot', 'Green economy', 'Зелёная экономика'), icon: Leaf },
]

/** Mahalliy xizmat ko‘rsatuvchilar toifalari (taqdimot, 3-slayd) */
export type CategoryId =
  | 'yuridik'
  | 'konsalting'
  | 'distributor'
  | 'ishlab-chiqaruvchi'
  | 'logistika'
  | 'it'
  | 'hr'
  | 'kochmas-mulk'

export interface Category {
  id: CategoryId
  name: Loc
  short: Loc
  description: Loc
  icon: LucideIcon
}

export const categories: Category[] = [
  {
    id: 'yuridik',
    name: L('Yuridik va soliq', 'Legal & tax', 'Юридические и налоговые'),
    short: L('Yuridik va soliq', 'Legal & tax', 'Право и налоги'),
    description: L(
      'Kompaniya ro‘yxatdan o‘tkazish, litsenziyalar, soliq rejalashtirish',
      'Company registration, licences, tax planning',
      'Регистрация компании, лицензии, налоговое планирование',
    ),
    icon: Scale,
  },
  {
    id: 'konsalting',
    name: L('Konsalting', 'Consulting', 'Консалтинг'),
    short: L('Konsalting', 'Consulting', 'Консалтинг'),
    description: L(
      'Bozor tahlili, biznes-reja, bozorga kirish strategiyasi',
      'Market research, business plans, market entry strategy',
      'Анализ рынка, бизнес-план, стратегия выхода на рынок',
    ),
    icon: Presentation,
  },
  {
    id: 'distributor',
    name: L('Distributorlar', 'Distributors', 'Дистрибьюторы'),
    short: L('Distributorlar', 'Distributors', 'Дистрибьюторы'),
    description: L(
      'Mahsulotni hududlar bo‘ylab tarqatish va savdo tarmoqlari',
      'Nationwide distribution and retail networks',
      'Дистрибуция по регионам и торговые сети',
    ),
    icon: Network,
  },
  {
    id: 'ishlab-chiqaruvchi',
    name: L('Ishlab chiqaruvchilar', 'Manufacturers', 'Производители'),
    short: L('Ishlab chiqarish', 'Manufacturing', 'Производство'),
    description: L(
      'Shartnoma asosida ishlab chiqarish va xomashyo yetkazib berish',
      'Contract manufacturing and raw material supply',
      'Контрактное производство и поставка сырья',
    ),
    icon: Factory,
  },
  {
    id: 'logistika',
    name: L('Logistika', 'Logistics', 'Логистика'),
    short: L('Logistika', 'Logistics', 'Логистика'),
    description: L(
      'Yuk tashish, bojxona rasmiylashtiruvi va omborxonalar',
      'Freight, customs clearance and warehousing',
      'Грузоперевозки, таможенное оформление и склады',
    ),
    icon: Truck,
  },
  {
    id: 'it',
    name: L('IT xizmatlari', 'IT services', 'IT-услуги'),
    short: L('IT xizmatlari', 'IT services', 'IT-услуги'),
    description: L(
      'Dasturiy ta’minot, integratsiya va raqamli infratuzilma',
      'Software, integration and digital infrastructure',
      'Программное обеспечение, интеграция и цифровая инфраструктура',
    ),
    icon: Monitor,
  },
  {
    id: 'hr',
    name: L('HR va kadrlar', 'HR & staffing', 'HR и персонал'),
    short: L('HR va kadrlar', 'HR & staffing', 'HR и персонал'),
    description: L(
      'Xodimlarni tanlash, autsorsing va mehnat munosabatlari',
      'Recruitment, outsourcing and labour relations',
      'Подбор персонала, аутсорсинг и трудовые отношения',
    ),
    icon: Users,
  },
  {
    id: 'kochmas-mulk',
    name: L('Ko‘chmas mulk', 'Real estate', 'Недвижимость'),
    short: L('Ko‘chmas mulk', 'Real estate', 'Недвижимость'),
    description: L(
      'Ofis, ombor va ishlab chiqarish maydonlari ijarasi',
      'Office, warehouse and industrial space for lease',
      'Аренда офисов, складов и производственных площадей',
    ),
    icon: Building,
  },
]

export const sectorById = (id: SectorId) => sectors.find((s) => s.id === id)!
export const categoryById = (id: CategoryId) => categories.find((c) => c.id === id)!

const langAlias: Record<string, LanguageCode> = {
  uz: 'uz', ru: 'ru', en: 'en', de: 'de', ko: 'ko', tr: 'tr', zh: 'zh',
  'O‘zbek': 'uz', "O'zbek": 'uz', Rus: 'ru', Ingliz: 'en', Nemis: 'de', Koreys: 'ko',
  Uzbek: 'uz', Russian: 'ru', English: 'en', German: 'de', Korean: 'ko',
  'Узбек': 'uz', 'Рус': 'ru', 'Инглиз': 'en',
}

export function displayLanguages(codes: string[], l: (v: Loc | string) => string) {
  return codes
    .map((c) => {
      const id = langAlias[c]
      return id ? l(languageNames[id]) : c
    })
    .join(', ')
}

export function parseLanguageCodes(s: string): LanguageCode[] {
  const seen = new Set<LanguageCode>()
  for (const raw of s.split(/[\n,]/)) {
    const token = raw.trim()
    if (!token) continue
    const id = langAlias[token] ?? langAlias[token.toLowerCase()]
    if (id && !seen.has(id)) seen.add(id)
  }
  return seen.size ? [...seen] : ['uz']
}

/** Kompaniyalar ishlaydigan tillar */
export const languageCodes = ['uz', 'ru', 'en', 'de', 'ko', 'tr', 'zh'] as const
export type LanguageCode = (typeof languageCodes)[number]
export const languageNames: Record<LanguageCode, Loc> = {
  uz: L('O‘zbek', 'Uzbek', 'Узбекский'),
  ru: L('Rus', 'Russian', 'Русский'),
  en: L('Ingliz', 'English', 'Английский'),
  de: L('Nemis', 'German', 'Немецкий'),
  ko: L('Koreys', 'Korean', 'Корейский'),
  tr: L('Turk', 'Turkish', 'Турецкий'),
  zh: L('Xitoy', 'Chinese', 'Китайский'),
}
