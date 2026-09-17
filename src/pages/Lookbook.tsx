import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_LOOKBOOK, get } from '../api'
import Footer from '../components/Footer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { usePageHero } from '../hooks/usePageHero'
import type { LookbookEntry } from '../types'

interface LookbookCardProps {
  src: string
  alt: string
  mono: string
  caption: string
}

function LookbookCard({ src, alt, mono, caption }: LookbookCardProps): ReactElement {
  return (
    <figure className="lookbook-page-card">
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      <figcaption>
        <span className="mono">{mono}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  )
}

export default function Lookbook(): ReactElement {
  useDocumentTitle('Lookbook — Napak Living')
  usePageHero()
  const [entries, setEntries] = useState<LookbookEntry[]>(DEFAULT_LOOKBOOK)

  useEffect(() => {
    let cancelled = false
    get<{ items: LookbookEntry[] }>('/lookbook')
      .then((data) => {
        if (!cancelled) setEntries(data.items)
      })
      .catch(() => {
        if (!cancelled) setEntries(DEFAULT_LOOKBOOK)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <main id="main-content" className="page-main">
        <section className="page-hero container" aria-labelledby="page-title">
          <p className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Lookbook</span>
          </p>
          <p className="eyebrow">The Napak journal</p>
          <h1 id="page-title" className="display-title">
            <span>Scenes from</span>
            <span className="muted-line">a slower home.</span>
          </h1>
          <p className="lead lookbook-page-intro">
            A space is not only what we see, but how it makes us feel. Discover the details,
            textures, and objects that shape the Napak Living rhythm.
          </p>
          <div className="page-hero-rule"></div>
        </section>

        <section className="container lookbook-page-grid" aria-label="Editorial lookbook">
          {entries.map((entry) => (
            <LookbookCard
              key={entry.mono}
              src={entry.image}
              alt={entry.alt ?? entry.caption}
              mono={entry.mono}
              caption={entry.caption}
            />
          ))}
        </section>

        <section className="container section" aria-labelledby="lookbook-download-title">
          <div className="trade-panel">
            <div className="trade-pattern" aria-hidden="true"></div>
            <div className="trade-copy">
              <p className="eyebrow eyebrow-light">For the trade / catalog access</p>
              <h2 id="lookbook-download-title" className="section-title section-title-light">
                <span>Take Napak</span>
                <span className="muted-line">with you.</span>
              </h2>
              <p>
                Download the trade catalog for project, hospitality, and wholesale partnership
                references.
              </p>
              <Link className="button button-light" to="/business">
                Request trade catalog <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="trade-index mono">PDF / 2024</div>
          </div>
        </section>
      </main>
      <Footer variant="instagram" />
    </>
  )
}