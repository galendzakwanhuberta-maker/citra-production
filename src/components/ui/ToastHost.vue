<script setup>
import { toasts } from '../../stores/toast'
</script>
<template>
  <div class="toasts" aria-live="polite">
    <div v-for="t in toasts" :key="t.id" class="toast" :class="{ 'toast--err': t.type === 'err' }" role="status">{{ t.message }}</div>
  </div>
</template>
<style scoped>
.toasts { position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%); z-index: 90; display: flex; flex-direction: column; gap: 8px; width: min(420px, calc(100vw - 32px)); pointer-events: none; }
.toast { background: var(--text); color: #fff; font-size: 14px; padding: 12px 16px; border-radius: var(--r-12); box-shadow: var(--sh-lg); }
.toast--err { background: var(--red); }
</style>
