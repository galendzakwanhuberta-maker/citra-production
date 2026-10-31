<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'
import KebabMenu from '../ui/KebabMenu.vue'
import PromptModal from '../ui/PromptModal.vue'
import ConfirmModal from '../ui/ConfirmModal.vue'
import { adm, addCategory, renameCategory, removeCategory, addPackaging, renamePackaging, removePackaging } from '../../stores/admin'
import { errMsg } from '../../api/client'
import { toast } from '../../stores/toast'
const props = defineProps({ title: String, hint: String, kind: { type: String, required: true } })
const isCat = props.kind === 'category'
const noun = isCat ? 'kategori' : 'packaging'
const ops = isCat ? { add: addCategory, rename: renameCategory, remove: removeCategory } : { add: addPackaging, rename: renamePackaging, remove: removePackaging }
const items = computed(() => (isCat ? adm.categories : adm.packagings))
const used = (id) => adm.products.filter((p) => (isCat ? p.category_id === id : p.packaging_ids.includes(id))).length
const mode = ref(null) // { type:'add' } | { type:'edit', item }
const del = ref(null)
const menu = [{ label: `edit ${noun}`, icon: 'edit' }, { label: `hapus ${noun}`, icon: 'trash', danger: true }]
function onMenu(i, item) { if (i === 0) mode.value = { type: 'edit', item }; else del.value = item }
async function confirmName(text) {
  const name = text.trim()
  if (!name) return toast('Nama tidak boleh kosong.', 'err')
  if (items.value.some((x) => x.id !== mode.value.item?.id && x.title.toLowerCase() === name.toLowerCase())) return toast('Nama sudah dipakai.', 'err')
  try {
    if (mode.value.type === 'add') await ops.add(name); else await ops.rename(mode.value.item.id, name)
    toast(mode.value.type === 'add' ? `${noun[0].toUpperCase() + noun.slice(1)} ditambahkan.` : 'Perubahan disimpan.'); mode.value = null
  } catch (e) { toast(errMsg(e), 'err') }
}
async function confirmDel() {
  try { await ops.remove(del.value.id); toast(`${noun[0].toUpperCase() + noun.slice(1)} dihapus.`) }
  catch (e) { toast(e.status === 409 ? (isCat ? 'Kategori masih dipakai produk. Pindahkan atau hapus produknya lebih dulu.' : 'Packaging masih dipilih produk. Lepaskan dari produk itu lebih dulu.') : errMsg(e), 'err') }
  del.value = null
}
const delMsg = computed(() => { const n = del.value ? used(del.value.id) : 0; return n ? `${n} produk masih memakai ${noun} ini, jadi server akan menolak penghapusan. Pindahkan produknya lebih dulu.` : 'Data yang sudah dihapus tidak dapat dikembalikan.' })
</script>
<template>
  <section class="a-section">
    <div class="a-head"><h2>{{ title }}</h2><span class="a-hint">{{ hint }}</span></div>
    <div class="card">
      <p v-if="!items.length" class="muted emp">Belum ada {{ noun }}.</p>
      <ul>
        <li v-for="it in items" :key="it.id"><span class="nm">{{ it.title }}</span><span class="cn">{{ used(it.id) }} produk</span><KebabMenu :items="menu" :label="`Menu ${it.title}`" @select="onMenu($event, it)" /></li>
      </ul>
      <BaseButton block class="ad" @click="mode = { type: 'add' }"><template #icon><AppIcon name="plus" :size="16" /></template>Tambah {{ isCat ? 'Kategori' : 'Packaging' }}</BaseButton>
    </div>
    <PromptModal :open="!!mode" :title="mode?.type === 'edit' ? `Ubah nama ${noun}` : `Tambah ${noun}`" :label="`Nama ${noun}`" :initial="mode?.item?.title || ''" @confirm="confirmName" @cancel="mode = null" />
    <ConfirmModal :open="!!del" :title="`Hapus ${noun} “${del?.title}”?`" :message="delMsg" :confirm-label="`hapus ${noun}`" @confirm="confirmDel" @cancel="del = null" />
  </section>
</template>
<style scoped>
.card { padding: 6px 14px 14px; } li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 15px; } .nm { flex: 1; } .cn { font-size: 12px; color: var(--muted); }
.ad { margin-top: 14px; border-radius: var(--r-8); } .emp { padding: 14px 0; font-size: 14px; }
</style>
