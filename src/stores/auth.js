import { reactive } from 'vue'
import { siteConfig } from '../config/site'
const K = 'citra-admin'
const get = () => { try { return sessionStorage.getItem(K) === '1' } catch { return false } }
const set = (v) => { try { v ? sessionStorage.setItem(K, '1') : sessionStorage.removeItem(K) } catch {} }
export const auth = reactive({ ok: get() })
export function login(code) { if (code === siteConfig.adminPasscode) { auth.ok = true; set(true); return true } return false }
export function logout() { auth.ok = false; set(false) }
