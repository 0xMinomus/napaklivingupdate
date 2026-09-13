# Deploy ke Vercel

Website sekarang **statis + Decap CMS** — produk & koleksi ada di `content/*.json`,
diedit lewat `/admin`, tanpa database, tanpa API bisnis. Deploy jadi sangat sederhana.
Satu-satunya function adalah `api/auth.js` (broker OAuth GitHub untuk login admin).

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
3. **Butuh 2 env variable** untuk login admin: `OAUTH_CLIENT_ID` dan
   `OAUTH_CLIENT_SECRET` dari GitHub OAuth App (lihat `PANDUAN-TAMBAH-PRODUK.md`).
4. Deploy. Selesai.

## 3. Setelah deploy

- Cek halaman → produk, gambar `/Product/...`, dan navigasi semua tampil.
- Setiap `git push` berikutnya otomatis memicu deploy baru.

## 4. Menambah produk

Ikuti `PANDUAN-TAMBAH-PRODUK.md` (buka `/admin`, isi form, upload gambar ke
`public/Product/`).

## Catatan

- Gambar produk berada di `public/Product/` → ikut ter-upload otomatis.
- Form kontak tidak terhubung backend; submit langsung ke halaman terima kasih
  (bisa disambungkan ke Formspree/Web3Forms nanti jika ingin email sungguhan).
- Folder `server/` tidak dipakai di Vercel (hanya untuk pengembangan lokal
  sebelumnya) dan tidak memengaruhi deploy.