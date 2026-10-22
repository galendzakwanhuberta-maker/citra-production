import { state } from '../stores/store'
export function useWhatsapp() {
  const waLink = (msg = 'Halo, saya ingin bertanya tentang produk Citra Productions') =>
    `https://wa.me/${state.profile.whatsapp}?text=${encodeURIComponent(msg)}`
  return { waLink }
}
