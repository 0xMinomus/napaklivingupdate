import type { FastifyInstance } from 'fastify'
import { contactController } from '../controllers/contact.controller.js'

export async function contactRoutes(app: FastifyInstance) {
  app.post(
    '/contact',
    { config: { rateLimit: { max: 5, timeWindow: '1 minute' } } },
    contactController.create
  )
}