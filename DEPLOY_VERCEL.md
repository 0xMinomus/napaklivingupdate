# Deploy ke Vercel (semua di Vercel)

Arsitektur: frontend statis di Vercel + API Fastify sebagai **serverless function**
(`api/index.ts`) + PostgreSQL **hosted** (Neon / Supabase).

---

## 1. Siapkan PostgreSQL hosted

- Buat project di [Neon](https://neon.tech) atau [Supabase](https://supabase.com).
- Ambil connection string, contoh:
  `postgresql://user:password@host/dbname?sslmode=require`

## 2. Push ke GitHub

```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin <url-repo>
git push -u origin main
```

`.gitignore` sudah mengecualikan `.env`, `node_modules`, `dist`, `server/dist`, log.

## 3. Buat project di Vercel

1. [vercel.com/new](https://vercel.com/new) → Import repo GitHub.
2. Framework preset: **Vite** (auto-detect). `vercel.json` sudah mengatur
   `buildCommand` (`npm run vercel-build`) dan `outputDirectory` (`dist`).
   Pastikan **Root Directory = `/`**.
3. Settings → Environment Variables:
   - `DATABASE_URL` = connection string Neon/Supabase (pakai `?sslmode=require`)
4. Deploy.

### Tentang `npm run vercel-build` (scripts/vercel-build.mjs)

Build di Vercel menjalankan:
1. `prisma migrate deploy` (best-effort; jalan otomatis jika `DATABASE_URL`
   tersedia di build env) — idempotent, aman dijalankan tiap build.
2. `prisma generate` (wajib, agar Prisma client siap di serverless function).
3. `npm run build` (Vite → `dist`).

> Lokal di Windows, `prisma generate` kadang gagal `EPERM` saat proses dev
> (`npm run dev`) masih berjalan — itu hanya artefak file lock Windows,
> **tidak terjadi di Vercel (Linux)**. Script sudah diberi fallback warning.

## 4. Migrasi & seed (sekali)

Jika `prisma migrate deploy` belum sempat jalan (mis. DB dibuat setelah deploy
pertama), jalankan manual sekali:

```bash
# dari folder root, arahkan ke DB hosted (dotenv tidak menimpa env yg sudah ada)
$env:DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
npx prisma migrate deploy --schema server/prisma/schema.prisma
npm run db:seed --workspace server
```

## 5. Verifikasi

- Buka URL Vercel → halaman tampil normal; gambar produk (`/Product/...`) dan
  hero lokal tersaji dari `public/` (ikut ke `dist`).
- Cek API: `/api/health` dan `/api/products` → JSON.
- Cek form Kontak → `/api/contact`.

## Catatan penting

- Fastify + Prisma jalan di **Node runtime** (`nodejs22.x`, sudah diatur di
  `vercel.json`), bukan Edge.
- Rate limit tetap aktif: 300 req/menit/IP global, 5 req/menit untuk
  `/api/contact`. `trustProxy: true` agar IP client benar lewat `x-forwarded-for`.
- Cold start API ~1–3 detik pada request pertama; berikutnya dilayani instance
  hangat.
- API response images (Unsplash) tetap remote — tidak butuh env tambahan.
- Setiap push ke `main` otomatis memicu deploy baru.

## Alternatif backend terpisah

Kalau ingin backend long-running (lebih stabil untuk produksi berat), gunakan
arsitektur Docker yang sudah disiapkan: `docker-compose.prod.yml` + `DEPLOY.md`,
lalu frontend tetap bisa di Vercel dengan rewrite `/api` ke domain API.