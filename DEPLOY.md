# Napak Living — Deployment Guide

Stack: Vite/React SPA (nginx) + Fastify API (Node) + PostgreSQL, via Docker Compose.

## Prerequisites

- Docker + Docker Compose v2 on the server.
- A domain name (if you want HTTPS).

## 1. Configure environment

Copy the example and fill in real values (especially a strong `POSTGRES_PASSWORD`):

```bash
cp .env.prod.example .env
```

| Variable            | Meaning                                   |
| ------------------- | ----------------------------------------- |
| `POSTGRES_USER`     | DB user (default `napak`)                 |
| `POSTGRES_PASSWORD` | DB password — **change this**             |
| `POSTGRES_DB`       | DB name (default `napak_living`)          |
| `CLIENT_ORIGIN`     | Public site URL, e.g. `https://example.com` |
| `WEB_PORT`          | Host port for HTTP (default `80`)         |

> Changing `POSTGRES_PASSWORD` after the volume is initialized has no effect;
> wipe the volume or set it correctly on the first deploy.

## 2. First deploy (migrate + seed + run)

```bash
docker compose -f docker-compose.prod.yml --profile seed up -d --build
```

This:
1. starts PostgreSQL,
2. applies Prisma migrations (`migrate` service),
3. seeds the catalog once (`seed` service — runs `prisma/seed.ts`),
4. starts the API and the web (nginx).

## 3. Updates / subsequent deploys

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Migrations run automatically (idempotent). The `seed` profile is **not** run again,
so data is not reset.

## 4. Verify

- `http://<server-ip>/` — website
- `http://<server-ip>/api/health` — `{"status":"ok"}`

Logs:

```bash
docker compose -f docker-compose.prod.yml logs -f
```

## 5. HTTPS (recommended)

The nginx container listens on port 80. For HTTPS use a reverse proxy or a TLS
terminator in front of it, e.g.:

- **Caddy** (auto HTTPS, simplest):
  `https://example.com { reverse_proxy web:80 }` on the compose network.
- **Certbot** with the nginx plugin, or run a second nginx with a TLS block.

`CLIENT_ORIGIN` should then be the `https://` URL.

## 6. Rate limiting (already active)

- Global API: 300 requests / minute / IP.
- `/api/contact`: 5 requests / minute / IP.

## 7. Backups

Back up the DB volume periodically:

```bash
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U napak napak_living > backup.sql
```

## 8. Notes

- The web image serves `dist/` (built assets) and proxies `/api` to the API service.
- Product images live in `public/Product/` and are baked into the web image.
- `npm run db:setup` / `npm run dev` remain available for local development.