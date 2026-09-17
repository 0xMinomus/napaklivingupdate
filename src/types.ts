export interface CategoryRef {
  name: string
  slug: string
}

export interface CollectionRef {
  name: string
  slug: string
}

export interface ProductImage {
  url: string
  alt?: string | null
}

export interface ProductSummary {
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
  name: string
  slug: string
  description: string | null
  image: string | null
  eyebrow: string | null
  titleLine1: string | null
  titleLine2: string | null
  lead: string | null
  heroImage: string | null
  heroAlt: string | null
  storyEyebrow: string | null
  storyLine1: string | null
  storyLine2: string | null
  quote: string | null
  productCount: number
  products?: ProductSummary[]
}

export interface HomePage {
  heroImage: string | null
  heroAlt: string | null
}

export interface Settings {
  email: string
  tradeEmail: string
  whatsapp: string
  whatsappLabel: string | null
  instagram: string | null
  studioAddress: string | null
  mapsEmbedUrl: string | null
  mapsUrl: string | null
}

export interface LookbookEntry {
  image: string
  alt: string | null
  mono: string
  caption: string
  order: number
}