import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { Link, useParams } from 'react-router-dom'
import { get } from '../api'
import Footer from '../components/Footer'
import ProductGrid from '../components/ProductGrid'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { usePageHero } from '../hooks/usePageHero'
import type { Collection } from '../types'

interface CollectionConfig {
  eyebrow: string
  titleLine1: string
  titleLine2: string
  lead: string
  image: string
  imageAlt: string
  storyEyebrow: string
  storyLine1: string
  storyLine2: string
  quote: string
}

const COLLECTION_PAGES: Record<string, CollectionConfig> = {
  'ruang-pagi': {
    eyebrow: 'Collection / 01',
    titleLine1: 'Ruang',
    titleLine2: 'Pagi.',
    lead: 'Soft colors for a slower beginning. Ruang Pagi gathers light forms that catch the first light and make a home feel open.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=70',
    imageAlt: 'A warm interior from the Ruang Pagi collection',
    storyEyebrow: 'The feeling',
    storyLine1: 'Start softly.',
    storyLine2: 'Stay awhile.',
    quote: '“Morning light, warm surfaces, and one object that makes us want to stay.”',
  },
  'bumi-tenang': {
    eyebrow: 'Collection / 02',
    titleLine1: 'Bumi',
    titleLine2: 'Tenang.',
    lead: 'Honest materials for a grounded space. Bumi Tenang gathers earthy colors, textures, and objects that feel better with use.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=70',
    imageAlt: 'A natural interior from the Bumi Tenang collection',
    storyEyebrow: 'The feeling',
    storyLine1: 'Stay grounded.',
    storyLine2: 'Keep it honest.',
    quote: '“Honest textures, calming colors, and objects that keep finding their place.”',
  },
}

export default function CollectionDetail(): ReactElement {
  const { slug = '' } = useParams()
  const config = COLLECTION_PAGES[slug]
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

  const displayName = data?.name ?? (config ? config.titleLine1 + ' ' + config.titleLine2.replace(/\.$/, '') : slug)
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
              <span>{config ? config.titleLine1 : displayName}</span>
            </p>
            <p className="eyebrow">{config?.eyebrow ?? 'Collection'}</p>
            <h1 id="page-title" className="display-title">
              <span>{config ? config.titleLine1 : displayName}</span>
              <span className="muted-line">{config ? config.titleLine2 : ''}</span>
            </h1>
            <p className="lead">
              {config ? config.lead : data?.description ?? 'A Napak Living collection.'}
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
              src={config ? config.image : (data?.image ?? '')}
              alt={config ? config.imageAlt : displayName}
            />
          </figure>
        </section>

        {config && (
          <section className="container collection-story" aria-labelledby="collection-story-title">
            <div>
              <p className="eyebrow">{config.storyEyebrow}</p>
              <h2 id="collection-story-title" className="section-title">
                <span>{config.storyLine1}</span>
                <span className="muted-line">{config.storyLine2}</span>
              </h2>
            </div>
            <div className="collection-story-note">
              <p>{config.quote}</p>
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