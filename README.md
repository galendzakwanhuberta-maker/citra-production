# Citra Productions

Website katalog dan panel admin untuk **Citra Production** (percetakan & cinderamata, Yogyakarta). Dibuat dengan **Vue 3 + Vite**, responsif untuk mobile dan desktop.

## Fitur

**Website pelanggan**
- Hero, katalog (cari, filter kategori/packaging, urut harga, tampilan daftar/kotak, paginasi)
- Detail produk dengan carousel foto dan tombol pesan via WhatsApp
- Portofolio, testimoni (dengan tombol suka), FAQ + form pertanyaan yang diteruskan ke WhatsApp
- Footer kontak, tombol WhatsApp mengambang

**Panel admin** (`/#/admin`)
- Dashboard, kelola hero, produk (CRUD + banyak foto), kategori, packaging, portofolio
- Moderasi FAQ dan testimoni (approve/reject), kelola kontak

## Teknologi
Vue 3 (Composition API, `<script setup>`), Vite, vue-router 4 (hash mode), store reaktif + IndexedDB.

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
Seed ada di `src/stores/store.js`: 4 kategori (kategori **Pin** sengaja kosong untuk uji tampilan kosong), 20 produk, 8 portofolio, 10 FAQ. Semua bisa diubah dari halaman admin. Untuk memuat ulang data contoh, naikkan `KEY` (mis. `data-v3`) di `store.js` atau hapus data situs di browser.

## Batasan
- Data tersimpan di browser (IndexedDB) pada komputer yang dipakai; belum ada server, jadi pengunjung lain tidak melihat perubahan admin.
- Kode akses admin ada di front-end, jadi **bukan** keamanan sungguhan. Ganti dengan login server saat backend tersedia.
- Tombol "suka" testimoni tersimpan per browser.
