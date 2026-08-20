import { prisma } from '../lib/prisma.js'
import { notFound } from '../lib/errors.js'
import type { Prisma } from '@prisma/client'

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
  collections: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { sortOrder: 'asc' as const }, select: { url: true, alt: true } },
} satisfies Prisma.ProductInclude

function toPublicList(p: Prisma.ProductGetPayload<{ include: typeof productInclude }>) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    code: p.code,
    sku: p.sku,
    subtitle: p.subtitle,
    materials: p.materials,
    price: p.price ? p.price.toString() : null,
    isNew: p.isNew,
    image: p.images[0]?.url ?? null,
    category: p.category,
    collections: p.collections,
  }
}

async function list() {
  const collections = await prisma.collection.findMany({
    orderBy: { id: 'asc' },
    include: { _count: { select: { products: true } } },
  })

  return collections.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    productCount: c._count.products,
  }))
}

async function getBySlug(slug: string) {
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: { _count: { select: { products: true } } },
  })
  if (!collection) throw notFound('Collection not found')

  const products = await prisma.product.findMany({
    where: { status: 'active', collections: { some: { slug } } },
    include: productInclude,
    orderBy: { createdAt: 'asc' },
  })

  return {
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description,
    image: collection.image,
    productCount: collection._count.products,
    products: products.map(toPublicList),
  }
}

export const collectionService = {
  list,
  getBySlug,
}