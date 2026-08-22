import type { RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const SECTION_SELECTOR = 'main > section:not(.hero-bg), .site-footer'

const CONTENT_SELECTOR = [
  '.category-list > a',
  '.product-card',
  '.collection-card',
  '.collection-list-card',
  '.lookbook-image',
  '.lookbook-page-card',
  '.lookbook-note',
  '.trade-panel',
  '.story-image',
  '.story-copy',
  '.material-card',
  '.service-card',
  '.confirmation-card',
  '.filter-panel',
  '.inquiry-form',
  '.contact-form',
  '.map-card',
  '.gallery-main',
  '.product-detail-info',
  '.collection-detail-image',
  '.about-hero-image',
  '.about-story-image',
  '.newsletter',
  '.footer-brand',
  '.footer-column',
].join(', ')

interface ScrollAnimationsProps {
  scope: RefObject<HTMLElement | null>
  routeKey: string
}

interface RevealOptions {
  delay?: number
  y?: number
  scale?: number
}

function selectAll(root: HTMLElement, selector: string): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(selector))
}

export default function ScrollAnimations({ scope, routeKey }: ScrollAnimationsProps): null {
  useGSAP(
    (_context, contextSafe) => {
      const root = scope.current
      if (!root || !contextSafe) return

      const media = gsap.matchMedia()

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const animated = new WeakSet<HTMLElement>()
        let refreshFrame: number | null = null

        const reveal = (element: HTMLElement, options: RevealOptions = {}): void => {
          if (animated.has(element)) return
          animated.add(element)

          gsap.fromTo(
            element,
            {
              autoAlpha: 0,
              y: options.y ?? 34,
              scale: options.scale ?? 0.985,
              willChange: 'transform, opacity',
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.82,
              delay: options.delay ?? 0,
              ease: 'power3.out',
              clearProps: 'opacity,visibility,transform,willChange',
              scrollTrigger: {
                trigger: element,
                start: 'top 88%',
                toggleActions: 'play none none none',
                once: true,
              },
            },
          )
        }

        const animateHeroCopy = (): void => {
          const hero = root.querySelector<HTMLElement>('.hero-bg')
          if (!hero || animated.has(hero)) return

          const copy = selectAll(hero, '.display-title span, .hero-lead, .shop-link')
          if (!copy.length) return

          animated.add(hero)
          gsap.fromTo(
            copy,
            {
              autoAlpha: 0,
              y: 26,
              filter: 'blur(8px)',
              willChange: 'transform, opacity, filter',
            },
            {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.9,
              stagger: 0.14,
              ease: 'power3.out',
              clearProps: 'opacity,visibility,transform,filter,willChange',
              scrollTrigger: {
                trigger: hero,
                start: 'top 90%',
                toggleActions: 'play none none none',
                once: true,
              },
            },
          )
        }

        const scan = (): void => {
          animateHeroCopy()

          selectAll(root, SECTION_SELECTOR).forEach((element, index) => {
            reveal(element, {
              delay: Math.min(index * 0.04, 0.16),
              scale: 0.995,
              y: 38,
            })
          })

          selectAll(root, CONTENT_SELECTOR).forEach((element, index) => {
            reveal(element, {
              delay: Math.min(index * 0.055, 0.33),
            })
          })
        }

        const safeScan = contextSafe(scan)
        const scheduleScan = (): void => {
          if (refreshFrame !== null) cancelAnimationFrame(refreshFrame)
          refreshFrame = requestAnimationFrame(() => {
            refreshFrame = null
            safeScan()
            ScrollTrigger.refresh()
          })
        }

        const observer =
          typeof MutationObserver === 'undefined'
            ? null
            : new MutationObserver(() => {
                scheduleScan()
              })

        observer?.observe(root, { childList: true, subtree: true })
        window.addEventListener('load', scheduleScan)
        safeScan()
        ScrollTrigger.refresh()

        return () => {
          observer?.disconnect()
          window.removeEventListener('load', scheduleScan)
          if (refreshFrame !== null) cancelAnimationFrame(refreshFrame)
        }
      })

      return () => media.revert()
    },
    { scope, dependencies: [routeKey], revertOnUpdate: true },
  )

  return null
}
