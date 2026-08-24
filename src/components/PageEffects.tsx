import type { ReactElement } from 'react'
import { Outlet } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useCardHover } from '../hooks/useCardHover'
import { useImageReveal } from '../hooks/useImageReveal'
import { useTilt } from '../hooks/useTilt'

export default function PageEffects(): ReactElement {
  const revealRef = useScrollReveal()
  const hoverRef = useCardHover()
  const imageRef = useImageReveal()
  const tiltRef = useTilt()

  return (
    <div ref={revealRef}>
      <div ref={hoverRef}>
        <div ref={imageRef}>
          <div ref={tiltRef}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
