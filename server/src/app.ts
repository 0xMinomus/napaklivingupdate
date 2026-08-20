import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import { env } from './lib/env.js'
import { errorHandler } from './lib/errors.js'
import { productRoutes } from './routes/products.js'
import { categoryRoutes } from './routes/categories.js'
import { collectionRoutes } from './routes/collections.js'
import { contactRoutes } from './routes/contact.js'

export async function buildApp() {
  const app = Fastify({ logger: true, trustProxy: true })

  await app.register(cors, {
    origin: env.clientOrigin,
  })

  await app.register(rateLimit, {
    max: 300,
    timeWindow: '1 minute',
  })

  app.get('/api/health', async () => ({ status: 'ok' }))

  app.register(async (api) => {
    api.register(productRoutes)
    api.register(categoryRoutes)
    api.register(collectionRoutes)
    api.register(contactRoutes)
  }, { prefix: '/api' })

  app.setErrorHandler((error, _request, reply) => {
    errorHandler(error, reply)
  })

  return app
}