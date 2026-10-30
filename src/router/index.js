import { createRouter, createWebHashHistory } from 'vue-router'
import { auth } from '../stores/auth'
import PublicLayout from '../views/PublicLayout.vue'
import HomeView from '../views/HomeView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import SearchView from '../views/SearchView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: PublicLayout, children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'cari', name: 'search', component: SearchView },
      { path: 'produk/:id', name: 'product', component: ProductDetailView, props: true },
    ] },
    { path: '/admin/login', name: 'admin-login', component: () => import('../views/admin/LoginView.vue') },
    { path: '/admin', component: () => import('../views/admin/AdminLayout.vue'), meta: { admin: true }, children: [
      { path: '', name: 'admin', component: () => import('../views/admin/AdminHome.vue') },
      { path: 'produk-kategori', name: 'admin-products', component: () => import('../views/admin/pages/ProductsPage.vue') },
      { path: 'portofolio', name: 'admin-portfolio', component: () => import('../views/admin/pages/PortfolioPage.vue') },
      { path: 'testimoni', name: 'admin-testimonials', component: () => import('../views/admin/pages/TestimonialsPage.vue') },
      { path: 'faq', name: 'admin-faq', component: () => import('../views/admin/pages/FaqPage.vue') },
      { path: 'kontak', name: 'admin-contacts', component: () => import('../views/admin/pages/ContactsPage.vue') },
      { path: 'kontak/edit', name: 'admin-contacts-edit', component: () => import('../views/admin/ContactEditView.vue') },
      { path: 'produk/baru', name: 'admin-product-new', component: () => import('../views/admin/ProductFormView.vue') },
      { path: 'produk/:id', name: 'admin-product-edit', component: () => import('../views/admin/ProductFormView.vue'), props: true },
    ] },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, _from, saved) {
    if (to.hash) return { el: to.hash, top: 84, behavior: 'smooth' }
    return saved || { top: 0 }
  },
})
router.beforeEach((to) => {
  if (to.matched.some((r) => r.meta.admin) && !auth.ok) return { name: 'admin-login', query: { redirect: to.fullPath } }
})
export default router
