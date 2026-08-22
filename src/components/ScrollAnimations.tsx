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

      media.add({ reduceMotion: '(prefers-reduced-motion: reduce)' }, ({ conditions }) => {
        if (conditions?.reduceMotion) return

        const animated = new WeakSet<HTMLElement>()
        const revealTweens = new Map<HTMLElement, gsap.core.Tween>()
        let scanTimer: number | null = null
        const duration = window.matchMedia('(max-width: 767px)').matches ? 0.68 : 0.82

        const reveal = (element: HTMLElement, options: RevealOptions = {}): void => {
          if (animated.has(element)) return
          animated.add(element)

          const tween = gsap.fromTo(
            element,
            {
              autoAlpha: 0,
              y: options.y ?? 34,
              willChange: 'transform, opacity',
            },
            {
              autoAlpha: 1,
              y: 0,
              duration,
              delay: options.delay ?? 0,
              ease: 'power2.out',
              clearProps: 'opacity,visibility,transform,willChange',
              scrollTrigger: {
                trigger: element,
                start: 'top 88%',
                toggleActions: 'play none none none',
                once: true,
              },
            },
          )
          revealTweens.set(element, tween)
        }

        const animateHeroCopy = (): void => {
          const hero = root.querySelector<HTMLElement>('.hero-bg')
          if (!hero || animated.has(hero)) return

          const copy = selectAll(hero, '.display-title span, .hero-lead, .shop-link')
          if (!copy.length) return

          animated.add(hero)
          const tween = gsap.fromTo(
            copy,
            {
              autoAlpha: 0,
              y: 22,
              willChange: 'transform, opacity',
            },
            {
              autoAlpha: 1,
              y: 0,
              duration,
              stagger: 0.1,
              ease: 'power2.out',
              clearProps: 'opacity,visibility,transform,willChange',
              scrollTrigger: {
                trigger: hero,
                start: 'top 90%',
                toggleActions: 'play none none none',
                once: true,
              },
            },
          )
          revealTweens.set(hero, tween)
        }

        const scan = (): void => {
          animateHeroCopy()

          selectAll(root, SECTION_SELECTOR).forEach((element, index) => {
            reveal(element, {
              delay: Math.min(index * 0.04, 0.16),
              y: 0,
            })
          })

          selectAll(root, CONTENT_SELECTOR).forEach((element, index) => {
            reveal(element, {
              delay: Math.min(index * 0.055, 0.33),
            })
          })
        }

        const safeScan = contextSafe(scan)
        const refresh = (): void => {
          ScrollTrigger.refresh()
          ScrollTrigger.update()

          const viewportBottom = window.innerHeight * 0.9
          for (const [element, tween] of revealTweens) {
            const rect = element.getBoundingClientRect()
            if (rect.top <= viewportBottom && rect.bottom >= 0 && tween.progress() === 0) {
              tween.play()
            }
          }
        }
        const scheduleScan = (delay = 0): void => {
          if (scanTimer !== null) window.clearTimeout(scanTimer)
          scanTimer = window.setTimeout(() => {
            scanTimer = null
            safeScan()
            refresh()
          }, delay)
        }
        const scheduleAfterLoad = (): void => scheduleScan(32)

        const observer =
          typeof MutationObserver === 'undefined'
            ? null
            : new MutationObserver(() => {
                scheduleScan(40)
              })

        observer?.observe(root, { childList: true, subtree: true })
        window.addEventListener('load', scheduleAfterLoad)
        scheduleScan()

        return () => {
          observer?.disconnect()
          window.removeEventListener('load', scheduleAfterLoad)
          if (scanTimer !== null) window.clearTimeout(scanTimer)
        }
      })

      return () => media.revert()
    },
    { scope, dependencies: [routeKey], revertOnUpdate: true },
  )

  return null
}
