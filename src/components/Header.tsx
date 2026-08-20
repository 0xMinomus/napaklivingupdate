import { useRef } from 'react'
import type { ReactElement } from 'react'
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
  const menuRef = useRef<HTMLDetailsElement>(null)

  const isActive = (to: string): boolean => {
    if (to === '/collections') {
      return location.pathname === '/collections' || location.pathname.startsWith('/collection')
    }
    return location.pathname === to
  }

  const closeMenu = (): void => {
    if (menuRef.current) menuRef.current.removeAttribute('open')
  }

  return (
    <header className={overlay ? 'site-header site-header--overlay' : 'site-header'}>
      <div className="container header-inner">
        <Link className="brand" to="/" aria-label="Napak Living home">
          <span className="brand-mark" aria-hidden="true"></span>
          <span>napak living</span>
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

        <details className="mobile-menu" ref={menuRef}>
          <summary aria-label="Open menu">
            <span className="menu-icon" aria-hidden="true"></span>
          </summary>
          <nav aria-label="Mobile navigation" onClick={closeMenu}>
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} aria-current={isActive(item.to) ? 'page' : undefined}>
                {item.label}
              </Link>
            ))}
            <Link to="/contact" aria-current={location.pathname === '/contact' ? 'page' : undefined}>
              Contact
            </Link>
          </nav>
        </details>
      </div>
    </header>
  )
}