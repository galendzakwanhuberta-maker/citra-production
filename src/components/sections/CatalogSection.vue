<script setup>
import { ref, computed, watch } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import BaseButton from '../ui/BaseButton.vue'
import PaginationBar from '../ui/PaginationBar.vue'
import ProductCard from './ProductCard.vue'
import { state, visibleProducts, countProducts } from '../../stores/store'
import { useWhatsapp } from '../../composables/useWhatsapp'

const { waLink } = useWhatsapp()
const query = ref(''), searchOpen = ref(false), filterOpen = ref(false)
const category = ref('all'), packaging = ref('all'), sort = ref('new')
const view = ref(typeof window !== 'undefined' && window.innerWidth >= 900 ? 'grid' : 'list')
const page = ref(1)

const chips = computed(() => state.categories.map((c) => ({ ...c, n: countProducts('categoryId', c.id, true) })))
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = visibleProducts.value.filter((p) =>
    (category.value === 'all' || p.categoryId === category.value) &&
    (packaging.value === 'all' || p.packagingId === packaging.value) &&
    (!q || p.name.toLowerCase().includes(q) || (state.categories.find((c) => c.id === p.categoryId)?.name || '').toLowerCase().includes(q)))
  const by = { new: (a, b) => b.createdAt - a.createdAt, low: (a, b) => (a.priceMin || 0) - (b.priceMin || 0), high: (a, b) => (b.priceMin || 0) - (a.priceMin || 0) }
  return [...list].sort(by[sort.value])
})
const perPage = computed(() => (view.value === 'grid' ? 6 : 5))
const total = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)))
const paged = computed(() => filtered.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))
const filterActive = computed(() => packaging.value !== 'all' || sort.value !== 'new')
watch([query, category, packaging, sort, view], () => { page.value = 1 })
watch(total, (t) => { if (page.value > t) page.value = t })
const reset = () => { query.value = ''; category.value = 'all'; packaging.value = 'all'; sort.value = 'new' }
const askMsg = computed(() => `Halo, saya mencari produk${query.value ? ` "${query.value}"` : ''} tapi belum menemukannya di katalog. Apakah tersedia?`)
</script>
<template>
  <section id="katalog" class="container section" aria-labelledby="kt">
    <h2 id="kt" class="section-title">Katalog Produk</h2>
    <div class="card">
      <div class="bar">
        <div class="fw">
          <button class="fl" :aria-expanded="filterOpen" @click="filterOpen = !filterOpen">
            <AppIcon name="filter" :size="16" /><span>filter produk berdasarkan</span><span v-if="filterActive" class="dotn" aria-label="filter aktif" /><AppIcon name="chevron-down" :size="16" />
          </button>
          <div v-if="filterOpen" class="fp">
            <label class="label first">Jenis packaging</label>
            <select v-model="packaging" class="input"><option value="all">Semua packaging</option><option v-for="k in state.packagings" :key="k.id" :value="k.id">{{ k.name }}</option></select>
            <label class="label">Urutkan</label>
            <select v-model="sort" class="input"><option value="new">Terbaru</option><option value="low">Harga terendah</option><option value="high">Harga tertinggi</option></select>
            <button class="rs" @click="reset">Atur ulang</button>
          </div>
        </div>
        <button class="icon-btn" :class="{ on: searchOpen }" aria-label="Cari produk" :aria-expanded="searchOpen" @click="searchOpen = !searchOpen"><AppIcon name="search" :size="18" /></button>
      </div>
      <div v-if="searchOpen" class="sr"><AppIcon name="search" :size="16" /><input v-model="query" type="search" placeholder="Cari nama produk atau kategori…" aria-label="Cari produk" autofocus /></div>

      <div class="chips" role="group" aria-label="Kategori">
        <button class="chip" :class="{ on: category === 'all' }" @click="category = 'all'">semua ({{ visibleProducts.length }})</button>
        <button v-for="c in chips" :key="c.id" class="chip" :class="{ on: category === c.id }" @click="category = c.id">{{ c.name.toLowerCase() }} ({{ c.n }})</button>
      </div>
      <div class="meta">
        <span>menampilkan {{ paged.length }} dari {{ filtered.length }} produk</span>
        <div class="vt">
          <button :class="{ on: view === 'list' }" aria-label="Tampilan daftar" @click="view = 'list'"><AppIcon name="list" :size="16" /></button>
          <button :class="{ on: view === 'grid' }" aria-label="Tampilan kotak" @click="view = 'grid'"><AppIcon name="grid" :size="16" /></button>
        </div>
      </div>

      <div v-if="!filtered.length" class="empty">
        <p v-if="category !== 'all' && !query.trim()">Produk untuk kategori ini belum tersedia. Tanyakan langsung ke kami, mungkin bisa dipesan khusus.</p>
        <p v-else>Produk yang kamu cari belum ada di katalog.</p>
        <div class="ea">
          <BaseButton as="a" variant="whatsapp" :href="waLink(askMsg)" target="_blank" rel="noopener"><template #icon><AppIcon name="chat" :size="16" /></template>Tanya via WhatsApp</BaseButton>
          <BaseButton variant="outline" @click="reset">Atur ulang filter</BaseButton>
        </div>
      </div>
      <div v-else class="ls" :class="{ grid: view === 'grid' }">
        <ProductCard v-for="p in paged" :key="p.id" :product="p" :layout="view" />
      </div>
      <PaginationBar v-model:page="page" :total="total" />
    </div>
  </section>
</template>
<style scoped>
.card { padding: 14px; } .bar { display: flex; gap: 8px; margin-bottom: 10px; max-width: 520px; } .fw { position: relative; flex: 1; }
.fl { width: 100%; display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: var(--bg-soft); border: 1px solid var(--border); border-radius: var(--r-8); color: var(--muted); font-size: 13px; text-align: left; } .fl > span:first-of-type { flex: 1; }
.dotn { width: 8px; height: 8px; background: var(--red); border-radius: 50%; }
.fp { position: absolute; z-index: 10; left: 0; right: 0; top: 46px; background: #fff; border: 1px solid var(--border); border-radius: var(--r-12); box-shadow: var(--sh-lg); padding: 14px; } .label.first { margin-top: 0; }
.rs { margin-top: 14px; background: none; border: none; color: var(--navy); font-weight: 600; font-size: 13px; padding: 0; }
.icon-btn.on { background: var(--tint); }
.sr { display: flex; align-items: center; gap: 8px; max-width: 520px; padding: 0 12px; border: 1px solid var(--border); border-radius: var(--r-8); margin-bottom: 10px; color: var(--muted); } .sr input { flex: 1; border: none; outline: none; padding: 11px 0; font: inherit; font-size: 14px; }
.chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 8px; }
.chip { flex: 0 0 auto; padding: 7px 14px; border-radius: var(--r-full); border: 1px solid var(--border); background: #fff; font-size: 12px; color: var(--text); } .chip.on { background: var(--navy); border-color: var(--navy); color: #fff; }
.meta { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--muted); margin-bottom: 10px; }
.vt { display: flex; gap: 2px; background: var(--bg-soft); border-radius: var(--r-8); padding: 2px; } .vt button { width: 28px; height: 28px; border: none; background: none; border-radius: var(--r-6); color: var(--muted); display: flex; align-items: center; justify-content: center; } .vt .on { background: #fff; color: var(--navy); box-shadow: var(--sh-sm); }
.ls { display: grid; gap: 8px; margin-bottom: 16px; } .ls.grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
.empty { text-align: center; padding: 32px 8px; color: var(--muted); font-size: 14px; } .ea { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 14px; }
@media (min-width: 700px) { .ls.grid { grid-template-columns: repeat(3, 1fr); gap: 14px; } .card { padding: 20px; } }
</style>
