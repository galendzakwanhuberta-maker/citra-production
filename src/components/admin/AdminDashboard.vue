<script setup>
import { computed } from 'vue'
import { adm } from '../../stores/admin'
const d = computed(() => adm.dashboard)
const tiles = computed(() => {
  const x = d.value; if (!x) return []
  return [
    { l: 'Total Produk', v: x.products.published + x.products.draft, h: `${x.products.published} Aktif · ${x.products.draft} draft` },
    { l: 'Kategori', v: adm.categories.length, h: 'Filter katalog' },
    { l: 'Portofolio', v: x.portfolios.published + x.portfolios.draft, h: 'Koleksi foto' },
    { l: 'Packaging', v: adm.packagings.length, h: 'Jenis kemasan' },
  ]
})
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
