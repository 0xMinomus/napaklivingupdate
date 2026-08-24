import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/gsap'

const EASE = 'power2.out'
const MAX_DEG = 4

const TILT_SELECTOR = [
  '.product-image',
  '.collection-card',
  '.collection-list-card',
  '.lookbook-page-card',
  '.story-image-frame',
  '.about-hero-image',
  '.about-story-image',
  '.business-hero-image',
  '.collection-detail-image',
  '.gallery-main',
  '.gallery-thumb',
].join(',')

function setupTilt(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>(TILT_SELECTOR).forEach((card) => {
    gsap.set(card, { transformPerspective: 900 })

    const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: EASE })
    const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: EASE })

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      rotY(nx * MAX_DEG * 2)
      rotX(-ny * MAX_DEG * 2)
    }
    const onLeave = () => {
      rotX(0)
      rotY(0)
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
  })
}

export function useTilt() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = containerRef.current
      if (!el) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      if (window.matchMedia('(pointer: coarse)').matches) return

      setupTilt(el)

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
          for (const node of added) setupTilt(node as HTMLElement)
        }
      })
      observer.observe(el, { childList: true, subtree: true })

      return () => observer.disconnect()
    },
    { scope: containerRef }
  )

  return containerRef
}
