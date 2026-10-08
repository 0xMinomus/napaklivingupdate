# Napak Living

Website katalog dekorasi rumah berbasis React, TypeScript, dan Vite. Konten
produk dan koleksi dikelola lewat Decap CMS, lalu disimpan sebagai JSON di
`content/`.

[Lihat website](https://napaklivingupdate.vercel.app)

## Mulai lokal

Gunakan **Node.js 22.x** dan npm. Dari root repository:

```bash
npm ci
npm run dev
```

Buka http://localhost:5173. Jika port tersebut sedang dipakai, gunakan URL
yang dicetak Vite di terminal.

Frontend katalog bisa dijalankan tanpa database atau kredensial OAuth.
Login admin memerlukan konfigurasi terpisah; ikuti
[panduan deployment](DEPLOY_VERCEL.md).

## Verifikasi dan preview produksi

```bash
npx tsc --noEmit
npm run build
npm run preview
```

Build menghasilkan `dist/`. Buka URL preview yang dicetak di terminal untuk
memeriksa hasil produksi. Build Vite tidak menggantikan pemeriksaan TypeScript;
jalankan keduanya sebelum commit. Belum ada test suite atau konfigurasi linter.

## Panduan

- [PROJECT.md](PROJECT.md): arsitektur, routing, konvensi, dan riwayat regresi.
- [PANDUAN-TAMBAH-PRODUK.md](PANDUAN-TAMBAH-PRODUK.md): pengelolaan produk dan
  persyaratan varian gambar.
- [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md): deployment dan OAuth admin.
- [DESIGN.md](DESIGN.md): arah visual.
- [AGENTS.md](AGENTS.md): petunjuk untuk coding assistant.

Form kontak saat ini belum mengirim email; detail batasannya ada di
[catatan deployment](DEPLOY_VERCEL.md#catatan).

Repository ini juga bisa dibuka sebagai vault Obsidian. `MEMORY.md` adalah
indeks lokal yang Git-ignored, bukan file yang wajib ada pada fresh clone.