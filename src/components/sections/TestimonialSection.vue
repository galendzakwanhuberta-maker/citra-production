<script setup>
import { ref, computed } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import { approvedTestimonials, submitTestimonial, toggleLike, likedState } from '../../stores/store'
import { toast } from '../../stores/toast'
const list = computed(() => approvedTestimonials.value)
const track = ref(null), active = ref(0)
const name = ref(''), text = ref('')
function onScroll() { const el = track.value; if (!el || !list.value.length) return; active.value = Math.round(el.scrollLeft / (el.scrollWidth / list.value.length)) }
function goTo(i) { const el = track.value; if (el) el.scrollTo({ left: (el.scrollWidth / list.value.length) * i, behavior: 'smooth' }) }
function send() {
  if (text.value.trim().length < 5) return toast('Tulis testimoni minimal 5 karakter.', 'err')
  submitTestimonial({ name: name.value, text: text.value }); name.value = ''; text.value = ''
  toast('Terima kasih! Testimoni kamu tampil setelah disetujui admin.')
}
</script>
<template>
  <section id="testimoni" class="container section" aria-labelledby="ts">
    <h2 id="ts" class="section-title">Testimoni Pelanggan</h2>
    <div v-if="list.length" class="tr" ref="track" @scroll.passive="onScroll">
      <article v-for="t in list" :key="t.id" class="tc">
        <div class="hd"><span class="av">{{ t.name.charAt(0).toUpperCase() }}</span><strong>{{ t.name }}</strong></div>
        <p>{{ t.text }}</p>
        <button class="lk" :class="{ on: likedState.ids.includes(t.id) }" :aria-pressed="likedState.ids.includes(t.id)" :aria-label="`Suka testimoni ${t.name}`" @click="toggleLike(t.id)"><AppIcon name="thumbs-up" :size="16" /><span>{{ t.likes }}</span></button>
      </article>
    </div>
    <p v-else class="muted">Belum ada testimoni. Jadilah yang pertama!</p>
    <div v-if="list.length > 1" class="dots dd"><button v-for="(t, i) in list" :key="t.id" class="dot" :class="{ 'dot--active': i === active }" :aria-label="`Testimoni ${i + 1}`" @click="goTo(i)" /></div>
    <form class="fm" @submit.prevent="send">
      <h3>Puas dengan pelayanan kami?</h3>
      <input v-model="name" class="input" placeholder="Nama (boleh dikosongkan)" maxlength="40" aria-label="Nama" />
      <div class="rw"><input v-model="text" class="input" placeholder="Tulis testimoni Anda" maxlength="240" aria-label="Testimoni" /><button class="sd" aria-label="Kirim testimoni"><AppIcon name="arrow-right" :size="18" /></button></div>
    </form>
  </section>
</template>
<style scoped>
.tr { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 6px; scrollbar-width: none; } .tr::-webkit-scrollbar { display: none; }
.tc { flex: 0 0 86%; scroll-snap-align: start; background: #fff; border: 1px solid var(--border); border-radius: var(--r-12); padding: 14px; display: flex; flex-direction: column; gap: 8px; }
.hd { display: flex; align-items: center; gap: 8px; } .av { width: 28px; height: 28px; border-radius: 50%; background: var(--tint); color: var(--navy); font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center; }
.tc p { font-size: 13px; color: #3a4150; flex: 1; } .lk { align-self: flex-end; display: inline-flex; gap: 6px; align-items: center; border: none; background: none; color: var(--muted); font-size: 12px; padding: 4px; } .lk.on { color: var(--navy); } .lk.on :deep(svg) { fill: var(--navy); }
.dd { margin: 10px 0 16px; }
.fm { background: var(--tint); border-radius: var(--r-12); padding: 14px; display: grid; gap: 10px; max-width: 560px; } .fm h3 { font-size: 15px; }
.rw { display: flex; gap: 8px; } .sd { width: 44px; flex-shrink: 0; border: none; border-radius: var(--r-8); background: var(--navy); color: #fff; display: flex; align-items: center; justify-content: center; }
@media (min-width: 900px) { .tc { flex-basis: calc(33.33% - 8px); } }
</style>
