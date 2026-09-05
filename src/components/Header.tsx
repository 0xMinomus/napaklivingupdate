import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'

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

export default function Header({ overlay = false }: HeaderProps): ReactElement {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (to: string): boolean => {
    if (to === '/collections') {
      return location.pathname === '/collections' || location.pathname.startsWith('/collection')
    }
    return location.pathname === to
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = (): void => setMenuOpen(false)
  const toggleMenu = (): void => setMenuOpen((v) => !v)

  return (
    <>
      <header className={overlay ? 'site-header site-header--overlay' : 'site-header'}>
        <div className="container header-inner">
          <Link className="brand" to="/" aria-label="Napak Living home">
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
            className="mobile-menu-toggle"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={toggleMenu}
          >
            <span className="menu-icon" aria-hidden="true"></span>
          </button>
        </div>
      </header>

      {menuOpen &&
        createPortal(
          <div className="mobile-menu-overlay" role="dialog" aria-modal="true" aria-label="Menu">
            <button className="mobile-menu-close" aria-label="Close menu" onClick={closeMenu}>
              <span className="menu-icon" aria-hidden="true"></span>
            </button>
            <nav aria-label="Mobile navigation" onClick={closeMenu}>
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={isActive(item.to) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                aria-current={location.pathname === '/contact' ? 'page' : undefined}
              >
                Contact
              </Link>
            </nav>
          </div>,
          document.body
        )}
    </>
  )
}