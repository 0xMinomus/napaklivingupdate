import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { Link, useParams } from 'react-router-dom'
import { get } from '../api'
import Footer from '../components/Footer'
import Gallery from '../components/Gallery'
import ProductGrid from '../components/ProductGrid'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { categoryUrl, isKnownCategory } from '../lib/links'
import type { Product, ProductSummary } from '../types'

const availabilityText = (availability: string): string => {
  switch (availability) {
    case 'ready':
      return 'Ready to ship'
    case 'made-to-order':
      return 'Made to order · 3–4 weeks'
    default:
      return availability
  }
}

export default function ProductDetail(): ReactElement {
  const { slug = '' } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [related, setRelated] = useState<ProductSummary[]>([])
  const [showRelated, setShowRelated] = useState(false)

  useEffect(() => {
    let cancelled = false
    setProduct(null)
    setError(null)
    setRelated([])
    setShowRelated(false)
    get<Product>(`/products/${encodeURIComponent(slug)}`)
      .then((p) => {
        if (!cancelled) setProduct(p)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load this product.')
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (!product) return
    let cancelled = false
    get<{ items: ProductSummary[] }>(`/products/${encodeURIComponent(product.slug)}/related`)
      .then((data) => {
        if (!cancelled && data.items.length) {
          setRelated(data.items)
          setShowRelated(true)
        }
      })
      .catch(() => {
        // Related products are optional; hide the section on failure.
      })
    return () => {
      cancelled = true
    }
  }, [product])

  useDocumentTitle(
    product ? `${product.name} — Napak Living` : 'Product — Napak Living'
  )

  const categoryName = product?.category?.name ?? ''
  const categorySlug = product?.category?.slug
  const collections = product?.collections.map((c) => c.name).join(' / ') ?? ''
  const kicker = [product?.code, categoryName, collections].filter(Boolean).join(' · ')
  const specs: [string, string][] = [
    ['Material', product?.materials ?? ''],
    ['Dimensions', product?.dimensions ?? ''],
    ['Care', product?.care ?? ''],
    ['SKU', product?.sku ?? ''],
  ].filter((pair): pair is [string, string] => Boolean(pair[1]))

  return (
    <>
      <main id="main-content" className="page-main">
        <section
          className="container product-page"
          aria-labelledby="product-title"
          aria-busy={!product && !error}
        >
          <p className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/catalog">Shop</Link>
            <span>/</span>
            {categorySlug && (
              <>
                <Link to={isKnownCategory(categorySlug) ? categoryUrl(categorySlug) : '/catalog'}>
                  {categoryName}
                </Link>
                <span>/</span>
              </>
            )}
            <span>{product ? product.name : 'Product'}</span>
          </p>

          {error ? (
            <p className="detail-note">{error}</p>
          ) : !product ? (
            <div className="product-detail-layout">
              <div className="product-gallery">
                <div className="gallery-thumbs" />
                <figure className="gallery-main" />
              </div>
              <div className="product-detail-info" />
            </div>
          ) : (
            <div className="product-detail-layout">
              <Gallery images={product.images} name={product.name} />

              <div className="product-detail-info">
                <p className="detail-kicker">{kicker}</p>
                <h1 id="product-title" className="detail-title">
                  {product.name}
                </h1>
                <p className="detail-subtitle">{product.subtitle ?? ''}</p>
                <p className="detail-description">{product.description ?? ''}</p>
                <p className="detail-status">
                  <span className="status-dot" aria-hidden="true"></span>
                  {availabilityText(product.availability)}
                </p>
                <div className="detail-block">
                  <h2 className="detail-block-title">Finish</h2>
                  <div className="variant-list">
                    {product.variants.length ? (
                      product.variants.map((v, i) => (
                        <a
                          key={v}
                          className="variant-button"
                          href="#product-title"
                          aria-current={i === 0 ? 'true' : undefined}
                          onClick={(e) => e.preventDefault()}
                        >
                          {v}
                        </a>
                      ))
                    ) : (
                      <span className="detail-note">Standard finish</span>
                    )}
                  </div>
                </div>
                <div className="detail-block">
                  <h2 className="detail-block-title">Details</h2>
                  <dl className="detail-specs">
                    {specs.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <Link
                  className="button button-primary detail-cta"
                  to={`/business?product=${encodeURIComponent(product.slug)}`}
                >
                  Ask about this piece <span aria-hidden="true">↗</span>
                </Link>
                <p className="detail-note">Pricing and availability are available by inquiry.</p>
              </div>
            </div>
          )}
        </section>

        {showRelated && (
          <section className="container related-section" aria-labelledby="related-title">
            <div className="section-topline">
              <div className="section-heading">
                <p className="eyebrow">You may also like</p>
                <h2 id="related-title" className="section-title">
                  <span>More quiet</span>
                  <span className="muted-line">companions.</span>
                </h2>
              </div>
              <Link className="text-link desktop-only" to="/catalog">
                Browse all <span aria-hidden="true">→</span>
              </Link>
            </div>
            <ProductGrid products={related} />
          </section>
        )}
      </main>
      <Footer variant="contact" />
    </>
  )
}