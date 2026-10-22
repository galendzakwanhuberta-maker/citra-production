<script setup>
import { computed } from 'vue'
import { state, pendingFaqs, pendingTestimonials, visibleProducts } from '../../stores/store'
const tiles = computed(() => [
  { l: 'Total Produk', v: state.products.length, h: `${visibleProducts.value.length} Aktif` },
  { l: 'Menunggu persetujuan', v: pendingFaqs.value.length + pendingTestimonials.value.length, h: 'pertanyaan & testimoni', warn: true },
  { l: 'Portofolio', v: state.portfolio.length, h: 'Koleksi foto' },
  { l: 'Kategori', v: state.categories.length, h: `${state.packagings.length} jenis packaging` },
])
</script>
<template>
  <section id="dashboard" class="a-section">
    <div class="a-head"><h2>Dashboard</h2></div>
    <div class="card">
      <h3>Ringkasan Statistik</h3>
      <div class="gd">
        <div v-for="t in tiles" :key="t.l" class="tl"><p class="l">{{ t.l }}</p><p class="v" :class="{ w: t.warn && t.v }">{{ t.v }}</p><p class="h">{{ t.h }}</p></div>
      </div>
    </div>
  </section>
</template>
<style scoped>
h3 { font-size: 14px; padding-bottom: 10px; margin-bottom: 12px; border-bottom: 1px solid var(--border); } .gd { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.tl { background: var(--bg-soft); border: 1px solid var(--border); border-radius: var(--r-8); padding: 10px 12px; } .l { font-size: 12px; color: var(--muted); } .v { font-size: 26px; font-weight: 700; line-height: 1.3; } .v.w { color: var(--red); } .h { font-size: 11px; color: var(--muted); }
@media (min-width: 720px) { .gd { grid-template-columns: repeat(4, 1fr); } }
</style>
