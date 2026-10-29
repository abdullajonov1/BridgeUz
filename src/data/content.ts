import type { DictKey } from '../i18n/dict/uz'

export const marketStats: { value: string; valueKey?: DictKey; label: DictKey; note: DictKey }[] = [
  { value: '+20,2%', label: 'content.stat1', note: 'content.stat1note' },
  { value: '16 685 ta', valueKey: 'content.stat2val', label: 'content.stat2', note: 'content.stat2note' },
  { value: '71,6%', label: 'content.stat3', note: 'content.stat3note' },
]

export const foreignEnterprises = [
  { year: '2020', value: 9302 },
  { year: '2021', value: 11005 },
  { year: '2022', value: 14046 },
  { year: '2023', value: 14953 },
  { year: '2024', value: 13880 },
  { year: '2025', value: 16685, note: 'chart.note.jul' as DictKey },
]

export const problems: { title: DictKey; items: DictKey[] }[] = [
  { title: 'content.p1.title', items: ['content.p1.i1', 'content.p1.i2', 'content.p1.i3'] },
  { title: 'content.p2.title', items: ['content.p2.i1', 'content.p2.i2', 'content.p2.i3'] },
  { title: 'content.p3.title', items: ['content.p3.i1', 'content.p3.i2', 'content.p3.i3'] },
]

export const steps: { title: DictKey; text: DictKey }[] = [
  { title: 'content.step1.title', text: 'content.step1.text' },
  { title: 'content.step2.title', text: 'content.step2.text' },
  { title: 'content.step3.title', text: 'content.step3.text' },
  { title: 'content.step4.title', text: 'content.step4.text' },
  { title: 'content.step5.title', text: 'content.step5.text' },
]

export type Support = 'full' | 'partial' | 'none'

export const comparison: {
  columns: { name: DictKey; hint: DictKey }[]
  rows: { label: DictKey; values: Support[] }[]
} = {
  columns: [
    { name: 'content.vs.c1', hint: 'content.vs.c1h' },
    { name: 'content.vs.c2', hint: 'content.vs.c2h' },
    { name: 'content.vs.c3', hint: 'content.vs.c3h' },
    { name: 'content.vs.c4', hint: 'content.vs.c4h' },
  ],
  rows: [
    { label: 'content.vs.r1', values: ['full', 'partial', 'none', 'full'] },
    { label: 'content.vs.r2', values: ['partial', 'full', 'full', 'full'] },
    { label: 'content.vs.r3', values: ['partial', 'full', 'partial', 'full'] },
    { label: 'content.vs.r4', values: ['full', 'full', 'none', 'full'] },
    { label: 'content.vs.r5', values: ['none', 'partial', 'partial', 'full'] },
    { label: 'content.vs.r6', values: ['none', 'full', 'none', 'full'] },
    { label: 'content.vs.r7', values: ['none', 'partial', 'none', 'full'] },
  ],
}

export interface Plan {
  id: string
  name: string
  subtitle: DictKey
  price: string
  unit: DictKey
  payer: DictKey
  features: DictKey[]
  tone: 'blue' | 'green' | 'amber' | 'violet'
  stage: DictKey
  popular?: boolean
}

export const investorPlans: Plan[] = [
  {
    id: 'advisory',
    name: 'Advisory',
    subtitle: 'content.plan.advisory.sub',
    price: '$500 – $5 000',
    unit: 'content.plan.advisory.unit',
    payer: 'content.plan.advisory.payer',
    features: ['content.plan.advisory.f1', 'content.plan.advisory.f2', 'content.plan.advisory.f3', 'content.plan.advisory.f4'],
    tone: 'blue',
    stage: 'content.plan.stage1',
  },
  {
    id: 'matching',
    name: 'Matching',
    subtitle: 'content.plan.matching.sub',
    price: '3% – 10%',
    unit: 'content.plan.matching.unit',
    payer: 'content.plan.matching.payer',
    features: ['content.plan.matching.f1', 'content.plan.matching.f2', 'content.plan.matching.f3', 'content.plan.matching.f4'],
    tone: 'green',
    stage: 'content.plan.stage1',
    popular: true,
  },
]

export const providerPlans: Plan[] = [
  {
    id: 'subscription',
    name: 'Subscription',
    subtitle: 'content.plan.sub.sub',
    price: '$50 – $300',
    unit: 'content.plan.sub.unit',
    payer: 'content.plan.sub.payer',
    features: ['content.plan.sub.f1', 'content.plan.sub.f2', 'content.plan.sub.f3', 'content.plan.sub.f4'],
    tone: 'violet',
    stage: 'content.plan.stage2',
  },
  {
    id: 'premium',
    name: 'Premium listing',
    subtitle: 'content.plan.prem.sub',
    price: '$300 – $2 000',
    unit: 'content.plan.prem.unit',
    payer: 'content.plan.prem.payer',
    features: ['content.plan.prem.f1', 'content.plan.prem.f2', 'content.plan.prem.f3', 'content.plan.prem.f4'],
    tone: 'amber',
    stage: 'content.plan.stage2',
    popular: true,
  },
]

export const roadmap: { title: DictKey; period: DictKey; items: DictKey[]; result: DictKey }[] = [
  {
    title: 'content.rm.1.title',
    period: 'content.rm.1.period',
    items: ['content.rm.1.i1', 'content.rm.1.i2', 'content.rm.1.i3'],
    result: 'content.rm.1.result',
  },
  {
    title: 'content.rm.2.title',
    period: 'content.rm.2.period',
    items: ['content.rm.2.i1', 'content.rm.2.i2', 'content.rm.2.i3'],
    result: 'content.rm.2.result',
  },
  {
    title: 'content.rm.3.title',
    period: 'content.rm.3.period',
    items: ['content.rm.3.i1', 'content.rm.3.i2', 'content.rm.3.i3'],
    result: 'content.rm.3.result',
  },
  {
    title: 'content.rm.4.title',
    period: 'content.rm.4.period',
    items: ['content.rm.4.i1', 'content.rm.4.i2', 'content.rm.4.i3', 'content.rm.4.i4'],
    result: 'content.rm.4.result',
  },
]

export const faqs: { q: DictKey; a: DictKey }[] = [
  { q: 'content.faq.1.q', a: 'content.faq.1.a' },
  { q: 'content.faq.2.q', a: 'content.faq.2.a' },
  { q: 'content.faq.3.q', a: 'content.faq.3.a' },
  { q: 'content.faq.4.q', a: 'content.faq.4.a' },
  { q: 'content.faq.5.q', a: 'content.faq.5.a' },
]
