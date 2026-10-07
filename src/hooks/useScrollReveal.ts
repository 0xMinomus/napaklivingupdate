import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/gsap'

const EXCLUDED = '.hero-bg, .page-hero, .about-intro, .business-hero, .contact-page-hero, .collection-detail-hero, .product-page'

export function useScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const root = containerRef.current
    if (!root) return
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', (context) => {
      const tracked = new Set<HTMLElement>()
      const running = new Map<HTMLElement, gsap.core.Timeline>()
      const played = new WeakSet<HTMLElement>()
      const enter = context.add('enter', (heading: HTMLElement) => {
        if (!root.contains(heading) || played.has(heading)) return
        played.add(heading)
        observer.unobserve(heading)
        const lines = heading.querySelectorAll(':scope > span')
        const targets = lines.length ? lines : [heading]
        const timeline = gsap.timeline({ onComplete: () => running.delete(heading) })
        timeline.fromTo(targets, {
          clipPath: 'inset(0 100% 0 0)', x: 18,
        }, {
          clipPath: 'inset(0 0% 0 0)', x: 0, duration: 0.8,
          stagger: 0.1, ease: 'power3.out', clearProps: 'clipPath,transform',
        })
        running.set(heading, timeline)
      })

      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) enter(entry.target)
          else if (entry.boundingClientRect.bottom < 0) observer.unobserve(entry.target)
        }
      }, { threshold: 0.15, rootMargin: '0px 0px -12% 0px' })

      const collect = (node: Element) => {
        const headings = node.matches('.section-title')
          ? [node, ...node.querySelectorAll('.section-title')]
          : node.querySelectorAll('.section-title')
        for (const heading of headings) {
          if (!(heading instanceof HTMLElement) || heading.closest(EXCLUDED) || tracked.has(heading)) continue
          tracked.add(heading)
          observer.observe(heading)
        }
      }
      collect(root)

      const mutations = new MutationObserver((changes) => {
        for (const change of changes) {
          for (const node of change.addedNodes) {
            if (node instanceof Element) collect(node)
          }
        }
        for (const heading of tracked) {
          if (!root.contains(heading)) {
            observer.unobserve(heading)
            running.get(heading)?.revert()
            running.delete(heading)
            tracked.delete(heading)
          }
        }
      })
      mutations.observe(root, { childList: true, subtree: true })

      const onFocus = () => {
        for (const timeline of running.values()) timeline.progress(1)
      }
      root.addEventListener('focusin', onFocus)
      return () => {
        observer.disconnect()
        mutations.disconnect()
        root.removeEventListener('focusin', onFocus)
        running.clear()
        tracked.clear()
      }
    }, root)

    return () => media.revert()
  }, { scope: containerRef })

  return containerRef
}
