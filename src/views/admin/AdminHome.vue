<script setup>
import { state } from '../../stores/store'
import AdminDashboard from '../../components/admin/AdminDashboard.vue'
import AdminHero from '../../components/admin/AdminHero.vue'
import AdminProducts from '../../components/admin/AdminProducts.vue'
import AdminNameList from '../../components/admin/AdminNameList.vue'
import AdminPortfolio from '../../components/admin/AdminPortfolio.vue'
import AdminFaq from '../../components/admin/AdminFaq.vue'
import AdminTestimonials from '../../components/admin/AdminTestimonials.vue'
import AdminContacts from '../../components/admin/AdminContacts.vue'
</script>
<template>
  <div class="a-wrap">
    <p v-if="state.saveError" class="warn" role="alert">Perubahan belum bisa disimpan di browser ini (penyimpanan penuh atau diblokir). Kurangi ukuran/jumlah foto, atau keluar dari mode privat.</p>
    <AdminDashboard /><AdminHero /><AdminProducts />
    <AdminNameList id="kategori" title="Kelola Kategori" hint="Katalog Filter" kind="category" />
    <AdminNameList id="packaging" title="Kelola Packaging" hint="Katalog Filter" kind="packaging" />
    <AdminPortfolio /><AdminFaq /><AdminTestimonials /><AdminContacts />
  </div>
</template>
<style scoped>.warn { background: var(--red-bg); color: var(--red); border-radius: var(--r-8); padding: 12px 14px; font-size: 13px; margin-bottom: 16px; }</style>
