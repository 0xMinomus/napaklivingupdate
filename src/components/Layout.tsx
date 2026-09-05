import type { ReactElement } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import ScrollToTop from './ScrollToTop'
import PageEffects from './PageEffects'

export default function Layout(): ReactElement {
  const { pathname } = useLocation()

  return (
    <>
      <ScrollToTop />
      <Header />
      <PageEffects key={pathname} />
    </>
  )
}
