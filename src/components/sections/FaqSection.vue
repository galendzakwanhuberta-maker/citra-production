<script setup>
import { ref } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import ModalBox from '../ui/ModalBox.vue'
import { approvedFaqs, submitQuestion } from '../../stores/store'
import { toast } from '../../stores/toast'
import { useWhatsapp } from '../../composables/useWhatsapp'
const { waLink } = useWhatsapp()
const open = ref(null), teaser = ref('')
const modal = ref(false), name = ref(''), q = ref(''), err = ref('')
const MAX = 100
function openModal() { q.value = teaser.value; teaser.value = ''; err.value = ''; modal.value = true }
// Alur 2: isi form -> submit -> buka WhatsApp admin -> pertanyaan masuk daftar admin.
function send() {
  const text = q.value.trim()
  if (text.length < 5) { err.value = 'Tulis pertanyaan minimal 5 karakter.'; return }
  submitQuestion({ name: name.value, q: text })
  window.open(waLink(`Halo, saya ${name.value.trim() || 'pelanggan'} ingin bertanya: ${text}`), '_blank', 'noopener')
  q.value = ''; name.value = ''; modal.value = false
  toast('WhatsApp dibuka. Kirim pesannya agar pertanyaan sampai ke kami.')
}
</script>
<template>
  <section id="faq" class="container section" aria-labelledby="fq">
    <h2 id="fq" class="section-title">Pertanyaan Umum (FAQ)</h2>
    <div class="card">
      <p v-if="!approvedFaqs.length" class="muted em">Belum ada FAQ yang ditampilkan.</p>
      <div v-for="f in approvedFaqs" :key="f.id" class="it">
        <button class="qs" :aria-expanded="open === f.id" @click="open = open === f.id ? null : f.id"><span>{{ f.q }}</span><AppIcon :name="open === f.id ? 'chevron-up' : 'chevron-down'" :size="18" /></button>
        <p v-if="open === f.id" class="an">{{ f.a }}</p>
      </div>
      <form class="fm" @submit.prevent="openModal">
        <h3>Punya pertanyaan lainnya?</h3>
        <div class="rw"><input v-model="teaser" class="input" placeholder="Tulis pertanyaan Anda di sini…" :maxlength="MAX" aria-label="Pertanyaan" /><button class="sd" aria-label="Buka form pertanyaan"><AppIcon name="arrow-right" :size="18" /></button></div>
        <a class="wa" :href="waLink()" target="_blank" rel="noopener"><AppIcon name="chat" :size="16" />atau langsung tanya via WhatsApp</a>
      </form>
    </div>

    <ModalBox :open="modal" title="Ajukan Pertanyaan" subtitle="Pertanyaan yang diisi akan diteruskan ke kontak WhatsApp Admin" width="420px" @close="modal = false">
      <form class="mf" novalidate @submit.prevent="send">
        <label class="label first" for="qn">Nama</label><input id="qn" v-model="name" class="input" placeholder="Nama Anda" maxlength="40" />
        <label class="label" for="qq">Pertanyaan <span class="req">*</span></label>
        <textarea id="qq" v-model="q" class="input" :class="{ invalid: err }" rows="4" placeholder="Tuliskan Pertanyaan Anda" :maxlength="MAX" />
        <p class="ct">{{ q.length }} dari {{ MAX }} karakter</p><p v-if="err" class="err">{{ err }}</p>
        <button class="sub">Submit Pertanyaan</button>
      </form>
    </ModalBox>
  </section>
</template>
<style scoped>
.card { padding: 12px; } .it { border: 1px solid var(--border); border-radius: var(--r-8); margin-bottom: 8px; } .em { padding: 8px 0 12px; font-size: 14px; }
.qs { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 11px 12px; background: none; border: none; text-align: left; font-size: 13px; color: var(--text); } .qs :deep(svg) { flex-shrink: 0; color: var(--muted); }
.an { padding: 0 12px 12px; font-size: 13px; color: var(--blue); }
.fm { background: var(--tint); border-radius: var(--r-12); padding: 14px; margin-top: 12px; display: grid; gap: 10px; } .fm h3 { font-size: 14px; }
.rw { display: flex; gap: 8px; } .sd { width: 44px; flex-shrink: 0; border: none; border-radius: var(--r-8); background: var(--navy); color: #fff; display: flex; align-items: center; justify-content: center; }
.wa { display: inline-flex; gap: 8px; align-items: center; justify-content: center; color: var(--navy); font-size: 13px; font-weight: 600; text-decoration: none; } .wa:hover { text-decoration: underline; }
.label.first { margin-top: 0; } .req { color: var(--red); } .ct { font-size: 10px; color: var(--muted); text-align: right; margin: 4px 0 0; }
.sub { width: 100%; margin-top: 14px; padding: 11px; border: none; border-radius: var(--r-8); background: var(--navy); color: #fff; font-weight: 600; font-size: 14px; }
</style>
