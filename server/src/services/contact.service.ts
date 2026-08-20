import { prisma } from '../lib/prisma.js'
import type { ContactInput } from '../schemas/contact.schema.js'

async function create(input: ContactInput) {
  const inquiry = await prisma.inquiry.create({
    data: {
      type: input.type,
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      subject: input.subject || null,
      company: input.company || null,
      message: input.message,
    },
  })

  return { id: inquiry.id, type: inquiry.type, createdAt: inquiry.createdAt }
}

export const contactService = {
  create,
}