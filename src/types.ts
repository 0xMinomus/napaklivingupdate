export interface CategoryRef {
  id: number
  name: string
  slug: string
}

export interface CollectionRef {
  id: number
  name: string
  slug: string
}

export interface ProductImage {
  url: string
  alt?: string | null
}

export interface ProductSummary {
  id: number
  name: string
  slug: string
  code: string | null
  sku: string | null
  subtitle: string | null
  materials: string | null
  price: string | null
  isNew: boolean
  image: string | null
  category: CategoryRef | null
  collections: CollectionRef[]
}

export interface Product extends ProductSummary {
  description: string | null
  dimensions: string | null
  care: string | null
  availability: string
  status: string
  isFeatured: boolean
  images: ProductImage[]
  variants: string[]
  createdAt: string
  updatedAt: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  image: string | null
  parent: CategoryRef | null
  children?: CategoryRef[]
  productCount: number
  products?: ProductSummary[]
}

export interface Collection {
  id: number
  name: string
  slug: string
  description: string | null
  image: string | null
  productCount: number
  products?: ProductSummary[]
}