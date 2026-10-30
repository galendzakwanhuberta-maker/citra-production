<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LogoMark from '../../components/ui/LogoMark.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import { login } from '../../stores/auth'
const route = useRoute(), router = useRouter()
const code = ref(''), bad = ref(false)
function submit() {
  if (login(code.value)) router.replace(typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/admin') ? route.query.redirect : { name: 'admin' })
  else { bad.value = true; code.value = '' }
}
</script>
<template>
  <main class="lg">
    <form class="card box" @submit.prevent="submit">
      <LogoMark :size="48" />
      <h1>Masuk admin</h1>
      <label class="label" for="pc">Kode akses</label>
      <input id="pc" v-model="code" type="password" class="input" :class="{ invalid: bad }" autocomplete="current-password" autofocus @input="bad = false" />
      <p v-if="bad" class="err" role="alert">Kode akses salah. Coba lagi.</p>
      <BaseButton block class="go">Masuk</BaseButton>
      <RouterLink :to="{ name: 'home' }" class="back">Kembali ke website</RouterLink>
    </form>
  </main>
</template>
<style scoped>
.lg { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
.box { width: 100%; max-width: 380px; padding: 28px; display: grid; justify-items: start; box-shadow: var(--sh-md); } h1 { font-size: 22px; margin: 12px 0 4px; } .box .input { margin-bottom: 0; }
.go { margin-top: 18px; } .back { margin-top: 14px; font-size: 13px; color: var(--navy); align-self: center; }
</style>
