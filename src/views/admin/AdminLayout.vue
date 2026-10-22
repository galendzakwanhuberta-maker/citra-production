<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import LogoMark from '../../components/ui/LogoMark.vue'
import AppIcon from '../../components/ui/AppIcon.vue'
import SideDrawer from '../../components/ui/SideDrawer.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import { adminLinks } from '../../config/nav'
import { pendingFaqs, pendingTestimonials } from '../../stores/store'
import { logout } from '../../stores/auth'
const router = useRouter(); const open = ref(false)
const links = computed(() => adminLinks.map((l) => ({ ...l, badge: l.id === 'faq' ? pendingFaqs.value.length || '' : l.id === 'testimoni' ? pendingTestimonials.value.length || '' : '' })))
function out() { open.value = false; logout(); router.replace({ name: 'admin-login' }) }
</script>
<template>
  <header class="hd">
    <div class="a-wrap in">
      <RouterLink :to="{ name: 'admin' }" class="brand" aria-label="Dashboard admin"><LogoMark :size="30" /><span class="n">Citra</span><span class="s">Productions</span></RouterLink>
      <div class="rt"><span class="badge badge--on">admin</span><button class="icon-btn mn" aria-label="Buka menu admin" @click="open = true"><AppIcon name="menu" :size="22" /></button></div>
    </div>
    <SideDrawer :open="open" :links="links" @close="open = false">
      <template #footer>
        <BaseButton as="RouterLink" variant="outline" size="small" :to="{ name: 'home' }" @click="open = false">Lihat website</BaseButton>
        <BaseButton variant="danger" size="small" @click="out"><template #icon><AppIcon name="logout" :size="14" /></template>Keluar</BaseButton>
      </template>
    </SideDrawer>
  </header>
  <main class="mn-pad"><RouterView /></main>
</template>
<style scoped>
.hd { position: sticky; top: 0; z-index: 40; background: #fff; border-bottom: 1px solid var(--border); } .in { display: flex; align-items: center; justify-content: space-between; height: 60px; }
.brand { display: flex; align-items: center; gap: 6px; text-decoration: none; } .n { font-family: Georgia, serif; font-weight: 700; font-size: 24px; color: var(--red); } .s { font-family: Georgia, serif; font-style: italic; font-weight: 700; font-size: 10px; color: var(--navy); align-self: flex-end; padding-bottom: 5px; }
.rt { display: flex; align-items: center; gap: 10px; } .mn { border: none; background: none; }
.mn-pad { padding-top: 20px; padding-bottom: 40px; }
</style>
