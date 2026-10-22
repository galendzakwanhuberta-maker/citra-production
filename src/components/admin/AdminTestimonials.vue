<script setup>
import { ref } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import ConfirmModal from '../ui/ConfirmModal.vue'
import { pendingTestimonials, approvedTestimonials, approveTestimonial, removeTestimonial } from '../../stores/store'
import { toast } from '../../stores/toast'
const del = ref(null) // { t, reject }
</script>
<template>
  <section id="testimoni" class="a-section">
    <div class="a-head"><h2>Kelola Testimoni</h2><span class="a-hint">{{ pendingTestimonials.length }} menunggu</span></div>
    <div class="card">
      <h3>Testimoni masuk</h3>
      <p v-if="!pendingTestimonials.length" class="muted emp">Tidak ada testimoni yang menunggu.</p>
      <article v-for="t in pendingTestimonials" :key="t.id" class="it"><p class="q">{{ t.name }}</p><p class="tx">{{ t.text }}</p>
        <div class="a-actions"><BaseButton size="small" @click="approveTestimonial(t.id); toast('Testimoni disetujui dan tampil.')">approve</BaseButton><BaseButton size="small" variant="outline" @click="del = { t, reject: true }">reject</BaseButton></div></article>
      <h3 class="g">Sudah tampil ({{ approvedTestimonials.length }})</h3>
      <article v-for="t in approvedTestimonials" :key="t.id" class="it"><p class="q">{{ t.name }} <span class="lk">· {{ t.likes }} suka</span></p><p class="tx">{{ t.text }}</p><div class="a-actions"><BaseButton size="small" variant="ghost" @click="del = { t, reject: false }">hapus</BaseButton></div></article>
    </div>
    <ConfirmModal :open="!!del" :title="del?.reject ? 'Tolak testimoni ini?' : 'Hapus testimoni ini?'" message="Testimoni akan dihapus dan tidak tampil di website." :confirm-label="del?.reject ? 'reject' : 'hapus'" @confirm="removeTestimonial(del.t.id); del = null; toast('Testimoni dihapus.')" @cancel="del = null" />
  </section>
</template>
<style scoped>
h3 { font-size: 14px; margin-bottom: 8px; } .g { margin-top: 20px; } .it { padding: 10px 0; border-top: 1px solid var(--border); display: grid; gap: 6px; } .q { font-weight: 600; font-size: 14px; } .lk { font-weight: 400; color: var(--muted); font-size: 12px; } .tx { font-size: 13px; color: #3a4150; } .emp { font-size: 13px; padding-bottom: 6px; }
</style>
