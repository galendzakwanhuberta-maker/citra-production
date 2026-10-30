# Citra Productions

Website katalog dan panel admin untuk **Citra Production** (percetakan & cinderamata, Yogyakarta). Dibuat dengan **Vue 3 + Vite**, desain dari Figma "PAD", responsif untuk mobile dan desktop.

## Fitur

**Website pelanggan**
- Hero (tombol Maps), katalog (filter kategori/packaging, urut, tampilan daftar/kotak, paginasi), halaman pencarian dengan "Pencarian terakhir"
- Detail produk dengan carousel foto dan tombol pesan via WhatsApp
- Portofolio (carousel multi-gambar), testimoni (suka + modal "Tambah Testimoni"), FAQ + modal "Ajukan Pertanyaan" yang diteruskan ke WhatsApp
- Footer kontak, tombol WhatsApp mengambang

**Panel admin** (`/#/admin`)
- Beranda/dashboard, Produk dan Kategori (CRUD + banyak foto + deskripsi), Portofolio (multi-gambar)
- FAQ dan Testimoni dengan tab Tayang / Masuk / Ditolak (jawab, tolak, pulihkan, sembunyikan, hapus)
- Kontak: form edit footer dengan konfirmasi perubahan (lama → baru)

## Teknologi
Vue 3 (Composition API, `<script setup>`), Vite, vue-router 4 (hash mode), store reaktif + IndexedDB. Tanpa backend.

## Menjalankan

Butuh [Node.js LTS](https://nodejs.org). Di Windows gunakan **Command Prompt** (PowerShell sering memblokir skrip npm).

```
npm install
npm run dev
```

- Website: http://localhost:5173/
- Admin: http://localhost:5173/#/admin — kode akses awal `admin123` (ubah di `src/config/site.js`)

Build produksi: `npm run build` (hasil di folder `dist`).

## Struktur
```
src/
  components/  ui/ layout/ sections/ admin/
  views/       halaman publik + admin
  stores/      store.js (data & aksi), db.js (IndexedDB)
  config/      site.js, nav.js
  router/  composables/  utils/  styles/
```

## Data contoh
Seed ada di `src/stores/store.js`: 5 kategori (kategori **Pin** sengaja kosong untuk uji tampilan kosong), 20 produk, 8 portofolio, 12 FAQ, 11 testimoni. Semua bisa diubah dari halaman admin. Untuk memuat ulang data contoh, naikkan `KEY` (mis. `data-v4`) di `store.js` atau hapus data situs di browser.

## Batasan
- Data tersimpan di browser (IndexedDB) pada komputer yang dipakai; belum ada server, jadi pengunjung lain tidak melihat perubahan admin.
- Kode akses admin ada di front-end, jadi **bukan** keamanan sungguhan. Ganti dengan login server saat backend tersedia.
- Tombol "suka" testimoni tersimpan per browser.
