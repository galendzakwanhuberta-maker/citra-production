<script setup>
import { ref, computed, watch } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import BaseButton from '../ui/BaseButton.vue'
import ConfirmModal from '../ui/ConfirmModal.vue'
import PaginationBar from '../ui/PaginationBar.vue'
import { state, nameOf, coverOf, toggleProduct, removeProduct } from '../../stores/store'
import { priceLabel } from '../../utils/format'
import { toast } from '../../stores/toast'
const q = ref(''), page = ref(1), del = ref(null)
const filtered = computed(() => { const s = q.value.trim().toLowerCase(); return state.products.filter((p) => !s || p.name.toLowerCase().includes(s)) })
const per = 6, total = computed(() => Math.max(1, Math.ceil(filtered.value.length / per)))
const paged = computed(() => filtered.value.slice((page.value - 1) * per, page.value * per))
watch(q, () => { page.value = 1 }); watch(total, (t) => { if (page.value > t) page.value = t })
const active = computed(() => state.products.filter((p) => !p.hidden).length)
function toggle(p) { toggleProduct(p.id); toast(p.hidden ? 'Produk disembunyikan dari katalog.' : 'Produk ditampilkan di katalog.') }
function confirmDel() { removeProduct(del.value.id); del.value = null; toast('Produk dihapus.') }
</script>
<template>
  <section id="produk" class="a-section">
    <div class="a-head"><h2>Kelola Product</h2></div>
    <div class="card add">
      <div class="a-head"><h3>Tambah &amp; Edit Product</h3><span class="a-hint">Form input produk</span></div>
      <RouterLink :to="{ name: 'admin-product-new' }" class="dz"><span class="ic"><AppIcon name="image" :size="18" /><AppIcon name="image" :size="18" /><span class="pl"><AppIcon name="plus" :size="14" /></span></span><strong>Klik untuk upload foto (Max 5 file)</strong><small>PNG, JPG, WEBP maks 2MB</small></RouterLink>
      <BaseButton as="RouterLink" :to="{ name: 'admin-product-new' }" block><template #icon><AppIcon name="plus" :size="16" /></template>tambah produk baru</BaseButton>
    </div>

    <div class="a-head lh"><h3>Daftar Produk Aktif ({{ active }} item)</h3></div>
    <input v-model="q" type="search" class="input sr" placeholder="Cari produk…" aria-label="Cari produk di admin" />
    <p v-if="!filtered.length" class="muted emp">Belum ada produk{{ q ? ' yang cocok' : '' }}.</p>
    <div class="ls">
      <article v-for="p in paged" :key="p.id" class="row" :class="{ off: p.hidden }">
        <div class="tp">
          <div class="im"><img v-if="coverOf(p)" :src="coverOf(p)" :alt="p.altText || p.name" /><div v-else class="ph"><AppIcon name="image" :size="18" /></div></div>
          <div class="in"><p class="ct">{{ nameOf('categories', p.categoryId) || 'Tanpa kategori' }}</p><h4>{{ p.name }}</h4><p class="pr">{{ priceLabel(p) }}</p></div>
          <div class="st"><span class="badge" :class="p.hidden ? 'badge--off' : 'badge--on'">Status: {{ p.hidden ? 'Hiden' : 'Tampil' }}</span>
            <button class="ey" :aria-label="p.hidden ? `Tampilkan ${p.name}` : `Sembunyikan ${p.name}`" @click="toggle(p)"><AppIcon :name="p.hidden ? 'eye-off' : 'eye'" :size="20" /></button></div>
        </div>
        <div class="bt">
          <button class="icon-btn icon-btn--danger" :aria-label="`Hapus ${p.name}`" @click="del = p"><AppIcon name="trash" :size="16" /></button>
          <BaseButton as="RouterLink" :to="{ name: 'admin-product-edit', params: { id: p.id } }" class="ed">edit produk</BaseButton>
        </div>
      </article>
    </div>
    <PaginationBar v-model:page="page" :total="total" />
    <ConfirmModal :open="!!del" title="Anda yakin untuk menghapus produk ini?" message="produk yang sudah dihapus tidak dapat di restore" confirm-label="hapus produk" @confirm="confirmDel" @cancel="del = null" />
  </section>
</template>
<style scoped>
h3 { font-size: 16px; } .add { display: grid; gap: 12px; margin-bottom: 20px; } .add .a-head { margin: 0; }
.dz { display: grid; gap: 6px; justify-items: center; padding: 22px 12px; background: #fafafa; border: 1.5px dashed #CBD0D8; border-radius: var(--r-12); text-decoration: none; font-size: 13px; } .dz small { color: var(--muted); font-size: 11px; }
.ic { display: flex; gap: 8px; color: #666; } .ic > svg { padding: 6px; width: 32px; height: 32px; background: #E7E8EB; border-radius: var(--r-8); } .pl { width: 32px; height: 32px; border: 1.5px dashed #CBD0D8; border-radius: var(--r-8); display: flex; align-items: center; justify-content: center; }
.lh { margin-bottom: 8px; } .sr { max-width: 360px; margin-bottom: 12px; } .emp { padding: 16px 0; font-size: 14px; }
.ls { display: grid; gap: 10px; margin-bottom: 16px; } .row { background: #fff; border: 1px solid var(--border); border-radius: var(--r-12); padding: 10px; display: grid; gap: 10px; } .row.off .tp { opacity: .5; }
.tp { display: flex; gap: 10px; align-items: flex-start; } .im { width: 56px; height: 56px; border-radius: var(--r-8); overflow: hidden; flex-shrink: 0; } .im img, .ph { width: 100%; height: 100%; object-fit: cover; }
.in { flex: 1; min-width: 0; } .ct { font-size: 11px; color: var(--navy); } h4 { font-size: 15px; font-weight: 700; } .pr { font-size: 12px; color: var(--muted); }
.st { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; } .ey { border: none; background: none; padding: 2px; color: var(--navy); }
.bt { display: flex; gap: 8px; } .ed { flex: 1; border-radius: var(--r-8); }
@media (min-width: 720px) { .ls { grid-template-columns: 1fr 1fr; } }
</style>
