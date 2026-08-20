import type { FastifyReply } from 'fastify'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export class AppError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
    this.name = 'AppError'
  }
}

export function notFound(message = 'Resource not found'): AppError {
  return new AppError(message, 404)
}

/**
 * Central error handler. Maps Zod validation errors to 400 with field details,
 * Prisma record-not-found errors to 404, and everything else to 500.
 */
export function errorHandler(error: unknown, reply: FastifyReply): void {
  if (error instanceof ZodError) {
    reply.status(400).send({
      error: {
        message: 'Validation failed',
        details: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
    })
    return
  }

  if (error instanceof AppError) {
    reply.status(error.statusCode).send({ error: { message: error.message } })
    return
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    reply.status(404).send({ error: { message: 'Resource not found' } })
    return
  }

  console.error(error)
  reply.status(500).send({ error: { message: 'Internal server error' } })
}