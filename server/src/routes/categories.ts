import type { FastifyInstance } from 'fastify'
import { categoryController } from '../controllers/category.controller.js'

export async function categoryRoutes(app: FastifyInstance) {
  app.get('/categories/:slug', categoryController.detail)
  app.get('/categories', categoryController.list)
}