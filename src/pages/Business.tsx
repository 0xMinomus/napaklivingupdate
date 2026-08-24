import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { usePageHero } from '../hooks/usePageHero'

export default function Business(): ReactElement {
  useDocumentTitle('Trade & Business — Napak Living')
  usePageHero()

  return (
    <>
      <main id="main-content" className="page-main">
        <section className="container business-hero" aria-labelledby="page-title">
          <div>
            <p className="breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span>Trade</span>
            </p>
            <p className="eyebrow">For your next space</p>
            <h1 id="page-title" className="display-title">
              <span>Let’s make a</span>
              <span className="muted-line">space together.</span>
            </h1>
            <p className="lead business-intro">
              We are open to collaborations with designers, hospitality teams, retail partners, and
              anyone who wants to bring Napak into a new space.
            </p>
          </div>
          <div className="business-hero-image">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=70"
              alt="A hospitality space with natural interiors and decorative objects"
            />
          </div>
        </section>

        <section className="container business-layout" aria-labelledby="inquiry-title">
          <aside className="business-aside">
            <p className="eyebrow">Start a conversation / 01</p>
            <h2>Tell us what you are building.</h2>
            <p>Tell us about your needs and project context. Our team will follow up by email or WhatsApp.</p>
            <div className="business-contact-list">
              <a href="mailto:trade@napakliving.com">trade@napakliving.com ↗</a>
              <a href="https://wa.me/6281234567890">WhatsApp trade desk ↗</a>
              <Link to="/lookbook">View lookbook →</Link>
            </div>
          </aside>

          <div>
            <h2 id="inquiry-title" className="form-heading">
              Inquiry form
            </h2>
            <ContactForm
              className="inquiry-form"
              defaultType="wholesale"
              buttonLabel="Send inquiry"
              footerNote="By submitting this form, you agree to be contacted by Napak Living about your inquiry."
            >
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="name">Full name *</label>
                  <input id="name" name="name" type="text" autoComplete="name" required />
                </div>
                <div className="form-field">
                  <label htmlFor="company">Company / studio name</label>
                  <input id="company" name="company" type="text" autoComplete="organization" />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email *</label>
                  <input id="email" name="email" type="email" autoComplete="email" required />
                </div>
                <div className="form-field">
                  <label htmlFor="phone">Phone / WhatsApp *</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" required />
                </div>
                <div className="form-field form-field-full">
                  <label htmlFor="inquiry-type">I am interested in *</label>
                  <select id="inquiry-type" name="type" required defaultValue="">
                    <option value="" disabled>
                      Choose inquiry type
                    </option>
                    <option value="wholesale">Wholesale partnership</option>
                    <option value="designer">Interior designer / stylist</option>
                    <option value="hospitality">Hospitality — hotel, restaurant, café</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="custom">Custom order</option>
                  </select>
                </div>
                <div className="form-field form-field-full">
                  <label htmlFor="message">Tell us about your needs *</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Project type, timeline, quantity, or products you are interested in..."
                    required
                  />
                </div>
                <div className="form-field form-field-full">
                  <label htmlFor="reference">Reference file / image</label>
                  <input id="reference" name="reference" type="file" accept="image/*,.pdf" />
                  <p className="form-helper">Optional · JPG, PNG, or PDF · max 10 MB</p>
                </div>
              </div>
            </ContactForm>
          </div>
        </section>

        <section className="container business-services" aria-labelledby="services-title">
          <p className="eyebrow">Ways we work / 02</p>
          <h2 id="services-title" className="section-title">
            <span>A place for</span>
            <span className="muted-line">good collaborations.</span>
          </h2>
          <div className="service-grid">
            <article className="service-card">
              <span className="mono">01 / wholesale</span>
              <h3>Stock Napak</h3>
              <p>For stores and distributors who want to bring our collection to their community.</p>
            </article>
            <article className="service-card">
              <span className="mono">02 / design trade</span>
              <h3>Source with us</h3>
              <p>Access specifications and support for interior and styling projects.</p>
            </article>
            <article className="service-card">
              <span className="mono">03 / hospitality</span>
              <h3>Set the scene</h3>
              <p>Objects for hotels, restaurants, cafés, and spaces that welcome many stories.</p>
            </article>
            <article className="service-card">
              <span className="mono">04 / custom</span>
              <h3>Make something</h3>
              <p>Collaborations and custom orders for more specific needs.</p>
            </article>
          </div>
        </section>
      </main>
      <Footer variant="contact" />
    </>
  )
}