<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import { pageItems } from '../../utils/format'
const props = defineProps({ page: Number, total: Number })
const emit = defineEmits(['update:page'])
const items = computed(() => pageItems(props.page, props.total))
const go = (n) => { if (n >= 1 && n <= props.total && n !== props.page) emit('update:page', n) }
</script>
<template>
  <nav v-if="total > 1" class="pg" aria-label="Halaman">
    <button class="p" :disabled="page === 1" aria-label="Sebelumnya" @click="go(page - 1)"><AppIcon name="chevron-left" :size="14" /></button>
    <template v-for="(it, i) in items" :key="i">
      <span v-if="it === '…'" class="el">…</span>
      <button v-else class="p" :class="{ on: it === page }" :aria-current="it === page ? 'page' : undefined" @click="go(it)">{{ it }}</button>
    </template>
    <button class="p" :disabled="page === total" aria-label="Berikutnya" @click="go(page + 1)"><AppIcon name="chevron-right" :size="14" /></button>
  </nav>
</template>
<style scoped>
.pg { display: flex; justify-content: center; align-items: center; gap: 8px; }
.p { min-width: 30px; height: 30px; padding: 0 6px; border-radius: var(--r-8); border: 1px solid var(--border); background: #fff; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }
.p.on { background: var(--navy); border-color: var(--navy); color: #fff; } .p:disabled { opacity: .4; cursor: default; } .el { color: var(--muted); }
</style>
