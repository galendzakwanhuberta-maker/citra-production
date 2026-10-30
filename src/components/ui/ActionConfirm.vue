<script setup>
import ModalBox from './ModalBox.vue'
import AppIcon from './AppIcon.vue'
// Dialog konfirmasi bergaya desain: ikon, judul, penjelasan, kotak ringkasan item, tombol Batal / Ya.
defineProps({ open: Boolean, title: String, message: String, itemLabel: String, itemText: String, confirmLabel: { type: String, default: 'Ya, Hapus' }, tone: { type: String, default: 'danger' }, icon: { type: String, default: 'trash' } })
const emit = defineEmits(['confirm', 'cancel'])
</script>
<template>
  <ModalBox :open="open" :title="title" :icon="icon" :tone="tone === 'danger' ? 'danger' : 'info'" width="400px" @close="emit('cancel')">
    <p v-if="message" class="ms">{{ message }}</p>
    <div v-if="itemText" class="it"><small>{{ itemLabel }}</small><strong>{{ itemText }}</strong></div>
    <template #footer>
      <button class="b b--out" @click="emit('cancel')">Batal</button>
      <button class="b" :class="tone === 'danger' ? 'b--red' : 'b--navy'" @click="emit('confirm')"><AppIcon :name="icon" :size="14" />{{ confirmLabel }}</button>
    </template>
  </ModalBox>
</template>
<style scoped>
.ms { font-size: 12px; color: var(--muted); margin-bottom: 12px; } .it { background: var(--bg-soft); border: 1px solid var(--border); border-radius: var(--r-8); padding: 10px 12px; display: grid; gap: 2px; } .it small { font-size: 11px; color: var(--muted); } .it strong { font-size: 13px; }
.b { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--r-8); border: 1px solid transparent; font-weight: 600; font-size: 13px; }
.b--out { background: #fff; border-color: var(--border); color: var(--text); } .b--red { background: var(--red); color: #fff; } .b--navy { background: var(--navy); color: #fff; }
</style>
