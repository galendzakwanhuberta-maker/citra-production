<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'
import KebabMenu from '../ui/KebabMenu.vue'
import PromptModal from '../ui/PromptModal.vue'
import ConfirmModal from '../ui/ConfirmModal.vue'
import { state, categoryOps, packagingOps, countProducts } from '../../stores/store'
import { toast } from '../../stores/toast'
const props = defineProps({ title: String, hint: String, kind: { type: String, required: true } })
const isCat = props.kind === 'category'
const ops = isCat ? categoryOps : packagingOps, field = isCat ? 'categoryId' : 'packagingId'
const noun = isCat ? 'kategori' : 'packaging'
const items = computed(() => (isCat ? state.categories : state.packagings))
const mode = ref(null) // { type:'add' } | { type:'edit', item }
const del = ref(null)
const menu = [{ label: `edit ${noun}`, icon: 'edit' }, { label: `hapus ${noun}`, icon: 'trash', danger: true }]
function onMenu(i, item) { if (i === 0) mode.value = { type: 'edit', item }; else del.value = item }
function confirmName(text) {
  const msg = mode.value.type === 'add' ? ops.add(text) : ops.rename(mode.value.item.id, text)
  if (msg) return toast(msg, 'err')
  toast(mode.value.type === 'add' ? `${noun[0].toUpperCase() + noun.slice(1)} ditambahkan.` : 'Perubahan disimpan.'); mode.value = null
}
function confirmDel() { ops.remove(del.value.id); toast(`${noun[0].toUpperCase() + noun.slice(1)} dihapus.`); del.value = null }
const delMsg = computed(() => { const n = del.value ? countProducts(field, del.value.id) : 0; return n ? `${n} produk memakai ${noun} ini dan akan menjadi "tanpa ${noun}". Produknya sendiri tidak ikut terhapus.` : 'Data yang sudah dihapus tidak dapat dikembalikan.' })
</script>
<template>
  <section class="a-section">
    <div class="a-head"><h2>{{ title }}</h2><span class="a-hint">{{ hint }}</span></div>
    <div class="card">
      <p v-if="!items.length" class="muted emp">Belum ada {{ noun }}.</p>
      <ul>
        <li v-for="it in items" :key="it.id"><span class="nm">{{ it.name }}</span><span class="cn">{{ countProducts(field, it.id) }} produk</span><KebabMenu :items="menu" :label="`Menu ${it.name}`" @select="onMenu($event, it)" /></li>
      </ul>
      <BaseButton block class="ad" @click="mode = { type: 'add' }"><template #icon><AppIcon name="plus" :size="16" /></template>Tambah {{ isCat ? 'Kategori' : 'Packaging' }}</BaseButton>
    </div>
    <PromptModal :open="!!mode" :title="mode?.type === 'edit' ? `Ubah nama ${noun}` : `Tambah ${noun}`" :label="`Nama ${noun}`" :initial="mode?.item?.name || ''" @confirm="confirmName" @cancel="mode = null" />
    <ConfirmModal :open="!!del" :title="`Hapus ${noun} “${del?.name}”?`" :message="delMsg" :confirm-label="`hapus ${noun}`" @confirm="confirmDel" @cancel="del = null" />
  </section>
</template>
<style scoped>
.card { padding: 6px 14px 14px; } li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 15px; } .nm { flex: 1; } .cn { font-size: 12px; color: var(--muted); }
.ad { margin-top: 14px; border-radius: var(--r-8); } .emp { padding: 14px 0; font-size: 14px; }
</style>
