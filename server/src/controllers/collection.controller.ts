import type { FastifyReply, FastifyRequest } from 'fastify'
import { collectionService } from '../services/collection.service.js'

async function list(_req: FastifyRequest, reply: FastifyReply) {
  return reply.send(await collectionService.list())
}

async function detail(req: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
  return reply.send(await collectionService.getBySlug(req.params.slug))
}

export const collectionController = {
  list,
  detail,
}