import type { FastifyReply, FastifyRequest } from 'fastify'
import { productService } from '../services/product.service.js'
import { productListQuerySchema } from '../schemas/product.schema.js'

async function list(req: FastifyRequest, reply: FastifyReply) {
  const query = productListQuerySchema.parse(req.query)
  const result = await productService.list(query)
  return reply.send(result)
}

async function featured(req: FastifyRequest, reply: FastifyReply) {
  const query = productListQuerySchema.pick({ limit: true }).safeParse(req.query)
  const limit = query.success ? query.data.limit : 8
  const items = await productService.getFeatured(limit)
  return reply.send({ items })
}

async function detail(req: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
  const product = await productService.getBySlug(req.params.slug)
  return reply.send(product)
}

async function related(req: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
  const items = await productService.getRelated(req.params.slug)
  return reply.send({ items })
}

export const productController = {
  list,
  featured,
  detail,
  related,
}