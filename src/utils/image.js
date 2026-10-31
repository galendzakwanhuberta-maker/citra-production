import { siteConfig } from '../config/site'
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp']
export function pickFiles({ multiple = false } = {}) {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = '.png,.jpg,.jpeg,.webp'; input.multiple = multiple
    input.style.display = 'none'
    document.body.appendChild(input)
    input.addEventListener('change', () => { resolve(Array.from(input.files || [])); input.remove() })
    input.addEventListener('cancel', () => { resolve([]); input.remove() })
    input.click()
  })
}
// Perkecil (maks 1200px) & kompres ke JPEG supaya muat disimpan di browser.
export async function compressImage(file, { maxSide = 1200, quality = 0.82 } = {}) {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('x')); i.src = url })
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
    const c = document.createElement('canvas')
    c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale)
    const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height)
    ctx.drawImage(img, 0, 0, c.width, c.height)
    return c.toDataURL('image/jpeg', quality)
  } finally { URL.revokeObjectURL(url) }
}
export async function readImages(files, { max = Infinity } = {}) {
  const images = [], errors = []
  for (const f of files) {
    if (images.length >= max) { errors.push(`Maksimal ${max} foto, sisanya diabaikan.`); break }
    if (!ALLOWED.includes(f.type)) { errors.push(`${f.name}: hanya PNG, JPG, atau WEBP.`); continue }
    if (f.size > siteConfig.maxUploadBytes) { errors.push(`${f.name}: ukuran melebihi 2MB.`); continue }
    try { images.push(await compressImage(f)) } catch { errors.push(`${f.name}: gagal diproses.`) }
  }
  return { images, errors }
}

// Hasil kompres (data URL) → Blob untuk dikirim sebagai multipart/form-data.
export const dataUrlToBlob = async (dataUrl) => (await fetch(dataUrl)).blob()
