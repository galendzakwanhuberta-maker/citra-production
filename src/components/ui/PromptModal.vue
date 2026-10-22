<script setup>
import { ref, watch, nextTick } from 'vue'
import AppIcon from './AppIcon.vue'
const props = defineProps({ open: Boolean, title: String, label: String, initial: { type: String, default: '' }, multiline: Boolean, confirmLabel: { type: String, default: 'simpan' }, hint: String, required: { type: Boolean, default: true } })
const emit = defineEmits(['confirm', 'cancel'])
const text = ref(''); const field = ref(null); const showErr = ref(false)
watch(() => props.open, async (o) => { if (o) { text.value = props.initial; showErr.value = false; await nextTick(); field.value?.focus() } })
function submit() { if (props.required && !text.value.trim()) { showErr.value = true; return } emit('confirm', text.value) }
</script>
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="bd" @click.self="emit('cancel')" @keydown.esc="emit('cancel')">
        <form class="md" role="dialog" aria-modal="true" :aria-label="title" @submit.prevent="submit">
          <button type="button" class="x icon-btn" aria-label="Tutup" @click="emit('cancel')"><AppIcon name="close" :size="16" /></button>
          <h3>{{ title }}</h3>
          <p v-if="hint" class="muted hint">{{ hint }}</p>
          <label class="label">{{ label }}</label>
          <textarea v-if="multiline" ref="field" v-model="text" class="input" :class="{ invalid: showErr }" rows="4" />
          <input v-else ref="field" v-model="text" class="input" :class="{ invalid: showErr }" maxlength="80" />
          <p v-if="showErr" class="err">Bagian ini wajib diisi.</p>
          <div class="acts">
            <button type="button" class="b b--ghost" @click="emit('cancel')">batal</button>
            <button type="submit" class="b b--primary">{{ confirmLabel }}</button>
          </div>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>
<style scoped>
.bd { position: fixed; inset: 0; background: rgba(20,24,33,.5); display: flex; align-items: center; justify-content: center; z-index: 80; padding: 20px; }
.md { position: relative; background: #fff; border-radius: var(--r-12); padding: 24px; width: 100%; max-width: 420px; box-shadow: var(--sh-xl); }
.x { position: absolute; top: 12px; right: 12px; width: 30px; height: 30px; }
h3 { font-size: 16px; font-weight: 700; margin-right: 28px; } .hint { font-size: 13px; margin-top: 4px; } .label { margin-top: 16px; }
.acts { display: flex; gap: 12px; margin-top: 20px; }
.b { padding: 9px 18px; border-radius: var(--r-8); border: 1.5px solid transparent; font-weight: 600; font-size: 14px; }
.b--ghost { background: #fff; border-color: var(--navy); color: var(--navy); } .b--primary { background: var(--navy); color: #fff; }
</style>
