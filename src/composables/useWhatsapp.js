import { state } from '../stores/store'
export function useWhatsapp() {
  // Nomor dari /site-contents: format internasional tanpa "+", mis. 6281234567890.
  const waLink = (msg = 'Halo, saya ingin bertanya tentang produk Citra Productions') =>
    `https://wa.me/${state.site.whatsapp}?text=${encodeURIComponent(msg)}`
  return { waLink }
}
