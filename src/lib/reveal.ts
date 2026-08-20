import { useEffect, useRef } from 'react'

export function useRevealOnScroll<T extends HTMLElement>(threshold = 0.1) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.classList.contains('revealed')) return

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('revealed')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('revealed')
            io.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return ref
}