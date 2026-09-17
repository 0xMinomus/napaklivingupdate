import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { get, DEFAULT_HOME, DEFAULT_LOOKBOOK } from '../api'
import ProductGrid from '../components/ProductGrid'
import Footer from '../components/Footer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useHeroAnimation } from '../hooks/useHeroAnimation'
import type { Category, Collection, HomePage, LookbookEntry, Paginated, ProductSummary } from '../types'
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const FEATURED_COUNT = 4

function FeaturedProducts(): ReactElement {
  const [products, setProducts] = useState<ProductSummary[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    get<Paginated<ProductSummary>>('/products', { limit: 12, sort: 'newest' })
      .then((data) => {
        if (cancelled) return
        setProducts(shuffle(data.items).slice(0, FEATURED_COUNT))
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (products === null) {
    return <div className="product-grid" id="featured-products" />
  }
  if (error || products.length === 0) {
    return (
      <div className="product-grid" id="featured-products">
        <p className="catalog-empty">
          {error
            ? 'Featured products are unavailable right now.'
            : 'No objects found. Try adjusting your filters or search.'}
        </p>
      </div>
    )
  }
  return <ProductGrid products={products} id="featured-products" />
}

const LOOKBOOK_SIZES = ['lookbook-tall', 'lookbook-wide', 'lookbook-small']

function LookbookPreview(): ReactElement {
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
    <div className="lookbook-grid">
      {entries.map((entry, i) => (
        <figure
          key={entry.mono}
          className={`lookbook-image ${LOOKBOOK_SIZES[i % LOOKBOOK_SIZES.length]}`}
        >
          <img src={entry.image} alt={entry.alt ?? entry.caption} loading="lazy" />
          <figcaption>
            <span className="mono">{entry.mono}</span>
            <span>{entry.caption}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

function CategoryBand(): ReactElement {
  const [items, setItems] = useState<Category[]>([])

  useEffect(() => {
    let cancelled = false
    get<{ items: Category[] }>('/categories')
      .then((data) => {
        if (!cancelled) setItems(data.items.filter((c) => c.showOnHome))
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <nav className="category-list" aria-label="Product categories">
      {items.map((c, i) => (
        <Link key={c.slug} to={`/catalog?category=${encodeURIComponent(c.slug)}`}>
          <span>{String(i + 1).padStart(2, '0')}</span>
          <strong>{c.name}</strong>
          <span aria-hidden="true">↗</span>
        </Link>
      ))}
    </nav>
  )
}

function CollectionPreview(): ReactElement {  const [items, setItems] = useState<Collection[]>([])

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
    <div className="collection-grid">
      {items.map((c, i) => (
        <Link
          key={c.slug}
          className={i === 0 ? 'collection-card collection-card-large' : 'collection-card'}
          to={`/collection/${encodeURIComponent(c.slug)}`}
        >
          <img src={c.image ?? ''} alt={c.name} loading="lazy" />
          <span className="collection-overlay"></span>
          <div className="collection-info">
            <span className="mono">COLLECTION / {String(i + 1).padStart(2, '0')}</span>
            <h3>{c.name}</h3>
            <p>{c.tagline ?? c.description ?? ''}</p>
            <span className="collection-arrow" aria-hidden="true">
              ↗
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function Home(): ReactElement {
  useDocumentTitle('Napak Living — Objects for a slower home')
  useHeroAnimation()
  const [page, setPage] = useState<HomePage>(DEFAULT_HOME)

  useEffect(() => {
    let cancelled = false
    get<HomePage>('/home')
      .then((data) => {
        if (!cancelled) setPage(data)
      })
      .catch(() => {
        if (!cancelled) setPage(DEFAULT_HOME)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <main id="main-content">
        <section className="hero hero-bg" aria-labelledby="hero-title">
          <div className="hero-bg-image" aria-hidden="true">
            <img
              src={page.heroImage ?? '/pexels-the-ghazi-2152398165-36353283.webp'}
              alt={page.heroAlt ?? ''}
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="hero-bg-overlay" aria-hidden="true"></div>
          <div className="container hero-bg-content">
            <div className="hero-copy">
              <h1 id="hero-title" className="display-title">
                <span>{page.heroTitle1}</span>
                <span className="muted-line">{page.heroTitle2}</span>
              </h1>
              <p className="lead hero-lead">{page.heroLead}</p>
              <Link className="shop-link" to="/catalog">
                <span className="shop-link-text">{page.heroCta}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="intro section container" aria-labelledby="intro-title">
          <div className="section-heading intro-heading">
            <p className="eyebrow">{page.introEyebrow}</p>
            <h2 id="intro-title" className="section-title">
              <span>{page.introTitle1}</span>
              <span className="muted-line">{page.introTitle2}</span>
            </h2>
          </div>
          <div className="intro-body">
            <p className="lead">{page.introLead}</p>
            <a className="text-link" href="#story">
              Discover our philosophy <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className="section container" id="products" aria-labelledby="products-title">
          <div className="section-topline">
            <div className="section-heading">
              <p className="eyebrow">{page.featuredEyebrow}</p>
              <h2 id="products-title" className="section-title">
                <span>{page.featuredTitle1}</span>
                <span className="muted-line">{page.featuredTitle2}</span>
              </h2>
            </div>
            <Link className="text-link desktop-only" to="/catalog">
              View all products <span aria-hidden="true">→</span>
            </Link>
          </div>

          <FeaturedProducts />
          <Link className="text-link mobile-only" to="/catalog">
            View all products <span aria-hidden="true">→</span>
          </Link>
        </section>

        <section className="section container" id="collections" aria-labelledby="collections-title">
          <div className="section-topline">
            <div className="section-heading">
              <p className="eyebrow">{page.collectionsEyebrow}</p>
              <h2 id="collections-title" className="section-title">
                <span>{page.collectionsTitle1}</span>
                <span className="muted-line">{page.collectionsTitle2}</span>
              </h2>
            </div>
            <Link className="text-link desktop-only" to="/collections">
              All collections <span aria-hidden="true">→</span>
            </Link>
          </div>

          <CollectionPreview />
        </section>

        <section className="category-band" id="categories" aria-labelledby="categories-title">
          <div className="container category-layout">
            <div className="section-heading">
              <p className="eyebrow">{page.categoryEyebrow}</p>
              <h2 id="categories-title" className="section-title">
                <span>{page.categoryTitle1}</span>
                <span className="muted-line">{page.categoryTitle2}</span>
              </h2>
            </div>
            <CategoryBand />
          </div>
        </section>

        <section className="section container lookbook-section" id="lookbook" aria-labelledby="lookbook-title">
          <div className="section-topline">
            <div className="section-heading">
              <p className="eyebrow">{page.lookbookEyebrow}</p>
              <h2 id="lookbook-title" className="section-title">
                <span>{page.lookbookTitle1}</span>
                <span className="muted-line">{page.lookbookTitle2}</span>
              </h2>
            </div>
            <Link className="text-link desktop-only" to="/lookbook">
              Open lookbook <span aria-hidden="true">→</span>
            </Link>
          </div>

          <LookbookPreview />
        </section>

        <section className="section story-section container" id="story" aria-labelledby="story-title">
          <div className="story-image">
            <div className="story-image-frame">
              <img src={page.storyImage} alt={page.storyAlt ?? ''} loading="lazy" />
            </div>
            <span className="story-image-note mono">{page.storyNote}</span>
          </div>
          <div className="story-copy">
            <p className="eyebrow">{page.storyEyebrow}</p>
            <h2 id="story-title" className="section-title">
              <span>{page.storyTitle1}</span>
              <span className="muted-line">{page.storyTitle2}</span>
            </h2>
            <p className="lead">{page.storyLead}</p>
            <Link className="text-link" to="/about">
              Read our story <span aria-hidden="true">→</span>
            </Link>
            <div className="values-list" aria-label="Napak Living values">
              {page.storyValues.map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="trade-section section container" id="trade" aria-labelledby="trade-title">
          <div className="trade-panel">
            <div className="trade-pattern" aria-hidden="true"></div>
            <div className="trade-copy">
              <p className="eyebrow eyebrow-light">{page.tradeEyebrow}</p>
              <h2 id="trade-title" className="section-title section-title-light">
                <span>{page.tradeTitle1}</span>
                <span className="muted-line">{page.tradeTitle2}</span>
              </h2>
              <p>{page.tradeText}</p>
              <Link className="button button-light" to="/business">
                {page.tradeButton} <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="trade-index mono">{page.tradeIndex}</div>
          </div>
        </section>
      </main>
      <Footer variant="instagram" />
    </>
  )
}