# Deploy ke Vercel

Website sekarang **100% statis** — produk & koleksi ada di frontend (`src/data/catalog.ts`),
tanpa database, tanpa API, tanpa server. Deploy jadi sangat sederhana.

---

## 1. Push ke GitHub

```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin <url-repo>
git push -u origin main
```

## 2. Buat project di Vercel

1. [vercel.com/new](https://vercel.com/new) → Import repo GitHub.
2. Framework preset: **Vite** (auto-detect). `vercel.json` hanya berisi rewrite SPA.
3. **Tidak perlu env variable apa pun** — tidak ada `DATABASE_URL`, tidak ada Neon.
4. Deploy. Selesai.

## 3. Setelah deploy

- Cek halaman → produk, gambar `/Product/...`, dan navigasi semua tampil.
- Setiap `git push` berikutnya otomatis memicu deploy baru.

## 4. Menambah produk

Ikuti `PANDUAN-TAMBAH-PRODUK.md` (taruh gambar di `public/Product/` + edit
`src/data/catalog.ts`).

## Catatan

- Gambar produk berada di `public/Product/` → ikut ter-upload otomatis.
- Form kontak tidak terhubung backend; submit langsung ke halaman terima kasih
  (bisa disambungkan ke Formspree/Web3Forms nanti jika ingin email sungguhan).
- Folder `server/` tidak dipakai di Vercel (hanya untuk pengembangan lokal
  sebelumnya) dan tidak memengaruhi deploy.