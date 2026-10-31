<script setup>
import { useRoute } from 'vue-router'
import SiteHeader from '../components/layout/SiteHeader.vue'
import SiteFooter from '../components/layout/SiteFooter.vue'
import FloatingWhatsapp from '../components/layout/FloatingWhatsapp.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { state, loadPublic } from '../stores/store'
const route = useRoute()
</script>
<template>
  <SiteHeader />
  <main>
    <div v-if="state.status === 'error'" class="container er" role="alert">
      <div class="card"><h2>Data belum bisa dimuat</h2><p class="muted">{{ state.error }}</p><BaseButton @click="loadPublic">Coba lagi</BaseButton></div>
    </div>
    <p v-else-if="state.status === 'loading' || state.status === 'idle'" class="container ld muted" role="status">Memuat data…</p>
    <RouterView v-if="state.status === 'ready' || route.name === 'search'" />
  </main>
  <SiteFooter />
  <FloatingWhatsapp v-if="route.name !== 'product'" />
</template>
<style scoped>.er { padding-top: 40px; } .er .card { display: grid; gap: 10px; justify-items: start; padding: 24px; } .er h2 { font-size: 18px; } .ld { padding: 60px 20px; text-align: center; }</style>
