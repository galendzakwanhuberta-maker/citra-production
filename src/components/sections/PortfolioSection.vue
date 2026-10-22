<script setup>
import { ref, computed, watch } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import { visiblePortfolio } from '../../stores/store'
import { useSwipe } from '../../composables/useSwipe'
const i = ref(0)
const items = computed(() => visiblePortfolio.value)
watch(() => items.value.length, (n) => { if (i.value >= n) i.value = 0 })
const next = () => { if (items.value.length) i.value = (i.value + 1) % items.value.length }
const prev = () => { if (items.value.length) i.value = (i.value - 1 + items.value.length) % items.value.length }
const swipe = useSwipe(next, prev)
</script>
<template>
  <section v-if="items.length" id="portofolio" class="container section" aria-labelledby="pf">
    <h2 id="pf" class="section-title">Portofolio Bisnis</h2>
    <div class="card">
      <div class="fr" v-on="swipe">
        <img v-if="items[i].src" :src="items[i].src" :alt="items[i].title" />
        <div v-else class="ph"><AppIcon name="image" :size="40" /></div>
        <span class="cap">{{ items[i].title }}</span>
        <template v-if="items.length > 1">
          <button class="nv l" aria-label="Sebelumnya" @click="prev"><AppIcon name="chevron-left" :size="20" /></button>
          <button class="nv r" aria-label="Berikutnya" @click="next"><AppIcon name="chevron-right" :size="20" /></button>
        </template>
      </div>
      <div v-if="items.length > 1" class="dots"><button v-for="(it, k) in items" :key="it.id" class="dot" :class="{ 'dot--active': k === i }" :aria-label="`Portofolio ${k + 1}`" @click="i = k" /></div>
    </div>
  </section>
</template>
<style scoped>
.card { padding: 12px; } .fr { position: relative; aspect-ratio: 16 / 10; border-radius: var(--r-12); overflow: hidden; background: var(--tint); margin-bottom: 12px; touch-action: pan-y; } .fr img, .ph { width: 100%; height: 100%; object-fit: cover; }
.cap { position: absolute; left: 10px; bottom: 10px; background: rgba(0,0,0,.6); color: #fff; font-size: 12px; padding: 3px 10px; border-radius: var(--r-6); }
.nv { position: absolute; top: 50%; transform: translateY(-50%); width: 38px; height: 38px; border: none; border-radius: 50%; background: rgba(255,255,255,.92); box-shadow: var(--sh-md); display: none; align-items: center; justify-content: center; } .l { left: 12px; } .r { right: 12px; }
@media (min-width: 700px) { .nv { display: flex; } .fr { aspect-ratio: 21 / 8; } .card { padding: 16px; } }
</style>
