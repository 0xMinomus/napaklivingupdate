import { ReactNode, useState } from 'react'
import type { FormEvent, ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { post } from '../api'

const FIELD_NAMES = ['name', 'email', 'phone', 'subject', 'company', 'message'] as const

interface ContactFormProps {
  className: string
  defaultType: string
  buttonLabel: string
  footerNote: string
  children: ReactNode
}

export default function ContactForm({
  className,
  defaultType,
  buttonLabel,
  footerNote,
  children,
}: ContactFormProps): ReactElement {
  const navigate = useNavigate()
  const [message, setMessage] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    let type = defaultType
    const rawType = formData.get('type')
    if (typeof rawType === 'string' && rawType.trim()) type = rawType.trim()

    const payload: Record<string, string> = { type }
    for (const field of FIELD_NAMES) {
      const value = formData.get(field)
      if (typeof value === 'string' && value.trim()) payload[field] = value.trim()
    }

    setMessage(null)
    setSending(true)
    try {
      await post<{ success: boolean }>('/contact', payload)
      navigate('/thank-you')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      {children}
      <p className="form-message" role="alert" hidden={!message}>
        {message}
      </p>
      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={sending}>
          {sending ? 'Sending…' : buttonLabel} {!sending && <span aria-hidden="true">↗</span>}
        </button>
        <small>{footerNote}</small>
      </div>
    </form>
  )
}