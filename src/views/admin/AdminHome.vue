<script setup>
import AdminDashboard from '../../components/admin/AdminDashboard.vue'
import AdminProducts from '../../components/admin/AdminProducts.vue'
import AdminNameList from '../../components/admin/AdminNameList.vue'
import AdminPortfolio from '../../components/admin/AdminPortfolio.vue'
import AdminFaq from '../../components/admin/AdminFaq.vue'
import AdminTestimonials from '../../components/admin/AdminTestimonials.vue'
import AdminContacts from '../../components/admin/AdminContacts.vue'
</script>
<template>
  <div class="a-wrap">
    <AdminDashboard /><AdminProducts />
    <AdminNameList id="kategori" title="Kelola Kategori" hint="Katalog Filter" kind="category" />
    <AdminPortfolio /><AdminFaq /><AdminTestimonials /><AdminContacts />
  </div>
</template>
<style scoped>.warn { background: var(--red-bg); color: var(--red); border-radius: var(--r-8); padding: 12px 14px; font-size: 13px; margin-bottom: 16px; }</style>
