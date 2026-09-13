import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { usePageHero } from '../hooks/usePageHero'

export default function Contact(): ReactElement {
  useDocumentTitle('Contact — Napak Living')
  usePageHero()

  return (
    <>
      <main id="main-content" className="page-main">
        <section className="container contact-page-hero" aria-labelledby="page-title">
          <p className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </p>
          <p className="eyebrow">Say hello / we are here</p>
          <h1 id="page-title" className="display-title">
            <span>Let’s stay</span>
            <span className="muted-line">in touch.</span>
          </h1>
          <p className="lead">
            For product questions, orders, or simply to say hello, send a message through the channel
            that feels most convenient for you.
          </p>
        </section>

        <section className="container contact-layout" aria-label="Contact Napak Living">
          <div className="contact-information">
            <h2>Come by, write, or call.</h2>
            <p>We will do our best to reply within 1–2 business days.</p>
            <div className="contact-items">
              <div className="contact-item">
                <span>Email</span>
                <a href="mailto:hello@napakliving.com">hello@napakliving.com</a>
              </div>
              <div className="contact-item">
                <span>WhatsApp</span>
                <a href="https://wa.me/6281234567890">+62 812 3456 7890 ↗</a>
              </div>
              <div className="contact-item">
                <span>Studio / showroom</span>
                <address>
                  Jimbaran
                  <br />
                  Bali, Indonesia
                  <br />
                  by appointment
                </address>
              </div>
              <div className="contact-item">
                <span>Social</span>
                <a href="#footer">Instagram ↗</a>
              </div>
            </div>
          </div>

          <ContactForm
            className="contact-form"
            defaultType="contact"
            buttonLabel="Send message"
            footerNote="Required fields are marked with *."
          >
            <h2 className="form-heading">Send a message</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="name">Full name *</label>
                <input id="name" name="name" type="text" autoComplete="name" required />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email *</label>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="form-field form-field-full">
                <label htmlFor="subject">Subject / topic *</label>
                <input id="subject" name="subject" type="text" required />
              </div>
              <div className="form-field form-field-full">
                <label htmlFor="message">Message *</label>
                <textarea id="message" name="message" required />
              </div>
            </div>
          </ContactForm>

          <div className="map-card">
            <iframe
              title="Map to Napak Living Studio"
              src="https://maps.google.com/maps?q=-8.7961749,115.1869325&z=16&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="map-info">
              <span>Visit the studio</span>
              <strong>Napak Living Studio</strong>
              <p>Jimbaran, Bali — open by appointment. Tap the pin for directions.</p>
              <a
                className="text-link"
                href="https://maps.app.goo.gl/EVkYBVYKu3ViL8aE8"
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="contact" />
    </>
  )
}