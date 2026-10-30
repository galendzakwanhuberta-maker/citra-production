<script setup>
import { ref } from 'vue'
import LogoMark from '../ui/LogoMark.vue'
import AppIcon from '../ui/AppIcon.vue'
import SideDrawer from '../ui/SideDrawer.vue'
import { publicLinks } from '../../config/nav'
const open = ref(false)
</script>
<template>
  <header class="hd">
    <div class="container in">
      <RouterLink :to="{ name: 'home' }" class="brand" aria-label="Citra Productions, ke beranda">
        <LogoMark :size="34" /><span class="n">Citra</span><span class="s">Productions</span>
      </RouterLink>
      <nav class="dk" aria-label="Navigasi utama">
        <RouterLink v-for="l in publicLinks" :key="l.label" :to="l.to">{{ l.label }}</RouterLink>
      </nav>
      <button class="mn icon-btn" aria-label="Buka menu" @click="open = true"><AppIcon name="menu" :size="22" /></button>
    </div>
    <SideDrawer :open="open" :links="publicLinks" @close="open = false" />
  </header>
</template>
<style scoped>
.hd { position: sticky; top: 0; z-index: 40; background: #fff; border-bottom: 1px solid var(--border); }
.in { display: flex; align-items: center; justify-content: space-between; height: 64px; }
.brand { display: flex; align-items: center; gap: 6px; text-decoration: none; }
.n { font-family: Georgia, 'Times New Roman', serif; font-weight: 700; font-size: 26px; color: var(--red); letter-spacing: .5px; line-height: 1; }
.s { font-family: Georgia, serif; font-style: italic; font-weight: 700; font-size: 11px; color: var(--navy); align-self: flex-end; padding-bottom: 6px; }
.mn { border: none; background: none; }
.dk { display: none; }
@media (min-width: 960px) {
  .dk { display: flex; gap: 28px; } .mn { display: none; }
  .dk a { text-decoration: none; font-size: 14px; font-weight: 500; padding: 6px 0; border-bottom: 2px solid transparent; } .dk a:hover { color: var(--navy); border-color: var(--blue); }
}
</style>
