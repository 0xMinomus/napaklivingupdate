import { z } from 'zod'

export const inquiryTypeSchema = z
  .enum(['contact', 'wholesale', 'designer', 'hospitality', 'collaboration', 'custom'])
  .default('contact')

/**
 * Shared schema for POST /api/contact and the trade inquiry form.
 * `type` distinguishes general contact from wholesale/designer/hospitality
 * inquiries; `subject` is the contact form's subject/topic.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().email('A valid email is required').max(254),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  subject: z.string().trim().max(200).optional().or(z.literal('')),
  company: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().min(1, 'Message is required').max(5000),
  type: inquiryTypeSchema,
})

export type ContactInput = z.infer<typeof contactSchema>