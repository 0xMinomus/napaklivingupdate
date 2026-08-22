import { useRef } from 'react'
import type { ReactElement } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import ScrollToTop from './ScrollToTop'
import ScrollAnimations from './ScrollAnimations'

export default function Layout(): ReactElement {
  const location = useLocation()
  const routeScope = useRef<HTMLDivElement>(null)
  const overlay = location.pathname === '/'
  const routeKey = `${location.pathname}${location.search}`

  return (
    <div className="site-shell">
      <ScrollToTop />
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header overlay={overlay} />
      <div className="route-view" key={routeKey} ref={routeScope}>
        <Outlet />
      </div>
      <ScrollAnimations scope={routeScope} routeKey={routeKey} />
    </div>
  )
}
