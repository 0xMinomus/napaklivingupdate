import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFound(): ReactElement {
  useDocumentTitle('Page not found — Napak Living')

  return (
    <>
      <main id="main-content" className="page-main confirmation-page">
        <section className="confirmation-card" aria-labelledby="not-found-title">
          <div className="confirmation-mark" aria-hidden="true">
            ?
          </div>
          <p className="eyebrow">404 / lost</p>
          <h1 id="not-found-title">This page has moved on.</h1>
          <p>The page you are looking for does not exist or has been moved.</p>
          <Link className="button button-primary" to="/">
            Back home
          </Link>
        </section>
      </main>
      <Footer minimal />
    </>
  )
}