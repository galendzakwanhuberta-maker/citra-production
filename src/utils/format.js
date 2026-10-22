export const rupiah = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID')
export function priceLabel(p) {
  const min = Number(p?.priceMin) || 0, max = Number(p?.priceMax) || 0
  if (!min && !max) return 'Hubungi kami'
  if (min && max > min) return `${rupiah(min)} - ${rupiah(max)}`
  return rupiah(min || max)
}
export function formatPhone(n = '') {
  const d = String(n).replace(/\D/g, '')
  return d.startsWith('62') ? `+62 ${d.slice(2)}` : d ? `+${d}` : ''
}
export function normalizeWa(v = '') {
  let d = String(v).replace(/\D/g, '')
  if (d.startsWith('0')) d = '62' + d.slice(1)
  return d
}
export function pageItems(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const nums = [...new Set([1, 2, total, current - 1, current, current + 1])].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  const out = []
  nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) out.push('…'); out.push(n) })
  return out
}
export const slug = (s = '') => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
