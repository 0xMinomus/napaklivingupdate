import type { FastifyReply, FastifyRequest } from 'fastify'
import { contactService } from '../services/contact.service.js'
import { contactSchema } from '../schemas/contact.schema.js'

async function create(req: FastifyRequest, reply: FastifyReply) {
  const input = contactSchema.parse(req.body)
  const created = await contactService.create(input)
  return reply.status(201).send({ success: true, data: created })
}

export const contactController = {
  create,
}