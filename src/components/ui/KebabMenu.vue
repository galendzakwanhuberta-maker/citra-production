<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppIcon from './AppIcon.vue'
// items: [{ label, icon, danger }] — emits select(index)
defineProps({ items: { type: Array, required: true }, label: { type: String, default: 'Menu' }, dark: Boolean, align: { type: String, default: 'right' } })
const emit = defineEmits(['select'])
const open = ref(false); const root = ref(null)
const away = (e) => { if (root.value && !root.value.contains(e.target)) open.value = false }
const esc = (e) => { if (e.key === 'Escape') open.value = false }
onMounted(() => { document.addEventListener('click', away); document.addEventListener('keydown', esc) })
onBeforeUnmount(() => { document.removeEventListener('click', away); document.removeEventListener('keydown', esc) })
function pick(i) { open.value = false; emit('select', i) }
</script>
<template>
  <div ref="root" class="kebab">
    <button type="button" class="trg" :class="{ dark }" :aria-label="label" aria-haspopup="menu" :aria-expanded="open" @click.stop="open = !open"><AppIcon name="more" :size="18" /></button>
    <ul v-if="open" class="pn" :class="`pn--${align}`" role="menu">
      <li v-for="(it, i) in items" :key="it.label" role="none">
        <button type="button" role="menuitem" :class="{ danger: it.danger }" @click="pick(i)"><AppIcon v-if="it.icon" :name="it.icon" :size="15" />{{ it.label }}</button>
      </li>
    </ul>
  </div>
</template>
<style scoped>
.kebab { position: relative; display: inline-block; }
.trg { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border: none; background: transparent; border-radius: var(--r-full); color: var(--text); }
.trg:hover { background: var(--bg-soft); } .trg.dark { background: rgba(0,0,0,.55); color: #fff; }
.pn { position: absolute; top: 36px; z-index: 30; min-width: 170px; background: #fff; border: 1px solid var(--border); border-radius: var(--r-8); box-shadow: var(--sh-lg); padding: 4px; }
.pn--right { right: 0; } .pn--left { left: 0; }
.pn button { width: 100%; display: flex; align-items: center; gap: 8px; text-align: left; padding: 9px 10px; border: none; background: none; font-size: 13px; border-radius: var(--r-6); color: var(--text); }
.pn button:hover { background: var(--bg-soft); } .pn .danger { color: var(--red); }
</style>
