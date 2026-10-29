# BridgeUz — frontend

**Global Companies. Local Partners.**
O‘zbekistonga kiruvchi xorijiy kompaniyalarni ishonchli mahalliy hamkorlar bilan bog‘lovchi platforma.

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ ga production build
npm run lint
```

Stack: React 19 + TypeScript + Vite, `react-router-dom` (marshrutlar), `lucide-react` (ikonlar),
Montserrat + Inter shriftlari (`@fontsource`, offlayn ishlaydi). CSS — oddiy CSS, dizayn tokenlari
`src/styles/base.css` da.

## Sahifalar

| Marshrut | Sahifa |
|---|---|
| `/` | Bosh sahifa: hero + qidiruv, muammo, bozor statistikasi, yechim, qanday ishlaydi, auditoriya, taqqoslash |
| `/hududlar`, `/hududlar/:slug` | Interaktiv O‘zbekiston xaritasi, 14 hudud, sohalar va EIZ |
| `/imkoniyatlar` | Investitsiya loyihalari (soha / hudud / hajm filtrlari) |
| `/kompaniyalar`, `/kompaniyalar/:id` | Mahalliy provayderlar katalogi, profil, 3 tagacha taqqoslash |
| `/xizmatlar` | Advisory, Matching, Market entry, provayder toifalari, FAQ |
| `/narxlar` | Investorlar va provayderlar uchun tariflar |
| `/biz-haqimizda` | Missiya, roadmap, asoschi |
| `/murojaat` | 4 bosqichli murojaat formasi (investor / provayder) |
| `/qidiruv?q=` | Hudud, loyiha va kompaniyalar bo‘yicha umumiy qidiruv |

### Admin panel — `/admin`

Demo kirish: **admin@bridgeuz.uz / admin123** (kirish sahifasida "To‘ldirish" tugmasi bor).

| Marshrut | Bo‘lim |
|---|---|
| `/admin` | Bosh panel: KPI, haftalik murojaatlar grafigi, savdo voronkasi, tekshiruv kutayotganlar |
| `/admin/murojaatlar` | Murojaatlar: holat tablari, qidiruv, tafsilot oynasi (holat, mas’ul xodim, izohlar) |
| `/admin/kompaniyalar` | Qo‘shish / tahrirlash / o‘chirish, Tekshirilgan · Premium · Saytda kalitlari |
| `/admin/loyihalar` | Investitsiya loyihalari, "Tanlangan" va "Ochiq" kalitlari |
| `/admin/hududlar` | Hudud tavsifi, sohalar, afzalliklar, EIZ |
| `/admin/moliya` | Tushumlar, xizmat turlari va oylar bo‘yicha taqsimot, to‘lovlar holati |

Sayt va admin bitta ma’lumotlar omboridan (`src/lib/store.tsx`) foydalanadi: admin'dagi o‘zgarish
saytda darhol ko‘rinadi, saytdagi murojaat formasi esa admin'ga "Yangi" murojaat bo‘lib tushadi.
Hozircha ma’lumotlar brauzerning `localStorage` xotirasida saqlanadi; "Demo ma’lumotlarni tiklash"
tugmasi boshlang‘ich holatga qaytaradi. Kirish faqat frontend darajasida — haqiqiy himoya backend
autentifikatsiyasi bilan qo‘shiladi.

Filtrlar URL parametrlarida saqlanadi (`?toifa=logistika&hudud=fargona`) — havolani ulashish mumkin.

## Ma’lumotlar

`src/data/` dagi fayllar:

- `content.ts` — taqdimotdagi statistika, narxlar, roadmap (haqiqiy ma’lumot);
- `regions.ts`, `taxonomy.ts` — hududlar, sohalar va xizmat toifalari;
- `companies.ts`, `opportunities.ts` — **demo ma’lumotlar**, backend ulanganda API bilan almashtiriladi.

Murojaat formasi hozircha faqat frontendda ishlaydi (`src/pages/Apply.tsx`, `submit` funksiyasi —
`POST /api/applications` ulanadigan joy). Til almashtirgich: UZ tayyor, EN/RU — keyingi bosqich.
