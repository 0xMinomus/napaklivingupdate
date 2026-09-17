import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_ABOUT, get } from '../api'
import Footer from '../components/Footer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { usePageHero } from '../hooks/usePageHero'
import type { AboutPage } from '../types'

export default function About(): ReactElement {
  useDocumentTitle('Our Story — Napak Living')
  usePageHero()
  const [page, setPage] = useState<AboutPage>(DEFAULT_ABOUT)

  useEffect(() => {
    let cancelled = false
    get<AboutPage>('/pages/about')
      .then((data) => {
        if (!cancelled) setPage(data)
      })
      .catch(() => {
        if (!cancelled) setPage(DEFAULT_ABOUT)
      })
    return () => {
      cancelled = true
    }
  }, [])

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
            <p className="eyebrow">{page.heroEyebrow}</p>
            <h1 id="page-title" className="display-title">
              <span>{page.heroTitle1}</span>
              <span className="muted-line">{page.heroTitle2}</span>
            </h1>
          </div>
          <p className="lead">{page.heroLead}</p>
        </section>

        <div className="container about-hero-image">
          <img src={page.heroImage} alt={page.heroAlt ?? ''} />
        </div>

        <section className="container about-statement" aria-labelledby="statement-title">
          <p className="eyebrow">{page.statementEyebrow}</p>
          <h2 id="statement-title" className="section-title">
            <span>{page.statementTitle1}</span>
            <span className="muted-line">{page.statementTitle2}</span>
          </h2>
          <p className="lead">{page.statementLead}</p>
        </section>

        <section className="container about-story-grid" aria-labelledby="founding-title">
          <div className="about-story-image">
            <img src={page.storyImage} alt={page.storyAlt ?? ''} loading="lazy" />
          </div>
          <div className="about-story-copy">
            <p className="eyebrow">{page.storyEyebrow}</p>
            <h2 id="founding-title" className="section-title">
              <span>{page.storyTitle1}</span>
              <span className="muted-line">{page.storyTitle2}</span>
            </h2>
            <p className="lead">{page.storyLead1}</p>
            <p className="lead">{page.storyLead2}</p>
          </div>
        </section>

        <section className="philosophy-band" aria-labelledby="philosophy-title">
          <div className="container philosophy-layout">
            <div>
              <p className="eyebrow">{page.philosophyEyebrow}</p>
              <h2 id="philosophy-title" className="section-title">
                <span>{page.philosophyTitle1}</span>
                <span className="muted-line">{page.philosophyTitle2}</span>
              </h2>
            </div>
            <div className="philosophy-copy">
              <p className="lead">{page.philosophyLead}</p>
              <div className="value-grid">
                {page.values.map((value, i) => (
                  <article className="value-item" key={value.title}>
                    <span className="value-number">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{value.title}</h3>
                    <p>{value.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container materials-section" aria-labelledby="materials-title">
          <p className="eyebrow">{page.materialsEyebrow}</p>
          <h2 id="materials-title" className="section-title">
            <span>{page.materialsTitle1}</span>
            <span className="muted-line">{page.materialsTitle2}</span>
          </h2>
          <div className="materials-grid">
            {page.materials.map((material) => (
              <article className="material-card" key={material.tag}>
                <span>{material.tag}</span>
                <h3>{material.title}</h3>
                <p>{material.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer variant="instagram" />
    </>
  )
}
