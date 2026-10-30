<script setup>
import { watch, onMounted, onBeforeUnmount } from 'vue'
import AppIcon from './AppIcon.vue'
const props = defineProps({ open: Boolean, links: { type: Array, required: true } })
const emit = defineEmits(['close'])
const esc = (e) => { if (e.key === 'Escape' && props.open) emit('close') }
onMounted(() => document.addEventListener('keydown', esc)); onBeforeUnmount(() => { document.removeEventListener('keydown', esc); document.body.style.overflow = '' })
watch(() => props.open, (o) => { document.body.style.overflow = o ? 'hidden' : '' })
</script>
<template>
  <Teleport to="body">
    <Transition name="fade"><div v-if="open" class="bd" @click="emit('close')" /></Transition>
    <Transition name="slide">
      <aside v-if="open" class="dr" role="dialog" aria-modal="true" aria-label="Menu">
        <button class="x icon-btn" aria-label="Tutup menu" @click="emit('close')"><AppIcon name="close" :size="18" /></button>
        <nav>
          <RouterLink v-for="l in links" :key="l.label" :to="l.to" @click="emit('close')">{{ l.label }}<span v-if="l.badge" class="bg">{{ l.badge }}</span></RouterLink>
        </nav>
        <div class="ft"><slot name="footer" /></div>
      </aside>
    </Transition>
  </Teleport>
</template>
<style scoped>
.bd { position: fixed; inset: 0; background: rgba(20,24,33,.35); z-index: 60; }
.dr { position: fixed; top: 0; right: 0; bottom: 0; width: min(300px, 82vw); background: var(--tint); z-index: 61; padding: 24px; display: flex; flex-direction: column; align-items: flex-end; overflow-y: auto; }
.x { margin-bottom: 28px; border-color: #AAB5D0; }
nav { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; width: 100%; }
nav a { text-decoration: none; font-weight: 500; padding: 12px 0; font-size: 16px; display: inline-flex; gap: 8px; align-items: center; } nav a:hover { color: var(--navy); }
.bg { background: var(--red); color: #fff; font-size: 11px; border-radius: var(--r-full); padding: 0 7px; line-height: 18px; }
.ft { margin-top: auto; padding-top: 24px; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; width: 100%; }
.slide-enter-active, .slide-leave-active { transition: transform .22s ease; } .slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
