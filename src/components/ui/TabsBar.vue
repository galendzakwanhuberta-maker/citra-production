<script setup>
defineProps({ tabs: { type: Array, required: true }, modelValue: String })
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <div class="tb" role="tablist">
    <button v-for="t in tabs" :key="t.key" role="tab" :aria-selected="modelValue === t.key" class="tab" :class="{ on: modelValue === t.key }" @click="emit('update:modelValue', t.key)">{{ t.label }}<span class="ct">{{ t.count }}</span></button>
  </div>
</template>
<style scoped>
.tb { display: flex; gap: 20px; border-bottom: 1px solid var(--border); margin-bottom: 14px; overflow-x: auto; }
.tab { border: none; background: none; padding: 8px 0 10px; font-size: 13px; color: var(--muted); border-bottom: 2px solid transparent; margin-bottom: -1px; white-space: nowrap; display: inline-flex; gap: 6px; align-items: center; } .tab.on { color: var(--navy); font-weight: 700; border-color: var(--navy); }
.ct { background: var(--tint); color: var(--navy); font-size: 10px; min-width: 18px; padding: 0 5px; border-radius: var(--r-full); line-height: 16px; text-align: center; }
</style>
