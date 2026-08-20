import { z } from 'zod'

export const productListQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z.string().trim().max(120).optional(),
  collection: z.string().trim().max(120).optional(),
  material: z.string().trim().max(60).optional(),
  availability: z.string().trim().max(60).optional(),
  featured: z.enum(['true', 'false']).optional(),
  sort: z
    .enum(['newest', 'name-asc', 'name-desc', 'price-asc', 'price-desc'])
    .default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(8),
})

export type ProductListQuery = z.infer<typeof productListQuerySchema>