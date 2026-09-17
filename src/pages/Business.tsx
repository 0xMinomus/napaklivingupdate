import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_BUSINESS, get } from '../api'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { usePageHero } from '../hooks/usePageHero'
import { useSettings } from '../hooks/useSettings'
import type { BusinessPage } from '../types'

export default function Business(): ReactElement {
  useDocumentTitle('Trade & Business — Napak Living')
  usePageHero()
  const settings = useSettings()
  const [page, setPage] = useState<BusinessPage>(DEFAULT_BUSINESS)

  useEffect(() => {
    let cancelled = false
    get<BusinessPage>('/pages/business')
      .then((data) => {
        if (!cancelled) setPage(data)
      })
      .catch(() => {
        if (!cancelled) setPage(DEFAULT_BUSINESS)
      })
    return () => {
      cancelled = true
    }
  }, [])

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
            <p className="eyebrow">{page.heroEyebrow}</p>
            <h1 id="page-title" className="display-title">
              <span>{page.heroTitle1}</span>
              <span className="muted-line">{page.heroTitle2}</span>
            </h1>
            <p className="lead business-intro">{page.heroLead}</p>
          </div>
          <div className="business-hero-image">
            <img src={page.heroImage} alt={page.heroAlt ?? ''} />
          </div>
        </section>

        <section className="container business-layout" aria-labelledby="inquiry-title">
          <aside className="business-aside">
            <p className="eyebrow">{page.asideEyebrow}</p>
            <h2>{page.asideTitle}</h2>
            <p>{page.asideText}</p>
            <div className="business-contact-list">
              <a href={`mailto:${settings.tradeEmail}`}>{settings.tradeEmail} ↗</a>
              <a href={settings.whatsapp}>WhatsApp trade desk ↗</a>
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
          <p className="eyebrow">{page.servicesEyebrow}</p>
          <h2 id="services-title" className="section-title">
            <span>{page.servicesTitle1}</span>
            <span className="muted-line">{page.servicesTitle2}</span>
          </h2>
          <div className="service-grid">
            {page.services.map((service) => (
              <article className="service-card" key={service.mono}>
                <span className="mono">{service.mono}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer variant="contact" />
    </>
  )
}
