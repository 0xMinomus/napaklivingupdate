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
  const categories = await prisma.category.findMany({
    orderBy: { id: 'asc' },
    include: {
      parent: { select: { id: true, name: true, slug: true } },
      _count: { select: { products: true } },
    },
  })

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    parent: c.parent,
    productCount: c._count.products,
  }))
}

async function getBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      parent: { select: { id: true, name: true, slug: true } },
      children: { select: { id: true, name: true, slug: true } },
      _count: { select: { products: true } },
    },
  })
  if (!category) throw notFound('Category not found')

  const ids = [category.id, ...category.children.map((c) => c.id)]
  const products = await prisma.product.findMany({
    where: { status: 'active', categoryId: { in: ids } },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  })

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    parent: category.parent,
    children: category.children,
    productCount: category._count.products,
    products: products.map(toPublicList),
  }
}

export const categoryService = {
  list,
  getBySlug,
}