import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/gsap'

const EASE = 'power2.out'
const FAST = 0.3
const NORMAL = 0.4

function addHover(el: Element, enter: () => void, leave: () => void) {
  el.addEventListener('mouseenter', enter)
  el.addEventListener('mouseleave', leave)
}

function setupProductCards(root: HTMLElement) {
  root.querySelectorAll('.product-image').forEach((card) => {
    const img = card.querySelector('img')
    const arrow = card.querySelector('.image-arrow')
    const meta = card.closest('.product-card')?.querySelector('.product-meta h3')
    addHover(card,
      () => {
        gsap.to(card, { y: -4, boxShadow: '0 14px 32px rgba(24,24,24,0.1)', borderColor: 'rgba(24,24,24,0.12)', duration: FAST, ease: EASE })
        if (img) gsap.to(img, { scale: 1.05, duration: NORMAL, ease: EASE })
        if (arrow) gsap.to(arrow, { opacity: 1, y: 0, duration: FAST, ease: EASE })
        if (meta) gsap.to(meta, { color: '#58624a', x: 2, duration: FAST, ease: EASE })
      },
      () => {
        gsap.to(card, { y: 0, boxShadow: '0 0 0 rgba(24,24,24,0)', borderColor: 'rgba(24,24,24,0)', duration: FAST, ease: EASE })
        if (img) gsap.to(img, { scale: 1, duration: NORMAL, ease: EASE })
        if (arrow) gsap.to(arrow, { opacity: 0, y: 5, duration: FAST, ease: EASE })
        if (meta) gsap.to(meta, { color: '', x: 0, duration: FAST, ease: EASE })
      }
    )
  })
}

function setupCollectionCards(root: HTMLElement) {
  root.querySelectorAll('.collection-card').forEach((card) => {
    const img = card.querySelector('img')
    const info = card.querySelector('.collection-info')
    const arrow = card.querySelector('.collection-arrow')
    addHover(card,
      () => {
        gsap.to(card, { y: -4, boxShadow: '0 14px 32px rgba(24,24,24,0.1)', duration: FAST, ease: EASE })
        if (img) gsap.to(img, { scale: 1.06, duration: NORMAL, ease: EASE })
        if (info) gsap.to(info, { y: -4, duration: FAST, ease: EASE })
        if (arrow) gsap.to(arrow, { backgroundColor: '#fcfcf9', color: '#181818', duration: FAST, ease: EASE })
      },
      () => {
        gsap.to(card, { y: 0, boxShadow: '0 0 0 rgba(24,24,24,0)', duration: FAST, ease: EASE })
        if (img) gsap.to(img, { scale: 1, duration: NORMAL, ease: EASE })
        if (info) gsap.to(info, { y: 0, duration: FAST, ease: EASE })
        if (arrow) gsap.to(arrow, { backgroundColor: '', color: '', duration: FAST, ease: EASE })
      }
    )
  })
}

function setupCollectionListCards(root: HTMLElement) {
  root.querySelectorAll('.collection-list-card').forEach((card) => {
    const img = card.querySelector('img')
    const info = card.querySelector('.collection-list-info')
    const arrow = card.querySelector('.collection-list-arrow')
    addHover(card,
      () => {
        gsap.to(card, { y: -5, boxShadow: '0 18px 38px rgba(24,24,24,0.14)', duration: FAST, ease: EASE })
        if (img) gsap.to(img, { scale: 1.05, duration: NORMAL, ease: EASE })
        if (info) gsap.to(info, { y: -4, duration: FAST, ease: EASE })
        if (arrow) gsap.to(arrow, { backgroundColor: '#fcfcf9', color: '#181818', rotation: -8, scale: 1.08, duration: FAST, ease: EASE })
      },
      () => {
        gsap.to(card, { y: 0, boxShadow: '0 0 0 rgba(24,24,24,0)', duration: FAST, ease: EASE })
        if (img) gsap.to(img, { scale: 1, duration: NORMAL, ease: EASE })
        if (info) gsap.to(info, { y: 0, duration: FAST, ease: EASE })
        if (arrow) gsap.to(arrow, { backgroundColor: '', color: '', rotation: 0, scale: 1, duration: FAST, ease: EASE })
      }
    )
  })
}

function setupLookbookCards(root: HTMLElement) {
  root.querySelectorAll('.lookbook-page-card').forEach((card) => {
    const img = card.querySelector('img')
    addHover(card,
      () => {
        gsap.to(card, { y: -4, boxShadow: '0 14px 32px rgba(24,24,24,0.1)', duration: FAST, ease: EASE })
        if (img) gsap.to(img, { scale: 1.04, duration: NORMAL, ease: EASE })
      },
      () => {
        gsap.to(card, { y: 0, boxShadow: '0 0 0 rgba(24,24,24,0)', duration: FAST, ease: EASE })
        if (img) gsap.to(img, { scale: 1, duration: NORMAL, ease: EASE })
      }
    )
  })
}

function setupGallery(root: HTMLElement) {
  root.querySelectorAll('.gallery-main').forEach((gallery) => {
    const img = gallery.querySelector('img')
    if (!img) return
    addHover(gallery,
      () => { gsap.to(img, { scale: 1.025, duration: NORMAL, ease: EASE }) },
      () => { gsap.to(img, { scale: 1, duration: NORMAL, ease: EASE }) }
    )
  })
  root.querySelectorAll('.gallery-thumb').forEach((thumb) => {
    addHover(thumb,
      () => { gsap.to(thumb, { y: -3, duration: FAST, ease: EASE }) },
      () => { gsap.to(thumb, { y: 0, duration: FAST, ease: EASE }) }
    )
  })
}

function setupStoryFrame(root: HTMLElement) {
  root.querySelectorAll('.story-image').forEach((story) => {
    const frame = story.querySelector('.story-image-frame')
    const img = frame?.querySelector('img')
    if (!frame) return
    addHover(story,
      () => {
        gsap.to(frame, { y: -4, boxShadow: '0 14px 32px rgba(24,24,24,0.1)', duration: FAST, ease: EASE })
        if (img) gsap.to(img, { scale: 1.06, duration: NORMAL, ease: EASE })
      },
      () => {
        gsap.to(frame, { y: 0, boxShadow: '0 0 0 rgba(24,24,24,0)', duration: FAST, ease: EASE })
        if (img) gsap.to(img, { scale: 1, duration: NORMAL, ease: EASE })
      }
    )
  })
}

function setupAboutImages(root: HTMLElement) {
  root.querySelectorAll('.about-hero-image, .about-story-image, .business-hero-image, .collection-detail-image').forEach((container) => {
    const img = container.querySelector('img')
    if (!img) return
    addHover(container,
      () => {
        gsap.to(container, { y: -4, boxShadow: '0 14px 32px rgba(24,24,24,0.1)', duration: FAST, ease: EASE })
        gsap.to(img, { scale: 1.04, duration: NORMAL, ease: EASE })
      },
      () => {
        gsap.to(container, { y: 0, boxShadow: '0 0 0 rgba(24,24,24,0)', duration: FAST, ease: EASE })
        gsap.to(img, { scale: 1, duration: NORMAL, ease: EASE })
      }
    )
  })
}

function setupButtons(root: HTMLElement) {
  root.querySelectorAll('.button').forEach((btn) => {
    addHover(btn,
      () => { gsap.to(btn, { y: -2, duration: FAST, ease: EASE }) },
      () => { gsap.to(btn, { y: 0, duration: FAST, ease: EASE }) }
    )
  })
}

function setupCategoryLinks(root: HTMLElement) {
  root.querySelectorAll('.category-list a').forEach((link) => {
    addHover(link,
      () => {
        gsap.to(link, { paddingLeft: 10, color: '#58624a', duration: FAST, ease: EASE })
        const arrow = link.querySelector('span:last-child')
        if (arrow) gsap.to(arrow, { x: 4, rotation: -4, duration: FAST, ease: EASE })
      },
      () => {
        gsap.to(link, { paddingLeft: 4, color: '', duration: FAST, ease: EASE })
        const arrow = link.querySelector('span:last-child')
        if (arrow) gsap.to(arrow, { x: 0, rotation: 0, duration: FAST, ease: EASE })
      }
    )
  })
}

function setupImageHotspots(root: HTMLElement) {
  root.querySelectorAll('.image-hotspot').forEach((hotspot) => {
    addHover(hotspot,
      () => {
        gsap.to(hotspot, { scale: 1.12, backgroundColor: '#58624a', duration: FAST, ease: EASE })
      },
      () => {
        gsap.to(hotspot, { scale: 1, backgroundColor: '', duration: FAST, ease: EASE })
      }
    )
  })
}

function setupLookbookHome(root: HTMLElement) {
  root.querySelectorAll('.lookbook-image').forEach((figure) => {
    const img = figure.querySelector('img')
    if (!img) return
    addHover(figure,
      () => {
        gsap.to(figure, { y: -4, boxShadow: '0 14px 32px rgba(24,24,24,0.1)', duration: FAST, ease: EASE })
        gsap.to(img, { scale: 1.06, duration: NORMAL, ease: EASE })
      },
      () => {
        gsap.to(figure, { y: 0, boxShadow: '0 0 0 rgba(24,24,24,0)', duration: FAST, ease: EASE })
        gsap.to(img, { scale: 1, duration: NORMAL, ease: EASE })
      }
    )
  })
}

function setupAll(root: HTMLElement) {
  setupProductCards(root)
  setupCollectionCards(root)
  setupCollectionListCards(root)
  setupLookbookCards(root)
  setupGallery(root)
  setupStoryFrame(root)
  setupAboutImages(root)
  setupButtons(root)
  setupCategoryLinks(root)
  setupImageHotspots(root)
  setupLookbookHome(root)
}

export function useCardHover() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = containerRef.current
      if (!el) return

      setupAll(el)

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
          for (const node of added) setupAll(node as HTMLElement)
        }
      })
      observer.observe(el, { childList: true, subtree: true })

      return () => observer.disconnect()
    },
    { scope: containerRef }
  )

  return containerRef
}
