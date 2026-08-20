import type { ReactElement } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import ScrollToTop from './ScrollToTop'

export default function Layout(): ReactElement {
  const { pathname } = useLocation()
  const overlay = pathname === '/'

  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header overlay={overlay} />
      <Outlet />
    </>
  )
}