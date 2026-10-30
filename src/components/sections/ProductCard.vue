<script setup>
import { computed } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import { nameOf, coverOf } from '../../stores/store'
import { priceLabel } from '../../utils/format'
const props = defineProps({ product: { type: Object, required: true }, layout: { type: String, default: 'list' } })
const cover = computed(() => coverOf(props.product))
</script>
<template>
  <RouterLink :to="{ name: 'product', params: { id: product.id } }" class="pc" :class="`pc--${layout}`">
    <div class="im">
      <img v-if="cover" :src="cover" :alt="product.altText || product.name" loading="lazy" />
      <div v-else class="ph"><AppIcon name="image" :size="22" /></div>
    </div>
    <div class="bd">
      <p class="ct">{{ nameOf('categories', product.categoryId) }}</p>
      <h3>{{ product.name }}</h3>
      <p class="pr">{{ priceLabel(product) }}</p>
    </div>
    <span class="cta">Detail</span>
  </RouterLink>
</template>
<style scoped>
.pc { display: flex; align-items: center; gap: 12px; padding: 10px; background: #fff; border: 1px solid var(--border); border-radius: var(--r-12); text-decoration: none; transition: box-shadow .15s, border-color .15s; }
.pc:hover { box-shadow: var(--sh-md); border-color: #C9D2E6; }
.im { width: 64px; height: 64px; flex-shrink: 0; border-radius: var(--r-8); overflow: hidden; } .im img, .ph { width: 100%; height: 100%; object-fit: cover; }
.bd { flex: 1; min-width: 0; } .ct { font-size: 11px; color: var(--navy); } h3 { font-size: 16px; font-weight: 700; margin: 1px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .pr { font-size: 12px; color: var(--muted); }
.cta { background: var(--tint); color: var(--navy); font-weight: 600; font-size: 12px; padding: 7px 14px; border-radius: var(--r-full); }
.pc--grid { flex-direction: column; align-items: stretch; padding: 12px; gap: 12px; } .pc--grid .im { width: 100%; height: auto; aspect-ratio: 4 / 3; } .pc--grid .cta { text-align: center; }
</style>
