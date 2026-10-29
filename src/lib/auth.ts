// Demo kirish — faqat frontend uchun. Haqiqiy himoya backend'dagi autentifikatsiya bilan bo'ladi.
export const DEMO_EMAIL = 'admin@bridgeuz.uz'
export const DEMO_PASSWORD = 'admin123'

const KEY = 'bridgeuz-admin-session'
let memorySession: string | null = null

export interface AdminUser {
  name: string
  email: string
  role: string
}

export function getSession(): AdminUser | null {
  let raw = memorySession
  try {
    raw = sessionStorage.getItem(KEY) ?? memorySession
  } catch {
    // sessionStorage yopiq — xotiradagi qiymat ishlatiladi
  }
  return raw ? (JSON.parse(raw) as AdminUser) : null
}

export function login(email: string, password: string): AdminUser | null {
  if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) return null
  const user: AdminUser = { name: 'Oydinoy Abdulazizova', email: DEMO_EMAIL, role: 'Administrator' }
  memorySession = JSON.stringify(user)
  try {
    sessionStorage.setItem(KEY, memorySession)
  } catch {
    // e'tiborsiz qoldiramiz
  }
  return user
}

export function logout() {
  memorySession = null
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // e'tiborsiz qoldiramiz
  }
}
