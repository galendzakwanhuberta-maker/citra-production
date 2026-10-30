<script setup>
import { ref } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import { approvedFaqs, submitQuestion } from '../../stores/store'
import { toast } from '../../stores/toast'
import { useWhatsapp } from '../../composables/useWhatsapp'
const { waLink } = useWhatsapp()
const open = ref(null), q = ref('')
// Alur 2: isi form -> submit -> buka WhatsApp -> pertanyaan terkirim.
function send() {
  const text = q.value.trim()
  if (text.length < 5) return toast('Tulis pertanyaan minimal 5 karakter.', 'err')
  submitQuestion(text)
  window.open(waLink(`Halo, saya ingin bertanya: ${text}`), '_blank', 'noopener')
  q.value = ''; toast('WhatsApp dibuka. Kirim pesannya agar pertanyaan sampai ke kami.')
}
</script>
<template>
  <section id="faq" class="container section" aria-labelledby="fq">
    <h2 id="fq" class="section-title">Pertanyaan Umum (FAQ)</h2>
    <div class="card">
      <div v-for="f in approvedFaqs" :key="f.id" class="it">
        <button class="qs" :aria-expanded="open === f.id" @click="open = open === f.id ? null : f.id"><span>{{ f.q }}</span><AppIcon :name="open === f.id ? 'chevron-up' : 'chevron-down'" :size="18" /></button>
        <p v-if="open === f.id" class="an">{{ f.a }}</p>
      </div>
      <form class="fm" @submit.prevent="send">
        <h3>Punya pertanyaan lainnya?</h3>
        <div class="rw"><input v-model="q" class="input" placeholder="Ketik pertanyaan Anda di sini…" maxlength="300" aria-label="Pertanyaan" /><button class="sd" aria-label="Kirim pertanyaan"><AppIcon name="arrow-right" :size="18" /></button></div>
        <a class="wa" :href="waLink()" target="_blank" rel="noopener"><AppIcon name="chat" :size="16" />atau langsung tanya via WhatsApp</a>
      </form>
    </div>
  </section>
</template>
<style scoped>
.card { padding: 12px; max-width: 860px; } .it { border: 1px solid var(--border); border-radius: var(--r-8); margin-bottom: 8px; }
.qs { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px; background: none; border: none; text-align: left; font-size: 15px; color: var(--text); } .qs :deep(svg) { flex-shrink: 0; color: var(--muted); }
.an { padding: 0 12px 12px; font-size: 14px; color: var(--blue); }
.fm { background: var(--tint); border-radius: var(--r-12); padding: 14px; margin-top: 12px; display: grid; gap: 10px; } .fm h3 { font-size: 15px; }
.rw { display: flex; gap: 8px; } .sd { width: 44px; flex-shrink: 0; border: none; border-radius: var(--r-8); background: var(--navy); color: #fff; display: flex; align-items: center; justify-content: center; }
.wa { display: inline-flex; gap: 8px; align-items: center; justify-content: center; color: var(--navy); font-size: 13px; font-weight: 600; text-decoration: none; } .wa:hover { text-decoration: underline; }
</style>
