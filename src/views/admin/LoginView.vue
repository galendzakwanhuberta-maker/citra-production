<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LogoMark from '../../components/ui/LogoMark.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import { login } from '../../stores/auth'
import { errMsg } from '../../api/client'
const route = useRoute(), router = useRouter()
const email = ref(''), password = ref(''), error = ref(''), busy = ref(false)
async function submit() {
  error.value = ''
  if (!email.value.trim() || !password.value) { error.value = 'Email dan password wajib diisi.'; return }
  busy.value = true
  try {
    await login(email.value.trim(), password.value)
    router.replace(typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/admin') ? route.query.redirect : { name: 'admin' })
  } catch (e) { error.value = errMsg(e); password.value = '' }
  finally { busy.value = false }
}
</script>
<template>
  <main class="lg">
    <form class="card box" novalidate @submit.prevent="submit">
      <LogoMark :size="48" />
      <h1>Masuk admin</h1>
      <label class="label" for="em">Email</label>
      <input id="em" v-model="email" type="email" class="input" :class="{ invalid: error }" autocomplete="username" autofocus />
      <label class="label" for="pc">Password</label>
      <input id="pc" v-model="password" type="password" class="input" :class="{ invalid: error }" autocomplete="current-password" />
      <p v-if="error" class="err" role="alert">{{ error }}</p>
      <BaseButton block class="go" :loading="busy">Masuk</BaseButton>
      <RouterLink :to="{ name: 'home' }" class="back">Kembali ke website</RouterLink>
    </form>
  </main>
</template>
<style scoped>
.lg { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
.box { width: 100%; max-width: 380px; padding: 28px; display: grid; justify-items: start; box-shadow: var(--sh-md); } h1 { font-size: 22px; margin: 12px 0 4px; } .box .input { margin-bottom: 0; }
.go { margin-top: 18px; } .back { margin-top: 14px; font-size: 13px; color: var(--navy); align-self: center; }
</style>
