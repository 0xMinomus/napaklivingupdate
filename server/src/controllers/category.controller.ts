import type { FastifyReply, FastifyRequest } from 'fastify'
import { categoryService } from '../services/category.service.js'

async function list(_req: FastifyRequest, reply: FastifyReply) {
  return reply.send(await categoryService.list())
}

async function detail(req: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
  return reply.send(await categoryService.getBySlug(req.params.slug))
}

export const categoryController = {
  list,
  detail,
}