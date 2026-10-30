<script setup>
import { ref } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import PromptModal from '../ui/PromptModal.vue'
import ConfirmModal from '../ui/ConfirmModal.vue'
import { pendingFaqs, approvedFaqs, approveFaq, removeFaq } from '../../stores/store'
import { toast } from '../../stores/toast'
const ans = ref(null), rej = ref(null), rem = ref(null) // ans: { faq, editing }
function doAnswer(text) { approveFaq(ans.value.faq.id, text); toast(ans.value.editing ? 'Jawaban diperbarui.' : 'Pertanyaan disetujui dan tampil di FAQ.'); ans.value = null }
</script>
<template>
  <section id="faq" class="a-section">
    <div class="a-head"><h2>Kelola FAQ</h2><span class="a-hint">{{ pendingFaqs.length }} menunggu</span></div>
    <div class="card">
      <h3>Pertanyaan masuk</h3>
      <p v-if="!pendingFaqs.length" class="muted emp">Tidak ada pertanyaan yang menunggu.</p>
      <article v-for="f in pendingFaqs" :key="f.id" class="it"><p class="q">{{ f.q }}</p><div class="a-actions"><BaseButton size="small" @click="ans = { faq: f, editing: false }">approve</BaseButton><BaseButton size="small" variant="outline" @click="rej = f">reject</BaseButton></div></article>
      <h3 class="g">Sudah tampil ({{ approvedFaqs.length }})</h3>
      <article v-for="f in approvedFaqs" :key="f.id" class="it"><p class="q">{{ f.q }}</p><p class="an">{{ f.a || '(belum ada jawaban)' }}</p><div class="a-actions"><BaseButton size="small" variant="ghost" @click="ans = { faq: f, editing: true }">ubah jawaban</BaseButton><BaseButton size="small" variant="ghost" @click="rem = f">hapus</BaseButton></div></article>
    </div>
    <PromptModal :open="!!ans" :title="ans?.editing ? 'Ubah jawaban' : 'Setujui pertanyaan'" :hint="ans?.faq.q" label="Jawaban yang ditampilkan di FAQ" :initial="ans?.faq.a || ''" multiline :confirm-label="ans?.editing ? 'simpan' : 'setujui & tampilkan'" @confirm="doAnswer" @cancel="ans = null" />
    <ConfirmModal :open="!!rej" title="Tolak pertanyaan ini?" message="Pertanyaan akan dihapus dan tidak tampil di FAQ." confirm-label="reject" @confirm="removeFaq(rej.id); rej = null; toast('Pertanyaan ditolak.')" @cancel="rej = null" />
    <ConfirmModal :open="!!rem" title="Hapus FAQ ini?" message="FAQ tidak akan tampil lagi di website." confirm-label="hapus" @confirm="removeFaq(rem.id); rem = null; toast('FAQ dihapus.')" @cancel="rem = null" />
  </section>
</template>
<style scoped>
h3 { font-size: 14px; margin-bottom: 8px; } .g { margin-top: 20px; } .it { padding: 10px 0; border-top: 1px solid var(--border); display: grid; gap: 8px; } .q { font-weight: 600; font-size: 14px; } .an { font-size: 13px; color: var(--muted); } .emp { font-size: 13px; padding-bottom: 6px; }
</style>
