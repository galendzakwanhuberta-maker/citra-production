<script setup>
import { computed } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import BaseButton from '../ui/BaseButton.vue'
import { state } from '../../stores/store'
const p = computed(() => state.profile)
const maps = computed(() => p.value.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.value.address)}`)
</script>
<template>
  <section class="container sec" aria-labelledby="hero-title">
    <div class="card hero">
      <div class="im">
        <img v-if="p.heroImage" :src="p.heroImage" :alt="`Foto ${p.title}`" />
        <div v-else class="ph"><AppIcon name="image" :size="40" /></div>
      </div>
      <div class="tx">
        <h1 id="hero-title">{{ p.title }}</h1>
        <p>{{ p.description }}</p>
        <div class="ac">
          <BaseButton as="a" variant="outline" :href="maps" target="_blank" rel="noopener"><template #icon><AppIcon name="map-pin" :size="16" /></template>kunjungi di google maps</BaseButton>
          <BaseButton as="RouterLink" :to="{ name: 'home', hash: '#katalog' }">lihat produk</BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.sec { padding-top: 20px; padding-bottom: 28px; }
.hero { display: grid; gap: 16px; padding: 14px; box-shadow: var(--sh-sm); }
.im { aspect-ratio: 16 / 10; border-radius: var(--r-12); overflow: hidden; background: var(--tint); } .im img, .ph { width: 100%; height: 100%; object-fit: cover; }
h1 { font-size: clamp(24px, 1.2rem + 1.4vw, 38px); line-height: 1.2; font-weight: 700; text-align: center; margin-bottom: 8px; }
p { font-size: 14px; line-height: 22px; text-align: justify; color: #3a4150; margin-bottom: 16px; }
.ac { display: flex; flex-wrap: wrap; gap: 10px; }
@media (min-width: 900px) {
  .hero { grid-template-columns: 1.1fr 1fr; gap: 40px; padding: 28px; align-items: center; } .im { aspect-ratio: 4 / 3; }
  h1 { text-align: left; } p { text-align: left; font-size: 16px; line-height: 26px; }
}
</style>
