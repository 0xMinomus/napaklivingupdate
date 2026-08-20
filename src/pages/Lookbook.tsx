import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useRevealOnScroll } from '../lib/reveal'

interface LookbookCardProps {
  src: string
  alt: string
  mono: string
  caption: string
}

function LookbookCard({ src, alt, mono, caption }: LookbookCardProps): ReactElement {
  const ref = useRevealOnScroll<HTMLElement>()

  return (
    <figure className="lookbook-page-card" ref={ref}>
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
          <LookbookCard
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=85"
            alt="A living room corner with a vase and natural light"
            mono="01 / living slowly"
            caption="Details in the everyday"
          />

          <LookbookCard
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85"
            alt="A dining table styled with ceramics and flowers"
            mono="02 / gather here"
            caption="A table made for staying"
          />

          <LookbookCard
            src="https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=700&q=85"
            alt="A decorative detail in sunlight"
            mono="03 / natural light"
            caption="Find your quiet"
          />

          <div className="lookbook-note">
            <p>“The smallest objects can change the way a room holds us.”</p>
            <Link className="text-link" to="/catalog">
              Explore the objects <span aria-hidden="true">→</span>
            </Link>
          </div>
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