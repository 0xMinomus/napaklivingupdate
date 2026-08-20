import type { FastifyInstance } from 'fastify'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { buildApp } from '../server/src/app.js'

let appPromise: Promise<FastifyInstance> | null = null

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  if (!appPromise) {
    appPromise = buildApp().then((app) => app.ready().then(() => app))
  }
  const app = await appPromise
  app.server.emit('request', req, res)
}