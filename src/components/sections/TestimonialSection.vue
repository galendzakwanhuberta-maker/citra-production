<script setup>
import { ref, computed } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import ModalBox from '../ui/ModalBox.vue'
import { state, approvedTestimonials, submitTestimonial, toggleLike, likedState } from '../../stores/store'
import { toast } from '../../stores/toast'
const list = computed(() => approvedTestimonials.value)
const track = ref(null), active = ref(0)
const modal = ref(false), name = ref(''), product = ref(''), text = ref(''), err = ref(''), teaser = ref('')
const MAX = 100
function onScroll() { const el = track.value; if (!el || !list.value.length) return; active.value = Math.round(el.scrollLeft / (el.scrollWidth / list.value.length)) }
function goTo(i) { const el = track.value; if (el) el.scrollTo({ left: (el.scrollWidth / list.value.length) * i, behavior: 'smooth' }) }
function openModal() { text.value = teaser.value; teaser.value = ''; err.value = ''; modal.value = true }
function send() {
  if (text.value.trim().length < 5) { err.value = 'Tulis testimoni minimal 5 karakter.'; return }
  submitTestimonial({ name: name.value, text: text.value, productId: product.value })
  name.value = ''; product.value = ''; text.value = ''; modal.value = false
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
    <form class="fm" @submit.prevent="openModal">
      <h3>Puas dengan pelayanan kami?</h3>
      <div class="rw"><input v-model="teaser" class="input" placeholder="Tulis Testimoni Anda" :maxlength="MAX" aria-label="Tulis testimoni Anda" /><button class="sd" aria-label="Buka form testimoni"><AppIcon name="arrow-right" :size="18" /></button></div>
    </form>

    <ModalBox :open="modal" title="Tambah Testimoni Anda" width="420px" @close="modal = false">
      <form class="mf" novalidate @submit.prevent="send">
        <label class="label first" for="tn">Nama</label><input id="tn" v-model="name" class="input" placeholder="Nama Anda" maxlength="40" />
        <label class="label" for="tp">Produk</label>
        <select id="tp" v-model="product" class="input"><option value="">Pilih Produk (Opsional)</option><option v-for="p in state.products.filter((x) => !x.hidden)" :key="p.id" :value="p.id">{{ p.name }}</option></select>
        <label class="label" for="tt">Testimoni <span class="req">*</span></label>
        <textarea id="tt" v-model="text" class="input" :class="{ invalid: err }" rows="4" placeholder="Tuliskan Testimoni Anda" :maxlength="MAX" />
        <p class="ct">{{ text.length }} dari {{ MAX }} karakter</p><p v-if="err" class="err">{{ err }}</p>
        <button class="sub">Submit Testimoni</button>
      </form>
    </ModalBox>
  </section>
</template>
<style scoped>
.tr { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 6px; scrollbar-width: none; } .tr::-webkit-scrollbar { display: none; }
.tc { flex: 0 0 86%; scroll-snap-align: start; background: #fff; border: 1px solid var(--border); border-radius: var(--r-8); padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.hd { display: flex; align-items: center; gap: 8px; font-size: 13px; } .av { width: 24px; height: 24px; border-radius: 50%; background: var(--tint); color: var(--navy); font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: center; }
.tc p { font-size: 12px; color: #3a4150; flex: 1; } .lk { align-self: flex-end; display: inline-flex; gap: 6px; align-items: center; border: none; background: none; color: var(--muted); font-size: 12px; padding: 4px; } .lk.on { color: var(--navy); } .lk.on :deep(svg) { fill: var(--navy); }
.dd { margin: 10px 0 16px; }
.fm { background: var(--tint); border-radius: var(--r-12); padding: 14px; display: grid; gap: 10px; } .fm h3 { font-size: 14px; }
.rw { display: flex; gap: 8px; } .sd { width: 44px; flex-shrink: 0; border: none; border-radius: var(--r-8); background: var(--navy); color: #fff; display: flex; align-items: center; justify-content: center; }
.label.first { margin-top: 0; } .req { color: var(--red); } .ct { font-size: 10px; color: var(--muted); text-align: right; margin: 4px 0 0; }
.sub { width: 100%; margin-top: 14px; padding: 11px; border: none; border-radius: var(--r-8); background: var(--navy); color: #fff; font-weight: 600; font-size: 14px; }
@media (min-width: 900px) { .tc { flex-basis: calc(33.33% - 8px); } }
</style>
