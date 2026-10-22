<script setup>
import { useRoute } from 'vue-router'
import SiteHeader from '../components/layout/SiteHeader.vue'
import SiteFooter from '../components/layout/SiteFooter.vue'
import FloatingWhatsapp from '../components/layout/FloatingWhatsapp.vue'
const route = useRoute()
</script>
<template>
  <SiteHeader />
  <main><RouterView /></main>
  <SiteFooter />
  <FloatingWhatsapp v-if="route.name !== 'product'" />
</template>
