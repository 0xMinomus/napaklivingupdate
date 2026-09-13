# Panduan Mengelola Produk (CMS)

Produk, kategori, dan koleksi dikelola lewat **halaman admin** — tidak perlu coding.

**Buka:** `https://napaklivingupdate.vercel.app/admin` → Login with GitHub.

Setiap klik **Save/Publish**, perubahan tersimpan sebagai commit di GitHub dan
website dibangun ulang otomatis (±2–3 menit baru tampil).

---

## Tambah produk: Products → New Product

| Field | Isi |
|---|---|
| Name | Nama produk, contoh `Sana Cup` |
| Slug | Otomatis dari nama (`sana-cup`). **Jangan diganti setelah publish** — slug = alamat URL produk |
| Display Code | Kode tampil, contoh `NL / 007` |
| SKU | Kode internal untuk pencarian |
| Subtitle, Description | Teks tampil di halaman detail |
| Materials | Bahan, contoh `Glazed ceramic` (dipakai filter Material & pencarian) |
| Dimensions, Care | Contoh `Ø 10 · H 15 cm` |
| Availability | **Ready to ship** / **Made to order** |
| Status | **Active** = tampil · **Draft** = disembunyikan tapi tidak dihapus |
| Price | Kosongkan = harga by inquiry |
| New badge / Featured | Toggle badge Baru dan tampil di halaman depan |
| Main Image | Upload WebP (nama file = slug, contoh `sana-cup.webp`) |
| Gallery Images | Tambah foto + **Alt Text** tiap foto (wajib, untuk SEO) |
| Finishes / Variants | Daftar pilihan finish, contoh `Chalk`, `Sand` |
| Category | Pilih dari daftar (otomatis terisi dari data Categories) |
| Collections | Pilih 0..n koleksi |
| Release Date | Kosongkan = dianggap produk terbaru (muncul paling atas) |

## Edit produk

Buka produk di daftar → ubah → Save. Semua halaman yang menampilkan produk itu
(kartu, detail, koleksi, home) ikut berubah.

## Hapus / sembunyikan produk

- **Sembunyikan sementara:** ubah Status → Draft (produk hilang dari web, data tetap ada).
- **Hapus permanen:** tombol Delete di editor. File foto dibiarkan (tidak merusak apa-apa).

## Tambah kategori / koleksi baru

Menu **Categories** / **Collections** → New → isi Name (slug otomatis), Description,
Image, dan Parent (untuk sub-kategori). Kategori/koleksi baru **langsung muncul**
sebagai pilihan di form produk. Slug yang sudah live jangan diganti.

## Foto produk

- Simpan di folder **`public/Product/`** lewat upload di admin (atau taruh manual).
- **Wajib WebP**, gambar utama ±1000px (squoosh.app → WebP, Quality ±75).
- Idealnya buat juga `nama@640.webp` dan `nama@320.webp` untuk kartu & thumbnail.
  Kalau lupa: web tetap jalan (otomatis pakai gambar utama), hanya sedikit lebih berat.
- Nama file tanpa spasi, pakai tanda hubung, samakan dengan slug (`sana-cup.webp`).

## Catatan

- **Kontak** → form "Ask about this piece" / kontak sekarang **tidak mengirim email**
  (tidak ada backend); submit langsung menuju halaman terima kasih. Kalau nanti
  ingin email sungguhan, tinggal pasang layanan form seperti Formspree/Web3Forms.
- Daftar slug kategori & koleksi yang tersedia selalu terlihat di menu
  Categories/Collections pada halaman admin — tidak perlu menghafal.
