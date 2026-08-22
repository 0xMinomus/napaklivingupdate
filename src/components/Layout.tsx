import { useRef } from 'react'
import type { ReactElement } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import ScrollToTop from './ScrollToTop'
import ScrollAnimations from './ScrollAnimations'

export default function Layout(): ReactElement {
  const location = useLocation()
  const scope = useRef<HTMLDivElement>(null)
  const overlay = location.pathname === '/'

  return (
    <div className="site-shell" ref={scope}>
      <ScrollToTop />
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header overlay={overlay} />
      <Outlet />
      <ScrollAnimations scope={scope} routeKey={`${location.pathname}${location.search}`} />
    </div>
  )
}
