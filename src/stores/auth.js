import { reactive } from 'vue'
import { api, session, setToken, setUnauthorizedHandler } from '../api/client'

// Sesi admin = token Bearer dari POST /admin/login. Kode akses front-end sudah tidak dipakai.
export const auth = reactive({ ok: !!session.token, verified: false, user: null })

export async function login(email, password) {
  const { token } = await api('/admin/login', { method: 'POST', body: { email, password } })
  setToken(token); auth.ok = true; auth.verified = false
  await verify()
}
// Cek token masih berlaku. Mengembalikan true/false (401 sudah menghapus token lewat handler).
export async function verify() {
  if (!session.token) { auth.ok = false; return false }
  try { const { data } = await api('/admin/me', { auth: true }); auth.user = data; auth.ok = true; auth.verified = true; return true }
  catch (e) { if (e.status === 401 || e.status === 0) { clearSession(); return false } throw e }
}
export function clearSession() { setToken(''); auth.ok = false; auth.verified = false; auth.user = null }
export async function logout() {
  try { await api('/admin/logout', { method: 'POST', auth: true }) } catch { /* token tetap dibersihkan di browser */ }
  clearSession()
}
// Token kedaluwarsa/dicabut di tengah jalan → kembali ke halaman masuk.
export const onSessionExpired = (cb) => setUnauthorizedHandler(() => { clearSession(); cb() })
