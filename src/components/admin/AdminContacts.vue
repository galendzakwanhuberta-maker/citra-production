<script setup>
import { reactive } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import BaseButton from '../ui/BaseButton.vue'
import { state, updateProfile } from '../../stores/store'
import { normalizeWa } from '../../utils/format'
import { uid } from '../../utils/id'
import { toast } from '../../stores/toast'
const p = state.profile
const f = reactive({ whatsapp: '0' + p.whatsapp.replace(/^62/, ''), email: p.email, instagram: p.instagram, address: p.address, mapsUrl: p.mapsUrl, links: JSON.parse(JSON.stringify(p.links)) })
const errs = reactive({})
const addLink = () => f.links.push({ id: uid(), label: '', url: '' })
const okUrl = (u) => { try { return ['http:', 'https:'].includes(new URL(u).protocol) } catch { return false } }
function save() {
  Object.keys(errs).forEach((k) => delete errs[k])
  const wa = normalizeWa(f.whatsapp)
  if (!/^62\d{8,13}$/.test(wa)) errs.whatsapp = 'Nomor WhatsApp tidak valid. Contoh: 0818273513'
  if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) errs.email = 'Format email tidak valid.'
  if (f.mapsUrl && !okUrl(f.mapsUrl)) errs.mapsUrl = 'Tautan harus diawali https://'
  if (f.links.some((l) => !l.label.trim() || !okUrl(l.url))) errs.links = 'Setiap tautan butuh nama dan alamat yang diawali https://'
  if (Object.keys(errs).length) return toast('Periksa kembali isian yang ditandai merah.', 'err')
  updateProfile({ whatsapp: wa, email: f.email.trim(), instagram: f.instagram.trim() ? '@' + f.instagram.trim().replace(/^@/, '') : '', address: f.address.trim(), mapsUrl: f.mapsUrl.trim(), links: f.links.map((l) => ({ id: l.id, label: l.label.trim(), url: l.url.trim() })) })
  toast('Kontak disimpan.')
}
</script>
<template>
  <section id="kontak" class="a-section">
    <div class="a-head"><h2>Kelola Kontak</h2><span class="a-hint">Tampil di footer</span></div>
    <form class="card" novalidate @submit.prevent="save">
      <div class="a-row">
        <div><label class="label first" for="wa">Nomor WhatsApp</label><input id="wa" v-model="f.whatsapp" class="input" :class="{ invalid: errs.whatsapp }" inputmode="tel" /><p v-if="errs.whatsapp" class="err">{{ errs.whatsapp }}</p></div>
        <div><label class="label first" for="ig">Instagram</label><input id="ig" v-model="f.instagram" class="input" placeholder="@citra.production" /></div>
      </div>
      <label class="label" for="em">Email</label><input id="em" v-model="f.email" type="email" class="input" :class="{ invalid: errs.email }" /><p v-if="errs.email" class="err">{{ errs.email }}</p>
      <label class="label" for="ad">Alamat toko</label><textarea id="ad" v-model="f.address" class="input" rows="2" />
      <label class="label" for="mp">Tautan Google Maps (opsional)</label><input id="mp" v-model="f.mapsUrl" class="input" :class="{ invalid: errs.mapsUrl }" placeholder="https://maps.app.goo.gl/…" /><p v-if="errs.mapsUrl" class="err">{{ errs.mapsUrl }}</p>
      <label class="label">Kontak / tautan lain</label>
      <div v-for="(l, i) in f.links" :key="l.id" class="lk"><input v-model="l.label" class="input" placeholder="Nama (mis. TikTok)" :aria-label="`Nama tautan ${i + 1}`" /><input v-model="l.url" class="input" placeholder="https://…" :aria-label="`Alamat tautan ${i + 1}`" /><button type="button" class="icon-btn icon-btn--danger" :aria-label="`Hapus tautan ${i + 1}`" @click="f.links.splice(i, 1)"><AppIcon name="trash" :size="16" /></button></div>
      <p v-if="errs.links" class="err">{{ errs.links }}</p>
      <div class="a-actions ac"><BaseButton type="button" variant="ghost" size="small" @click="addLink"><template #icon><AppIcon name="plus" :size="14" /></template>tambah kontak/link</BaseButton><BaseButton>simpan kontak</BaseButton></div>
    </form>
  </section>
</template>
<style scoped>
.label.first { margin-top: 0; } .lk { display: grid; grid-template-columns: 1fr 1.4fr auto; gap: 8px; margin-bottom: 8px; } .ac { margin-top: 16px; justify-content: space-between; }
@media (max-width: 560px) { .lk { grid-template-columns: 1fr auto; } .lk input:nth-child(2) { grid-column: 1; } }
</style>
