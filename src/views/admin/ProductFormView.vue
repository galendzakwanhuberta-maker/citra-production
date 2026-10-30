<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '../../components/ui/AppIcon.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import KebabMenu from '../../components/ui/KebabMenu.vue'
import { state, saveProduct } from '../../stores/store'
import { siteConfig } from '../../config/site'
import { pickFiles, readImages } from '../../utils/image'
import { uid } from '../../utils/id'
import { toast } from '../../stores/toast'

const props = defineProps({ id: String })
const router = useRouter()
const existing = props.id ? state.products.find((p) => p.id === props.id) : null
const missing = !!props.id && !existing
const form = reactive(existing ? JSON.parse(JSON.stringify(existing)) : { id: '', name: '', priceMin: '', priceMax: '', categoryId: '', packagingId: '', minOrder: '', altText: '', photos: [], hidden: false })
const active = ref(0), busy = ref(false), errs = reactive({})
const max = siteConfig.maxPhotosPerProduct
const cur = computed(() => form.photos[active.value])

async function addPhotos() {
  const room = max - form.photos.length
  if (room <= 0) return toast(`Maksimal ${max} foto per produk.`, 'err')
  const files = await pickFiles({ multiple: true }); if (!files.length) return
  busy.value = true
  const { images, errors } = await readImages(files, { max: room })
  const start = form.photos.length
  images.forEach((src) => form.photos.push({ id: uid(), src, hidden: false }))
  if (images.length) active.value = start
  busy.value = false
  if (errors.length) toast(errors[0], 'err')
}
function removePhoto(i) { form.photos.splice(i, 1); active.value = Math.max(0, Math.min(active.value, form.photos.length - 1)) }
function makeCover(i) { const [p] = form.photos.splice(i, 1); form.photos.unshift(p); active.value = 0 }
const photoMenu = computed(() => [
  { label: 'jadikan foto utama', icon: 'star' }, { label: cur.value?.hidden ? 'tampilkan' : 'sembunyikan', icon: cur.value?.hidden ? 'eye' : 'eye-off' }, { label: 'hapus foto', icon: 'trash', danger: true },
])
function onPhotoMenu(i) { const a = active.value; if (i === 0) makeCover(a); else if (i === 1) form.photos[a].hidden = !form.photos[a].hidden; else removePhoto(a) }

function validate() {
  Object.keys(errs).forEach((k) => delete errs[k])
  if (!form.name.trim()) errs.name = 'Nama produk wajib diisi.'
  const min = Number(form.priceMin), max2 = form.priceMax === '' ? 0 : Number(form.priceMax)
  if (form.priceMin === '' || !(min >= 0)) errs.priceMin = 'Isi harga (angka, 0 jika "hubungi kami").'
  if (form.priceMax !== '' && !(max2 >= min)) errs.priceMax = 'Harga maksimal harus ≥ harga awal.'
  if (!form.categoryId) errs.categoryId = 'Pilih kategori.'
  if (!form.packagingId) errs.packagingId = 'Pilih jenis packaging.'
  return !Object.keys(errs).length
}
function save() {
  if (!validate()) return toast('Periksa kembali isian yang ditandai merah.', 'err')
  saveProduct({ ...form, name: form.name.trim(), priceMin: Number(form.priceMin), priceMax: form.priceMax === '' ? 0 : Number(form.priceMax), altText: form.altText.trim() || form.name.trim() })
  toast(existing ? 'Perubahan produk disimpan.' : 'Produk baru ditambahkan.')
  router.push({ name: 'admin', hash: '#produk' })
}
const back = () => router.push({ name: 'admin', hash: '#produk' })
</script>
<template>
  <div class="a-wrap fm">
    <button class="bk" @click="back"><AppIcon name="arrow-left" :size="18" />kembali</button>
    <div v-if="missing" class="card nf"><p>Produk tidak ditemukan.</p><BaseButton @click="back">Kembali ke daftar</BaseButton></div>
    <form v-else class="card" novalidate @submit.prevent="save">
      <div class="a-head"><h1>Tambah &amp; Edit Product</h1><span class="a-hint">Form input produk</span></div>
      <label class="label first">Tambah foto produk</label>

      <button v-if="!form.photos.length" type="button" class="dz" :disabled="busy" @click="addPhotos">
        <span class="ic"><AppIcon name="image" :size="18" /><AppIcon name="image" :size="18" /><span class="pl"><AppIcon name="plus" :size="14" /></span></span>
        <strong>{{ busy ? 'Memproses foto…' : `Klik untuk upload foto (Max ${max} file)` }}</strong><small>PNG, JPG, WEBP maks 2MB</small>
      </button>
      <div v-else>
        <div class="mp">
          <img :src="cur.src" :alt="form.altText || form.name || 'Foto produk'" :class="{ dim: cur.hidden }" />
          <span class="tg">{{ cur.hidden ? 'disembunyikan' : 'foto ' + (active + 1) + '/' + form.photos.length }}</span>
          <div class="kmw"><KebabMenu :items="photoMenu" dark align="left" label="Menu foto" @select="onPhotoMenu" /></div>
        </div>
        <div class="th">
          <button v-for="(p, i) in form.photos" :key="p.id" type="button" class="t" :class="{ on: i === active, dim: p.hidden }" :aria-label="`Foto ${i + 1}`" @click="active = i"><img :src="p.src" alt="" /></button>
          <button v-if="form.photos.length < max" type="button" class="t add" :disabled="busy" aria-label="Tambah foto" @click="addPhotos"><AppIcon name="plus" :size="18" /></button>
        </div>
      </div>

      <div class="a-row">
        <div><label class="label" for="nm">Nama Produk</label><input id="nm" v-model="form.name" class="input" :class="{ invalid: errs.name }" placeholder="Contoh: Plakat Kayu" maxlength="80" /><p v-if="errs.name" class="err">{{ errs.name }}</p></div>
        <div><label class="label" for="hg">Harga (Rp)</label><input id="hg" v-model="form.priceMin" type="number" min="0" inputmode="numeric" class="input" :class="{ invalid: errs.priceMin }" placeholder="Rp 12.000" /><p v-if="errs.priceMin" class="err">{{ errs.priceMin }}</p></div>
      </div>
      <div class="a-row">
        <div><label class="label" for="ct">Kategori Product</label>
          <select id="ct" v-model="form.categoryId" class="input" :class="{ invalid: errs.categoryId }"><option value="" disabled>Pilih kategori</option><option v-for="c in state.categories" :key="c.id" :value="c.id">{{ c.name }}</option></select><p v-if="errs.categoryId" class="err">{{ errs.categoryId }}</p></div>
        <div><label class="label" for="pk">Jenis Packaging</label>
          <select id="pk" v-model="form.packagingId" class="input" :class="{ invalid: errs.packagingId }"><option value="" disabled>Pilih packaging</option><option v-for="c in state.packagings" :key="c.id" :value="c.id">{{ c.name }}</option></select><p v-if="errs.packagingId" class="err">{{ errs.packagingId }}</p></div>
      </div>
      <div class="a-row">
        <div><label class="label" for="hm">Harga maksimal (opsional)</label><input id="hm" v-model="form.priceMax" type="number" min="0" inputmode="numeric" class="input" :class="{ invalid: errs.priceMax }" placeholder="Untuk rentang harga" /><p v-if="errs.priceMax" class="err">{{ errs.priceMax }}</p></div>
        <div><label class="label" for="mo">Min. pembelian (opsional)</label><input id="mo" v-model="form.minOrder" class="input" placeholder="Contoh: 10 pcs" maxlength="40" /></div>
      </div>
      <label class="label" for="alt">Alternating text</label>
      <textarea id="alt" v-model="form.altText" class="input" rows="3" placeholder="Deskripsi singkat foto untuk pembaca layar. Contoh: Plakat kayu ukir warna cokelat" maxlength="160" />
      <label class="chk"><input v-model="form.hidden" type="checkbox" :true-value="false" :false-value="true" /> Tampilkan produk di katalog</label>
      <BaseButton block size="large" class="sv" :loading="busy">{{ existing ? 'simpan perubahan produk' : 'tambah produk baru' }}</BaseButton>
    </form>
  </div>
</template>
<style scoped>
.fm { max-width: 640px; } .bk { display: inline-flex; gap: 8px; align-items: center; border: none; background: none; font-weight: 600; font-size: 14px; padding: 4px 0; margin-bottom: 12px; } h1 { font-size: 22px; } .label.first { margin-top: 4px; font-size: 14px; font-weight: 400; }
.dz { width: 100%; display: grid; gap: 6px; justify-items: center; padding: 28px 16px; background: #fafafa; border: 1.5px dashed #CBD0D8; border-radius: var(--r-12); font-size: 13px; } .dz small { color: var(--muted); font-size: 11px; }
.ic { display: flex; gap: 8px; color: #666; } .ic > svg { padding: 7px; width: 36px; height: 36px; background: #E7E8EB; border-radius: var(--r-8); } .pl { width: 36px; height: 36px; border: 1.5px dashed #CBD0D8; border-radius: var(--r-8); display: flex; align-items: center; justify-content: center; }
.mp { position: relative; aspect-ratio: 1 / 1; border-radius: var(--r-12); background: var(--tint); } .mp img { width: 100%; height: 100%; object-fit: cover; border-radius: var(--r-12); } .dim { opacity: .45; }
.tg { position: absolute; left: 10px; bottom: 10px; background: #fff; border-radius: var(--r-4); padding: 1px 12px; font-size: 12px; } .kmw { position: absolute; top: 8px; left: 8px; }
.th { display: flex; gap: 8px; margin-top: 10px; overflow-x: auto; } .t { flex: 0 0 auto; width: 56px; height: 56px; padding: 0; border-radius: var(--r-6); border: 2px solid transparent; overflow: hidden; background: var(--tint); } .t img { width: 100%; height: 100%; object-fit: cover; } .t.on { border-color: var(--navy); } .t.add { border: 1.5px dashed #CBD0D8; background: #fff; color: var(--muted); display: flex; align-items: center; justify-content: center; }
.chk { display: flex; gap: 8px; align-items: center; font-size: 14px; margin-top: 16px; } .sv { margin-top: 18px; border-radius: var(--r-8); } .nf { text-align: center; display: grid; gap: 12px; justify-items: center; }
</style>
