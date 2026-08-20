import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { scaleImage } from '../lib/image'
import { productUrl } from '../lib/links'
import { useRevealOnScroll } from '../lib/reveal'
import type { ProductSummary } from '../types'

export default function ProductCard({ product }: { product: ProductSummary }): ReactElement {
  const ref = useRevealOnScroll<HTMLElement>()
  const subtitle = [product.category?.name, product.materials].filter(Boolean).join(' · ')

  return (
    <article className="product-card" ref={ref}>
      <Link
        className="product-image"
        to={productUrl(product.slug)}
        aria-label={`View ${product.name}`}
      >
        {product.isNew && <span className="product-tag">New</span>}
        {product.image && (
          <img src={scaleImage(product.image, 640)} alt={product.name} loading="lazy" decoding="async" />
        )}
        <span className="image-arrow" aria-hidden="true">
          ↗
        </span>
      </Link>
      <div className="product-meta">
        <div>
          <h3>{product.name}</h3>
          <p>{subtitle}</p>
        </div>
        <span className="product-code">{product.code ?? ''}</span>
      </div>
    </article>
  )
}