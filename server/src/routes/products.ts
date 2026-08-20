import type { FastifyInstance } from 'fastify'
import { productController } from '../controllers/product.controller.js'

export async function productRoutes(app: FastifyInstance) {
  // Registered before `/:slug` so "featured" is not treated as a slug.
  app.get('/products/featured', productController.featured)
  app.get('/products/:slug/related', productController.related)
  app.get('/products/:slug', productController.detail)
  app.get('/products', productController.list)
}