/**
 * Napak Living — database seed.
 *
 * Data is derived from the existing static frontend content
 * (shop, category, collection and product pages) so the catalog
 * matches what the site already presents.
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`

const localImg = (file: string) => `/Product/${encodeURI(file)}`

type CategorySeed = {
  name: string
  slug: string
  description?: string
  image?: string
  children?: { name: string; slug: string; description?: string }[]
}

const categories: CategorySeed[] = [
  {
    name: 'Home Decor',
    slug: 'home-decor',
    description:
      'Vases, decorative objects, and candle holders that bring character to small corners of the home.',
    image: img('photo-1612196808214-b8e1d6145a8c', 1200),
    children: [
      { name: 'Vases & Vessels', slug: 'vases', description: 'Vessels for stems, branches, or standing alone.' },
      { name: 'Candle Holders', slug: 'candle-holders', description: 'Small forms made for a quiet glow.' },
      { name: 'Decorative Objects', slug: 'decorative-objects', description: 'Objects that hold a space without a loud voice.' },
    ],
  },
  {
    name: 'Table Accessories',
    slug: 'table-accessories',
    description:
      'Bowls, trays, and serving pieces for meals and rituals that deserve a little more attention.',
    image: img('photo-1603199506016-b9a594b593c0', 1200),
    children: [
      { name: 'Bowls', slug: 'bowls', description: 'Generous forms made to be approached and shared.' },
      { name: 'Trays', slug: 'trays', description: 'Warm surfaces for carrying everyday rituals.' },
      { name: 'Serving Pieces', slug: 'serving-pieces', description: 'Platters and bowls made for gathering.' },
    ],
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Everyday pieces that add texture and ritual to the home.',
    image: img('photo-1603905179139-db12ab5350e4', 1200),
  },
]

type CollectionSeed = {
  name: string
  slug: string
  description: string
  image: string
}

const collections: CollectionSeed[] = [
  {
    name: 'Ruang Pagi',
    slug: 'ruang-pagi',
    description:
      'Soft colors and quiet forms for a slower start to the day. Ruang Pagi gathers light forms that catch the first light and make a home feel open.',
    image: img('photo-1600607687920-4e2a09cf159d', 1500),
  },
  {
    name: 'Bumi Tenang',
    slug: 'bumi-tenang',
    description:
      'Honest materials and natural textures for a grounded home. Bumi Tenang brings earth tones and enduring forms into the everyday.',
    image: img('photo-1618221195710-dd6b41faaea6', 1200),
  },
  {
    name: 'The Table, Slowly',
    slug: 'the-table-slowly',
    description: 'A table collection for conversations that do not need to be rushed.',
    image: img('photo-1600210492486-724fe5c67fb0', 1500),
  },
]

type ProductSeed = {
  name: string
  slug: string
  code: string
  sku: string
  category: string
  collections: string[]
  subtitle: string
  description: string
  materials: string
  dimensions: string
  variants: string[]
  mainImage: string
  isFeatured?: boolean
  isNew?: boolean
}

const products: ProductSeed[] = [
  {
    name: 'Mira Bud Vase',
    slug: 'mira-bud-vase',
    code: 'NL / 001',
    sku: 'NL-MIRA-001',
    category: 'vases',
    collections: ['ruang-pagi'],
    subtitle: 'A small vase for a single stem.',
    description:
      'Mira is a compact bud vase with a soft, quiet finish, made to hold a single stem or stand alone on a shelf.',
    materials: 'Glazed ceramic',
    dimensions: 'Ø 10 · H 15 cm',
    variants: ['Chalk', 'Sand'],
    mainImage: localImg('WhatsApp Image 2026-08-20 at 116.06.04.jpeg'),
    isFeatured: true,
    isNew: true,
  },
  {
    name: 'Lina Tray',
    slug: 'lina-tray',
    code: 'NL / 002',
    sku: 'NL-LINA-002',
    category: 'trays',
    collections: ['ruang-pagi'],
    subtitle: 'A warm surface for everyday rituals.',
    description:
      'Lina is a teak tray with edges that feel comfortable in the hand, made to carry morning coffee or gather small objects.',
    materials: 'Solid teak wood',
    dimensions: 'W 32 · D 22 · H 4 cm',
    variants: ['Natural teak', 'Dark teak'],
    mainImage: localImg('WhatsApp Image 2026-08-20 at 16.06.03.jpeg'),
    isNew: true,
  },
  {
    name: 'Nala Bowl',
    slug: 'nala-bowl',
    code: 'NL / 003',
    sku: 'NL-NALA-003',
    category: 'bowls',
    collections: ['bumi-tenang'],
    subtitle: 'A generous bowl for the things we share.',
    description:
      'Nala has a rounded, generous form made to be approached. Use it to serve fruit, hold small objects, or let it sit as a quiet centerpiece.',
    materials: 'Stoneware ceramic',
    dimensions: 'Ø 26 · H 8 cm',
    variants: ['Cloud', 'Earth', 'Moss'],
    mainImage: localImg('WhatsApp Image 2026-08-20 at 16.06.04.jpeg'),
    isFeatured: true,
    isNew: true,
  },
  {
    name: 'Gita Candle Holder',
    slug: 'gita-candle-holder',
    code: 'NL / 004',
    sku: 'NL-GITA-004',
    category: 'candle-holders',
    collections: ['bumi-tenang'],
    subtitle: 'A small glow for the end of the day.',
    description:
      'Gita is made to hold a small glow. Its earthy terracotta and rounded form make candlelight feel warmer, on a table or in a quiet corner.',
    materials: 'Hand-fired terracotta',
    dimensions: 'Ø 9 · H 7 cm',
    variants: ['Burnt clay', 'Natural clay'],
    mainImage: localImg('WhatsApp Image 2026-08-20 at 16.06.104.jpeg'),
    isFeatured: true,
    isNew: true,
  },
  {
    name: 'Rima Platter',
    slug: 'rima-platter',
    code: 'NL / 005',
    sku: 'NL-RIMA-005',
    category: 'serving-pieces',
    collections: ['the-table-slowly'],
    subtitle: 'A generous platter for sharing.',
    description:
      'Rima is a solid teak platter for breads, fruits, or everyday serving, finished to stay alive to the touch.',
    materials: 'Solid teak wood',
    dimensions: 'W 40 · D 20 · H 3 cm',
    variants: ['Natural teak'],
    mainImage: localImg('WhatsApp Image 2026-08-210 at 16.06.06.jpeg'),
    isNew: true,
  },
  {
    name: 'Wira Catchall',
    slug: 'wira-catchall',
    code: 'NL / 006',
    sku: 'NL-WIRA-006',
    category: 'lifestyle',
    collections: ['bumi-tenang'],
    subtitle: 'A quiet place for small things.',
    description:
      'Wira is a small teak catchall for keys, coins, and other objects that need a place to land at the end of the day.',
    materials: 'Teak wood',
    dimensions: 'W 16 · D 12 · H 4 cm',
    variants: ['Natural teak', 'Dark teak'],
    mainImage: localImg('WhatsApp Image 2026-108-20 at 16.06.06.jpeg'),
    isNew: true,
  },
]

async function main() {
  console.log('Seeding Napak Living database…')

  // Reset products completely (cascades to product images and variants).
  const deleted = await prisma.product.deleteMany()
  console.log(`Deleted ${deleted.count} existing products.`)

  // Categories (parents first, then children)
  const categoryIds = new Map<string, number>()
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, image: cat.image },
      create: { name: cat.name, slug: cat.slug, description: cat.description, image: cat.image },
    })
    categoryIds.set(cat.slug, created.id)
  }
  for (const cat of categories) {
    for (const child of cat.children ?? []) {
      const created = await prisma.category.upsert({
        where: { slug: child.slug },
        update: {
          name: child.name,
          description: child.description,
          parentId: categoryIds.get(cat.slug),
        },
        create: {
          name: child.name,
          slug: child.slug,
          description: child.description,
          parentId: categoryIds.get(cat.slug),
        },
      })
      categoryIds.set(child.slug, created.id)
    }
  }

  // Collections
  const collectionIds = new Map<string, number>()
  for (const coll of collections) {
    const created = await prisma.collection.upsert({
      where: { slug: coll.slug },
      update: { name: coll.name, description: coll.description, image: coll.image },
      create: { name: coll.name, slug: coll.slug, description: coll.description, image: coll.image },
    })
    collectionIds.set(coll.slug, created.id)
  }

  // Products
  for (const p of products) {
    const categoryId = categoryIds.get(p.category)
    if (!categoryId) {
      throw new Error(`Unknown category slug for product ${p.name}: ${p.category}`)
    }
    const collectionIdsForProduct = p.collections
      .map((slug) => collectionIds.get(slug))
      .filter((id): id is number => Boolean(id))

    const images = [
      { url: p.mainImage, alt: `${p.name}, ${p.materials?.toLowerCase()}`, sortOrder: 0 },
    ]

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        code: p.code,
        sku: p.sku,
        subtitle: p.subtitle,
        description: p.description,
        materials: p.materials,
        dimensions: p.dimensions,
        availability: 'made-to-order',
        status: 'active',
        isFeatured: p.isFeatured ?? false,
        isNew: p.isNew ?? false,
        categoryId,
        collections: { set: collectionIdsForProduct.map((id) => ({ id })) },
        images: {
          deleteMany: {},
          create: images,
        },
        variants: {
          deleteMany: {},
          create: p.variants.map((name) => ({ name })),
        },
      },
      create: {
        name: p.name,
        slug: p.slug,
        code: p.code,
        sku: p.sku,
        subtitle: p.subtitle,
        description: p.description,
        materials: p.materials,
        dimensions: p.dimensions,
        care: 'Wipe with soft cloth',
        availability: 'made-to-order',
        status: 'active',
        isFeatured: p.isFeatured ?? false,
        isNew: p.isNew ?? false,
        categoryId,
        collections: { connect: collectionIdsForProduct.map((id) => ({ id })) },
        images: { create: images },
        variants: { create: p.variants.map((name) => ({ name })) },
      },
    })
  }

  console.log(
    `Done. Seeded ${categories.length} parent categories, ${collections.length} collections, ${products.length} products.`
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })