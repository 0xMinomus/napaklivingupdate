import type { FastifyInstance } from 'fastify'
import { collectionController } from '../controllers/collection.controller.js'

export async function collectionRoutes(app: FastifyInstance) {
  app.get('/collections/:slug', collectionController.detail)
  app.get('/collections', collectionController.list)
}