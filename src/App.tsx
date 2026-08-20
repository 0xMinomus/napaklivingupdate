import { lazy, Suspense } from 'react'
import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

const About = lazy(() => import('./pages/About'))
const Business = lazy(() => import('./pages/Business'))
const Catalog = lazy(() => import('./pages/Catalog'))
const Collections = lazy(() => import('./pages/Collections'))
const CollectionDetail = lazy(() => import('./pages/CollectionDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const Lookbook = lazy(() => import('./pages/Lookbook'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const ThankYou = lazy(() => import('./pages/ThankYou'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App(): ReactElement {
  return (
    <Suspense fallback={<div className="route-loading" aria-hidden="true" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/business" element={<Business />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collection" element={<Navigate to="/collections" replace />} />
          <Route path="/collection/:slug" element={<CollectionDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/product" element={<Navigate to="/catalog" replace />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}