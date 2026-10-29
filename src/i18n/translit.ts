// O'zbek lotin -> o'zbek kirill transliteratsiyasi.
// Brend va xalqaro atamalar (BridgeUz, IT Park, Advisory...) o'zgarishsiz qoladi.

const KEEP = new Set([
  'BridgeUz', 'Advisory', 'Matching', 'Premium', 'Subscription', 'Market', 'entry', 'listing', 'Park',
  'Global', 'Companies', 'Local', 'Partners', 'Tier', 'shortlist', 'Executive', 'search', 'WhatsApp',
  'Telegram', 'Fintech', 'LLC', 'Co', 'GmbH',
])

const MAP: Record<string, string> = {
  a: 'а', b: 'б', c: 'ц', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'ҳ', i: 'и', j: 'ж', k: 'к', l: 'л',
  m: 'м', n: 'н', o: 'о', p: 'п', q: 'қ', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в', w: 'в', x: 'х',
  y: 'й', z: 'з', ŏ: 'ў', ğ: 'ғ', '’': 'ъ',
}
const VOWELS = 'aeiouŏ'

function convertWord(word: string): string {
  if (KEEP.has(word) || word.includes('@')) return word
  // IT, HR, ERP, MVP kabi qisqartmalar va BridgeUz kabi ichida bosh harfli so'zlar
  if (/^[A-Z]{2,}$/.test(word) || /^[A-Z]?[a-z]+[A-Z]/.test(word)) return word

  const upperAll = word.length > 1 && word === word.toUpperCase()
  const capital = word[0] !== word[0].toLowerCase()
  const w = word
    .toLowerCase()
    .replace(/o[‘'`ʻ]/g, 'ŏ')
    .replace(/g[‘'`ʻ]/g, 'ğ')
    .replace(/ʼ/g, '’')

  let out = ''
  for (let i = 0; i < w.length; i++) {
    const c = w[i]
    const n = w[i + 1]
    if (c === 's' && n === 'h') { out += 'ш'; i++; continue }
    if (c === 'c' && n === 'h') { out += 'ч'; i++; continue }
    if (c === 't' && n === 's' && (w[i + 2] === 'i' || w[i + 2] === 'e')) { out += 'ц'; i++; continue }
    if (c === 'y' && n === 'o') { out += 'ё'; i++; continue }
    if (c === 'y' && n === 'u') { out += 'ю'; i++; continue }
    if (c === 'y' && n === 'a') { out += 'я'; i++; continue }
    if (c === 'y' && n === 'e') { out += 'е'; i++; continue }
    if (c === 'e' && (i === 0 || VOWELS.includes(w[i - 1]))) { out += 'э'; continue }
    out += MAP[c] ?? c
  }

  if (upperAll) return out.toUpperCase()
  if (capital) return out[0].toUpperCase() + out.slice(1)
  return out
}

// Tirnoq faqat harflar orasida bo'lsa so'zga tegishli (o‘, g‘, ma’lumot)
const WORD = /[A-Za-z]+(?:[‘’'`ʻʼ][A-Za-z]+)*/g

export function toCyrillic(text: string): string {
  return text.replace(WORD, convertWord)
}
