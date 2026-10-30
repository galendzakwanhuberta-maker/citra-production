<script setup>
import { ref, computed, watch } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import PaginationBar from '../ui/PaginationBar.vue'
import { visiblePortfolio } from '../../stores/store'
import { useSwipe } from '../../composables/useSwipe'
import PortfolioItem from './PortfolioItem.vue'
const page = ref(1), per = 2
const total = computed(() => Math.max(1, Math.ceil(visiblePortfolio.value.length / per)))
const paged = computed(() => visiblePortfolio.value.slice((page.value - 1) * per, page.value * per))
watch(total, (t) => { if (page.value > t) page.value = t })
</script>
<template>
  <section v-if="visiblePortfolio.length" id="portofolio" class="container section" aria-labelledby="pf">
    <h2 id="pf" class="section-title">Portofolio</h2>
    <div class="card">
      <PortfolioItem v-for="p in paged" :key="p.id" :item="p" />
      <PaginationBar v-model:page="page" :total="total" />
    </div>
  </section>
</template>
<style scoped>.card { padding: 6px 14px 14px; }</style>
