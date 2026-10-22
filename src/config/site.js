// Pengaturan awal proyek. Data kontak/hero hanya NILAI AWAL: setelah itu diubah lewat halaman admin.
export const siteConfig = {
  // ⚠️ Kode di front-end bisa dibaca siapa saja, jadi ini BUKAN keamanan sungguhan —
  // hanya "pintu depan" untuk tahap demo. Setelah ada backend, ganti dengan login server.
  adminPasscode: 'admin123',
  maxPhotosPerProduct: 5,
  maxUploadBytes: 2 * 1024 * 1024, // 2MB per file, sesuai teks di desain
  defaults: {
    whatsappNumber: '62818273513', // format internasional, tanpa + dan tanpa spasi
    email: 'd_sobarudin@yahoo.co.id',
    instagram: '@citra.production',
    address: 'Ambarrukmo rt 03 rw 01 no 187, Yogyakarta',
  },
}
