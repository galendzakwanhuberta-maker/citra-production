<script setup>
import { watch, onBeforeUnmount } from 'vue'
import AppIcon from './AppIcon.vue'
// Kotak dialog generik: judul, subjudul, tombol tutup, slot isi + slot footer.
const props = defineProps({ open: Boolean, title: String, subtitle: String, width: { type: String, default: '420px' }, icon: String, tone: { type: String, default: 'info' }, closable: { type: Boolean, default: true } })
const emit = defineEmits(['close'])
watch(() => props.open, (o) => { document.body.style.overflow = o ? 'hidden' : '' })
onBeforeUnmount(() => { document.body.style.overflow = '' })
</script>
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="bd" @click.self="closable && emit('close')" @keydown.esc="closable && emit('close')">
        <div class="md" role="dialog" aria-modal="true" :aria-label="title" :style="{ maxWidth: width }">
          <button v-if="closable && !icon" class="x" aria-label="Tutup" @click="emit('close')"><AppIcon name="close" :size="16" /></button>
          <span v-if="icon" class="ic" :class="`ic--${tone}`"><AppIcon :name="icon" :size="16" /></span>
          <h3>{{ title }}</h3>
          <p v-if="subtitle" class="sub">{{ subtitle }}</p>
          <slot />
          <div v-if="$slots.footer" class="ft"><slot name="footer" /></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<style scoped>
.bd { position: fixed; inset: 0; background: rgba(20,24,33,.5); display: flex; align-items: center; justify-content: center; z-index: 80; padding: 16px; overflow-y: auto; }
.md { position: relative; background: #fff; border-radius: var(--r-12); padding: 20px; width: 100%; box-shadow: var(--sh-xl); }
.x { position: absolute; top: 14px; right: 14px; width: 28px; height: 28px; border: none; background: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; } .x:hover { background: var(--bg-soft); }
h3 { font-size: 16px; font-weight: 700; margin: 0 28px 4px 0; } .ic + h3 { margin-top: 12px; } .sub { font-size: 12px; color: var(--muted); margin-bottom: 14px; }
.ic { width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; } .ic--info { background: var(--tint); color: var(--navy); } .ic--danger { background: var(--red-bg); color: var(--red); }
.ft { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
</style>
