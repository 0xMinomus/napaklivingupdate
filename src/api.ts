import type { AboutPage, BusinessPage, Category, Collection, ContactPage, HomePage, LookbookEntry, LookbookPage, PageHero, Paginated, Product, ProductSummary, Settings } from './types'

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
  order?: number | null
  showOnHome?: boolean | null
  eyebrow?: string | null
  title1?: string | null
  title2?: string | null
  lead?: string | null
  searchLabel?: string | null
}

interface CollectionFile {
  name: string
  slug: string
  description?: string | null
  image?: string | null
  tagline?: string | null
  order?: number | null
  eyebrow?: string | null
  titleLine1?: string | null
  titleLine2?: string | null
  lead?: string | null
  heroImage?: string | null
  heroAlt?: string | null
  storyEyebrow?: string | null
  storyLine1?: string | null
  storyLine2?: string | null
  quote?: string | null
}

const pageFiles = import.meta.glob<{ default: Record<string, unknown> }>(
  '../content/pages/*.json',
  { eager: true }
)

interface SettingsFile {
  email?: string | null
  tradeEmail?: string | null
  whatsapp?: string | null
  whatsappLabel?: string | null
  instagram?: string | null
  studioAddress?: string | null
  mapsEmbedUrl?: string | null
  mapsUrl?: string | null
  footerTagline?: string | null
  newsletterTitle?: string | null
  newsletterText?: string | null
  newsletterPlaceholder?: string | null
  copyrightNote?: string | null
  locationNote?: string | null
}

interface LookbookFile {
  image?: string | null
  alt?: string | null
  mono?: string | null
  caption?: string | null
  order?: number | null
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
const settingsFiles = import.meta.glob<{ default: SettingsFile }>('../content/settings.json', {
  eager: true,
})
const lookbookFiles = import.meta.glob<{ default: LookbookFile }>(
  '../content/lookbook/*.json',
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
  const list = rawCollections.map((c) => {
    const items = products
      .filter((p) => p.status === 'active' && p.collections.some((pc) => pc.slug === c.slug))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(toSummary)
    return {
      name: c.name,
      slug: c.slug,
      description: c.description ?? null,
      image: c.image ?? null,
      tagline: c.tagline ?? null,
      order: c.order ?? 0,
      eyebrow: c.eyebrow ?? null,
      titleLine1: c.titleLine1 ?? null,
      titleLine2: c.titleLine2 ?? null,
      lead: c.lead ?? null,
      heroImage: c.heroImage ?? null,
      heroAlt: c.heroAlt ?? null,
      storyEyebrow: c.storyEyebrow ?? null,
      storyLine1: c.storyLine1 ?? null,
      storyLine2: c.storyLine2 ?? null,
      quote: c.quote ?? null,
      productCount: items.length,
      products: items,
    }
  })
  return list.sort((a, b) => a.order - b.order)
}

const collections = buildCollections()

function collectionDetail(slug: string): Collection {
  const collection = collections.find((c) => c.slug === slug)
  if (!collection) throw new Error('Collection not found')
  return collection
}

const DEFAULT_HERO_IMAGE = '/pexels-the-ghazi-2152398165-36353283.webp'

export const DEFAULT_SETTINGS: Settings = {
  email: 'hello@napakliving.com',
  tradeEmail: 'trade@napakliving.com',
  whatsapp: 'https://wa.me/6281234567890',
  whatsappLabel: '+62 812 3456 7890',
  instagram: '#footer',
  studioAddress: 'Jimbaran\nBali, Indonesia\nby appointment',
  mapsEmbedUrl: 'https://maps.google.com/maps?q=-8.7961749,115.1869325&z=16&output=embed',
  mapsUrl: 'https://maps.app.goo.gl/EVkYBVYKu3ViL8aE8',
  footerTagline: 'Objects for a slower home.',
  newsletterTitle: 'Stay close',
  newsletterText: 'Occasional notes from our home.',
  newsletterPlaceholder: 'Email address',
  copyrightNote: '© 2024 Napak Living',
  locationNote: 'Jakarta / Indonesia',
}

function siteSettings(): Settings {
  const entry = Object.values(settingsFiles)[0]?.default ?? null
  return {
    email: entry?.email ?? DEFAULT_SETTINGS.email,
    tradeEmail: entry?.tradeEmail ?? DEFAULT_SETTINGS.tradeEmail,
    whatsapp: entry?.whatsapp ?? DEFAULT_SETTINGS.whatsapp,
    whatsappLabel: entry?.whatsappLabel ?? DEFAULT_SETTINGS.whatsappLabel,
    instagram: entry?.instagram ?? DEFAULT_SETTINGS.instagram,
    studioAddress: entry?.studioAddress ?? DEFAULT_SETTINGS.studioAddress,
    mapsEmbedUrl: entry?.mapsEmbedUrl ?? DEFAULT_SETTINGS.mapsEmbedUrl,
    mapsUrl: entry?.mapsUrl ?? DEFAULT_SETTINGS.mapsUrl,
    footerTagline: entry?.footerTagline ?? DEFAULT_SETTINGS.footerTagline,
    newsletterTitle: entry?.newsletterTitle ?? DEFAULT_SETTINGS.newsletterTitle,
    newsletterText: entry?.newsletterText ?? DEFAULT_SETTINGS.newsletterText,
    newsletterPlaceholder: entry?.newsletterPlaceholder ?? DEFAULT_SETTINGS.newsletterPlaceholder,
    copyrightNote: entry?.copyrightNote ?? DEFAULT_SETTINGS.copyrightNote,
    locationNote: entry?.locationNote ?? DEFAULT_SETTINGS.locationNote,
  }
}

export const DEFAULT_HOME: HomePage = {  heroImage: DEFAULT_HERO_IMAGE,
  heroAlt: null,
  heroTitle1: 'A room that feels',
  heroTitle2: 'like coming home.',
  heroLead:
    'Everyday objects made by hand, thoughtfully selected, and designed to live with you for years.',
  heroCta: 'Shop the collection',
  introEyebrow: 'A considered collection',
  introTitle1: 'Objects that belong',
  introTitle2: 'without a loud voice.',
  introLead:
    'Napak Living brings together home decor, table accessories, and lifestyle pieces that slow the rhythm of home. Each form celebrates natural texture, beautiful imperfection, and the small moments that make a space feel like ours.',
  featuredEyebrow: 'Selected objects / 01',
  featuredTitle1: 'Pieces with',
  featuredTitle2: 'a quiet presence.',
  collectionsEyebrow: 'Curated by feeling / 02',
  collectionsTitle1: 'Collections for',
  collectionsTitle2: 'everyday living.',
  categoryEyebrow: 'Browse by category / 03',
  categoryTitle1: 'Make space for',
  categoryTitle2: 'what matters.',
  lookbookEyebrow: 'The Napak journal / 04',
  lookbookTitle1: 'Scenes from',
  lookbookTitle2: 'a slower home.',
  storyImage:
    'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=70',
  storyAlt: 'Natural material textures and handmade ceramics',
  storyNote: 'made by hand / made to stay',
  storyEyebrow: 'Our story / 05',
  storyTitle1: 'Made for the',
  storyTitle2: 'life inside.',
  storyLead:
    'Napak means a trace. We believe home is not about perfection, but about the traces of life that grow within it. We work with local artisans to create simple, useful forms with room to become part of your story.',
  storyValues: ['Honest materials', 'Made locally', 'Made to last'],
  tradeEyebrow: 'For your next space / 06',
  tradeTitle1: 'Let’s make a',
  tradeTitle2: 'space together.',
  tradeText:
    'For interior designers, hospitality teams, retail partners, or custom projects — let us talk about how Napak can enter your space.',
  tradeButton: 'Start a conversation',
  tradeIndex: 'TRADE / 06',
}

export const DEFAULT_LOOKBOOK_PAGE: LookbookPage = {
  heroEyebrow: 'The Napak journal',
  heroTitle1: 'Scenes from',
  heroTitle2: 'a slower home.',
  heroLead:
    'A space is not only what we see, but how it makes us feel. Discover the details, textures, and objects that shape the Napak Living rhythm.',
  tradeEyebrow: 'For the trade / catalog access',
  tradeTitle1: 'Take Napak',
  tradeTitle2: 'with you.',
  tradeText:
    'Download the trade catalog for project, hospitality, and wholesale partnership references.',
  tradeButton: 'Request trade catalog',
  tradeIndex: 'PDF / 2024',
}

export const DEFAULT_COLLECTIONS_PAGE: PageHero = {
  heroEyebrow: 'Curated by feeling',
  heroTitle1: 'Find a feeling',
  heroTitle2: 'to live with.',
  heroLead:
    'A collection of thoughtfully chosen pieces, made by skilled Indonesian artisans. From tableware to home décor and hospitality essentials, each piece reflects the beauty and character of handmade craftsmanship.',
}

export const DEFAULT_CATALOG_PAGE: PageHero = {
  heroEyebrow: 'The catalog / all objects',
  heroTitle1: 'Objects for',
  heroTitle2: 'everyday living.',
  heroLead: 'Quiet forms that fill the home with more feeling and less noise.',
}

export const DEFAULT_ABOUT: AboutPage = {
  heroEyebrow: 'Our story / a beginning',
  heroTitle1: 'Made for the',
  heroTitle2: 'life inside.',
  heroLead: 'Napak means a trace. We create objects that give life room to leave its own trace.',
  heroImage:
    'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=70',
  heroAlt: 'A home interior with natural materials and textured furniture',
  statementEyebrow: 'A point of view',
  statementTitle1: 'Home is not a look.',
  statementTitle2: 'It is a feeling.',
  statementLead:
    'Napak Living was born from a desire to slow down how we choose and live with objects. We believe a good object does not need to shout to feel meaningful.',
  storyEyebrow: 'The beginning / 2024',
  storyTitle1: 'Objects that',
  storyTitle2: 'leave a trace.',
  storyImage:
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=700&q=70',
  storyAlt: 'The process and result of handmade ceramics in natural tones',
  storyLead1:
    'We started Napak with a simple question: why cannot the objects we use every day feel more personal? From there, we began working with artisans to explore useful forms, honest materials, and an unhurried process.',
  storyLead2:
    'Every product has slight differences. To us, this is not a flaw, but proof that it has been touched, shaped, and given time.',
  philosophyEyebrow: 'Our philosophy',
  philosophyTitle1: 'Less, but',
  philosophyTitle2: 'more considered.',
  philosophyLead:
    'We design with three questions: is it useful, does it feel good in the hand, and can it live with you for a long time?',
  values: [
    { title: 'Honest materials', text: 'We let wood, clay, and fibers show their natural character.' },
    { title: 'Made locally', text: 'Hand knowledge and collaboration with artisans are part of every form.' },
    { title: 'Made to last', text: 'Objects are designed to be used, cared for, and passed through everyday life.' },
    { title: 'Room for change', text: 'A good object does not dictate a room; it grows with it.' },
  ],
  materialsEyebrow: 'Materials & craftsmanship',
  materialsTitle1: 'Touch is part',
  materialsTitle2: 'of the design.',
  materials: [
    { tag: '01 / ceramic', title: 'Shaped earth', text: 'Stoneware and terracotta with soft, understated glazes.' },
    { tag: '02 / wood', title: 'Warm grain', text: 'Selected wood treated with a natural finish so it remains alive to the touch.' },
    { tag: '03 / textile', title: 'Everyday texture', text: 'Fibers and linen that add a tactile quality to tables and rooms.' },
  ],
}

export const DEFAULT_BUSINESS: BusinessPage = {
  heroEyebrow: 'For your next space',
  heroTitle1: 'Let’s make a',
  heroTitle2: 'space together.',
  heroLead:
    'We are open to collaborations with designers, hospitality teams, retail partners, and anyone who wants to bring Napak into a new space.',
  heroImage:
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=70',
  heroAlt: 'A hospitality space with natural interiors and decorative objects',
  asideEyebrow: 'Start a conversation / 01',
  asideTitle: 'Tell us what you are building.',
  asideText:
    'Tell us about your needs and project context. Our team will follow up by email or WhatsApp.',
  servicesEyebrow: 'Ways we work / 02',
  servicesTitle1: 'A place for',
  servicesTitle2: 'good collaborations.',
  services: [
    { mono: '01 / wholesale', title: 'Stock Napak', text: 'For stores and distributors who want to bring our collection to their community.' },
    { mono: '02 / design trade', title: 'Source with us', text: 'Access specifications and support for interior and styling projects.' },
    { mono: '03 / hospitality', title: 'Set the scene', text: 'Objects for hotels, restaurants, cafés, and spaces that welcome many stories.' },
    { mono: '04 / custom', title: 'Make something', text: 'Collaborations and custom orders for more specific needs.' },
  ],
}

export const DEFAULT_CONTACT: ContactPage = {
  heroEyebrow: 'Say hello / we are here',
  heroTitle1: 'Let’s stay',
  heroTitle2: 'in touch.',
  heroLead:
    'For product questions, orders, or simply to say hello, send a message through the channel that feels most convenient for you.',
  infoTitle: 'Come by, write, or call.',
  infoText: 'We will do our best to reply within 1–2 business days.',
  mapLabel: 'Visit the studio',
  mapName: 'Napak Living Studio',
  mapText: 'Jimbaran, Bali — open by appointment. Tap the pin for directions.',
}

const PAGE_DEFAULTS: Record<string, object> = {
  home: DEFAULT_HOME,
  about: DEFAULT_ABOUT,
  business: DEFAULT_BUSINESS,
  contact: DEFAULT_CONTACT,
  lookbook: DEFAULT_LOOKBOOK_PAGE,
  collections: DEFAULT_COLLECTIONS_PAGE,
  catalog: DEFAULT_CATALOG_PAGE,
}

function pageBySlug<T extends object>(slug: string, defaults: T): T {
  const entry = Object.entries(pageFiles).find(([path]) => path.endsWith(`/${slug}.json`))
  const file = (entry ? entry[1].default : {}) as Partial<T>
  const merged = { ...defaults }
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const value = file[key]
    if (value === undefined || value === null) continue
    if (Array.isArray(value) && value.length === 0) continue
    ;(merged as Record<string, unknown>)[key as string] = value
  }
  return merged
}

function homePage(): HomePage {
  return pageBySlug('home', { ...DEFAULT_HOME })
}

export const DEFAULT_LOOKBOOK: LookbookEntry[] = [
  {
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=70',
    alt: 'A living room corner with a vase and natural light',
    mono: '01 / living slowly',
    caption: 'Details in the everyday',
    order: 1,
  },
  {
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=70',
    alt: 'A dining table styled with ceramics and flowers',
    mono: '02 / gather here',
    caption: 'A table made for staying',
    order: 2,
  },
  {
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=500&q=70',
    alt: 'A decorative detail in sunlight',
    mono: '03 / natural light',
    caption: 'Find your quiet',
    order: 3,
  },
]

function lookbookEntries(): LookbookEntry[] {
  const items = Object.values(lookbookFiles).map((m) => {
    const f = m.default
    return {
      image: f.image ?? '',
      alt: f.alt ?? null,
      mono: f.mono ?? '',
      caption: f.caption ?? '',
      order: f.order ?? 0,
    }
  }).filter((e) => e.image !== '' && e.caption !== '')
  if (items.length === 0) return DEFAULT_LOOKBOOK
  return items.sort((a, b) => a.order - b.order)
}

function buildCategories(): Category[] {
  const list = rawCategories.map((c) => {
    const childSlugs = rawCategories.filter((k) => k.parent === c.slug).map((k) => k.slug)
    const inTree = new Set([c.slug, ...childSlugs])
    const count = products.filter((p) => p.status === 'active' && p.category !== null && inTree.has(p.category.slug)).length
    const parent = c.parent ? categoryBySlug.get(c.parent) : undefined
    return {
      name: c.name,
      slug: c.slug,
      description: c.description ?? null,
      image: c.image ?? null,
      parent: parent ? { name: parent.name, slug: parent.slug } : null,
      children: childSlugs
        .map((slug) => categoryBySlug.get(slug))
        .filter((k): k is CategoryFile => Boolean(k))
        .map((k) => ({ name: k.name, slug: k.slug })),
      productCount: count,
      eyebrow: c.eyebrow ?? null,
      title1: c.title1 ?? null,
      title2: c.title2 ?? null,
      lead: c.lead ?? null,
      searchLabel: c.searchLabel ?? null,
      showOnHome: c.showOnHome ?? false,
      order: c.order ?? 0,
    }
  })
  return list.sort((a, b) => a.order - b.order)
}

const categories = buildCategories()

function routeGet(path: string, params: QueryParams = {}): unknown {
  if (path === '/products') return listProducts(params)
  if (path === '/categories') return { items: categories }
  if (path === '/home') return homePage()
  if (path === '/settings') return siteSettings()
  if (path === '/lookbook') return { items: lookbookEntries() }
  if (path === '/collections') return { items: collections }

  const pageMatch = path.match(/^\/pages\/([^/]+)$/)
  if (pageMatch) {
    const slug = decodeURIComponent(pageMatch[1])
    const defaults = PAGE_DEFAULTS[slug]
    if (!defaults) throw new Error(`Route ${path} not found`)
    return pageBySlug(slug, defaults)
  }

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
