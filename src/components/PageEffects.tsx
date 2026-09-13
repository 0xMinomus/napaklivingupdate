import type { ReactElement } from 'react'
import { Outlet } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useCardHover } from '../hooks/useCardHover'
import { useImageReveal } from '../hooks/useImageReveal'

export default function PageEffects(): ReactElement {
  const revealRef = useScrollReveal()
  const hoverRef = useCardHover()
  const imageRef = useImageReveal()

  return (
    <div ref={revealRef}>
      <div ref={hoverRef}>
        <div ref={imageRef}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
