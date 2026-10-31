<script setup>
import { ref, computed, watch } from 'vue'
import PaginationBar from '../ui/PaginationBar.vue'
import { state } from '../../stores/store'
import PortfolioItem from './PortfolioItem.vue'
const page = ref(1), per = 2
const total = computed(() => Math.max(1, Math.ceil(state.portfolios.length / per)))
const paged = computed(() => state.portfolios.slice((page.value - 1) * per, page.value * per))
watch(total, (t) => { if (page.value > t) page.value = t })
</script>
<template>
  <section v-if="state.portfolios.length" id="portofolio" class="container section" aria-labelledby="pf">
    <h2 id="pf" class="section-title">Portofolio</h2>
    <div class="card">
      <PortfolioItem v-for="p in paged" :key="p.id" :item="p" />
      <PaginationBar v-model:page="page" :total="total" />
    </div>
  </section>
</template>
<style scoped>.card { padding: 6px 14px 14px; }</style>
