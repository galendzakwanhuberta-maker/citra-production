<script setup>
import AppIcon from './AppIcon.vue'
import { watch } from 'vue'
const props = defineProps({ open: Boolean, title: String, message: String, confirmLabel: { type: String, default: 'hapus' }, danger: { type: Boolean, default: true } })
const emit = defineEmits(['confirm', 'cancel'])
watch(() => props.open, (o) => { document.body.style.overflow = o ? 'hidden' : '' })
</script>
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="bd" @click.self="emit('cancel')" @keydown.esc="emit('cancel')">
        <div class="md" role="dialog" aria-modal="true" :aria-label="title">
          <button class="x icon-btn" aria-label="Tutup" @click="emit('cancel')"><AppIcon name="close" :size="16" /></button>
          <h3>{{ title }}</h3>
          <p v-if="message" class="muted">{{ message }}</p>
          <div class="acts">
            <button class="b b--ghost" @click="emit('cancel')">batal</button>
            <button class="b" :class="danger ? 'b--danger' : 'b--primary'" @click="emit('confirm')">{{ confirmLabel }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<style scoped>
.bd { position: fixed; inset: 0; background: rgba(20,24,33,.5); display: flex; align-items: center; justify-content: center; z-index: 80; padding: 20px; }
.md { position: relative; background: #fff; border-radius: var(--r-12); padding: 24px; width: 100%; max-width: 380px; box-shadow: var(--sh-xl); }
.x { position: absolute; top: 12px; right: 12px; width: 30px; height: 30px; }
h3 { font-size: 16px; font-weight: 700; margin: 28px 0 4px; } p { font-size: 14px; }
.acts { display: flex; gap: 12px; margin-top: 20px; }
.b { padding: 9px 18px; border-radius: var(--r-8); border: 1.5px solid transparent; font-weight: 600; font-size: 14px; }
.b--ghost { background: #fff; border-color: var(--navy); color: var(--navy); }
.b--danger { background: var(--red); color: #fff; } .b--primary { background: var(--navy); color: #fff; }
</style>
