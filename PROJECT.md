# Napak Living — Project Context

Single source of truth for this codebase. Read this once and you know everything: stack, architecture, conventions, deployment, and past bug fixes (so you don't reintroduce them).

## 1. What This Is

**Napak Living** is a marketing/catalog website for an Indonesian home-decor brand ("Objects for a slower home"). It showcases products (vases, trays, bowls, candle holders), collections, a lookbook, and company info, plus a contact form.

- **Live URL:** https://napakliving-olive.vercel.app (this exact domain is hardcoded in `public/llms.txt`, `public/robots.txt`, `public/sitemap.xml` — update all three if the domain ever changes)
- **Repo:** `github.com/0xMinomus/napakliving`, branch `main`. Pushing to `main` auto-deploys to Vercel.
- **Language of UI copy:** English. User communicates with the developer in Indonesian.

## 2. TL;DR — Critical Facts

1. **100% static frontend. NO backend.** The old Express/Prisma server was fully deleted. All product data lives in `src/data/catalog.ts` as typed TypeScript constants.
2. `src/api.ts` is a **client-side mock API**: same function signatures as the old REST API (`getProducts`, `getProductBySlug`, etc.) but resolves instantly from local data. Components don't know/care there's no server.
3. Deployed on **Vercel**. `vercel.json` sets `"buildCommand": "npm run build"` explicitly — this intentionally overrides any stale `vercel-build` setting in the Vercel dashboard. Don't remove it.
4. All images are **WebP only**, no `.jpg/.png` anywhere. Product images come in 3 sizes each (`base`=1000px max-dim, `@640`, `@320`) under `public/Product/`.
5. React 19 + Vite 6 + TypeScript + react-router-dom v7 + GSAP/ScrollTrigger. No CSS framework, no Tailwind, no UI library. Plain CSS in two files.
6. Node 22 (`engines` in package.json). `"type": "module"`.

## 3. Tech Stack

| Layer     | Choice                                   | Notes                                          |
|-----------|------------------------------------------|------------------------------------------------|
| Framework | React 19 + TypeScript 5.7                | Strict types in `src/types.ts`                 |
| Bundler   | Vite 6 (`@vitejs/plugin-react`)          | Dev server port 5173                           |
| Routing   | react-router-dom v7                      | `BrowserRouter`, see route map below           |
| Animation | GSAP 3 + `@gsap/react` (`ScrollTrigger`) | Global scroll reveals in `ScrollAnimations.tsx` |
| Styling   | Plain CSS, 2 files                       | `src/styles/global.css` (~2400 lines) + `src/styles/pages.css` (~1650 lines) |
| Fonts     | Google Fonts: Manrope, Inter, DM Mono    | Loaded **non-blocking** (see §9)               |
| Hosting   | Vercel (static build, SPA rewrite)       | Auto-deploy on push to `main`                  |
| Backend   | **None**                                 | Formerly Express+Prisma in `server/` — deleted |

Dependencies are minimal on purpose: `react`, `react-dom`, `react-router-dom`, `gsap`, and `@gsap/react`. No state library, no CSS framework, no icon set (icons are inline SVG/CSS shapes).

## 4. Project Structure

```
├── index.html                  # head: meta, preconnects, non-blocking fonts, llms.txt alternate link
├── vercel.json                 # buildCommand + SPA rewrite (see §8)
├── vite.config.ts              # plugins:[react()], port 5173. Nothing else — keep it that way
├── public/
│   ├── llms.txt                # AI-crawler manifest (# H1 + markdown links) — needs H1 + links to pass "agentic browsing" checks
│   ├── robots.txt              # User-agent: * / Allow: / / Sitemap line only (no exotic directives)
│   ├── sitemap.xml             # static list of routes
│   ├── pexels-the-ghazi-2152398165-36353283.webp   # hero image (1600px wide, ~87KB)
│   └── Product/                # 18 webp files = 6 products × 3 sizes
│       └── <slug>.webp, <slug>@640.webp, <slug>@320.webp
├── src/
│   ├── main.tsx                # imports global.css + pages.css, renders <App/>
│   ├── App.tsx                 # all routes inside <Layout/>
│   ├── types.ts                # Product, ProductSummary, Category, Collection, Paginated<T>
│   ├── api.ts                  # mock API over catalog.ts (async signatures preserved)
│   ├── data/catalog.ts         # THE database: categories[], collections[], products[]
│   ├── lib/
│   │   ├── image.ts            # scaleImage(url, width) — responsive URL builder (§7)
│   │   ├── links.ts            # productUrl/categoryUrl/collectionUrl helpers
│   │   └── (no scroll hook)    # Scroll reveal is centralized in components/ScrollAnimations.tsx
│   ├── hooks/useDocumentTitle.ts
│   ├── components/             # Header, Footer, Layout, Gallery, ProductCard,
│   │                           # ProductGrid, Pagination, ContactForm, ScrollToTop,
│   │                           # ScrollAnimations (global GSAP + ScrollTrigger controller)
│   ├── pages/                  # Home, Catalog, ProductDetail, Collections,
│   │                           # CollectionDetail, Lookbook, About, Business,
│   │                           # Contact, ThankYou, NotFound
│   └── styles/
│       ├── global.css          # tokens, reset, header/footer, home, animations
│       └── pages.css           # catalog/product/collection/lookbook/contact page layouts
```

## 5. Data Model & Content

Everything renders from `src/data/catalog.ts`:

- **categories[]** — tree via `parent` ref + `children[]`. Roots: Home Decor, Table Accessories, Lifestyle. Children e.g. Vases, Trays, Bowls.
- **collections[]** — curated groupings with `image` + `productCount`.
- **products[]** — full `Product` shape: `name/slug/code/sku/subtitle/materials/price/isNew/image/category/collections/description/dimensions/care/availability/status/isFeatured/images[]/variants[]/createdAt`.
- `Paginated<T>` exists because the old API paginated; the mock keeps the same shape (`items/total/page/pageSize/totalPages`).

To add a product: edit `catalog.ts` AND add its WebP images (see `PANDUAN-TAMBAH-PRODUK.md` — written in Indonesian, includes the @640/@320 variant requirement).

## 6. Route Map

| Path                | Component          | Notes                                    |
|---------------------|--------------------|------------------------------------------|
| `/`                 | Home               | Hero banner, featured sections           |
| `/catalog`          | Catalog            | Shop grid; `?category=slug` filter param; breadcrumb always `Home / Shop / [Kategori]`; "All objects" chip always visible |
| `/product/:slug`    | ProductDetail      | Gallery component + sticky info column  |
| `/collections`      | Collections        |                                          |
| `/collection/:slug` | CollectionDetail   | `/collection` redirects here             |
| `/lookbook`         | Lookbook           |                                          |
| `/about` `/business` `/contact` `/thank-you` | respective pages | ContactForm fakes a send (setTimeout) then `navigate('/thank-you')` |
| `*`                 | NotFound           |                                          |

## 7. Image System (important — easy to break)

`src/lib/image.ts → scaleImage(url, width)`:

- Unsplash URLs → rewrites the `w=` query param to requested width.
- Local `/Product/<name>.<ext>` URLs → maps width to variant files:
  - `width <= 360` → `<name>@320.webp`
  - `width <= 720` → `<name>@640.webp`
  - else → base `<name>.webp` (=1000px max dimension)
- Usage convention: product cards call `scaleImage(product.image, 640)`, gallery main image `scaleImage(current.url, 1000)`, thumbnails `scaleImage(url, 320)`.

Rules:
- Never commit JPEG/PNG product photos. Convert to WebP first (e.g. squoosh.app).
- Every product image MUST have all 3 variants or cards/thumbs will 404.
- Unsplash embeds use `q=70` (tuned for PageSpeed) and modest `w` values per usage.

## 8. Deployment (Vercel)

```json
// vercel.json — complete file
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- The SPA rewrite makes deep links like `/product/lina-tray` work on refresh.
- `buildCommand` here overrides the dashboard's framework preset — historically the dashboard had a stale `npm run vercel-build` which broke deploys. If a deploy fails with "Missing script: vercel-build", this file is the fix; keep it.
- No functions, no env vars needed. `VITE_API_URL` is optional legacy in `api.ts` (defaults to `/api`, unused).

## 9. Performance Decisions (don't regress)

- **Fonts non-blocking** in `index.html`: stylesheet loaded with `media="print" onload="this.media='all'"`.
- Preconnects: fonts.googleapis.com, fonts.gstatic.com, images.unsplash.com.
- Hero image is a resized 1600px WebP (~87KB).
- PageSpeed history: image delivery was the big win (hero 953KB→87KB, products →42–74KB base). PSI diagnostics like "Reduce unused JavaScript" / "Minify JS Error" can be stale or inherent-to-SPA noise — verify against actual built output before acting.
- Built assets ARE minified by Vite by default.

## 10. SEO / AI-Crawler Files

- `public/llms.txt`: must start with an `# H1` and contain links (an "agentic browsing" checker flagged missing H1 + links once).
- `public/robots.txt`: keep it minimal/valid — `User-agent: *`, `Allow: /`, `Sitemap:` line. An unknown directive (`llms.txt:`) once dropped the SEO score.
- `index.html` has `<link rel="alternate" type="text/markdown" href="/llms.txt">`.
- Domain `napakliving-olive.vercel.app` is hardcoded in these three files.

## 11. Past Bugs & Their Fixes (do not reintroduce)

1. **iOS Safari: product photo fills whole screen.** Cause: `aspect-ratio` box whose `<img>` child used `height:100%` in normal flow — iOS lets intrinsic image size inflate the container. Fix (in `pages.css`): `.gallery-main`/`.gallery-thumb` are `position:relative`, their imgs are `position:absolute; inset:0; width/height:100%; object-fit:cover`. Container height comes purely from `aspect-ratio`.
2. **Mobile menu bugs (transparent overlay / leftover band after close).** Root cause: `.site-header` has `animation: rise-in ... both` which retains a `transform`, making the header the containing block for `position:fixed` descendants; plus `prefers-reduced-motion` killed link entrance animations leaving them at `opacity:0`. Fix: mobile menu is rendered via **React portal to `document.body`** from `Header.tsx` (`useState(menuOpen)` + conditional render + own ✕ close button + body scroll lock). Menu links default to `opacity:1`; animations only enhance. Do NOT move the overlay back inside `<header>`.
3. **Hero banner "shifted" on all devices.** A zoom implemented as `width/height:116%; margin:-8%` shifts the crop. Correct way: `transform: scale(1.16)` on `.hero-bg-image img` (center-origin, no shift). Current intended state: `scale(1.16)` + `object-position: center 58%`.
4. **Hamburger icon too high.** `.mobile-menu-toggle` needs `place-items:center` (40×40 button, icon centered) so it aligns with the logo.
5. **package.json regression watch:** the working tree once reverted to the old monorepo version (workspaces/server/concurrently/vercel-build) while `server/` no longer exists — `git restore package.json` fixed it. Committed version is the clean static one (`dev: "vite"` only).

## 12. Header / Mobile Menu Implementation

- Desktop: inline nav in `<header>`. Mobile (≤ breakpoint): a `<button class="mobile-menu-toggle">` toggles `menuOpen` state.
- Overlay: `createPortal(<div class="mobile-menu-overlay">…</div>, document.body)` — solid krem background `var(--color-bone-canvas)` (#efefe4), centered nav links `clamp(22px, 6vw, 30px)`, active page gets olive underline (`--color-studio-blue` #58624a), staggered fade-in, Esc/close button dismisses, body scroll locked while open.
- Brand palette: olive `#58624a` (`--color-studio-blue`/`--color-wash-blue`), bone `#efefe4`, paper `#fcfcf9`, ink `#181818`.

## 13. GSAP Scroll Animations

- `src/components/ScrollAnimations.tsx` is mounted once by `Layout` and scopes all GSAP work to the site shell.
- It registers `ScrollTrigger`, creates reveal animations for page sections, cards, galleries, forms, panels, footer content, and category links, and rescans after lazy/dynamic route content appears.
- The homepage hero background is intentionally excluded from scroll animation. Its `scale(1.16)` is static; only hero text is animated.
- Route changes rerun the controller using `routeKey` (`pathname + search`) and automatically revert old tweens/triggers through `useGSAP`.
- `prefers-reduced-motion: reduce` skips GSAP animations and leaves content visible.
- Animate only transform/opacity/filter where possible. Do not add CSS opacity-zero reveal rules or another IntersectionObserver reveal system; they conflict with GSAP.

## 14. Commands

```bash
npm install          # setup
npm run dev          # vite dev server → http://localhost:5173
npm run build        # production build → dist/ (also what Vercel runs)
npm run preview      # serve dist/ locally
npx tsc --noEmit     # typecheck (run before committing)
```

There is no test suite, no linter config. Verify changes with `npx tsc --noEmit && npm run build`.

Deploy = `git add -A && git commit -m "..." && git push origin main` (auto-deploys).

## 15. Code Conventions

- TypeScript everywhere; shared domain types centralized in `src/types.ts`.
- No code comments unless asked; no emojis in code/UI.
- Functional components + hooks only. Small helper libs in `src/lib/`.
- CSS: BEM-ish flat class names, design tokens as CSS custom properties in `:root` of `global.css`. Responsive breakpoints around 1331px (desktop nav→burger) and 767px/680px (mobile tweaks).
- Animations respect `prefers-reduced-motion` — anything that hides content behind animation must keep content visible when animations are off (see §11.2).

## 16. Removed Legacy (context for "why isn't X here")

Formerly a monorepo with `server/` (Express + Prisma + SQLite, admin CRUD API) and Docker/nginx deploy files. All removed in favor of pure static hosting. `src/api.ts` kept the old API surface so pages would need zero changes. If real backend/e-commerce is ever needed, reintroduce it behind the same `api.ts` interface.
