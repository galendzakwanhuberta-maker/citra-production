<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '../../components/ui/AppIcon.vue'
import ModalBox from '../../components/ui/ModalBox.vue'
import { state, updateProfile } from '../../stores/store'
import { normalizeWa, formatPhone } from '../../utils/format'
import { toast } from '../../stores/toast'
const router = useRouter(), p = state.profile
const orig = { whatsapp: formatPhone(p.whatsapp), instagram: p.instagram, address: p.address, email: p.email, mapsUrl: p.mapsUrl }
const f = reactive({ ...orig })
const labels = { whatsapp: 'Nomor WhatsApp', instagram: 'Username Instagram', address: 'Alamat lengkap', email: 'Email', mapsUrl: 'Tautan Google Maps' }
const errs = reactive({}), confirm = ref(false)
const changed = computed(() => Object.keys(orig).filter((k) => f[k].trim() !== orig[k]))
const okUrl = (u) => { try { return ['http:', 'https:'].includes(new URL(u).protocol) } catch { return false } }
function ask() {
  Object.keys(errs).forEach((k) => delete errs[k])
  if (!/^62\d{8,13}$/.test(normalizeWa(f.whatsapp))) errs.whatsapp = 'Nomor WhatsApp tidak valid. Contoh: +62 813-9876-5432'
  if (f.email.trim() && !/^\S+@\S+\.\S+$/.test(f.email.trim())) errs.email = 'Format email tidak valid.'
  if (f.mapsUrl.trim() && !okUrl(f.mapsUrl.trim())) errs.mapsUrl = 'Tautan harus diawali https://'
  if (!f.address.trim()) errs.address = 'Alamat wajib diisi.'
  if (Object.keys(errs).length) return toast('Periksa kembali isian yang ditandai merah.', 'err')
  if (!changed.value.length) return toast('Belum ada perubahan.', 'err')
  confirm.value = true
}
function save() {
  updateProfile({ whatsapp: normalizeWa(f.whatsapp), instagram: f.instagram.trim() ? '@' + f.instagram.trim().replace(/^@/, '') : '', address: f.address.trim(), email: f.email.trim(), mapsUrl: f.mapsUrl.trim() })
  confirm.value = false; router.replace({ name: 'admin-contacts', query: { saved: '1' } })
}
</script>
<template>
  <div class="a-wrap">
    <RouterLink :to="{ name: 'admin-contacts' }" class="bk"><AppIcon name="arrow-left" :size="14" />Kembali ke Kontak</RouterLink>
    <h1>Kelola Footer / Kontak</h1>
    <form class="card" novalidate @submit.prevent="ask">
      <h3>Info kontak</h3>
      <div class="a-row">
        <div><label class="label first" for="wa">Nomor WhatsApp <span v-if="f.whatsapp.trim() !== orig.whatsapp" class="chg">Diubah</span></label><input id="wa" v-model="f.whatsapp" class="input" :class="{ invalid: errs.whatsapp }" inputmode="tel" /><p v-if="errs.whatsapp" class="err">{{ errs.whatsapp }}</p></div>
        <div><label class="label first" for="ig">Username Instagram <span v-if="f.instagram.trim() !== orig.instagram" class="chg">Diubah</span></label><input id="ig" v-model="f.instagram" class="input" placeholder="@citra.production" /></div>
      </div>
      <label class="label" for="ad">Alamat lengkap <span v-if="f.address.trim() !== orig.address" class="chg">Diubah</span></label><textarea id="ad" v-model="f.address" class="input" :class="{ invalid: errs.address }" rows="3" /><p v-if="errs.address" class="err">{{ errs.address }}</p>
      <div class="a-row">
        <div><label class="label" for="em">Email <span v-if="f.email.trim() !== orig.email" class="chg">Diubah</span></label><input id="em" v-model="f.email" type="email" class="input" :class="{ invalid: errs.email }" /><p v-if="errs.email" class="err">{{ errs.email }}</p></div>
        <div><label class="label" for="mp">Tautan Google Maps (opsional) <span v-if="f.mapsUrl.trim() !== orig.mapsUrl" class="chg">Diubah</span></label><input id="mp" v-model="f.mapsUrl" class="input" :class="{ invalid: errs.mapsUrl }" placeholder="https://maps.app.goo.gl/…" /><p v-if="errs.mapsUrl" class="err">{{ errs.mapsUrl }}</p></div>
      </div>
      <div class="bar">
        <span class="pend"><i v-if="changed.length" />{{ changed.length ? `${changed.length} perubahan belum disimpan` : 'Belum ada perubahan' }}</span>
        <div class="bt"><RouterLink :to="{ name: 'admin-contacts' }" class="b b--out">Batal</RouterLink><button class="b b--navy">Simpan perubahan</button></div>
      </div>
    </form>
    <ModalBox :open="confirm" title="Simpan perubahan footer/kontak?" subtitle="Perubahan berikut akan langsung tampil di footer website" icon="edit" width="400px" @close="confirm = false">
      <div class="df"><div v-for="k in changed" :key="k"><small>{{ labels[k] }}</small><p><s>{{ orig[k] || '-' }}</s> → <strong>{{ f[k].trim() || '-' }}</strong></p></div></div>
      <template #footer><button class="b b--out" @click="confirm = false">Periksa lagi</button><button class="b b--navy" @click="save">Ya, simpan</button></template>
    </ModalBox>
  </div>
</template>
<style scoped>
.bk { display: inline-flex; gap: 6px; align-items: center; font-size: 11px; color: var(--muted); text-decoration: none; margin-bottom: 8px; } h1 { font-size: 20px; margin-bottom: 14px; } h3 { font-size: 13px; margin-bottom: 8px; }
.label.first { margin-top: 0; } .chg { background: var(--tint); color: var(--navy); font-size: 9px; padding: 1px 6px; border-radius: var(--r-4); margin-left: 4px; font-weight: 500; }
.bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 18px; flex-wrap: wrap; } .pend { font-size: 11px; color: var(--muted); display: inline-flex; gap: 6px; align-items: center; } .pend i { width: 6px; height: 6px; border-radius: 50%; background: var(--navy); } .bt { display: flex; gap: 8px; }
.b { padding: 9px 16px; border-radius: var(--r-6); border: 1px solid transparent; font-size: 12px; font-weight: 600; text-decoration: none; } .b--out { background: #fff; border-color: var(--border); color: var(--text); } .b--navy { background: var(--navy); color: #fff; }
.df { background: var(--bg-soft); border: 1px solid var(--border); border-radius: var(--r-8); padding: 10px 12px; display: grid; gap: 8px; } .df small { font-size: 10px; color: var(--muted); } .df p { font-size: 12px; margin: 0; } .df s { color: var(--muted); }
</style>
