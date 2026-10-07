import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/gsap'

const NAV = [
  { to: '/catalog', label: 'Shop' },
  { to: '/collections', label: 'Collections' },
  { to: '/lookbook', label: 'Lookbook' },
  { to: '/about', label: 'Our story' },
  { to: '/business', label: 'Trade' },
]

interface HeaderProps {
  overlay?: boolean
}

interface MobileMenuProps {
  open: boolean
  isActive: (to: string) => boolean
  onClose: () => void
  onExited: () => void
  returnFocus: () => void
}

function MobileMenu({ open, isActive, onClose, onExited, returnFocus }: MobileMenuProps): ReactElement {
  const menuRef = useRef<HTMLDivElement>(null)
  const openRef = useRef(open)
  const updateMotion = useRef<((nextOpen: boolean) => void) | null>(null)
  openRef.current = open

  useGSAP(() => {
    const menu = menuRef.current
    if (!menu) return
    const links = menu.querySelectorAll('nav a')
    const media = gsap.matchMedia()

    media.add({
      always: '(min-width: 0px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const finish = context.add('finish', () => {
        if (!openRef.current) onExited()
      }) as () => void
      if (context.conditions?.reduceMotion) {
        gsap.set(menu, { opacity: 1 })
        gsap.set(links, { opacity: 1, y: 0 })
        updateMotion.current = context.add('updateMotion', (nextOpen: boolean) => {
          if (!nextOpen) finish()
        }) as (nextOpen: boolean) => void
        if (!openRef.current) finish()
      } else {
        const timeline = gsap.timeline({ paused: true, onReverseComplete: finish })
          .fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.18, ease: 'power1.out' }, 0)
          .fromTo(links, { opacity: 0.4, y: 8 }, {
            opacity: 1,
            y: 0,
            duration: 0.18,
            stagger: 0.016,
            ease: 'power2.out',
          }, 0.015)
        updateMotion.current = context.add('updateMotion', (nextOpen: boolean) => {
          if (nextOpen) timeline.play()
          else if (timeline.time() === 0) finish()
          else timeline.reverse()
        }) as (nextOpen: boolean) => void
        if (openRef.current) timeline.play()
        else finish()
      }
      return () => {
        updateMotion.current = null
      }
    }, menuRef)

    return () => media.revert()
  }, { scope: menuRef })

  useEffect(() => {
    updateMotion.current?.(open)
  }, [open])

  useEffect(() => {
    const menu = menuRef.current
    if (!open || !menu) return
    const bodyStyle = document.body.style
    const overflow = bodyStyle.getPropertyValue('overflow')
    const priority = bodyStyle.getPropertyPriority('overflow')
    bodyStyle.setProperty('overflow', 'hidden')
    const focusable = Array.from(menu.querySelectorAll<HTMLElement>('button, a[href]'))
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus({ preventScroll: true })

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'Tab') {
        const focused = document.activeElement
        if (event.shiftKey && (focused === first || !menu.contains(focused))) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && (focused === last || !menu.contains(focused))) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    const onFocus = (event: FocusEvent): void => {
      if (!menu.contains(event.target as Node)) first?.focus({ preventScroll: true })
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocus)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocus)
      if (overflow) bodyStyle.setProperty('overflow', overflow, priority)
      else bodyStyle.removeProperty('overflow')
      returnFocus()
    }
  }, [open, onClose, returnFocus])

  return (
    <div
      ref={menuRef}
      id="mobile-navigation"
      className="mobile-menu-overlay"
      role="dialog"
      aria-modal={open ? true : undefined}
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      style={{ pointerEvents: open ? 'auto' : 'none' }}
    >
      <button type="button" className="mobile-menu-close" aria-label="Close menu" onClick={onClose}>
        <span className="menu-icon" aria-hidden="true"></span>
      </button>
      <nav aria-label="Mobile navigation">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            aria-current={isActive(item.to) ? 'page' : undefined}
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
        <Link to="/contact" aria-current={isActive('/contact') ? 'page' : undefined} onClick={onClose}>
          Contact
        </Link>
      </nav>
    </div>
  )
}

export default function Header({ overlay = false }: HeaderProps): ReactElement {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)
  const menuOpenRef = useRef(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const brandRef = useRef<HTMLAnchorElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (to: string): boolean => {
    if (to === '/collections') {
      return location.pathname === '/collections' || location.pathname.startsWith('/collection')
    }
    return location.pathname === to
  }

  const closeMenu = useCallback((): void => {
    menuOpenRef.current = false
    setMenuOpen(false)
  }, [])

  const dismissMenu = useCallback((): void => {
    closeMenu()
    setMenuMounted(false)
  }, [closeMenu])

  const finishExit = useCallback((): void => {
    if (!menuOpenRef.current) setMenuMounted(false)
  }, [])

  const returnFocus = useCallback((): void => {
    const target = toggleRef.current?.getClientRects().length ? toggleRef.current : brandRef.current
    target?.focus({ preventScroll: true })
  }, [])

  useEffect(dismissMenu, [location.key, dismissMenu])

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 680px)')
    const onChange = (): void => {
      if (!mobile.matches) dismissMenu()
    }
    onChange()
    mobile.addEventListener('change', onChange)
    return () => mobile.removeEventListener('change', onChange)
  }, [dismissMenu])

  const toggleMenu = (): void => {
    if (menuOpenRef.current) {
      closeMenu()
    } else if (window.matchMedia('(max-width: 680px)').matches) {
      menuOpenRef.current = true
      setMenuMounted(true)
      setMenuOpen(true)
    }
  }

  return (
    <>
      <header
        className={`site-header${overlay ? ' site-header--overlay' : ''}${scrolled ? ' site-header--scrolled' : ''}`}
      >
        <div className="container header-inner">
          <Link
            ref={brandRef}
            className="brand"
            to="/"
            aria-label="Napak Living home"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src="/logo-hitam.png" alt="Napak Living" width="6023" height="1457" />
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} aria-current={isActive(item.to) ? 'page' : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            className="header-contact"
            to="/contact"
            aria-current={location.pathname === '/contact' ? 'page' : undefined}
          >
            Contact us <span aria-hidden="true">↗</span>
          </Link>

          <button
            ref={toggleRef}
            type="button"
            className="mobile-menu-toggle"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-controls={menuMounted ? 'mobile-navigation' : undefined}
            onClick={toggleMenu}
          >
            <span className="menu-icon" aria-hidden="true"></span>
          </button>
        </div>
      </header>

      {menuMounted &&
        createPortal(
          <MobileMenu
            open={menuOpen}
            isActive={isActive}
            onClose={closeMenu}
            onExited={finishExit}
            returnFocus={returnFocus}
          />,
          document.body
        )}
    </>
  )
}