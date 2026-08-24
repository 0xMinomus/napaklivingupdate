import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../lib/gsap'

const EASE = 'power2.out'

const SKIP_PARENTS = [
  '.hero-bg-image',
  '.product-card',
  '.collection-card',
  '.collection-list-card',
  '.lookbook-page-card',
  '.material-card',
  '.service-card',
  '.value-item',
  '.trade-panel',
  '.breadcrumb',
  '.confirmation-card',
  '.contact-form',
  '.inquiry-form',
  '.filter-panel',
  '.map-card',
  '.contact-items',
  '.business-contact-list',
  '.contact-information',
  '.business-aside',
]

function revealElement(el: HTMLElement, delay: number) {
  gsap.fromTo(
    el,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.8, ease: EASE, delay }
  )
}

export function useImageReveal() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = containerRef.current
      if (!el) return

      const images = Array.from(el.querySelectorAll('img')) as HTMLImageElement[]

      images.forEach((img) => {
        if (SKIP_PARENTS.some((sel) => img.closest(sel))) return

        const wrapper = img.parentElement
        if (!wrapper) return

        const triggerEl = wrapper.tagName === 'PICTURE' ? wrapper.parentElement ?? wrapper : wrapper

        const isHeroImage =
          wrapper.classList.contains('business-hero-image') ||
          wrapper.classList.contains('about-hero-image')

        if (isHeroImage) {
          if (img.complete && img.naturalWidth > 0) {
            revealElement(triggerEl, 0.2)
          } else {
            gsap.set(triggerEl, { opacity: 0, y: 24 })
            img.addEventListener('load', () => revealElement(triggerEl, 0.2), { once: true })
          }
          return
        }

        gsap.set(triggerEl, { opacity: 0, y: 24 })

        ScrollTrigger.create({
          trigger: triggerEl,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            if (img.complete && img.naturalWidth > 0) {
              revealElement(triggerEl, 0)
            } else {
              img.addEventListener('load', () => revealElement(triggerEl, 0), { once: true })
            }
          },
        })
      })
    },
    { scope: containerRef }
  )

  return containerRef
}
