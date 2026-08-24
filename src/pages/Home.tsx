import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { get } from '../api'
import ProductGrid from '../components/ProductGrid'
import Footer from '../components/Footer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useHeroAnimation } from '../hooks/useHeroAnimation'
import type { Paginated, ProductSummary } from '../types'

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

export default function Home(): ReactElement {
  useDocumentTitle('Napak Living — Objects for a slower home')
  useHeroAnimation()

  return (
    <>
      <main id="main-content">
        <section className="hero hero-bg" aria-labelledby="hero-title">
          <div className="hero-bg-image" aria-hidden="true">
            <img
              src="/pexels-the-ghazi-2152398165-36353283.webp"
              alt=""
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="hero-bg-overlay" aria-hidden="true"></div>
          <div className="container hero-bg-content">
            <div className="hero-copy">
              <h1 id="hero-title" className="display-title">
                <span>A room that feels</span>
                <span className="muted-line">like coming home.</span>
              </h1>
              <p className="lead hero-lead">
                Everyday objects made by hand, thoughtfully selected, and designed to live with you
                for years.
              </p>
              <Link className="shop-link" to="/catalog">
                <span className="shop-link-text">Shop the collection</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="intro section container" aria-labelledby="intro-title">
          <div className="section-heading intro-heading">
            <p className="eyebrow">A considered collection</p>
            <h2 id="intro-title" className="section-title">
              <span>Objects that belong</span>
              <span className="muted-line">without a loud voice.</span>
            </h2>
          </div>
          <div className="intro-body">
            <p className="lead">
              Napak Living brings together home decor, table accessories, and lifestyle pieces that
              slow the rhythm of home. Each form celebrates natural texture, beautiful imperfection,
              and the small moments that make a space feel like ours.
            </p>
            <a className="text-link" href="#story">
              Discover our philosophy <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className="section container" id="products" aria-labelledby="products-title">
          <div className="section-topline">
            <div className="section-heading">
              <p className="eyebrow">Selected objects / 01</p>
              <h2 id="products-title" className="section-title">
                <span>Pieces with</span>
                <span className="muted-line">a quiet presence.</span>
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
              <p className="eyebrow">Curated by feeling / 02</p>
              <h2 id="collections-title" className="section-title">
                <span>Collections for</span>
                <span className="muted-line">everyday living.</span>
              </h2>
            </div>
            <Link className="text-link desktop-only" to="/collections">
              All collections <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="collection-grid">
            <Link className="collection-card collection-card-large" to="/collection/ruang-pagi">
              <img
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=70"
                alt="An earthy dining room with Napak Living objects"
                loading="lazy"
              />
              <span className="collection-overlay"></span>
              <div className="collection-info">
                <span className="mono">COLLECTION / 01</span>
                <h3>Ruang Pagi</h3>
                <p>Soft colors for a slower beginning.</p>
                <span className="collection-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
            <Link className="collection-card" to="/collection/bumi-tenang">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=70"
                alt="A wooden shelf with natural-toned decorative objects"
                loading="lazy"
              />
              <span className="collection-overlay"></span>
              <div className="collection-info">
                <span className="mono">COLLECTION / 02</span>
                <h3>Bumi Tenang</h3>
                <p>Honest materials, enduring forms.</p>
                <span className="collection-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
          </div>
        </section>

        <section className="category-band" id="categories" aria-labelledby="categories-title">
          <div className="container category-layout">
            <div className="section-heading">
              <p className="eyebrow">Browse by category / 03</p>
              <h2 id="categories-title" className="section-title">
                <span>Make space for</span>
                <span className="muted-line">what matters.</span>
              </h2>
            </div>
            <nav className="category-list" aria-label="Product categories">
              <Link to="/catalog?category=home-decor">
                <span>01</span>
                <strong>Home decor</strong>
                <span aria-hidden="true">↗</span>
              </Link>
              <Link to="/catalog?category=table-accessories">
                <span>02</span>
                <strong>Table accessories</strong>
                <span aria-hidden="true">↗</span>
              </Link>
              <Link to="/catalog?category=vases">
                <span>03</span>
                <strong>Vases &amp; vessels</strong>
                <span aria-hidden="true">↗</span>
              </Link>
              <Link to="/catalog?category=lifestyle">
                <span>04</span>
                <strong>Lifestyle</strong>
                <span aria-hidden="true">↗</span>
              </Link>
            </nav>
          </div>
        </section>

        <section className="section container lookbook-section" id="lookbook" aria-labelledby="lookbook-title">
          <div className="section-topline">
            <div className="section-heading">
              <p className="eyebrow">The Napak journal / 04</p>
              <h2 id="lookbook-title" className="section-title">
                <span>Scenes from</span>
                <span className="muted-line">a slower home.</span>
              </h2>
            </div>
            <Link className="text-link desktop-only" to="/lookbook">
              Open lookbook <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="lookbook-grid">
            <figure className="lookbook-image lookbook-tall">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=70"
                alt="A home corner with a chair, wooden table, and vase"
                loading="lazy"
              />
              <figcaption>
                <span className="mono">01 / living slowly</span>
                <span>Details in the everyday</span>
              </figcaption>
            </figure>
            <figure className="lookbook-image lookbook-wide">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=70"
                alt="A dining table with ceramic plates and a flower vase"
                loading="lazy"
              />
              <figcaption>
                <span className="mono">02 / gather here</span>
                <span>A table made for staying</span>
              </figcaption>
            </figure>
            <figure className="lookbook-image lookbook-small">
              <img
                src="https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=500&q=70"
                alt="A tabletop detail with sunlight"
                loading="lazy"
              />
              <figcaption>
                <span className="mono">03 / natural light</span>
                <span>Find your quiet</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="section story-section container" id="story" aria-labelledby="story-title">
          <div className="story-image">
            <div className="story-image-frame">
              <img
                src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=70"
                alt="Natural material textures and handmade ceramics"
                loading="lazy"
              />
            </div>
            <span className="story-image-note mono">made by hand / made to stay</span>
          </div>
          <div className="story-copy">
            <p className="eyebrow">Our story / 05</p>
            <h2 id="story-title" className="section-title">
              <span>Made for the</span>
              <span className="muted-line">life inside.</span>
            </h2>
            <p className="lead">
              Napak means a trace. We believe home is not about perfection, but about the traces of
              life that grow within it. We work with local artisans to create simple, useful forms
              with room to become part of your story.
            </p>
            <Link className="text-link" to="/about">
              Read our story <span aria-hidden="true">→</span>
            </Link>
            <div className="values-list" aria-label="Napak Living values">
              <span>Honest materials</span>
              <span>Made locally</span>
              <span>Made to last</span>
            </div>
          </div>
        </section>

        <section className="trade-section section container" id="trade" aria-labelledby="trade-title">
          <div className="trade-panel">
            <div className="trade-pattern" aria-hidden="true"></div>
            <div className="trade-copy">
              <p className="eyebrow eyebrow-light">For your next space / 06</p>
              <h2 id="trade-title" className="section-title section-title-light">
                <span>Let’s make a</span>
                <span className="muted-line">space together.</span>
              </h2>
              <p>
                For interior designers, hospitality teams, retail partners, or custom projects — let
                us talk about how Napak can enter your space.
              </p>
              <Link className="button button-light" to="/business">
                Start a conversation <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="trade-index mono">TRADE / 06</div>
          </div>
        </section>
      </main>
      <Footer variant="instagram" />
    </>
  )
}