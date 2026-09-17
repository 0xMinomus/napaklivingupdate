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
  children: CategoryRef[]
  productCount: number
  eyebrow: string | null
  title1: string | null
  title2: string | null
  lead: string | null
  searchLabel: string | null
  showOnHome: boolean
  order: number
  products?: ProductSummary[]
}

export interface Collection {
  name: string
  slug: string
  description: string | null
  image: string | null
  tagline: string | null
  order: number
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
  heroTitle1: string
  heroTitle2: string
  heroLead: string
  heroCta: string
  introEyebrow: string
  introTitle1: string
  introTitle2: string
  introLead: string
  featuredEyebrow: string
  featuredTitle1: string
  featuredTitle2: string
  collectionsEyebrow: string
  collectionsTitle1: string
  collectionsTitle2: string
  categoryEyebrow: string
  categoryTitle1: string
  categoryTitle2: string
  lookbookEyebrow: string
  lookbookTitle1: string
  lookbookTitle2: string
  storyImage: string
  storyAlt: string | null
  storyNote: string
  storyEyebrow: string
  storyTitle1: string
  storyTitle2: string
  storyLead: string
  storyValues: string[]
  tradeEyebrow: string
  tradeTitle1: string
  tradeTitle2: string
  tradeText: string
  tradeButton: string
  tradeIndex: string
}

export interface PageHero {
  heroEyebrow: string
  heroTitle1: string
  heroTitle2: string
  heroLead: string
}

export interface LookbookPage extends PageHero {
  tradeEyebrow: string
  tradeTitle1: string
  tradeTitle2: string
  tradeText: string
  tradeButton: string
  tradeIndex: string
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
  footerTagline: string
  newsletterTitle: string
  newsletterText: string
  newsletterPlaceholder: string
  copyrightNote: string
  locationNote: string
}

export interface LookbookEntry {
  image: string
  alt: string | null
  mono: string
  caption: string
  order: number
}

export interface TextItem {
  title: string
  text: string
}

export interface TaggedTextItem extends TextItem {
  tag: string
}

export interface ServiceItem extends TextItem {
  mono: string
}

export interface AboutPage {
  heroEyebrow: string
  heroTitle1: string
  heroTitle2: string
  heroLead: string
  heroImage: string
  heroAlt: string | null
  statementEyebrow: string
  statementTitle1: string
  statementTitle2: string
  statementLead: string
  storyEyebrow: string
  storyTitle1: string
  storyTitle2: string
  storyImage: string
  storyAlt: string | null
  storyLead1: string
  storyLead2: string
  philosophyEyebrow: string
  philosophyTitle1: string
  philosophyTitle2: string
  philosophyLead: string
  values: TextItem[]
  materialsEyebrow: string
  materialsTitle1: string
  materialsTitle2: string
  materials: TaggedTextItem[]
}

export interface BusinessPage {
  heroEyebrow: string
  heroTitle1: string
  heroTitle2: string
  heroLead: string
  heroImage: string
  heroAlt: string | null
  asideEyebrow: string
  asideTitle: string
  asideText: string
  servicesEyebrow: string
  servicesTitle1: string
  servicesTitle2: string
  services: ServiceItem[]
}

export interface ContactPage {
  heroEyebrow: string
  heroTitle1: string
  heroTitle2: string
  heroLead: string
  infoTitle: string
  infoText: string
  mapLabel: string
  mapName: string
  mapText: string
}