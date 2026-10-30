<script setup>
import { ref, computed, watch } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import BaseButton from '../ui/BaseButton.vue'
import PromptModal from '../ui/PromptModal.vue'
import ConfirmModal from '../ui/ConfirmModal.vue'
import { state, addPortfolio, updatePortfolio, removePortfolio } from '../../stores/store'
import { pickFiles, readImages } from '../../utils/image'
import { toast } from '../../stores/toast'
const i = ref(0), busy = ref(false), edit = ref(false), del = ref(false)
const cur = computed(() => state.portfolio[i.value])
watch(() => state.portfolio.length, (n) => { if (i.value >= n) i.value = Math.max(0, n - 1) })
async function upload() {
  const files = await pickFiles({ multiple: true }); if (!files.length) return
  busy.value = true; const { images, errors } = await readImages(files); busy.value = false
  images.forEach((src) => addPortfolio(src, 'Projek baru'))
  if (images.length) { i.value = state.portfolio.length - 1; toast(`${images.length} foto portofolio ditambahkan. Beri judul lewat “ubah judul”.`) }
  if (errors.length) toast(errors[0], 'err')
}
const toggle = () => { updatePortfolio(cur.value.id, { hidden: !cur.value.hidden }); toast(cur.value.hidden ? 'Portofolio disembunyikan.' : 'Portofolio ditampilkan.') }
</script>
<template>
  <section id="portofolio" class="a-section">
    <div class="a-head"><h2>Kelola Portofolio</h2><span class="a-hint">Showcase Karya</span></div>
    <div class="card">
      <template v-if="cur">
        <div class="fr">
          <img v-if="cur.src" :src="cur.src" :alt="cur.title" :class="{ dim: cur.hidden }" /><div v-else class="ph"><AppIcon name="image" :size="34" /></div>
          <span class="cap">{{ cur.title }}</span><span v-if="cur.hidden" class="hid badge badge--off">Hiden</span>
        </div>
        <div class="dots"><button v-for="(p, k) in state.portfolio" :key="p.id" class="dot" :class="{ 'dot--active': k === i }" :aria-label="`Portofolio ${k + 1}`" @click="i = k" /></div>
        <div class="a-actions mid">
          <BaseButton variant="ghost" size="small" @click="edit = true"><template #icon><AppIcon name="edit" :size="14" /></template>ubah judul</BaseButton>
          <BaseButton variant="ghost" size="small" @click="del = true"><template #icon><AppIcon name="trash" :size="14" /></template>hapus</BaseButton>
        </div>
      </template>
      <p v-else class="muted emp">Belum ada portofolio. Upload foto pertama kamu.</p>
      <div class="a-actions two">
        <BaseButton variant="dark" :loading="busy" @click="upload"><template #icon><AppIcon name="upload" :size="16" /></template>upload portofolio</BaseButton>
        <BaseButton v-if="cur" variant="ghost" @click="toggle"><template #icon><AppIcon :name="cur.hidden ? 'eye' : 'eye-off'" :size="16" /></template>{{ cur.hidden ? 'show' : 'hide' }} portofolio</BaseButton>
      </div>
    </div>
    <PromptModal :open="edit" title="Ubah judul portofolio" label="Judul" :initial="cur?.title || ''" @confirm="(t) => { updatePortfolio(cur.id, { title: t.trim() }); edit = false; toast('Judul disimpan.') }" @cancel="edit = false" />
    <ConfirmModal :open="del" title="Hapus portofolio ini?" message="Foto yang sudah dihapus tidak dapat dikembalikan." confirm-label="hapus" @confirm="removePortfolio(cur.id); del = false; toast('Portofolio dihapus.')" @cancel="del = false" />
  </section>
</template>
<style scoped>
.fr { position: relative; aspect-ratio: 16 / 10; max-height: 340px; width: 100%; border-radius: var(--r-12); overflow: hidden; background: #D3D6DD; margin-bottom: 10px; } .fr img, .ph { width: 100%; height: 100%; object-fit: cover; } .dim { opacity: .45; } .ph { color: #444; }
.cap { position: absolute; left: 10px; bottom: 10px; background: rgba(0,0,0,.65); color: #fff; font-size: 11px; padding: 2px 8px; border-radius: var(--r-4); } .hid { position: absolute; top: 10px; right: 10px; background: #fff; }
.mid { justify-content: center; margin: 10px 0; } .two { margin-top: 12px; } .two > * { flex: 1; border-radius: var(--r-8); } .emp { padding: 12px 0; font-size: 14px; }
</style>
