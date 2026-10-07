import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/gsap'

export function useHeroAnimation() {
  const heroRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const hero = heroRef.current
    if (!hero) return
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lines = hero.querySelectorAll('.hero-title-text')
      const supporting = hero.querySelectorAll('.hero-lead, .shop-link')
      const cue = hero.querySelector('.hero-scroll')
      const stroke = hero.querySelector('.hero-scroll-line')
      const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })

      intro.fromTo(lines, { yPercent: 115, rotation: 2 }, {
        yPercent: 0, rotation: 0, duration: 1, stagger: 0.14, clearProps: 'transform',
      }, 0)
        .from(supporting, { opacity: 0, y: 12, duration: 0.5, stagger: 0.08, clearProps: 'opacity,transform' }, 0.5)
      if (cue) intro.from(cue, { opacity: 0, duration: 0.4, clearProps: 'opacity' }, 0.8)
      if (stroke) intro.from(stroke, { scaleY: 0, transformOrigin: 'top center', duration: 0.6, clearProps: 'transform,transformOrigin' }, 0.8)

      const onFocus = () => intro.progress(1)
      hero.addEventListener('focusin', onFocus)
      return () => hero.removeEventListener('focusin', onFocus)
    }, hero)

    return () => media.revert()
  }, { scope: heroRef })

  return heroRef
}
