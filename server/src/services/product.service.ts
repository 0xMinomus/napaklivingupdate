import type { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { notFound } from '../lib/errors.js'
import type { ProductListQuery } from '../schemas/product.schema.js'

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
  collections: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { sortOrder: 'asc' as const }, select: { url: true, alt: true } },
  variants: { select: { name: true } },
} satisfies Prisma.ProductInclude

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof productInclude }>

function toPublicList(p: ProductWithRelations) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    code: p.code,
    sku: p.sku,
    subtitle: p.subtitle,
    description: p.description,
    materials: p.materials,
    dimensions: p.dimensions,
    availability: p.availability,
    price: p.price ? p.price.toString() : null,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    image: p.images[0]?.url ?? null,
    category: p.category,
    collections: p.collections,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }
}

function toPublicDetail(p: ProductWithRelations) {
  return {
    ...toPublicList(p),
    care: p.care,
    status: p.status,
    images: p.images,
    variants: p.variants.map((v) => v.name),
  }
}

function toOrderBy(sort: ProductListQuery['sort']): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case 'name-asc':
      return { name: 'asc' }
    case 'name-desc':
      return { name: 'desc' }
    case 'price-asc':
      return { price: 'asc' }
    case 'price-desc':
      return { price: 'desc' }
    case 'newest':
    default:
      return { createdAt: 'desc' }
  }
}

async function resolveCategoryIds(slug: string): Promise<number[]> {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { children: { select: { id: true } } },
  })
  if (!category) return []
  return [category.id, ...category.children.map((c) => c.id)]
}

async function resolveCollectionId(slug: string): Promise<number | null> {
  const collection = await prisma.collection.findUnique({ where: { slug }, select: { id: true } })
  return collection?.id ?? null
}

async function list(query: ProductListQuery) {
  const {
    q,
    category,
    collection,
    material,
    availability,
    featured,
    sort,
    page,
    limit,
  } = query

  const and: Prisma.ProductWhereInput[] = []

  if (q) {
    and.push({
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
        { materials: { contains: q, mode: 'insensitive' } },
      ],
    })
  }

  if (category) {
    const slugs = category.split(',').map((s) => s.trim()).filter(Boolean)
    const ids = (await Promise.all(slugs.map(resolveCategoryIds))).flat()
    and.push({ categoryId: { in: ids } })
  }

  if (collection) {
    const slugs = collection.split(',').map((s) => s.trim()).filter(Boolean)
    const ids = (await Promise.all(slugs.map(resolveCollectionId))).filter(
      (id): id is number => id !== null
    )
    if (ids.length === 0) {
      return { items: [], total: 0, page, pageSize: limit, totalPages: 1 }
    }
    and.push({ collections: { some: { id: { in: ids } } } })
  }

  if (material) {
    const list = material.split(',').map((s) => s.trim()).filter(Boolean)
    and.push({
      OR: list.map((m) => ({ materials: { contains: m, mode: 'insensitive' } })),
    })
  }

  if (availability) {
    const list = availability.split(',').map((s) => s.trim()).filter(Boolean)
    and.push({ availability: { in: list } })
  }

  if (featured === 'true') {
    and.push({ isFeatured: true })
  }

  const where: Prisma.ProductWhereInput = { status: 'active', AND: and }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: toOrderBy(sort),
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return {
    items: items.map(toPublicList),
    total,
    page,
    pageSize: limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}

async function getBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, status: 'active' },
    include: productInclude,
  })
  if (!product) throw notFound('Product not found')
  return toPublicDetail(product)
}

async function getFeatured(limit = 8) {
  const items = await prisma.product.findMany({
    where: { status: 'active', isFeatured: true },
    include: productInclude,
    orderBy: { createdAt: 'asc' },
    take: limit,
  })
  return items.map(toPublicList)
}

async function getRelated(slug: string, limit = 4) {
  const product = await prisma.product.findFirst({
    where: { slug, status: 'active' },
    select: { id: true, categoryId: true, collections: { select: { id: true } } },
  })
  if (!product) throw notFound('Product not found')

  const items = await prisma.product.findMany({
    where: {
      status: 'active',
      id: { not: product.id },
      OR: [
        { categoryId: product.categoryId ?? -1 },
        { collections: { some: { id: { in: product.collections.map((c) => c.id) } } } },
      ],
    },
    include: productInclude,
    take: limit,
  })

  return items.map(toPublicList)
}

export const productService = {
  list,
  getBySlug,
  getFeatured,
  getRelated,
}