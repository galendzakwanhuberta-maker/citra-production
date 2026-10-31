# Citra Production

Website katalog Citra Production (Vue 3 + Vite) yang tersambung ke backend Laravel (REST API `/api/v1`).

## Menjalankan

1. **Backend (Docker)** — di folder backend:
   ```
   docker compose up --build
   docker compose exec app php artisan db:seed --force
   docker compose exec -it app php artisan admin:create "Nama Admin" email@contoh.com
   ```
   Backend berjalan di `http://localhost:8080`.
2. **Frontend** — di folder ini:
   ```
   npm install
   copy .env.example .env.local
   npm run dev
   ```
   Buka `http://localhost:5173`. Jika alamat backend berbeda, ubah `VITE_API_BASE_URL` di `.env.local`
   (default `http://localhost:8080/api/v1`) lalu jalankan ulang `npm run dev`.

Admin: buka `http://localhost:5173/#/admin`, masuk dengan email & password admin.

## Catatan perilaku (mengikuti aturan API)

- Status moderasi: `pending → published | rejected`, `published ↔ withdrawn`; `rejected` final. Hapus hanya untuk yang ditolak/disembunyikan.
- Produk perlu kategori dan harga sebelum bisa ditayangkan. Harga diisi min dan max (satu harga = min sama dengan max).
- Foto: JPG/PNG/WebP, dikompres otomatis di browser; alt text diisi satu kali per produk/portofolio.
- Gambar hero: letakkan file `src/assets/hero.jpg` (atau png/webp); tidak diatur lewat API.
- Urutan FAQ belum bisa diatur dari antarmuka admin.
- `npm run build` menghasilkan folder `dist`.
