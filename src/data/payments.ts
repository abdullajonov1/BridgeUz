// Demo ma'lumotlar — backend ulanganda API'dan keladi.
export type PaymentType = 'advisory' | 'matching' | 'premium' | 'subscription'
export type PaymentStatus = 'paid' | 'pending' | 'overdue'

export interface Payment {
  id: string
  date: string
  payer: string
  type: PaymentType
  /** USD */
  amount: number
  status: PaymentStatus
  note: string
}

export const paymentTypeLabels: Record<PaymentType, string> = {
  advisory: 'Advisory',
  matching: 'Matching komissiyasi',
  premium: 'Premium listing',
  subscription: 'Subscription',
}

export const paymentStatusMeta: Record<PaymentStatus, { label: string; tone: string }> = {
  paid: { label: 'To‘langan', tone: 'green' },
  pending: { label: 'Kutilmoqda', tone: 'amber' },
  overdue: { label: 'Muddati o‘tgan', tone: 'red' },
}

export const paymentsSeed: Payment[] = [
  { id: 'p-2001', date: '2026-10-27', payer: 'Nordbyte AB', type: 'matching', amount: 4200, status: 'paid', note: 'Digital Oasis bilan bitim, 6%' },
  { id: 'p-2002', date: '2026-10-20', payer: 'Polfruit Sp. z o.o.', type: 'advisory', amount: 800, status: 'paid', note: 'Namangan bo‘yicha hisobot' },
  { id: 'p-2003', date: '2026-10-08', payer: 'HR Pro Uz', type: 'premium', amount: 600, status: 'paid', note: 'Yillik paket' },
  { id: 'p-2004', date: '2026-10-05', payer: 'Lex Partners Tashkent', type: 'premium', amount: 1500, status: 'paid', note: 'Yillik paket' },
  { id: 'p-2005', date: '2026-10-01', payer: 'Digital Oasis', type: 'subscription', amount: 200, status: 'paid', note: 'Oktabr' },
  { id: 'p-2006', date: '2026-10-01', payer: 'Silk Road Advisory', type: 'subscription', amount: 150, status: 'paid', note: 'Oktabr' },
  { id: 'p-2007', date: '2026-10-28', payer: 'Maison Voyage SAS', type: 'advisory', amount: 1500, status: 'pending', note: 'Xiva mehmonxona tahlili' },
  { id: 'p-2008', date: '2026-10-25', payer: 'Tianfeng Wind Equipment Ltd.', type: 'advisory', amount: 5000, status: 'pending', note: 'Bozorga kirish hisoboti' },
  { id: 'p-2009', date: '2026-09-26', payer: 'Sakura Hospitality KK', type: 'advisory', amount: 1200, status: 'paid', note: 'Samarqand bozor tahlili' },
  { id: 'p-2010', date: '2026-09-15', payer: 'Agro Export', type: 'premium', amount: 900, status: 'paid', note: 'Yillik paket' },
  { id: 'p-2011', date: '2026-09-01', payer: 'Logistics LLC', type: 'subscription', amount: 100, status: 'overdue', note: 'Sentabr' },
  { id: 'p-2012', date: '2026-09-01', payer: 'Digital Oasis', type: 'subscription', amount: 200, status: 'paid', note: 'Sentabr' },
  { id: 'p-2013', date: '2026-08-20', payer: 'Asaka Components', type: 'premium', amount: 2000, status: 'paid', note: 'Yillik paket' },
  { id: 'p-2014', date: '2026-08-12', payer: 'Market Insight', type: 'subscription', amount: 100, status: 'paid', note: 'Avgust' },
]
