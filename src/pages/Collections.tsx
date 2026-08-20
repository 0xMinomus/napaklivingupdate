import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useRevealOnScroll } from '../lib/reveal'

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
  const ref = useRevealOnScroll<HTMLAnchorElement>()

  return (
    <Link className="collection-list-card" to={to} ref={ref}>
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
            Each collection is born from a mood: morning light, earthy surfaces, and objects that
            invite us to stay a little longer.
          </p>
          <div className="page-hero-rule"></div>
        </section>

        <section className="container collection-list-grid" aria-label="Collection list">
          <CollectionCard
            to="/collection/ruang-pagi"
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85"
            alt="A warm interior from the Ruang Pagi collection"
            mono="COLLECTION / 01"
            title="Ruang Pagi"
            description="Soft colors and forms that make room for a slower start to the day."
          />

          <CollectionCard
            to="/collection/bumi-tenang"
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85"
            alt="A wooden shelf with objects from the Bumi Tenang collection"
            mono="COLLECTION / 02"
            title="Bumi Tenang"
            description="Honest materials and natural textures for a grounded home."
          />

          <CollectionCard
            to="/catalog"
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85"
            alt="A dining table set with Napak Living table accessories"
            mono="EDIT / 03"
            title="The Table, Slowly"
            description="A table collection for conversations that do not need to be rushed."
          />
        </section>
      </main>
      <Footer variant="instagram" />
    </>
  )
}