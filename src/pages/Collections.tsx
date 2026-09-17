import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { get } from '../api'
import Footer from '../components/Footer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { usePageHero } from '../hooks/usePageHero'
import type { Collection } from '../types'

interface CollectionCardProps {
  to: string
  src: string
  alt: string
  mono: string
  title: string
  description: string
}

function CollectionCard({
  to,
  src,
  alt,
  mono,
  title,
  description,
}: CollectionCardProps): ReactElement {
  return (
    <Link className="collection-list-card" to={to}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      <div className="collection-list-info">
        <span className="mono">{mono}</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <span className="collection-list-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
    </Link>
  )
}

export default function Collections(): ReactElement {
  useDocumentTitle('Collections — Napak Living')
  usePageHero()
  const [items, setItems] = useState<Collection[]>([])

  useEffect(() => {
    let cancelled = false
    get<{ items: Collection[] }>('/collections')
      .then((data) => {
        if (!cancelled) setItems(data.items)
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <main id="main-content" className="page-main">
        <section className="page-hero collection-page-hero container" aria-labelledby="page-title">
          <p className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Collections</span>
          </p>
          <p className="eyebrow">Curated by feeling</p>
          <h1 id="page-title" className="display-title">
            <span>Find a feeling</span>
            <span className="muted-line">to live with.</span>
          </h1>
          <p className="lead">
            A collection of thoughtfully chosen pieces, made by skilled Indonesian artisans. From
            tableware to home décor and hospitality essentials, each piece reflects the beauty and
            character of handmade craftsmanship.
          </p>
          <div className="page-hero-rule"></div>
        </section>

        <section className="container collection-list-grid" aria-label="Collection list">
          {items.map((c, i) => (
            <CollectionCard
              key={c.slug}
              to={`/collection/${encodeURIComponent(c.slug)}`}
              src={c.image ?? ''}
              alt={c.name}
              mono={`COLLECTION / ${String(i + 1).padStart(2, '0')}`}
              title={c.name}
              description={c.tagline ?? c.description ?? ''}
            />
          ))}
        </section>
      </main>
      <Footer variant="instagram" />
    </>
  )
}