export type CompanyPlan = 'free' | 'subscription' | 'premium'

export const companyPlans: CompanyPlan[] = ['free', 'subscription', 'premium']

export interface PlanState {
  plan?: CompanyPlan
  planUntil?: string
  premium?: boolean
  hidden?: boolean
}

export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function defaultPlanUntil(plan: CompanyPlan, from = todayISO()) {
  if (plan === 'free') return undefined
  const d = new Date(`${from}T12:00:00`)
  if (Number.isNaN(d.getTime())) return undefined
  if (plan === 'subscription') d.setMonth(d.getMonth() + 1)
  else d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

export function companyPlan(c: PlanState): CompanyPlan {
  return c.plan ?? (c.premium ? 'premium' : 'free')
}

export function isPlanActive(c: PlanState) {
  const plan = companyPlan(c)
  if (plan === 'free') return true
  if (!c.planUntil) return true
  return c.planUntil >= todayISO()
}

export function isPlanOverdue(c: PlanState) {
  return companyPlan(c) !== 'free' && !isPlanActive(c)
}

export function isCompanyPublic(c: PlanState) {
  return !c.hidden && isPlanActive(c)
}

export function isPremiumListing(c: PlanState) {
  return companyPlan(c) === 'premium' && isPlanActive(c)
}

export function planTone(c: PlanState) {
  if (isPlanOverdue(c)) return 'red'
  const plan = companyPlan(c)
  if (plan === 'premium') return 'amber'
  if (plan === 'subscription') return 'violet'
  return 'gray'
}

export function applyPlan<T extends PlanState>(c: T, plan: CompanyPlan, planUntil?: string): T {
  const until = plan === 'free' ? undefined : planUntil || defaultPlanUntil(plan)
  const next = { ...c, plan, planUntil: until }
  return { ...next, premium: isPremiumListing(next) }
}

/** Jadvaldan tarifni almashtirish: faol muddat saqlanadi, o‘tgani yangilanadi. */
export function changePlan<T extends PlanState>(c: T, plan: CompanyPlan): T {
  if (plan === 'free') return applyPlan(c, 'free')
  const keep = companyPlan(c) !== 'free' && isPlanActive(c) ? c.planUntil : undefined
  return applyPlan(c, plan, keep)
}
