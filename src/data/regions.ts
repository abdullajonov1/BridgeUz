import type { SectorId } from './taxonomy'
import { L, LL, type Loc, type LocList } from '../i18n/types'

export interface Region {
  slug: string
  name: Loc
  center: Loc
  /** Markaz koordinatalari — xaritadagi belgi uchun */
  lon: number
  lat: number
  tagline: Loc
  sectors: SectorId[]
  highlights: LocList
  /** Erkin iqtisodiy zonalar */
  zones: LocList
}

export const regions: Region[] = [
  {
    slug: 'toshkent-shahri',
    name: L('Toshkent shahri', 'Tashkent City', 'город Ташкент'),
    center: L('Toshkent', 'Tashkent', 'Ташкент'),
    lon: 69.24,
    lat: 41.31,
    tagline: L(
      'Mamlakatning moliya, biznes va IT markazi',
      'The country’s financial, business and IT hub',
      'Финансовый, деловой и IT-центр страны',
    ),
    sectors: ['it', 'xizmatlar', 'qurilish'],
    highlights: LL(
      ['Bank, sug‘urta va xalqaro kompaniyalar vakolatxonalari', 'Xalqaro aeroport va yirik logistika tuguni', 'IT Park rezidentlari uchun soliq imtiyozlari'],
      ['Banks, insurers and international company offices', 'International airport and a major logistics hub', 'Tax incentives for IT Park residents'],
      ['Банки, страховые компании и представительства международных компаний', 'Международный аэропорт и крупный логистический узел', 'Налоговые льготы для резидентов IT Park'],
    ),
    zones: LL([], [], []),
  },
  {
    slug: 'toshkent-viloyati',
    name: L('Toshkent viloyati', 'Tashkent Region', 'Ташкентская область'),
    center: L('Nurafshon', 'Nurafshon', 'Нурафшан'),
    lon: 69.55,
    lat: 40.95,
    tagline: L('Kon-metallurgiya va kimyo sanoati salohiyati', 'Mining, metallurgy and chemicals', 'Горно-металлургическая и химическая промышленность'),
    sectors: ['sanoat', 'energetika', 'qurilish'],
    highlights: LL(
      ['Olmaliq kon-metallurgiya klasteri', 'Poytaxtga yaqinlik va rivojlangan yo‘l tarmog‘i', 'Qurilish materiallari ishlab chiqarish'],
      ['Almalyk mining and metallurgy cluster', 'Close to the capital with a developed road network', 'Construction materials production'],
      ['Алмалыкский горно-металлургический кластер', 'Близость к столице и развитая дорожная сеть', 'Производство строительных материалов'],
    ),
    zones: LL(['Angren EIZ'], ['Angren FEZ'], ['СЭЗ «Ангрен»']),
  },
  {
    slug: 'samarqand',
    name: L('Samarqand viloyati', 'Samarkand Region', 'Самаркандская область'),
    center: L('Samarqand', 'Samarkand', 'Самарканд'),
    lon: 66.96,
    lat: 39.65,
    tagline: L('Turizm, agrosanoat va eksport salohiyati', 'Tourism, agribusiness and export potential', 'Туризм, агропромышленность и экспортный потенциал'),
    sectors: ['xizmatlar', 'qishloq', 'sanoat'],
    highlights: LL(
      ['Xalqaro turizm va mehmonxona biznesi', 'Meva-sabzavotchilik va qayta ishlash', 'Yengil sanoat va to‘qimachilik'],
      ['International tourism and hospitality', 'Fruit and vegetable growing and processing', 'Light industry and textiles'],
      ['Международный туризм и гостиничный бизнес', 'Плодоовощеводство и переработка', 'Лёгкая промышленность и текстиль'],
    ),
    zones: LL(['Urgut EIZ'], ['Urgut FEZ'], ['СЭЗ «Ургут»']),
  },
  {
    slug: 'buxoro',
    name: L('Buxoro viloyati', 'Bukhara Region', 'Бухарская область'),
    center: L('Buxoro', 'Bukhara', 'Бухара'),
    lon: 64.42,
    lat: 39.77,
    tagline: L('Neft-gaz kimyosi va hunarmandchilik', 'Oil & gas chemistry and crafts', 'Нефтегазохимия и ремёсла'),
    sectors: ['sanoat', 'xizmatlar', 'yashil'],
    highlights: LL(
      ['Neft-gazni qayta ishlash majmualari', 'Tarixiy turizm va hunarmandchilik', 'Quyosh energetikasi uchun qulay iqlim'],
      ['Oil and gas processing complexes', 'Heritage tourism and crafts', 'Favourable climate for solar energy'],
      ['Нефтегазоперерабатывающие комплексы', 'Исторический туризм и ремёсла', 'Благоприятный климат для солнечной энергетики'],
    ),
    zones: LL(['G‘ijduvon EIZ'], ['Gijduvan FEZ'], ['СЭЗ «Гиждуван»']),
  },
  {
    slug: 'navoiy',
    name: L('Navoiy viloyati', 'Navoi Region', 'Навоийская область'),
    center: L('Navoiy', 'Navoi', 'Навои'),
    lon: 65.38,
    lat: 40.1,
    tagline: L('Kon-metallurgiya va xalqaro logistika', 'Mining, metallurgy and international logistics', 'Горная металлургия и международная логистика'),
    sectors: ['sanoat', 'logistika', 'energetika'],
    highlights: LL(
      ['Yirik kon-metallurgiya korxonalari', 'Navoiy xalqaro intermodal logistika markazi', 'Erkin iqtisodiy zona imtiyozlari'],
      ['Major mining and metallurgy enterprises', 'Navoi international intermodal logistics centre', 'Free economic zone incentives'],
      ['Крупные горно-металлургические предприятия', 'Международный интермодальный логистический центр «Навои»', 'Льготы свободной экономической зоны'],
    ),
    zones: LL(['Navoiy EIZ'], ['Navoi FEZ'], ['СЭЗ «Навои»']),
  },
  {
    slug: 'andijon',
    name: L('Andijon viloyati', 'Andijan Region', 'Андижанская область'),
    center: L('Andijon', 'Andijan', 'Андижан'),
    lon: 72.34,
    lat: 40.78,
    tagline: L('Avtomobilsozlik va yengil sanoat', 'Automotive and light industry', 'Автомобилестроение и лёгкая промышленность'),
    sectors: ['sanoat', 'qishloq', 'logistika'],
    highlights: LL(
      ['Asaka avtomobilsozlik klasteri', 'Avtokomponentlar ishlab chiqarish', 'Zich aholi va mehnat resurslari'],
      ['Asaka automotive cluster', 'Auto component manufacturing', 'Dense population and labour resources'],
      ['Автомобильный кластер в Асаке', 'Производство автокомпонентов', 'Высокая плотность населения и трудовые ресурсы'],
    ),
    zones: LL([], [], []),
  },
  {
    slug: 'fargona',
    name: L('Farg‘ona viloyati', 'Fergana Region', 'Ферганская область'),
    center: L('Farg‘ona', 'Fergana', 'Фергана'),
    lon: 71.78,
    lat: 40.38,
    tagline: L('Neft kimyosi, to‘qimachilik va agrosanoat', 'Petrochemicals, textiles and agribusiness', 'Нефтехимия, текстиль и агропромышленность'),
    sectors: ['sanoat', 'qishloq', 'logistika'],
    highlights: LL(
      ['Neftni qayta ishlash va kimyo sanoati', 'To‘qimachilik va tikuvchilik klasterlari', 'Farg‘ona vodiysi bozoriga chiqish'],
      ['Oil refining and chemical industry', 'Textile and garment clusters', 'Access to the Fergana Valley market'],
      ['Нефтепереработка и химическая промышленность', 'Текстильные и швейные кластеры', 'Выход на рынок Ферганской долины'],
    ),
    zones: LL(['Qo‘qon EIZ'], ['Kokand FEZ'], ['СЭЗ «Коканд»']),
  },
  {
    slug: 'namangan',
    name: L('Namangan viloyati', 'Namangan Region', 'Наманганская область'),
    center: L('Namangan', 'Namangan', 'Наманган'),
    lon: 71.67,
    lat: 41.0,
    tagline: L('To‘qimachilik va bog‘dorchilik', 'Textiles and horticulture', 'Текстиль и садоводство'),
    sectors: ['sanoat', 'qishloq'],
    highlights: LL(
      ['Tekstil va tikuvchilik ishlab chiqarishi', 'Bog‘dorchilik va quritilgan meva eksporti', 'Kichik va o‘rta biznes uchun qulay muhit'],
      ['Textile and garment production', 'Horticulture and dried fruit exports', 'A favourable environment for SMEs'],
      ['Текстильное и швейное производство', 'Садоводство и экспорт сухофруктов', 'Благоприятная среда для малого и среднего бизнеса'],
    ),
    zones: LL([], [], []),
  },
  {
    slug: 'qashqadaryo',
    name: L('Qashqadaryo viloyati', 'Kashkadarya Region', 'Кашкадарьинская область'),
    center: L('Qarshi', 'Karshi', 'Карши'),
    lon: 65.79,
    lat: 38.86,
    tagline: L('Gaz-kimyo va energetika', 'Gas chemistry and energy', 'Газохимия и энергетика'),
    sectors: ['energetika', 'sanoat', 'qishloq'],
    highlights: LL(
      ['Sho‘rtan gaz-kimyo majmuasi', 'Tabiiy gaz zaxiralari', 'G‘allachilik va chorvachilik'],
      ['Shurtan gas chemical complex', 'Natural gas reserves', 'Grain farming and livestock'],
      ['Шуртанский газохимический комплекс', 'Запасы природного газа', 'Зерноводство и животноводство'],
    ),
    zones: LL([], [], []),
  },
  {
    slug: 'surxondaryo',
    name: L('Surxondaryo viloyati', 'Surkhandarya Region', 'Сурхандарьинская область'),
    center: L('Termiz', 'Termez', 'Термез'),
    lon: 67.28,
    lat: 37.4,
    tagline: L('Janubiy savdo darvozasi', 'The southern trade gateway', 'Южные торговые ворота'),
    sectors: ['logistika', 'qishloq', 'yashil'],
    highlights: LL(
      ['Termiz — Afg‘oniston va Janubiy Osiyo yo‘nalishidagi savdo markazi', 'Erta pishar meva-sabzavotlar', 'Quyosh energetikasi salohiyati'],
      ['Termez — a trade hub towards Afghanistan and South Asia', 'Early-season fruit and vegetables', 'Solar energy potential'],
      ['Термез — торговый центр на направлении Афганистана и Южной Азии', 'Ранние фрукты и овощи', 'Потенциал солнечной энергетики'],
    ),
    zones: LL([], [], []),
  },
  {
    slug: 'jizzax',
    name: L('Jizzax viloyati', 'Jizzakh Region', 'Джизакская область'),
    center: L('Jizzax', 'Jizzakh', 'Джизак'),
    lon: 67.84,
    lat: 40.12,
    tagline: L('Sanoat zonasi va qurilish materiallari', 'Industrial zone and construction materials', 'Промышленная зона и стройматериалы'),
    sectors: ['sanoat', 'qurilish', 'qishloq'],
    highlights: LL(
      ['Erkin iqtisodiy zona va sanoat maydonlari', 'Qurilish materiallari ishlab chiqarish', 'Toshkent–Samarqand yo‘lagida joylashuv'],
      ['Free economic zone and industrial sites', 'Construction materials production', 'Located on the Tashkent–Samarkand corridor'],
      ['Свободная экономическая зона и промплощадки', 'Производство строительных материалов', 'Расположение на коридоре Ташкент–Самарканд'],
    ),
    zones: LL(['Jizzax EIZ'], ['Jizzakh FEZ'], ['СЭЗ «Джизак»']),
  },
  {
    slug: 'sirdaryo',
    name: L('Sirdaryo viloyati', 'Syrdarya Region', 'Сырдарьинская область'),
    center: L('Guliston', 'Gulistan', 'Гулистан'),
    lon: 68.78,
    lat: 40.49,
    tagline: L('Energetika va agrosanoat', 'Energy and agribusiness', 'Энергетика и агропромышленность'),
    sectors: ['energetika', 'qishloq'],
    highlights: LL(
      ['Sirdaryo issiqlik elektr stansiyasi', 'Paxta va g‘allachilik klasterlari', 'Poytaxtga yaqin logistika'],
      ['Syrdarya thermal power plant', 'Cotton and grain clusters', 'Logistics close to the capital'],
      ['Сырдарьинская ТЭС', 'Хлопковые и зерновые кластеры', 'Логистика рядом со столицей'],
    ),
    zones: LL([], [], []),
  },
  {
    slug: 'xorazm',
    name: L('Xorazm viloyati', 'Khorezm Region', 'Хорезмская область'),
    center: L('Urganch', 'Urgench', 'Ургенч'),
    lon: 60.63,
    lat: 41.55,
    tagline: L('Turizm va agrosanoat', 'Tourism and agribusiness', 'Туризм и агропромышленность'),
    sectors: ['xizmatlar', 'qishloq'],
    highlights: LL(
      ['Xiva — xalqaro turizm markazi', 'Sholichilik va qayta ishlash', 'Turkmaniston bilan chegaradosh savdo'],
      ['Khiva — an international tourism centre', 'Rice growing and processing', 'Cross-border trade with Turkmenistan'],
      ['Хива — международный туристический центр', 'Рисоводство и переработка', 'Приграничная торговля с Туркменистаном'],
    ),
    zones: LL(['Hazorasp EIZ'], ['Khazarasp FEZ'], ['СЭЗ «Хазарасп»']),
  },
  {
    slug: 'qoraqalpogiston',
    name: L('Qoraqalpog‘iston Respublikasi', 'Republic of Karakalpakstan', 'Республика Каракалпакстан'),
    center: L('Nukus', 'Nukus', 'Нукус'),
    lon: 59.6,
    lat: 42.46,
    tagline: L('Yashil energetika va kimyo sanoati', 'Green energy and chemicals', 'Зелёная энергетика и химическая промышленность'),
    sectors: ['yashil', 'sanoat', 'qishloq'],
    highlights: LL(
      ['Shamol energetikasi uchun yuqori salohiyat', 'Kimyo sanoati (soda ishlab chiqarish)', 'Keng yer resurslari'],
      ['High wind energy potential', 'Chemical industry (soda ash production)', 'Abundant land resources'],
      ['Высокий потенциал ветроэнергетики', 'Химическая промышленность (производство соды)', 'Обширные земельные ресурсы'],
    ),
    zones: LL([], [], []),
  },
]

export const regionBySlug = (slug: string) => regions.find((r) => r.slug === slug)
