import type { ReactElement } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import ScrollToTop from './ScrollToTop'
import PageEffects from './PageEffects'

export default function Layout(): ReactElement {
  const { pathname } = useLocation()
  const overlay = pathname === '/'

  return (
    <>
      <ScrollToTop />
      <Header overlay={overlay} />
      <PageEffects key={pathname} />
    </>
  )
}
