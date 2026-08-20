import type { ReactElement } from 'react'
import ProductCard from './ProductCard'
import type { ProductSummary } from '../types'

interface ProductGridProps {
  products: ProductSummary[]
  emptyMessage?: string
  className?: string
  id?: string
}

export default function ProductGrid({
  products,
  emptyMessage = 'No objects found. Try adjusting your filters or search.',
  className = 'product-grid',
  id,
}: ProductGridProps): ReactElement {
  if (!products.length) return <p className="catalog-empty">{emptyMessage}</p>

  return (
    <div className={className} id={id}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}