# Napak Living — Project Context

Single source of truth for this codebase. Read this once and you know everything: stack, architecture, conventions, deployment, and past bug fixes (so you don't reintroduce them).

## 1. What This Is

**Napak Living** is a marketing/catalog website for an Indonesian home-decor brand ("Objects for a slower home"). It showcases products (vases, trays, bowls, candle holders), collections, a lookbook, and company info, plus a contact form.

- **Live URL:** https://napaklivingupdate.vercel.app (this exact domain is hardcoded in `public/llms.txt`, `public/robots.txt`, `public/sitemap.xml` — update all three if the domain ever changes)
- **Repo:** `github.com/0xMinomus/napaklivingupdate`, branch `main`. Pushing to `main` auto-deploys to Vercel.
- **Language of UI copy:** English. User communicates with the developer in Indonesian.

## 2. TL;DR — Critical Facts

1. **Static frontend + Decap CMS (git-based, no server).** Product/category/collection content lives in `content/*.json` (one file per product/category/collection), edited via `/admin` (Decap, GitHub OAuth via `api/auth.js`). Every save = commit to `main` = Vercel rebuild. `src/api.ts` is a **client-side mock API** over those JSON files (same signatures as the old REST API); components don't know/care there's no server.
2. Deployed on **Vercel**. `vercel.json` sets `"buildCommand": "npm run build"` explicitly — this intentionally overrides any stale `vercel-build` setting in the Vercel dashboard. Don't remove it. NOTE: `api/auth.js` is a Vercel serverless function (OAuth broker) — functions take precedence over the SPA rewrite in `vercel.json`; keep the rewrite as-is.
3. Deployed on **Vercel**. `vercel.json` sets `"buildCommand": "npm run build"` explicitly — this intentionally overrides any stale `vercel-build` setting in the Vercel dashboard. Don't remove it.
4. All images are **WebP only**, no `.jpg/.png` anywhere. Product images come in 3 sizes each (`base`=1000px max-dim, `@640`, `@320`) under `public/Product/`.
5. React 19 + Vite 6 + TypeScript + react-router-dom v7. No CSS framework, no Tailwind, no UI library. Plain CSS in two files.
6. Node 22 (`engines` in package.json). `"type": "module"`.

## 3. Tech Stack

| Layer     | Choice                                   | Notes                                          |
|-----------|------------------------------------------|------------------------------------------------|
| Framework | React 19 + TypeScript 5.7                | Strict types in `src/types.ts`                 |
| Bundler   | Vite 6 (`@vitejs/plugin-react`)          | Dev server port 5173                           |
| Routing   | react-router-dom v7                      | `BrowserRouter`, see route map below           |
| Styling   | Plain CSS, 2 files                       | `src/styles/global.css` (~2400 lines) + `src/styles/pages.css` (~1650 lines) |
| Fonts     | Google Fonts: Manrope, Inter, DM Mono    | Loaded **non-blocking** (see §9)               |
| Hosting   | Vercel (static build, SPA rewrite)       | Auto-deploy on push to `main`                  |
| Backend   | **None**                                 | Formerly Express+Prisma in `server/` — deleted |

Dependencies are minimal on purpose: `react`, `react-dom`, `react-router-dom`, `gsap`, and `@gsap/react`. No state library or icon set (icons are inline SVG/CSS shapes). GSAP owns typography entrances, section-heading reveals, and the portal menu; CSS owns caption/arrow/link/button feedback. Photos and gallery containers stay stationary.

## 4. Project Structure

```
├── index.html                  # head: meta, preconnects, non-blocking fonts, llms.txt alternate link
├── vercel.json                 # buildCommand + SPA rewrite (see §8)
├── vite.config.ts              # plugins:[react()], port 5173. Nothing else — keep it that way
├── public/
│   ├── llms.txt                # AI-crawler manifest (# H1 + markdown links) — needs H1 + links to pass "agentic browsing" checks
│   ├── robots.txt              # User-agent: * / Allow: / / Sitemap line only (no exotic directives)
│   ├── sitemap.xml             # static list of routes
│   ├── hero-pexels-erik-mclean-7340487.webp         # homepage desktop crop
│   ├── hero-pexels-erik-mclean-7340487-mobile.webp  # homepage portrait crop
│   └── Product/                # 18 webp files = 6 products × 3 sizes
│       └── <slug>.webp, <slug>@640.webp, <slug>@320.webp
├── src/
│   ├── main.tsx                # imports global.css + pages.css, renders <App/>
│   ├── App.tsx                 # all routes inside <Layout/>
│   ├── types.ts                # Product, ProductSummary, Category, Collection, Paginated<T>
│   ├── api.ts                  # mock API over content/*.json (async signatures preserved)
│   ├── lib/
│   │   ├── image.ts            # scaleImage(url, width) — responsive URL builder (§7)
│   │   ├── links.ts            # productUrl/categoryUrl/collectionUrl helpers
│   │   └── gsap.ts             # shared GSAP + useGSAP registration; no ScrollTrigger
│   ├── hooks/                  # document titles/settings + hero, page-hero, heading-reveal motion
│   ├── components/             # Header, Footer, Layout, Gallery, ProductCard,
│   │                           # ProductGrid, Pagination, ContactForm, ScrollToTop
│   ├── pages/                  # Home, Catalog, ProductDetail, Collections,
│   │                           # CollectionDetail, Lookbook, About, Business,
│   │                           # Contact, ThankYou, NotFound
│   └── styles/
│       ├── global.css          # tokens, reset, header/footer, home, animations
│       └── pages.css           # catalog/product/collection/lookbook/contact page layouts
```

## 5. Data Model & Content

Everything renders from `content/*.json` (Decap CMS, one file per product/category/collection):

- **categories/** — tree via `parent` slug. Roots: Home Decor, Table Accessories, Lifestyle. Children e.g. Vases, Trays, Bowls. `children[]` + `productCount` computed in `api.ts`, never stored.
- **collections/** — curated groupings with `image`; `productCount` + `products[]` computed in `api.ts`.
- **products/** — full `Product` shape minus numeric `id` (slug is the identity): `name/slug/code/sku/subtitle/materials/price/isNew/image/category(slug)/collections(slugs)/description/dimensions/care/availability/active|draft/isFeatured/images[]/variants[]/createdAt`.
- `Paginated<T>` exists because the old API paginated; the mock keeps the same shape (`items/total/page/pageSize/totalPages`).

To add a product: use `/admin` (see `PANDUAN-TAMBAH-PRODUK.md` — written in Indonesian, includes the @640/@320 variant requirement). Draft status hides the product without deleting its file.

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

### Homepage hero

- Photo: [Erik Mclean / Pexels, 7340487](https://www.pexels.com/photo/living-room-with-couch-and-plants-against-table-near-window-7340487/), used under the [Pexels license](https://www.pexels.com/license/). Resized/cropped locally, metadata stripped, and encoded as WebP; no runtime Pexels request.
- `content/pages/home.json` and `DEFAULT_HOME` select the desktop asset. `Home.tsx` uses a `<picture>` mobile source at widths up to 767px only for this default photo or its null fallback; a custom CMS hero is not overridden.
- Keep `fetchPriority="high"`, eager loading, and `decoding="async"`. The photo and its container remain stationary; the overlay preserves white-text readability.
- Beige/greige grading is baked into both WebPs, not applied by CSS: in CIELAB, positive `a*` is scaled to 12% and positive `b*` to 80%; negative components stay unchanged before converting back to sRGB. This removes the pink cast while keeping colored wood/foliage and the original composition. Desktop/mobile browser checks and the production build passed after grading; image `filter` and `transform` remain `none`.

| Hero asset | Resolution | File size |
|------------|------------|----------:|
| `hero-pexels-erik-mclean-7340487.webp` | 1920×1200 | 188 KiB |
| `hero-pexels-erik-mclean-7340487-mobile.webp` | 1280×1920 | 121 KiB |

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
- Homepage hero uses local WebP desktop/mobile art direction (see §7). Chromium verified that a 390px initial load requests only the mobile variant.
- PageSpeed history: image delivery was the big win (hero 953KB→87KB, products →42–74KB base). PSI diagnostics like "Reduce unused JavaScript" / "Minify JS Error" can be stale or inherent-to-SPA noise — verify against actual built output before acting.
- Built assets ARE minified by Vite by default.

## 10. SEO / AI-Crawler Files

- `public/llms.txt`: must start with an `# H1` and contain links (an "agentic browsing" checker flagged missing H1 + links once).
- `public/robots.txt`: keep it minimal/valid — `User-agent: *`, `Allow: /`, `Sitemap:` line. An unknown directive (`llms.txt:`) once dropped the SEO score.
- `index.html` has `<link rel="alternate" type="text/markdown" href="/llms.txt">`.
- Domain `napaklivingupdate.vercel.app` is hardcoded in these three files.

## 11. Past Bugs & Their Fixes (do not reintroduce)

1. **iOS Safari: product photo fills whole screen.** Cause: `aspect-ratio` box whose `<img>` child used `height:100%` in normal flow — iOS lets intrinsic image size inflate the container. Fix (in `pages.css`): `.gallery-main`/`.gallery-thumb` are `position:relative`, their imgs are `position:absolute; inset:0; width/height:100%; object-fit:cover`. Container height comes purely from `aspect-ratio`.
2. **Mobile menu bugs (transparent overlay / leftover band after close).** Root cause: `.site-header` has `animation: rise-in ... both` which retains a `transform`, making the header the containing block for `position:fixed` descendants; plus `prefers-reduced-motion` killed link entrance animations leaving them at `opacity:0`. Fix: mobile menu is rendered via **React portal to `document.body`** from `Header.tsx` (`useState(menuOpen)` + conditional render + own ✕ close button + body scroll lock). Menu links default to `opacity:1`; animations only enhance. Do NOT move the overlay back inside `<header>`.
3. **Hero banner "shifted" on all devices.** A zoom implemented as `width/height:116%; margin:-8%` shifts the crop. Correct way: `transform: scale(1.16)` on `.hero-bg-image img` (center-origin, no shift). Current intended state: `scale(1.16)` + `object-position: center 58%`.
4. **Hamburger icon too high.** `.mobile-menu-toggle` needs `place-items:center` (40×40 button, icon centered) so it aligns with the logo.
5. **package.json regression watch:** the working tree once reverted to the old monorepo version (workspaces/server/concurrently/vercel-build) while `server/` no longer exists — `git restore package.json` fixed it. Committed version is the clean static one (`dev: "vite"` only).
6. **GSAP cleanup recursion can blank a route.** A callback wrapped by the outer `useGSAP` context and invoked inside its nested `matchMedia` context creates a cyclic context graph. Menu/gallery callbacks now belong directly to the media context via `context.add`; do not wrap them again in the outer context's `contextSafe`.

## 12. Header / Mobile Menu Implementation

- Desktop: inline nav in `<header>`. Mobile (≤680px): a `<button class="mobile-menu-toggle">` toggles `menuOpen` state.
- Overlay: `createPortal(<div class="mobile-menu-overlay">…</div>, document.body)` — solid krem background `var(--color-bone-canvas)` (#efefe4), centered nav links `clamp(22px, 6vw, 30px)`, active page gets olive underline (`--color-studio-blue` #58624a). A reversible GSAP timeline owns entrance/exit; the closing portal is inert and pointer-transparent until removed. Esc/close dismisses, Tab is trapped, focus returns to the trigger, and the previous body overflow is restored. Navigation or resizing past 680px dismisses the menu immediately.
- Brand palette: olive `#58624a` (`--color-studio-blue`/`--color-wash-blue`), bone `#efefe4`, paper `#fcfcf9`, ink `#181818`.

## 13. Commands

```bash
npm install          # setup
npm run dev          # vite dev server → http://localhost:5173
npm run build        # production build → dist/ (also what Vercel runs)
npm run preview      # serve dist/ locally
npx tsc --noEmit     # typecheck (run before committing)
```

There is no test suite, no linter config. Verify changes with `npx tsc --noEmit && npm run build`.

Deploy = `git add -A && git commit -m "..." && git push origin main` (auto-deploys).

## 14. Code Conventions

- TypeScript everywhere; shared domain types centralized in `src/types.ts`.
- No code comments unless asked; no emojis in code/UI.
- Functional components + hooks only. Small helper libs in `src/lib/`.
- CSS: BEM-ish flat class names, design tokens as CSS custom properties in `:root` of `global.css`. Desktop nav switches to the mobile menu at 680px; other responsive layouts also use 767px and larger breakpoints.
- Animations respect `prefers-reduced-motion` — anything that hides content behind animation must keep content visible when animations are off (see §11.2).

## 15. Removed Legacy (context for "why isn't X here")

Formerly a monorepo with `server/` (Express + Prisma + SQLite, admin CRUD API) and Docker/nginx deploy files. All removed in favor of pure static hosting. `src/api.ts` kept the old API surface so pages would need zero changes. If real backend/e-commerce is ever needed, reintroduce it behind the same `api.ts` interface.

## 16. Motion Ownership & Verification

- `src/lib/gsap.ts` registers `useGSAP` once. Scope hooks to their React refs; revert media contexts and disconnect listeners/observers on teardown. Late callbacks inside `matchMedia` must use that child context's `add`, not an outer `contextSafe` wrapper (see §11.6).
- `useHeroAnimation` rolls headline text through clipped line windows, then introduces supporting copy and a drawn scroll cue linking to `#products`. `usePageHero` wipes in text; data-dependent pages wait until ready. Neither hook animates photos or their containers.
- `useScrollReveal` uses one native `IntersectionObserver` for `.section-title` headings, playing once when reached. Hero headings are excluded. One child-list `MutationObserver` handles added/removed headings; no per-card observers, `ResizeObserver`, scroll-position polling, or ScrollTrigger refreshes. Text is visible by default; focus finishes running reveals, and live reduced motion restores static text. Page/section titles have no decorative underline strokes or rule elements; functional form borders, section separators, and link feedback remain.
- CSS replaces the removed `useCardHover`: arrows exit/re-enter their circular windows, product captions underline, and collection/category titles shift slightly. Hover movement requires a fine hover-capable pointer and no reduced-motion preference. Keyboard focus retains outlines/caption feedback. No photo zoom, card lift, or large hover shadow.
- Gallery thumbnails remain native buttons with `aria-pressed`. Keep the displayed image during a pending load, accept only the latest successful selection, and retain it if the new source fails. Loaded images switch without fade/scale tweens.
- No continuous decorative animation, scroll hijacking, pinning, permanent `will-change`, or additional animation dependency. Keep menu motion separately scoped to its portal.
- Earlier motion pass verified: `tsc --noEmit` and production build; recorded hero/section reveals; fine-pointer caption/arrow hover with stationary photos; all nine main/detail routes; 390px and 320px layouts; live reduced motion during an entrance; fast scrolling; empty availability filters and restored cards; product gallery loading/thumbnail selection; mobile-menu route dismissal and restored body scrolling. Repeated development home → catalog → product → home transitions ended with zero active GSAP animations and zero detached targets.
- Title/hero update verified: build/types; desktop and 390px/320px hero crops and image loading; section headings without pseudo-element lines; home, catalog/category, collections, lookbook, about, business, contact, product/collection details, thank-you, and not-found views; reduced motion; no horizontal overflow or application JavaScript errors in those scenarios.
- Before this photo replacement, warm-cache Chromium measured typography motion at 1440×900 with CPU throttled 4×: 2,008ms after hero mount, 120 frame intervals, p95 16.7ms, maximum 16.8ms, no observed long tasks. This excludes initial startup before sampling and is not physical iOS/Android or universal FPS certification. There is no permanent automated test suite.

| Motion revision | Main JavaScript, gzip | CSS, gzip |
|-----------------|----------------------:|----------:|
| Image motion + ScrollTrigger | 142.57 kB | 9.00 kB |
| Typography + caption motion, responsive hero | 123.69 kB | 9.28 kB |
