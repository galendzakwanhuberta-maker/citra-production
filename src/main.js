import './styles/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { loadPublic } from './stores/store'
import { onSessionExpired } from './stores/auth'
import { resetAdmin } from './stores/admin'
import { toast } from './stores/toast'

// Token kedaluwarsa / dicabut → bersihkan sesi lalu kembali ke halaman masuk.
onSessionExpired(() => { resetAdmin(); if (router.currentRoute.value.meta?.admin || router.currentRoute.value.matched.some((r) => r.meta.admin)) { toast('Sesi berakhir. Silakan masuk lagi.', 'err'); router.replace({ name: 'admin-login' }) } })
loadPublic()
createApp(App).use(router).mount('#app')
