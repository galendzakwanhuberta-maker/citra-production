<script setup>
import AppIcon from '../ui/AppIcon.vue'
import { useWhatsapp } from '../../composables/useWhatsapp'
const { waLink } = useWhatsapp()
</script>
<template>
  <a class="fab" :href="waLink()" target="_blank" rel="noopener" aria-label="Tanya via WhatsApp"><AppIcon name="chat" :size="26" /></a>
</template>
<style scoped>
.fab { position: fixed; right: 18px; bottom: 18px; z-index: 35; width: 54px; height: 54px; border-radius: var(--r-full); background: var(--green); color: #063d1a; display: flex; align-items: center; justify-content: center; box-shadow: var(--sh-lg); }
.fab:hover { filter: brightness(1.05); }
</style>
