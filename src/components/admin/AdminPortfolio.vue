<script setup>
import { ref, computed, watch } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import BaseButton from '../ui/BaseButton.vue'
import ModalBox from '../ui/ModalBox.vue'
import ActionConfirm from '../ui/ActionConfirm.vue'
import PaginationBar from '../ui/PaginationBar.vue'
import { state, savePortfolio, removePortfolio } from '../../stores/store'
import { pickFiles, readImages } from '../../utils/image'
import { uid } from '../../utils/id'
import { toast } from '../../stores/toast'
const MAXIMG = 6
const page = ref(1), per = 2
const total = computed(() => Math.max(1, Math.ceil(state.portfolio.length / per)))
const paged = computed(() => state.portfolio.slice((page.value - 1) * per, page.value * per))
watch(total, (t) => { if (page.value > t) page.value = t })
// form: null = tertutup | { id?, title, description, images:[{id,src}], hidden }
const form = ref(null), errs = ref({}), busy = ref(false), confirmSave = ref(false), del = ref(null)
const openAdd = () => { form.value = { id: '', title: '', description: '', images: [], hidden: false }; errs.value = {} }
const openEdit = (p) => { form.value = JSON.parse(JSON.stringify(p)); errs.value = {} }
async function addImages() {
  const room = MAXIMG - form.value.images.length
  if (room <= 0) return toast(`Maksimal ${MAXIMG} gambar per portofolio.`, 'err')
  const files = await pickFiles({ multiple: true }); if (!files.length) return
  busy.value = true; const { images, errors } = await readImages(files, { max: room }); busy.value = false
  images.forEach((src) => form.value.images.push({ id: uid(), src }))
  if (errors.length) toast(errors[0], 'err')
}
function ask() {
  errs.value = {}
  if (!form.value.title.trim()) errs.value.title = 'Judul portofolio wajib diisi.'
  if (Object.keys(errs.value).length) return
  confirmSave.value = true
}
function doSave() {
  const wasNew = !form.value.id
  savePortfolio({ ...form.value, title: form.value.title.trim(), description: form.value.description.trim() })
  toast(wasNew ? 'Portofolio ditambahkan.' : 'Portofolio diperbarui.'); confirmSave.value = false; form.value = null
}
</script>
<template>
  <section id="portofolio" class="a-section">
    <div class="a-head"><h2>Kelola Portofolio</h2></div>
    <div class="card">
      <p v-if="!state.portfolio.length" class="muted emp">Belum ada portofolio.</p>
      <article v-for="p in paged" :key="p.id" class="pi" :class="{ off: p.hidden }">
        <div class="tx">
          <h3>{{ p.title }}</h3><p>{{ p.description }}</p>
          <div class="ac">
            <button class="bt" @click="openEdit(p)"><AppIcon name="edit" :size="14" />Edit</button>
            <button class="bt bt--red" :aria-label="`Hapus portofolio ${p.title}`" @click="del = p"><AppIcon name="trash" :size="14" /></button>
          </div>
        </div>
        <div class="cv"><div class="fr"><img v-if="p.images.length" :src="p.images[0].src" :alt="p.title" /><div v-else class="ph"><AppIcon name="image" :size="30" /></div></div><p class="cap">{{ p.title }} <span v-if="p.images.length > 1" class="mu">· {{ p.images.length }} gambar</span></p></div>
      </article>
      <PaginationBar v-model:page="page" :total="total" />
      <BaseButton variant="outline" block class="add" @click="openAdd"><template #icon><AppIcon name="plus" :size="16" /></template>Tambah portofolio</BaseButton>
    </div>

    <ModalBox :open="!!form" :title="form?.id ? 'Edit Portofolio' : 'Tambah Portofolio'" width="480px" @close="form = null">
      <form v-if="form" novalidate @submit.prevent="ask">
        <label class="label first" for="pt">Judul portofolio</label><input id="pt" v-model="form.title" class="input" :class="{ invalid: errs.title }" placeholder="Contoh: Wisuda SMA Negeri 1 Bandung" maxlength="80" /><p v-if="errs.title" class="err">{{ errs.title }}</p>
        <label class="label" for="pd">Deskripsi singkat</label><input id="pd" v-model="form.description" class="input" placeholder="Tuliskan deskripsi portofolio" maxlength="160" />
        <label class="label">Gambar portofolio</label>
        <button v-if="!form.images.length" type="button" class="dz" :disabled="busy" @click="addImages"><AppIcon name="upload" :size="20" /><strong>{{ busy ? 'Memproses gambar…' : 'Tarik beberapa gambar ke sini atau pilih file' }}</strong><small>Bisa lebih dari satu gambar JPG, PNG, atau WEBP, maksimal 2 MB per gambar</small></button>
        <div v-else class="im">
          <div v-for="(g, i) in form.images" :key="g.id" class="th"><img :src="g.src" alt="" /><button type="button" class="x" :aria-label="`Hapus gambar ${i + 1}`" @click="form.images.splice(i, 1)"><AppIcon name="close" :size="10" /></button><span v-if="i === 0" class="cv2">Sampul</span></div>
          <button v-if="form.images.length < MAXIMG" type="button" class="th add" :disabled="busy" aria-label="Tambah gambar" @click="addImages"><AppIcon name="plus" :size="16" />Tambah</button>
        </div>
        <div class="ft"><button type="button" class="bt bt--out" @click="form = null">Batal</button><button class="bt bt--navy">Simpan</button></div>
      </form>
    </ModalBox>
    <ActionConfirm :open="confirmSave" title="Simpan portofolio ini?" message="Gambar dan data portofolio akan disimpan dan langsung tampil di daftar portofolio." item-label="Portofolio" :item-text="form?.title" icon="check" tone="primary" confirm-label="Ya, Simpan" @confirm="doSave" @cancel="confirmSave = false" />
    <ActionConfirm :open="!!del" title="Hapus portofolio ini?" message="Portofolio beserta gambarnya akan dihapus permanen dan tidak bisa dikembalikan." item-label="Portofolio" :item-text="del?.title" @confirm="removePortfolio(del.id); del = null; toast('Portofolio dihapus.')" @cancel="del = null" />
  </section>
</template>
<style scoped>
.card { padding: 4px 14px 14px; } .emp { padding: 14px 0; font-size: 14px; }
.pi { display: grid; gap: 12px; padding: 16px 0; border-bottom: 1px solid var(--border); } .pi.off { opacity: .55; }
.tx h3 { font-size: 16px; margin-bottom: 2px; } .tx p { font-size: 13px; color: var(--muted); margin-bottom: 10px; } .ac { display: flex; gap: 8px; }
.cv { border: 1px solid var(--border); border-radius: var(--r-8); padding: 6px; } .fr { aspect-ratio: 16 / 9; border-radius: var(--r-6); overflow: hidden; background: var(--tint); } .fr img, .ph { width: 100%; height: 100%; object-fit: cover; } .ph { display: flex; align-items: center; justify-content: center; color: var(--muted); } .cap { font-size: 12px; margin: 6px 2px 0; } .mu { color: var(--muted); }
.add { margin-top: 12px; border-radius: var(--r-8); }
.bt { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: var(--r-6); border: 1px solid var(--navy); color: var(--navy); background: #fff; font-size: 12px; font-weight: 600; } .bt--red { border-color: var(--red); color: var(--red); } .bt--out { border-color: var(--border); color: var(--text); } .bt--navy { background: var(--navy); color: #fff; }
.label.first { margin-top: 0; } .dz { width: 100%; display: grid; gap: 4px; justify-items: center; padding: 20px 12px; background: #fafafa; border: 1.5px dashed #CBD0D8; border-radius: var(--r-8); font-size: 12px; text-align: center; } .dz small { color: var(--muted); font-size: 10px; }
.im { display: flex; flex-wrap: wrap; gap: 8px; } .th { position: relative; width: 84px; height: 62px; border-radius: var(--r-6); overflow: hidden; background: repeating-conic-gradient(#eee 0 25%, #fff 0 50%) 0 0 / 12px 12px; border: 1px solid var(--border); padding: 0; } .th img { width: 100%; height: 100%; object-fit: cover; }
.x { position: absolute; top: 3px; right: 3px; width: 16px; height: 16px; border: none; border-radius: 50%; background: rgba(255,255,255,.9); display: flex; align-items: center; justify-content: center; } .cv2 { position: absolute; left: 3px; bottom: 3px; background: var(--navy); color: #fff; font-size: 9px; padding: 1px 6px; border-radius: var(--r-4); }
.th.add { border: 1.5px dashed #CBD0D8; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 11px; color: var(--muted); }
.ft { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
@media (min-width: 720px) { .pi { grid-template-columns: 1fr 1.1fr; align-items: center; gap: 24px; } .tx { padding-left: 20px; } }
</style>
