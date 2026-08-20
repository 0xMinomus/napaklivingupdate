import type { Collection, Paginated, Product, ProductSummary } from './types'
import { categories, collections, products } from './data/catalog'

export const API_URL: string = (import.meta.env as { VITE_API_URL?: string } | undefined)
  ?.VITE_API_URL ?? '/api'

type QueryParams = Record<string, string | number | boolean | undefined>

const toSummary = (p: Product): ProductSummary => p

function resolveCategoryIds(slug: string): number[] {
  const category = categories.find((c) => c.slug === slug)
  if (!category) return []
  const children = categories.filter((c) => c.parent?.slug === slug)
  return [category.id, ...children.map((c) => c.id)]
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
    const ids = new Set(
      category
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .flatMap(resolveCategoryIds)
    )
    list = list.filter((p) => p.category !== null && ids.has(p.category.id))
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
        p.id !== product.id &&
        (p.category?.id === product.category?.id ||
          p.collections.some((c) => product.collections.some((pc) => pc.id === c.id)))
    )
    .slice(0, 4)
    .map(toSummary)
}

function collectionDetail(slug: string): Collection {
  const collection = collections.find((c) => c.slug === slug)
  if (!collection) throw new Error('Collection not found')
  const items = products
    .filter((p) => p.status === 'active' && p.collections.some((c) => c.slug === slug))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map(toSummary)
  return { ...collection, productCount: items.length, products: items }
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