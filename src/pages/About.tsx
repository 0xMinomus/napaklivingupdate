import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function About(): ReactElement {
  useDocumentTitle('Our Story — Napak Living')

  return (
    <>
      <main id="main-content" className="page-main">
        <section className="container about-intro" aria-labelledby="page-title">
          <div>
            <p className="breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span>Our story</span>
            </p>
            <p className="eyebrow">Our story / a beginning</p>
            <h1 id="page-title" className="display-title">
              <span>Made for the</span>
              <span className="muted-line">life inside.</span>
            </h1>
          </div>
          <p className="lead">
            Napak means a trace. We create objects that give life room to leave its own trace.
          </p>
        </section>

        <div className="container about-hero-image">
          <img
            src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=70"
            alt="A home interior with natural materials and textured furniture"
          />
        </div>

        <section className="container about-statement" aria-labelledby="statement-title">
          <p className="eyebrow">A point of view</p>
          <h2 id="statement-title" className="section-title">
            <span>Home is not a look.</span>
            <span className="muted-line">It is a feeling.</span>
          </h2>
          <p className="lead">
            Napak Living was born from a desire to slow down how we choose and live with objects. We
            believe a good object does not need to shout to feel meaningful.
          </p>
        </section>

        <section className="container about-story-grid" aria-labelledby="founding-title">
          <div className="about-story-image">
            <img
              src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=700&q=70"
              alt="The process and result of handmade ceramics in natural tones"
              loading="lazy"
            />
          </div>
          <div className="about-story-copy">
            <p className="eyebrow">The beginning / 2024</p>
            <h2 id="founding-title" className="section-title">
              <span>Objects that</span>
              <span className="muted-line">leave a trace.</span>
            </h2>
            <p className="lead">
              We started Napak with a simple question: why cannot the objects we use every day feel
              more personal? From there, we began working with artisans to explore useful forms,
              honest materials, and an unhurried process.
            </p>
            <p className="lead">
              Every product has slight differences. To us, this is not a flaw, but proof that it has
              been touched, shaped, and given time.
            </p>
          </div>
        </section>

        <section className="philosophy-band" aria-labelledby="philosophy-title">
          <div className="container philosophy-layout">
            <div>
              <p className="eyebrow">Our philosophy</p>
              <h2 id="philosophy-title" className="section-title">
                <span>Less, but</span>
                <span className="muted-line">more considered.</span>
              </h2>
            </div>
            <div className="philosophy-copy">
              <p className="lead">
                We design with three questions: is it useful, does it feel good in the hand, and can
                it live with you for a long time?
              </p>
              <div className="value-grid">
                <article className="value-item">
                  <span className="value-number">01</span>
                  <h3>Honest materials</h3>
                  <p>We let wood, clay, and fibers show their natural character.</p>
                </article>
                <article className="value-item">
                  <span className="value-number">02</span>
                  <h3>Made locally</h3>
                  <p>Hand knowledge and collaboration with artisans are part of every form.</p>
                </article>
                <article className="value-item">
                  <span className="value-number">03</span>
                  <h3>Made to last</h3>
                  <p>
                    Objects are designed to be used, cared for, and passed through everyday life.
                  </p>
                </article>
                <article className="value-item">
                  <span className="value-number">04</span>
                  <h3>Room for change</h3>
                  <p>A good object does not dictate a room; it grows with it.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="container materials-section" aria-labelledby="materials-title">
          <p className="eyebrow">Materials &amp; craftsmanship</p>
          <h2 id="materials-title" className="section-title">
            <span>Touch is part</span>
            <span className="muted-line">of the design.</span>
          </h2>
          <div className="materials-grid">
            <article className="material-card">
              <span>01 / ceramic</span>
              <h3>Shaped earth</h3>
              <p>Stoneware and terracotta with soft, understated glazes.</p>
            </article>
            <article className="material-card">
              <span>02 / wood</span>
              <h3>Warm grain</h3>
              <p>Selected wood treated with a natural finish so it remains alive to the touch.</p>
            </article>
            <article className="material-card">
              <span>03 / textile</span>
              <h3>Everyday texture</h3>
              <p>Fibers and linen that add a tactile quality to tables and rooms.</p>
            </article>
          </div>
        </section>
      </main>
      <Footer variant="instagram" />
    </>
  )
}