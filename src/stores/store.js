import { reactive, computed, watch } from 'vue'
import { kvGet, kvSet } from './db'
import { uid } from '../utils/id'
import { siteConfig } from '../config/site'

const KEY = 'data-v3'
const DATA_KEYS = ['products', 'categories', 'packagings', 'portfolio', 'faqs', 'testimonials', 'profile']

function seed() {
  const mk = (name) => ({ id: uid(), name })
  const categories = ['Samir dan Medali', 'Plakat', 'Souvenir', 'Selempang', 'Pin'].map(mk)
  const packagings = ['Paper bag', 'Box mika', 'Box beludru', 'Box beludru mini', 'Box kayu', 'Box kertas', 'Plastik OPP'].map(mk)
  const cid = (n) => categories.find((c) => c.name === n).id
  const pid = (n) => packagings.find((c) => c.name === n).id
  const S = 'Samir dan Medali'
  // Kategori "Pin" sengaja kosong (uji tampilan kategori tanpa produk).
  const rows = [
    ['Medali Wisuda Logam', S, 'Box beludru mini', 15000, 25000], ['Medali Juara Emas', S, 'Box beludru mini', 18000, 30000],
    ['Medali Akrilik Custom', S, 'Plastik OPP', 12000, 20000], ['Samir Wisuda Satin', S, 'Plastik OPP', 20000, 0],
    ['Samir Wisuda Beludru', S, 'Plastik OPP', 35000, 50000], ['Selempang Juara Lomba', 'Selempang', 'Plastik OPP', 30000, 0],
    ['Plakat Akrilik', 'Plakat', 'Box kertas', 85000, 150000], ['Plakat Kayu', 'Plakat', 'Box kayu', 120000, 200000],
    ['Plakat Kayu Ukir', 'Plakat', 'Box kayu', 150000, 250000], ['Plakat Kaca Etching', 'Plakat', 'Box beludru', 175000, 300000],
    ['Plakat Penghargaan Logam', 'Plakat', 'Box beludru', 160000, 280000], ['Plakat Mini Seminar', 'Plakat', 'Box kertas', 60000, 90000],
    ['Souvenir Mug Custom', 'Souvenir', 'Paper bag', 25000, 35000], ['Souvenir Tumbler Custom', 'Souvenir', 'Paper bag', 45000, 70000],
    ['Souvenir Gantungan Kunci', 'Souvenir', 'Plastik OPP', 5000, 12000], ['Souvenir Tote Bag KKN', 'Souvenir', 'Plastik OPP', 20000, 35000],
    ['Selempang Wisuda Satin', 'Selempang', 'Plastik OPP', 22000, 0], ['Souvenir Pulpen Logo', 'Souvenir', 'Plastik OPP', 4000, 8000], ['Souvenir Kotak Hadiah Wisuda', 'Souvenir', 'Box mika', 40000, 65000],
    ['Pin Peniti Wisuda Mini', 'Souvenir', 'Plastik OPP', 3000, 6000],
  ].map(([name, cat, pack, a, b], i) => ({
    id: uid(), name, categoryId: cid(cat), packagingId: pid(pack),
    priceMin: a, priceMax: b, minOrder: '', altText: name, description: `${name} custom dengan ukuran, nama, dan logo sesuai permintaan. Cocok untuk wisuda, KKN, seminar, maupun acara instansi. Hubungi kami untuk detail dan penawaran.`, photos: [], hidden: false, createdAt: Date.now() - i * 1000,
  }))
  const faq = (q, a, status, extra = {}) => ({ id: uid(), name: 'Anonim', q, a, status, hidden: false, createdAt: Date.now(), ...extra })
  const d = siteConfig.defaults
  return {
    products: rows, categories, packagings,
    portfolio: [
      ['Wisuda SMA Negeri 3 Bandung', 'Dokumentasi acara wisuda dan pengadaan samir serta medali.'], ['Wisuda Universitas Pasundan', 'Samir dan plakat untuk wisuda sarjana.'],
      ['Projek: Pemda DIY 2024', 'Plakat penghargaan untuk acara pemerintah daerah.'], ['Seminar Nasional 2024', 'Souvenir dan sertifikat untuk peserta seminar.'],
      ['KKN UGM Periode 2024', 'Tote bag dan pin untuk kegiatan KKN.'], ['Lomba Pramuka Tingkat Kota', 'Medali dan selempang juara lomba.'],
      ['Seminar Kesehatan Masyarakat', 'Plakat mini dan buku agenda.'], ['Penghargaan Karyawan Teladan', 'Plakat kaca etching untuk karyawan teladan.'],
    ].map(([title, description]) => ({ id: uid(), title, description, images: [], hidden: false })),
    faqs: [
      faq('Berapa lama proses pembuatan plakat custom?', 'Untuk plakat akrilik dan kayu memakan waktu 3–5 hari kerja setelah approval desain dan DP diterima.', 'approved'),
      faq('Apakah ada minimal pemesanan untuk samir dan medali wisuda?', 'Minimal pemesanan berbeda tiap produk. Kami tetap melayani satuan dengan penyesuaian biaya cetak.', 'approved'),
      faq('Apakah melayani pengiriman ke luar kota Yogya?', 'Untuk saat ini, pengiriman belum dapat dilakukan ke luar kota Yogyakarta.', 'approved'),
      faq('Apakah bisa memakai desain sendiri?', 'Bisa. Kirim file desain atau logo lewat WhatsApp untuk kami cek bersama.', 'approved'),
      faq('Bagaimana cara pembayarannya?', 'Pembayaran via transfer atau tunai; DP diminta saat pesanan dikonfirmasi.', 'approved'),
      faq('Apakah bisa melihat contoh produk langsung?', 'Bisa, silakan datang ke toko kami di Ambarrukmo, Yogyakarta.', 'approved'),
      faq('Apakah bisa cetak kop surat dan stempel?', 'Bisa. Kami juga menerima kalender, buku agenda undangan, dan stempel klise.', 'approved', { hidden: true }),
      faq('Apakah bisa pesan plakat dengan desain sendiri?', '', 'pending'),
      faq('Apakah ada garansi jika produk rusak saat pengiriman?', '', 'pending'),
      faq('Bisa minta contoh produk sebelum pesan dalam jumlah banyak?', '', 'pending'),
      faq('Jual followers murah, hubungi kami sekarang untuk harga spesial dan bonus.', '', 'rejected'),
      faq('tes tes pertanyaan 123 asdfgh qwerty bagus bagus bagus', '', 'rejected'),
    ],
    testimonials: [
      ['Rina Puspita', 'Plakat akrilik untuk acara wisuda kami hasilnya rapi dan sesuai desain. Pengerjaannya juga cepat.', 24, 'approved'],
      ['Budi Santoso', 'Pesan samir dan medali 50 pcs, semuanya datang tepat waktu dan packing aman. Pasti pesan lagi.', 18, 'approved'],
      ['Dewi Lestari', 'Plakat marmernya terlihat mewah. Admin ramah dan responsif saat revisi desain.', 12, 'approved'],
      ['Fajar Nugroho', 'Souvenir gantungan kunci custom untuk event kampus hasil cetaknya tajam dan warnanya pas.', 9, 'approved'],
      ['Siti Rahma', 'Harga bersahabat dan kualitas bagus. Sayang pengirimannya sedikit terlambat dari estimasi.', 3, 'approved', true],
      ['Andi Pratama', 'Selempang wisuda sesuai pesanan, bahan halus dan bordirnya rapi sekali.', 7, 'approved', true],
      ['Maya Kusuma', 'Produknya bagus banget, aku mau beli lagi besok. Terima kasih Citra Production!', 0, 'pending'],
      ['Hendra Wijaya', 'Medali custom untuk turnamen futsal kantor hasilnya melebihi ekspektasi kami.', 0, 'pending'],
      ['Lia Anggraini', 'Pelayanan cepat dan ramah, desain plakat dibantu sampai benar-benar sesuai.', 0, 'pending'],
      ['Rudi Hartono', 'Jual followers murah, hubungi kami sekarang untuk harga spesial dan bonus.', 0, 'rejected'],
      ['Anonim', 'tes tes testimoni 123 asdfgh qwerty bagus bagus bagus', 0, 'rejected'],
    ].map(([name, text, likes, status, hidden]) => ({ id: uid(), name, text, likes, status, hidden: !!hidden, productId: '', createdAt: Date.now() })),
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
export const approvedFaqs = computed(() => state.faqs.filter((f) => f.status === 'approved' && !f.hidden)) // tampil di publik
export const liveFaqs = computed(() => state.faqs.filter((f) => f.status === 'approved')) // termasuk yang disembunyikan (admin)
export const pendingFaqs = computed(() => state.faqs.filter((f) => f.status === 'pending'))
export const rejectedFaqs = computed(() => state.faqs.filter((f) => f.status === 'rejected'))
export const approvedTestimonials = computed(() => state.testimonials.filter((t) => t.status === 'approved' && !t.hidden))
export const liveTestimonials = computed(() => state.testimonials.filter((t) => t.status === 'approved'))
export const pendingTestimonials = computed(() => state.testimonials.filter((t) => t.status === 'pending'))
export const rejectedTestimonials = computed(() => state.testimonials.filter((t) => t.status === 'rejected'))
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
export function savePortfolio(data) {
  const clean = JSON.parse(JSON.stringify(data))
  const i = state.portfolio.findIndex((p) => p.id === clean.id)
  if (i >= 0) state.portfolio[i] = clean
  else state.portfolio.push({ ...clean, id: uid(), hidden: false })
}
export const removePortfolio = (id) => { state.portfolio = state.portfolio.filter((x) => x.id !== id) }

// ---------- FAQ (status: pending → approved | rejected; hidden = disembunyikan dari publik) ----------
const faqById = (id) => state.faqs.find((x) => x.id === id)
export const submitQuestion = ({ name = '', q }) => state.faqs.push({ id: uid(), name: name.trim() || 'Anonim', q: q.trim(), a: '', status: 'pending', hidden: false, createdAt: Date.now() })
export const approveFaq = (id, a) => { const f = faqById(id); if (f) { f.a = a.trim(); f.status = 'approved'; f.hidden = false } }
export const rejectFaq = (id) => { const f = faqById(id); if (f) f.status = 'rejected' }
export const restoreFaq = (id) => { const f = faqById(id); if (f) f.status = 'pending' }
export const toggleFaqHidden = (id) => { const f = faqById(id); if (f) f.hidden = !f.hidden }
export const removeFaq = (id) => { state.faqs = state.faqs.filter((x) => x.id !== id) }

// ---------- testimoni ----------
const tById = (id) => state.testimonials.find((x) => x.id === id)
export const submitTestimonial = ({ name = '', text, productId = '' }) => state.testimonials.push({ id: uid(), name: name.trim() || 'Anonim', text: text.trim(), productId, likes: 0, status: 'pending', hidden: false, createdAt: Date.now() })
export const approveTestimonial = (id) => { const t = tById(id); if (t) { t.status = 'approved'; t.hidden = false } }
export const rejectTestimonial = (id) => { const t = tById(id); if (t) t.status = 'rejected' }
export const restoreTestimonial = (id) => { const t = tById(id); if (t) t.status = 'pending' }
export const toggleTestimonialHidden = (id) => { const t = tById(id); if (t) t.hidden = !t.hidden }
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
