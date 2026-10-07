import type { ReactElement } from 'react'
import { Outlet } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function PageEffects(): ReactElement {
  const revealRef = useScrollReveal()

  return (
    <div ref={revealRef}>
      <Outlet />
    </div>
  )
}
