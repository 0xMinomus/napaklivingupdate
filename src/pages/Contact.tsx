import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_CONTACT, get } from '../api'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { usePageHero } from '../hooks/usePageHero'
import { useSettings } from '../hooks/useSettings'
import type { ContactPage } from '../types'

export default function Contact(): ReactElement {
  useDocumentTitle('Contact — Napak Living')
  usePageHero()
  const settings = useSettings()
  const [page, setPage] = useState<ContactPage>(DEFAULT_CONTACT)

  useEffect(() => {
    let cancelled = false
    get<ContactPage>('/pages/contact')
      .then((data) => {
        if (!cancelled) setPage(data)
      })
      .catch(() => {
        if (!cancelled) setPage(DEFAULT_CONTACT)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const addressLines = (settings.studioAddress ?? '').split('\n').filter(Boolean)

  return (
    <>
      <main id="main-content" className="page-main">
        <section className="container contact-page-hero" aria-labelledby="page-title">
          <p className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </p>
          <p className="eyebrow">{page.heroEyebrow}</p>
          <h1 id="page-title" className="display-title">
            <span>{page.heroTitle1}</span>
            <span className="muted-line">{page.heroTitle2}</span>
          </h1>
          <p className="lead">{page.heroLead}</p>
        </section>

        <section className="container contact-layout" aria-label="Contact Napak Living">
          <div className="contact-information">
            <h2>{page.infoTitle}</h2>
            <p>{page.infoText}</p>
            <div className="contact-items">
              <div className="contact-item">
                <span>Email</span>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </div>
              <div className="contact-item">
                <span>WhatsApp</span>
                <a href={settings.whatsapp}>{settings.whatsappLabel ?? settings.whatsapp} ↗</a>
              </div>
              <div className="contact-item">
                <span>Studio / showroom</span>
                <address>
                  {addressLines.map((line, i) => (
                    <span key={line}>
                      {line}
                      {i < addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </address>
              </div>
              <div className="contact-item">
                <span>Social</span>
                <a href={settings.instagram ?? '#footer'}>Instagram ↗</a>
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
              src={settings.mapsEmbedUrl ?? ''}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="map-info">
              <span>{page.mapLabel}</span>
              <strong>{page.mapName}</strong>
              <p>{page.mapText}</p>
              <a
                className="text-link"
                href={settings.mapsUrl ?? ''}
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