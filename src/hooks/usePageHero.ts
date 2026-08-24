import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/gsap'

const EASE = 'power2.out'

export function usePageHero() {
  useGSAP(() => {
    const hero = document.querySelector(
      '.page-hero, .about-intro, .business-hero, .contact-page-hero, .collection-page-hero, .collection-detail-hero, .product-page'
    )
    if (!hero) return

    const breadcrumb = hero.querySelector('.breadcrumb')
    const eyebrow = hero.querySelector('.eyebrow')
    const title = hero.querySelector('.display-title')
    const lead = hero.querySelector('.lead')
    const rule = hero.querySelector('.page-hero-rule')
    const chips = hero.querySelector('.category-links')

    const elements = [breadcrumb, eyebrow, title, lead, rule, chips].filter(Boolean)

    gsap.set(elements, { opacity: 0, y: 20 })

    gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: EASE,
      stagger: 0.1,
      delay: 0.1,
    })
  })
}
