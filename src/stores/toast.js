import { reactive } from 'vue'
export const toasts = reactive([])
export function toast(message, type = 'ok') {
  const id = Date.now() + Math.random()
  toasts.push({ id, message, type })
  setTimeout(() => { const i = toasts.findIndex((t) => t.id === id); if (i > -1) toasts.splice(i, 1) }, 3400)
}
