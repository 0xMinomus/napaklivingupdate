import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/gsap'

const EASE = 'power2.out'

export function useHeroAnimation() {
  useGSAP(() => {
    const hero = document.querySelector('.hero-bg')
    if (!hero) return

    const eyebrow = hero.querySelector('.eyebrow')
    const title = hero.querySelector('.display-title')
    const lead = hero.querySelector('.hero-lead')
    const shopLink = hero.querySelector('.shop-link')

    const elements = [eyebrow, title, lead, shopLink].filter(Boolean)

    gsap.set(elements, { opacity: 0, y: 24 })

    gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: EASE,
      stagger: 0.12,
      delay: 0.2,
    })
  })
}
