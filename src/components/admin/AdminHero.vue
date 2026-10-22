<script setup>
import { reactive, ref } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import BaseButton from '../ui/BaseButton.vue'
import { state, updateProfile } from '../../stores/store'
import { pickFiles, readImages } from '../../utils/image'
import { toast } from '../../stores/toast'
const f = reactive({ title: state.profile.title, description: state.profile.description })
const busy = ref(false)
async function upload() {
  const files = await pickFiles(); if (!files.length) return
  busy.value = true; const { images, errors } = await readImages(files, { max: 1 }); busy.value = false
  if (images[0]) { updateProfile({ heroImage: images[0] }); toast('Foto hero diperbarui.') } else toast(errors[0] || 'Foto gagal diproses.', 'err')
}
function save() { if (!f.title.trim()) return toast('Judul tidak boleh kosong.', 'err'); updateProfile({ title: f.title.trim(), description: f.description.trim() }); toast('Hero section disimpan.') }
</script>
<template>
  <section id="hero" class="a-section">
    <div class="a-head"><h2>Kelola Hero</h2><span class="a-hint">Bagian paling atas website</span></div>
    <form class="card" @submit.prevent="save">
      <div class="top">
        <div class="pv"><img v-if="state.profile.heroImage" :src="state.profile.heroImage" alt="Foto hero saat ini" /><div v-else class="ph"><AppIcon name="image" :size="28" /></div></div>
        <div class="ac"><BaseButton type="button" variant="secondary" size="small" :loading="busy" @click="upload"><template #icon><AppIcon name="upload" :size="14" /></template>{{ state.profile.heroImage ? 'ganti foto' : 'upload foto' }}</BaseButton>
          <BaseButton v-if="state.profile.heroImage" type="button" variant="ghost" size="small" @click="updateProfile({ heroImage: '' })">hapus foto</BaseButton></div>
      </div>
      <label class="label" for="ht">Judul</label><input id="ht" v-model="f.title" class="input" maxlength="60" />
      <label class="label" for="hd">Deskripsi singkat</label><textarea id="hd" v-model="f.description" class="input" rows="5" maxlength="400" />
      <BaseButton class="sv">simpan hero</BaseButton>
    </form>
  </section>
</template>
<style scoped>
.top { display: grid; gap: 12px; } .pv { aspect-ratio: 16 / 9; max-width: 360px; border-radius: var(--r-12); overflow: hidden; } .pv img, .ph { width: 100%; height: 100%; object-fit: cover; } .ac { display: flex; gap: 8px; } .sv { margin-top: 16px; }
</style>
