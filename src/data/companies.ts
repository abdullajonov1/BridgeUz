import type { CompanyPlan } from '../lib/plan'
import type { CategoryId, LanguageCode } from './taxonomy'
import { L, LL, type Loc, type LocList } from '../i18n/types'

// Demo ma'lumotlar — backend ulanganda API'dan keladi.
export interface Company {
  id: string
  name: string
  category: CategoryId
  region: string
  founded: number
  employees: string
  rating: number
  reviews: number
  verified: boolean
  /** Premium listing — `plan === 'premium'` va muddat o‘tmagan bo‘lsa true */
  premium: boolean
  /** Provayder tarifi. To‘lov yo‘q — admin qo‘lda belgilaydi. */
  plan: CompanyPlan
  /** YYYY-MM-DD. Bepul tarifda bo‘sh. Pullik tarif muddati o‘tsa katalogdan yashiriladi. */
  planUntil?: string
  languages: LanguageCode[]
  /** Xizmat narxi, USD dan boshlab */
  priceFrom: number
  responseHours: number
  description: Loc
  services: LocList
  industries: LocList
  /** Admin tomonidan saytdan yashirilgan */
  hidden?: boolean
}

const companyRows: Omit<Company, 'plan' | 'planUntil'>[] = [
  {
    id: 'lex-partners',
    name: 'Lex Partners Tashkent',
    category: 'yuridik',
    region: 'toshkent-shahri',
    founded: 2012,
    employees: '25–50',
    rating: 4.9,
    reviews: 64,
    verified: true,
    premium: true,
    languages: ['uz', 'ru', 'en'],
    priceFrom: 400,
    responseHours: 4,
    description: L(
      'Xorijiy investorlarga kompaniya ochish, litsenziya olish va korporativ huquq bo‘yicha to‘liq yuridik hamrohlik.',
      'Full legal support for foreign investors: company set-up, licensing and corporate law.',
      'Полное юридическое сопровождение иностранных инвесторов: открытие компании, лицензии, корпоративное право.',
    ),
    services: LL(
      ['Kompaniya ro‘yxatdan o‘tkazish', 'Litsenziya va ruxsatnomalar', 'Shartnomalar ekspertizasi', 'Korporativ huquq'],
      ['Company registration', 'Licences and permits', 'Contract review', 'Corporate law'],
      ['Регистрация компании', 'Лицензии и разрешения', 'Экспертиза договоров', 'Корпоративное право'],
    ),
    industries: LL(['Sanoat', 'IT', 'Savdo'], ['Industry', 'IT', 'Trade'], ['Промышленность', 'IT', 'Торговля']),
  },
  {
    id: 'silk-road-advisory',
    name: 'Silk Road Advisory',
    category: 'konsalting',
    region: 'toshkent-shahri',
    founded: 2015,
    employees: '10–25',
    rating: 4.8,
    reviews: 41,
    verified: true,
    premium: true,
    languages: ['uz', 'ru', 'en', 'de'],
    priceFrom: 800,
    responseHours: 6,
    description: L(
      'Bozorga kirish strategiyasi, sektor tahlili va texnik-iqtisodiy asoslash bo‘yicha konsalting.',
      'Consulting on market entry strategy, sector analysis and feasibility studies.',
      'Консалтинг по стратегии выхода на рынок, отраслевому анализу и ТЭО.',
    ),
    services: LL(
      ['Bozor tahlili', 'Biznes-reja', 'Texnik-iqtisodiy asoslash', 'Hamkorlar bilan muzokaralar'],
      ['Market research', 'Business plan', 'Feasibility study', 'Partner negotiations'],
      ['Анализ рынка', 'Бизнес-план', 'ТЭО', 'Переговоры с партнёрами'],
    ),
    industries: LL(['Energetika', 'Qishloq xo‘jaligi', 'Sanoat'], ['Energy', 'Agriculture', 'Industry'], ['Энергетика', 'Сельское хозяйство', 'Промышленность']),
  },
  {
    id: 'textile-co',
    name: 'Textile Co.',
    category: 'ishlab-chiqaruvchi',
    region: 'toshkent-shahri',
    founded: 2009,
    employees: '250+',
    rating: 4.7,
    reviews: 38,
    verified: true,
    premium: false,
    languages: ['uz', 'ru', 'en'],
    priceFrom: 2000,
    responseHours: 24,
    description: L(
      'Paxta ipidan tayyor kiyimgacha to‘liq sikl. Xalqaro brendlar uchun shartnoma asosida ishlab chiqarish.',
      'Full cycle from cotton yarn to finished garments. Contract manufacturing for international brands.',
      'Полный цикл от хлопковой пряжи до готовой одежды. Контрактное производство для международных брендов.',
    ),
    services: LL(
      ['Shartnoma asosida ishlab chiqarish', 'Trikotaj mato', 'Tayyor kiyim', 'Bo‘yash va pardozlash'],
      ['Contract manufacturing', 'Knitted fabric', 'Finished garments', 'Dyeing and finishing'],
      ['Контрактное производство', 'Трикотажное полотно', 'Готовая одежда', 'Крашение и отделка'],
    ),
    industries: LL(['To‘qimachilik', 'Moda'], ['Textiles', 'Fashion'], ['Текстиль', 'Мода']),
  },
  {
    id: 'logistics-llc',
    name: 'Logistics LLC',
    category: 'logistika',
    region: 'fargona',
    founded: 2014,
    employees: '50–100',
    rating: 4.6,
    reviews: 57,
    verified: true,
    premium: false,
    languages: ['uz', 'ru'],
    priceFrom: 300,
    responseHours: 3,
    description: L(
      'Markaziy Osiyo bo‘ylab avtomobil va temir yo‘l yuk tashish, bojxona rasmiylashtiruvi va omborxona xizmatlari.',
      'Road and rail freight across Central Asia, customs clearance and warehousing.',
      'Авто- и железнодорожные перевозки по Центральной Азии, таможенное оформление и складские услуги.',
    ),
    services: LL(
      ['Xalqaro yuk tashish', 'Bojxona broker xizmati', 'Omborxona', 'Yukni sug‘urtalash'],
      ['International freight', 'Customs brokerage', 'Warehousing', 'Cargo insurance'],
      ['Международные перевозки', 'Таможенный брокер', 'Складирование', 'Страхование грузов'],
    ),
    industries: LL(['Savdo', 'Sanoat', 'Qishloq xo‘jaligi'], ['Trade', 'Industry', 'Agriculture'], ['Торговля', 'Промышленность', 'Сельское хозяйство']),
  },
  {
    id: 'agro-export',
    name: 'Agro Export',
    category: 'distributor',
    region: 'samarqand',
    founded: 2016,
    employees: '25–50',
    rating: 4.7,
    reviews: 29,
    verified: true,
    premium: true,
    languages: ['uz', 'ru', 'en'],
    priceFrom: 500,
    responseHours: 8,
    description: L(
      'Meva-sabzavot va quritilgan mahsulotlarni yig‘ish, saralash va xalqaro bozorlarga yetkazib berish.',
      'Sourcing, sorting and exporting fresh and dried fruit and vegetables to international markets.',
      'Закупка, сортировка и поставка свежих и сушёных фруктов и овощей на международные рынки.',
    ),
    services: LL(
      ['Xomashyo yetkazib berish', 'Saralash va qadoqlash', 'Eksport rasmiylashtiruvi', 'Sovutish omborlari'],
      ['Raw material supply', 'Sorting and packing', 'Export documentation', 'Cold storage'],
      ['Поставка сырья', 'Сортировка и упаковка', 'Экспортное оформление', 'Холодильные склады'],
    ),
    industries: LL(['Qishloq xo‘jaligi', 'Oziq-ovqat'], ['Agriculture', 'Food'], ['Сельское хозяйство', 'Продукты питания']),
  },
  {
    id: 'taxpro',
    name: 'TaxPro Consulting',
    category: 'yuridik',
    region: 'samarqand',
    founded: 2018,
    employees: '10–25',
    rating: 4.5,
    reviews: 22,
    verified: true,
    premium: false,
    languages: ['uz', 'ru'],
    priceFrom: 250,
    responseHours: 6,
    description: L(
      'Buxgalteriya autsorsingi, soliq hisobotlari va soliq imtiyozlari bo‘yicha maslahat.',
      'Accounting outsourcing, tax reporting and advice on tax incentives.',
      'Бухгалтерский аутсорсинг, налоговая отчётность и консультации по льготам.',
    ),
    services: LL(
      ['Buxgalteriya autsorsingi', 'Soliq rejalashtirish', 'Audit tayyorgarligi', 'MHXS hisobotlari'],
      ['Accounting outsourcing', 'Tax planning', 'Audit preparation', 'IFRS reporting'],
      ['Бухгалтерский аутсорсинг', 'Налоговое планирование', 'Подготовка к аудиту', 'Отчётность по МСФО'],
    ),
    industries: LL(['Xizmatlar', 'Turizm', 'Savdo'], ['Services', 'Tourism', 'Trade'], ['Услуги', 'Туризм', 'Торговля']),
  },
  {
    id: 'navoiy-industrial',
    name: 'Navoiy Industrial Supply',
    category: 'distributor',
    region: 'navoiy',
    founded: 2011,
    employees: '50–100',
    rating: 4.4,
    reviews: 18,
    verified: true,
    premium: false,
    languages: ['uz', 'ru'],
    priceFrom: 1000,
    responseHours: 12,
    description: L(
      'Kon-metallurgiya korxonalari uchun uskuna va ehtiyot qismlar distributori.',
      'Distributor of equipment and spare parts for mining and metallurgy companies.',
      'Дистрибьютор оборудования и запчастей для горно-металлургических предприятий.',
    ),
    services: LL(
      ['Uskunalar yetkazib berish', 'Ehtiyot qismlar', 'Servis xizmati', 'Ombor tarmog‘i'],
      ['Equipment supply', 'Spare parts', 'Maintenance service', 'Warehouse network'],
      ['Поставка оборудования', 'Запчасти', 'Сервисное обслуживание', 'Складская сеть'],
    ),
    industries: LL(['Kon sanoati', 'Energetika'], ['Mining', 'Energy'], ['Горная промышленность', 'Энергетика']),
  },
  {
    id: 'digital-oasis',
    name: 'Digital Oasis',
    category: 'it',
    region: 'toshkent-shahri',
    founded: 2019,
    employees: '50–100',
    rating: 4.9,
    reviews: 47,
    verified: true,
    premium: true,
    languages: ['uz', 'ru', 'en'],
    priceFrom: 1500,
    responseHours: 4,
    description: L(
      'IT Park rezidenti. ERP integratsiyasi, mobil ilovalar va mahalliy to‘lov tizimlari bilan ulanish.',
      'IT Park resident. ERP integration, mobile apps and local payment system integration.',
      'Резидент IT Park. Интеграция ERP, мобильные приложения и подключение к местным платёжным системам.',
    ),
    services: LL(
      ['ERP integratsiya', 'Mobil ilovalar', 'To‘lov tizimlari integratsiyasi', 'Bulutli infratuzilma'],
      ['ERP integration', 'Mobile apps', 'Payment system integration', 'Cloud infrastructure'],
      ['Интеграция ERP', 'Мобильные приложения', 'Интеграция платёжных систем', 'Облачная инфраструктура'],
    ),
    industries: LL(['Fintech', 'Savdo', 'Logistika'], ['Fintech', 'Trade', 'Logistics'], ['Финтех', 'Торговля', 'Логистика']),
  },
  {
    id: 'talentbridge',
    name: 'TalentBridge HR',
    category: 'hr',
    region: 'toshkent-shahri',
    founded: 2017,
    employees: '10–25',
    rating: 4.6,
    reviews: 33,
    verified: true,
    premium: false,
    languages: ['uz', 'ru', 'en'],
    priceFrom: 350,
    responseHours: 6,
    description: L(
      'Rahbar va mutaxassislarni tanlash, xodimlar autsorsingi va mehnat huquqi bo‘yicha maslahat.',
      'Executive and specialist recruitment, staff outsourcing and labour law advice.',
      'Подбор руководителей и специалистов, аутсорсинг персонала и консультации по трудовому праву.',
    ),
    services: LL(
      ['Executive search', 'Ommaviy yollash', 'Xodimlar autsorsingi', 'Mehnat shartnomalari'],
      ['Executive search', 'Mass recruitment', 'Staff outsourcing', 'Employment contracts'],
      ['Executive search', 'Массовый подбор', 'Аутсорсинг персонала', 'Трудовые договоры'],
    ),
    industries: LL(['IT', 'Sanoat', 'Xizmatlar'], ['IT', 'Industry', 'Services'], ['IT', 'Промышленность', 'Услуги']),
  },
  {
    id: 'capital-estate',
    name: 'Capital Estate Group',
    category: 'kochmas-mulk',
    region: 'toshkent-shahri',
    founded: 2013,
    employees: '25–50',
    rating: 4.5,
    reviews: 26,
    verified: true,
    premium: false,
    languages: ['uz', 'ru', 'en'],
    priceFrom: 0,
    responseHours: 2,
    description: L(
      'Ofis, savdo va ombor maydonlarini topish, ijara shartnomasi va texnik ekspertiza.',
      'Finding office, retail and warehouse space, lease agreements and technical due diligence.',
      'Подбор офисных, торговых и складских помещений, договоры аренды и техническая экспертиза.',
    ),
    services: LL(
      ['Ofis ijarasi', 'Ombor maydonlari', 'Yer uchastkalari', 'Huquqiy tekshiruv'],
      ['Office leasing', 'Warehouse space', 'Land plots', 'Legal due diligence'],
      ['Аренда офисов', 'Складские площади', 'Земельные участки', 'Юридическая проверка'],
    ),
    industries: LL(['Barcha sohalar'], ['All sectors'], ['Все отрасли']),
  },
  {
    id: 'valley-distribution',
    name: 'Valley Distribution',
    category: 'distributor',
    region: 'andijon',
    founded: 2010,
    employees: '100–250',
    rating: 4.6,
    reviews: 35,
    verified: true,
    premium: false,
    languages: ['uz', 'ru'],
    priceFrom: 700,
    responseHours: 12,
    description: L(
      'Farg‘ona vodiysi bo‘ylab FMCG va maishiy texnika distribyutsiyasi, 1 200+ savdo nuqtasi.',
      'FMCG and home appliance distribution across the Fergana Valley, 1,200+ retail outlets.',
      'Дистрибуция FMCG и бытовой техники по Ферганской долине, более 1 200 торговых точек.',
    ),
    services: LL(
      ['Distribyutsiya', 'Merchandayzing', 'Savdo vakillari', 'Ombor logistikasi'],
      ['Distribution', 'Merchandising', 'Sales representatives', 'Warehouse logistics'],
      ['Дистрибуция', 'Мерчандайзинг', 'Торговые представители', 'Складская логистика'],
    ),
    industries: LL(['FMCG', 'Maishiy texnika'], ['FMCG', 'Home appliances'], ['FMCG', 'Бытовая техника']),
  },
  {
    id: 'termiz-cargo',
    name: 'Termiz Trans Cargo',
    category: 'logistika',
    region: 'surxondaryo',
    founded: 2015,
    employees: '25–50',
    rating: 4.3,
    reviews: 14,
    verified: false,
    premium: false,
    languages: ['uz', 'ru'],
    priceFrom: 250,
    responseHours: 8,
    description: L(
      'Janubiy yo‘nalishda tranzit yuk tashish va chegara terminali xizmatlari.',
      'Southbound transit freight and border terminal services.',
      'Транзитные перевозки на южном направлении и услуги пограничного терминала.',
    ),
    services: LL(
      ['Tranzit yuk tashish', 'Terminal xizmatlari', 'Bojxona rasmiylashtiruvi'],
      ['Transit freight', 'Terminal services', 'Customs clearance'],
      ['Транзитные перевозки', 'Терминальные услуги', 'Таможенное оформление'],
    ),
    industries: LL(['Savdo', 'Qishloq xo‘jaligi'], ['Trade', 'Agriculture'], ['Торговля', 'Сельское хозяйство']),
  },
  {
    id: 'bukhara-crafts',
    name: 'Bukhara Craft Textiles',
    category: 'ishlab-chiqaruvchi',
    region: 'buxoro',
    founded: 2008,
    employees: '50–100',
    rating: 4.8,
    reviews: 21,
    verified: true,
    premium: false,
    languages: ['uz', 'ru', 'en'],
    priceFrom: 900,
    responseHours: 24,
    description: L(
      'Ipak va milliy matolar, qo‘l mehnati asosidagi interyer mahsulotlari ishlab chiqarish.',
      'Silk and traditional fabrics, handcrafted interior products.',
      'Шёлк и национальные ткани, интерьерные изделия ручной работы.',
    ),
    services: LL(
      ['Ipak mato', 'Interyer tekstili', 'Shartnoma asosida ishlab chiqarish'],
      ['Silk fabric', 'Interior textiles', 'Contract manufacturing'],
      ['Шёлковые ткани', 'Интерьерный текстиль', 'Контрактное производство'],
    ),
    industries: LL(['To‘qimachilik', 'Interyer'], ['Textiles', 'Interior design'], ['Текстиль', 'Интерьер']),
  },
  {
    id: 'market-insight',
    name: 'Market Insight',
    category: 'konsalting',
    region: 'toshkent-shahri',
    founded: 2020,
    employees: '10–25',
    rating: 4.7,
    reviews: 19,
    verified: true,
    premium: false,
    languages: ['uz', 'ru', 'en'],
    priceFrom: 600,
    responseHours: 8,
    description: L(
      'Iste’molchi tadqiqotlari, raqobatchilar tahlili va narx strategiyasi.',
      'Consumer research, competitor analysis and pricing strategy.',
      'Потребительские исследования, анализ конкурентов и ценовая стратегия.',
    ),
    services: LL(
      ['Bozor tadqiqoti', 'Raqobatchilar tahlili', 'Fokus-guruhlar', 'Narx strategiyasi'],
      ['Market research', 'Competitor analysis', 'Focus groups', 'Pricing strategy'],
      ['Маркетинговые исследования', 'Анализ конкурентов', 'Фокус-группы', 'Ценовая стратегия'],
    ),
    industries: LL(['FMCG', 'Ritel', 'Xizmatlar'], ['FMCG', 'Retail', 'Services'], ['FMCG', 'Ритейл', 'Услуги']),
  },
  {
    id: 'khiva-property',
    name: 'Khiva Property',
    category: 'kochmas-mulk',
    region: 'xorazm',
    founded: 2018,
    employees: '5–10',
    rating: 4.4,
    reviews: 11,
    verified: false,
    premium: false,
    languages: ['uz', 'ru'],
    priceFrom: 0,
    responseHours: 6,
    description: L(
      'Turizm obyektlari uchun bino va yer uchastkalarini topish hamda rasmiylashtirish.',
      'Sourcing and registering buildings and land plots for tourism projects.',
      'Подбор и оформление зданий и земельных участков для туристических объектов.',
    ),
    services: LL(
      ['Tijorat ko‘chmas mulki', 'Yer uchastkalari', 'Baholash'],
      ['Commercial real estate', 'Land plots', 'Valuation'],
      ['Коммерческая недвижимость', 'Земельные участки', 'Оценка'],
    ),
    industries: LL(['Turizm', 'Xizmatlar'], ['Tourism', 'Services'], ['Туризм', 'Услуги']),
  },
  {
    id: 'asaka-components',
    name: 'Asaka Components',
    category: 'ishlab-chiqaruvchi',
    region: 'andijon',
    founded: 2012,
    employees: '250+',
    rating: 4.6,
    reviews: 17,
    verified: true,
    premium: true,
    languages: ['uz', 'ru', 'en', 'ko'],
    priceFrom: 3000,
    responseHours: 24,
    description: L(
      'Avtomobil sanoati uchun plastik va metall komponentlar, IATF 16949 sertifikati.',
      'Plastic and metal components for the automotive industry, IATF 16949 certified.',
      'Пластиковые и металлические компоненты для автопрома, сертификат IATF 16949.',
    ),
    services: LL(
      ['Plastik quyish', 'Metall shtamplash', 'Yig‘ish xizmatlari'],
      ['Plastic injection moulding', 'Metal stamping', 'Assembly services'],
      ['Литьё пластмасс', 'Штамповка металла', 'Сборочные услуги'],
    ),
    industries: LL(['Avtomobilsozlik'], ['Automotive'], ['Автомобилестроение']),
  },
]

/** Demo tariflar — to‘lov yozuvlariga mos. Backend ulanganda API belgilaydi. */
const PLAN_SEED: Record<string, { plan: CompanyPlan; until?: string }> = {
  'lex-partners': { plan: 'premium', until: '2027-10-05' },
  'silk-road-advisory': { plan: 'subscription', until: '2026-11-30' },
  'logistics-llc': { plan: 'subscription', until: '2026-09-30' },
  'agro-export': { plan: 'premium', until: '2027-09-15' },
  'digital-oasis': { plan: 'subscription', until: '2026-11-30' },
  'market-insight': { plan: 'subscription', until: '2026-10-31' },
  'asaka-components': { plan: 'premium', until: '2027-08-20' },
}

export const companies: Company[] = companyRows.map((c) => {
  const spec = PLAN_SEED[c.id]
  const plan = spec?.plan ?? 'free'
  return { ...c, plan, planUntil: spec?.until, premium: plan === 'premium' }
})

export const companyById = (id: string) => companies.find((c) => c.id === id)
