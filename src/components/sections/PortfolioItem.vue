<script setup>
import { ref, computed } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import { useSwipe } from '../../composables/useSwipe'
// Satu baris portofolio: judul + deskripsi di kiri, carousel gambar di kanan.
const props = defineProps({ item: { type: Object, required: true } })
const i = ref(0), n = computed(() => props.item.images.length)
const next = () => { if (n.value) i.value = (i.value + 1) % n.value }
const prev = () => { if (n.value) i.value = (i.value - 1 + n.value) % n.value }
const swipe = useSwipe(next, prev)
</script>
<template>
  <article class="pi">
    <div class="tx"><h3>{{ item.title }}</h3><p>{{ item.description }}</p></div>
    <div class="cv">
      <div class="fr" v-on="swipe">
        <img v-if="n" :src="item.images[i].src" :alt="item.images[i].alt || `${item.title} (gambar ${i + 1} dari ${n})`" loading="lazy" />
        <div v-else class="ph"><AppIcon name="image" :size="34" /></div>
        <template v-if="n > 1">
          <button class="nv l" aria-label="Gambar sebelumnya" @click="prev"><AppIcon name="chevron-left" :size="18" /></button>
          <button class="nv r" aria-label="Gambar berikutnya" @click="next"><AppIcon name="chevron-right" :size="18" /></button>
        </template>
      </div>
      <p class="cap">{{ item.title }}</p>
      <div v-if="n > 1" class="dots"><button v-for="(im, k) in item.images" :key="im.id" class="dot" :class="{ 'dot--active': k === i }" :aria-label="`Gambar ${k + 1}`" @click="i = k" /></div>
    </div>
  </article>
</template>
<style scoped>
.pi { display: grid; gap: 12px; padding: 16px 0; border-bottom: 1px solid var(--border); } .pi:last-of-type { border-bottom: none; }
.tx h3 { font-size: 16px; margin-bottom: 4px; } .tx p { font-size: 13px; color: var(--muted); }
.cv { border: 1px solid var(--border); border-radius: var(--r-8); padding: 6px 6px 8px; background: #fff; }
.fr { position: relative; aspect-ratio: 16 / 10; border-radius: var(--r-6); overflow: hidden; background: var(--tint); touch-action: pan-y; } .fr img, .ph { width: 100%; height: 100%; object-fit: cover; } .ph { display: flex; align-items: center; justify-content: center; color: var(--muted); }
.cap { font-size: 12px; margin: 6px 2px; } .dots { padding-bottom: 2px; }
.nv { position: absolute; top: 50%; transform: translateY(-50%); width: 30px; height: 30px; border: none; border-radius: 50%; background: rgba(255,255,255,.92); box-shadow: var(--sh-md); display: flex; align-items: center; justify-content: center; } .l { left: 8px; } .r { right: 8px; }
@media (min-width: 700px) { .pi { grid-template-columns: 1fr 1.1fr; gap: 24px; align-items: center; } .tx { padding-left: 24px; } .tx h3 { font-size: 18px; } }
</style>
