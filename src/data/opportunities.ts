import type { SectorId } from './taxonomy'
import { L, LL, type Loc, type LocList } from '../i18n/types'

// Demo ma'lumotlar — backend ulanganda API'dan keladi.
export const opportunityFormats = ['new', 'jv', 'expansion', 'ppp'] as const
export type OpportunityFormat = (typeof opportunityFormats)[number]

export interface Opportunity {
  id: string
  title: Loc
  region: string
  sector: SectorId
  /** Investitsiya hajmi, mln USD */
  investment: number
  format: OpportunityFormat
  summary: Loc
  advantages: LocList
  featured?: boolean
  /** Yopilgan loyihalar saytda ko‘rsatilmaydi */
  closed?: boolean
}

export const opportunityFormatKeys = {
  new: 'oppFormat.new',
  jv: 'oppFormat.jv',
  expansion: 'oppFormat.expansion',
  ppp: 'oppFormat.ppp',
} as const

export function formatUsd(n: number) {
  const s = Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, '')
  return `$${s}`
}

export const opportunities: Opportunity[] = [
  {
    id: 'mis-katod-navoiy',
    title: L('Mis mahsulotlarini qayta ishlash zavodi', 'Copper products processing plant', 'Завод по переработке медной продукции'),
    region: 'navoiy',
    sector: 'sanoat',
    investment: 25,
    format: 'jv',
    summary: L(
      'Mahalliy xomashyo asosida mis sim va kabel mahsulotlari ishlab chiqarish. EIZ hududida tayyor maydon mavjud.',
      'Copper wire and cable production from local raw materials. A ready site is available in the FEZ.',
      'Производство медной проволоки и кабелей из местного сырья. В СЭЗ есть готовая площадка.',
    ),
    advantages: LL(
      ['EIZ soliq imtiyozlari', 'Xomashyo yaqinligi', 'Temir yo‘lga ulanish'],
      ['FEZ tax incentives', 'Close to raw materials', 'Railway connection'],
      ['Налоговые льготы СЭЗ', 'Близость к сырью', 'Подключение к железной дороге'],
    ),
    featured: true,
  },
  {
    id: 'meva-qadoqlash-samarqand',
    title: L('Meva-sabzavotni saralash va qadoqlash markazi', 'Fruit and vegetable sorting and packing centre', 'Центр сортировки и упаковки плодоовощной продукции'),
    region: 'samarqand',
    sector: 'qishloq',
    investment: 4.5,
    format: 'new',
    summary: L(
      'Eksportga yo‘naltirilgan sovutish omborlari va avtomatlashtirilgan saralash liniyasi.',
      'Export-oriented cold storage and an automated sorting line.',
      'Экспортно-ориентированные холодильные склады и автоматизированная линия сортировки.',
    ),
    advantages: LL(
      ['Yetkazib beruvchilar tarmog‘i', 'Eksport bozorlariga yaqinlik', 'Mavsumiy xomashyo'],
      ['Supplier network', 'Close to export markets', 'Seasonal raw materials'],
      ['Сеть поставщиков', 'Близость к экспортным рынкам', 'Сезонное сырьё'],
    ),
    featured: true,
  },
  {
    id: 'data-markaz-toshkent',
    title: L('Data-markaz va bulutli xizmatlar', 'Data centre and cloud services', 'Дата-центр и облачные сервисы'),
    region: 'toshkent-shahri',
    sector: 'it',
    investment: 18,
    format: 'new',
    summary: L(
      'Mahalliy kompaniyalar va davlat sektori uchun Tier III darajadagi ma’lumotlar markazi.',
      'A Tier III data centre for local businesses and the public sector.',
      'Дата-центр уровня Tier III для местных компаний и госсектора.',
    ),
    advantages: LL(
      ['IT Park imtiyozlari', 'O‘sib borayotgan talab', 'Malakali kadrlar'],
      ['IT Park incentives', 'Growing demand', 'Skilled workforce'],
      ['Льготы IT Park', 'Растущий спрос', 'Квалифицированные кадры'],
    ),
    featured: true,
  },
  {
    id: 'shamol-qoraqalpogiston',
    title: L('Shamol elektr stansiyalari uchun komponentlar', 'Components for wind power plants', 'Компоненты для ветровых электростанций'),
    region: 'qoraqalpogiston',
    sector: 'yashil',
    investment: 40,
    format: 'ppp',
    summary: L(
      'Hududdagi shamol energetikasi loyihalari uchun minoralar va konstruksiyalar ishlab chiqarish.',
      'Manufacturing towers and structures for regional wind energy projects.',
      'Производство башен и конструкций для региональных проектов ветроэнергетики.',
    ),
    advantages: LL(
      ['Uzoq muddatli xarid kafolati', 'Keng yer maydoni', 'Yashil energiya dasturi'],
      ['Long-term offtake guarantee', 'Large land plot', 'Green energy programme'],
      ['Долгосрочная гарантия закупок', 'Большой земельный участок', 'Программа зелёной энергетики'],
    ),
  },
  {
    id: 'termiz-logistika',
    title: L('Multimodal logistika ombori', 'Multimodal logistics warehouse', 'Мультимодальный логистический склад'),
    region: 'surxondaryo',
    sector: 'logistika',
    investment: 9,
    format: 'new',
    summary: L(
      'Janubiy yo‘nalishdagi tranzit yuklar uchun avtomobil va temir yo‘l omborxona majmuasi.',
      'A road and rail warehouse complex for southbound transit cargo.',
      'Авто- и железнодорожный складской комплекс для транзитных грузов южного направления.',
    ),
    advantages: LL(
      ['Chegara savdo markazi', 'Tranzit yuk oqimi', 'Temir yo‘l terminali'],
      ['Border trade centre', 'Transit cargo flow', 'Rail terminal'],
      ['Приграничный торговый центр', 'Транзитный грузопоток', 'Железнодорожный терминал'],
    ),
  },
  {
    id: 'tekstil-fargona',
    title: L('Ipdan tayyor mahsulotgacha to‘qimachilik klasteri', 'Yarn-to-garment textile cluster', 'Текстильный кластер полного цикла'),
    region: 'fargona',
    sector: 'sanoat',
    investment: 12,
    format: 'expansion',
    summary: L(
      'Mavjud yigiruv fabrikasini bo‘yash va tikuv sexlari bilan to‘liq siklga kengaytirish.',
      'Expanding an existing spinning mill into a full cycle with dyeing and sewing shops.',
      'Расширение действующей прядильной фабрики до полного цикла с красильным и швейным цехами.',
    ),
    advantages: LL(
      ['Mahalliy paxta xomashyosi', 'Tajribali ishchi kuchi', 'Eksport preferensiyalari'],
      ['Local cotton', 'Experienced workforce', 'Export preferences'],
      ['Местный хлопок', 'Опытные кадры', 'Экспортные преференции'],
    ),
  },
  {
    id: 'butik-mehmonxona-xiva',
    title: L('Butik mehmonxona majmuasi', 'Boutique hotel complex', 'Бутик-отель'),
    region: 'xorazm',
    sector: 'xizmatlar',
    investment: 3,
    format: 'new',
    summary: L(
      'Ichan qal’a yaqinida 60 xonali butik mehmonxona va restoran.',
      'A 60-room boutique hotel and restaurant near Itchan Kala.',
      'Бутик-отель на 60 номеров с рестораном рядом с Ичан-Калой.',
    ),
    advantages: LL(
      ['Turistlar oqimining o‘sishi', 'Tarixiy hudud', 'Turizm imtiyozlari'],
      ['Growing tourist flow', 'Historic location', 'Tourism incentives'],
      ['Рост турпотока', 'Историческое место', 'Льготы для туризма'],
    ),
  },
  {
    id: 'gazoblok-jizzax',
    title: L('Gazoblok va qurilish materiallari ishlab chiqarish', 'Aerated concrete and building materials plant', 'Производство газоблоков и стройматериалов'),
    region: 'jizzax',
    sector: 'qurilish',
    investment: 6,
    format: 'new',
    summary: L(
      'Uy-joy qurilishi uchun yengil beton bloklar ishlab chiqaruvchi zavod.',
      'A plant producing lightweight concrete blocks for housing construction.',
      'Завод по производству лёгких бетонных блоков для жилищного строительства.',
    ),
    advantages: LL(
      ['EIZ maydonlari', 'Qurilish bozorining o‘sishi', 'Markaziy joylashuv'],
      ['FEZ sites', 'Growing construction market', 'Central location'],
      ['Площадки СЭЗ', 'Рост строительного рынка', 'Центральное расположение'],
    ),
  },
  {
    id: 'issiqxona-buxoro',
    title: L('Quyosh panelli issiqxona majmuasi', 'Solar-powered greenhouse complex', 'Тепличный комплекс на солнечной энергии'),
    region: 'buxoro',
    sector: 'yashil',
    investment: 5,
    format: 'new',
    summary: L(
      'Quyosh energiyasida ishlaydigan 10 gektarlik zamonaviy issiqxona.',
      'A modern 10-hectare greenhouse powered by solar energy.',
      'Современная теплица площадью 10 гектаров на солнечной энергии.',
    ),
    advantages: LL(
      ['Yil bo‘yi quyoshli kunlar', 'Energiya tejamkorligi', 'Eksport salohiyati'],
      ['Sunshine all year round', 'Energy efficiency', 'Export potential'],
      ['Солнечные дни круглый год', 'Энергоэффективность', 'Экспортный потенциал'],
    ),
  },
  {
    id: 'avtokomponent-andijon',
    title: L('Avtokomponentlar ishlab chiqarish', 'Auto component manufacturing', 'Производство автокомпонентов'),
    region: 'andijon',
    sector: 'sanoat',
    investment: 15,
    format: 'jv',
    summary: L(
      'Avtomobil zavodlari uchun plastik va metall komponentlar ishlab chiqarish.',
      'Plastic and metal components for car plants.',
      'Производство пластиковых и металлических компонентов для автозаводов.',
    ),
    advantages: LL(
      ['Kafolatlangan xaridor', 'Sanoat klasteri', 'Mahalliylashtirish dasturi'],
      ['Guaranteed buyer', 'Industrial cluster', 'Localisation programme'],
      ['Гарантированный покупатель', 'Промышленный кластер', 'Программа локализации'],
    ),
  },
  {
    id: 'farmatsevtika-toshkent-vil',
    title: L('Generik dori vositalari ishlab chiqarish', 'Generic pharmaceuticals production', 'Производство дженериков'),
    region: 'toshkent-viloyati',
    sector: 'sanoat',
    investment: 20,
    format: 'jv',
    summary: L(
      'GMP standartlariga mos tabletka va kapsula ishlab chiqarish liniyasi.',
      'A GMP-compliant tablet and capsule production line.',
      'Линия производства таблеток и капсул по стандартам GMP.',
    ),
    advantages: LL(
      ['Import o‘rnini bosish', 'Davlat xaridlari', 'Poytaxtga yaqinlik'],
      ['Import substitution', 'Public procurement', 'Close to the capital'],
      ['Импортозамещение', 'Госзакупки', 'Близость к столице'],
    ),
  },
  {
    id: 'quritilgan-meva-namangan',
    title: L('Quritilgan meva eksport liniyasi', 'Dried fruit export line', 'Линия по экспорту сухофруктов'),
    region: 'namangan',
    sector: 'qishloq',
    investment: 2.5,
    format: 'expansion',
    summary: L(
      'Quritish, saralash va xalqaro standartlarda qadoqlash quvvatlarini oshirish.',
      'Scaling up drying, sorting and international-standard packaging capacity.',
      'Наращивание мощностей сушки, сортировки и упаковки по международным стандартам.',
    ),
    advantages: LL(
      ['Xomashyo bazasi', 'Eksport talabi', 'Past boshlang‘ich xarajat'],
      ['Raw material base', 'Export demand', 'Low start-up cost'],
      ['Сырьевая база', 'Экспортный спрос', 'Низкие стартовые затраты'],
    ),
  },
]

export const formatInvestment = (mln: number) =>
  `$${mln.toLocaleString('en-US', { maximumFractionDigits: 1 })} mln`
