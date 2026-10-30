<script setup>
import { computed } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import { state } from '../../stores/store'
import { formatPhone } from '../../utils/format'
import { useWhatsapp } from '../../composables/useWhatsapp'
const { waLink } = useWhatsapp()
const p = computed(() => state.profile)
const nav = [['beranda', { name: 'home' }], ['katalog produk', { name: 'home', hash: '#katalog' }], ['portofolio', { name: 'home', hash: '#portofolio' }], ['testimoni', { name: 'home', hash: '#testimoni' }], ['FAQ', { name: 'home', hash: '#faq' }]]
const contacts = computed(() => [
  { icon: 'map-pin', text: p.value.address },
  { icon: 'phone', text: `WhatsApp: ${formatPhone(p.value.whatsapp)}`, href: waLink() },
  { icon: 'instagram', text: `Instagram: ${p.value.instagram}`, href: `https://instagram.com/${p.value.instagram.replace('@', '')}` },
  { icon: 'mail', text: p.value.email, href: `mailto:${p.value.email}` },
  ...p.value.links.map((l) => ({ icon: 'link', text: l.label, href: l.url })),
].filter((c) => c.text && !/:\s*$/.test(c.text)))
</script>
<template>
  <footer id="kontak" class="ft">
    <div class="container in">
      <div>
        <h3>Navigasi</h3>
        <nav><RouterLink v-for="[t, to] in nav" :key="t" :to="to">{{ t }}</RouterLink></nav>
      </div>
      <div>
        <h3>Kontak</h3>
        <ul>
          <li v-for="(c, i) in contacts" :key="i">
            <AppIcon :name="c.icon" :size="16" />
            <a v-if="c.href" :href="c.href" target="_blank" rel="noopener">{{ c.text }}</a><span v-else>{{ c.text }}</span>
          </li>
        </ul>
      </div>
    </div>
    <p class="cp container">© {{ new Date().getFullYear() }} Citra Productions</p>
  </footer>
</template>
<style scoped>
.ft { background: #fff; border-top: 1px solid var(--border); padding: 28px 0 24px; }
.in { display: grid; gap: 24px; } h3 { font-size: 16px; font-weight: 700; margin-bottom: 12px; }
nav { display: flex; flex-wrap: wrap; gap: 8px 16px; } nav a { font-size: 13px; color: var(--navy); text-decoration: none; } nav a:hover { text-decoration: underline; }
ul { display: grid; gap: 10px; } li { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: var(--navy); } li :deep(svg) { flex-shrink: 0; margin-top: 2px; color: var(--text); }
li a { color: inherit; text-decoration: none; } li a:hover { text-decoration: underline; }
.cp { margin-top: 24px; font-size: 12px; color: var(--muted); }
@media (min-width: 800px) { .in { grid-template-columns: 1fr 1.4fr; gap: 64px; } }
</style>
