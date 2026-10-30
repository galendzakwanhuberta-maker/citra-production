<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '../ui/AppIcon.vue'
import BaseButton from '../ui/BaseButton.vue'
import KebabMenu from '../ui/KebabMenu.vue'
import ActionConfirm from '../ui/ActionConfirm.vue'
import PaginationBar from '../ui/PaginationBar.vue'
import { state, nameOf, coverOf, toggleProduct, removeProduct } from '../../stores/store'
import { priceLabel } from '../../utils/format'
import { toast } from '../../stores/toast'
const router = useRouter()
const page = ref(1), del = ref(null)
const per = 8, total = computed(() => Math.max(1, Math.ceil(state.products.length / per)))
const paged = computed(() => state.products.slice((page.value - 1) * per, page.value * per))
watch(total, (t) => { if (page.value > t) page.value = t })
const menuFor = (p) => [{ label: 'edit produk', icon: 'edit' }, { label: p.hidden ? 'tampilkan di katalog' : 'sembunyikan', icon: p.hidden ? 'eye' : 'eye-off' }, { label: 'hapus produk', icon: 'trash', danger: true }]
function onMenu(i, p) {
  if (i === 0) router.push({ name: 'admin-product-edit', params: { id: p.id } })
  else if (i === 1) { toggleProduct(p.id); toast(p.hidden ? 'Produk disembunyikan dari katalog.' : 'Produk ditampilkan di katalog.') }
  else del.value = p
}
function confirmDel() { removeProduct(del.value.id); del.value = null; toast('Produk dihapus.') }
</script>
<template>
  <section id="produk" class="a-section">
    <div class="a-head"><h2>Kelola Product</h2></div>
    <div class="card add">
      <div class="a-head"><h3>Tambah Product</h3><span class="a-hint">Form input produk</span></div>
      <BaseButton as="RouterLink" :to="{ name: 'admin-product-new' }" block><template #icon><AppIcon name="plus" :size="16" /></template>tambah produk baru</BaseButton>
    </div>

    <h3 class="lh">Daftar Produk ({{ state.products.length }} item)</h3>
    <p v-if="!state.products.length" class="muted emp">Belum ada produk.</p>
    <div class="gr">
      <article v-for="p in paged" :key="p.id" class="pc" :class="{ off: p.hidden }">
        <div class="im">
          <img v-if="coverOf(p)" :src="coverOf(p)" :alt="p.altText || p.name" /><div v-else class="ph"><AppIcon name="image" :size="22" /></div>
          <div class="km"><KebabMenu :items="menuFor(p)" dark :label="`Menu ${p.name}`" @select="onMenu($event, p)" /></div>
          <span v-if="p.hidden" class="hid badge badge--off">Hiden</span>
        </div>
        <p class="ct">{{ nameOf('categories', p.categoryId) || 'Tanpa kategori' }}</p>
        <h4>{{ p.name }}</h4>
        <p class="pr">{{ priceLabel(p) }}</p>
      </article>
    </div>
    <PaginationBar v-model:page="page" :total="total" />
    <ActionConfirm :open="!!del" title="Hapus produk ini?" message="Produk yang sudah dihapus tidak dapat dikembalikan." item-label="Produk" :item-text="del?.name" @confirm="confirmDel" @cancel="del = null" />
  </section>
</template>
<style scoped>
h3 { font-size: 16px; } .add { display: grid; gap: 10px; margin-bottom: 20px; padding: 12px; } .add .a-head { margin: 0; }
.lh { font-size: 15px; font-weight: 500; margin-bottom: 10px; } .emp { padding: 12px 0; font-size: 14px; }
.gr { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px; }
.pc { background: #fff; border: 1px solid var(--border); border-radius: var(--r-8); padding: 6px 6px 10px; } .pc.off { background: var(--bg-soft); }
.im { position: relative; aspect-ratio: 1 / 1; border-radius: var(--r-6); overflow: hidden; background: var(--tint); margin-bottom: 6px; } .pc.off .im img { opacity: .45; } .im img, .ph { width: 100%; height: 100%; object-fit: cover; } .ph { display: flex; align-items: center; justify-content: center; color: var(--muted); }
.km { position: absolute; top: 6px; right: 6px; } .hid { position: absolute; left: 6px; bottom: 6px; background: #fff; }
.ct { font-size: 11px; color: var(--muted); padding: 0 2px; } h4 { font-size: 14px; font-weight: 700; padding: 0 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .pr { font-size: 11px; font-weight: 700; color: var(--navy); padding: 0 2px; }
@media (min-width: 720px) { .gr { grid-template-columns: repeat(4, 1fr); } }
</style>
