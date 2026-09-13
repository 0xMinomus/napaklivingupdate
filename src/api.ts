import type { Collection, Paginated, Product, ProductSummary } from './types'

export const API_URL: string = (import.meta.env as { VITE_API_URL?: string } | undefined)
  ?.VITE_API_URL ?? '/api'

type QueryParams = Record<string, string | number | boolean | undefined>

interface ProductFile {
  name: string
  slug: string
  code?: string | null
  sku?: string | null
  subtitle?: string | null
  description?: string | null
  materials?: string | null
  dimensions?: string | null
  care?: string | null
  availability?: string | null
  status?: string | null
  price?: string | null
  isFeatured?: boolean | null
  isNew?: boolean | null
  image?: string | null
  images?: { url: string; alt?: string | null }[] | null
  variants?: string[] | null
  category?: string | null
  collections?: (string | { collection: string })[] | null
  createdAt?: string | null
  updatedAt?: string | null
}

interface CategoryFile {
  name: string
  slug: string
  description?: string | null
  image?: string | null
  parent?: string | null
}

interface CollectionFile {
  name: string
  slug: string
  description?: string | null
  image?: string | null
}

const productFiles = import.meta.glob<{ default: ProductFile }>('../content/products/*.json', {
  eager: true,
})
const categoryFiles = import.meta.glob<{ default: CategoryFile }>(
  '../content/categories/*.json',
  { eager: true }
)
const collectionFiles = import.meta.glob<{ default: CollectionFile }>(
  '../content/collections/*.json',
  { eager: true }
)

// Products without a date sort as newest-first so fresh CMS entries surface on top.
const FALLBACK_DATE = new Date().toISOString()

const rawCategories = Object.values(categoryFiles).map((m) => m.default)
const rawCollections = Object.values(collectionFiles).map((m) => m.default)

const categoryBySlug = new Map(rawCategories.map((c) => [c.slug, c]))
const collectionBySlug = new Map(rawCollections.map((c) => [c.slug, c]))

function toSummary(p: Product): ProductSummary {
  const { description: _d, dimensions: _dm, care: _c, availability: _a, status: _s, isFeatured: _f, images: _i, variants: _v, createdAt: _ca, updatedAt: _ua, ...summary } = p
  return summary
}

function buildProducts(): Product[] {
  return Object.values(productFiles).map((m) => {
    const f = m.default
    const category = f.category ? categoryBySlug.get(f.category) : undefined
    return {
      name: f.name,
      slug: f.slug,
      code: f.code ?? null,
      sku: f.sku ?? null,
      subtitle: f.subtitle ?? null,
      description: f.description ?? null,
      materials: f.materials ?? null,
      dimensions: f.dimensions ?? null,
      care: f.care ?? null,
      availability: f.availability ?? '',
      status: f.status ?? 'active',
      price: f.price ?? null,
      isFeatured: f.isFeatured ?? false,
      isNew: f.isNew ?? false,
      image: f.image ?? null,
      images: (f.images ?? []).map((img) => ({ url: img.url, alt: img.alt ?? null })),
      variants: f.variants ?? [],
      category: category ? { name: category.name, slug: category.slug } : null,
      collections: (f.collections ?? [])
        .map((c) => (typeof c === 'string' ? c : c.collection))
        .map((slug) => collectionBySlug.get(slug))
        .filter((c): c is CollectionFile => Boolean(c))
        .map((c) => ({ name: c.name, slug: c.slug })),
      createdAt: f.createdAt ?? FALLBACK_DATE,
      updatedAt: f.updatedAt ?? FALLBACK_DATE,
    }
  })
}

const products = buildProducts()

function resolveCategorySlugs(slug: string): string[] {
  const category = categoryBySlug.get(slug)
  if (!category) return []
  return [slug, ...rawCategories.filter((c) => c.parent === slug).map((c) => c.slug)]
}

function bySort(sort: string) {
  switch (sort) {
    case 'name-asc':
      return (a: Product, b: Product) => a.name.localeCompare(b.name)
    case 'name-desc':
      return (a: Product, b: Product) => b.name.localeCompare(a.name)
    case 'price-asc':
      return (a: Product, b: Product) => (a.price ?? '').localeCompare(b.price ?? '')
    case 'price-desc':
      return (a: Product, b: Product) => (b.price ?? '').localeCompare(a.price ?? '')
    default:
      return (a: Product, b: Product) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  }
}

function listProducts(params: QueryParams): Paginated<ProductSummary> {
  const q = (params.q as string | undefined) ?? ''
  const category = (params.category as string | undefined) ?? ''
  const collection = (params.collection as string | undefined) ?? ''
  const material = (params.material as string | undefined) ?? ''
  const availability = (params.availability as string | undefined) ?? ''
  const featured = params.featured === 'true'
  const sort = (params.sort as string | undefined) ?? 'newest'
  const page = Math.max(1, Number(params.page ?? 1) || 1)
  const limit = Math.max(1, Number(params.limit ?? 12) || 12)

  let list = products.filter((p) => p.status === 'active')

  if (q) {
    const needle = q.toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        (p.description ?? '').toLowerCase().includes(needle) ||
        (p.sku ?? '').toLowerCase().includes(needle) ||
        (p.materials ?? '').toLowerCase().includes(needle)
    )
  }

  if (category) {
    const slugs = new Set(
      category
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .flatMap(resolveCategorySlugs)
    )
    list = list.filter((p) => p.category !== null && slugs.has(p.category.slug))
  }

  if (collection) {
    const slugs = new Set(
      collection
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    )
    list = list.filter((p) => p.collections.some((c) => slugs.has(c.slug)))
  }

  if (material) {
    const mats = material
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
    list = list.filter((p) => mats.some((m) => (p.materials ?? '').toLowerCase().includes(m)))
  }

  if (availability) {
    const set = new Set(
      availability
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    )
    list = list.filter((p) => set.has(p.availability))
  }

  if (featured) list = list.filter((p) => p.isFeatured)

  const sorted = [...list].sort(bySort(sort))
  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  const items = sorted.slice(start, start + limit).map(toSummary)

  return { items, total, page, pageSize: limit, totalPages }
}

function productDetail(slug: string): Product {
  const product = products.find((p) => p.slug === slug && p.status === 'active')
  if (!product) throw new Error('Product not found')
  return product
}

function relatedProducts(slug: string): ProductSummary[] {
  const product = productDetail(slug)
  return products
    .filter(
      (p) =>
        p.status === 'active' &&
        p.slug !== product.slug &&
        (p.category?.slug === product.category?.slug ||
          p.collections.some((c) => product.collections.some((pc) => pc.slug === c.slug)))
    )
    .slice(0, 4)
    .map(toSummary)
}

function buildCollections(): Collection[] {
  return rawCollections.map((c) => {
    const items = products
      .filter((p) => p.status === 'active' && p.collections.some((pc) => pc.slug === c.slug))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(toSummary)
    return {
      name: c.name,
      slug: c.slug,
      description: c.description ?? null,
      image: c.image ?? null,
      productCount: items.length,
      products: items,
    }
  })
}

const collections = buildCollections()

function collectionDetail(slug: string): Collection {
  const collection = collections.find((c) => c.slug === slug)
  if (!collection) throw new Error('Collection not found')
  return collection
}

function routeGet(path: string, params: QueryParams = {}): unknown {
  if (path === '/products') return listProducts(params)

  let match = path.match(/^\/products\/([^/]+)\/related$/)
  if (match) return { items: relatedProducts(decodeURIComponent(match[1])) }

  match = path.match(/^\/products\/([^/]+)$/)
  if (match) return productDetail(decodeURIComponent(match[1]))

  match = path.match(/^\/collections\/([^/]+)$/)
  if (match) return collectionDetail(decodeURIComponent(match[1]))

  throw new Error(`Route ${path} not found`)
}

export function get<T>(path: string, params?: QueryParams): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(routeGet(path, params) as T)
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Something went wrong.'))
      }
    }, 50)
  })
}

export function post<T>(_path: string, _body: unknown): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true } as T)
    }, 120)
  })
}
