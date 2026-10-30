import { reactive, computed, watch } from 'vue'
import { kvGet, kvSet } from './db'
import { uid } from '../utils/id'
import { siteConfig } from '../config/site'

const KEY = 'data-v2'
const DATA_KEYS = ['products', 'categories', 'packagings', 'portfolio', 'faqs', 'testimonials', 'profile']

function seed() {
  const mk = (name) => ({ id: uid(), name })
  const categories = ['Samir dan Medali', 'Plakat', 'Souvenir', 'Pin'].map(mk)
  const packagings = ['Paper bag', 'Box mika', 'Box beludru', 'Box beludru mini', 'Box kayu', 'Box kertas', 'Plastik OPP'].map(mk)
  const cid = (n) => categories.find((c) => c.name === n).id
  const pid = (n) => packagings.find((c) => c.name === n).id
  const S = 'Samir dan Medali'
  // Kategori "Pin" sengaja kosong (uji tampilan kategori tanpa produk).
  const rows = [
    ['Medali Wisuda Logam', S, 'Box beludru mini', 15000, 25000], ['Medali Juara Emas', S, 'Box beludru mini', 18000, 30000],
    ['Medali Akrilik Custom', S, 'Plastik OPP', 12000, 20000], ['Samir Wisuda Satin', S, 'Plastik OPP', 20000, 0],
    ['Samir Wisuda Beludru', S, 'Plastik OPP', 35000, 50000], ['Samir Juara Lomba', S, 'Plastik OPP', 30000, 0],
    ['Plakat Akrilik', 'Plakat', 'Box kertas', 85000, 150000], ['Plakat Kayu', 'Plakat', 'Box kayu', 120000, 200000],
    ['Plakat Kayu Ukir', 'Plakat', 'Box kayu', 150000, 250000], ['Plakat Kaca Etching', 'Plakat', 'Box beludru', 175000, 300000],
    ['Plakat Penghargaan Logam', 'Plakat', 'Box beludru', 160000, 280000], ['Plakat Mini Seminar', 'Plakat', 'Box kertas', 60000, 90000],
    ['Souvenir Mug Custom', 'Souvenir', 'Paper bag', 25000, 35000], ['Souvenir Tumbler Custom', 'Souvenir', 'Paper bag', 45000, 70000],
    ['Souvenir Gantungan Kunci', 'Souvenir', 'Plastik OPP', 5000, 12000], ['Souvenir Tote Bag KKN', 'Souvenir', 'Plastik OPP', 20000, 35000],
    ['Souvenir Pulpen Logo', 'Souvenir', 'Plastik OPP', 4000, 8000], ['Souvenir Kotak Hadiah Wisuda', 'Souvenir', 'Box mika', 40000, 65000],
    ['Souvenir Buku Agenda Seminar', 'Souvenir', 'Paper bag', 18000, 30000], ['Pin Peniti Wisuda Mini', 'Souvenir', 'Plastik OPP', 3000, 6000],
  ].map(([name, cat, pack, a, b], i) => ({
    id: uid(), name, categoryId: cid(cat), packagingId: pid(pack),
    priceMin: a, priceMax: b, minOrder: '', altText: name, photos: [], hidden: false, createdAt: Date.now() - i * 1000,
  }))
  const faq = (q, a, status) => ({ id: uid(), q, a, status, createdAt: Date.now() })
  const d = siteConfig.defaults
  return {
    products: rows, categories, packagings,
    portfolio: ['Wisuda SMA Negeri 3 Bandung', 'Projek: Pemda DIY 2024', 'Seminar Nasional 2024', 'KKN UGM Periode 2024', 'Wisuda Universitas Swasta Yogyakarta', 'Lomba Pramuka Tingkat Kota', 'Seminar Kesehatan Masyarakat', 'Penghargaan Karyawan Teladan'].map((title) => ({ id: uid(), title, src: '', hidden: false })),
    faqs: [
      faq('Apakah melayani pengiriman ke luar kota Yogya?', 'Untuk saat ini, pengiriman belum dapat dilakukan ke luar kota Yogyakarta.', 'approved'),
      faq('Berapa lama waktu pengerjaan pesanan?', 'Rata-rata 3–7 hari kerja, tergantung jenis dan jumlah produk.', 'approved'),
      faq('Apakah bisa memakai desain sendiri?', 'Bisa. Kirim desain kamu lewat WhatsApp untuk kami cek bersama.', 'approved'),
      faq('Apakah ada minimal pemesanan?', 'Minimal pesanan berbeda tiap produk. Tanyakan lewat WhatsApp.', 'approved'),
      faq('Bagaimana cara pembayarannya?', 'Pembayaran via transfer atau tunai; DP diminta saat pesanan dikonfirmasi.', 'approved'),
      faq('Apakah bisa melihat contoh produk langsung?', 'Bisa, silakan datang ke toko kami di Ambarrukmo, Yogyakarta.', 'approved'),
      faq('Apakah bisa cetak kop surat dan stempel?', 'Bisa. Kami juga menerima kalender, buku agenda undangan, dan stempel klise.', 'approved'),
      faq('Apakah ada diskon untuk pemesanan banyak?', '', 'pending'),
      faq('Apakah bisa kirim ke Surabaya?', '', 'pending'),
      faq('Bisakah memesan kurang dari 10 buah?', '', 'pending'),
    ],
    testimonials: [
      { id: uid(), name: 'ahmad ahsin', text: 'Produknya bagus banget, aku mau pesan lagi besok.', likes: 24, status: 'approved', createdAt: Date.now() },
      { id: uid(), name: 'Rina', text: 'Pengerjaan cepat dan hasilnya rapi. Recommended!', likes: 9, status: 'approved', createdAt: Date.now() },
    ],
    profile: {
      title: 'Citra Production',
      description: 'Menyediakan berbagai jenis cinderamata untuk wisuda, KKN, dan Seminar. Juga menerima cetak kop Surat, Kalender, Buku Agenda Undangan, Stempel Klise, dan Warna (sistem komputer)',
      heroImage: '', whatsapp: d.whatsappNumber, email: d.email, instagram: d.instagram, address: d.address, mapsUrl: '', links: [],
    },
  }
}

export const state = reactive({ ready: false, saveError: false, ...seed() })

let timer
async function persist() {
  try { await kvSet(KEY, JSON.parse(JSON.stringify(Object.fromEntries(DATA_KEYS.map((k) => [k, state[k]]))))); state.saveError = false }
  catch { state.saveError = true }
}
export async function initStore() {
  try {
    const saved = await kvGet(KEY)
    if (saved) for (const k of DATA_KEYS) if (saved[k] !== undefined) state[k] = k === 'profile' ? { ...state.profile, ...saved[k] } : saved[k]
  } catch { state.saveError = true }
  state.ready = true
  watch(() => DATA_KEYS.map((k) => state[k]), () => { clearTimeout(timer); timer = setTimeout(persist, 250) }, { deep: true })
}
export async function resetAll() { Object.assign(state, seed()); await persist() }

// ---------- getter ----------
export const visibleProducts = computed(() => state.products.filter((p) => !p.hidden))
export const visiblePortfolio = computed(() => state.portfolio.filter((p) => !p.hidden))
export const approvedFaqs = computed(() => state.faqs.filter((f) => f.status === 'approved'))
export const pendingFaqs = computed(() => state.faqs.filter((f) => f.status === 'pending'))
export const approvedTestimonials = computed(() => state.testimonials.filter((t) => t.status === 'approved'))
export const pendingTestimonials = computed(() => state.testimonials.filter((t) => t.status === 'pending'))
export const nameOf = (list, id) => state[list].find((x) => x.id === id)?.name || ''
export const countProducts = (field, id, onlyVisible = false) =>
  (onlyVisible ? visibleProducts.value : state.products).filter((p) => p[field] === id).length
export const coverOf = (p) => p.photos.find((x) => !x.hidden)?.src || ''

// ---------- produk ----------
export function saveProduct(data) {
  const clean = JSON.parse(JSON.stringify(data))
  const i = state.products.findIndex((p) => p.id === clean.id)
  if (i >= 0) state.products[i] = clean
  else state.products.unshift({ ...clean, id: uid(), createdAt: Date.now() })
}
export const removeProduct = (id) => { state.products = state.products.filter((p) => p.id !== id) }
export const toggleProduct = (id) => { const p = state.products.find((x) => x.id === id); if (p) p.hidden = !p.hidden }

// ---------- kategori & packaging ----------
function listOps(list, field) {
  const dup = (name, exceptId) => state[list].some((x) => x.id !== exceptId && x.name.toLowerCase() === name.toLowerCase())
  return {
    add(name) { name = name.trim(); if (!name) return 'Nama tidak boleh kosong.'; if (dup(name)) return 'Nama sudah dipakai.'; state[list].push({ id: uid(), name }); return '' },
    rename(id, name) { name = name.trim(); if (!name) return 'Nama tidak boleh kosong.'; if (dup(name, id)) return 'Nama sudah dipakai.'; state[list].find((x) => x.id === id).name = name; return '' },
    remove(id) { state[list] = state[list].filter((x) => x.id !== id); state.products.forEach((p) => { if (p[field] === id) p[field] = '' }) },
  }
}
export const categoryOps = listOps('categories', 'categoryId')
export const packagingOps = listOps('packagings', 'packagingId')

// ---------- portofolio ----------
export const addPortfolio = (src, title = 'Projek baru') => state.portfolio.push({ id: uid(), title, src, hidden: false })
export const updatePortfolio = (id, patch) => Object.assign(state.portfolio.find((x) => x.id === id) || {}, patch)
export const removePortfolio = (id) => { state.portfolio = state.portfolio.filter((x) => x.id !== id) }

// ---------- FAQ ----------
export const submitQuestion = (q) => state.faqs.push({ id: uid(), q: q.trim(), a: '', status: 'pending', createdAt: Date.now() })
export const approveFaq = (id, a) => { const f = state.faqs.find((x) => x.id === id); if (f) { f.a = a.trim(); f.status = 'approved' } }
export const removeFaq = (id) => { state.faqs = state.faqs.filter((x) => x.id !== id) }

// ---------- testimoni ----------
export const submitTestimonial = ({ name, text }) => state.testimonials.push({ id: uid(), name: name.trim() || 'Pelanggan', text: text.trim(), likes: 0, status: 'pending', createdAt: Date.now() })
export const approveTestimonial = (id) => { const t = state.testimonials.find((x) => x.id === id); if (t) t.status = 'approved' }
export const removeTestimonial = (id) => { state.testimonials = state.testimonials.filter((x) => x.id !== id) }
// Like disimpan per-browser (belum sinkron antar pengunjung sampai ada backend).
const LK = 'citra-liked'
const liked = () => { try { return JSON.parse(localStorage.getItem(LK) || '[]') } catch { return [] } }
export const likedState = reactive({ ids: liked() })
export function toggleLike(id) {
  const t = state.testimonials.find((x) => x.id === id); if (!t) return
  const on = likedState.ids.includes(id)
  t.likes = Math.max(0, (t.likes || 0) + (on ? -1 : 1))
  likedState.ids = on ? likedState.ids.filter((x) => x !== id) : [...likedState.ids, id]
  try { localStorage.setItem(LK, JSON.stringify(likedState.ids)) } catch {}
}

// ---------- profil / kontak ----------
export const updateProfile = (patch) => Object.assign(state.profile, patch)
