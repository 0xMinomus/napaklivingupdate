import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../lib/gsap'

const EASE = 'power2.out'

interface GroupOpts {
  y: number
  duration: number
  stagger?: number
  start?: string
}

const GROUPS: Record<string, GroupOpts> = {
  '.eyebrow': { y: 16, duration: 0.6, stagger: 0.08, start: 'top 88%' },
  '.display-title, .section-title': { y: 28, duration: 0.8, stagger: 0.1 },
  '.lead': { y: 20, duration: 0.7, stagger: 0.08, start: 'top 85%' },
  '.text-link, .shop-link, .button': { y: 14, duration: 0.6, stagger: 0.06, start: 'top 90%' },
  '.section-heading, .section-topline, .form-heading': { y: 22, duration: 0.7, stagger: 0.1 },
  '.product-card': { y: 28, duration: 0.7, stagger: 0.08 },
  '.collection-card, .collection-list-card': { y: 30, duration: 0.8, stagger: 0.1 },
  '.lookbook-image, .lookbook-page-card': { y: 26, duration: 0.75, stagger: 0.1 },
  '.material-card, .service-card': { y: 24, duration: 0.7, stagger: 0.08 },
  '.value-item': { y: 18, duration: 0.6, stagger: 0.06 },
  '.category-list a': { y: 16, duration: 0.5, stagger: 0.06, start: 'top 90%' },
  '.trade-panel': { y: 30, duration: 0.8 },
  '.page-hero': { y: 20, duration: 0.7, start: 'top 90%' },
  '.breadcrumb': { y: 12, duration: 0.5, stagger: 0.05, start: 'top 92%' },
  '.filter-panel': { y: 20, duration: 0.6, start: 'top 88%' },
  '.confirmation-card': { y: 24, duration: 0.7 },
  '.contact-form, .inquiry-form': { y: 22, duration: 0.65 },
  '.map-card': { y: 20, duration: 0.6 },
  '.contact-items, .business-contact-list': { y: 20, duration: 0.6, stagger: 0.08 },
  '.contact-information, .business-aside': { y: 22, duration: 0.65 },
}

function batchReveal(targets: Element[], opts: GroupOpts) {
  if (!targets.length) return
  const { y, duration, stagger, start = 'top 87%' } = opts

  gsap.set(targets, { opacity: 0, y })
  ScrollTrigger.batch(targets, {
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration,
        ease: EASE,
        stagger,
        overwrite: true,
      })
    },
    start,
    once: true,
  })
}

function collect(container: HTMLElement, added?: Element[]): void {
  for (const [selector, opts] of Object.entries(GROUPS)) {
    if (!added) {
      batchReveal(Array.from(container.querySelectorAll(selector)), opts)
      continue
    }
    const els: Element[] = []
    for (const node of added) {
      if (node.matches(selector)) els.push(node)
      els.push(...Array.from(node.querySelectorAll(selector)))
    }
    batchReveal(els, opts)
  }
}

export function useScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = containerRef.current
      if (!el) return

      collect(el)

      const handled = new WeakSet<Element>()
      const observer = new MutationObserver((mutations) => {
        const added: Element[] = []
        for (const m of mutations) {
          for (const n of m.addedNodes) {
            if (n instanceof Element && !handled.has(n)) {
              handled.add(n)
              added.push(n)
            }
          }
        }
        if (added.length) {
          collect(el, added)
          ScrollTrigger.refresh()
        }
      })
      observer.observe(el, { childList: true, subtree: true })

      return () => observer.disconnect()
    },
    { scope: containerRef }
  )

  return containerRef
}
