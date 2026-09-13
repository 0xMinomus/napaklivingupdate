import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/gsap'

const EASE = 'power2.out'
const FAST = 0.3
const NORMAL = 0.4

// ponytail: shadow/border milik CSS :hover (instant, serentak). GSAP pegang y/zoom/arrow saja biar tidak tarik-menarik dan delay. Butuh fade shadow lagi = hapus rule CSS, kembalikan boxShadow ke sini.
function hoverTo(target: Element | null | undefined, vars: object): void {
  if (!target) return
  gsap.to(target, { overwrite: 'auto', duration: FAST, ease: EASE, ...vars })
}

function addHover(el: Element, enter: () => void, leave: () => void) {
  const node = el as HTMLElement
  if (node.dataset.hoverBound) return
  node.dataset.hoverBound = '1'
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
        hoverTo(card, { y: -4 })
        hoverTo(img, { scale: 1.05, duration: NORMAL })
        hoverTo(arrow, { opacity: 1, y: 0 })
        hoverTo(meta, { color: '#58624a', x: 2 })
      },
      () => {
        hoverTo(card, { y: 0 })
        hoverTo(img, { scale: 1, duration: NORMAL })
        hoverTo(arrow, { opacity: 0, y: 5 })
        hoverTo(meta, { color: '', x: 0 })
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
        hoverTo(card, { y: -4, boxShadow: '0 14px 32px rgba(24,24,24,0.1)' })
        hoverTo(img, { scale: 1.06, duration: NORMAL })
        hoverTo(info, { y: -4 })
        hoverTo(arrow, { backgroundColor: '#fcfcf9', color: '#181818' })
      },
      () => {
        hoverTo(card, { y: 0, boxShadow: '0 0 0 rgba(24,24,24,0)' })
        hoverTo(img, { scale: 1, duration: NORMAL })
        hoverTo(info, { y: 0 })
        hoverTo(arrow, { backgroundColor: '', color: '' })
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
        hoverTo(card, { y: -5 })
        hoverTo(img, { scale: 1.05, duration: NORMAL })
        hoverTo(info, { y: -4 })
        hoverTo(arrow, { backgroundColor: '#fcfcf9', color: '#181818', rotation: -8, scale: 1.08 })
      },
      () => {
        hoverTo(card, { y: 0 })
        hoverTo(img, { scale: 1, duration: NORMAL })
        hoverTo(info, { y: 0 })
        hoverTo(arrow, { backgroundColor: '', color: '', rotation: 0, scale: 1 })
      }
    )
  })
}

function setupLookbookCards(root: HTMLElement) {
  root.querySelectorAll('.lookbook-page-card').forEach((card) => {
    const img = card.querySelector('img')
    addHover(card,
      () => {
        hoverTo(card, { y: -4 })
        hoverTo(img, { scale: 1.04, duration: NORMAL })
      },
      () => {
        hoverTo(card, { y: 0 })
        hoverTo(img, { scale: 1, duration: NORMAL })
      }
    )
  })
}

function setupGallery(root: HTMLElement) {
  root.querySelectorAll('.gallery-main').forEach((gallery) => {
    const img = gallery.querySelector('img')
    if (!img) return
    addHover(gallery,
      () => { hoverTo(img, { scale: 1.025, duration: NORMAL }) },
      () => { hoverTo(img, { scale: 1, duration: NORMAL }) }
    )
  })
  root.querySelectorAll('.gallery-thumb').forEach((thumb) => {
    addHover(thumb,
      () => { hoverTo(thumb, { y: -3 }) },
      () => { hoverTo(thumb, { y: 0 }) }
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
        hoverTo(frame, { y: -4, boxShadow: '0 14px 32px rgba(24,24,24,0.1)' })
        hoverTo(img, { scale: 1.06, duration: NORMAL })
      },
      () => {
        hoverTo(frame, { y: 0, boxShadow: '0 0 0 rgba(24,24,24,0)' })
        hoverTo(img, { scale: 1, duration: NORMAL })
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
        hoverTo(container, { y: -4 })
        hoverTo(img, { scale: 1.04, duration: NORMAL })
      },
      () => {
        hoverTo(container, { y: 0 })
        hoverTo(img, { scale: 1, duration: NORMAL })
      }
    )
  })
}

function setupButtons(root: HTMLElement) {
  root.querySelectorAll('.button').forEach((btn) => {
    addHover(btn,
      () => { hoverTo(btn, { y: -2 }) },
      () => { hoverTo(btn, { y: 0 }) }
    )
  })
}

function setupCategoryLinks(root: HTMLElement) {
  root.querySelectorAll('.category-list a').forEach((link) => {
    addHover(link,
      () => {
        hoverTo(link, { paddingLeft: 10, color: '#58624a' })
        hoverTo(link.querySelector('span:last-child'), { x: 4, rotation: -4 })
      },
      () => {
        hoverTo(link, { paddingLeft: 4, color: '' })
        hoverTo(link.querySelector('span:last-child'), { x: 0, rotation: 0 })
      }
    )
  })
}

function setupImageHotspots(root: HTMLElement) {
  root.querySelectorAll('.image-hotspot').forEach((hotspot) => {
    addHover(hotspot,
      () => {
        hoverTo(hotspot, { scale: 1.12, backgroundColor: '#58624a' })
      },
      () => {
        hoverTo(hotspot, { scale: 1, backgroundColor: '' })
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
        hoverTo(figure, { y: -4 })
        hoverTo(img, { scale: 1.06, duration: NORMAL })
      },
      () => {
        hoverTo(figure, { y: 0 })
        hoverTo(img, { scale: 1, duration: NORMAL })
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
