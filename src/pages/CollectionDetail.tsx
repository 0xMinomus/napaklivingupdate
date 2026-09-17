import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { Link, useParams } from 'react-router-dom'
import { get } from '../api'
import Footer from '../components/Footer'
import ProductGrid from '../components/ProductGrid'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { usePageHero } from '../hooks/usePageHero'
import type { Collection } from '../types'

export default function CollectionDetail(): ReactElement {
  const { slug = '' } = useParams()
  const [data, setData] = useState<Collection | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setData(null)
    setError(false)
    get<Collection>(`/collections/${encodeURIComponent(slug)}`)
      .then((collection) => {
        if (!cancelled) setData(collection)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  const displayName = data?.name ?? slug
  const titleLine1 = data?.titleLine1 ?? displayName
  const titleLine2 = data?.titleLine2 ?? ''
  const hasStory = Boolean(data?.storyLine1 ?? data?.quote)
  useDocumentTitle(`${displayName} — Napak Living`)
  usePageHero()

  return (
    <>
      <main id="main-content" className="page-main">
        <section className="container collection-detail-hero" aria-labelledby="page-title">
          <div>
            <p className="breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/collections">Collections</Link>
              <span>/</span>
              <span>{titleLine1}</span>
            </p>
            <p className="eyebrow">{data?.eyebrow ?? 'Collection'}</p>
            <h1 id="page-title" className="display-title">
              <span>{titleLine1}</span>
              <span className="muted-line">{titleLine2}</span>
            </h1>
            <p className="lead">
              {data?.lead ?? data?.description ?? 'A Napak Living collection.'}
            </p>
            <div className="category-links">
              <Link className="category-chip" to={`/catalog?collection=${encodeURIComponent(slug)}`}>
                Shop this collection ↗
              </Link>
              <Link className="category-chip" to="/collections">
                All collections
              </Link>
            </div>
          </div>
          <figure className="collection-detail-image">
            <img
              src={data?.heroImage ?? data?.image ?? ''}
              alt={data?.heroAlt ?? displayName}
            />
          </figure>
        </section>

        {hasStory && (
          <section className="container collection-story" aria-labelledby="collection-story-title">
            <div>
              <p className="eyebrow">{data?.storyEyebrow ?? ''}</p>
              <h2 id="collection-story-title" className="section-title">
                <span>{data?.storyLine1 ?? ''}</span>
                <span className="muted-line">{data?.storyLine2 ?? ''}</span>
              </h2>
            </div>
            <div className="collection-story-note">
              <p>{data?.quote ?? ''}</p>
            </div>
          </section>
        )}

        <section
          className="container collection-products"
          aria-labelledby="collection-products-title"
        >
          <div className="section-topline">
            <div className="section-heading">
              <p className="eyebrow">
                {data ? `${data.name} / ${data.productCount} pieces` : ''}
              </p>
              <h2 id="collection-products-title" className="section-title">
                <span>The collection</span>
                <span className="muted-line">in objects.</span>
              </h2>
            </div>
            <Link className="text-link desktop-only" to="/catalog">
              Full catalog <span aria-hidden="true">→</span>
            </Link>
          </div>
          {error ? (
            <p className="catalog-empty">This collection is unavailable right now.</p>
          ) : (
            <ProductGrid
              products={data?.products ?? []}
              emptyMessage="No objects found in this collection."
            />
          )}
        </section>
      </main>
      <Footer variant="contact" />
    </>
  )
}