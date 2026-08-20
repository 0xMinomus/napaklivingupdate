import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function ThankYou(): ReactElement {
  useDocumentTitle('Thank you — Napak Living')

  return (
    <>
      <main id="main-content" className="page-main confirmation-page">
        <section className="confirmation-card" aria-labelledby="confirmation-title">
          <div className="confirmation-mark" aria-hidden="true">
            ✓
          </div>
          <p className="eyebrow">Message received</p>
          <h1 id="confirmation-title">Thank you for reaching out.</h1>
          <p>
            Your message has been received. The Napak Living team will contact you within 1–2
            business days.
          </p>
          <Link className="button button-primary" to="/">
            Back home
          </Link>
        </section>
      </main>
      <Footer minimal />
    </>
  )
}