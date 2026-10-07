import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/gsap'

export function usePageHero(ready = true) {
  const pageRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const page = pageRef.current
    if (!page || !ready) return
    const hero = page.querySelector(
      '.page-hero, .about-intro, .business-hero, .contact-page-hero, .collection-detail-hero, .product-page'
    )
    if (!hero) return

    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const titles = hero.querySelectorAll('.display-title > span, .detail-title')
      const supporting = hero.querySelectorAll('.breadcrumb, .eyebrow, .detail-kicker, .lead, .detail-subtitle, .category-links')
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      if (titles.length) {
        intro.fromTo(titles, { clipPath: 'inset(0 100% 0 0)', x: 18 }, {
          clipPath: 'inset(0 0% 0 0)', x: 0, duration: 0.8, stagger: 0.1, clearProps: 'clipPath,transform',
        }, 0)
      }
      if (supporting.length) {
        intro.from(supporting, { opacity: 0, y: 8, duration: 0.4, stagger: 0.035, clearProps: 'opacity,transform' }, 0.2)
      }
      const onFocus = () => intro.progress(1)
      hero.addEventListener('focusin', onFocus)
      return () => hero.removeEventListener('focusin', onFocus)
    }, page)

    return () => media.revert()
  }, { scope: pageRef, dependencies: [ready], revertOnUpdate: true })

  return pageRef
}
