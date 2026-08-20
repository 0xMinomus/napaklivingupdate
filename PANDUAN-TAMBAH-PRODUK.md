# Panduan Menambah Produk

Sejak versi terbaru, **produk disimpan langsung di frontend** (file `src/data/catalog.ts`).
Tidak ada database, tidak ada API, tidak perlu server — jadi menambah produk cukup
edit 1 file + taruh gambar.

---

## Langkah-langkah

### 1. Taruh gambar produk
- Salin file gambar ke folder: **`public/Product/`**
- Format bebas (`.jpg`, `.jpeg`, `.png`, `.webp`), ukuran gambar jadi ±1000px supaya cepat dimuat.
- Beri nama file yang jelas, contoh: `vas-mira.webp`, `tray-lina.webp`.
- **Gunakan nama sederhana tanpa spasi** (pakai tanda hubung), contoh `mira-bud-vase.webp`.
  Dengan begitu URL-nya tinggal `/Product/mira-bud-vase.webp` — tidak perlu encode.
- **Wajib: buat juga 2 versi kecil** dengan akhiran `@640` dan `@320`
  (untuk kartu produk & thumbnail di halaman detail). Contoh:
  - `mira-bud-vase.webp` (gambar utama ±1000px)
  - `mira-bud-vase@640.webp` (untuk kartu produk)
  - `mira-bud-vase@320.webp` (untuk thumbnail galeri)
  > Kalau versi `@640` tidak ada, gambar di kartu produk akan **404/rusak**.
  > **Gunakan format WebP** (bukan JPEG) karena jauh lebih ringan untuk web.
  > Cara cepat membuat versi kecil/WebP: buka di editor foto, atau pakai tool
  > online gratis seperti **squoosh.app** (pilih "WebP", atur Quality ±75).

### 2. Buka file data produk
- Buka **`src/data/catalog.ts`** dengan editor teks (VS Code, dsb.).
- Cari bagian `export const products: Product[] = [ ... ]`.

### 3. Salin satu blok produk sebagai contoh
Setiap produk diwakili satu blok `{ ... }` di dalam array `products`.
Contoh blok (Mira Bud Vase):

```ts
{
  id: 1,                          // nomor urut unik (jangan sama dengan produk lain)
  name: 'Mira Bud Vase',          // nama produk yang tampil
  slug: 'mira-bud-vase',          // identitas link, huruf kecil + tanda hubung
  code: 'NL / 001',               // kode tampil di halaman detail
  sku: 'NL-MIRA-001',             // kode internal untuk pencarian
  subtitle: 'A small vase for a single stem.',
  description: 'Mira is a compact bud vase with a soft, quiet finish...',
  materials: 'Glazed ceramic',    // bahan (untuk filter "Material" & pencarian)
  dimensions: 'Ø 10 · H 15 cm',
  care: 'Wipe with soft cloth',
  availability: 'made-to-order',  // 'made-to-order' atau 'ready'
  status: 'active',               // 'active' = tampil, hapus/ubah jadi 'inactive' = sembunyi
  price: null,                    // biarkan null (harga by inquiry)
  isFeatured: false,              // true = muncul sebagai produk unggulan di halaman depan
  isNew: true,                    // true = ditandai produk baru
  image: '/Product/mira-bud-vase.webp',
  images: [
    { url: '/Product/mira-bud-vase.webp', alt: 'mira bud vase, glazed ceramic' },
  ],
  variants: ['Chalk', 'Sand'],    // pilihan finish (opsional, boleh []
  category: { id: 4, name: 'Vases & Vessels', slug: 'vases' },
  collections: [{ id: 1, name: 'Ruang Pagi', slug: 'ruang-pagi' }],
  createdAt: '2026-02-01T00:00:00.000Z',
  updatedAt: '2026-02-01T00:00:00.000Z',
},
```

### 4. Sesuaikan isinya
- **`image`** → ganti dengan alamat gambar kamu:
  `/Product/<nama file persis>`, contoh `/Product/mira-bud-vase.webp`.
  > Pakai nama file **tanpa spasi** (pakai tanda hubung) supaya tidak perlu encode.
  > Kalau file tetap berspasi (mis. `vas baru.webp`), URL-nya jadi
  > `/Product/vas%20baru.webp` (spasi → `%20`).
- **`name`, `subtitle`, `description`, `materials`, `dimensions`, `variants`** → isi sesuai produk.
- **`id`** → pakai angka urut baru (contoh produk terakhir sekarang id 6, jadi mulai `7`).
- **`createdAt`/`updatedAt`** → tanggal hari ini (untuk urutan "Newest").

### 5. Pilih kategori & koleksi yang benar

Daftar **kategori** (`slug`) yang tersedia:

| Kategori induk      | slug               | Sub-kategori (slug)                    |
|---------------------|--------------------|----------------------------------------|
| Home Decor          | `home-decor`       | `vases`, `candle-holders`, `decorative-objects` |
| Table Accessories   | `table-accessories`| `bowls`, `trays`, `serving-pieces`     |
| Lifestyle           | `lifestyle`        | –                                      |

Daftar **koleksi** (`slug`) yang tersedia:

| Koleksi        | slug               |
|----------------|--------------------|
| Ruang Pagi     | `ruang-pagi`       |
| Bumi Tenang    | `bumi-tenang`      |
| The Table, Slowly | `the-table-slowly` |

Di blok produk, isi `category` sesuai sub-kategori (contoh: produk vas → `slug: 'vases'`),
dan `collections` boleh diisi 1 koleksi atau `[]` kalau tidak masuk koleksi mana pun.
`id` dan `name` di dalam `category`/`collections` harus cocok dengan daftar di atas
(pakai `id` dan `name` yang sama seperti contoh).

### 6. Simpan & cek (opsional)
Jalankan build lokal untuk memastikan tidak ada error:

```bash
npm run build
```

Kalau muncul error merah, berarti ada isian yang salah (biasanya typo `slug` atau `id` dobel).

### 7. Push → otomatis ter-deploy
```bash
git add .
git commit -m "tambah produk baru"
git push origin main
```
Vercel akan otomatis membangun ulang website. Gambar ikut ter-upload karena ada di folder `public/`.

---

## Tips
- **Menghapus produk** → hapus satu blok `{ ... }` di array `products`.
- **Menyembunyikan produk** → ubah `status: 'active'` menjadi `status: 'inactive'`.
- **Menambah koleksi baru** → tambah objek di array `collections` (butuh `slug` unik),
  lalu pakai `slug` itu di blok produk.
- **Kontak** → form "Ask about this piece" / kontak sekarang **tidak mengirim email**
  (tidak ada backend); submit akan langsung menuju halaman terima kasih. Kalau nanti
  ingin email sungguhan, tinggal pasang layanan form seperti Formspree/Web3Forms.