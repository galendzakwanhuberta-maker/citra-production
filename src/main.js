import './styles/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initStore } from './stores/store'

// Muat data tersimpan dulu, baru tampilkan aplikasi.
initStore().finally(() => createApp(App).use(router).mount('#app'))
